#!/usr/bin/env python3
"""Shared sports-only title filter for video and podcast refresh.

Jackson, Nov 13, 2026: an item stays only when the title has a clear athletics
signal (a sport, the Mustangs, a game, a coach or player role, recruiting, etc.).
Business, corporate, alumni and general-news headlines are dropped unless they
are also clearly about athletics (e.g. "Former SMU coach June Jones dies at 73"
stays; "Nvidia names SMU graduate as interim CEO" does not).

"SMU" or "homecoming" alone is not enough: campus and alumni news often uses both.
Broader outlets (local TV, radio, and news or conference shows) must have an
athletics signal in the title. Official sports channels already are athletics
media, so a thin title there is kept unless it is business or general news
without an athletics signal.

Used by tools/fetch_youtube.py and tools/fetch_podcasts.py. Run this file
directly to check the built-in cases.
"""
import re

# Clear athletics signals. Generic verbs like "win" are left out so a headline
# such as "SMU graduate wins CEO award" cannot pass as sports.
SPORTS = re.compile(
    r"(?i)(?:"
    r"\bcoach\w*|\bhead coach|\bHCs?\b|"
    r"\bfootball\b|\bcfb\b|\bbasketball\b|\bhoops\b|\bbball\b|\bsoccer\b|\bvolleyball\b|"
    r"\bbaseball\b|\bsoftball\b|\bgolf\b|\btennis\b|\bswim\w*|\bdiving\b|\browing\b|"
    r"\btrack\b|\bcross country\b|\bequestrian\b|\bcheer\w*|"
    r"\bathlet\w*|\bsports?\b|"
    r"\bplayers?\b|\bteammates?\b|\bquarterbacks?\b|\bQBs?\b|\brunning backs?\b|"
    r"\bwide receivers?\b|\blinebackers?\b|\bcornerbacks?\b|"
    r"\bgames?\b|\bpostgame\b|\bpregame\b|\bhalftime\b|\bkickoffs?\b|\bseason\b|\bteams?\b|"
    r"\bACC\b|\bNCAA\b|\bbowls?\b|\bstadium\b|"
    r"\brecruit\w*|\btransfers?\b|\bNIL\b|"
    r"\bMustangs?\b|\bPonies\b|\bPony Express\b|"
    r"\bLashlee\b|\bJennings\b|"
    r"\bvs\.|\bvs\b|\bversus\b|\bpreviews?\b|\brecaps?\b|\bhighlights?\b|\bpress conference\b|"
    r"\btouchdowns?\b|\bfield goals?\b|"
    r"\bCFP\b|\bplayoffs?\b|\branked\b|\bchampionship\b|"
    r"\bhomecoming game\b"
    r")"
)

# Business, corporate, alumni-in-business, tragedy, crime, campus news.
# A match is kept only when SPORTS also matches.
NEWS = re.compile(
    r"(?i)(?:"
    r"\bkilled\b|\bkills?\b|\bdies\b|\bdied\b|\bdeath\b|\bdeaths\b|\bdead\b|"
    r"\bcrash(?:es|ed)?\b|\bobituar\w*|\bmemorial\b|\bfuneral\b|\bvigil\b|\bmourn\w*|"
    r"\bremember(?:s|ed)?\b|\bshooting\b|\bmurder\w*|\bhomicide\b|\bstabb\w*|"
    r"\barrest\w*|\bcharged\b|\bwreck\b|"
    r"\bmissing\b|\bdisappear\w*|\bsearch(?:es|ed|ing)? for\b|"
    r"\bprofessor\b|\bfaculty\b|\bpolice\b|\blawsuit\b|\bhiking\b|\btrail\b|"
    r"\bCEOs?\b|\bresigns?\b|\bresignation\b|\bcompany\b|\bcompanies\b|"
    r"\bstock\b|\bshareholder\w*|\bNasdaq\b|\bearnings\b|\bIPO\b|"
    r"\bNvidia\b|\bJensen Huang\b|\bcorporate\b|\bscandal\b|"
    r"\balumni\b|\balumnus\b|\balumnae?\b|"
    r"\bSMU graduate\b|\bSMU alum\w*|\bSMU grads?\b|"
    r"\binterim CEO\b"
    r")"
)


# Weaker game-context words (a "win", "Week 11"). These satisfy the sports-required
# rule on broader outlets, but they cannot override a business or news headline
# ("SMU graduate wins CEO award" still drops).
GAME = re.compile(
    r"(?i)(?:\bWeek\s+\d+\b|\bwin\b|\bwins\b|\bwon\b|\bloss(?:es)?\b|"
    r"\blose\b|\blost\b|\bbeat\w*|\bdefeat\w*|\b\d{1,3}-\d{1,3}\b)"
)


def is_sports(title):
    return bool(SPORTS.search(title or ""))


def is_game_context(title):
    return bool(GAME.search(title or ""))


def is_news(title):
    return bool(NEWS.search(title or ""))


def reject(title, require_sports=False):
    """True if this title should stay off the site."""
    t = title or ""
    if is_news(t) and not is_sports(t):
        return True
    if require_sports and not (is_sports(t) or is_game_context(t)):
        return True
    return False


# title, require_sports, should_reject
CASES = [
    ("Nvidia names SMU graduate as interim CEO following resignation of Jensen Huang - School reaction", True, True),
    ("Nvidia CEO Jensen Huang resigns amid scandal, SMU alum takes over", True, True),
    ("Former SMU coach June Jones dies at 73", True, False),
    ("SMU Men's Basketball Starts 3-0 🔥 Coach Andy Enfield Joins | Ultimate Dallas Sports Show", True, False),
    ("SMU Homecoming Weekend - the university is inviting all of Dallas to show off some hometown pride!", True, True),
    ("SMU invites North Texans to join homecoming celebrations as university strengthens community ties", True, True),
    ("Ranked SMU Mustangs gear up for ACC homecoming game", True, False),
    ("Friends, family remember recent SMU grads killed in crash", True, True),
    ("SMU community celebrates lives of young couple killed in Dallas crash", True, True),
    ("DMN Morning Debrief: Family and community members continue to honor and search for SMU professor Charles Hosch, who disappeared while hiking the Appalachian Trail.", True, True),
    ("DMN Morning Debrief: SMU's win over Cal showed Mustangs' depth at running back, for now and years to come", True, False),
    ("The Virginia Tech Mini-Movie | SMU Football", False, False),
    ("SMU vs Southern", False, False),
    ("Dallas Born, Mustang Made: The William Nettles Story", False, False),
    ("Huang Finishes Top-10 At ACU Intercollegiate", False, False),
    ("SMU Hall Of Fame: Three Phone Calls And A Signature Sent Gitta Jensen To SMU", False, False),
    ("Clemson, Louisville, SMU aim for STATEMENT wins in Week 1 | Tosh Lupoi, James Franklin eras begin", True, False),
    ("SMU’s Gritty FSU Win and Dabo Swinney’s Growing Clemson Crisis", True, False),
    ("SMU graduate wins CEO award", True, True),
    ("Nvidia names SMU graduate as interim CEO following resignation of Jensen Huang - School reaction", False, True),
]


def _self_test():
    failed = 0
    for title, broad, want in CASES:
        got = reject(title, require_sports=broad)
        if got != want:
            print(f"FAIL require_sports={broad} reject={got} want={want}: {title}")
            failed += 1
    if failed:
        raise SystemExit(f"{failed} case(s) failed")
    print(f"{len(CASES)} cases passed")


if __name__ == "__main__":
    _self_test()
