/* SMU+ concept data. Board users, posts, prices, fund figures and the sample roster names in this file are fictional.
   Real data lives elsewhere: football schedule in content.js, football profiles in athletes.js, and the other 11 programs' schedules, rosters and coaches in real.js (all sourced from smumustangs.com). */
window.MP = window.MP || {};
/* Feature flags. recruiting:false hides every recruiting surface (nav, recruiting/ page, Recruiting Trail board, recruiting/portal cards,
   sitemap entry) without deleting any code or data. Set it to true to bring recruiting back. build_pages.py reads this line too. */
MP.FEATURES = MP.FEATURES || {};
/* Contact for data-removal and privacy requests. ONE constant: put the address in email when it exists; until then the site shows the placeholder text. */
/* Membership tier display names. Keys stay stable (DB + code use them); change a label here only. */
MP.TIER_LABELS = {free:'Free', mustang:'Mustang', pony:'All-Access', club:'Red & Blue'};
MP.CONTACT = MP.CONTACT || {email:'', pending:'a dedicated SMU+ contact email will be posted here before launch'};
if (MP.FEATURES.recruiting == null) MP.FEATURES.recruiting = false;

MP.SPORTS = [
  {slug:'football',name:'Football',season:'Fall',g:'M',record:'6-1',conf:'4-1 ACC',coach:'Coach Rhett Lashlee',members:4210,fund:412300,pos:['QB','RB','WR','WR','TE','OL','OL','DL','DL','LB','CB','S','K'],num:[1,99],ht:[69,78],
   blurb:'Ford Stadium under the lights, the Boulevard before kickoff and an ACC season where every snap counts.'},
  {slug:'mens-basketball',name:"Men's Basketball",season:'Winter',g:'M',record:'0-0',conf:'Opens Nov. 2',coach:'Coach Andy Enfield',members:2380,fund:228900,pos:['PG','SG','SG','SF','SF','PF','PF','C'],num:[0,35],ht:[73,85],
   blurb:'Moody Coliseum, the student section on its feet, and ACC nights from November to March.'},
  {slug:'womens-basketball',name:"Women's Basketball",season:'Winter',g:'W',record:'0-0',conf:'Opens Nov. 3',coach:'Coach Adia Barnes',members:1640,fund:151200,pos:['PG','G','G','F','F','F','C'],num:[0,35],ht:[66,77],
   blurb:'Moody Coliseum, early mornings in the gym and every possession that decides a close one.'},
  {slug:'womens-soccer',name:"Women's Soccer",season:'Fall',g:'W',record:'6-6-4',conf:'1-5-2 ACC',coach:'Coach Nicole Nelson',members:1120,fund:98400,pos:['GK','D','D','D','M','M','M','F','F'],num:[1,30],ht:[62,72],
   blurb:'Washburne under the lights and an ACC schedule that gives nothing away.'},
  {slug:'mens-soccer',name:"Men's Soccer",season:'Fall',g:'M',record:'12-0-2',conf:'6-0-1 ACC',coach:'Coach Kevin Hudson',members:960,fund:87600,pos:['GK','D','D','D','M','M','M','F','F'],num:[1,30],ht:[67,76],
   blurb:'Friday nights at Washburne and a back line that takes every goal against personally.'},
  {slug:'volleyball',name:'Volleyball',season:'Fall',g:'W',record:'16-4',conf:'8-2 ACC',coach:'Coach Sam Erger',members:1010,fund:93100,pos:['OH','OH','MB','MB','S','L','OPP','DS'],num:[1,25],ht:[65,77],
   blurb:'Match night at Moody: every kill, every dig, every timeout huddle.'},
  {slug:'swimming-diving',name:'Swimming & Diving',season:'Winter',g:'X',record:'M 3-1 · W 2-2',conf:'Dual meets',coach:'Coaches Greg Rhodenbaugh & Ozzie Quevedo',members:640,fund:52300,pos:['Freestyle','Backstroke','Breaststroke','Butterfly','IM','Distance','Diving'],
   blurb:'Lane lines at 5 a.m., dual meets in the fall and a championship season in Greensboro and Austin.'},
  {slug:'golf',name:'Golf',season:'Fall/Spring',g:'X',record:'W: 4 top-6 finishes',conf:'Fall season',coach:'Coaches Chris Parra & Lauren Mason',members:520,fund:41800,pos:['Golfer'],
   blurb:'Dawn practice rounds, three-day weeks on the road and a spring with an NCAA Regional in Dallas.'},
  {slug:'tennis',name:'Tennis',season:'Spring',g:'X',record:'Fall invites',conf:'Duals in spring',coach:'Coaches Grant Chen & Kelcy McKenna',members:480,fund:39500,pos:['Singles','Singles','Doubles','Singles/Doubles'],
   blurb:'Fall invitationals, then a dual season where one tiebreak swings a whole afternoon.'},
  {slug:'track-field',name:'Track & Field / XC',season:'Year-round',g:'W',record:'XC: 2 team wins',conf:'ACCs Oct. 30',coach:'Coach A Havahla Haynes',members:560,fund:46200,pos:['Sprints','Distance','Hurdles','Jumps','Throws','Mid-distance'],
   blurb:'Cross country in the fall, the track in winter and spring, and long runs on the Katy Trail.'},
  {slug:'rowing',name:'Rowing',season:'Fall/Spring',g:'W',record:'Head races',conf:'Spring sprints',coach:'Coach Chase Graham',members:300,fund:22900,pos:['Stroke','Bow','Port','Starboard','Coxswain'],
   blurb:'Dawn on White Rock Lake. Erg tests, seat races and race day.'},
  {slug:'equestrian',name:'Equestrian',season:'Fall/Spring',g:'W',record:'1-2',conf:'Fall slate',coach:'Coach Brad Kearns',members:340,fund:27400,pos:['Hunt Seat','Hunt Seat','Western','Western'],
   blurb:'Riders, horses and the barn crew behind every point at the Dallas Equestrian Center.'}
];

MP.NAMES = {
  M:['Jalen','Marcus','Tyler','Isaiah','Cole','Darius','Ethan','Brandon','Caleb','Xavier','Trent','Mason','Andre','Luis','Owen','Malik','Grant','Elijah','Noah','Reggie','Dominic','Jace','Kendrick','Tomas','Rhys','Kai','Hudson','Bryce','Camden','Zion'],
  W:['Maya','Ava','Kennedy','Jordan','Sophia','Aaliyah','Riley','Brooke','Sienna','Camila','Tessa','Imani','Harper','Zoe','Lauren','Nia','Elise','Kayla','Paige','Mia','Gabriela','Reese','Talia','Nora','Jada','Lucia','Quinn','Aubrey','Skye','Hailey'],
  L:['Whitaker','Okonkwo','Castellanos','Lindqvist','Brennan','Holloway','Maddox','Reyes','Thibodeaux','Okafor','Prescott','Delgado','Ashford','Kincaid','Mbeki','Sorensen','Calloway','Fairbanks','Quintero','Navarro','Pemberton','Ellison','Vasquez','Harrington','Abernathy','Sutton','Gallagher','Ramos','Whitlock','Beaumont','Fontaine','Okoro','Lachance','Stratton','Merritt','Dunleavy','Achebe','Kowalski','Marchetti','Treadwell']
};
MP.TOWNS = ['Dallas, TX','Houston, TX','Austin, TX','Plano, TX','Frisco, TX','San Antonio, TX','Fort Worth, TX','McKinney, TX','Katy, TX','Tulsa, OK','Shreveport, LA','Atlanta, GA','Phoenix, AZ','Denver, CO','Nashville, TN','Miami, FL','San Diego, CA','Chicago, IL','Melbourne, Australia','Stockholm, Sweden','Madrid, Spain','Toronto, Canada'];
MP.OPP = ['Gulf Coast','North Plains State','Rio Valley','Lone Star Tech','Mesa A&M','Pinehurst','Bay City','Red River','Harbor State','Summit','Prairie View Tech','Cedar Ridge','Westbrook','Iron Hills','Coastal Carolina State'];
MP.CLASSES = ['Fr.','R-Fr.','So.','Jr.','Sr.','Gr.'];

/* Message board (fictional users and posts) */
MP.FORUMS = [
  {id:'paddock',name:'The Paddock',desc:'Members-only premium board. Insider intel and practice reports.',prem:true,threads:1284,posts:48211},
  {id:'hilltop',name:'The Hilltop',desc:'Free board for every Mustang fan. Game talk, takes and hype.',prem:false,threads:3907,posts:122640},
  {id:'recruiting',name:'Recruiting Trail',desc:'Visits, offers and commitments across every sport.',prem:true,threads:612,posts:20975},
  {id:'boulevard',name:'The Boulevard',desc:'Off-topic, tailgates, Dallas eats and everything else.',prem:false,threads:1450,posts:30318}
];
MP.USERS = {
  staff:{n:'Sam Reyes',tier:'SMU+ Insider',staff:true,since:'2024',posts:'6,102'},
  pete:{n:'PonyUpPete',tier:'Red & Blue',since:'2025',posts:'4,388'},
  hank:{n:'HilltopHank',tier:'All-Access',since:'2025',posts:'2,911'},
  belle:{n:'BoulevardBelle',tier:'Red & Blue',since:'2025',posts:'1,764'},
  mike:{n:'MustangMike88',tier:'Mustang',since:'2026',posts:'812'},
  ray:{n:'RedAndBlueRay',tier:'All-Access',since:'2025',posts:'3,040'},
  grace:{n:'GameDayGrace',tier:'All-Access',since:'2026',posts:'655'},
  cox:{n:'CoxGrad09',tier:'Mustang',since:'2026',posts:'290'},
  dallas:{n:'BigD_Stang',tier:'Free',since:'2026',posts:'47'}
};
MP.THREADS = [
  {id:1,f:'paddock',sport:'football',hot:true,pin:false,title:'Practice report: Tuesday notes, WR rotation is changing',by:'staff',ago:'38m',replies:214,views:'9.8k',
   posts:[
     ['staff','Closed practice, but here is what I can share. The WR rotation looked different in team periods: the junior slot took most of the first-team reps and the true freshman got real run on the outside. Defensive line was healthy and loud. More in the Thursday report.'],
     ['pete','This is exactly why I pay for the Red & Blue tier. Freshman getting first-team reps in late October tells you everything.'],
     ['hank','Any word on the kicking battle? Last week was rough.'],
     ['staff','Kicker looked sharp from distance in the period I watched. I would not read too much into one practice.'],
     ['grace','Love the detail. Can we get a film breakdown of the 3rd-and-long package on the podcast?']
   ]},
  {id:2,f:'hilltop',sport:'football',hot:true,title:'Official Game Thread: SMU at Syracuse (Sat., 11 a.m. CT, ESPN2)',by:'mike',ago:'2h',replies:1832,views:'41k',pin:true,
   posts:[
     ['mike','Early one in upstate New York: 11 a.m. CT on ESPN2. Drop your score predictions and keep it civil. Pony Up!'],
     ['dallas','34-17 Mustangs. Defense gets two picks.'],
     ['ray','31-24. Too many people sleeping on their run game.'],
     ['belle','Watch party at our usual spot off Lovers Lane. Breakfast tacos because of the 11 a.m. kick.']
   ]},
  {id:3,f:'recruiting',sport:'mens-basketball',hot:true,title:'Visit weekend recap: two guards on campus, both left impressed',by:'staff',ago:'5h',replies:388,views:'12.1k',
   posts:[
     ['staff','Big visit weekend for the hoops staff. Both guards (fictional, for this demo) sat courtside for the scrimmage and met with the Cox business school. Early read: very positive.'],
     ['ray','Whoever runs the visit itinerary deserves a raise.'],
     ['hank','NIL matters here. Fan support through SMU\u2019s official programs could move the needle.']
   ]},
  {id:4,f:'hilltop',sport:'womens-soccer',hot:true,title:"Women's soccer wins 3-1 at Cal. Who's going to the Pitt match?",by:'grace',ago:'3d',replies:146,views:'3.9k',
   posts:[
     ['grace','Three goals in Berkeley on Thursday. Two left: at North Carolina on Oct. 29, then Pitt at Washburne on Nov. 5. Thinking of organizing an SMU+ meetup for Pitt.'],
     ['belle','Count me in. The Red & Blue tier invite included a watch party for the UNC match too.'],
     ['cox','Tough ACC stretch, but that win at Cal was fun to watch.']
   ]},
  {id:5,f:'paddock',sport:'volleyball',title:'Mic\'d up: the setter\'s timeout huddle from Saturday is a must-watch',by:'belle',ago:'9h',replies:92,views:'2.7k',
   posts:[
     ['belle','If you have not watched the Mic\'d Up episode, go now. Hearing the setter call the rotation change in real time was wild.'],
     ['pete','This is the content that makes the membership worth it. More of this, please.']
   ]},
  {id:6,f:'hilltop',sport:'mens-basketball',title:'Way-too-early starting five predictions',by:'ray',ago:'11h',replies:274,views:'6.3k',
   posts:[
     ['ray','PG, two wings, stretch four and the big transfer. Defense first. Thoughts?'],
     ['dallas','You are underrating the freshman. He will start by January.'],
     ['hank','Depth is the question. Love the top six though.']
   ]},
  {id:7,f:'boulevard',sport:null,title:'Best tailgate food in University Park? Need ideas for Saturday',by:'belle',ago:'1d',replies:203,views:'4.4k',
   posts:[
     ['belle','Brisket is a given. What else? Last time the queso disappeared in 10 minutes.'],
     ['mike','Smoked wings and a big tub of banana pudding. Never fails.'],
     ['cox','Breakfast tacos for the early kickoffs. Trust me.']
   ]},
  {id:8,f:'paddock',sport:'swimming-diving',title:'Taper week insight from the pool deck',by:'staff',ago:'1d',replies:58,views:'1.6k',
   posts:[
     ['staff','Spent the morning on deck. The distance group is ahead of last year\'s splits. The diving coach thinks a fictional sophomore has a real shot at the podium.'],
     ['grace','Didn\'t know I cared about swim until SMU+. Now I\'m hooked.']
   ]},
  {id:9,f:'hilltop',sport:null,title:'Where would the NIL money go? How the proposed model works',by:'staff',ago:'2d',replies:512,views:'18.7k',pin:true,
   posts:[
     ['staff','Pinned. How the proposed model works: 40% of membership revenue would go to SMU Athletics\u2019 official NIL and revenue-sharing programs, with athlete deals disclosed through the NIL Go clearinghouse. SMU+ would not pick or pay individual athletes or teams. (Sample post for this concept.)'],
     ['cox','Clear rules like this are why I joined.'],
     ['hank','Good that it runs through SMU\u2019s official programs.']
   ]},
  {id:10,f:'recruiting',sport:'football',title:'Offer tracker: 2028 class (updated weekly)',by:'staff',ago:'2d',replies:691,views:'22k',
   posts:[['staff','Updated tracker. All prospects referenced on this demo board are fictional.'],['ray','The DL haul is going to be special.']]},
  {id:11,f:'hilltop',sport:'golf',title:"Women's golf finishes 5th at the Landfall Tradition",by:'cox',ago:'5h',replies:44,views:'980',
   posts:[['cox','Fifth of 18 in Wilmington, after a T4th in Seattle and a T5th at Haskins. Solid fall.'],['pete','The swing breakdown video on SMU+ was great.']]},
  {id:12,f:'boulevard',sport:null,title:'SMU+ app feature requests thread',by:'mike',ago:'4d',replies:131,views:'3.2k',
   posts:[['mike','Mine: picture-in-picture for live Q&As, and a dark mode.'],['grace','Push alerts when an athlete I follow posts.']]},
  {id:13,f:'hilltop',sport:'track-field',title:'XC heads to the ACC Championships on Friday',by:'grace',ago:'4d',replies:37,views:'860',
   posts:[['grace','Two team wins in September (John McKenzie and the Texas A&M Invitational). ACCs are Oct. 30 in Blacksburg. Who is watching?']]},
  {id:14,f:'paddock',sport:'womens-basketball',title:'Film room: breaking down the new press',by:'staff',ago:'5d',replies:76,views:'2.1k',
   posts:[['staff','The new full-court press is aggressive. Here is how it works and why the staff thinks it fits this roster.'],['belle','Loved the telestrator clips.']]},
  {id:15,f:'hilltop',sport:'rowing',title:'Head of the Charles thread: who watched the stream?',by:'hank',ago:'6d',replies:21,views:'540',
   posts:[['hank','Great to see SMU racing in Cambridge. Next up is Texas at White Rock Lake on Nov. 8.']]},
  {id:16,f:'hilltop',sport:'tennis',title:'Fall invite results thread',by:'ray',ago:'1w',replies:18,views:'410',
   posts:[['ray','Fall is all individual events. Who is going to the ITA Sectionals Nov. 5-8? Dual season starts in the spring.']]},
  {id:17,f:'hilltop',sport:'equestrian',title:'First home equestrian meet is Nov. 6. Anyone been?',by:'belle',ago:'1w',replies:29,views:'620',
   posts:[['belle','Georgia at the Dallas Equestrian Center on Nov. 6, then Oklahoma State on Nov. 7. Highly recommend, the riders are incredible.']]},
  {id:18,f:'hilltop',sport:'mens-soccer',title:"Men's soccer is 12-0-2. Louisville on Friday",by:'dallas',ago:'1w',replies:55,views:'1.2k',
   posts:[['dallas','Unbeaten through 14. Louisville at Washburne on Oct. 30, 6:30 p.m. on ACCN. Pack it out.']]}
];

/* Board upgrade: forum groups, more users, longer threads with quoted replies. All fictional. */
(function(){var MP=window.MP;
MP.FORUMS.forEach(function(f){f.group=f.prem?'Premium':'Community'});
MP.FORUMS.splice(2,0,{id:'filmroom',name:'Film Room Lounge',desc:'Frame-by-frame breakdowns with the SMU+ film staff. Members only.',prem:true,threads:388,posts:9140,group:'Premium'});
MP.FORUMS.push({id:'help',name:'Site Help & Feedback',desc:'Bugs, feature requests and membership questions.',prem:false,threads:214,posts:1630,group:'Community'});
MP.USERS.dre={n:'Dre Coleman',tier:'SMU+ Film Room',staff:true,since:'2024',posts:'2,214'};
MP.USERS.jt={n:'J.T. Barlow',tier:'SMU+ Recruiting',staff:true,since:'2024',posts:'3,377'};
MP.USERS.peruna={n:'PerunaPapa',tier:'Red & Blue',since:'2025',posts:'5,920'};
MP.USERS.ford={n:'FordStadiumFaithful',tier:'All-Access',since:'2025',posts:'1,408'};
MP.USERS.snider={n:'SniderPlazaSam',tier:'Mustang',since:'2026',posts:'233'};
MP.USERS.band={n:'MustangBandAlum04',tier:'All-Access',since:'2025',posts:'967'};
function T(id){for(var i=0;i<MP.THREADS.length;i++)if(MP.THREADS[i].id===id)return MP.THREADS[i]}
/* posts: [user, text, quotedPostIndex?] */
T(1).posts=[
 ['staff','Closed practice, but here\'s what I can share. The WR rotation looked different in team periods: the junior slot took most of the first-team reps and the true freshman got real run on the outside. Defensive line was healthy and loud. More in Thursday\'s report.'],
 ['pete','Freshman getting first-team reps in late October tells you everything. This is why I pay for the Red & Blue tier.',0],
 ['hank','Any word on the kicking battle? Last week was rough to watch from the south end zone.'],
 ['staff','Kicker looked sharp from distance in the period I watched. I wouldn\'t read too much into one practice.',2],
 ['ford','Good to hear. I was sitting right behind the uprights for the miss and the groan from our section was audible in Snider Plaza.',3],
 ['grace','Love the detail. Can we get a film breakdown of the 3rd-and-long package on the Paddock Report?'],
 ['dre','Already cut it up. It\'s going in the Film Room Lounge tomorrow morning.',5],
 ['peruna','Dre with the assist. Somebody get this man a corny dog.',6]];
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
MP.THREADS.unshift({id:19,f:'help',sport:null,title:'Board rules and how premium boards work (read before posting)',by:'staff',ago:'3w',replies:12,views:'14k',pin:true,
 posts:[['staff','Welcome. Be civil, no posting about players\' families, no screenshots of premium posts. The Paddock and Film Room Lounge are members-only; everything else is free. Every username and post on this demo board is fictional.'],['cox','Appreciate the no-screenshots rule. Keeps the good info coming.']]});
MP.THREADS.push({id:20,f:'filmroom',sport:'football',hot:true,title:'Breakdown: the third-down sim pressure, snap by snap',by:'dre',ago:'4h',replies:167,views:'5.1k',
 posts:[['dre','Cut up the A-gap sim pressure snap by snap. Watch the boundary linebacker: he always shows blitz and only sometimes comes. QB sees six, gets four.'],
  ['ray','The free safety not moving until the snap is so disciplined. You can see the QB staring at him.',0],
  ['peruna','Is this sustainable? Feels like good offenses will motion the back out and stress it.'],
  ['dre','Exactly the counter. Staff has an answer, but I\'ll save it for Thursday.',2],
  ['grace','This is the best thing on the site. Worth the membership by itself.']]});
MP.THREADS.push({id:21,f:'recruiting',sport:'football',hot:true,title:'Visit list for the Nov. 6 Virginia Tech game (fictional names, updated)',by:'jt',ago:'7h',replies:244,views:'8.8k',
 posts:[['jt','Current list: one official, three unofficial. The QB is back for a third trip. All names on this demo board are fictional.'],
  ['ford','Third visit is the one that matters. Friday night under the lights at Ford should help.',0],
  ['hank','Any OL on the list? That\'s the need.'],
  ['jt','One tackle from East Texas, unofficial. Staff likes him a lot.',2]]});
MP.THREADS.push({id:22,f:'boulevard',sport:null,title:'Mustang Band halftime show was unreal. Who has video?',by:'band',ago:'1d',replies:88,views:'2.2k',
 posts:[['band','Fifteen years out of the band and that show still gave me chills. Anyone get the full thing from the west side?'],['belle','Got most of it. Uploading tonight.'],['snider','The drumline feature at the end. Wow.',0]]});
})();
