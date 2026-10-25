/* Mustangs+ concept data. Every athlete, coach, user, opponent and number here is fictional sample data. */
window.MP = window.MP || {};

MP.SPORTS = [
  {slug:'football',name:'Football',season:'Fall',g:'M',record:'7-1',conf:'5-0 Conf.',coach:'Coach Darren Ellsworth',members:4210,fund:412300,pos:['QB','RB','WR','WR','TE','OL','OL','DL','DL','LB','CB','S','K'],num:[1,99],ht:[69,78],
   blurb:'Saturdays on the Boulevard, Friday night walkthroughs and every rep in between.'},
  {slug:'mens-basketball',name:"Men's Basketball",season:'Winter',g:'M',record:'2-0',conf:'Preseason',coach:'Coach Marcus Halloway',members:2380,fund:228900,pos:['PG','SG','SG','SF','SF','PF','PF','C'],num:[0,35],ht:[73,85],
   blurb:'From open gym to tip-off at Moody, all access to the hardwood.'},
  {slug:'womens-basketball',name:"Women's Basketball",season:'Winter',g:'W',record:'1-0',conf:'Preseason',coach:'Coach Renee Castillo',members:1640,fund:151200,pos:['PG','G','G','F','F','F','C'],num:[0,35],ht:[66,77],
   blurb:'A rebuilt roster, a new identity and a fan base that shows up.'},
  {slug:'womens-soccer',name:"Women's Soccer",season:'Fall',g:'W',record:'11-3-2',conf:'6-1-1 Conf.',coach:'Coach Elena Marsh',members:1120,fund:98400,pos:['GK','D','D','D','M','M','M','F','F'],num:[1,30],ht:[62,72],
   blurb:'Postseason push. Behind the scenes of a top-of-the-table run.'},
  {slug:'mens-soccer',name:"Men's Soccer",season:'Fall',g:'M',record:'9-4-3',conf:'4-2-1 Conf.',coach:'Coach Julian Ferreira',members:960,fund:87600,pos:['GK','D','D','D','M','M','M','F','F'],num:[1,30],ht:[67,76],
   blurb:'Tactics boards, film sessions and the road to the tournament.'},
  {slug:'volleyball',name:'Volleyball',season:'Fall',g:'W',record:'16-5',conf:'8-2 Conf.',coach:'Coach Kara Lindgren',members:1010,fund:93100,pos:['OH','OH','MB','MB','S','L','OPP','DS'],num:[1,25],ht:[65,77],
   blurb:'Every kill, dig and timeout huddle, mic\'d up.'},
  {slug:'swimming-diving',name:'Swimming & Diving',season:'Winter',g:'X',record:'3-1',conf:'Dual meets',coach:'Coach Brett Albright',members:640,fund:52300,pos:['Freestyle','Backstroke','Breaststroke','Butterfly','IM','Distance','Diving'],
   blurb:'5 a.m. lane lines, taper week and championship meets.'},
  {slug:'golf',name:'Golf',season:'Fall/Spring',g:'X',record:'2 wins',conf:'Fall season',coach:'Coach Henry Vance',members:520,fund:41800,pos:['Golfer'],
   blurb:'Practice rounds, swing breakdowns and tournament day.'},
  {slug:'tennis',name:'Tennis',season:'Spring',g:'X',record:'Fall invites',conf:'Dual season in Jan.',coach:'Coach Priya Natarajan',members:480,fund:39500,pos:['Singles','Singles','Doubles','Singles/Doubles'],
   blurb:'Match-point drama and the grind of a dual-match season.'},
  {slug:'track-field',name:'Track & Field / XC',season:'Year-round',g:'X',record:'XC: 2nd at regionals',conf:'Indoor starts Jan.',coach:'Coach Andre Whitfield',members:560,fund:46200,pos:['Sprints','Distance','Hurdles','Jumps','Throws','Mid-distance'],
   blurb:'Splits, PRs and long runs on the Katy Trail.'},
  {slug:'rowing',name:'Rowing',season:'Fall/Spring',g:'W',record:'Head races',conf:'Spring sprints',coach:'Coach Fiona Kerr',members:300,fund:22900,pos:['Stroke','Bow','Port','Starboard','Coxswain'],
   blurb:'Dawn on the water. Erg tests, boat selection and race day.'},
  {slug:'equestrian',name:'Equestrian',season:'Fall/Spring',g:'W',record:'4-1',conf:'Fall slate',coach:'Coach Laurel Bishop',members:340,fund:27400,pos:['Hunt Seat','Hunt Seat','Western','Western'],
   blurb:'Riders, horses and the barn crew behind every meet.'}
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
  {id:'paddock',name:'The Paddock',desc:'Members-only premium board. Insider intel, practice reports, recruiting nuggets.',prem:true,threads:1284,posts:48211},
  {id:'hilltop',name:'The Hilltop',desc:'Free board for every Mustang fan. Game talk, takes and hype.',prem:false,threads:3907,posts:122640},
  {id:'recruiting',name:'Recruiting Trail',desc:'Visits, offers and commitments across every sport.',prem:true,threads:612,posts:20975},
  {id:'boulevard',name:'The Boulevard',desc:'Off-topic, tailgates, Dallas eats and everything else.',prem:false,threads:1450,posts:30318}
];
MP.USERS = {
  staff:{n:'Sam Reyes',tier:'Mustangs+ Insider',staff:true,since:'2024',posts:'6,102'},
  pete:{n:'PonyUpPete',tier:'Boulevard Club',since:'2025',posts:'4,388'},
  hank:{n:'HilltopHank',tier:'Pony Express',since:'2025',posts:'2,911'},
  belle:{n:'BoulevardBelle',tier:'Boulevard Club',since:'2025',posts:'1,764'},
  mike:{n:'MustangMike88',tier:'Mustang',since:'2026',posts:'812'},
  ray:{n:'RedAndBlueRay',tier:'Pony Express',since:'2025',posts:'3,040'},
  grace:{n:'GameDayGrace',tier:'Pony Express',since:'2026',posts:'655'},
  cox:{n:'CoxGrad09',tier:'Mustang',since:'2026',posts:'290'},
  dallas:{n:'BigD_Stang',tier:'Free',since:'2026',posts:'47'}
};
MP.THREADS = [
  {id:1,f:'paddock',sport:'football',hot:true,pin:false,title:'Practice report: Tuesday notes, WR rotation is changing',by:'staff',ago:'38m',replies:214,views:'9.8k',
   posts:[
     ['staff','Closed practice, but here is what I can share. The WR rotation looked different in team periods: the junior slot took most of the first-team reps and the true freshman got real run on the outside. Defensive line was healthy and loud. More in the Thursday report.'],
     ['pete','This is exactly why I pay for the Club tier. Freshman getting first-team reps in late October tells you everything.'],
     ['hank','Any word on the kicking battle? Last week was rough.'],
     ['staff','Kicker looked sharp. Hit from 48 twice in the period I watched. I would not read too much into one game.'],
     ['grace','Love the detail. Can we get a film breakdown of the 3rd-and-long package on the podcast?']
   ]},
  {id:2,f:'hilltop',sport:'football',hot:true,title:'Official Game Thread: SMU vs. Gulf Coast',by:'mike',ago:'2h',replies:1832,views:'41k',pin:true,
   posts:[
     ['mike','Kickoff 7:00 on the Boulevard. Drop your score predictions and keep it civil. Pony Up!'],
     ['dallas','34-17 Mustangs. Defense gets two picks.'],
     ['ray','31-24. Too many people sleeping on their run game.'],
     ['belle','Tailgate is at our usual tent, near the big oak. Red and blue cookies again this week.']
   ]},
  {id:3,f:'recruiting',sport:'mens-basketball',hot:true,title:'Visit weekend recap: two guards on campus, both left impressed',by:'staff',ago:'5h',replies:388,views:'12.1k',
   posts:[
     ['staff','Big visit weekend for the hoops staff. Both guards (fictional, for this demo) sat courtside for the scrimmage and met with the Cox business school. Early read: very positive.'],
     ['ray','Whoever runs the visit itinerary deserves a raise.'],
     ['hank','The NIL fund numbers matter here. Fans actually moved the needle this year.']
   ]},
  {id:4,f:'hilltop',sport:'womens-soccer',hot:true,title:"Women's soccer clinches a top seed. Who's traveling for the tourney?",by:'grace',ago:'6h',replies:146,views:'3.9k',
   posts:[
     ['grace','What a season. Who is road tripping? Thinking of organizing a Mustangs+ meetup.'],
     ['belle','Count me in. The Club tier tailgate invite included a postseason watch party too.'],
     ['cox','The back line has been ridiculous all year. Seven clean sheets.']
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
     ['grace','Didn\'t know I cared about swim until Mustangs+. Now I\'m hooked.']
   ]},
  {id:9,f:'hilltop',sport:null,title:'Where does the NIL money actually go? Read the Q3 fund report',by:'staff',ago:'2d',replies:512,views:'18.7k',pin:true,
   posts:[
     ['staff','Pinned. The quarterly fund report is up for members. 40% of every membership is in the NIL pool. This quarter it paid athletes across all 12 programs for content, Q&As and fan events. (Sample data for this concept.)'],
     ['cox','Transparency like this is why I joined.'],
     ['hank','Love that Olympic sports get a cut, not just football and hoops.']
   ]},
  {id:10,f:'recruiting',sport:'football',title:'Offer tracker: 2028 class (updated weekly)',by:'staff',ago:'2d',replies:691,views:'22k',
   posts:[['staff','Updated tracker. All prospects referenced on this demo board are fictional.'],['ray','The DL haul is going to be special.']]},
  {id:11,f:'hilltop',sport:'golf',title:'Golf team wins the fall invitational. Shoutout to the freshman!',by:'cox',ago:'3d',replies:44,views:'980',
   posts:[['cox','Won by six strokes. Freshman shot -9 over three rounds.'],['pete','The swing breakdown video on Mustangs+ was great.']]},
  {id:12,f:'boulevard',sport:null,title:'Mustangs+ app feature requests thread',by:'mike',ago:'4d',replies:131,views:'3.2k',
   posts:[['mike','Mine: picture-in-picture for live Q&As, and a dark mode.'],['grace','Push alerts when an athlete I follow posts.']]},
  {id:13,f:'hilltop',sport:'track-field',title:'XC regionals: 2nd place finish, what a run',by:'grace',ago:'4d',replies:37,views:'860',
   posts:[['grace','Huge day for the distance squad. Three runners in the top 20.']]},
  {id:14,f:'paddock',sport:'womens-basketball',title:'Film room: breaking down the new press',by:'staff',ago:'5d',replies:76,views:'2.1k',
   posts:[['staff','The new full-court press is aggressive. Here is how it works and why the staff thinks it fits this roster.'],['belle','Loved the telestrator clips.']]},
  {id:15,f:'hilltop',sport:'rowing',title:'First head race of the fall: varsity eight looked fast',by:'hank',ago:'6d',replies:21,views:'540',
   posts:[['hank','Great showing on the water. The 2V was a surprise too.']]},
  {id:16,f:'hilltop',sport:'tennis',title:'Fall invite results thread',by:'ray',ago:'1w',replies:18,views:'410',
   posts:[['ray','Two singles titles and a doubles final. Good sign for the spring.']]},
  {id:17,f:'hilltop',sport:'equestrian',title:'Equestrian 4-1! Anyone been to a meet?',by:'belle',ago:'1w',replies:29,views:'620',
   posts:[['belle','Went for the first time last week. Highly recommend, the riders are incredible.']]},
  {id:18,f:'hilltop',sport:'mens-soccer',title:"Men's soccer: must-win stretch to close the season",by:'dallas',ago:'1w',replies:55,views:'1.2k',
   posts:[['dallas','Three to play. Win two and we are in.']]}
];
