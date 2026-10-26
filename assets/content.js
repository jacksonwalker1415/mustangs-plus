/* SMU+ content library. Every story, person, recruit and portal name in this file is FICTIONAL,
   written for an SMU Cox class-project concept. Real places (Ford Stadium, Moody, the Boulevard) are used for setting only. */
window.MP = window.MP || {};
(function(){var MP=window.MP;
MP.CATS=[['all','All'],['watch','Watch'],['insider','Insider'],['recruiting','Recruiting'],['portal','Portal'],['film','Film Room'],['podcasts','Podcasts']];
MP.STAFF={sam:{n:'Sam Reyes',role:'SMU+ Insider'},lena:{n:'Lena Ortiz',role:'Features'},jt:{n:'J.T. Barlow',role:'Recruiting'},dre:{n:'Dre Coleman',role:'Film Room'}};

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
  'This fall he is starting at weakside linebacker. He also films a weekly vlog for SMU+, paid through the members\' NIL fund, which he says covers his half of an apartment off Greenville Avenue. "Two years ago I was paying to be here," he says. "I don\'t take any of it for granted."'),related:['building-roster','thursday-notes','visit-weekend']},
 'coachs-corner-acc':{by:'sam',date:'Oct. 18, 2026',dek:'What the second season in a power conference actually looks like from inside the building. The head coach in this story is fictional.',body:P(
  'The first year in the ACC was about showing up and proving the Mustangs belonged. Year two is different. Nobody sneaks up on anybody now, and every road crowd from Chestnut Hill to Berkeley has the date circled.',
  'The travel is the part fans underestimate. A trip to the West Coast means leaving Love Field on Thursday afternoon and landing after midnight Sunday morning. The staff rebuilt the week around it: a mandatory recovery day after long trips, a later Monday lift, and Tuesday film moved onto the flight home.',
  '"Guys are watching cut-ups at 35,000 feet," Coach Darren Ellsworth (fictional) said. "It\'s the only quiet two hours we get all week."',
  'Recruiting got easier in some places and harder in others. Kids from Houston and Atlanta now see SMU on the same Saturday slate as the programs they grew up watching. The flip side is that every one of those programs is recruiting the same kids, and they have been doing it for decades.',
  'The fan base has been the pleasant surprise. Red and blue sections have shown up in road stadiums all season, and the Mustang Band has traveled more than in any year staff can remember.',
  'Ellsworth\'s summary of year two was short. "Year one, people were curious about us. Now they\'re preparing for us. That\'s the job."'),related:['thursday-notes','film-pressure','building-roster']},
 'thursday-notes':{by:'sam',date:'Oct. 15, 2026',dek:'What I could see from the sideline during Thursday\'s practice, plus a couple of things I was asked not to write. (Fictional practice report.)',body:P(
  'Closed practice, but media and SMU+ staff get the first twenty minutes and the end of team period. Short version: the open week was used well.',
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
 {date:'Nov. 6',game:'vs. Virginia Tech (Fri.) · Ford Stadium',list:[['Jace Pemberton','QB','2028','Katy, TX',4,'Official','SMU lean'],['Tre Whitlock','DE','2028','Dallas, TX',4,'Unofficial','Top 5'],['Andre Kincaid','OT','2028','Tyler, TX',3,'Unofficial','Uncommitted'],['Malik Holloway','CB','2029','DeSoto, TX',3,'Unofficial','Uncommitted']]},
 {date:'Nov. 14',game:'vs. Wake Forest · Homecoming · Ford Stadium',list:[['Isaiah Calloway','S','2029','Mesquite, TX',4,'Unofficial','Uncommitted'],['Bryce Okoro','WR','2028','Frisco, TX',4,'Official','Committed elsewhere'],['Luis Quintero','OL','2028','San Antonio, TX',3,'Unofficial','SMU lean']]},
 {date:'Dec. 5',game:'Basketball · Moody Coliseum',list:[['Zion Abernathy','G','2027','Houston, TX',4,'Official','Top 3'],['Nia Ellison','G','2027','Plano, TX',4,'Official','SMU lean']]}];
/* Fictional insider notes */
MP.NOTES=[
 ['2h','Football','A 2028 defensive end (fictional) set an unofficial visit for the Virginia Tech game on Nov. 6. He has been on campus twice this fall.'],
 ['6h','Basketball','Expect one more guard in the 2027 class. Two names remain on the board, both visiting in December.'],
 ['1d','Portal','Offensive tackle is the top portal need in December, per multiple staff. The incoming board is longer than the outgoing one.'],
 ['2d','Football','The staff hosted 14 recruits for the Virginia game. Nine stayed through the band\'s postgame show.'],
 ['3d','Volleyball','A transfer outside hitter (fictional) visited last weekend and sat with the team at the soccer match.']];
})();

/* REAL 2026 SMU football schedule and results, from the official schedule page
   https://smumustangs.com/sports/football/schedule/2026 (checked Oct. 25, 2026).
   Kickoff is an ISO time with Central offset; null when SMU lists the time as TBD. TV is null when none is listed. */
MP.SCHEDULE={source:['SMU Athletics 2026 football schedule','https://smumustangs.com/sports/football/schedule/2026'],
 record:'6-1',conf:'4-1 ACC',streak:'W4',
 games:[
  {d:'2026-09-07',day:'Mon',opp:'Florida State',home:false,site:'Tallahassee, Fla.',ko:'2026-09-07T18:30:00-05:00',tv:'ESPN',res:'W 27-24'},
  {d:'2026-09-12',day:'Sat',opp:'UC Davis',home:true,site:'Gerald J. Ford Stadium, Dallas',ko:'2026-09-12T15:00:00-05:00',tv:'ACCNX',res:'W 56-10'},
  {d:'2026-09-19',day:'Sat',opp:'Louisville',home:false,site:'Louisville, Ky.',ko:'2026-09-19T14:30:00-05:00',tv:'ESPN2',res:'L 31-41'},
  {d:'2026-09-26',day:'Sat',opp:'Missouri State',home:true,site:'Gerald J. Ford Stadium, Dallas',ko:'2026-09-26T20:00:00-05:00',tv:'ACCN',res:'W 34-24'},
  {d:'2026-10-03',day:'Sat',opp:'Boston College',home:true,site:'Gerald J. Ford Stadium, Dallas',ko:'2026-10-03T11:00:00-05:00',tv:'CW & ESPN App',res:'W 25-16'},
  {d:'2026-10-17',day:'Sat',opp:'Virginia',home:true,site:'Gerald J. Ford Stadium, Dallas',ko:'2026-10-17T11:00:00-05:00',tv:'CW & ESPN App',res:'W 23-13'},
  {d:'2026-10-24',day:'Sat',opp:'Cal',home:true,site:'Gerald J. Ford Stadium, Dallas',ko:'2026-10-24T11:00:00-05:00',tv:'CW & ESPN App',res:'W 59-20'},
  {d:'2026-10-31',day:'Sat',opp:'Syracuse',home:false,site:'Syracuse, N.Y.',ko:'2026-10-31T11:00:00-05:00',tv:'ESPN2',res:null},
  {d:'2026-11-06',day:'Fri',opp:'Virginia Tech',home:true,site:'Gerald J. Ford Stadium, Dallas',ko:'2026-11-06T18:00:00-06:00',tv:'ESPN',res:null,note:'Club Takeaway · Wear Blue'},
  {d:'2026-11-14',day:'Sat',opp:'Wake Forest',home:true,site:'Gerald J. Ford Stadium, Dallas',ko:null,tv:null,res:null,note:'Homecoming · Senior Day'},
  {d:'2026-11-21',day:'Sat',opp:'Notre Dame',home:false,site:'South Bend, Ind.',ko:'2026-11-21T18:30:00-06:00',tv:'NBC and Peacock',res:null},
  {d:'2026-11-28',day:'Sat',opp:'Stanford',home:false,site:'Stanford, Calif.',ko:null,tv:null,res:null}],
 radio:'KTCK 96.7 FM/1310 AM & SiriusXM'};
/* Fictional fan commentary for the last result. The score and record are real; the opinions are invented for the concept. */
MP.HURRYUP={by:'sam',photo:{'2026-10-24':'cal-raphael'},title:'59 points and not much to argue about',takes:[
 'Four straight wins, 6-1 overall and 4-1 in the ACC. The Louisville night in September feels like a different season.',
 'Fifty-nine goes on the fridge. The real test is whether this offense can carry the same pace into an 11 a.m. kick in Syracuse, which is about as far from a Dallas Saturday as the ACC gets.',
 'Next home date is a Friday: Virginia Tech, Nov. 6, under the lights at Ford. Wear blue.']};

/* Photos supplied by the project owner. Credit: SMU Athletics. Files are resized WebP in assets/photos/.
   pos = object-position so faces and the ball stay in frame on tight crops. */
MP.PHOTOS={
 'ford':{file:'ford-stadium-night-fireworks.webp',small:'ford-stadium-night-fireworks-900.webp',pos:'50% 40%',alt:'Gerald J. Ford Stadium at night with fireworks over the north end zone and a full crowd'},
 'runout':{file:'team-runout-flames.webp',wide:'team-runout-flames-wide.webp',small:'team-runout-flames-900.webp',pos:'50% 42%',alt:'SMU football players in red uniforms run onto the field through smoke and flame cannons'},
 'jennings-celebrate':{file:'jennings-celebrates-missouri-state.webp',small:'jennings-celebrates-missouri-state-900.webp',pos:'55% 30%',alt:'Kevin Jennings, number 7 in red, celebrates with teammates against Missouri State'},
 'jennings-dropback':{file:'jennings-dropback-blue.webp',pos:'50% 22%',alt:'Kevin Jennings in a blue jersey with a captain patch drops back to pass'},
 'jennings-scramble':{file:'jennings-scramble-blue.webp',pos:'55% 35%',alt:'Kevin Jennings in blue runs to his right and points downfield'},
 'ol-59':{file:'ol-59-celebrates-blue.webp',pos:'40% 25%',alt:'SMU offensive lineman number 59 in blue raises both arms, with Kevin Jennings at the edge of the frame'},
 'raphael-carry':{file:'raphael-carry-dallas-jersey.webp',pos:'48% 30%',alt:'Kendrick Raphael, number 6, carries the ball in a blue jersey with Dallas across the chest'},
 /* Same SMU Athletics photo as the featured image on the official SMU vs. Cal recap (Oct. 24, 2026):
    smumustangs.com/news/2026/10/24/football-dominating-second-half-leads-smu-to-59-20-win-over-cal */
 'cal-raphael':{file:'raphael-carry-dallas-jersey.webp',pos:'50% 28%',alt:'Kendrick Raphael, number 6 in blue, carries the ball against Cal at Gerald J. Ford Stadium on Oct. 24, 2026'},
 'raphael-endzone':{file:'raphael-end-zone-blue.webp',pos:'50% 35%',alt:'Number 6 in blue runs through the end zone'},
 'kilgore':{file:'kilgore-captain-celebrates.webp',pos:'55% 25%',alt:'Alexander Kilgore, number 23 in blue with a captain patch, celebrates on the sideline'},
 'hurdle':{file:'rb-6-hurdle-red.webp',pos:'50% 40%',alt:'An SMU ball carrier in red hurdles a defender'},
 'carrier-2':{file:'ballcarrier-2-missouri-state.webp',pos:'55% 50%',alt:'SMU number 2 in red carries the ball against Missouri State'},
 'huddle':{file:'ol-huddle-bates-64.webp',pos:'50% 60%',alt:'SMU offensive linemen in blue huddle, with Bates, number 64, in the center'},
 'snap':{file:'qb-snap-blue.webp',pos:'50% 50%',alt:'An SMU quarterback in blue takes the snap from center'},
 'catch-cal':{file:'catch-contest-vs-cal.webp',pos:'45% 30%',alt:'An SMU receiver in blue goes up for a contested catch against Cal'},
 'hype':{file:'end-zone-crowd-hype.webp',pos:'55% 30%',alt:'A man with a microphone fires up the crowd in front of the Garrett Weber End Zone'},
 'vb-spike':{file:'vb-25-spike-wide.webp',small:'vb-25-spike-900.webp',pos:'60% 0%',alt:'An SMU volleyball player, number 25, swings at a high ball above the net at Moody Coliseum'},
 'swim':{file:'swim-breaststroke-wide.webp',small:'swim-breaststroke-900.webp',pos:'55% 45%',alt:'An SMU swimmer in a white SMU cap surges forward during a breaststroke race'},
 'storm':{file:'moody-court-storm-wide.webp',small:'moody-court-storm-900.webp',pos:'50% 50%',alt:'SMU fans pour onto the floor at Moody Coliseum after a basketball win'},
 'helmet':{file:'helmet-on-turf-card.webp',pos:'50% 50%',alt:'A white SMU football helmet with the red Mustang logo resting on the turf'},
 'moody-bowl':{file:'moody-bowl-mbb.webp',pos:'50% 55%',alt:'A packed Moody Coliseum seen from the upper deck during an SMU men\'s basketball game'},
 'wbb-jumper':{file:'wbb-2-jumper.webp',pos:'50% 35%',alt:'An SMU women\'s basketball player in white, number 2, rises for a jump shot'},
 'students':{file:'student-section-balloons.webp',wide:'student-section-balloons-wide.webp',small:'student-section-balloons-900.webp',pos:'50% 45%',alt:'The SMU student section waves red and blue balloons at a basketball game'},
 'mbb-jumper':{file:'mbb-3-jumper-vs-miami.webp',wide:'mbb-3-jumper-vs-miami-wide.webp',pos:'45% 30%',alt:'Corey Washington, number 3, rises for a jump shot against Miami at Moody Coliseum during the 2025-26 season'},
 'mbb-layup':{file:'mbb-24-layup-vs-miami.webp',pos:'50% 30%',alt:'SMU number 24 goes up for a layup against Miami'},
 'mbb-ft':{file:'mbb-5-free-throw.webp',pos:'50% 35%',alt:'SMU number 5 shoots a free throw'},
 /* Basketball 2026-27 official headshots from smumustangs.com roster pages (4:5). Mapped to players by MP.ROSTER_PHOTOS in athletes.js. */
 'mbb-hs-rowan-brumbaugh':{file:'mbb-rowan-brumbaugh-headshot-0.webp',small:'mbb-rowan-brumbaugh-headshot-0-900.webp',pos:'50% 22%',alt:'Rowan Brumbaugh, number 0, SMU men\'s basketball, official 2026-27 headshot'},
 'mbb-hs-jaden-toombs':{file:'mbb-jaden-toombs-headshot-1.webp',small:'mbb-jaden-toombs-headshot-1-900.webp',pos:'50% 22%',alt:'Jaden Toombs, number 1, SMU men\'s basketball, official 2026-27 headshot'},
 'mbb-hs-jacob-patrick':{file:'mbb-jacob-patrick-headshot-2.webp',small:'mbb-jacob-patrick-headshot-2-900.webp',pos:'50% 22%',alt:'Jacob Patrick, number 2, SMU men\'s basketball, official 2026-27 headshot'},
 'mbb-hs-jaylin-stewart':{file:'mbb-jaylin-stewart-headshot-3.webp',small:'mbb-jaylin-stewart-headshot-3-900.webp',pos:'50% 22%',alt:'Jaylin Stewart, number 3, SMU men\'s basketball, official 2026-27 headshot'},
 'mbb-hs-billy-white-iii':{file:'mbb-billy-white-iii-headshot-4.webp',small:'mbb-billy-white-iii-headshot-4-900.webp',pos:'50% 22%',alt:'Billy White III, number 4, SMU men\'s basketball, official 2026-27 headshot'},
 'mbb-hs-david-terrell-jr':{file:'mbb-david-terrell-jr-headshot-5.webp',small:'mbb-david-terrell-jr-headshot-5-900.webp',pos:'50% 22%',alt:'David Terrell Jr., number 5, SMU men\'s basketball, official 2026-27 headshot'},
 'mbb-hs-oziyah-sellers':{file:'mbb-oziyah-sellers-headshot-6.webp',small:'mbb-oziyah-sellers-headshot-6-900.webp',pos:'50% 22%',alt:'Oziyah Sellers, number 6, SMU men\'s basketball, official 2026-27 headshot'},
 'mbb-hs-jermaine-oneal-jr':{file:'mbb-jermaine-oneal-jr-headshot-7.webp',small:'mbb-jermaine-oneal-jr-headshot-7-900.webp',pos:'50% 22%',alt:'Jermaine O\'Neal Jr., number 7, SMU men\'s basketball, official 2026-27 headshot'},
 'mbb-hs-cameron-lomax':{file:'mbb-cameron-lomax-headshot-8.webp',small:'mbb-cameron-lomax-headshot-8-900.webp',pos:'50% 22%',alt:'Cameron Lomax, number 8, SMU men\'s basketball, official 2026-27 headshot'},
 'mbb-hs-gehrig-normand':{file:'mbb-gehrig-normand-headshot-9.webp',small:'mbb-gehrig-normand-headshot-9-900.webp',pos:'50% 22%',alt:'Gehrig Normand, number 9, SMU men\'s basketball, official 2026-27 headshot'},
 'mbb-hs-nic-codie':{file:'mbb-nic-codie-headshot-10.webp',small:'mbb-nic-codie-headshot-10-900.webp',pos:'50% 22%',alt:'Nic Codie, number 10, SMU men\'s basketball, official 2026-27 headshot'},
 'mbb-hs-jakub-szumert':{file:'mbb-jakub-szumert-headshot-13.webp',small:'mbb-jakub-szumert-headshot-13-900.webp',pos:'50% 22%',alt:'Jakub Szumert, number 13, SMU men\'s basketball, official 2026-27 headshot'},
 'mbb-hs-nigel-walls':{file:'mbb-nigel-walls-headshot-22.webp',small:'mbb-nigel-walls-headshot-22-900.webp',pos:'50% 22%',alt:'Nigel Walls, number 22, SMU men\'s basketball, official 2026-27 headshot'},
 'mbb-hs-johan-munch':{file:'mbb-johan-munch-headshot-24.webp',small:'mbb-johan-munch-headshot-24-900.webp',pos:'50% 22%',alt:'Johan Munch, number 24, SMU men\'s basketball, official 2026-27 headshot'},
 'mbb-hs-niccolo-kalischerstork':{file:'mbb-niccolo-kalischerstork-headshot-33.webp',small:'mbb-niccolo-kalischerstork-headshot-33-900.webp',pos:'50% 22%',alt:'Niccolo Kalischer-Stork, number 33, SMU men\'s basketball, official 2026-27 headshot'},
 'wbb-hs-izela-arenas':{file:'wbb-izela-arenas-headshot-0.webp',small:'wbb-izela-arenas-headshot-0-900.webp',pos:'50% 22%',alt:'Izela Arenas, number 0, SMU women\'s basketball, official 2026-27 headshot'},
 'wbb-hs-theresa-hagans-jr':{file:'wbb-theresa-hagans-jr-headshot-1.webp',small:'wbb-theresa-hagans-jr-headshot-1-900.webp',pos:'50% 22%',alt:'Theresa Hagans Jr., number 1, SMU women\'s basketball, official 2026-27 headshot'},
 'wbb-hs-zahra-king':{file:'wbb-zahra-king-headshot-2.webp',small:'wbb-zahra-king-headshot-2-900.webp',pos:'50% 22%',alt:'Zahra King, number 2, SMU women\'s basketball, official 2026-27 headshot'},
 'wbb-hs-shania-james':{file:'wbb-shania-james-headshot-4.webp',small:'wbb-shania-james-headshot-4-900.webp',pos:'50% 22%',alt:'Shania James, number 4, SMU women\'s basketball, official 2026-27 headshot'},
 'wbb-hs-zoe-osby':{file:'wbb-zoe-osby-headshot-5.webp',small:'wbb-zoe-osby-headshot-5-900.webp',pos:'50% 22%',alt:'Zoe Osby, number 5, SMU women\'s basketball, official 2026-27 headshot'},
 'wbb-hs-kinsea-grimes':{file:'wbb-kinsea-grimes-headshot-12.webp',small:'wbb-kinsea-grimes-headshot-12-900.webp',pos:'50% 22%',alt:'Kinsea Grimes, number 12, SMU women\'s basketball, official 2026-27 headshot'},
 'wbb-hs-mailien-rolf':{file:'wbb-mailien-rolf-headshot-13.webp',small:'wbb-mailien-rolf-headshot-13-900.webp',pos:'50% 22%',alt:'Mailien Rolf, number 13, SMU women\'s basketball, official 2026-27 headshot'},
 'wbb-hs-adja-kane':{file:'wbb-adja-kane-headshot-17.webp',small:'wbb-adja-kane-headshot-17-900.webp',pos:'50% 22%',alt:'Adja Kane, number 17, SMU women\'s basketball, official 2026-27 headshot'},
 'wbb-hs-camille-nesmith':{file:'wbb-camille-nesmith-headshot-19.webp',small:'wbb-camille-nesmith-headshot-19-900.webp',pos:'50% 22%',alt:'Camille Nesmith, number 19, SMU women\'s basketball, official 2026-27 headshot'},
 'wbb-hs-elise-hill':{file:'wbb-elise-hill-headshot-20.webp',small:'wbb-elise-hill-headshot-20-900.webp',pos:'50% 22%',alt:'Elise Hill, number 20, SMU women\'s basketball, official 2026-27 headshot'},
 'wbb-hs-kaylin-jackson':{file:'wbb-kaylin-jackson-headshot-21.webp',small:'wbb-kaylin-jackson-headshot-21-900.webp',pos:'50% 22%',alt:'Kaylin Jackson, number 21, SMU women\'s basketball, official 2026-27 headshot'},
 'wbb-hs-grace-ezebilo':{file:'wbb-grace-ezebilo-headshot-22.webp',small:'wbb-grace-ezebilo-headshot-22-900.webp',pos:'50% 22%',alt:'Grace Ezebilo, number 22, SMU women\'s basketball, official 2026-27 headshot'},
 'wbb-hs-roxy-white':{file:'wbb-roxy-white-headshot-42.webp',small:'wbb-roxy-white-headshot-42-900.webp',pos:'50% 22%',alt:'Roxy White, number 42, SMU women\'s basketball, official 2026-27 headshot'},
 'msoc':{file:'msoc-salute-night.webp',pos:'50% 62%',alt:'The SMU men\'s soccer team salutes the crowd under the lights'}};
(function(){var IMG={'boulevard-nights-1':'ford','boulevard-nights-2':'hype','hilltop-unfiltered':'hurdle','rivalry-week':'catch-cal','moody-opening':'moody-bowl','five-am-laps':'swim','film-rotation':'vb-spike','building-contender':'wbb-jumper',
 'film-pressure':'ol-59','film-screen':'snap','film-session-redzone':'carrier-2','building-roster':'huddle','pony-up-pod':'students'};
 MP.LIB.forEach(function(c){if(IMG[c.id])c.img=IMG[c.id]})})();
