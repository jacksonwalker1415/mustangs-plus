/* Mustangs+ content library. Every story, person, recruit and portal name in this file is FICTIONAL,
   written for an SMU Cox class-project concept. Real places (Ford Stadium, Moody, the Boulevard) are used for setting only. */
window.MP = window.MP || {};
(function(){var MP=window.MP;
MP.CATS=[['all','All'],['watch','Watch'],['insider','Insider'],['recruiting','Recruiting'],['portal','Portal'],['film','Film Room'],['podcasts','Podcasts']];
MP.STAFF={sam:{n:'Sam Reyes',role:'Mustangs+ Insider'},lena:{n:'Lena Ortiz',role:'Features'},jt:{n:'J.T. Barlow',role:'Recruiting'},dre:{n:'Dre Coleman',role:'Film Room'}};

/* tone = poster color, big = poster type */
MP.LIB=[
 {id:'boulevard-nights-1',t:'video',cat:'watch',label:'Docuseries · Ep. 1',title:'Boulevard Nights: The Tent Line',desc:'Six hours before kickoff, from the first canopy on Bishop Boulevard to the Mustang Band\'s walk.',dur:'21:40',lock:true,tone:'blue',big:'EP 01',isNew:true},
 {id:'boulevard-nights-2',t:'video',cat:'watch',label:'Docuseries · Ep. 2',title:'Boulevard Nights: Band Day',desc:'Three hundred instruments, one halftime show and a drumline that practices in the parking garage.',dur:'19:12',lock:true,tone:'black',big:'EP 02'},
 {id:'hilltop-unfiltered',t:'video',cat:'watch',label:'Video Series',title:'Hilltop Unfiltered: Fall Camp',desc:'Ep. 4 · Two-a-days, the cold tub and the meeting room nobody films. Until now.',dur:'24:18',lock:true,tone:'red',big:'CAMP'},
 {id:'rivalry-week',t:'video',cat:'watch',label:'Game Week',title:'Game Week Access: Rivalry Week',desc:'Walkthroughs on Thursday, film on Friday and the bus ride down Mockingbird to Ford Stadium.',dur:'18:02',lock:true,tone:'black',big:'WEEK 9'},
 {id:'five-am-laps',t:'video',cat:'watch',label:'Swimming & Diving',title:'5 a.m. Laps',desc:'Taper week at the natatorium, filmed before most of campus is awake.',dur:'12:55',lock:true,tone:'blue',big:'5:00'},
 {id:'micd-setter',t:'video',cat:'watch',label:"Mic'd Up",title:"Mic'd Up: The Setter",desc:'Every call, every timeout huddle and one very honest conversation with an official.',dur:'9:47',lock:false,tone:'red',big:'MIC\'D'},
 {id:'moody-opening',t:'video',cat:'watch',label:'Basketball',title:'Opening Night at Moody',desc:'Lights out, smoke on, and the walk from the locker room to the tunnel.',dur:'14:30',lock:true,tone:'black',big:'MOODY'},
 {id:'walk-on',t:'article',cat:'insider',label:'Feature',title:'From walk-on to Saturday starter',desc:'Four years, no scholarship, and a locker next to the laundry room.',dur:'8 min read',lock:true,tone:'white',big:'44'},
 {id:'coachs-corner-acc',t:'article',cat:'insider',label:"Coach's Corner",title:"Coach's Corner: Year two in the ACC",desc:'Longer flights, louder road stadiums and the recovery day nobody used to need.',dur:'7 min read',lock:false,tone:'blue',big:'ACC'},
 {id:'thursday-notes',t:'article',cat:'insider',label:'Practice Report',title:'Thursday notes: what changed after the open week',desc:'A new third-down personnel group, a kicker who finally relaxed, and a freshman who is not leaving the field.',dur:'5 min read',lock:true,tone:'black',big:'THU'},
 {id:'building-contender',t:'article',cat:'insider',label:'Interview',title:'Building a contender in 90 days',desc:"Women's basketball had six scholarship players in April. Here is how the staff got to fifteen.",dur:'6 min read',lock:false,tone:'white',big:'90'},
 {id:'visit-weekend',t:'article',cat:'recruiting',label:'Recruiting',title:'Visit Weekend: 48 hours on the Hilltop',desc:'Steak dinner in Uptown, a Saturday on the Boulevard and a very quiet Sunday brunch.',dur:'6 min read',lock:true,tone:'red',big:'48H'},
 {id:'recruiting-notebook',t:'article',cat:'recruiting',label:'Notebook',title:'Recruiting notebook: a Friday night in Dallas ISD',desc:'Three stadiums, two staff cars and one sophomore everybody is about to know.',dur:'5 min read',lock:true,tone:'blue',big:'FRI'},
 {id:'board-2028',t:'article',cat:'recruiting',label:'Big Board',title:'The 2028 board, as of late October',desc:'Where the (fictional) top targets stand, and which ones are coming back for an official visit.',dur:'7 min read',lock:true,tone:'black',big:'2028'},
 {id:'building-roster',t:'article',cat:'portal',label:'Portal',title:'Building the Roster: the whiteboard in the war room',desc:'Pencil, never marker. Inside the meeting where portal targets get ranked.',dur:'9 min read',lock:true,tone:'blue',big:'IN/OUT'},
 {id:'portal-primer',t:'article',cat:'portal',label:'Portal',title:'Portal season, explained without the jargon',desc:'What actually happens between the window opening and a kid showing up for spring ball.',dur:'6 min read',lock:false,tone:'white',big:'101'},
 {id:'film-pressure',t:'article',cat:'film',label:'Film Room',title:'Film Room: the third-down pressure that keeps working',desc:'Two linebackers show blitz, one drops, and the quarterback throws into a safety who never moved.',dur:'6 min read',lock:true,tone:'black',big:'3RD'},
 {id:'film-screen',t:'article',cat:'film',label:'Film Room',title:'Film Room: why the slot screen sets up everything',desc:'It gains four yards. Then it gains forty. A breakdown of one series against an ACC defense.',dur:'5 min read',lock:true,tone:'blue',big:'SCRN'},
 {id:'film-rotation',t:'article',cat:'film',label:'Film Room',title:'Film Room: volleyball\'s rotation four problem',desc:'The weak rotation every team has, and the serve-receive tweak that fixed ours.',dur:'5 min read',lock:false,tone:'red',big:'R4'},
 {id:'film-session-redzone',t:'video',cat:'film',label:'Film Session',title:'Film Session: red zone, frame by frame',desc:'A former linebacker on the telestrator for 20 minutes of goal-line snaps.',dur:'20:05',lock:true,tone:'black',big:'RZ'},
 {id:'coachs-corner-pod',t:'podcast',cat:'podcasts',label:'Podcast',title:"The Coach's Corner",desc:'Weekly with the head coach (fictional for this concept): scheme, recruiting and whatever went wrong Saturday.',dur:'41 min',lock:true,tone:'blue',big:'CC'},
 {id:'pony-up-pod',t:'podcast',cat:'podcasts',label:'Podcast',title:'Pony Up: The Locker Room Pod',desc:'Athletes host. Pregame playlists, roommate disputes and the best taco place on Lower Greenville.',dur:'33 min',lock:true,tone:'red',big:'PONY UP'},
 {id:'paddock-report',t:'podcast',cat:'podcasts',label:'Insider Pod',title:'The Paddock Report',desc:'Sam Reyes and J.T. Barlow on practice notes, visit lists and the portal rumor of the week.',dur:'52 min',lock:true,tone:'black',big:'TPR'},
 {id:'trail-live',t:'podcast',cat:'recruiting',label:'Podcast',title:'Recruiting Trail Live',desc:'Call-in show every Tuesday night. Yes, someone always asks about the kicker.',dur:'48 min',lock:false,tone:'white',big:'LIVE'}
];

var P=function(){return Array.prototype.slice.call(arguments)};
MP.ARTICLES={
 'walk-on':{by:'lena',date:'Oct. 21, 2026',dek:'No scholarship, no recruiting visit and a 5:30 a.m. alarm. A fictional linebacker on four years of earning a spot.',body:P(
  'Marcus Delgado\'s first SMU locker was the one by the laundry room, the one with the door that doesn\'t quite close. He was a preferred walk-on out of a 5A school north of Dallas, which in practice meant a parking pass, a practice jersey with no name on it and a promise that the coaches would look at him. (Delgado is a fictional athlete created for this concept.)',
  'For two seasons he played on the scout team. That meant pretending to be somebody else every week. In September he was a Clemson linebacker; in October he was whoever Louisville had at middle linebacker. He learned more defense that way than he had in four years of high school.',
  '"Coaches called him forty-four for most of a year because that was the number on the practice shirt," one staffer told us. "Then one day they just started calling him Marcus. That\'s usually how you know."',
  'The break came in fall camp of his third year, when a hamstring and a high ankle sprain thinned out the special teams depth chart in the same week. Delgado made three tackles on kick coverage in the first scrimmage at Ford Stadium. By the second week of the season he was on all four units.',
  'He was put on scholarship in the spring. He found out in a team meeting, which is how SMU tends to do it, and the room went off. His mother still has the video.',
  'This fall he is starting at weakside linebacker. He also films a weekly vlog for Mustangs+, paid through the members\' NIL fund, which he says covers his half of an apartment off Greenville Avenue. "Two years ago I was paying to be here," he says. "I don\'t take any of it for granted."'),related:['building-roster','thursday-notes','visit-weekend']},
 'coachs-corner-acc':{by:'sam',date:'Oct. 18, 2026',dek:'What the second season in a power conference actually looks like from inside the building. The head coach in this story is fictional.',body:P(
  'The first year in the ACC was about showing up and proving the Mustangs belonged. Year two is different. Nobody sneaks up on anybody now, and every road crowd from Chestnut Hill to Berkeley has the date circled.',
  'The travel is the part fans underestimate. A trip to the West Coast means leaving Love Field on Thursday afternoon and landing after midnight Sunday morning. The staff rebuilt the week around it: a mandatory recovery day after long trips, a later Monday lift, and Tuesday film moved onto the flight home.',
  '"Guys are watching cut-ups at 35,000 feet," Coach Darren Ellsworth (fictional) said. "It\'s the only quiet two hours we get all week."',
  'Recruiting got easier in some places and harder in others. Kids from Houston and Atlanta now see SMU on the same Saturday slate as the programs they grew up watching. The flip side is that every one of those programs is recruiting the same kids, and they have been doing it for decades.',
  'The fan base has been the pleasant surprise. Red and blue sections have shown up in road stadiums all season, and the Mustang Band has traveled more than in any year staff can remember.',
  'Ellsworth\'s summary of year two was short. "Year one, people were curious about us. Now they\'re preparing for us. That\'s the job."'),related:['thursday-notes','film-pressure','building-roster']},
 'thursday-notes':{by:'sam',date:'Oct. 15, 2026',dek:'What I could see from the sideline during Thursday\'s practice, plus a couple of things I was asked not to write. (Fictional practice report.)',body:P(
  'Closed practice, but media and Mustangs+ staff get the first twenty minutes and the end of team period. Short version: the open week was used well.',
  'The biggest change was on third down. The offense lined up in a five-receiver look I hadn\'t seen all year, with the tight end flexed out wide and the running back in the slot. It went against the scout defense four times and three of them were completions. Expect to see it in the next two weeks.',
  'The kicker looked loose. He hit from 47 and 51 in the period I watched, then made a 38-yarder with the whole team yelling at him from the sideline. That\'s new. Two weeks ago he was getting the silent treatment from the special teams coach, by design.',
  'The true freshman cornerback (fictional, like everyone in this report) never left the first team. He has played 40 snaps or more in each of the last three games and the staff clearly trusts him on an island.',
  'Injury-wise, nothing new. The starting left guard was in a green non-contact jersey but moving fine. I\'d call him probable.',
  'One more thing. The Mustang Band\'s drumline was practicing in the garage next door, and you could hear it from the field the entire time. A couple of defensive linemen were dancing between reps. Nobody stopped them.'),related:['film-pressure','film-screen','coachs-corner-acc']},
 'building-contender':{by:'lena',date:'Oct. 14, 2026',dek:'In April, women\'s basketball had six scholarship players. A fictional head coach on how the roster got rebuilt before summer workouts.',body:P(
  'Coach Renee Castillo (fictional) got the job on a Tuesday in early April. By Thursday she had a whiteboard in her office at Moody with six names on it and nine blank lines.',
  'She did not start with the portal. She started with what kind of team she wanted. "Defense, pace, and nobody who needs the ball to be happy," she said. "Then we went and found people who fit that."',
  'Four transfers came in over the next six weeks. Two were guards from mid-major programs who had led their teams in steals. One was a forward from a Big 12 school who wanted more minutes. One was a graduate student who wanted to finish her MBA at Cox and play one more year.',
  'Every recruit spent an evening with the returning players before signing, usually over dinner in Snider Plaza with no coaches at the table. Two prospects were told, politely, that it wasn\'t a fit.',
  'NIL came up with every family. Castillo\'s answer was the fan-funded model: members pay athletes for real work like youth camps, content and appearances, and the totals are published each quarter. "Parents ask because they should," she said. "I\'d rather explain it than have them wonder."',
  'The first real test is a November road game against a ranked opponent. Castillo scheduled it on purpose.'),related:['visit-weekend','portal-primer','building-roster']},
 'visit-weekend':{by:'jt',date:'Oct. 2, 2026',dek:'Forty-eight hours, one schedule and a decision that usually comes a week later. A recap of a fictional basketball official visit.',body:P(
  'Official visits run on a script, and the script starts at the airport. Two guards from the 2027 class landed at Love Field on a Friday afternoon. A staffer and two current players picked them up in a team van with the AC cranked. (Both recruits are fictional.)',
  'Dinner was at a steakhouse in Uptown. Players did most of the talking. The coaches mostly ate. "Recruits want to hear from the guys they\'ll sit next to on the bus," one staffer said. "Not from us."',
  'Saturday morning was the tour: academic advising in the Hughes-Trigg student center, a stop at the Cox School of Business, the training room and the weight room. After lunch the group walked the Boulevard before the football game. Somebody handed one of the guards a corny dog. He ate two.',
  'The football game was the loud part. Saturday night was the quiet part: a meeting with each family and the compliance office about academics, the schedule and the fan-funded NIL model, with real numbers on the table.',
  'Sunday was brunch in Highland Park and a last one-on-one with the head coach. Neither recruit committed on the visit. Eight days later, one of them did, on a video call with his grandmother in the room.'),related:['board-2028','recruiting-notebook','building-contender']},
 'recruiting-notebook':{by:'jt',date:'Oct. 10, 2026',dek:'Every Friday in the fall the staff splits up across North Texas. We rode along with one car. Every prospect named here is fictional.',body:P(
  'First stop was a 6 p.m. kickoff in Dallas ISD, a district game in a stadium shared by four high schools. The staff were there for a junior defensive end, Tre Whitlock, who had two sacks before halftime and then got sat for the rest of the night because the game was out of hand.',
  'Second stop was a suburban stadium off the Tollway with a video board bigger than some small colleges have. The target was a 2028 quarterback who threw a beautiful ball and also threw two interceptions into double coverage. The coach in the car said "he\'ll learn" and moved on.',
  'The best part of the night was an accident. At the third stadium the staff came to see a running back and left talking about his teammate, a sophomore safety named Isaiah Calloway. He had an interception, a forced fumble and a punt block, and he is 15 years old.',
  'Coaches can\'t talk to prospects at games during most of the calendar. They can be seen, though, and they make sure they are. Two SMU staff polos in the end zone tell a kid more than a text does.',
  'The car got back to campus at 11:40. The staff had a 7 a.m. meeting the next day before the home game.'),related:['board-2028','visit-weekend','portal-primer']},
 'board-2028':{by:'jt',date:'Oct. 24, 2026',dek:'Where the fictional 2028 targets stand heading into November. Names, schools and rankings here are made up for this class-project concept.',body:P(
  'It is early. Most 2028 prospects are juniors who haven\'t taken an official visit yet. Boards change every week, and anybody who tells you they know where a 16-year-old is going to college is guessing.',
  'At the top is a quarterback from the Houston suburbs, Jace Pemberton, who has been to campus twice unofficially. His father played college ball in the Southwest Conference and still talks about the old Cotton Bowl. That doesn\'t hurt.',
  'The defensive line board is the deepest it has been in years, mostly because the Dallas area is producing big, fast defensive linemen right now. The staff hosted three of them for the Virginia game. All three stayed for the band\'s postgame show.',
  'There are holes. The staff wants two offensive tackles and doesn\'t have a clear leader at either spot. Expect that to be a portal position again in December.',
  'Official visit season opens in the spring. Until then, the job is to be the program that shows up most often, and to make sure the kids who come to Ford Stadium for a game leave knowing someone noticed them.'),related:['recruiting-notebook','visit-weekend','building-roster']},
 'building-roster':{by:'jt',date:'Oct. 9, 2026',dek:'Inside a fictional roster meeting where scheme fit, retention and the NIL budget all end up on one whiteboard.',body:P(
  'There is a whiteboard in the football building with every scholarship spot on it, color-coded by position and eligibility. The staff call it the board. It is written in pencil, which is a rule, because nothing is final until paperwork is signed.',
  'In the meeting we\'re imagining here, the general manager (a fictional role, though many programs now have one) runs through the portal list position by position. Each target has three numbers: a fit grade from the position coach, a projected role and a cost.',
  '"A guy who fits what we do and wants to be in Dallas beats a higher-rated guy who\'s here for one year," the GM said. Not everyone in the room agreed, and they argued about a cornerback for twenty minutes.',
  'Retention takes up as much time as recruiting. In December the staff meet with every returning starter. Players can leave for more money somewhere else, and some do. Fan-funded NIL is one of the tools the program uses to keep the ones they want.',
  'By the end of the meeting there were three new names on the board. In pencil.'),related:['portal-primer','board-2028','walk-on']},
 'portal-primer':{by:'sam',date:'Oct. 6, 2026',dek:'A plain-language guide to how the transfer portal works, for fans who are tired of nodding along on the message board.',body:P(
  'The transfer portal is a database. That\'s it. When a player wants to transfer, his school enters his name, and from that moment other schools are allowed to contact him.',
  'Football has a main window in December after the regular season, and a shorter one in the spring. Players can only enter during a window unless there\'s a coaching change or another exception.',
  'Entering doesn\'t mean leaving. Some players enter to see what\'s out there and end up staying. Others enter on a Monday and commit somewhere new by Thursday because the deal was arranged before the window opened, which everyone knows happens and nobody admits.',
  'For fans, the useful thing to watch is the outgoing list in the first 48 hours. That tells you how happy the locker room is. The incoming list tells you what the staff thinks is broken.',
  'Our tracker on the Recruiting page logs every fictional move for this concept, in and out, with dates and positions. When something real happens, the official SMU announcement is the only source that counts.'),related:['building-roster','board-2028','visit-weekend']},
 'film-pressure':{by:'dre',date:'Oct. 20, 2026',dek:'The defense has been running one third-down look all month. Here is why it works, broken down snap by snap. (Fictional film breakdown.)',body:P(
  'Pre-snap, both inside linebackers walk up into the A gaps. To a quarterback that looks like a six-man pressure, so he calls a protection that slides toward them and keeps the back in to block.',
  'At the snap, only one of them comes. The other drops straight back into the middle of the field, right into the throwing lane for any slant or dig. Meanwhile the field-side defensive end, who looked like he was rushing, drops into the flat.',
  'So the offense has six blockers for four rushers, and the quarterback\'s first read is covered by a linebacker he thought was blitzing. On the clip from the second quarter you can see him pat the ball twice before he throws it away.',
  'The weakness is the boundary. If an offense motions the back out of the backfield, the drop linebacker has to choose between the back and the middle of the field. The good offenses have started doing that, so expect a counter-adjustment soon.',
  'One small detail worth rewinding: the free safety doesn\'t move until the ball is snapped. Quarterbacks read safeties first. Ours gives them nothing.'),related:['film-screen','thursday-notes','film-rotation']},
 'film-screen':{by:'dre',date:'Oct. 13, 2026',dek:'Four yards, then six, then forty. A fictional film breakdown of how one cheap play changes a whole drive.',body:P(
  'The first slot screen of the game went for four yards. Nobody in the stands noticed. The opposing nickel corner did, though, because he had to fight through a block from a 240-pound tight end to make the tackle.',
  'The second one went for six. This time the nickel came downhill faster, and the outside corner started creeping inside to help.',
  'That\'s the point of the play. On the next series, the offense showed the same formation and the same motion. The slot receiver took one step toward the screen, the nickel bit, and the receiver ran right past him on a wheel route. Forty-one yards.',
  'Coaches call this a constraint play. It isn\'t supposed to be a big gainer. It exists to punish defenders for doing what they\'re told, so that eventually they hesitate.',
  'Watch for it in the first quarter of the next home game. If the screen works early, a shot play is coming before halftime.'),related:['film-pressure','thursday-notes','coachs-corner-acc']},
 'film-rotation':{by:'dre',date:'Oct. 8, 2026',dek:'Every volleyball team has one rotation where it struggles to side out. A fictional breakdown of ours, and the fix.',body:P(
  'In volleyball, six players rotate through six spots, and in one of those rotations a team usually has its weakest attackers in the front row. For our team (fictional, like the players below) it was rotation four. Opponents knew it and served tough every time we got there.',
  'The numbers were ugly. Through the first eight matches the team sided out about 50 percent of the time in rotation four and close to 70 percent everywhere else.',
  'The staff\'s fix was a serve-receive change. The libero now takes a bigger share of the court, and the outside hitter who used to pass is released early to attack from the back row. The setter gets one more option, and the blockers on the other side have one more thing to think about.',
  'It\'s working so far. In the last five matches, rotation four has sided out at about the same rate as the rest of the lineup.',
  'Watch the libero on the next serve-receive. If she moves a step toward the line before the serve, that\'s the adjustment.'),related:['film-screen','film-pressure','building-contender']}
};

/* Fictional portal tracker */
MP.PORTAL={in:[
 ['Cole Ashford','OT','Gr.','North Plains State','Committed','Oct. 21'],['Darius Navarro','CB','Jr.','Gulf Coast','Committed','Oct. 18'],
 ['Reggie Sutton','DT','Sr.','Red River','Visited','Oct. 15'],['Elijah Merritt','WR','So.','Harbor State','Visit set','Oct. 12'],
 ['Tomas Kowalski','K','Jr.','Summit','Committed','Oct. 3']],
 out:[['Grant Fairbanks','RB','Jr.','Mesa A&M','Committed','Oct. 19'],['Owen Stratton','LB','So.','Undecided','Entered','Oct. 16'],
 ['Kai Treadwell','WR','R-Fr.','Cedar Ridge','Committed','Oct. 9'],['Hudson Lachance','QB','So.','Undecided','Entered','Oct. 4']]};
/* Fictional visit tracker */
MP.VISITS=[
 {date:'Nov. 7',game:'Home game · Ford Stadium',list:[['Jace Pemberton','QB','2028','Katy, TX',4,'Official','SMU lean'],['Tre Whitlock','DE','2028','Dallas, TX',4,'Unofficial','Top 5'],['Andre Kincaid','OT','2028','Tyler, TX',3,'Unofficial','Uncommitted'],['Malik Holloway','CB','2029','DeSoto, TX',3,'Unofficial','Uncommitted']]},
 {date:'Nov. 21',game:'Home game · Ford Stadium',list:[['Isaiah Calloway','S','2029','Mesquite, TX',4,'Unofficial','Uncommitted'],['Bryce Okoro','WR','2028','Frisco, TX',4,'Official','Committed elsewhere'],['Luis Quintero','OL','2028','San Antonio, TX',3,'Unofficial','SMU lean']]},
 {date:'Dec. 5',game:'Basketball · Moody Coliseum',list:[['Zion Abernathy','G','2027','Houston, TX',4,'Official','Top 3'],['Nia Ellison','G','2027','Plano, TX',4,'Official','SMU lean']]}];
/* Fictional insider notes */
MP.NOTES=[
 ['2h','Football','A 2028 defensive end (fictional) set an unofficial visit for Nov. 7. He has been on campus twice this fall.'],
 ['6h','Basketball','Expect one more guard in the 2027 class. Two names remain on the board, both visiting in December.'],
 ['1d','Portal','Offensive tackle is the top portal need in December, per multiple staff. The incoming board is longer than the outgoing one.'],
 ['2d','Football','The staff hosted 14 recruits for the Virginia game. Nine stayed through the band\'s postgame show.'],
 ['3d','Volleyball','A transfer outside hitter (fictional) visited last weekend and sat with the team at the soccer match.']];
})();
