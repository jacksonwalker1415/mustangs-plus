/* Live football scores and play-by-play from CollegeFootballData.com.
   Data lands in Supabase (public.live_games, public.game_plays) through the cfbd-sync edge function; the CFBD key
   stays server-side. This file only reads those tables with the public anon key from config.js.
   Football only. Adds: the live score and status on SMU football game pages, game threads and calendar ribbon cards,
   the final score where the schedule data has none yet, and the last 10 plays on the game page.
   If the tables are empty or the request fails, nothing changes and the page keeps its static content. */
(function(){
  var CFG=window.SMU_CONFIG||{},MP=window.MP||{},URL_=CFG.SUPABASE_URL,KEY=CFG.SUPABASE_ANON_KEY;
  if(!URL_||!KEY||!window.fetch||!document.querySelector)return;
  var FB=((MP.GAMES&&MP.GAMES.games)||[]).filter(function(g){return g.sport==='football'}),BY={};
  FB.forEach(function(g){BY[g.id]=g});
  if(!FB.length)return;
  var CREDIT='<p class="cf-credit">Data: <a href="https://collegefootballdata.com" target="_blank" rel="noopener">CollegeFootballData.com</a></p>';
  function calm(t){return String(t||'').replace(/\b(\d(?:ST|ND|RD|TH)|[A-Z]{4,})\b/g,function(w){return w==='NCAA'?w:w.toLowerCase()})}
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function get(path){return fetch(URL_+'/rest/v1/'+path,{headers:{apikey:KEY,Authorization:'Bearer '+KEY},cache:'no-store'})
    .then(function(r){if(!r.ok)throw r.status;return r.json()})}
  function ctDay(iso){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(iso))}catch(e){return String(iso).slice(0,10)}}
  /* CFBD game for a site game: same calendar day (Central; UTC for times still TBA) */
  var ROWS={};
  function rowFor(g){return g&&ROWS[g.d]||null}
  function index(list){ROWS={};list.forEach(function(r){if(!r.start_date)return;ROWS[r.start_time_tbd?String(r.start_date).slice(0,10):ctDay(r.start_date)]=r})}
  function smuHome(r){return r.home_team==='SMU'}
  function pts(r){var h=smuHome(r);return {us:h?r.home_points:r.away_points,them:h?r.away_points:r.home_points}}
  function per(p){p=+p;if(!p)return '';return p<=4?['1st','2nd','3rd','4th'][p-1]:(p===5?'OT':(p-4)+'OT')}
  function status(r){if(r.status==='final')return 'Final'+(r.period>4?' ('+per(r.period)+')':'');
    var s=[per(r.period),r.clock&&r.clock!=='0:00'?r.clock:''].filter(Boolean).join(' ');return s?'Live \u00b7 '+s:'Live'}
  function hasScore(r){var p=pts(r);return typeof p.us==='number'&&typeof p.them==='number'}
  function show(r,g){return r&&hasScore(r)&&(r.status==='in_progress'||(r.status==='final'&&!g.res))}
  function ball(r,g){var p=String(r.possession||'').toLowerCase();if(!p)return '';
    var t=p==='home'?r.home_team:p==='away'?r.away_team:r.possession;return t==='SMU'?'SMU':t===r.home_team||t===r.away_team?g.opp:''}
  function scoreBox(r,g){var p=pts(r),live=r.status==='in_progress',b=live?ball(r,g):'';
    return '<div class="score cf-score" role="group" aria-label="'+esc(status(r))+': SMU '+p.us+', '+esc(g.opp)+' '+p.them+'">'+
      '<span class="sc-t'+(p.us>=p.them?' win':'')+'"><b>SMU'+(b==='SMU'?'<i class="cf-ball" aria-label="has the ball"></i>':'')+'</b><em>'+p.us+'</em></span>'+
      '<span class="sc-f"><b class="'+(live?'cf-on':'')+'">'+esc(status(r))+'</b></span>'+
      '<span class="sc-t sc-r'+(p.them>=p.us?' win':'')+'"><em>'+p.them+'</em><b>'+(b&&b!=='SMU'?'<i class="cf-ball" aria-label="has the ball"></i>':'')+esc(g.opp)+'</b></span></div>'+
      (live&&r.situation?'<p class="cf-sit">'+esc(r.situation)+'</p>':'')}

  function css(){if(document.getElementById('cf-css'))return;var s=document.createElement('style');s.id='cf-css';s.textContent=
    '.cf-live{display:flex;flex-direction:column;gap:6px}'+
    '.cf-score .sc-f b.cf-on{color:#CC0035}'+
    '.cf-ball{display:inline-block;width:8px;height:8px;border-radius:50%;background:#CC0035;margin:0 6px;vertical-align:middle}'+
    '.cf-sit{margin:0;font-size:15px;color:var(--ink,#1a2350);text-align:center}'+
    '.cf-credit{margin:4px 0 0;font-size:13px;color:var(--ink-2,#454e72)}.cf-credit a{color:#354CA1;font-weight:600}'+
    '.cf-pbp{border-top:1px solid var(--line,#e0e4f0);padding-top:8px}'+
    '.cf-pbp summary{cursor:pointer;min-height:44px;display:flex;align-items:center;font-weight:700;color:#354CA1}'+
    '.cf-pbp ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}'+
    '.cf-pbp li{display:grid;grid-template-columns:88px 1fr;gap:12px;padding:10px 0;border-top:1px solid var(--line,#e0e4f0);font-size:15px;line-height:1.4}'+
    '.cf-pbp li small{display:block;color:var(--ink-2,#454e72);font-size:13px}'+
    '.cf-pbp li b{font-weight:700;color:var(--ink,#1a2350)}'+
    '.cf-pbp li.sc{border-left:3px solid #354CA1;padding-left:8px}'+
    '.rb-live{display:block;margin-top:6px;font-size:14px;font-weight:700;color:#354CA1}.rb-live.on{color:#CC0035}';
    document.head.appendChild(s)}

  /* game page (games/?id=fb-...) */
  function playsList(P,g,r){if(!P||!P.length)return '';var home=r.home_team;
    return '<details class="cf-pbp"'+(r.status==='in_progress'?' open':'')+'><summary>Play-by-play: last '+P.length+' plays</summary><ol>'+
      P.map(function(p){var tm=p.offense==='SMU'?'SMU':(p.offense===home||p.offense===r.away_team)?g.opp:p.offense,
          sc=typeof p.home_score==='number'?(smuHome(r)?p.home_score+'-'+p.away_score:p.away_score+'-'+p.home_score):'';
        return '<li'+(p.scoring?' class="sc"':'')+'><span><b>'+esc(per(p.period))+(p.clock?' '+esc(p.clock):'')+'</b><small>'+esc(tm||'')+(sc?' \u00b7 '+sc:'')+'</small></span>'+
          '<span>'+(p.scoring?'<b>':'')+esc(calm(p.play_text))+(p.scoring?'</b>':'')+'</span></li>'}).join('')+'</ol></details>'}
  function gamePage(){var main=document.getElementById('gamesMain');if(!main)return null;
    var id=new URLSearchParams(location.search).get('id'),g=id&&BY[id];if(!g)return null;
    return function(){var r=rowFor(g),card=main.querySelector('.gm-match');if(!r||!card)return;
      var old=card.querySelector('.cf-wrap');if(old)old.remove();
      var top=show(r,g)?scoreBox(r,g):'';
      var need=r.status!=='scheduled';
      (need?get('game_plays?select=period,clock,offense,home_score,away_score,play_text,scoring&game_id=eq.'+r.game_id+'&play_type=not.in.(%22End%20Period%22,%22End%20of%20Half%22,%22End%20of%20Game%22,%22Timeout%22,%22End%20of%20Regulation%22)&order=seq.desc&limit=10'):Promise.resolve([]))
        .then(function(P){var pl=playsList(P,g,r);if(!top&&!pl)return;
          var o=card.querySelector('.cf-wrap');if(o)o.remove();
          var w=document.createElement('div');w.className='cf-wrap cf-live';w.innerHTML=top+pl+CREDIT;
          var h=card.querySelector('.gm-h');if(top&&h){var t=h.nextSibling;h.textContent=r.status==='final'?'Result':'Live';
            if(r.status==='in_progress'){var c=card.querySelector('.gm-cd');if(c)c.hidden=true}
            card.insertBefore(w,card.querySelector('.gm-facts')||t)}
          else{var L=card.querySelector('.gm-links');card.insertBefore(w,L||null)}})
        .catch(function(){})}}

  /* game thread score box (boards/#game=fb-...) */
  function thread(){var box=document.querySelector('.gt-box');if(!box)return;
    var a=box.querySelector('a[href*="games/?id=fb-"]'),m=a&&/id=(fb-[\w-]+)/.exec(a.getAttribute('href')),g=m&&BY[m[1]];if(!g)return;
    var r=rowFor(g);if(!show(r,g))return;
    var key=r.status+r.home_points+'-'+r.away_points+r.period+r.clock;if(box.getAttribute('data-cf')===key)return;box.setAttribute('data-cf',key);
    var o=box.querySelector('.cf-wrap');if(o)o.remove();var st=box.querySelector('.gt-st');if(st)st.textContent=status(r);
    var w=document.createElement('div');w.className='cf-wrap cf-live';w.innerHTML=scoreBox(r,g)+CREDIT;
    var hd=box.querySelector('.gt-hd');if(hd&&hd.nextSibling)box.insertBefore(w,hd.nextSibling);else box.appendChild(w)}

  /* calendar ribbon cards (home) */
  function ribbon(){Array.prototype.forEach.call(document.querySelectorAll('.rb-card a.rb-main[href*="games/?id=fb-"]'),function(a){
    var m=/id=(fb-[\w-]+)/.exec(a.getAttribute('href')),g=m&&BY[m[1]],r=rowFor(g),o=a.querySelector('.rb-live');
    if(!show(r,g)){if(o)o.remove();return}var p=pts(r),txt=(r.status==='final'?'Final':'Live')+': SMU '+p.us+', '+g.opp+' '+p.them+(r.status==='in_progress'&&status(r)!=='Live'?' \u00b7 '+status(r).replace('Live \u00b7 ',''):'');
    if(o&&o.textContent===txt)return;if(o)o.remove();
    var s=document.createElement('span');s.className='rb-live'+(r.status==='in_progress'?' on':'');
    s.textContent=txt;var go=a.querySelector('.rb-go');a.insertBefore(s,go||null);
    var card=a.closest('.rb-card');if(card&&!card.querySelector('.cf-credit')){card.insertAdjacentHTML('beforeend',CREDIT.replace('cf-credit','cf-credit rb-cf'))}})}

  var page=null,timer=null,obs=null;
  function liveSoon(){var now=Date.now();for(var k in ROWS){var r=ROWS[k];if(r.status==='in_progress')return true;
    if(r.status==='scheduled'&&!r.start_time_tbd){var t=Date.parse(r.start_date);if(t-now<15*6e4&&now-t<6*36e5)return true}}return false}
  function paint(){css();if(page)page();thread();ribbon()}
  function load(){return get('live_games?select=game_id,start_date,start_time_tbd,home_team,away_team,home_points,away_points,status,period,clock,possession,situation&order=start_date')
    .then(function(L){if(!Array.isArray(L)||!L.length)return;index(L);paint();
      clearTimeout(timer);if(liveSoon())timer=setTimeout(load,60000)}).catch(function(){})}
  function start(){page=gamePage();var want=page||document.getElementById('ribbon')||document.querySelector('.gameday')||/game=fb-/.test(location.hash)||/\/boards\//.test(location.pathname);
    if(!want)return;
    /* the page renders after app.js runs; repaint when the ribbon or a thread box appears */
    load().then(function(){if(!window.MutationObserver||obs)return;var pend=0;obs=new MutationObserver(function(){if(pend)return;pend=1;
      setTimeout(function(){pend=0;if(!Object.keys(ROWS).length)return;thread();ribbon()},150)});
      obs.observe(document.body,{childList:true,subtree:true})});
    window.addEventListener('hashchange',function(){setTimeout(thread,300)})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
