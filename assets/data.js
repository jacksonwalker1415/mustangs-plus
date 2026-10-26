/* SMU+ concept data. Board users, posts, prices, fund figures and the sample roster names in this file are fictional.
   Real data lives elsewhere: football schedule in content.js, football profiles in athletes.js, and the other 11 programs' schedules, rosters and coaches in real.js (all sourced from smumustangs.com). */
window.MP = window.MP || {};
/* Feature flags. recruiting:false hides every recruiting surface (nav, recruiting/ page, Recruiting Trail board, recruiting/portal cards,
   sitemap entry) without deleting any code or data. Set it to true to bring recruiting back. build_pages.py reads this line too. */
MP.FEATURES = MP.FEATURES || {};
/* Contact for data-removal and privacy requests. ONE constant: put the address in email when it exists; until then the site shows the placeholder text. */
/* Membership tier display names. Keys stay stable (DB + code use them); change a label here only. */
MP.TIER_LABELS = {free:'Free', mustang:'Fan', pony:'Plus', club:'Founder', student:'Student'};  /* Set C (Jackson, Oct 26). DB keys mustang/pony/club stay; only these labels changed */  /* student = the free Student plan (RUN_ME_16), not a paid tier */
MP.CONTACT = MP.CONTACT || {email:'smuplusmedia@gmail.com'};
if (MP.FEATURES.recruiting == null) MP.FEATURES.recruiting = false;
/* avatars: member profile photos on the live site. On since supabase/RUN_ME_15_avatars.sql was applied (profiles.avatar_url and the
   'avatars' storage bucket exist). Set false to hide uploads and photos again (initials only); nothing is deleted. Demo mode always has photos (saved in the browser). */
if (MP.FEATURES.avatars == null) MP.FEATURES.avatars = true;
/* students: the free Student sign-up (SMU email only; no student ID since RUN_ME_17) on the live site. On since supabase/RUN_ME_16_students.sql was applied (Oct 26, 2026)
   (student_verifications table, 'student' tier, claim_student_membership RPC); while false the live site shows no student option and never calls them.
   Demo mode always has the full student flow (saved in this browser). */
if (MP.FEATURES.students == null) MP.FEATURES.students = true;
/* Members gating (locks, blurs, 'Members only' gates, member preview switch). false = everyone sees the full member experience.
   Code stays in app.js; set to true to bring the gates and the preview switch back. */
if (MP.FEATURES.gating == null) MP.FEATURES.gating = false;
// Student check-in spot on game-day pages (games/). Engagement features are on hold, so it stays off.
if (MP.FEATURES.checkin == null) MP.FEATURES.checkin = false;

MP.SPORTS = [
  {slug:'football',name:'Football',season:'Fall',g:'M',record:'6-1',conf:'4-1 ACC',coach:'Coach Rhett Lashlee',fund:412300,pos:['QB','RB','WR','WR','TE','OL','OL','DL','DL','LB','CB','S','K'],num:[1,99],ht:[69,78],
   blurb:'Ford Stadium under the lights, the Boulevard before kickoff and an ACC season where every snap counts.'},
  {slug:'mens-basketball',name:"Men's Basketball",season:'Winter',g:'M',record:'0-0',conf:'Opens Nov. 2',coach:'Coach Andy Enfield',fund:228900,pos:['PG','SG','SG','SF','SF','PF','PF','C'],num:[0,35],ht:[73,85],
   blurb:'Moody Coliseum, the student section on its feet, and ACC nights from November to March.'},
  {slug:'womens-basketball',name:"Women's Basketball",season:'Winter',g:'W',record:'0-0',conf:'Opens Nov. 3',coach:'Coach Adia Barnes',fund:151200,pos:['PG','G','G','F','F','F','C'],num:[0,35],ht:[66,77],
   blurb:'Moody Coliseum, early mornings in the gym and every possession that decides a close one.'},
  {slug:'womens-soccer',name:"Women's Soccer",season:'Fall',g:'W',record:'6-6-4',conf:'1-5-2 ACC',coach:'Coach Nicole Nelson',fund:98400,pos:['GK','D','D','D','M','M','M','F','F'],num:[1,30],ht:[62,72],
   blurb:'Washburne under the lights and an ACC schedule that gives nothing away.'},
  {slug:'mens-soccer',name:"Men's Soccer",season:'Fall',g:'M',record:'12-0-2',conf:'6-0-1 ACC',coach:'Coach Kevin Hudson',fund:87600,pos:['GK','D','D','D','M','M','M','F','F'],num:[1,30],ht:[67,76],
   blurb:'Friday nights at Washburne and a back line that takes every goal against personally.'},
  {slug:'volleyball',name:'Volleyball',season:'Fall',g:'W',record:'16-4',conf:'8-2 ACC',coach:'Coach Sam Erger',fund:93100,pos:['OH','OH','MB','MB','S','L','OPP','DS'],num:[1,25],ht:[65,77],
   blurb:'Match night at Moody: every kill, every dig, every timeout huddle.'},
  {slug:'swimming-diving',name:'Swimming & Diving',season:'Winter',g:'X',record:'M 3-1 · W 2-2',conf:'Dual meets',coach:'Coaches Greg Rhodenbaugh & Ozzie Quevedo',fund:52300,pos:['Freestyle','Backstroke','Breaststroke','Butterfly','IM','Distance','Diving'],
   blurb:'Lane lines at 5 a.m., dual meets in the fall and a championship season in Greensboro and Austin.'},
  {slug:'golf',name:'Golf',season:'Fall/Spring',g:'X',record:'W: 4 top-6 finishes',conf:'Fall season',coach:'Coaches Chris Parra & Lauren Mason',fund:41800,pos:['Golfer'],
   blurb:'Dawn practice rounds, three-day weeks on the road and a spring with an NCAA Regional in Dallas.'},
  {slug:'tennis',name:'Tennis',season:'Spring',g:'X',record:'Fall invites',conf:'Duals in spring',coach:'Coaches Grant Chen & Kelcy McKenna',fund:39500,pos:['Singles','Singles','Doubles','Singles/Doubles'],
   blurb:'Fall invitationals, then a dual season where one tiebreak swings a whole afternoon.'},
  {slug:'track-field',name:'Track & Field / XC',season:'Year-round',g:'W',record:'XC: 2 team wins',conf:'ACCs Oct. 30',coach:'Coach A Havahla Haynes',fund:46200,pos:['Sprints','Distance','Hurdles','Jumps','Throws','Mid-distance'],
   blurb:'Cross country in the fall, the track in winter and spring, and long runs on the Katy Trail.'},
  {slug:'rowing',name:'Rowing',season:'Fall/Spring',g:'W',record:'Head races',conf:'Spring sprints',coach:'Coach Chase Graham',fund:22900,pos:['Stroke','Bow','Port','Starboard','Coxswain'],
   blurb:'Dawn on White Rock Lake. Erg tests, seat races and race day.'},
  {slug:'equestrian',name:'Equestrian',season:'Fall/Spring',g:'W',record:'1-2',conf:'Fall slate',coach:'Coach Brad Kearns',fund:27400,pos:['Hunt Seat','Hunt Seat','Western','Western'],
   blurb:'Riders, horses and the barn crew behind every point at the Dallas Equestrian Center.'}
];

MP.TOWNS = ['Dallas, TX','Houston, TX','Austin, TX','Plano, TX','Frisco, TX','San Antonio, TX','Fort Worth, TX','McKinney, TX','Katy, TX','Tulsa, OK','Shreveport, LA','Atlanta, GA','Phoenix, AZ','Denver, CO','Nashville, TN','Miami, FL','San Diego, CA','Chicago, IL','Melbourne, Australia','Stockholm, Sweden','Madrid, Spain','Toronto, Canada'];
MP.CLASSES = ['Fr.','R-Fr.','So.','Jr.','Sr.','Gr.'];

/* Message board (fictional users and posts) */
MP.FORUMS = [
  {id:'paddock',name:'The Paddock',desc:'Members board for longer takes and analysis.',prem:true,threads:1284,posts:48211},
  {id:'hilltop',name:'Main board',desc:'The main board of The Expressway, free for every Mustang fan. Game talk, takes and hype.',prem:false,threads:3907,posts:122640},
  {id:'recruiting',name:'Recruiting Trail',desc:'Visits, offers and commitments across every sport.',prem:true,threads:612,posts:20975},
  {id:'boulevard',name:'The Boulevard',desc:'Off-topic, tailgates, Dallas eats and everything else.',prem:false,threads:1450,posts:30318}
];
MP.USERS = {
  staff:{n:'SMU+ Boards',tier:'Board account',staff:true,since:'2024',posts:'6,102'},
  pete:{n:'PonyUpPete',tier:'Founder',since:'2025',posts:'4,388'},
  hank:{n:'HillcrestHank',tier:'Plus',since:'2025',posts:'2,911'},
  belle:{n:'BoulevardBelle',tier:'Founder',since:'2025',posts:'1,764'},
  mike:{n:'MustangMike88',tier:'Fan',since:'2026',posts:'812'},
  ray:{n:'RedAndBlueRay',tier:'Plus',since:'2025',posts:'3,040'},
  grace:{n:'GameDayGrace',tier:'Plus',since:'2026',posts:'655'},
  cox:{n:'CoxGrad09',tier:'Fan',since:'2026',posts:'290'},
  dallas:{n:'BigD_Stang',tier:'Free',since:'2026',posts:'47'}
};
MP.THREADS = [
  {id:2,f:'hilltop',sport:'football',hot:true,title:'Official Game Thread: SMU at Syracuse (Sat., 11 a.m. CT, ESPN2)',by:'mike',ago:'2h',pin:true,
   posts:[
     ['mike','Early one in upstate New York: 11 a.m. CT on ESPN2. Drop your score predictions and keep it civil. Pony Up!'],
     ['dallas','34-17 Mustangs. Defense gets two picks.'],
     ['ray','31-24. Too many people sleeping on their run game.'],
     ['belle','Watch party at our usual spot off Lovers Lane. Breakfast tacos because of the 11 a.m. kick.']
   ]},
  {id:3,f:'recruiting',sport:'mens-basketball',hot:true,title:'Visit weekend recap: two guards on campus, both left impressed',by:'staff',ago:'5h',
   posts:[
     ['staff','Big visit weekend for the hoops staff. Both guards (fictional, for this demo) sat courtside for the scrimmage and met with the Cox business school. Early read: very positive.'],
     ['ray','Whoever runs the visit itinerary deserves a raise.'],
     ['hank','NIL matters here. Fan support through SMU\u2019s official programs could move the needle.']
   ]},
  {id:4,f:'hilltop',sport:'womens-soccer',hot:true,title:"Women's soccer wins 3-1 at Cal. Who's going to the Pitt match?",by:'grace',ago:'3d',
   posts:[
     ['grace','Three goals in Berkeley on Thursday. Two left: at North Carolina on Oct. 29, then Pitt at Washburne on Nov. 5. Thinking of organizing an SMU+ meetup for Pitt.'],
          ['cox','Tough ACC stretch, but that win at Cal was fun to watch.']
   ]},
  {id:5,f:'paddock',sport:'volleyball',title:'Mic\'d up: the setter\'s timeout huddle from Saturday is a must-watch',by:'belle',ago:'9h',
   posts:[
     ['belle','If you have not watched the Mic\'d Up episode, go now. Hearing the setter call the rotation change in real time was wild.'],
     ['pete','This is the content that makes the membership worth it. More of this, please.']
   ]},
  {id:6,f:'hilltop',sport:'mens-basketball',title:'Way-too-early starting five predictions',by:'ray',ago:'11h',
   posts:[
     ['ray','PG, two wings, stretch four and the big transfer. Defense first. Thoughts?'],
     ['dallas','You are underrating the freshman. He will start by January.'],
     ['hank','Depth is the question. Love the top six though.']
   ]},
  {id:7,f:'boulevard',sport:null,title:'Best tailgate food in University Park? Need ideas for Saturday',by:'belle',ago:'1d',
   posts:[
     ['belle','Brisket is a given. What else? Last time the queso disappeared in 10 minutes.'],
     ['mike','Smoked wings and a big tub of banana pudding. Never fails.'],
     ['cox','Breakfast tacos for the early kickoffs. Trust me.']
   ]},
  {id:8,f:'paddock',sport:'swimming-diving',title:'Taper week insight from the pool deck',by:'staff',ago:'1d',
   posts:[
     ['staff','Spent the morning on deck. The distance group is ahead of last year\'s splits. The diving coach thinks a fictional sophomore has a real shot at the podium.'],
     ['grace','Didn\'t know I cared about swim until SMU+. Now I\'m hooked.']
   ]},
  {id:9,f:'hilltop',sport:null,title:'Where would the NIL money go? How the proposed model works',by:'staff',ago:'2d',pin:true,
   posts:[
     ['staff','Pinned. How the proposed model works: a share of membership revenue would support SMU Athletics\u2019 official NIL and revenue-sharing programs, with exact terms still to be decided and athlete deals disclosed through the NIL Go clearinghouse. SMU+ would not pick or pay individual athletes or teams. (Sample post for this concept.)'],
     ['cox','Clear rules like this are why I joined.'],
     ['hank','Good that it runs through SMU\u2019s official programs.']
   ]},
  {id:10,f:'recruiting',sport:'football',title:'Offer tracker: 2028 class (updated weekly)',by:'staff',ago:'2d',
   posts:[['staff','Updated tracker. All prospects referenced on this demo board are fictional.'],['ray','The DL haul is going to be special.']]},
  {id:11,f:'hilltop',sport:'golf',title:"Women's golf finishes 5th at the Landfall Tradition",by:'cox',ago:'5h',
   posts:[['cox','Fifth of 18 in Wilmington, after a T4th in Seattle and a T5th at Haskins. Solid fall.'],['pete','The swing breakdown video on SMU+ was great.']]},
  {id:12,f:'boulevard',sport:null,title:'SMU+ app feature requests thread',by:'mike',ago:'4d',
   posts:[['mike','Mine: picture-in-picture for live Q&As, and a dark mode.'],['grace','Push alerts when an athlete I follow posts.']]},
  {id:13,f:'hilltop',sport:'track-field',title:'XC heads to the ACC Championships on Friday',by:'grace',ago:'4d',
   posts:[['grace','Two team wins in September (John McKenzie and the Texas A&M Invitational). ACCs are Oct. 30 in Blacksburg. Who is watching?']]},
  {id:14,f:'paddock',sport:'womens-basketball',title:'Breaking down the new press',by:'staff',ago:'5d',
   posts:[['staff','The new full-court press is aggressive. Here is how it works and why the staff thinks it fits this roster.'],['belle','Loved the telestrator clips.']]},
  {id:15,f:'hilltop',sport:'rowing',title:'Head of the Charles thread: who watched the stream?',by:'hank',ago:'6d',
   posts:[['hank','Great to see SMU racing in Cambridge. Next up is Texas at White Rock Lake on Nov. 8.']]},
  {id:16,f:'hilltop',sport:'tennis',title:'Fall invite results thread',by:'ray',ago:'1w',
   posts:[['ray','Fall is all individual events. Who is going to the ITA Sectionals Nov. 5-8? Dual season starts in the spring.']]},
  {id:17,f:'hilltop',sport:'equestrian',title:'First home equestrian meet is Nov. 6. Anyone been?',by:'belle',ago:'1w',
   posts:[['belle','Georgia at the Dallas Equestrian Center on Nov. 6, then Oklahoma State on Nov. 7. Highly recommend, the riders are incredible.']]},
  {id:18,f:'hilltop',sport:'mens-soccer',title:"Men's soccer is 12-0-2. Louisville on Friday",by:'dallas',ago:'1w',
   posts:[['dallas','Unbeaten through 14. Louisville at Washburne on Oct. 30, 6:30 p.m. on ACCN. Pack it out.']]}
];

/* Board upgrade: forum groups, more users, longer threads with quoted replies. All fictional. */
(function(){var MP=window.MP;
MP.FORUMS.forEach(function(f){f.group=f.prem?'Premium':'Community'});
MP.FORUMS.push({id:'help',name:'Site Help & Feedback',desc:'Bugs, feature requests and membership questions.',prem:false,threads:214,posts:1630,group:'Community'});
MP.USERS.dre={n:'SMU+ Boards',tier:'Board account',staff:true,since:'2024',posts:'2,214'};
MP.USERS.jt={n:'SMU+ Boards',tier:'Board account',staff:true,since:'2024',posts:'3,377'};
MP.USERS.peruna={n:'PerunaPapa',tier:'Founder',since:'2025',posts:'5,920'};
MP.USERS.ford={n:'FordStadiumFaithful',tier:'Plus',since:'2025',posts:'1,408'};
MP.USERS.snider={n:'SniderPlazaSam',tier:'Fan',since:'2026',posts:'233'};
MP.USERS.band={n:'MustangBandAlum04',tier:'Plus',since:'2025',posts:'967'};
function T(id){for(var i=0;i<MP.THREADS.length;i++)if(MP.THREADS[i].id===id)return MP.THREADS[i]}
/* posts: [user, text, quotedPostIndex?] */
T(2).posts=[
 ['mike','Kickoff is 11 a.m. CT Saturday in Syracuse, on ESPN2. Drop your score predictions and keep it civil. Pony Up!'],
 ['dallas','34-17 Mustangs. Defense gets two picks.'],
 ['ray','31-24. Too many people sleeping on their run game.',1],
 ['belle','Watch party is at our usual spot off Lovers Lane. Red and blue cookies again this week.'],
 ['band','Anybody making the trip? A few of us band alumni fly into Syracuse Friday night and would love company in the visitors section.'],
 ['snider','First road game as a member. Is the 11 a.m. kick Dallas time or Syracuse time?'],
 ['peruna','11 a.m. Central, noon in Syracuse. Set an alarm and get the queso going early.',5],
 ['hank','Bold call: if they run it like they did against Cal, this one is decided by halftime.'],
 ['ray','Hank stealing my take. I\'m sticking with 31-24.',2]];
MP.THREADS.unshift({id:19,f:'help',sport:null,title:'Board rules and how the boards work (read before posting)',by:'staff',ago:'3w',pin:true,
 posts:[['staff','Welcome. Be civil, no posting about players\' families, don\'t copy whole threads to other sites. Profile photos: no SMU logos, no photos of athletes or other people, nothing offensive. Use Report on a post to flag a photo. Anyone can read every board. Sign in to post. Posts from the site\'s seeded sample accounts are labeled Sample. Everything else is posted by real members.']]});
MP.THREADS.push({id:21,f:'recruiting',sport:'football',hot:true,title:'Visit list for the Nov. 6 Virginia Tech game (fictional names, updated)',by:'jt',ago:'7h',
 posts:[['jt','Current list: one official, three unofficial. The QB is back for a third trip. All names on this demo board are fictional.'],
  ['ford','Third visit is the one that matters. Friday night under the lights at Ford should help.',0],
  ['hank','Any OL on the list? That\'s the need.'],
  ['jt','One tackle from East Texas, unofficial. Staff likes him a lot.',2]]});
MP.THREADS.push({id:22,f:'boulevard',sport:null,title:'Mustang Band halftime show was unreal. Who has video?',by:'band',ago:'1d',
 posts:[['band','Fifteen years out of the band and that show still gave me chills. Anyone get the full thing from the west side?'],['belle','Got most of it. Uploading tonight.'],['snider','The drumline feature at the end. Wow.',0]]});
})();

/* Legal cleanup (Oct 26, 2026). One pass over whatever threads the page has (this file's demo seed, or the rows Supabase returns on
   the live site) so the rendering layer never shows: testimonial-style lines from the seeded sample accounts, the insider and
   closed-practice report threads, or a made-up staffer's name. Seeded threads get t.sample (shown as a "Sample" tag). Real members'
   posts (author ids starting u:, or 'me' in demo) are never touched, and nothing in Supabase is changed or deleted. */
MP.BOARD_NAME='The Expressway';
MP.BOARD_FULL='The Expressway message boards';
MP.FORUM_FIX={hilltop:{name:'Main board',desc:'The main board of The Expressway, free for every Mustang fan. Game talk, takes and hype.'},
  paddock:{desc:'Members board for longer takes and analysis.'}};
MP.HIDE_THREADS=[1,8,14];  /* seeded insider / closed-practice reports */
MP.TESTIMONIAL=/(I pay for|\btier\b|membership worth|worth it\b|why I joined|until SMU\+|on SMU\+ was great|as a member|telestrator|rule on staff reports)/i;
MP.isReal=function(h){return typeof h==='string'&&(/^u:/.test(h)||h==='me')};
MP.isSample=function(t){return !!t&&!t.game&&!MP.isReal(t.by)};
MP.cleanBoards=function(){var MP=window.MP;
  (MP.FORUMS||[]).forEach(function(f){var x=MP.FORUM_FIX[f.id];if(x){if(x.name)f.name=x.name;if(x.desc)f.desc=x.desc}});
  if(MP.USERS)['staff','dre','jt'].forEach(function(k){if(MP.USERS[k]){MP.USERS[k].n='SMU+ Boards';MP.USERS[k].tier='Board account';MP.USERS[k].posts=''}});
  MP.THREADS=(MP.THREADS||[]).filter(function(t){if(MP.isReal(t.by))return true;if(MP.HIDE_THREADS.indexOf(+t.id)>=0)return false;
    return !(t.posts||[]).some(function(p){return !MP.isReal(p[0])&&/closed practice/i.test(p[1]||'')})});
  MP.THREADS.forEach(function(t){t.title=String(t.title||'').replace(/^Official\s+/i,'');t.sample=MP.isSample(t);
    if(!t.posts||t._clean)return;t._clean=1;var map={},out=[];
    t.posts.forEach(function(p,i){if(i>0&&!MP.isReal(p[0])&&MP.TESTIMONIAL.test(p[1]||''))return;
      if(!MP.isReal(p[0])&&p[1])p[1]=String(p[1]).replace(/Every username and post on this demo board is fictional\./,'Posts from the site\u2019s seeded sample accounts are labeled Sample. Everything else is posted by real members.').replace(/don't copy whole staff reports/,"don't copy whole threads");
      map[i]=out.length;out.push(p)});
    if(out.length!==t.posts.length){out.forEach(function(p){if(p[2]!=null)p[2]=map[p[2]]!=null?map[p[2]]:null});t.posts=out;if(t.replies!=null)t.replies=Math.max(0,out.length-1)}});
  return MP.THREADS};
MP.sampleTag=function(t){return t&&t.sample?'<span class="tag-sample">Sample</span>':''};
MP.cleanBoards();
