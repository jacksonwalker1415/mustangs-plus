// cfbd-sync: pulls SMU football scores and play-by-play from CollegeFootballData.com into public.live_games / public.game_plays.
// The API key lives in Supabase Vault (secret "cfbd_api_key") and is read here with the service role. It is never in this repo.
// Called by pg_cron (see supabase/RUN_ME_27_cfbd_live.sql) with the Vault "cfbd_cron_token" in the x-cron-token header.
//   POST {"mode":"schedule"}  SMU's season games (scores, final line scores) + full play-by-play once per finished game
//   POST {"mode":"live"}      the SMU game in its live window: score, quarter, clock, possession, recent plays
import { createClient } from "jsr:@supabase/supabase-js@2";

const API = "https://api.collegefootballdata.com";
const TEAM = "SMU";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

let KEY = "";
let remaining: number | null = null;
let tierOk: boolean | null = null;

async function secret(name: string): Promise<string> {
  const { data, error } = await db.rpc("cfbd_secret", { p_name: name });
  if (error || !data) throw new Error("secret " + name + " unavailable");
  return data as string;
}

async function cfbd(path: string): Promise<{ status: number; body: any }> {
  const r = await fetch(API + path, { headers: { Authorization: "Bearer " + KEY, Accept: "application/json" } });
  const left = r.headers.get("x-calllimit-remaining");
  if (left !== null && !isNaN(+left)) remaining = +left;
  const body = r.status === 200 ? await r.json() : null;
  if (r.status !== 200) await r.body?.cancel();
  return { status: r.status, body };
}

function season(now = new Date()): number {
  return now.getUTCMonth() >= 1 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
}
function ints(a: unknown): number[] | null {
  return Array.isArray(a) && a.every((x) => typeof x === "number") ? (a as number[]) : null;
}
function clockStr(c: any): string | null {
  if (c == null) return null;
  if (typeof c === "string") return c;
  if (typeof c.minutes === "number") return c.minutes + ":" + String(c.seconds ?? 0).padStart(2, "0");
  return null;
}
function gameRow(g: any) {
  const done = !!g.completed, started = g.startDate && Date.parse(g.startDate) <= Date.now();
  return {
    game_id: g.id, season: g.season, week: g.week, season_type: g.seasonType, start_date: g.startDate, start_time_tbd: !!g.startTimeTBD,
    home_team: g.homeTeam, away_team: g.awayTeam, home_points: g.homePoints ?? null, away_points: g.awayPoints ?? null,
    home_line_scores: ints(g.homeLineScores), away_line_scores: ints(g.awayLineScores),
    status: done ? "final" : started && g.homePoints != null ? "in_progress" : "scheduled",
    updated_at: new Date().toISOString(),
  };
}

// full official play-by-play for a finished game (one call); replaces any live-feed rows for that game
async function loadPlays(g: { game_id: number; season: number; week: number; season_type: string }) {
  const r = await cfbd(`/plays?year=${g.season}&week=${g.week}&team=${TEAM}&seasonType=${g.season_type || "regular"}`);
  if (r.status !== 200 || !Array.isArray(r.body)) return false;
  const P = r.body.filter((p: any) => p.gameId === g.game_id && p.playText)
    .sort((a: any, b: any) => (a.driveNumber - b.driveNumber) || (a.playNumber - b.playNumber) || String(a.wallclock).localeCompare(String(b.wallclock)));
  if (!P.length) return false;
  const rows = P.map((p: any, i: number) => {
    const homeOff = p.offense === p.home;
    return {
      play_id: String(p.id), game_id: g.game_id, seq: i + 1, period: p.period, clock: clockStr(p.clock), offense: p.offense,
      home_score: homeOff ? p.offenseScore : p.defenseScore, away_score: homeOff ? p.defenseScore : p.offenseScore,
      play_type: p.playType, play_text: p.playText, yards: p.yardsGained, scoring: !!p.scoring, updated_at: new Date().toISOString(),
    };
  });
  await db.from("game_plays").delete().eq("game_id", g.game_id);
  const { error } = await db.from("game_plays").insert(rows);
  if (error) throw error;
  await db.from("live_games").update({ plays_loaded: true }).eq("game_id", g.game_id);
  return true;
}

async function runSchedule() {
  const y = season();
  const r = await cfbd(`/games?year=${y}&team=${TEAM}&seasonType=both`);
  if (r.status !== 200 || !Array.isArray(r.body)) throw new Error("games " + r.status);
  const rows = r.body.map(gameRow);
  // never let the schedule pull downgrade a live row the live poller owns
  const { data: cur } = await db.from("live_games").select("game_id,status").in("game_id", rows.map((x: any) => x.game_id));
  const live = new Set((cur || []).filter((x: any) => x.status === "in_progress").map((x: any) => x.game_id));
  const up = rows.filter((x: any) => !(live.has(x.game_id) && x.status !== "final"));
  if (up.length) { const { error } = await db.from("live_games").upsert(up); if (error) throw error; }
  const { data: need } = await db.from("live_games").select("game_id,season,week,season_type")
    .eq("status", "final").eq("plays_loaded", false).order("start_date", { ascending: false }).limit(3);
  // re-check the plan once per schedule run until Tier 2 shows up (the live poller trusts this flag)
  const st = await db.from("cfbd_sync_state").select("tier_ok").eq("id", 1).single();
  if (st.data?.tier_ok !== true) { const t = await cfbd(`/scoreboard?classification=fbs&conference=ACC`); tierOk = t.status === 200; }
  let loaded = 0;
  for (const g of need || []) if (await loadPlays(g as any)) loaded++;
  return { games: rows.length, plays_loaded: loaded };
}

async function runLive() {
  const now = Date.now();
  const { data: G } = await db.from("live_games").select("*").neq("status", "final").eq("start_time_tbd", false)
    .gte("start_date", new Date(now - 6 * 3600e3).toISOString()).lte("start_date", new Date(now + 20 * 60e3).toISOString())
    .order("start_date").limit(1);
  const g = G && G[0];
  if (!g) return { live: null };
  const st = await db.from("cfbd_sync_state").select("tier_ok").eq("id", 1).single();
  tierOk = st.data?.tier_ok ?? null;
  let row: any = null, status = "scheduled";
  if (tierOk !== false) {
    const r = await cfbd(`/scoreboard?classification=fbs&conference=ACC`);
    if (r.status === 401 || r.status === 403) tierOk = false;
    else if (r.status === 200 && Array.isArray(r.body)) {
      tierOk = true;
      const s = r.body.find((x: any) => x.id === g.game_id);
      if (s) {
        status = s.status === "completed" ? "final" : s.status === "in_progress" ? "in_progress" : "scheduled";
        row = {
          game_id: g.game_id, status, period: s.period ?? null, clock: s.clock ?? null, possession: s.possession ?? null,
          situation: s.situation ?? null, last_play: s.lastPlay ?? null,
          home_points: s.homeTeam?.points ?? null, away_points: s.awayTeam?.points ?? null,
          home_line_scores: ints(s.homeTeam?.lineScores), away_line_scores: ints(s.awayTeam?.lineScores),
          updated_at: new Date().toISOString(),
        };
      }
    }
  }
  if (!row) { // free-tier fallback: the game record itself (score + completed flag, no clock)
    const r = await cfbd(`/games?year=${g.season}&id=${g.game_id}`);
    const x = r.status === 200 && Array.isArray(r.body) ? r.body[0] : null;
    if (x) { row = gameRow(x); status = row.status; }
  }
  if (row) {
    if (row.status === "final") { row.plays_loaded = false; }
    const { error } = await db.from("live_games").update(row).eq("game_id", g.game_id); if (error) throw error;
  }
  let plays = 0;
  if (tierOk && status !== "scheduled") {
    const r = await cfbd(`/live/plays?gameId=${g.game_id}`);
    if (r.status === 200 && r.body && Array.isArray(r.body.drives)) {
      const flat: any[] = [];
      for (const d of r.body.drives) for (const p of d.plays || []) if (p.playText) flat.push({ p, off: d.offense });
      const rows = flat.map(({ p, off }, i) => ({
        play_id: String(p.id), game_id: g.game_id, seq: i + 1, period: p.period, clock: p.clock ?? null, offense: p.team || off,
        home_score: p.homeScore, away_score: p.awayScore, play_type: p.playType, play_text: p.playText, yards: p.yardsGained,
        scoring: /touchdown|field goal good|safety/i.test(p.playType || ""), updated_at: new Date().toISOString(),
      })).slice(-40);
      if (rows.length) {
        await db.from("game_plays").delete().eq("game_id", g.game_id);
        const { error } = await db.from("game_plays").insert(rows); if (error) throw error;
        plays = rows.length;
      }
    }
  }
  return { live: g.game_id, status, plays };
}

Deno.serve(async (req) => {
  let mode = "schedule", err: string | null = null, out: any = null;
  try {
    const tok = await secret("cfbd_cron_token");
    if (!tok || req.headers.get("x-cron-token") !== tok) return new Response("forbidden", { status: 403 }); // no stored token = reject everything
    try { mode = (await req.json()).mode || "schedule"; } catch { /* default */ }
    KEY = await secret("cfbd_api_key");
    out = mode === "live" ? await runLive() : await runSchedule();
  } catch (e) { err = String((e as Error)?.message || e).slice(0, 300); }
  const patch: any = { last_mode: mode, last_run: new Date().toISOString(), last_error: err };
  if (remaining !== null) patch.calls_remaining = remaining;
  if (tierOk !== null) patch.tier_ok = tierOk;
  await db.from("cfbd_sync_state").update(patch).eq("id", 1);
  return new Response(JSON.stringify({ ok: !err, mode, out, error: err, calls_remaining: remaining, tier_ok: tierOk }), {
    status: err ? 500 : 200, headers: { "Content-Type": "application/json" },
  });
});
