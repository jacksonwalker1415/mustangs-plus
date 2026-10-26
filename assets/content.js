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
 {id:'rivalry-week',t:'video',cat:'watch',label:'Game Week',title:'Game Week Access: Rivalry Week',desc:'Thursday walkthrough, Friday film, and the short bus ride down Mockingbird to Ford Stadium.',dur:'18:02',lock:true,tone:'black',big:'GAME WEEK'},
 {id:'five-am-laps',t:'video',cat:'watch',label:'Swimming & Diving',title:'5 a.m. Laps',desc:'Taper week at the natatorium, filmed before most of campus is awake.',dur:'12:55',lock:true,tone:'blue',big:'5:00'},
 {id:'micd-setter',t:'video',cat:'watch',label:"Mic'd Up",title:"Mic'd Up: The Setter",desc:'Every call, every timeout huddle and one very honest conversation with an official.',dur:'9:47',lock:false,tone:'red',big:'MIC\'D'},
 {id:'moody-opening',t:'video',cat:'watch',label:'Basketball',title:'Opening Night at Moody',desc:'Lights out, smoke on, and the walk from the locker room to the tunnel.',dur:'14:30',lock:true,tone:'black',big:'MOODY'},
 {id:'walk-on',t:'article',cat:'insider',label:'Feature',title:'From walk-on to Saturday starter',desc:'Four years, no scholarship, and a locker next to the laundry room.',dur:'8 min read',lock:true,tone:'white',big:'44'},
 {id:'coachs-corner-acc',t:'article',cat:'insider',label:'Insider',title:'Year three in the ACC',desc:'Nobody is curious about SMU anymore. Longer flights, louder road stadiums and opponents who game-plan for the Mustangs.',dur:'7 min read',lock:false,tone:'blue',big:'ACC'},
 {id:'thursday-notes',t:'article',cat:'insider',label:'Practice Report',title:'Thursday notes: what changed after the open week',desc:'A five-wide look on third down, a kicker who finally relaxed, and a freshman corner who won\'t come off the field. A fictional practice report.',dur:'5 min read',lock:true,tone:'black',big:'THU'},
 {id:'building-contender',t:'article',cat:'insider',label:'Interview',title:'How a roster gets rebuilt in one spring',desc:'Portal windows, dinner tests and the NIL conversation. A fictional walk-through of how a modern staff fills a roster.',dur:'6 min read',lock:false,tone:'white',big:'90'},
 {id:'visit-weekend',t:'article',cat:'recruiting',label:'Recruiting',title:'Visit Weekend: 48 hours on the Hilltop',desc:'Steak dinner in Uptown, a Saturday on the Boulevard and a very quiet Sunday brunch.',dur:'6 min read',lock:true,tone:'red',big:'48H'},
 {id:'recruiting-notebook',t:'article',cat:'recruiting',label:'Notebook',title:'Recruiting notebook: a Friday night in Dallas ISD',desc:'Three stadiums, two staff cars and one sophomore everybody is about to know.',dur:'5 min read',lock:true,tone:'blue',big:'FRI'},
 {id:'board-2028',t:'article',cat:'recruiting',label:'Big Board',title:'The 2028 board, as of late October',desc:'Where the (fictional) top targets stand, and which ones are coming back for an official visit.',dur:'7 min read',lock:true,tone:'black',big:'2028'},
 {id:'building-roster',t:'article',cat:'portal',label:'Portal',title:'Building the Roster: the whiteboard in the war room',desc:'Pencil, never marker. Inside the meeting where portal targets get ranked, priced and argued about.',dur:'9 min read',lock:true,tone:'blue',big:'IN/OUT'},
 {id:'portal-primer',t:'article',cat:'portal',label:'Portal',title:'Portal season, explained without the jargon',desc:'The portal is just a database. Here\'s what happens between a name going in and a player arriving for spring ball.',dur:'6 min read',lock:false,tone:'white',big:'101'},
 {id:'film-pressure',t:'article',cat:'film',label:'Film Room',title:'Film Room: the third-down pressure that keeps working',desc:'Two linebackers show blitz, one drops, and the quarterback throws into a safety who never moved.',dur:'6 min read',lock:true,tone:'black',big:'3RD'},
 {id:'film-screen',t:'article',cat:'film',label:'Film Room',title:'Film Room: why the slot screen sets up everything',desc:'Four yards, then six, then 41. A fictional breakdown of how one cheap play gets a defense out of position.',dur:'5 min read',lock:true,tone:'blue',big:'SCRN'},
 {id:'film-rotation',t:'article',cat:'film',label:'Film Room',title:'Film Room: volleyball\'s rotation four problem',desc:'The weak rotation every team has, and the serve-receive tweak that fixes it. A fictional breakdown.',dur:'5 min read',lock:false,tone:'red',big:'R4'},
 {id:'film-session-redzone',t:'video',cat:'film',label:'Film Session',title:'Film Session: red zone, frame by frame',desc:'A former linebacker on the telestrator for 20 minutes of goal-line snaps.',dur:'20:05',lock:true,tone:'black',big:'RZ'},
 {id:'coachs-corner-pod',t:'podcast',cat:'podcasts',label:'Podcast',title:'The Sideline Hour',desc:'Weekly with the SMU+ football desk: scheme, the week ahead and whatever went wrong Saturday. A concept show with fictional hosts.',dur:'41 min',lock:true,tone:'blue',big:'CC'},
 {id:'pony-up-pod',t:'podcast',cat:'podcasts',label:'Podcast',title:'Pony Up: The Locker Room Pod',desc:'Athletes host. Pregame playlists, roommate disputes and the best taco place on Lower Greenville.',dur:'33 min',lock:true,tone:'red',big:'PONY UP'},
 {id:'paddock-report',t:'podcast',cat:'podcasts',label:'Insider Pod',title:'The Paddock Report',desc:'Sam Reyes and J.T. Barlow on practice notes, game previews and the rumor of the week.',dur:'52 min',lock:true,tone:'black',big:'TPR'},
 {id:'trail-live',t:'podcast',cat:'recruiting',label:'Podcast',title:'Recruiting Trail Live',desc:'Call-in show every Tuesday night. Yes, someone always asks about the kicker.',dur:'48 min',lock:false,tone:'white',big:'LIVE'}
];

var P=function(){return Array.prototype.slice.call(arguments)};
MP.ARTICLES={
 'walk-on':{by:'lena',date:'Oct. 21, 2026',dek:'No scholarship, no recruiting visit and a 5:30 a.m. alarm. A fictional linebacker on four years of earning a spot.',body:P(
  'Marcus Delgado\'s first SMU locker was the one by the laundry room, the one with the door that doesn\'t quite close. He was a preferred walk-on out of a 5A school north of Dallas, which in practice meant a parking pass, a practice jersey with no name on it and a promise that the coaches would look at him. (Delgado is a fictional athlete created for this concept.)',
  'For two seasons he played on the scout team. That meant pretending to be somebody else every week. One week he was a Florida State linebacker; the next he was whoever Louisville had at middle linebacker. He learned more defense that way than he had in four years of high school.',
  '"Coaches called him forty-four for most of a year because that was the number on the practice shirt," one staffer told us. "Then one day they just started calling him Marcus. That\'s usually how you know."',
  'The break came in fall camp of his third year, when a hamstring and a high ankle sprain thinned out the special teams depth chart in the same week. Delgado made three tackles on kick coverage in the first scrimmage at Ford Stadium. By the second week of the season he was on all four units.',
  'He was put on scholarship in the spring. He found out in a team meeting, which is how SMU tends to do it, and the room went off. His mother still has the video.',
  'This fall he is starting at weakside linebacker. He also films a weekly vlog under an NIL deal disclosed through the NIL Go clearinghouse, which he says covers his half of an apartment off Greenville Avenue. "Two years ago I was paying to be here," he says. "I don\'t take any of it for granted."'),related:['building-roster','thursday-notes','visit-weekend']},
 'coachs-corner-acc':{by:'sam',date:'Oct. 18, 2026',dek:'What a third season in a power conference looks like from inside the building. The staffer quoted in this story is fictional.',body:P(
  'Year one in the ACC was about proving the Mustangs belonged. Year two was about proving it wasn\'t a fluke. Year three is different. Nobody sneaks up on anybody now, and every road crowd from Tallahassee to South Bend has the date circled.',
  'The travel is the part fans underestimate. A trip to the West Coast means leaving Love Field on Thursday afternoon and landing after midnight Sunday morning. The staff rebuilt the week around it: a mandatory recovery day after long trips, a later Monday lift, and Tuesday film moved onto the flight home.',
  '"Guys are watching cut-ups at 35,000 feet," a football operations staffer (fictional) told us. "It\'s the only quiet two hours we get all week."',
  'Recruiting got easier in some places and harder in others. Kids from Houston and Atlanta now see SMU on the same Saturday slate as the programs they grew up watching. The flip side is that every one of those programs is recruiting the same kids, and they have been doing it for decades.',
  'The fan base has been the pleasant surprise. Red and blue sections have shown up in road stadiums all season, and the Mustang Band has traveled more than in any year staff can remember.',
  'The same staffer put it in one line. "Year one, people were curious about us. Now they\'re preparing for us. That\'s the job."'),related:['thursday-notes','film-pressure','building-roster']},
 'thursday-notes':{by:'sam',date:'Oct. 15, 2026',dek:'What I could see from the sideline during Thursday\'s practice, plus a couple of things I was asked not to write. (Fictional practice report.)',body:P(
  'Closed practice, but media and SMU+ staff get the first twenty minutes and the end of team period. Short version: the open week was used well.',
  'The biggest change was on third down. The offense lined up in a five-receiver look I hadn\'t seen all year, with the tight end flexed out wide and the running back in the slot. It went against the scout defense four times and three of them were completions. Expect to see it in the next two weeks.',
  'The kicker looked loose. He hit from 47 and 51 in the period I watched, then made a 38-yarder with the whole team yelling at him from the sideline. That\'s new. Two weeks ago he was getting the silent treatment from the special teams coach, by design.',
  'The true freshman cornerback (fictional, like everyone in this report) never left the first team. He has played 40 snaps or more in each of the last three games and the staff clearly trusts him on an island.',
  'Injury-wise, nothing new. The starting left guard was in a green non-contact jersey but moving fine. I\'d call him probable.',
  'One more thing. The Mustang Band\'s drumline was practicing in the garage next door, and you could hear it from the field the entire time. A couple of defensive linemen were dancing between reps. Nobody stopped them.'),related:['film-pressure','film-screen','coachs-corner-acc']},
 'building-contender':{by:'lena',date:'Oct. 14, 2026',dek:'A fictional, composite walk-through of how a modern staff rebuilds a roster in one spring. It does not describe SMU\'s real coaches or players.',body:P(
  'Picture a whiteboard in an office at Moody in early April: a handful of returning names, and a lot of blank lines. That is where every spring rebuild starts now. (This story is a composite written for the SMU+ concept. No real coach, player or recruit is described.)',
  'The good staffs don\'t start with the portal. They start with a sentence about the team they want to be, something like defense, pace and nobody who needs the ball to be happy, and then they go looking for players who fit it.',
  'In our composite, four transfers arrive over six weeks: two guards from mid-major programs who led their teams in steals, a forward from a bigger conference looking for minutes, and a graduate student who wants to finish an MBA at Cox and play one more year.',
  'Every recruit spends an evening with the returning players before signing, usually over dinner in Snider Plaza with no coaches at the table. Some prospects are told, politely, that it isn\'t a fit. That dinner tells a staff more than any highlight tape does.',
  'NIL comes up with every family. The answer runs through SMU\'s official NIL and revenue-sharing programs: athletes are paid for real work like youth camps, content and appearances, and deals are disclosed through the NIL Go clearinghouse.',
  'By the first summer workout the whiteboard is full, written in pencil. Nothing is final until it\'s signed.'),related:['visit-weekend','portal-primer','building-roster']},
 'visit-weekend':{by:'jt',date:'Oct. 2, 2026',dek:'Forty-eight hours, one schedule and a decision that usually comes a week later. A recap of a fictional basketball official visit.',body:P(
  'Official visits run on a script, and the script starts at the airport. Two guards from the 2027 class landed at Love Field on a Friday afternoon. A staffer and two current players picked them up in a team van with the AC cranked. (Both recruits are fictional.)',
  'Dinner was at a steakhouse in Uptown. Players did most of the talking. The coaches mostly ate. "Recruits want to hear from the guys they\'ll sit next to on the bus," one staffer said. "Not from us."',
  'Saturday morning was the tour: academic advising in the Hughes-Trigg student center, a stop at the Cox School of Business, the training room and the weight room. After lunch the group walked the Boulevard before the football game. Somebody handed one of the guards a corny dog. He ate two.',
  'The football game was the loud part. Saturday night was the quiet part: a meeting with each family and the compliance office about academics, the schedule and SMU\'s official NIL programs, with real numbers on the table.',
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
  'A handful of official visits land this fall, on the Virginia Tech and Wake Forest weekends. For everyone else, the job is to be the program that shows up most often, and to make sure the kids who come to Ford Stadium for a game leave knowing someone noticed them.'),related:['recruiting-notebook','visit-weekend','building-roster']},
 'building-roster':{by:'jt',date:'Oct. 9, 2026',dek:'Inside a fictional roster meeting where scheme fit, retention and the NIL budget all end up on one whiteboard.',body:P(
  'There is a whiteboard in the football building with every scholarship spot on it, color-coded by position and eligibility. The staff call it the board. It is written in pencil, which is a rule, because nothing is final until paperwork is signed.',
  'In the meeting we\'re imagining here, the general manager (a fictional role, though many programs now have one) runs through the portal list position by position. Each target has three numbers: a fit grade from the position coach, a projected role and a cost.',
  '"A guy who fits what we do and wants to be in Dallas beats a higher-rated guy who\'s here for one year," the GM said. Not everyone in the room agreed, and they argued about a cornerback for twenty minutes.',
  'Retention takes up as much time as recruiting. In December the staff meet with every returning starter. Players can leave for more money somewhere else, and some do. SMU\'s official NIL and revenue-sharing programs are among the tools the program uses to keep the ones they want.',
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
  'In this fictional breakdown, rotation four is the one where the team struggles to side out, and opponents know it. They serve there on purpose.',
  'The staff\'s fix was a serve-receive change. The libero now takes a bigger share of the court, and the outside hitter who used to pass is released early to attack from the back row. The setter gets one more option, and the blockers on the other side have one more thing to think about.',
  'That\'s the idea, anyway. The fix is cheap, and you can see it from the stands.',
  'Watch the libero on the next serve-receive. If she moves a step toward the line before the serve, that\'s the adjustment.'),related:['film-screen','film-pressure','building-contender']}
};

/* Timely game coverage (Oct. 26, 2026). SOURCED pieces: every fact traces to the SMU Athletics pages in each
   article's sources list. No quotes. These need the per-article sourced footer in app.js openArticle. */
(function(){
 var FB='https://smumustangs.com/sports/football/schedule/2026',CAL='https://smumustangs.com/news/2026/10/24/football-dominating-second-half-leads-smu-to-59-20-win-over-cal',ESPN='https://www.espn.com/college-football/player/';
 var cards=[
  /* expires: ISO time (the kickoff) after which a preview leaves lists, rails, search and Up next. Read by app.js only once admin-edits/expiring-previews.patch lands; until then it does nothing. */
  {id:'preview-syracuse',t:'article',cat:'insider',label:'Game Preview',title:'SMU at Syracuse: one trip north, then back to the lights',desc:'Four straight wins, a 42-0 second half in the rearview and the only road date in a seven-week stretch. Sat., 11 a.m. CT, ESPN2.',dur:'4 min read',lock:false,tone:'blue',big:'@CUSE',isNew:true,expires:'2026-10-31T11:00:00-05:00'},
  {id:'preview-msoc-louisville',t:'article',cat:'insider',label:"Men's Soccer · Preview",title:"Fourteen games, no losses: men's soccer hosts Louisville",desc:'Ten clean sheets, 41 goals and a Friday night on ACC Network. The unbeaten Mustangs come home to Washburne.',dur:'3 min read',lock:false,tone:'black',big:'12-0-2',isNew:true,expires:'2026-10-30T18:30:00-05:00'},
  {id:'vb-road-sweep',t:'article',cat:'insider',label:'Volleyball',title:'Six sets, zero dropped: volleyball sweeps its way out of a rough week',desc:'Two home losses, then straight-set wins at Clemson and Georgia Tech. Two more road matches, then four straight at Moody.',dur:'3 min read',lock:false,tone:'red',big:'3-0',isNew:true}];
 var at=0;for(var i=0;i<MP.LIB.length;i++)if(MP.LIB[i].id==='walk-on'){at=i;break}
 Array.prototype.splice.apply(MP.LIB,[at,0].concat(cards));

 MP.ARTICLES['preview-syracuse']={by:'SMU+ Staff',date:'Oct. 26, 2026',sourced:true,
  sources:[['SMU Athletics 2026 football schedule',FB],['SMU Athletics Cal recap and game notes, Oct. 24',CAL],['ESPN: Kevin Jennings',ESPN+'stats/_/id/5084084/kevin-jennings'],['ESPN: Kendrick Raphael',ESPN+'_/id/4899368/kendrick-raphael'],['ESPN: Yamir Knight',ESPN+'stats/_/id/5121750/yamir-knight']],
  dek:'SMU takes a four-game win streak and a record-setting quarterback into the JMA Wireless Dome. Then it comes home to stay. Sat., Oct. 31 · 11 a.m. CT (noon ET) · ESPN2 · Radio: KTCK 96.7 FM/1310 AM & SiriusXM.',
  related:['preview-msoc-louisville','vb-road-sweep','film-pressure'],body:[
  "Look at the calendar and Saturday stands out. From the last week of September to the middle of November, SMU plays six of seven games at Gerald J. Ford Stadium. Syracuse is the one exception. It's an 11 a.m. Central kick in upstate New York, a long way from a Dallas Saturday.",
  "The Mustangs head north at 6-1 and 4-1 in the ACC. They've won four straight since the 41-31 loss at Louisville on Sept. 19. They came into the Cal game ranked No. 23, and they left with a 59-20 win.",
  "How it got to 59 matters more than the number. SMU trailed 20-17 at halftime. After the break the Mustangs scored touchdowns on their first six drives and held Cal scoreless, a 42-0 half. Cal's first three possessions of the third quarter were three-and-outs. SMU had 306 of its 492 yards after halftime.",
  "Kevin Jennings set SMU's career record for touchdown passes in that game and now has 74. His 2026 line is 156 of 215 for 2,062 yards, 19 touchdowns and five interceptions. He's completing 72.6 percent of his passes, up from 66.1 percent in 2025. Kendrick Raphael has run for 100 yards in back-to-back games (119 against Virginia, 104 against Cal) and leads the team with 641 rushing yards and eight rushing touchdowns. Yamir Knight has 38 catches for 443 yards out of the slot and also returns punts.",
  "The early kick shouldn't be a problem. SMU has played three 11 a.m. games this season, against Boston College, Virginia and Cal, and won all three. Those were all at home, though. On the road this year the Mustangs are 1-1: a 27-24 win at Florida State in the opener and the loss at Louisville.",
  "The last time these teams met was Oct. 4, 2025, in Dallas. SMU won 31-18.",
  "What to watch, first: the first half. SMU trailed Cal at halftime and needed a 42-0 second half to fix it. On the road, a cleaner first two quarters would mean not needing another rescue.",
  "Second: fourth down. Two of Raphael's three touchdowns against Cal came on fourth down. Expect this staff to go for it again. Third: the red zone. SMU has scored on 32 of 37 red-zone trips this season.",
  "The road trip is short. SMU comes home for a Friday-night game against Virginia Tech on Nov. 6 (6 p.m. CT, ESPN; Wear Blue), then plays Wake Forest on Nov. 14 for Homecoming and Senior Day. Win in Syracuse and the Mustangs come back to Ford with a five-game streak and two home games left."]};

 MP.ARTICLES['preview-msoc-louisville']={by:'SMU+ Staff',date:'Oct. 26, 2026',sourced:true,
  sources:[['SMU Athletics 2026 men\'s soccer schedule','https://smumustangs.com/sports/mens-soccer/schedule/2026'],['SMU Athletics men\'s soccer roster','https://smumustangs.com/sports/mens-soccer/roster/2026'],['Recap: SMU 2, Cal 0','https://smumustangs.com/news/2026/10/24/mens-soccer-no-1-smu-wins-2-0-at-cal-grabs-10th-clean-sheet-of-the-season'],['Recap: SMU 5, Central Arkansas 2','https://smumustangs.com/news/2026/10/20/mens-soccer-soghomonian-hat-trick-no-1-smu-downs-uca-5-2'],['Recap: SMU 1, NC State 0','https://smumustangs.com/news/2026/9/18/mens-soccer-panozzo-winner-no-5-smu-takes-down-nc-state-in-acc-home-opener'],['Recap: SMU 2, LMU 0','https://smumustangs.com/news/2026/8/28/mens-soccer-villagomez-winner-no-5-smu-wins-2-0-against-lmu']],
  dek:'SMU has gone 14 matches without a loss. Louisville comes to Washburne on Friday for the last home match of the regular season. Fri., Oct. 30 · 6:30 p.m. CT · ACC Network.',
  related:['preview-syracuse','vb-road-sweep','film-rotation'],body:[
  "Fourteen matches in, the 2026 SMU men's soccer team hasn't lost. It's 12-0-2 overall and 6-0-1 in the ACC. SMU Athletics has listed the Mustangs at No. 1 since early October.",
  "The defense is the main reason. SMU has allowed five goals all season and shut out 10 opponents, including the 2-0 win at Cal last Saturday. The attack has 41 goals. Six of them came against Duke on Oct. 10 and six more against Houston Christian in August.",
  "There have been big early results. On Aug. 24 SMU won 4-0 at No. 4 Saint Louis. In ACC play it has won at Pitt, Virginia Tech, Wake Forest and Cal. The only blemishes are a 1-1 draw with Kansas City and a 0-0 draw with No. 25 Stanford on Oct. 16.",
  "The goals have come from all over the roster. Stephan Soghomonian, a junior forward from Santa Clarita, Calif., had a hat trick in the 5-2 win over Central Arkansas on Oct. 20. Enzo Panozzo, a graduate defender from Sarasota, Fla., scored the only goal against NC State in the ACC home opener. Joseluis Villagomez, a freshman defender from El Paso, scored the winner against LMU in August.",
  "Louisville is the last match on SMU's regular-season schedule. If the Mustangs avoid a loss, they finish the regular season unbeaten, at home, under the lights."]};

 MP.ARTICLES['vb-road-sweep']={by:'SMU+ Staff',date:'Oct. 26, 2026',sourced:true,
  sources:[['SMU Athletics 2026 volleyball schedule','https://smumustangs.com/sports/womens-volleyball/schedule/2026'],['SMU Athletics volleyball roster','https://smumustangs.com/sports/womens-volleyball/roster/2026'],['Recap: SMU sweeps Florida State','https://smumustangs.com/news/2026/10/18/volleyball-livings-11-kills-leads-no-5-smu-in-sweep-of-florida-state'],['Recap: SMU stuns No. 2 Pitt','https://smumustangs.com/news/2026/10/7/volleyball-no-6-smu-stuns-no-2-pitt-ends-nations-longest-home-winning-streak'],['Recap: SMU at Colorado State','https://smumustangs.com/news/2026/8/29/davis-22-kill-performance-leads-no-11-msutangs-past-colorado-state']],
  dek:'Two home losses in three matches put a dent in SMU\'s season. Then came two road sweeps without dropping a set. At 16-4 and 8-2 in the ACC, the Mustangs head into two more road matches before four straight at Moody.',
  related:['film-rotation','micd-setter','preview-msoc-louisville'],body:[
  "The middle of October was rough for SMU. On Oct. 11, No. 2 Pitt swept the Mustangs at Moody Coliseum, four days after SMU had won 3-1 in Pittsburgh and ended the nation's longest home winning streak. Then Miami beat SMU in five sets on Oct. 16.",
  "SMU hasn't dropped a set since. It swept Florida State at home on Oct. 18, with Jadyn Livings, a junior outside/opposite hitter from The Colony, Texas, leading the way with 11 kills. Then it won 3-0 at Clemson on Oct. 23 and 3-0 at Georgia Tech on Oct. 25.",
  "That puts SMU at 16-4 overall and 8-2 in the ACC. It also has a nonconference résumé few teams can match: wins over No. 8 Texas A&M, No. 9 Texas and No. 3 Kentucky before the end of September, and a 3-0 win over No. 12 Stanford to open ACC play.",
  "Suli Davis, a sophomore outside hitter from Euless, Texas, set the tone back in August with a 22-kill match at Colorado State.",
  "Up next: at NC State on Fri., Oct. 30 (6 p.m. CT, ACCNX) and at Wake Forest on Sun., Nov. 1 (noon CT, ACCNX). Then SMU plays four straight at Moody: North Carolina on Fri., Nov. 6 at noon, Duke on Sun., Nov. 8 at noon, Louisville on Nov. 12 (7 p.m. CT, ESPNU) and Notre Dame on Nov. 15.",
  "If you're at Ford on Friday, Nov. 6, for Virginia Tech, the UNC match at Moody starts at noon that day."]};
})();

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
/* ---------- Content batch 1 (Oct. 26, 2026) ----------
   1) Official SMU Athletics videos. Embed-only YouTube IDs from SMU's official channel (@SMUMustangs), checked via
      YouTube oEmbed on Oct. 26, 2026. Never download or rehost. yt = video ID, credit is shown with the player.
      They share the "SMU Athletics:" title prefix, so the watch page lists them together as one series (Up next).
   2) Sourced pieces (sourced:true + sources).
   3) MP.ACCESS: hand-picked "All Access" items per sport page (replaces the templated three cards; see app.js edit list). */
(function(){
 var YT='https://www.youtube.com/watch?v=',CAL='https://smumustangs.com/news/2026/10/24/football-dominating-second-half-leads-smu-to-59-20-win-over-cal',ESPN='https://www.espn.com/college-football/player/';
 function V(id,yt,label,title,desc,dur,lock,tone,big){return {id:id,t:'video',cat:'watch',label:label,title:title,desc:desc,dur:dur,lock:lock,tone:tone,big:big,isNew:true,
  yt:yt,src:YT+yt,credit:'Video: SMU Athletics',channel:['SMU Mustangs on YouTube','https://www.youtube.com/@SMUMustangs'],real:true}}
 var vids=[
  V('smu-fb-cal-highlights','LB5w29jU2eo','Football · Official highlights','SMU Athletics: Football highlights vs. Cal','Down 20-17 at the half, then 42 unanswered. Official highlights from the 59-20 win at Ford Stadium, Oct. 24.','7:59',false,'red','59-20'),
  V('smu-fb-uva-highlights','NvnyYRJyu_8','Football · Official highlights','SMU Athletics: Football highlights vs. Virginia','The 23-13 win over Virginia on Oct. 17, the day Kendrick Raphael ran for 119.','8:00',false,'blue','23-13'),
  V('smu-msoc-cal-highlights','lKfL7DCU0-c',"Men's Soccer · Official highlights","SMU Athletics: Men's soccer highlights at Cal",'Berkeley, Oct. 24: a 2-0 win, the tenth clean sheet of an unbeaten season.','4:00',false,'black','2-0'),
  V('smu-vb-gt-highlights','RijJO1t8894','Volleyball · Official highlights','SMU Athletics: Volleyball highlights at Georgia Tech','Atlanta, Oct. 25. Straight sets, the second road sweep in three days.','6:16',false,'red','3-0'),
  V('smu-micd-up-s2e6','XQQceIGoFzc',"Mic'd Up · Members","SMU Athletics: Mustangs Mic'd Up, Season 2, Episode 6","SMU's own series puts the microphones on. This episode features Kyle Ward, Riley Dodge and head coach Rhett Lashlee.",'42:51',true,'black','MIC\'D')];
 Array.prototype.splice.apply(MP.LIB,[0,0].concat(vids));

 function at(id){for(var i=0;i<MP.LIB.length;i++)if(MP.LIB[i].id===id)return i;return MP.LIB.length}
 var reads=[
  {id:'recap-cal',t:'article',cat:'insider',label:'Recap',title:'Forty-two unanswered: how SMU turned a halftime deficit into 59-20',desc:'Down 20-17 at the break, the Mustangs scored on six straight drives and Kevin Jennings took the school record for touchdown passes.',dur:'4 min read',lock:false,tone:'red',big:'42-0',isNew:true},
  {id:'feature-raphael',t:'article',cat:'insider',label:'Player Feature',title:"Same opponent, other sideline: Kendrick Raphael's full circle",desc:'Last November his late touchdown beat SMU. On Saturday he scored three for the Mustangs against the team he left.',dur:'4 min read',lock:false,tone:'black',big:'#6',isNew:true},
  {id:'feature-jennings-record',t:'article',cat:'insider',label:'Player Feature',title:'Seventy-four: Kevin Jennings and the record Oak Cliff built',desc:'Twenty-two passes as a freshman. Now the most touchdown passes in SMU history. Five seasons, by the numbers.',dur:'4 min read',lock:true,tone:'blue',big:'74',isNew:true}];
 Array.prototype.splice.apply(MP.LIB,[at('walk-on'),0].concat(reads));

 MP.ARTICLES['recap-cal']={by:'SMU+ Staff',date:'Oct. 25, 2026',sourced:true,sources:[['SMU Athletics recap, scoring summary and game notes, Oct. 24',CAL],['SMU Athletics 2026 football schedule','https://smumustangs.com/sports/football/schedule/2026']],
  dek:'Cal led at halftime. After that the Bears didn\'t score again, and Kevin Jennings set the school record for touchdown passes.',
  related:['smu-fb-cal-highlights','feature-raphael','feature-jennings-record'],body:[
  "At halftime it looked like last November all over again. Cal led 20-17 after Towns McGough's field goal ended the half. That was the same Cal team that won 38-35 in last season's finale and kept SMU out of the ACC Championship Game.",
  "Then came the second half. SMU scored a touchdown on each of its first six possessions, and Cal didn't score at all. The Bears went three-and-out on their first three drives of the third quarter. By the final whistle it was 59-20, and the second half alone was 42-0.",
  "According to SMU's postgame notes, that's only the third time since 1996 that an ACC team has outscored an FBS opponent 42-0 or more in a second half, and the second time in a conference game. SMU gained 306 of its 492 yards after the break.",
  "Kevin Jennings tied SMU's career record for touchdown passes in the first quarter. On fourth down, he hit Kendrick Raphael for a 22-yard score. He broke it on SMU's second drive of the second half with a 21-yarder to Derrick McFall and added a 17-yarder to Jalen Hale later in the half. Jennings now has 74 career touchdown passes, passing the 72 Tanner Mordecai threw in 2021-22. He finished 16 of 23 for 223 yards with three touchdowns. He also leads SMU in career passing yards (9,771), completions (781) and total offense (10,451).",
  "Raphael scored the winning touchdown for Cal against SMU last November, a 2-yard run in the final minute. On Saturday he ran 22 times for 104 yards against the Bears and scored three touchdowns, two of them on fourth down. His 1-yard run tied the game 17-17 with 1:57 left in the first half. It was his second straight 100-yard game. The last Mustang to do that was Brashard Smith in 2024.",
  "Christian Rhodes had touchdown runs of 5 and 3 yards, Raphael added another 1-yarder, and EJ Kelly finished it with a 10-yard run. Brendan Baird made all eight extra points and a 29-yard field goal. The defense had eight tackles for loss and three sacks.",
  "By the numbers: 6-1 overall and 4-1 in the ACC, with four straight wins. 11-0 at home in ACC games since joining the league in 2024, and 18-3 in ACC games overall. 24-2 in the last 26 home games. Jennings is 25-8 as SMU's starter.",
  "Next: at Syracuse, Sat., Oct. 31, 11 a.m. CT, ESPN2. It's SMU's only road game in a seven-week stretch."]};

 MP.ARTICLES['feature-raphael']={by:'SMU+ Staff',date:'Oct. 26, 2026',sourced:true,sources:[['SMU Athletics Cal recap and game notes, Oct. 24',CAL],['SMU Athletics football roster','https://smumustangs.com/sports/football/roster'],['ESPN: Kendrick Raphael',ESPN+'_/id/4899368/kendrick-raphael'],['cfbstats 2026 rushing log','https://cfbstats.com/2026/player/663/2001305/rushing/gamelog.html'],['Sports-Reference: SMU 2026','https://www.sports-reference.com/cfb/schools/southern-methodist/2026.html']],
  dek:'Last November, Kendrick Raphael scored the 2-yard touchdown that beat SMU and kept it out of the ACC title game. Eleven months later he was wearing No. 6 for the Mustangs, and he ran over the team he used to play for.',
  related:['recap-cal','smu-fb-cal-highlights','feature-jennings-record'],body:[
  "The last time Kendrick Raphael played against SMU, he beat the Mustangs. On Nov. 29, 2025, in the regular-season finale, he scored on a 2-yard run in the final minute to give Cal a 38-35 win. That loss kept SMU out of the ACC Championship Game for the second year in a row.",
  "On Oct. 24, 2026, he played Cal again. This time he was a senior in SMU blue.",
  "In the first quarter he caught a 22-yard touchdown pass from Kevin Jennings on fourth down. That throw tied SMU's career record for touchdown passes. With 1:57 left before halftime, on another fourth down, Raphael scored from 1 yard out to tie the game 17-17. In the second half he added another 1-yard touchdown during SMU's 42-0 run. He finished with 22 carries for 104 yards and three touchdowns: two rushing, one receiving. According to SMU's game notes, it was the first game of his career with both a rushing and a receiving touchdown.",
  "Raphael is from Naples, Florida. He came to SMU after stops at NC State and Cal and is listed at 5-11 and 201 pounds. In his final season at Cal he carried 232 times for 943 yards and 13 touchdowns.",
  "At SMU he's been the lead back from the start. Through seven games he leads the team with 121 carries for 641 yards and eight rushing touchdowns. He also has 10 catches for 94 yards and a receiving score.",
  "His best game came against Louisville on Sept. 19: 24 carries, 197 yards and three touchdowns. SMU lost 41-31 that day, the only loss of its season.",
  "The Cal game was Raphael's second straight 100-yard game, after 119 yards against Virginia on Oct. 17. It was his third 100-yard game of the season and the sixth of his career. According to SMU, no Mustang had put together back-to-back 100-yard games since Brashard Smith did it against Pitt and Boston College in 2024.",
  "Game by game in 2026: 75 yards at Florida State, 3 and a touchdown against UC Davis, 197 and three at Louisville, 98 and one against Missouri State, 45 and one against Boston College, 119 against Virginia, 104 and two against Cal.",
  "Next is Syracuse on Saturday, the only road game in SMU's seven-week stretch. Raphael's best game this season came on the road."]};

 MP.ARTICLES['feature-jennings-record']={by:'SMU+ Staff',date:'Oct. 26, 2026',sourced:true,sources:[['SMU Athletics Cal recap and game notes, Oct. 24',CAL],['ESPN: Kevin Jennings stats',ESPN+'stats/_/id/5084084/kevin-jennings'],['ESPN: 2026 game log',ESPN+'gamelog/_/id/5084084/kevin-jennings/type/college-football/year/2026'],['SMU Athletics: Pony Express Award watch list','https://smumustangs.com/news/2026/10/15/jennings-knight-named-to-pony-express-award-watch-list']],
  dek:'He\'s from Oak Cliff and went to South Oak Cliff High School. As a freshman, Jennings threw 22 passes. Now he holds SMU\'s career records for touchdown passes, passing yards and total offense.',
  related:['recap-cal','feature-raphael','smu-fb-cal-highlights'],body:[
  "Jennings's freshman season in 2022 was 17 completions on 22 attempts, 205 yards and one touchdown. That's one good quarter for a starter. In 2023 he threw 105 passes. Two years later, the program's passing records belong to him.",
  "The one that moved on Oct. 24 is touchdown passes. Jennings tied SMU's career mark on a 22-yard fourth-down throw to Kendrick Raphael in the first quarter against Cal. He broke it in the second half on a 21-yarder to Derrick McFall and added a 17-yarder to Jalen Hale. That gave him 74, two more than the 72 Tanner Mordecai threw in 2021-22.",
  "He already held the records for passing yards (9,771) and completions (781). He also extended the record for total offense, now 10,451 yards, and for touchdowns responsible for, now 86 (74 passing, 12 rushing).",
  "The climb, season by season. 2022: 205 yards, 1 touchdown. 2023: 618 yards, 5 touchdowns. 2024: 3,245 yards, 23 touchdowns, 11 interceptions. 2025: 3,641 yards, 26 touchdowns, 13 interceptions. 2026, through Oct. 24: 2,062 yards, 19 touchdowns, 5 interceptions.",
  "2026 is his best year as a starter. He's completing 72.6 percent of his passes, up from 65.0 in 2024 and 66.1 in 2025. He has five interceptions in 215 attempts, after 13 in 454 last season. His passer rating is 177.8, up from 146.6.",
  "The games that made the line: 430 yards and three touchdowns in the 27-24 opener at Florida State. Five touchdowns on 14-of-16 passing against UC Davis. 439 yards on 33-of-39 against Missouri State. Then the record against Cal: 16 of 23, 223 yards, three touchdowns.",
  "This is Jennings's third season as SMU's starter, and the Mustangs are 25-8 with him in that role. In October he and Yamir Knight were named to the Pony Express Award watch list.",
  "He has five regular-season games left, starting Saturday at Syracuse. Every touchdown pass from here adds to the record."]};

 /* Hand-written "All Access" picks for each sport page. Strings are MP.LIB ids (missing ids are skipped).
    Objects are sport-only cards, sourced from that program's SMU Athletics schedule (sources on each). */
 var SCH=function(p,y){return 'https://smumustangs.com/sports/'+p+'/schedule/'+(y||'2026-27')};
 function N(slug,big,tone,title,desc,dek,src,body){var id='notes-'+slug;MP.ARTICLES[id]={by:'SMU+ Staff',date:'Oct. 26, 2026',sourced:true,sources:src,dek:dek,body:body};
  return {id:id,t:'article',cat:'insider',label:'Season Notes',title:title,desc:desc,dur:'2 min read',lock:false,tone:tone,big:big}}
 MP.ACCESS={
  'football':['preview-syracuse','smu-fb-cal-highlights','recap-cal','feature-raphael'],
  'mens-soccer':['preview-msoc-louisville','smu-msoc-cal-highlights'],
  'volleyball':['vb-road-sweep','smu-vb-gt-highlights','smu-micd-up-s2e6'],
  'mens-basketball':[N('mens-basketball','NOV 2','black',"Six at Moody, then the desert",'Southern opens the season on Nov. 2. Six straight home games, then LSU and Utah State in Palm Desert over Thanksgiving.',
   "Andy Enfield's Mustangs open at home and stay there for most of November. Then the schedule gets loud.",[['SMU Athletics men\'s basketball schedule',SCH('mens-basketball')]],[
   "The regular season starts Monday, Nov. 2, against Southern at Moody Coliseum (7 p.m. CT, ACCNX). It's the first of six straight home games: Southern, VMI, Prairie View A&M, Ball State, Oral Roberts and South Alabama, all before Nov. 21.",
   "Then SMU goes west for the Acrisure Series Thanksgiving Event at Acrisure Arena in Palm Desert, Calif.: Utah State on Nov. 25 and LSU on Nov. 26, both at 6 p.m. CT on CBSSN.",
   "December brings the tests: at DePaul on Dec. 5 (TNT), Minnesota in the Dallas Duel in Frisco on Dec. 12, UNLV in Phoenix on Dec. 19, and Oklahoma at Moody on Dec. 22 (ESPNU). ACC play opens Jan. 2 at Virginia."]),'moody-opening'],
  'womens-basketball':[N('womens-basketball','83-60','red','One exhibition down, November at Moody','An 83-60 exhibition win, one more tune-up, then the opener against Le Moyne on Nov. 3.',
   "Adia Barnes's team has played once at Moody and won. Here's what comes next.",[['SMU Athletics women\'s basketball schedule',SCH('womens-basketball')]],[
   "SMU beat West Texas A&M 83-60 in an exhibition at Moody Coliseum on Oct. 21. One more exhibition comes first: UNT Dallas on Tuesday, Oct. 27, at 6:30 p.m. CT.",
   "The regular season opens Nov. 3 against Le Moyne (6:30 p.m. CT, ACCNX), the first of five straight home games. The first road trip is Nov. 17 at Kansas State (ESPN+). The Mustangs then face Saint Mary's (Nov. 23) and Memphis (Nov. 25) at the Comerica Center in Frisco.",
   "ACC play starts at home on Nov. 29 against Virginia (5 p.m. CT, ACCN). Georgia visits Moody on Dec. 2."]),'building-contender'],
  'womens-soccer':[N('womens-soccer','3-1','blue','Three goals in Berkeley, two to play','A 3-1 win at Cal gave SMU its first ACC win. North Carolina on the road, then Pitt at Washburne.',
   'The ACC has been hard on SMU this fall. Cal was the breakthrough, and two matches remain.',[['SMU Athletics women\'s soccer schedule',SCH('womens-soccer','2026')]],[
   "SMU is 6-6-4 overall and 1-5-2 in the ACC. The one ACC win came on Oct. 22, 3-1 at Cal.",
   "Outside the conference, the Mustangs went 5-1-2, with a 6-0 win over Idaho State and a 5-1 win over Incarnate Word. They opened with a 4-3 loss at No. 5 Vanderbilt and held No. 6 Stanford to a 0-0 draw in September.",
   "Two regular-season matches remain: at North Carolina on Thursday, Oct. 29 (6 p.m. CT, ACCNX), and at home against Pitt on Thursday, Nov. 5 (6 p.m. CT, ACCNX) at Washburne."])],
  'swimming-diving':[N('swimming-diving','3-1','blue','A road split in Arizona, then TCU twice','The men won at Arizona and the women took on two ranked teams in the desert. Next up is TCU, home and away.',
   'Both teams went to Arizona. Here is how the fall stands, and where to find them next.',[['SMU Athletics men\'s swimming and diving schedule',SCH('mens-swimming-and-diving')],['SMU Athletics women\'s swimming and diving schedule',SCH('womens-swimming-and-diving')]],[
   "The men are 3-1 in dual meets. They beat Oklahoma Christian and Incarnate Word at home on Oct. 2, lost at Arizona State on Oct. 22 and won at Arizona, 155-144, a day later.",
   "The women are 2-2. They swept the same home meet on Oct. 2, then faced No. 18 Arizona State and No. 22 Arizona on the road. Both teams placed third at the SMU Classic on Oct. 9.",
   "Next: the women swim at TCU on Oct. 30 (6 p.m. CT), and the men host TCU at Robson & Lindley Aquatics Center on Nov. 4 (4 p.m. CT). The women visit FGCU on Nov. 7, and both teams host the SMU Invite on Nov. 18-21."]),'five-am-laps'],
  'golf':[N('golf','5TH','white','Four tournaments, four top-six finishes','The women never finished outside the top six this fall. The men open the spring at The Prestige in February.',
   'The fall season is wrapping up. Here are the results, and the spring dates worth circling.',[['SMU Athletics women\'s golf schedule',SCH('womens-golf')],['SMU Athletics men\'s golf schedule',SCH('mens-golf')]],[
   "The women finished T4th of 17 in Seattle, T5th of 13 at the Haskins Intercollegiate, T6th of 17 at the Stanford Intercollegiate and 5th of 18 at the Landfall Tradition.",
   "The men played the Jackson T. Stephens Cup (5th of 6), the William H. Tucker Invitational and their own Trinity Forest Invitational in Dallas (10th of 17).",
   "Spring dates to circle: the women host the Huntington Bank Collegiate in Dallas in April and an NCAA Regional in Dallas in May. The men's ACC Championship is in Carrollton, Texas, in April."])],
  'tennis':[N('tennis','FALL','white','Fall is for individuals','No team scores until spring. This week the men host the Ralston/Neufeld Coaches Challenge, and ITA Sectionals follow.',
   'College tennis in the fall is individual events, and this week\'s schedule runs from Dallas to Querétaro.',[['SMU Athletics men\'s tennis schedule',SCH('mens-tennis')],['SMU Athletics women\'s tennis schedule',SCH('womens-tennis')]],[
   "The men host the Ralston/Neufeld Coaches Challenge at the Styslinger/Altec Tennis Complex from Oct. 29 to Nov. 1.",
   "The women's schedule lists the W100 in New Braunfels and the WTA 125 in Querétaro, Mexico, this week, then the ASU Thunderbird Invitational from Oct. 30.",
   "Nov. 5-8 is ITA week: Sectionals (men in College Station, women in Fort Worth) and the ITA Conference Masters. The NCAA individual championships in Athens, Ga., are on the calendar for mid-November."])],
  'track-field':[N('track-field','XC','blue','Two wins, then the ACC','SMU cross country won twice in September. The ACC Championships are Friday in Blacksburg.',
   'The postseason starts Friday. The NCAA meet is back on a course SMU already raced in October.',[['SMU Athletics cross country schedule',SCH('womens-cross-country','2026')]],[
   "SMU won the John McKenzie Invitational in Fort Worth and the Texas A&M Invitational, 1st of 15, in September. It was 4th of 20 at the Cowboy Jamboree and 18th of 43 at the Pre-National Invitational in Terre Haute.",
   "The ACC Cross Country Championships are Friday, Oct. 30, in Blacksburg, Va.",
   "The NCAA South Central Regional is Nov. 13 on the Watts course in College Station, where SMU won in September. The NCAA Championships are Nov. 21 in Terre Haute, on the course from the Pre-National meet."])],
  'rowing':[N('rowing','NOV 8','blue','From the Charles to White Rock Lake','After the Head of the Charles in October, the fall\'s only home race: Texas, at White Rock Lake, Nov. 8.',
   'One home date this fall, and it\'s against the team down the road.',[['SMU Athletics rowing schedule',SCH('rowing')]],[
   "SMU raced the Head of the Charles in Cambridge, Mass., on Oct. 17.",
   "The only home date this fall is Sunday, Nov. 8: an exhibition against Texas at White Rock Lake & Boathouse in Dallas. The 2026-27 roster lists 47 athletes."])],
  'equestrian':[N('equestrian','1-2','red','Home at last: Georgia and Oklahoma State','After three road meets, SMU rides at the Dallas Equestrian Center on Nov. 6 and 7.',
   'The fall opened on the road. The first home weekend is next week.',[['SMU Athletics equestrian schedule',SCH('equestrian')]],[
   "SMU is 1-2. It lost 10-9 at South Carolina, beat TCU 12-7 in Columbia, S.C., and lost 12-7 at Auburn.",
   "Next is a trip to Texas A&M on Oct. 29. Then come the first home meets of the season at the Dallas Equestrian Center: Georgia on Friday, Nov. 6, and Oklahoma State on Saturday, Nov. 7. The fall ends at Fresno State on Nov. 14."])]};
})();
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
/* Postgame card for the last result. SOURCED: SMU Athletics recap, Oct. 24, 2026
   (smumustangs.com/news/2026/10/24/football-dominating-second-half-leads-smu-to-59-20-win-over-cal). The card label in app.js gameStrip() still says
   "Fictional fan commentary"; see the content batch 1 edit list. */
MP.HURRYUP={photo:{'2026-10-24':'cal-raphael'},sourced:true,title:'Down three at the half. Up 42-0 after it.',takes:[
 'Cal led 20-17 at halftime. SMU scored touchdowns on its first six second-half drives and didn\'t allow a point.',
 'Kevin Jennings threw three touchdowns and now holds the SMU career record with 74. Kendrick Raphael ran for 104 yards and three scores against his former team.',
 'Next: at Syracuse on Sat., Oct. 31, 11 a.m. CT, ESPN2. It\'s the only road game in a seven-week stretch.']};

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
 'mcfall-hs':{file:'mcfall-headshot-0.webp',small:'mcfall-headshot-0-900.webp',pos:'50% 22%',alt:'Derrick McFall, number 0, in SMU\'s blue home uniform, official 2026-27 headshot'},
 'knight-hs':{file:'knight-headshot-8.webp',small:'knight-headshot-8-900.webp',pos:'50% 22%',alt:'Yamir Knight, number 8, in SMU\'s blue home uniform, official 2026-27 headshot'},
 /* Ahmaad Moses has no 2026-27 headshot on smumustangs.com; this is his 2025 headshot, taken when he wore number 3 (he wears 7 now). */
 'moses-hs':{file:'moses-headshot-3-2025.webp',small:'moses-headshot-3-2025-900.webp',pos:'50% 22%',alt:'Ahmaad Moses in SMU\'s blue uniform, 2025 headshot from when he wore number 3'},
 'raphael-bc':{file:'raphael-carry-boston-college.webp',small:'raphael-carry-boston-college-900.webp',pos:'40% 30%',alt:'Kendrick Raphael, number 6 in blue, carries the ball against Boston College on Oct. 3, 2026'},
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
 /* Sport-page heroes (SMU Athletics photos from smumustangs.com). Wired up in the HERO_PH map in app.js. */
 'wbb-drive':{file:'wbb-2-drive-vs-notre-dame-wide.webp',small:'wbb-2-drive-vs-notre-dame-900.webp',pos:'45% 30%',alt:'An SMU women\'s basketball player, number 2 in white, sizes up the defense against Notre Dame at Moody Coliseum'},
 'wsoc':{file:'wsoc-13-dribble-vs-virginia-wide.webp',small:'wsoc-13-dribble-vs-virginia-900.webp',pos:'55% 45%',alt:'SMU\'s number 13 in blue dribbles toward a Virginia defender'},
 'golf':{file:'wgolf-haskins-fairway-wide.webp',small:'wgolf-haskins-fairway-900.webp',pos:'50% 20%',alt:'SMU women\'s golfers walk the fairway beside their SMU golf bags at the Haskins Intercollegiate'},
 'tennis':{file:'wten-mustang-ready-wide.webp',small:'wten-mustang-ready-900.webp',pos:'35% 30%',alt:'An SMU women\'s tennis player in a black Mustang top readies her racket'},
 'track':{file:'tf-ncaa-west-stride-wide.webp',small:'tf-ncaa-west-stride-900.webp',pos:'70% 35%',alt:'An SMU runner in red races down the straightaway at the NCAA West First Round'},
 'rowing':{file:'rowing-eight-blue-blades-wide.webp',small:'rowing-eight-blue-blades-900.webp',pos:'65% 40%',alt:'An SMU rowing crew with blue Mustang blades pulls through calm water'},
 'equestrian':{file:'eq-practice-arena-wide.webp',small:'eq-practice-arena-900.webp',pos:'40% 45%',alt:'SMU equestrian riders work their horses in a covered arena at practice'},
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
 /* Roster headshots: football, volleyball, men\'s soccer, swimming & diving (SMU Athletics roster pages, 4:5). Mapped by MP.ROSTER_PHOTOS in athletes.js. */
 'fb-hs-william-nettles':{file:'fb-william-nettles-headshot-0.webp',small:'fb-william-nettles-headshot-0-900.webp',pos:'50% 22%',alt:'William Nettles, number 0, SMU football, official 2026 headshot'},
 'fb-hs-ty-hawkins':{file:'fb-ty-hawkins-headshot-1.webp',small:'fb-ty-hawkins-headshot-1-900.webp',pos:'50% 22%',alt:'Ty Hawkins, number 1, SMU football, official 2026 headshot'},
 'fb-hs-jarvis-lee':{file:'fb-jarvis-lee-headshot-1.webp',small:'fb-jarvis-lee-headshot-1-900.webp',pos:'50% 22%',alt:'Jarvis Lee, number 1, SMU football, official 2026 headshot'},
 'fb-hs-zadian-gentry':{file:'fb-zadian-gentry-headshot-2.webp',small:'fb-zadian-gentry-headshot-2-900.webp',pos:'50% 22%',alt:'Zadian Gentry, number 2, SMU football, official 2026 headshot'},
 'fb-hs-jalen-hale':{file:'fb-jalen-hale-headshot-2.webp',small:'fb-jalen-hale-headshot-2-900.webp',pos:'50% 22%',alt:'Jalen Hale, number 2, SMU football, official 2026 headshot'},
 'fb-hs-javion-holiday':{file:'fb-javion-holiday-headshot-3.webp',small:'fb-javion-holiday-headshot-3-900.webp',pos:'50% 22%',alt:'Javion Holiday, number 3, SMU football, official 2026 headshot'},
 'fb-hs-yannick-smith':{file:'fb-yannick-smith-headshot-3.webp',small:'fb-yannick-smith-headshot-3-900.webp',pos:'50% 22%',alt:'Yannick Smith, number 3, SMU football, official 2026 headshot'},
 'fb-hs-dramekco-green':{file:'fb-dramekco-green-headshot-4.webp',small:'fb-dramekco-green-headshot-4-900.webp',pos:'50% 22%',alt:'Dramekco Green, number 4, SMU football, official 2026 headshot'},
 'fb-hs-jayvon-thomas':{file:'fb-jayvon-thomas-headshot-4.webp',small:'fb-jayvon-thomas-headshot-4-900.webp',pos:'50% 22%',alt:'Jayvon Thomas, number 4, SMU football, official 2026 headshot'},
 'fb-hs-malcolm-alcorncrowder':{file:'fb-malcolm-alcorncrowder-headshot-5.webp',small:'fb-malcolm-alcorncrowder-headshot-5-900.webp',pos:'50% 22%',alt:'Malcolm Alcorn-Crowder, number 5, SMU football, official 2026 headshot'},
 'fb-hs-randy-pittman-jr':{file:'fb-randy-pittman-jr-headshot-5.webp',small:'fb-randy-pittman-jr-headshot-5-900.webp',pos:'50% 22%',alt:'Randy Pittman Jr., number 5, SMU football, official 2026 headshot'},
 'fb-hs-tavion-atkinson':{file:'fb-tavion-atkinson-headshot-6.webp',small:'fb-tavion-atkinson-headshot-6-900.webp',pos:'50% 22%',alt:'Tavion Atkinson, number 6, SMU football, official 2026 headshot'},
 'fb-hs-kendrick-raphael':{file:'fb-kendrick-raphael-headshot-6.webp',small:'fb-kendrick-raphael-headshot-6-900.webp',pos:'50% 22%',alt:'Kendrick Raphael, number 6, SMU football, official 2026 headshot'},
 'fb-hs-kevin-jennings':{file:'fb-kevin-jennings-headshot-7.webp',small:'fb-kevin-jennings-headshot-7-900.webp',pos:'50% 22%',alt:'Kevin Jennings, number 7, SMU football, official 2026 headshot'},
 'fb-hs-marcellus-barnes-jr':{file:'fb-marcellus-barnes-jr-headshot-8.webp',small:'fb-marcellus-barnes-jr-headshot-8-900.webp',pos:'50% 22%',alt:'Marcellus Barnes Jr., number 8, SMU football, official 2026 headshot'},
 'fb-hs-ira-singleton-iv':{file:'fb-ira-singleton-iv-headshot-9.webp',small:'fb-ira-singleton-iv-headshot-9-900.webp',pos:'50% 22%',alt:'Ira Singleton IV, number 9, SMU football, official 2026 headshot'},
 'fb-hs-zack-turner':{file:'fb-zack-turner-headshot-9.webp',small:'fb-zack-turner-headshot-9-900.webp',pos:'50% 22%',alt:'Zack Turner, number 9, SMU football, official 2026 headshot'},
 'fb-hs-jalen-cooper':{file:'fb-jalen-cooper-headshot-10.webp',small:'fb-jalen-cooper-headshot-10-900.webp',pos:'50% 22%',alt:'Jalen Cooper, number 10, SMU football, official 2026 headshot'},
 'fb-hs-tyren-polley-jr':{file:'fb-tyren-polley-jr-headshot-10.webp',small:'fb-tyren-polley-jr-headshot-10-900.webp',pos:'50% 22%',alt:'Tyren Polley Jr., number 10, SMU football, official 2026 headshot'},
 'fb-hs-carterrious-brown':{file:'fb-carterrious-brown-headshot-11.webp',small:'fb-carterrious-brown-headshot-11-900.webp',pos:'50% 22%',alt:'Carterrious Brown, number 11, SMU football, official 2026 headshot'},
 'fb-hs-jaden-millinerjones':{file:'fb-jaden-millinerjones-headshot-11.webp',small:'fb-jaden-millinerjones-headshot-11-900.webp',pos:'50% 22%',alt:'Jaden Milliner-Jones, number 11, SMU football, official 2026 headshot'},
 'fb-hs-caden-marshall':{file:'fb-caden-marshall-headshot-12.webp',small:'fb-caden-marshall-headshot-12-900.webp',pos:'50% 22%',alt:'Caden Marshall, number 12, SMU football, official 2026 headshot'},
 'fb-hs-cole-leinart':{file:'fb-cole-leinart-headshot-12.webp',small:'fb-cole-leinart-headshot-12-900.webp',pos:'50% 22%',alt:'Cole Leinart, number 12, SMU football, official 2026 headshot'},
 'fb-hs-jaelyn-davisrobinson':{file:'fb-jaelyn-davisrobinson-headshot-13.webp',small:'fb-jaelyn-davisrobinson-headshot-13-900.webp',pos:'50% 22%',alt:'Jaelyn Davis-Robinson, number 13, SMU football, official 2026 headshot'},
 'fb-hs-daylon-singleton':{file:'fb-daylon-singleton-headshot-13.webp',small:'fb-daylon-singleton-headshot-13-900.webp',pos:'50% 22%',alt:'Daylon Singleton, number 13, SMU football, official 2026 headshot'},
 'fb-hs-charlie-fiser':{file:'fb-charlie-fiser-headshot-14.webp',small:'fb-charlie-fiser-headshot-14-900.webp',pos:'50% 22%',alt:'Charlie Fiser, number 14, SMU football, official 2026 headshot'},
 'fb-hs-trey-wilson':{file:'fb-trey-wilson-headshot-14.webp',small:'fb-trey-wilson-headshot-14-900.webp',pos:'50% 22%',alt:'Trey Wilson, number 14, SMU football, official 2026 headshot'},
 'fb-hs-lamodrick-spencer':{file:'fb-lamodrick-spencer-headshot-15.webp',small:'fb-lamodrick-spencer-headshot-15-900.webp',pos:'50% 22%',alt:'La\'Modrick Spencer, number 15, SMU football, official 2026 headshot'},
 'fb-hs-aljour-miles-ii':{file:'fb-aljour-miles-ii-headshot-15.webp',small:'fb-aljour-miles-ii-headshot-15-900.webp',pos:'50% 22%',alt:'Aljour Miles II, number 15, SMU football, official 2026 headshot'},
 'fb-hs-jakai-anderson':{file:'fb-jakai-anderson-headshot-16.webp',small:'fb-jakai-anderson-headshot-16-900.webp',pos:'50% 22%',alt:'Jakai Anderson, number 16, SMU football, official 2026 headshot'},
 'fb-hs-marques-white':{file:'fb-marques-white-headshot-16.webp',small:'fb-marques-white-headshot-16-900.webp',pos:'50% 22%',alt:'Marques White, number 16, SMU football, official 2026 headshot'},
 'fb-hs-theo-melin-hrstrm':{file:'fb-theo-melin-hrstrm-headshot-18.webp',small:'fb-theo-melin-hrstrm-headshot-18-900.webp',pos:'50% 22%',alt:'Theo Melin Öhrström, number 18, SMU football, official 2026 headshot'},
 'fb-hs-deuce-gilbert':{file:'fb-deuce-gilbert-headshot-20.webp',small:'fb-deuce-gilbert-headshot-20-900.webp',pos:'50% 22%',alt:'Deuce Gilbert, number 20, SMU football, official 2026 headshot'},
 'fb-hs-ej-kelly':{file:'fb-ej-kelly-headshot-20.webp',small:'fb-ej-kelly-headshot-20-900.webp',pos:'50% 22%',alt:'EJ Kelly, number 20, SMU football, official 2026 headshot'},
 'fb-hs-jimmy-wyrick':{file:'fb-jimmy-wyrick-headshot-21.webp',small:'fb-jimmy-wyrick-headshot-21-900.webp',pos:'50% 22%',alt:'Jimmy Wyrick, number 21, SMU football, official 2026 headshot'},
 'fb-hs-christian-rhodes':{file:'fb-christian-rhodes-headshot-21.webp',small:'fb-christian-rhodes-headshot-21-900.webp',pos:'50% 22%',alt:'Christian Rhodes, number 21, SMU football, official 2026 headshot'},
 'fb-hs-sael-reyes':{file:'fb-sael-reyes-headshot-22.webp',small:'fb-sael-reyes-headshot-22-900.webp',pos:'50% 22%',alt:'Sael Reyes, number 22, SMU football, official 2026 headshot'},
 'fb-hs-jordyn-adams':{file:'fb-jordyn-adams-headshot-22.webp',small:'fb-jordyn-adams-headshot-22-900.webp',pos:'50% 22%',alt:'Jordyn Adams, number 22, SMU football, official 2026 headshot'},
 'fb-hs-link-rhodes':{file:'fb-link-rhodes-headshot-24.webp',small:'fb-link-rhodes-headshot-24-900.webp',pos:'50% 22%',alt:'Link Rhodes, number 24, SMU football, official 2026 headshot'},
 'fb-hs-william-fierro':{file:'fb-william-fierro-headshot-25.webp',small:'fb-william-fierro-headshot-25-900.webp',pos:'50% 22%',alt:'William Fierro, number 25, SMU football, official 2026 headshot'},
 'fb-hs-jaylen-moses':{file:'fb-jaylen-moses-headshot-26.webp',small:'fb-jaylen-moses-headshot-26-900.webp',pos:'50% 22%',alt:'Jaylen Moses, number 26, SMU football, official 2026 headshot'},
 'fb-hs-david-kniffen-jr':{file:'fb-david-kniffen-jr-headshot-26.webp',small:'fb-david-kniffen-jr-headshot-26-900.webp',pos:'50% 22%',alt:'David Kniffen Jr., number 26, SMU football, official 2026 headshot'},
 'fb-hs-abdul-muhammad':{file:'fb-abdul-muhammad-headshot-27.webp',small:'fb-abdul-muhammad-headshot-27-900.webp',pos:'50% 22%',alt:'Abdul Muhammad, number 27, SMU football, official 2026 headshot'},
 'fb-hs-siler-cooke':{file:'fb-siler-cooke-headshot-27.webp',small:'fb-siler-cooke-headshot-27-900.webp',pos:'50% 22%',alt:'Siler Cooke, number 27, SMU football, official 2026 headshot'},
 'fb-hs-brandon-booker':{file:'fb-brandon-booker-headshot-28.webp',small:'fb-brandon-booker-headshot-28-900.webp',pos:'50% 22%',alt:'Brandon Booker, number 28, SMU football, official 2026 headshot'},
 'fb-hs-mabrey-mettauer':{file:'fb-mabrey-mettauer-headshot-28.webp',small:'fb-mabrey-mettauer-headshot-28-900.webp',pos:'50% 22%',alt:'Mabrey Mettauer, number 28, SMU football, official 2026 headshot'},
 'fb-hs-brandon-miyazono':{file:'fb-brandon-miyazono-headshot-29.webp',small:'fb-brandon-miyazono-headshot-29-900.webp',pos:'50% 22%',alt:'Brandon Miyazono, number 29, SMU football, official 2026 headshot'},
 'fb-hs-kenneth-goodwin-iii':{file:'fb-kenneth-goodwin-iii-headshot-30.webp',small:'fb-kenneth-goodwin-iii-headshot-30-900.webp',pos:'50% 22%',alt:'Kenneth Goodwin III, number 30, SMU football, official 2026 headshot'},
 'fb-hs-jamal-anderson':{file:'fb-jamal-anderson-headshot-32.webp',small:'fb-jamal-anderson-headshot-32-900.webp',pos:'50% 22%',alt:'Jamal Anderson, number 32, SMU football, official 2026 headshot'},
 'fb-hs-amontre-harris':{file:'fb-amontre-harris-headshot-33.webp',small:'fb-amontre-harris-headshot-33-900.webp',pos:'50% 22%',alt:'Amontre Harris, number 33, SMU football, official 2026 headshot'},
 'fb-hs-dante-wesley-ii':{file:'fb-dante-wesley-ii-headshot-35.webp',small:'fb-dante-wesley-ii-headshot-35-900.webp',pos:'50% 22%',alt:'Dante Wesley II, number 35, SMU football, official 2026 headshot'},
 'fb-hs-jake-ballard':{file:'fb-jake-ballard-headshot-38.webp',small:'fb-jake-ballard-headshot-38-900.webp',pos:'50% 22%',alt:'Jake Ballard, number 38, SMU football, official headshot'},
 'fb-hs-will-locke':{file:'fb-will-locke-headshot-42.webp',small:'fb-will-locke-headshot-42-900.webp',pos:'50% 22%',alt:'Will Locke, number 42, SMU football, official 2026 headshot'},
 'fb-hs-wade-mcsparron':{file:'fb-wade-mcsparron-headshot-43.webp',small:'fb-wade-mcsparron-headshot-43-900.webp',pos:'50% 22%',alt:'Wade McSparron, number 43, SMU football, official 2026 headshot'},
 'fb-hs-michael-de-hoyos':{file:'fb-michael-de-hoyos-headshot-44.webp',small:'fb-michael-de-hoyos-headshot-44-900.webp',pos:'50% 22%',alt:'Michael De Hoyos, number 44, SMU football, official 2026 headshot'},
 'fb-hs-xavier-wright':{file:'fb-xavier-wright-headshot-46.webp',small:'fb-xavier-wright-headshot-46-900.webp',pos:'50% 22%',alt:'Xavier Wright, number 46, SMU football, official 2026 headshot'},
 'fb-hs-cody-williford':{file:'fb-cody-williford-headshot-47.webp',small:'fb-cody-williford-headshot-47-900.webp',pos:'50% 22%',alt:'Cody Williford, number 47, SMU football, official 2026 headshot'},
 'fb-hs-morgan-tribbett':{file:'fb-morgan-tribbett-headshot-48.webp',small:'fb-morgan-tribbett-headshot-48-900.webp',pos:'50% 22%',alt:'Morgan Tribbett, number 48, SMU football, official 2026 headshot'},
 'fb-hs-graham-uter':{file:'fb-graham-uter-headshot-50.webp',small:'fb-graham-uter-headshot-50-900.webp',pos:'50% 22%',alt:'Graham Uter, number 50, SMU football, official 2026 headshot'},
 'fb-hs-marcus-brouse':{file:'fb-marcus-brouse-headshot-50.webp',small:'fb-marcus-brouse-headshot-50-900.webp',pos:'50% 22%',alt:'Marcus Brouse, number 50, SMU football, official 2026 headshot'},
 'fb-hs-jahkai-lang':{file:'fb-jahkai-lang-headshot-52.webp',small:'fb-jahkai-lang-headshot-52-900.webp',pos:'50% 22%',alt:'Jahkai Lang, number 52, SMU football, official 2026 headshot'},
 'fb-hs-toa-katoa':{file:'fb-toa-katoa-headshot-52.webp',small:'fb-toa-katoa-headshot-52-900.webp',pos:'50% 22%',alt:'Toa Katoa, number 52, SMU football, official 2026 headshot'},
 'fb-hs-zachary-hibner':{file:'fb-zachary-hibner-headshot-53.webp',small:'fb-zachary-hibner-headshot-53-900.webp',pos:'50% 22%',alt:'Zachary Hibner, number 53, SMU football, official 2026 headshot'},
 'fb-hs-woo-spencer':{file:'fb-woo-spencer-headshot-55.webp',small:'fb-woo-spencer-headshot-55-900.webp',pos:'50% 22%',alt:'Woo Spencer, number 55, SMU football, official 2026 headshot'},
 'fb-hs-sam-utu':{file:'fb-sam-utu-headshot-55.webp',small:'fb-sam-utu-headshot-55-900.webp',pos:'50% 22%',alt:'Sam Utu, number 55, SMU football, official 2026 headshot'},
 'fb-hs-tyron-winslow':{file:'fb-tyron-winslow-headshot-56.webp',small:'fb-tyron-winslow-headshot-56-900.webp',pos:'50% 22%',alt:'Tyron Winslow, number 56, SMU football, official 2026 headshot'},
 'fb-hs-henry-douglass':{file:'fb-henry-douglass-headshot-57.webp',small:'fb-henry-douglass-headshot-57-900.webp',pos:'50% 22%',alt:'Henry Douglass, number 57, SMU football, official 2026 headshot'},
 'fb-hs-abel-hoopii':{file:'fb-abel-hoopii-headshot-58.webp',small:'fb-abel-hoopii-headshot-58-900.webp',pos:'50% 22%',alt:'Abel Hoopii, number 58, SMU football, official 2026 headshot'},
 'fb-hs-aakil-washington':{file:'fb-aakil-washington-headshot-58.webp',small:'fb-aakil-washington-headshot-58-900.webp',pos:'50% 22%',alt:'Aakil Washington, number 58, SMU football, official 2026 headshot'},
 'fb-hs-pj-williams':{file:'fb-pj-williams-headshot-59.webp',small:'fb-pj-williams-headshot-59-900.webp',pos:'50% 22%',alt:'PJ Williams, number 59, SMU football, official 2026 headshot'},
 'fb-hs-evan-goodwin':{file:'fb-evan-goodwin-headshot-60.webp',small:'fb-evan-goodwin-headshot-60-900.webp',pos:'50% 22%',alt:'Evan Goodwin, number 60, SMU football, official 2026 headshot'},
 'fb-hs-addison-nichols':{file:'fb-addison-nichols-headshot-63.webp',small:'fb-addison-nichols-headshot-63-900.webp',pos:'50% 22%',alt:'Addison Nichols, number 63, SMU football, official 2026 headshot'},
 'fb-hs-joshua-bates':{file:'fb-joshua-bates-headshot-64.webp',small:'fb-joshua-bates-headshot-64-900.webp',pos:'50% 22%',alt:'Joshua Bates, number 64, SMU football, official 2026 headshot'},
 'fb-hs-bennett-johnson-v':{file:'fb-bennett-johnson-v-headshot-65.webp',small:'fb-bennett-johnson-v-headshot-65-900.webp',pos:'50% 22%',alt:'Bennett Johnson V, number 65, SMU football, official 2026 headshot'},
 'fb-hs-paxton-briggle':{file:'fb-paxton-briggle-headshot-70.webp',small:'fb-paxton-briggle-headshot-70-900.webp',pos:'50% 22%',alt:'Paxton Briggle, number 70, SMU football, official 2026 headshot'},
 'fb-hs-max-wright':{file:'fb-max-wright-headshot-71.webp',small:'fb-max-wright-headshot-71-900.webp',pos:'50% 22%',alt:'Max Wright, number 71, SMU football, official 2026 headshot'},
 'fb-hs-andrew-chamblee':{file:'fb-andrew-chamblee-headshot-74.webp',small:'fb-andrew-chamblee-headshot-74-900.webp',pos:'50% 22%',alt:'Andrew Chamblee, number 74, SMU football, official 2026 headshot'},
 'fb-hs-dramodd-odoms':{file:'fb-dramodd-odoms-headshot-75.webp',small:'fb-dramodd-odoms-headshot-75-900.webp',pos:'50% 22%',alt:'Dramodd Odoms, number 75, SMU football, official 2026 headshot'},
 'fb-hs-drew-hill':{file:'fb-drew-hill-headshot-76.webp',small:'fb-drew-hill-headshot-76-900.webp',pos:'50% 22%',alt:'Drew Hill, number 76, SMU football, official 2026 headshot'},
 'fb-hs-alex-woods':{file:'fb-alex-woods-headshot-77.webp',small:'fb-alex-woods-headshot-77-900.webp',pos:'50% 22%',alt:'Alex Woods, number 77, SMU football, official 2026 headshot'},
 'fb-hs-drew-evers':{file:'fb-drew-evers-headshot-78.webp',small:'fb-drew-evers-headshot-78-900.webp',pos:'50% 22%',alt:'Drew Evers, number 78, SMU football, official 2026 headshot'},
 'fb-hs-sione-mau':{file:'fb-sione-mau-headshot-79.webp',small:'fb-sione-mau-headshot-79-900.webp',pos:'50% 22%',alt:'Sione Ma\'u, number 79, SMU football, official 2026 headshot'},
 'fb-hs-tyrone-crethers':{file:'fb-tyrone-crethers-headshot-81.webp',small:'fb-tyrone-crethers-headshot-81-900.webp',pos:'50% 22%',alt:'Tyrone Crethers, number 81, SMU football, official 2026 headshot'},
 'fb-hs-xzavier-barnett':{file:'fb-xzavier-barnett-headshot-83.webp',small:'fb-xzavier-barnett-headshot-83-900.webp',pos:'50% 22%',alt:'X\'Zavier Barnett, number 83, SMU football, official 2026 headshot'},
 'fb-hs-tripp-riordan':{file:'fb-tripp-riordan-headshot-84.webp',small:'fb-tripp-riordan-headshot-84-900.webp',pos:'50% 22%',alt:'Tripp Riordan, number 84, SMU football, official 2026 headshot'},
 'fb-hs-andre-nickerson-jr':{file:'fb-andre-nickerson-jr-headshot-85.webp',small:'fb-andre-nickerson-jr-headshot-85-900.webp',pos:'50% 22%',alt:'Andre Nickerson Jr., number 85, SMU football, official 2026 headshot'},
 'fb-hs-trey-jackson':{file:'fb-trey-jackson-headshot-88.webp',small:'fb-trey-jackson-headshot-88-900.webp',pos:'50% 22%',alt:'Trey Jackson, number 88, SMU football, official 2026 headshot'},
 'fb-hs-miles-uter':{file:'fb-miles-uter-headshot-89.webp',small:'fb-miles-uter-headshot-89-900.webp',pos:'50% 22%',alt:'Miles Uter, number 89, SMU football, official 2026 headshot'},
 'fb-hs-jalen-shivers':{file:'fb-jalen-shivers-headshot-90.webp',small:'fb-jalen-shivers-headshot-90-900.webp',pos:'50% 22%',alt:'Jalen Shivers, number 90, SMU football, official 2026 headshot'},
 'fb-hs-hudson-woods':{file:'fb-hudson-woods-headshot-92.webp',small:'fb-hudson-woods-headshot-92-900.webp',pos:'50% 22%',alt:'Hudson Woods, number 92, SMU football, official 2026 headshot'},
 'fb-hs-kevin-allen':{file:'fb-kevin-allen-headshot-93.webp',small:'fb-kevin-allen-headshot-93-900.webp',pos:'50% 22%',alt:'Kevin Allen, number 93, SMU football, official 2026 headshot'},
 'fb-hs-jonathan-jefferson':{file:'fb-jonathan-jefferson-headshot-94.webp',small:'fb-jonathan-jefferson-headshot-94-900.webp',pos:'50% 22%',alt:'Jonathan Jefferson, number 94, SMU football, official 2026 headshot'},
 'fb-hs-wyatt-smith':{file:'fb-wyatt-smith-headshot-95.webp',small:'fb-wyatt-smith-headshot-95-900.webp',pos:'50% 22%',alt:'Wyatt Smith, number 95, SMU football, official 2026 headshot'},
 'fb-hs-christian-de-moor':{file:'fb-christian-de-moor-headshot-96.webp',small:'fb-christian-de-moor-headshot-96-900.webp',pos:'50% 22%',alt:'Christian de Moor, number 96, SMU football, official 2026 headshot'},
 'fb-hs-wiley-olson':{file:'fb-wiley-olson-headshot-96.webp',small:'fb-wiley-olson-headshot-96-900.webp',pos:'50% 22%',alt:'Wiley Olson, number 96, SMU football, official 2026 headshot'},
 'fb-hs-christian-davis':{file:'fb-christian-davis-headshot-97.webp',small:'fb-christian-davis-headshot-97-900.webp',pos:'50% 22%',alt:'Christian Davis, number 97, SMU football, official 2026 headshot'},
 'fb-hs-brendan-baird':{file:'fb-brendan-baird-headshot-97.webp',small:'fb-brendan-baird-headshot-97-900.webp',pos:'50% 22%',alt:'Brendan Baird, number 97, SMU football, official 2026 headshot'},
 'fb-hs-dakota-dickson':{file:'fb-dakota-dickson-headshot-99.webp',small:'fb-dakota-dickson-headshot-99-900.webp',pos:'50% 22%',alt:'Dakota Dickson, number 99, SMU football, official 2026 headshot'},
 'fb-hs-nick-reed':{file:'fb-nick-reed-headshot-99.webp',small:'fb-nick-reed-headshot-99-900.webp',pos:'50% 22%',alt:'Nick Reed, number 99, SMU football, official 2026 headshot'},
 'vb-hs-victoria-harris':{file:'vb-victoria-harris-headshot-0.webp',small:'vb-victoria-harris-headshot-0-900.webp',pos:'50% 22%',alt:'Victoria Harris, number 0, SMU volleyball, official 2026 headshot'},
 'vb-hs-sarah-frazee':{file:'vb-sarah-frazee-headshot-2.webp',small:'vb-sarah-frazee-headshot-2-900.webp',pos:'50% 22%',alt:'Sarah Frazee, number 2, SMU volleyball, official 2026 headshot'},
 'vb-hs-bojana-ambulija':{file:'vb-bojana-ambulija-headshot-3.webp',small:'vb-bojana-ambulija-headshot-3-900.webp',pos:'50% 22%',alt:'Bojana Ambulija, number 3, SMU volleyball, official 2026 headshot'},
 'vb-hs-christa-wilburn':{file:'vb-christa-wilburn-headshot-4.webp',small:'vb-christa-wilburn-headshot-4-900.webp',pos:'50% 22%',alt:'Christa Wilburn, number 4, SMU volleyball, official 2026 headshot'},
 'vb-hs-elle-vandeweghe':{file:'vb-elle-vandeweghe-headshot-5.webp',small:'vb-elle-vandeweghe-headshot-5-900.webp',pos:'50% 22%',alt:'Elle Vandeweghe, number 5, SMU volleyball, official 2026 headshot'},
 'vb-hs-victoria-shupe':{file:'vb-victoria-shupe-headshot-6.webp',small:'vb-victoria-shupe-headshot-6-900.webp',pos:'50% 22%',alt:'Victoria Shupe, number 6, SMU volleyball, official 2026 headshot'},
 'vb-hs-ellie-moore':{file:'vb-ellie-moore-headshot-7.webp',small:'vb-ellie-moore-headshot-7-900.webp',pos:'50% 22%',alt:'Ellie Moore, number 7, SMU volleyball, official 2026 headshot'},
 'vb-hs-mia-silva':{file:'vb-mia-silva-headshot-8.webp',small:'vb-mia-silva-headshot-8-900.webp',pos:'50% 22%',alt:'Mia Silva, number 8, SMU volleyball, official 2026 headshot'},
 'vb-hs-brooke-gilmour':{file:'vb-brooke-gilmour-headshot-10.webp',small:'vb-brooke-gilmour-headshot-10-900.webp',pos:'50% 22%',alt:'Brooke Gilmour, number 10, SMU volleyball, official 2026 headshot'},
 'vb-hs-hannah-beauford':{file:'vb-hannah-beauford-headshot-11.webp',small:'vb-hannah-beauford-headshot-11-900.webp',pos:'50% 22%',alt:'Hannah Beauford, number 11, SMU volleyball, official 2026 headshot'},
 'vb-hs-natalia-newsome':{file:'vb-natalia-newsome-headshot-12.webp',small:'vb-natalia-newsome-headshot-12-900.webp',pos:'50% 22%',alt:'Natalia Newsome, number 12, SMU volleyball, official 2026 headshot'},
 'vb-hs-gabi-placide':{file:'vb-gabi-placide-headshot-15.webp',small:'vb-gabi-placide-headshot-15-900.webp',pos:'50% 22%',alt:'Gabi Placide, number 15, SMU volleyball, official 2026 headshot'},
 'vb-hs-levariya-pinder':{file:'vb-levariya-pinder-headshot-17.webp',small:'vb-levariya-pinder-headshot-17-900.webp',pos:'50% 22%',alt:'Levariya Pinder, number 17, SMU volleyball, official 2026 headshot'},
 'vb-hs-favor-anyanwu':{file:'vb-favor-anyanwu-headshot-21.webp',small:'vb-favor-anyanwu-headshot-21-900.webp',pos:'50% 22%',alt:'Favor Anyanwu, number 21, SMU volleyball, official 2026 headshot'},
 'vb-hs-suli-davis':{file:'vb-suli-davis-headshot-25.webp',small:'vb-suli-davis-headshot-25-900.webp',pos:'50% 22%',alt:'Suli Davis, number 25, SMU volleyball, official 2026 headshot'},
 'vb-hs-jadyn-livings':{file:'vb-jadyn-livings-headshot-42.webp',small:'vb-jadyn-livings-headshot-42-900.webp',pos:'50% 22%',alt:'Jadyn Livings, number 42, SMU volleyball, official 2026 headshot'},
 'msoc-hs-jonathan-evans':{file:'msoc-jonathan-evans-headshot-1.webp',small:'msoc-jonathan-evans-headshot-1-900.webp',pos:'50% 22%',alt:'Jonathan Evans, number 1, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-ryan-clantonpimentel':{file:'msoc-ryan-clantonpimentel-headshot-2.webp',small:'msoc-ryan-clantonpimentel-headshot-2-900.webp',pos:'50% 22%',alt:'Ryan Clanton-Pimentel, number 2, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-villads-landsperg':{file:'msoc-villads-landsperg-headshot-3.webp',small:'msoc-villads-landsperg-headshot-3-900.webp',pos:'50% 22%',alt:'Villads Landsperg, number 3, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-mason-grimm':{file:'msoc-mason-grimm-headshot-4.webp',small:'msoc-mason-grimm-headshot-4-900.webp',pos:'50% 22%',alt:'Mason Grimm, number 4, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-noah-holmstrm':{file:'msoc-noah-holmstrm-headshot-5.webp',small:'msoc-noah-holmstrm-headshot-5-900.webp',pos:'50% 22%',alt:'Noah Holmstrøm, number 5, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-alex-salvo':{file:'msoc-alex-salvo-headshot-6.webp',small:'msoc-alex-salvo-headshot-6-900.webp',pos:'50% 22%',alt:'Alex Salvo, number 6, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-jaylinn-mitchell':{file:'msoc-jaylinn-mitchell-headshot-7.webp',small:'msoc-jaylinn-mitchell-headshot-7-900.webp',pos:'50% 22%',alt:'Jaylinn Mitchell, number 7, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-tweneboa-bingo-kodua':{file:'msoc-tweneboa-bingo-kodua-headshot-8.webp',small:'msoc-tweneboa-bingo-kodua-headshot-8-900.webp',pos:'50% 22%',alt:'Tweneboa (Bingo) Kodua, number 8, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-milton-lopez':{file:'msoc-milton-lopez-headshot-10.webp',small:'msoc-milton-lopez-headshot-10-900.webp',pos:'50% 22%',alt:'Milton Lopez, number 10, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-franco-ocana':{file:'msoc-franco-ocana-headshot-11.webp',small:'msoc-franco-ocana-headshot-11-900.webp',pos:'50% 22%',alt:'Franco Ocana, number 11, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-tj-dilley':{file:'msoc-tj-dilley-headshot-12.webp',small:'msoc-tj-dilley-headshot-12-900.webp',pos:'50% 22%',alt:'TJ Dilley, number 12, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-enzo-panozzo':{file:'msoc-enzo-panozzo-headshot-14.webp',small:'msoc-enzo-panozzo-headshot-14-900.webp',pos:'50% 22%',alt:'Enzo Panozzo, number 14, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-nick-harshaw':{file:'msoc-nick-harshaw-headshot-15.webp',small:'msoc-nick-harshaw-headshot-15-900.webp',pos:'50% 22%',alt:'Nick Harshaw, number 15, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-landon-hickam':{file:'msoc-landon-hickam-headshot-16.webp',small:'msoc-landon-hickam-headshot-16-900.webp',pos:'50% 22%',alt:'Landon Hickam, number 16, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-dunes-nielsen':{file:'msoc-dunes-nielsen-headshot-17.webp',small:'msoc-dunes-nielsen-headshot-17-900.webp',pos:'50% 22%',alt:'Dunes Nielsen, number 17, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-micah-ramirez':{file:'msoc-micah-ramirez-headshot-18.webp',small:'msoc-micah-ramirez-headshot-18-900.webp',pos:'50% 22%',alt:'Micah Ramirez, number 18, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-joseluis-villagomez':{file:'msoc-joseluis-villagomez-headshot-19.webp',small:'msoc-joseluis-villagomez-headshot-19-900.webp',pos:'50% 22%',alt:'Joseluis Villagomez, number 19, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-mukisa-emmanuel':{file:'msoc-mukisa-emmanuel-headshot-20.webp',small:'msoc-mukisa-emmanuel-headshot-20-900.webp',pos:'50% 22%',alt:'Mukisa Emmanuel, number 20, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-andre-philibbosian':{file:'msoc-andre-philibbosian-headshot-21.webp',small:'msoc-andre-philibbosian-headshot-21-900.webp',pos:'50% 22%',alt:'Andre Philibbosian, number 21, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-max-sauceda':{file:'msoc-max-sauceda-headshot-22.webp',small:'msoc-max-sauceda-headshot-22-900.webp',pos:'50% 22%',alt:'Max Sauceda, number 22, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-oliver-knotek':{file:'msoc-oliver-knotek-headshot-23.webp',small:'msoc-oliver-knotek-headshot-23-900.webp',pos:'50% 22%',alt:'Oliver Knotek, number 23, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-chris-deamon':{file:'msoc-chris-deamon-headshot-24.webp',small:'msoc-chris-deamon-headshot-24-900.webp',pos:'50% 22%',alt:'Chris Deamon, number 24, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-owen-zarnick':{file:'msoc-owen-zarnick-headshot-25.webp',small:'msoc-owen-zarnick-headshot-25-900.webp',pos:'50% 22%',alt:'Owen Zarnick, number 25, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-caleb-bronold':{file:'msoc-caleb-bronold-headshot-26.webp',small:'msoc-caleb-bronold-headshot-26-900.webp',pos:'50% 22%',alt:'Caleb Bronold, number 26, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-ryder-balch':{file:'msoc-ryder-balch-headshot-27.webp',small:'msoc-ryder-balch-headshot-27-900.webp',pos:'50% 22%',alt:'Ryder Balch, number 27, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-sam-cunniffe':{file:'msoc-sam-cunniffe-headshot-28.webp',small:'msoc-sam-cunniffe-headshot-28-900.webp',pos:'50% 22%',alt:'Sam Cunniffe, number 28, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-nathan-kinser':{file:'msoc-nathan-kinser-headshot-29.webp',small:'msoc-nathan-kinser-headshot-29-900.webp',pos:'50% 22%',alt:'Nathan Kinser, number 29, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-stephan-soghomonian':{file:'msoc-stephan-soghomonian-headshot-30.webp',small:'msoc-stephan-soghomonian-headshot-30-900.webp',pos:'50% 22%',alt:'Stephan Soghomonian, number 30, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-sam-miller':{file:'msoc-sam-miller-headshot-32.webp',small:'msoc-sam-miller-headshot-32-900.webp',pos:'50% 22%',alt:'Sam Miller, number 32, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-spencer-zachgo':{file:'msoc-spencer-zachgo-headshot-33.webp',small:'msoc-spencer-zachgo-headshot-33-900.webp',pos:'50% 22%',alt:'Spencer Zachgo, number 33, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-trey-clements':{file:'msoc-trey-clements-headshot-34.webp',small:'msoc-trey-clements-headshot-34-900.webp',pos:'50% 22%',alt:'Trey Clements, number 34, SMU men\'s soccer, official 2026 headshot'},
 'msoc-hs-daniel-wozniak':{file:'msoc-daniel-wozniak-headshot-37.webp',small:'msoc-daniel-wozniak-headshot-37-900.webp',pos:'50% 22%',alt:'Daniel Wozniak, number 37, SMU men\'s soccer, official 2026 headshot'},
 'swim-hs-aidan-arie':{file:'swim-aidan-arie-headshot.webp',small:'swim-aidan-arie-headshot-900.webp',pos:'50% 22%',alt:'Aidan Arie, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-thad-austin':{file:'swim-thad-austin-headshot.webp',small:'swim-thad-austin-headshot-900.webp',pos:'50% 22%',alt:'Thad Austin, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-tate-bacon':{file:'swim-tate-bacon-headshot.webp',small:'swim-tate-bacon-headshot-900.webp',pos:'50% 22%',alt:'Tate Bacon, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-andy-baklanov':{file:'swim-andy-baklanov-headshot.webp',small:'swim-andy-baklanov-headshot-900.webp',pos:'50% 22%',alt:'Andy Baklanov, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-jack-berube':{file:'swim-jack-berube-headshot.webp',small:'swim-jack-berube-headshot-900.webp',pos:'50% 22%',alt:'Jack Berube, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-francis-brennan':{file:'swim-francis-brennan-headshot.webp',small:'swim-francis-brennan-headshot-900.webp',pos:'50% 22%',alt:'Francis Brennan, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-grant-cates':{file:'swim-grant-cates-headshot.webp',small:'swim-grant-cates-headshot-900.webp',pos:'50% 22%',alt:'Grant Cates, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-benjamin-chateigner':{file:'swim-benjamin-chateigner-headshot.webp',small:'swim-benjamin-chateigner-headshot-900.webp',pos:'50% 22%',alt:'Benjamin Chateigner, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-trey-clervi':{file:'swim-trey-clervi-headshot.webp',small:'swim-trey-clervi-headshot-900.webp',pos:'50% 22%',alt:'Trey Clervi, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-michael-evans':{file:'swim-michael-evans-headshot.webp',small:'swim-michael-evans-headshot-900.webp',pos:'50% 22%',alt:'Michael Evans, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-george-gonzalez':{file:'swim-george-gonzalez-headshot.webp',small:'swim-george-gonzalez-headshot-900.webp',pos:'50% 22%',alt:'George Gonzalez, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-asher-good':{file:'swim-asher-good-headshot.webp',small:'swim-asher-good-headshot-900.webp',pos:'50% 22%',alt:'Asher Good, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-braden-guzman':{file:'swim-braden-guzman-headshot.webp',small:'swim-braden-guzman-headshot-900.webp',pos:'50% 22%',alt:'Braden Guzman, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-ethan-hammontree':{file:'swim-ethan-hammontree-headshot.webp',small:'swim-ethan-hammontree-headshot-900.webp',pos:'50% 22%',alt:'Ethan Hammontree, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-mark-heffern':{file:'swim-mark-heffern-headshot.webp',small:'swim-mark-heffern-headshot-900.webp',pos:'50% 22%',alt:'Mark Heffern, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-joshua-heydt':{file:'swim-joshua-heydt-headshot.webp',small:'swim-joshua-heydt-headshot-900.webp',pos:'50% 22%',alt:'Joshua Heydt, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-aubrey-jaya':{file:'swim-aubrey-jaya-headshot.webp',small:'swim-aubrey-jaya-headshot-900.webp',pos:'50% 22%',alt:'Aubrey Jaya, SMU swimming and diving, official headshot'},
 'swim-hs-spencer-kinsey':{file:'swim-spencer-kinsey-headshot.webp',small:'swim-spencer-kinsey-headshot-900.webp',pos:'50% 22%',alt:'Spencer Kinsey, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-eli-likins':{file:'swim-eli-likins-headshot.webp',small:'swim-eli-likins-headshot-900.webp',pos:'50% 22%',alt:'Eli Likins, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-ewan-lonergan':{file:'swim-ewan-lonergan-headshot.webp',small:'swim-ewan-lonergan-headshot-900.webp',pos:'50% 22%',alt:'Ewan Lonergan, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-ben-longeway':{file:'swim-ben-longeway-headshot.webp',small:'swim-ben-longeway-headshot-900.webp',pos:'50% 22%',alt:'Ben Longeway, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-kristaps-mikelsons':{file:'swim-kristaps-mikelsons-headshot.webp',small:'swim-kristaps-mikelsons-headshot-900.webp',pos:'50% 22%',alt:'Kristaps Mikelsons, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-maks-minichowski':{file:'swim-maks-minichowski-headshot.webp',small:'swim-maks-minichowski-headshot-900.webp',pos:'50% 22%',alt:'Maks Minichowski, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-jack-moore':{file:'swim-jack-moore-headshot.webp',small:'swim-jack-moore-headshot-900.webp',pos:'50% 22%',alt:'Jack Moore, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-leonardo-pelaez':{file:'swim-leonardo-pelaez-headshot.webp',small:'swim-leonardo-pelaez-headshot-900.webp',pos:'50% 22%',alt:'Leonardo Pelaez, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-zach-power':{file:'swim-zach-power-headshot.webp',small:'swim-zach-power-headshot-900.webp',pos:'50% 22%',alt:'Zach Power, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-luke-sitz':{file:'swim-luke-sitz-headshot.webp',small:'swim-luke-sitz-headshot-900.webp',pos:'50% 22%',alt:'Luke Sitz, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-rj-snyder':{file:'swim-rj-snyder-headshot.webp',small:'swim-rj-snyder-headshot-900.webp',pos:'50% 22%',alt:'RJ Snyder, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-nico-sobenes':{file:'swim-nico-sobenes-headshot.webp',small:'swim-nico-sobenes-headshot-900.webp',pos:'50% 22%',alt:'Nico Sobenes, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-cameron-thompson':{file:'swim-cameron-thompson-headshot.webp',small:'swim-cameron-thompson-headshot-900.webp',pos:'50% 22%',alt:'Cameron Thompson, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-joe-umhofer':{file:'swim-joe-umhofer-headshot.webp',small:'swim-joe-umhofer-headshot-900.webp',pos:'50% 22%',alt:'Joe Umhofer, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-stan-zwygart':{file:'swim-stan-zwygart-headshot.webp',small:'swim-stan-zwygart-headshot-900.webp',pos:'50% 22%',alt:'Stan Zwygart, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-cassidy-allison':{file:'swim-cassidy-allison-headshot.webp',small:'swim-cassidy-allison-headshot-900.webp',pos:'50% 22%',alt:'Cassidy Allison, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-ava-andersen':{file:'swim-ava-andersen-headshot.webp',small:'swim-ava-andersen-headshot-900.webp',pos:'50% 22%',alt:'Ava Andersen, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-emma-bibza':{file:'swim-emma-bibza-headshot.webp',small:'swim-emma-bibza-headshot-900.webp',pos:'50% 22%',alt:'Emma Bibza, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-anna-bonecka':{file:'swim-anna-bonecka-headshot.webp',small:'swim-anna-bonecka-headshot-900.webp',pos:'50% 22%',alt:'Anna Bonecka, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-tessa-christiansen':{file:'swim-tessa-christiansen-headshot.webp',small:'swim-tessa-christiansen-headshot-900.webp',pos:'50% 22%',alt:'Tessa Christiansen, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-chloe-corbin':{file:'swim-chloe-corbin-headshot.webp',small:'swim-chloe-corbin-headshot-900.webp',pos:'50% 22%',alt:'Chloe Corbin, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-chloe-douglasbyrne':{file:'swim-chloe-douglasbyrne-headshot.webp',small:'swim-chloe-douglasbyrne-headshot-900.webp',pos:'50% 22%',alt:'Chloe Douglas-Byrne, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-reagan-evans':{file:'swim-reagan-evans-headshot.webp',small:'swim-reagan-evans-headshot-900.webp',pos:'50% 22%',alt:'Reagan Evans, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-mia-goodale':{file:'swim-mia-goodale-headshot.webp',small:'swim-mia-goodale-headshot-900.webp',pos:'50% 22%',alt:'Mia Goodale, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-emma-hagberg':{file:'swim-emma-hagberg-headshot.webp',small:'swim-emma-hagberg-headshot-900.webp',pos:'50% 22%',alt:'Emma Hagberg, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-dori-hathazi':{file:'swim-dori-hathazi-headshot.webp',small:'swim-dori-hathazi-headshot-900.webp',pos:'50% 22%',alt:'Dori Hathazi, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-madeleine-hebert':{file:'swim-madeleine-hebert-headshot.webp',small:'swim-madeleine-hebert-headshot-900.webp',pos:'50% 22%',alt:'Madeleine Hebert, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-kate-heffernan':{file:'swim-kate-heffernan-headshot.webp',small:'swim-kate-heffernan-headshot-900.webp',pos:'50% 22%',alt:'Kate Heffernan, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-ashlyn-hernandez':{file:'swim-ashlyn-hernandez-headshot.webp',small:'swim-ashlyn-hernandez-headshot-900.webp',pos:'50% 22%',alt:'Ashlyn Hernandez, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-ella-houston':{file:'swim-ella-houston-headshot.webp',small:'swim-ella-houston-headshot-900.webp',pos:'50% 22%',alt:'Ella Houston, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-sadie-klepfer':{file:'swim-sadie-klepfer-headshot.webp',small:'swim-sadie-klepfer-headshot-900.webp',pos:'50% 22%',alt:'Sadie Klepfer, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-izzy-krantzcke':{file:'swim-izzy-krantzcke-headshot.webp',small:'swim-izzy-krantzcke-headshot-900.webp',pos:'50% 22%',alt:'Izzy Krantzcke, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-tawannah-mclemore':{file:'swim-tawannah-mclemore-headshot.webp',small:'swim-tawannah-mclemore-headshot-900.webp',pos:'50% 22%',alt:'Tawannah McLemore, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-sarah-meza':{file:'swim-sarah-meza-headshot.webp',small:'swim-sarah-meza-headshot-900.webp',pos:'50% 22%',alt:'Sarah Meza, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-macey-oppliger':{file:'swim-macey-oppliger-headshot.webp',small:'swim-macey-oppliger-headshot-900.webp',pos:'50% 22%',alt:'Macey Oppliger, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-summer-osborne':{file:'swim-summer-osborne-headshot.webp',small:'swim-summer-osborne-headshot-900.webp',pos:'50% 22%',alt:'Summer Osborne, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-maddy-parker':{file:'swim-maddy-parker-headshot.webp',small:'swim-maddy-parker-headshot-900.webp',pos:'50% 22%',alt:'Maddy Parker, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-maddie-reynolds':{file:'swim-maddie-reynolds-headshot.webp',small:'swim-maddie-reynolds-headshot-900.webp',pos:'50% 22%',alt:'Maddie Reynolds, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-cecilia-rnnlund':{file:'swim-cecilia-rnnlund-headshot.webp',small:'swim-cecilia-rnnlund-headshot-900.webp',pos:'50% 22%',alt:'Cecilia Rönnlund, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-wren-smith':{file:'swim-wren-smith-headshot.webp',small:'swim-wren-smith-headshot-900.webp',pos:'50% 22%',alt:'Wren Smith, SMU swimming and diving, official 2026-27 headshot'},
 'swim-hs-annemarie-vlaic':{file:'swim-annemarie-vlaic-headshot.webp',small:'swim-annemarie-vlaic-headshot-900.webp',pos:'50% 22%',alt:'Annemarie Vlaic, SMU swimming and diving, official 2026-27 headshot'},
 /* Phone crop (9:16) of the Ford Stadium home hero; index.html serves it to phones (under 700px). */
 'ford-portrait':{file:'ford-stadium-night-fireworks-portrait.webp',pos:'50% 40%',alt:'Gerald J. Ford Stadium at night with fireworks over the north end zone and a full crowd'},
 'msoc':{file:'msoc-salute-night.webp',pos:'50% 62%',alt:'The SMU men\'s soccer team salutes the crowd under the lights'}};
(function(){var IMG={'boulevard-nights-1':'students','boulevard-nights-2':'hype','hilltop-unfiltered':'hurdle','rivalry-week':'catch-cal','moody-opening':'moody-bowl','five-am-laps':'swim','film-rotation':'vb-spike','building-contender':'wbb-jumper',
 'film-pressure':'ol-59','film-screen':'snap','film-session-redzone':'carrier-2','building-roster':'huddle','pony-up-pod':'students'};
 MP.LIB.forEach(function(c){if(IMG[c.id])c.img=IMG[c.id]})})();
/* ===== REAL CONTENT SWAPS (bot/content-real, Oct. 26, 2026) =====
   Standing rule: carry real content wherever it exists. Each fictional library item listed in SWAP is replaced, in the same spot, by a real one:
   an official SMU Athletics YouTube video or podcast episode (IDs checked with YouTube oEmbed on Oct. 26, 2026: author "SMU Mustangs", @SMUMustangs),
   or a short original summary that links out to the official story. Embed only, never rehosted; no article text copied; no quotes.
   Fictional items with no real equivalent stay, labeled "Sample" (see KEEP). Recruiting stays paused: nothing here touches recruiting/portal items. */
(function(){var MP=window.MP,YT='https://www.youtube.com/watch?v=',CH=['SMU Mustangs on YouTube','https://www.youtube.com/@SMUMustangs'],N='https://smumustangs.com/news/2026/';
 function V(id,yt,sport,label,title,desc,dur,lock,big,o){var c={id:id,t:'video',cat:'watch',sport:sport,label:label,title:title,desc:desc,dur:dur,lock:!!lock,tone:'black',big:big,
   yt:yt,src:YT+yt,credit:'Video: SMU Athletics',channel:CH,real:true};for(var k in o||{})c[k]=o[k];return c}
 function MIC(id,yt,sport,title,desc,dur,lock){return V(id,yt,sport,"Mustangs Mic'd Up · Official podcast",title,desc,dur,lock,'MIC\'D',{t:'podcast',cat:'podcasts',credit:"Mustangs Mic'd Up · SMU Athletics"})}
 function A(id,sport,label,title,desc,dur,lock,big,art){MP.ARTICLES[id]=Object.assign({by:'SMU+ Staff',date:'Oct. 26, 2026',sourced:true},art);
   return {id:id,t:'article',cat:'insider',sport:sport,label:label,title:title,desc:desc,dur:dur,lock:!!lock,tone:'blue',big:big,real:true}}

 /* --- real articles: original summaries, facts from the linked SMU Athletics stories --- */
 var BIZ=A('smu-business-october','general','Insider · Business of SMU Athletics','A patch on every jersey, and Texas\'s first D-I men\'s lacrosse team',
   'Two October announcements, one week apart: Texas Capital goes on all 17 SMU uniforms, and SMU starts the state\'s first Division I men\'s lacrosse program.','3 min read',false,'17',
   {date:'Oct. 26, 2026',sources:[['SMU Athletics: Texas Capital all-sports jersey patch, Oct. 13',N+'10/13/general-smu-athletics-texas-capital-announce-first-all-sports-jersey-patch-partnership-for-a-texas-power-four-program'],['SMU Athletics: men\'s lacrosse program launch, Oct. 15',N+'10/15/general-smu-athletics-to-launch-texas-first-ncaa-division-i-mens-lacrosse-program']],
    dek:'For a class built around the business of college sports, mid-October was a case study. Here is what SMU Athletics announced, in plain terms.',related:['smu-texas-capital-video','smu-weekend-oct24','recap-cal'],body:[
    "On Oct. 13, Mustang Partners and Texas Capital announced a jersey patch deal that covers all 17 SMU varsity programs. SMU Athletics calls it the first all-sports patch agreement for a Power Four program in Texas. The Texas Capital logo started appearing on SMU competition uniforms that week.",
    "It builds on an earlier deal. Weeks before, Texas Capital had become the first end-zone sponsor in the history of SMU Football and Gerald J. Ford Stadium. SMU Athletics says the patch deal was secured together with Learfield.",
    "Two days later, on Oct. 15, SMU announced a men's lacrosse program, the first NCAA Division I men's lacrosse team in Texas. It begins play in the spring of 2028.",
    "The conference math matters. SMU will be the ACC's sixth men's lacrosse program, and six is the threshold the ACC needs for an automatic bid to the NCAA tournament, subject to NCAA approval.",
    "The money came fast. SMU Athletics says it raised $15 million for lacrosse in two months, toward a $25 million goal by April 1, 2027. Ryan McCabe, Senior Associate Athletics Director for Compliance, is leading the build-out of the program.",
    "The case for Texas, per SMU's announcement: more than 3,200 high school lacrosse players on nearly 160 varsity and junior varsity teams statewide, and, until SMU's announcement, no Division I men's program in the state."]});
 var WKND=A('smu-weekend-oct24','general','Insider · Weekend roundup','No. 19, a first ACC title, and a fifth in the wind',
   'Football climbs to No. 19 in the AP poll, men\'s soccer clinches a share of the program\'s first ACC regular-season title, and women\'s golf finishes fifth at the Landfall Tradition.','3 min read',false,'NO. 19',
   {sources:[['SMU Athletics: SMU rises to 19th in AP poll, Oct. 25',N+'10/25/football-smu-rises-to-19th-in-ap-poll'],['SMU Athletics: men\'s soccer clinches a share of the ACC regular-season title, Oct. 25',N+'10/25/mens-soccer-no-1-smu-clinches-a-share-of-acc-regular-season-title'],['SMU Athletics: women\'s golf fifth at the Landfall Tradition, Oct. 25',N+'10/25/womens-golf-huh-with-career-best-finish-smu-womens-golf-locks-up-fifth-at-landfall-tradition']],
    dek:'Three SMU stories from the weekend of Oct. 24-25, beyond the 59-20 win over Cal and the volleyball road sweep.',related:['recap-cal','preview-msoc-louisville','preview-syracuse'],body:[
    "Football moved up to No. 19 in Sunday's AP Top 25 and is No. 16 in the coaches poll. SMU Athletics notes the Mustangs have been ranked in the AP poll every week of the 2026 season, their longest such run since 1985. The jump followed the 59-20 win over Cal, when SMU outscored the Golden Bears 42-0 after halftime and held them to 50 yards in the second half.",
    "Men's soccer became the first SMU program to win an ACC regular-season title. The 2-0 win at Cal on Saturday, plus Clemson's draw with Virginia Tech on Sunday, put SMU three points clear with one match left, so the Mustangs have at least a share. They won the 2025 ACC Tournament, so this is the first time the program holds both. The outright title is on the line Friday, Oct. 30, against No. 10 Louisville on senior day at Washburne Stadium.",
    "Women's golf finished fifth of 18 teams at the Landfall Tradition in Wilmington, N.C., at 23 over par (887) in strong winds. SMU finished ahead of three ranked teams in the final standings: No. 2 Auburn, No. 19 Alabama and No. 25 Kentucky. Yoonjeong Huh tied for ninth, her first career top-10 finish, and Celine Chen tied for 14th. It was SMU's last event of the fall. The next one is the Therese Hession Regional Challenge on Jan. 31."]});
 var SWIM=A('smu-swim-classic','swimming-diving','Swimming & Diving · Meet recap','A record tied after 28 years, and two Mustang podiums',
   'At the SMU Classic, Maddy Parker matched a 100 free school record set in 1997-98. Both SMU teams finished third.','2 min read',false,'47.87',
   {date:'Oct. 26, 2026',sources:[['SMU Athletics: women\'s swimming & diving at the SMU Classic, Oct. 10',N+'10/10/womens-swimming-diving-parker-ties-school-record-smu-places-third-at-smu-classic'],['SMU Athletics: men\'s swimming & diving at the SMU Classic, Oct. 10',N+'10/10/mens-swimming-diving-sitz-and-brennan-bring-home-wins-no-21-mustangs-finish-third']],
    dek:'The home meet at Robson and Lindley Aquatics Center on Oct. 10, in numbers SMU Athletics published.',related:['smu-weekend-oct24','smu-business-october','vb-road-sweep'],body:[
    "Maddy Parker swam the 100 freestyle in 47.87 seconds, tying the SMU record Martina Moravcova set in the 1997-98 season. The time is also an NCAA standard.",
    "Dori Hathazi won the 200 butterfly in 1:56.26, another NCAA standard, which makes her the second-fastest Mustang ever in the event. The women finished third behind No. 18 Arizona State and Arkansas, SMU's best SMU Classic finish since 2014-15.",
    "The No. 21 men also finished third, up from fifth at the same meet last season. Francis Brennan won the 500 freestyle in 4:18.54, and Luke Sitz won 3-meter diving with 427.25 points."]});
 var ROW=A('smu-rowing-charles','rowing','Rowing · Race recap','Bronze on the Charles',
   'SMU opened its fall at the Head of the Charles with a third-place medal in the women\'s club fours.','2 min read',false,'3RD',
   {sources:[['SMU Athletics: SMU rowing at the Head of the Charles, Oct. 22',N+'10/22/bronze-medal-highlights-strong-showing-for-smu-rowing-at-head-of-the-charles']],
    dek:'Cambridge, Mass., mid-October: the first races of SMU Rowing\'s 2026 fall.',related:['smu-swim-classic','smu-weekend-oct24','smu-micd-ep7'],body:[
    "The club four, coxed by Sophie Swords with Izie Murray, Britt Potman, Freya Weiser and Jesse Pulford, finished third in 19:18.001 for a bronze medal.",
    "The club eight started 32nd and finished 14th in 17:35.367.",
    "The Head of the Charles opened SMU's fall; rowing's championship season is in the spring. Next up: an exhibition against Texas at White Rock Lake on Nov. 8."]});

 /* --- fictional -> real (same spot in the library) --- */
 var SWAP={
  'rivalry-week':V('smu-fb-avail-1020','8dF4BnXUwFM','football','Football · Game week','SMU Football: Rhett Lashlee and Kevin Jennings, game-week media availability','The head coach and the quarterback, on the Monday before the Cal game (Oct. 20).','11:55',true,'MON'),
  'hilltop-unfiltered':V('smu-fb-avail-0814','BROtwaI4fo4','football','Football · Fall camp','SMU Football: Fall camp media availability','From fall camp, Aug. 14: SMU Football\'s media availability with Coach Thibodeaux, J. Jefferson and M. Alcorn-Crowder.','10:27',true,'CAMP'),
  'thursday-notes':V('smu-fb-avail-1021','pUxLSL-a9EA','football','Football · Practice week','SMU Football: Alexander Kilgore and Jalen Hale, media availability','Mid-week before Cal (Oct. 21), in their own words.','7:52',true,'WED',{cat:'insider'}),
  'coachs-corner-acc':BIZ,
  'micd-setter':MIC('smu-micd-s2e3','r8ONHsCIOXI','volleyball',"Mustangs Mic'd Up: S2E3 with Nicole Nelson and Sam Erger","SMU's official podcast-style show. Women's soccer coach Nicole Nelson and volleyball coach Sam Erger.",'55:47',false),
  'moody-opening':V('smu-mbb-enfield-tipoff','G2j2BzUhIIQ','mens-basketball','Men\'s Basketball · ACC Tipoff','SMU Men\'s Basketball: Andy Enfield at ACC Tipoff','The head coach, live at the ACC\'s preseason media event.','4:15',true,'TIPOFF'),
  'building-contender':V('smu-wbb-tipoff','WqyK1ihLuS0','womens-basketball','Women\'s Basketball · ACC Tipoff','SMU Women\'s Basketball: Zahra King and Theresa Hagans Jr. at ACC Tipoff','Two Mustangs, live at the ACC\'s preseason media event.','2:06',false,'TIPOFF',{cat:'insider'}),
  'five-am-laps':SWIM,
  'film-rotation':V('smu-vb-pitt-highlights','UsFpeU8zQc8','volleyball','Film Room · Official highlights','SMU Volleyball: Highlights at Pittsburgh','Oct. 7: SMU wins 3-1 at No. 2 Pitt and ends the nation\'s longest home winning streak.','6:52',false,'3-1',{cat:'film'}),
  'coachs-corner-pod':MIC('smu-micd-s2e1','ci3EFPGK9ug','football',"Mustangs Mic'd Up: S2E1 with Kevin Jennings, Yamir Knight and Rhett Lashlee","SMU's official podcast-style show, hosted by Rich Phillips and Breanna Sorensen. Season 2 opener.",'55:09',true),
  'pony-up-pod':MIC('smu-micd-s2e4','OeuSowGSDKc','football',"Mustangs Mic'd Up: S2E4 with Josh Bates, Malcom Alcorn-Crowder and Rhett Lashlee","SMU's official podcast-style show. Two Mustangs and the head coach.",'44:17',true),
  'paddock-report':MIC('smu-micd-s2e2','6HGaxWi0pgc','football',"Mustangs Mic'd Up: S2E2 with Yannick Smith, Aakil Washington and Rhett Lashlee","SMU's official podcast-style show. Two Mustangs and the head coach.",'43:35',true)
 };
 /* boulevard-nights-1 keeps its id because the home hero (app.js) looks it up by id */
 var BLVD=V('boulevard-nights-1','K3Frl1564us','football','Gameday · The Boulevard','The Boulevard on The ACC Huddle','SMU\'s tailgate on the Boulevard, as the ACC Huddle saw it. An official SMU Athletics video.','3:06',false,'BLVD');

 /* --- new real items (no fictional item to replace) --- */
 var ADD=[
  V('smu-vb-clemson-highlights','qN1Fi-iZKqY','volleyball','Volleyball · Official highlights','SMU Volleyball: Highlights at Clemson','Oct. 23: the first of two straight-set road wins that week.','5:16',false,'3-0'),
  V('smu-msoc-uca-highlights','r8eRcnB6hgA','mens-soccer',"Men's Soccer · Official highlights","SMU Men's Soccer: Highlights vs. Central Arkansas",'Oct. 20 at Washburne: a 5-2 win with a Stephan Soghomonian hat trick.','5:00',false,'5-2'),
  V('smu-msoc-duke-highlights','iDFfJ7K_v5M','mens-soccer',"Men's Soccer · Official highlights","SMU Men's Soccer: Highlights vs. Duke",'Oct. 10 at Washburne: six goals against Duke.','7:00',false,'6-0'),
  V('smu-texas-capital-video','gmS6-Od3kao','general','SMU Athletics · Announcement','SMU Athletics: The Texas Capital jersey patch','The 38-second official unveiling of the all-sports patch.','0:38',false,'PATCH'),
  V('smu-wsoc-uva-presser','Y13qxDMUcK4','womens-soccer',"Women's Soccer · Postgame","SMU Women's Soccer: Postgame press conference vs. Virginia",'After the Oct. 11 match against Virginia.','4:01',false,'POST'),
  V('smu-mbb-tipoff-players','dUFQzkxtC5M','mens-basketball',"Men's Basketball · ACC Tipoff","SMU Men's Basketball: Rowan Brumbaugh and Jaden Toombs at ACC Tipoff",'Two Mustangs, live at the ACC\'s preseason media event.','5:44',false,'TIPOFF'),
  MIC('smu-micd-s2e5','FlfwXzJfJk0','mens-basketball',"Mustangs Mic'd Up: S2E5 with Adia Barnes and Andy Enfield","SMU's official podcast-style show. Both basketball head coaches, before the season.",'59:36',false),
  MIC('smu-micd-ep14','lFQ8qbqxRJs','tennis',"Mustangs Mic'd Up (2025-26): Episode 14","From last season (Feb. 2026): men's tennis coach Grant Chen, track and field coach 'A Havahla Haynes, Adia Barnes and Andy Enfield.",'51:19',false),
  MIC('smu-micd-ep13','HpWWtUJ29Hk','swimming-diving',"Mustangs Mic'd Up (2025-26): Episode 13","From last season (Jan. 2026): diving coach Darrian Schmidt, women's golf coach Lauren Mason, Adia Barnes and Chris Capko.",'56:46',false),
  MIC('smu-micd-ep7','GqriXf_TOME','rowing',"Mustangs Mic'd Up: Episode 7 (last season)","From an earlier season of the show: rowing coach Chase Graham, equestrian coach Brad Kearns and Andy Enfield.",'49:04',false),
  WKND,ROW];

 /* the existing official videos group by sport in the player's episode list, matching SMU's own titles */
 var RETITLE={'smu-fb-cal-highlights':'SMU Football: Highlights vs. Cal','smu-fb-uva-highlights':'SMU Football: Highlights vs. Virginia','smu-msoc-cal-highlights':"SMU Men's Soccer: Highlights at Cal",
  'smu-vb-gt-highlights':'SMU Volleyball: Highlights at Georgia Tech','smu-micd-up-s2e6':"Mustangs Mic'd Up: S2E6 with Kyle Ward, Riley Dodge and Rhett Lashlee"};
 var SPORT={'smu-fb-cal-highlights':'football','smu-fb-uva-highlights':'football','smu-msoc-cal-highlights':'mens-soccer','smu-vb-gt-highlights':'volleyball','smu-micd-up-s2e6':'football'};

 /* --- fictional items kept (nothing real fits). Labeled Sample on the card; the dek already says fictional. --- */
 var KEEP=['boulevard-nights-2','walk-on','film-pressure','film-screen','film-session-redzone'];

 var idmap={};
 MP.LIB=MP.LIB.map(function(c){var r=SWAP[c.id];if(r){idmap[c.id]=r.id;delete MP.ARTICLES[c.id];return r}
   if(c.id==='boulevard-nights-1'){delete MP.ARTICLES[c.id];return BLVD}
   if(RETITLE[c.id]){c.title=RETITLE[c.id];c.sport=SPORT[c.id]}
   if(c.id==='smu-micd-up-s2e6'){c.t='podcast';c.cat='podcasts';c.label="Mustangs Mic'd Up · Official podcast";c.credit="Mustangs Mic'd Up · SMU Athletics"}
   if(KEEP.indexOf(c.id)>=0&&!/^Sample/.test(c.label)){c.label='Sample · '+c.label;if(!/fictional/i.test(c.desc))c.desc+=' (Fictional sample.)'}
   return c});
 var at=0;for(var i=0;i<MP.LIB.length;i++)if(MP.LIB[i].id==='walk-on'){at=i;break}
 Array.prototype.splice.apply(MP.LIB,[at,0].concat(ADD.filter(function(c){return c.t==='article'})));
 var vi=0;for(var q=0;q<MP.LIB.length;q++)if(MP.LIB[q].id==='smu-vb-gt-highlights'){vi=q+1;break}
 Array.prototype.splice.apply(MP.LIB,[vi,0].concat(ADD.filter(function(c){return c.t!=='article'&&c.t!=='podcast'})));
 var pods=MP.LIB.filter(function(c){return c.cat==='podcasts'}).concat(ADD.filter(function(c){return c.t==='podcast'}));
 MP.LIB=MP.LIB.filter(function(c){return c.cat!=='podcasts'});var pi=MP.LIB.length;for(var j=0;j<MP.LIB.length;j++)if(MP.LIB[j].id==='trail-live'){pi=j;break}
 Array.prototype.splice.apply(MP.LIB,[pi,0].concat(pods));
 /* point every related list at the real items */
 Object.keys(MP.ARTICLES).forEach(function(k){var a=MP.ARTICLES[k];if(a&&a.related)a.related=a.related.map(function(r){return idmap[r]||r})});

 /* --- hand-picked All Access per sport page: real first (read by app.js once admin-edits/real-content.patch lands) --- */
 var X=MP.ACCESS||{},keep=function(slug){return (X[slug]||[]).filter(function(x){return typeof x!=='string'||!idmap[x]&&['moody-opening','building-contender','five-am-laps'].indexOf(x)<0})};
 MP.ACCESS={
  'football':['preview-syracuse','smu-weekend-oct24','smu-fb-cal-highlights','recap-cal','feature-raphael','smu-fb-avail-1020','smu-micd-s2e1'],
  'mens-soccer':['preview-msoc-louisville','smu-weekend-oct24','smu-msoc-cal-highlights','smu-msoc-uca-highlights','smu-msoc-duke-highlights'],
  'volleyball':['vb-road-sweep','smu-vb-gt-highlights','smu-vb-clemson-highlights','smu-vb-pitt-highlights','smu-micd-s2e3'],
  'mens-basketball':keep('mens-basketball').concat(['smu-mbb-enfield-tipoff','smu-mbb-tipoff-players','smu-micd-s2e5']),
  'womens-basketball':keep('womens-basketball').concat(['smu-wbb-tipoff','smu-micd-s2e5']),
  'womens-soccer':keep('womens-soccer').concat(['smu-wsoc-uva-presser','smu-micd-s2e3']),
  'swimming-diving':keep('swimming-diving').concat(['smu-swim-classic','smu-micd-ep13']),
  'golf':keep('golf').concat(['smu-weekend-oct24','smu-micd-ep13']),
  'tennis':keep('tennis').concat(['smu-micd-ep14']),
  'track-field':keep('track-field').concat(['smu-micd-ep14']),
  'rowing':keep('rowing').concat(['smu-rowing-charles','smu-micd-ep7']),
  'equestrian':keep('equestrian').concat(['smu-micd-ep7'])};
 /* home hero pick (read by app.js once real-content.patch lands; until then the hero stays on boulevard-nights-1) */
 MP.FEATURED='smu-fb-cal-highlights';
})();
