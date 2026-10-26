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
  {id:'preview-msoc-louisville',t:'article',cat:'insider',label:"Men's Soccer · Preview",title:"ACC champions, with one to play: men's soccer hosts Louisville",desc:'SMU has clinched a share of its first ACC regular-season title. No. 10 Louisville visits Washburne on Friday, senior day.',dur:'3 min read',lock:false,tone:'black',big:'12-0-2',isNew:true,expires:'2026-10-30T18:30:00-05:00'},
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
  sources:[['SMU Athletics: Mustangs are ACC champions, clinch a share of regular-season title (Oct. 25)','https://smumustangs.com/news/2026/10/25/mens-soccer-no-1-smu-clinches-a-share-of-acc-regular-season-title'],['SMU Athletics 2026 men\'s soccer schedule','https://smumustangs.com/sports/mens-soccer/schedule/2026'],['SMU Athletics men\'s soccer roster','https://smumustangs.com/sports/mens-soccer/roster/2026'],['Recap: SMU 2, Cal 0','https://smumustangs.com/news/2026/10/24/mens-soccer-no-1-smu-wins-2-0-at-cal-grabs-10th-clean-sheet-of-the-season'],['Recap: SMU 5, Central Arkansas 2','https://smumustangs.com/news/2026/10/20/mens-soccer-soghomonian-hat-trick-no-1-smu-downs-uca-5-2'],['Recap: SMU 1, NC State 0','https://smumustangs.com/news/2026/9/18/mens-soccer-panozzo-winner-no-5-smu-takes-down-nc-state-in-acc-home-opener'],['Recap: SMU 2, LMU 0','https://smumustangs.com/news/2026/8/28/mens-soccer-villagomez-winner-no-5-smu-wins-2-0-against-lmu']],
  dek:'SMU has clinched at least a share of the ACC regular-season title, the first in school history, and is unbeaten in 14 matches. No. 10 Louisville visits Washburne on senior day, with the outright title in play. Fri., Oct. 30 · 6:30 p.m. CT · ACC Network.',
  related:['preview-syracuse','vb-road-sweep','film-rotation'],body:[
  "SMU men's soccer is an ACC regular-season champion. The 2-0 win at Cal on Saturday clinched at least a share of the 2026 title, the first ACC regular-season title won by any SMU program. The Mustangs went into the weekend one point ahead of No. 3 Clemson. Clemson drew Virginia Tech the next day, and SMU now sits three points clear with one week of the regular season left.",
  "It's a double, too. Kevin Hudson's team won the 2025 ACC Tournament, and it's the first SMU team to bring home both the tournament and the regular-season title.",
  "Fourteen matches in, the 2026 SMU men's soccer team hasn't lost. It's 12-0-2 overall and 6-0-1 in the ACC. SMU Athletics has listed the Mustangs at No. 1 since early October.",
  "The defense is the main reason. SMU has allowed five goals all season and shut out 10 opponents, including the 2-0 win at Cal last Saturday. The attack has 41 goals. Six of them came against Duke on Oct. 10 and six more against Houston Christian in August.",
  "There have been big early results. On Aug. 24 SMU won 4-0 at No. 4 Saint Louis. In ACC play it has won at Pitt, Virginia Tech, Wake Forest and Cal. The only blemishes are a 1-1 draw with Kansas City and a 0-0 draw with No. 25 Stanford on Oct. 16.",
  "The goals have come from all over the roster. Stephan Soghomonian, a junior forward from Santa Clarita, Calif., had a hat trick in the 5-2 win over Central Arkansas on Oct. 20. Enzo Panozzo, a graduate defender from Sarasota, Fla., scored the only goal against NC State in the ACC home opener. Joseluis Villagomez, a freshman defender from El Paso, scored the winner against LMU in August.",
  "No. 10 Louisville is the last match on SMU's regular-season schedule, and it's senior day at Washburne. SMU Athletics says the Mustangs have a chance to become outright ACC regular-season champions at home. If they avoid a loss, they also finish the regular season unbeaten, under the lights."]};

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
 'msoc':{file:'msoc-salute-night.webp',pos:'50% 62%',alt:'The SMU men\'s soccer team salutes the crowd under the lights'}};
(function(){var IMG={'boulevard-nights-1':'students','boulevard-nights-2':'hype','hilltop-unfiltered':'hurdle','rivalry-week':'catch-cal','moody-opening':'moody-bowl','five-am-laps':'swim','film-rotation':'vb-spike','building-contender':'wbb-jumper',
 'film-pressure':'ol-59','film-screen':'snap','film-session-redzone':'carrier-2','building-roster':'huddle','pony-up-pod':'students'};
 MP.LIB.forEach(function(c){if(IMG[c.id])c.img=IMG[c.id]})})();
