/* Mustangs+ concept site. Shared header/footer, demo modal and per-page renderers. */
(function(){
  var MP=window.MP, body=document.body, ROOT=body.dataset.root||'', PAGE=body.dataset.page||'home';
  function $(s,el){return (el||document).querySelector(s)}
  function $$(s,el){return Array.prototype.slice.call((el||document).querySelectorAll(s))}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function money(n){return '$'+Math.round(n).toLocaleString()}
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}

  var PLUS='<svg viewBox="0 0 20 20"><path d="M8 2h4v6h6v4h-6v6H8v-6H2V8h6z" fill="#fff"/></svg>';
  var LOCK='<svg viewBox="0 0 24 24"><path d="M17 9V7A5 5 0 0 0 7 7v2H5v13h14V9zM9 7a3 3 0 0 1 6 0v2H9z"/></svg>';
  var CHAT='<svg viewBox="0 0 24 24"><path d="M4 4h16v12H8l-4 4z"/></svg>';
  var FLAME='<svg viewBox="0 0 24 24"><path d="M12 2s6 5 6 11a6 6 0 0 1-12 0c0-3 2-5 2-5s0 3 2 4c0-5 2-10 2-10z"/></svg>';
  var PIN='<svg viewBox="0 0 24 24"><path d="M14 2l8 8-3 1-4 4 1 5-2 2-4-4-5 5-1-1 5-5-4-4 2-2 5 1 4-4z"/></svg>';
  var SIL='<svg class="sil" viewBox="0 0 200 180" aria-hidden="true"><circle cx="100" cy="58" r="38" fill="rgba(255,255,255,.88)"/><path d="M20 180c4-52 38-78 80-78s76 26 80 78z" fill="rgba(255,255,255,.88)"/></svg>';

  /* Original uniform-style jerseys in SMU Red, SMU Blue and white. Numbers only; no logos or marks. */
  var KITS={home:{b:'#CC0035',t:'#354CA1',n:'#fff',o:'#354CA1',s:'none'},away:{b:'#fff',t:'#CC0035',n:'#CC0035',o:'#354CA1',s:'rgba(53,76,161,.25)'},alt:{b:'#354CA1',t:'#CC0035',n:'#fff',o:'#CC0035',s:'none'}};
  function kit(num,v,singlet){var k=KITS[v]||KITS.home,n=String(num);
    var body=singlet?'M42 8Q60 24 78 8L86 10Q83 34 94 44V114H26V44Q37 34 34 10Z':'M38 10L50 6Q60 15 70 6L82 10L110 27L99 50L87 44V114H33V44L21 50L10 27Z';
    var trim=singlet?'<path d="M42 8Q60 24 78 8" fill="none" stroke="'+k.t+'" stroke-width="5"/><path d="M34 10Q37 34 26 44M86 10Q83 34 94 44" fill="none" stroke="'+k.t+'" stroke-width="4"/>'
      :'<path d="M50 6Q60 15 70 6" fill="none" stroke="'+k.t+'" stroke-width="5"/><path d="M14 35L24 40M106 35L96 40M17 29L27 34M103 29L93 34" stroke="'+k.t+'" stroke-width="3.5"/><path d="M33 104H87" stroke="'+k.t+'" stroke-width="4"/>';
    return '<svg class="kit" viewBox="0 0 120 120" aria-hidden="true"><path d="'+body+'" fill="'+k.b+'" stroke="'+k.s+'" stroke-width="2" stroke-linejoin="round"/>'+trim+
      '<text x="60" y="'+(singlet?84:82)+'" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="'+(n.length>2?26:n.length>1?36:40)+'" fill="'+k.n+'" stroke="'+k.o+'" stroke-width="3" paint-order="stroke" letter-spacing="-1">'+esc(n)+'</text></svg>'}
  var KIT_BG={home:'linear-gradient(170deg,#354CA1,#262626)',away:'linear-gradient(170deg,#CC0035,#262626)',alt:'linear-gradient(170deg,#FFFFFF,rgba(53,76,161,.35))'};
  var JERSEY_SPORTS=/football|basketball|soccer|volleyball/;
  var ICON={
    'football':'<ellipse cx="16" cy="16" rx="13" ry="8" transform="rotate(-35 16 16)"/><path d="M12 20l8-8M13.5 15.5l3 3M15.5 13.5l3 3"/>',
    'mens-basketball':'<circle cx="16" cy="16" r="12"/><path d="M4 16h24M16 4v24M7.5 7.5c5 5 5 12 0 17M24.5 7.5c-5 5-5 12 0 17"/>',
    'womens-basketball':'<circle cx="16" cy="16" r="12"/><path d="M4 16h24M16 4v24M7.5 7.5c5 5 5 12 0 17M24.5 7.5c-5 5-5 12 0 17"/>',
    'womens-soccer':'<circle cx="16" cy="16" r="12"/><path d="M16 10l5 3.5-2 6h-6l-2-6zM16 10V4M21 13.5l6-2M19 19.5l3.5 5M13 19.5l-3.5 5M11 13.5l-6-2"/>',
    'mens-soccer':'<circle cx="16" cy="16" r="12"/><path d="M16 10l5 3.5-2 6h-6l-2-6zM16 10V4M21 13.5l6-2M19 19.5l3.5 5M13 19.5l-3.5 5M11 13.5l-6-2"/>',
    'volleyball':'<circle cx="16" cy="16" r="12"/><path d="M16 4c-1 6 1 10 6 13M28 18c-6-1-10 0-13 6M6 22c4-4 6-9 4-16"/>',
    'swimming-diving':'<path d="M3 20c3 0 3 2 6.5 2S13 20 16 20s3 2 6.5 2S26 20 29 20M3 26c3 0 3 2 6.5 2S13 26 16 26s3 2 6.5 2S26 26 29 26"/><circle cx="22" cy="8" r="3"/><path d="M6 16l7-6 5 4"/>',
    'golf':'<path d="M12 28V4l12 5-12 5M6 28h14"/>',
    'tennis':'<circle cx="16" cy="16" r="12"/><path d="M6 8c5 3 6 13 0 16M26 8c-5 3-6 13 0 16"/>',
    'track-field':'<circle cx="16" cy="18" r="10"/><path d="M16 18l4-4M13 4h6M16 4v4"/>',
    'rowing':'<path d="M5 27L25 7M7 7l20 20M22 4l6 6M4 22l6 6"/>',
    'equestrian':'<path d="M9 27V15a7 7 0 0 1 14 0v12M6 27h6M20 27h6"/>'
  };
  function sportIcon(slug){return '<svg viewBox="0 0 32 32" aria-hidden="true">'+(ICON[slug]||ICON.football)+'</svg>'}
  function sportBy(slug){for(var i=0;i<MP.SPORTS.length;i++)if(MP.SPORTS[i].slug===slug)return MP.SPORTS[i];return null}
  function sportUrl(slug){return ROOT+'sports/'+slug+'/'}
  function threadUrl(id){return ROOT+'boards/#t'+id}

  /* ---------- Shell: header, footer, thumb bar, modal ---------- */
  var navItems=[['Watch',ROOT+'#watch','watch'],['Sports',ROOT+'#sports','sports'],['Boards',ROOT+'boards/','boards'],['Athletes',ROOT+'#athletes','athletes'],['Membership',ROOT+'#membership','membership']];
  var subItems=navItems.slice(0,4).concat([['Your Impact',ROOT+'#nil','nil'],['Membership',ROOT+'#membership','membership']]);
  function navLinks(items){return items.map(function(n){
    var on=(PAGE==='boards'&&n[2]==='boards')||(PAGE==='sport'&&n[2]==='sports')||(PAGE==='athlete'&&n[2]==='athletes');
    return '<a href="'+n[1]+'"'+(on?' class="on" aria-current="page"':'')+(n[2]==='watch'?' data-filter-link="video"':'')+'>'+n[0]+'</a>'}).join('')}
  var wordmark=function(cls){return '<a href="'+(ROOT||'./')+'" class="wordmark'+(cls||'')+'" aria-label="Mustangs+ home"><span class="m">Mustangs</span><span class="plus" aria-hidden="true">'+PLUS+'</span></a>'};

  $('#site-header').outerHTML='<header class="site"><div class="wrap hdr">'+wordmark()+
    '<nav class="main" aria-label="Primary">'+navLinks(navItems)+'</nav>'+
    '<button class="btn btn-red btn-sm" data-demo="Join Mustangs+">Join Now</button></div>'+
    '<nav class="subnav" aria-label="Sections">'+navLinks(subItems)+'</nav></header>';

  var sportLinks=MP.SPORTS.map(function(s){return '<li><a href="'+sportUrl(s.slug)+'">'+s.name+'</a></li>'});
  $('#site-footer').outerHTML='<footer><div class="wrap ft"><div>'+wordmark(' lg')+
    '<p style="margin:14px 0 14px;max-width:340px">Every moment. Every Mustang. A fan membership where your subscription helps pay the athletes you cheer for.</p>'+
    '<span class="powered">Powered by Learfield <em>(concept)</em></span></div>'+
    '<div class="cols">'+
    '<div><h4>Fall &amp; Winter</h4><ul>'+sportLinks.slice(0,6).join('')+'</ul></div>'+
    '<div><h4>More Sports</h4><ul>'+sportLinks.slice(6).join('')+'</ul></div>'+
    '<div><h4>Community</h4><ul><li><a href="'+ROOT+'boards/">Message Boards</a></li><li><a href="'+ROOT+'#watch">Watch</a></li><li><a href="'+ROOT+'#athletes">Athletes</a></li><li><a href="'+ROOT+'athletes/">Player Profiles</a></li></ul></div>'+
    '<div><h4>Members</h4><ul><li><a href="'+ROOT+'#membership">Plans</a></li><li><a href="'+ROOT+'#nil">NIL Fund</a></li><li><a href="'+ROOT+'#faq">FAQ</a></li></ul></div>'+
    '</div><div class="legal" style="grid-column:1/-1">'+
    '<p style="margin:0 0 8px"><strong>Concept mockup for an SMU Cox class project. Not affiliated with or endorsed by SMU Athletics or Learfield.</strong></p>'+
    '<p style="margin:0">All content, athletes, coaches, board users, schedules, prices and figures are fictional sample data. No SMU or Learfield logos or trademarks are used; the Mustangs+ wordmark is an original design for this demo. No payments are processed.'+(MP.ATHLETES?' Exception: the Player Profiles pages show real SMU football players using public stats, with sources linked on each profile; NIL values and film there are illustrative.':'')+'</p>'+
    '</div></div></footer>';

  document.body.insertAdjacentHTML('beforeend',
    '<div class="thumbbar" id="thumbbar" aria-hidden="true"><a href="'+ROOT+'#nil" class="btn btn-outline">Where $ goes</a><a href="'+ROOT+'#membership" class="btn btn-red">See Plans</a></div>'+
    '<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modal-h"><div class="sheet">'+
    '<div class="ic"><svg width="30" height="30" viewBox="0 0 20 20"><path d="M8 2h4v6h6v4h-6v6H8v-6H2V8h6z" fill="#CC0035"/></svg></div>'+
    '<h3 id="modal-h">Demo only</h3><p><span class="what" id="modalWhat">Join Mustangs+</span><br>This is a concept mockup for a class presentation. No sign-up, posting or payment happens here.</p>'+
    '<button class="btn btn-red" id="modalClose">Got it</button></div></div>');

  var modal=$('#modal'),what=$('#modalWhat');
  document.addEventListener('click',function(e){
    var el=e.target.closest('[data-demo]');if(!el)return;
    e.preventDefault();what.textContent=el.dataset.demo;modal.classList.add('open');$('#modalClose').focus();
  });
  function closeModal(){modal.classList.remove('open')}
  $('#modalClose').addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal()});

  // Sticky thumb bar: after the first screen, hidden while the plans are on screen
  var bar=$('#thumbbar'),heroEl=$('.hero,.sp-hero,.board-hero,.ap-hero'),tiers=$('#membership'),pastHero=false,onTiers=false;
  function upd(){var s=pastHero&&!onTiers;bar.classList.toggle('show',s);bar.setAttribute('aria-hidden',!s)}
  if('IntersectionObserver' in window){
    if(heroEl)new IntersectionObserver(function(es){pastHero=!es[0].isIntersecting;upd()},{rootMargin:'-120px 0px 0px 0px'}).observe(heroEl);
    if(tiers)new IntersectionObserver(function(es){onTiers=es[0].isIntersecting;upd()},{threshold:.25}).observe(tiers);
  }

  /* ---------- Shared pieces ---------- */
  function avatar(uid,lg){var u=MP.USERS[uid],n=u.n.replace(/[^A-Za-z]/g,'');
    var hues=['#354CA1','#CC0035','#59C3C3','#262626','#354CA1'],h=0;for(var i=0;i<n.length;i++)h+=n.charCodeAt(i);
    return '<span class="av'+(lg?' lg':'')+(u.staff?' staff':'')+'" style="'+(u.staff?'':'background:'+hues[h%hues.length])+'" aria-hidden="true">'+n.charAt(0).toUpperCase()+'</span>'}
  function forumBy(id){for(var i=0;i<MP.FORUMS.length;i++)if(MP.FORUMS[i].id===id)return MP.FORUMS[i]}
  function threadRow(t){
    var f=forumBy(t.f),u=MP.USERS[t.by],s=t.sport&&sportBy(t.sport),pills='';
    if(t.pin)pills+='<span class="pill pin">'+PIN+'Pinned</span>';
    if(t.hot)pills+='<span class="pill hot">'+FLAME+'Hot</span>';
    if(f.prem)pills+='<span class="pill red">'+LOCK+'Members</span>';
    pills+='<span class="pill">'+esc(f.name)+'</span>';
    if(s)pills+='<span class="pill navy">'+esc(s.name)+'</span>';
    return '<a class="thread" href="'+threadUrl(t.id)+'">'+avatar(t.by)+'<div><div class="t-pills">'+pills+'</div>'+
      '<p class="t-title">'+esc(t.title)+'</p><div class="t-meta"><span>by <b>'+esc(u.n)+'</b></span><span>'+t.ago+' ago</span><span>'+t.replies.toLocaleString()+' replies</span><span>'+t.views+' views</span></div></div></a>'}

  function cardHTML(c){
    var IC={video:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',article:'<svg viewBox="0 0 24 24"><path d="M5 4h14v2H5zm0 4h14v2H5zm0 4h14v2H5zm0 4h9v2H5z"/></svg>',podcast:'<svg viewBox="0 0 24 24"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11z"/></svg>'};
    return '<button class="card" data-type="'+c.t+'" '+(c.t==='article'&&c.id?'data-article="'+c.id+'"':'data-demo="'+esc(c.title)+'"')+'>'+
      '<div class="thumb"><div class="art" style="background:'+c.art+'"></div><span class="glyph" aria-hidden="true">'+IC[c.t]+'</span>'+
      '<span class="badge">'+({video:'Watch',article:'Read',podcast:'Listen'})[c.t]+'</span>'+
      (c.lock?'<span class="lock">'+LOCK+'Members</span>':'<span class="free">Free</span>')+'<span class="dur">'+c.dur+'</span></div>'+
      '<div class="card-b"><div class="meta">'+esc(c.label)+'</div><h3>'+esc(c.title)+'</h3><p>'+esc(c.desc)+'</p></div></button>'}

  /* Deterministic "random" generator so every visitor sees the same made-up roster */
  function rng(seed){var h=1779033703^seed.length;for(var i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19}
    return function(){h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);var t=(h^=h>>>16)>>>0;return t/4294967296}}
  function pick(r,a){return a[Math.floor(r()*a.length)]}

  /* ---------- Home content + fictional articles ---------- */
  var ART={blue:'linear-gradient(160deg,#262626 0%,#354CA1 60%,#59C3C3 130%)',red:'linear-gradient(135deg,#CC0035 0%,#262626 60%,#354CA1 100%)',
    pod:'radial-gradient(circle at 30% 30%,#FF1053 0%,#CC0035 35%,#262626 100%)',stripe:'linear-gradient(115deg,#354CA1 0 45%,#CC0035 45% 52%,#262626 52% 100%)',
    light:'linear-gradient(200deg,#ffffff 0%,#59C3C3 45%,#354CA1 100%)',conic:'conic-gradient(from 210deg at 70% 40%,#CC0035,#262626,#354CA1,#CC0035)',
    night:'radial-gradient(120% 90% at 80% 10%,#F9C80E 0%,rgba(249,200,14,0) 30%),linear-gradient(160deg,#354CA1,#262626)',
    pool:'linear-gradient(180deg,#59C3C3 0%,#354CA1 55%,#262626 100%)',court:'linear-gradient(135deg,#354CA1 0%,#262626 70%),#262626',
    gold:'linear-gradient(150deg,#262626 0%,#354CA1 55%,#F9C80E 140%)'};
  var HOME_CONTENT=[
    {t:'video',label:'Video Series',title:'Hilltop Unfiltered: Fall Camp',desc:'Ep. 4 · All-access cameras inside two-a-days and the locker room.',dur:'24:18',lock:true,art:ART.red},
    {t:'article',id:'walk-on',label:'Player Feature',title:'From walk-on to Saturday starter',desc:'How one fictional linebacker rewrote his path in four years.',dur:'8 min read',lock:true,art:ART.blue},
    {t:'video',label:'Docuseries',title:'Boulevard Nights',desc:'Ep. 1 · Tents, tailgates and the hours before kickoff on the Boulevard.',dur:'21:40',lock:true,art:ART.night},
    {t:'podcast',label:'Podcast',title:"The Coach's Corner",desc:'A weekly sit-down with the head coach on scheme, recruiting and culture.',dur:'41 min',lock:true,art:ART.pod},
    {t:'article',id:'coachs-corner-acc',label:"Coach's Corner",title:"Coach's Corner: Year two in the ACC",desc:'What changed when the road trips got longer and the stadiums got louder.',dur:'7 min read',lock:false,art:ART.gold},
    {t:'video',label:'Game Week',title:'Game Week Access: Rivalry Week',desc:'Walkthroughs, film room and the bus ride to kickoff.',dur:'18:02',lock:true,art:ART.stripe},
    {t:'article',id:'building-contender',label:'Coach Interview',title:'Building a contender in 90 days',desc:"Women's basketball's head coach on roster building in the NIL era.",dur:'6 min read',lock:false,art:ART.light},
    {t:'article',id:'building-roster',label:'Front Office',title:'Building the Roster: NIL, the portal and fit',desc:'Inside the (fictional) war room where every scholarship spot gets debated.',dur:'9 min read',lock:true,art:ART.court},
    {t:'podcast',label:'Podcast',title:'Pony Up: The Locker Room Pod',desc:'Athletes host. Unscripted stories, playlists and pregame rituals.',dur:'33 min',lock:true,art:ART.conic},
    {t:'video',label:'Swimming & Diving',title:'5 a.m. Laps',desc:'Lane lines before sunrise with the swim and dive team during taper week.',dur:'12:55',lock:true,art:ART.pool},
    {t:'video',label:"Mic'd Up",title:"Mic'd Up: The Setter",desc:'Every call, every timeout huddle, from the floor general of volleyball.',dur:'9:47',lock:false,art:ART.red},
    {t:'article',id:'visit-weekend',label:'Recruiting',title:'Visit Weekend: 48 hours on the Hilltop',desc:'Inside an official visit, from the Friday dinner to the Sunday handshake.',dur:'6 min read',lock:true,art:ART.stripe}
  ];
  var STAFF={sam:'Sam Reyes, Mustangs+ Insider',lena:'Lena Ortiz, Mustangs+ Features',jt:'J.T. Barlow, Mustangs+ Recruiting'};
  var ARTICLES={
    'walk-on':{by:STAFF.lena,date:'Oct. 21, 2026',dek:'No scholarship, no guarantees and a 5:30 a.m. alarm. A fictional linebacker shares four years of earning it.',body:[
      'Marcus Delgado did not get a recruiting visit. He got a parking pass, a practice jersey with no name on the back and a locker by the laundry room. Four years later, he takes the field with the first-team defense on Saturdays. (Delgado is a fictional athlete created for this concept.)',
      '"The first year, nobody knew my name," he says. "Coaches called me \'forty-four\' because that was the number on my practice shirt. I decided I was going to be the best forty-four they had ever seen."',
      'Walk-ons do most of the scout-team work. Delgado spent his first two seasons playing the opposing team\'s best linebacker in practice. He learned every blitz package the Mustangs would face, and the defensive staff noticed.',
      'The turning point came in fall camp of his third year. A run of injuries opened up reps on special teams, and Delgado made three tackles in the first scrimmage. By October he was on every coverage unit. By the bowl game he had a scholarship.',
      'NIL changed the math too. Through the Mustangs+ fan fund, members paid Delgado for a Game Week vlog and two youth clinics in Dallas. "It covered rent," he says. "For a guy who paid his own way for two years, that is not small."',
      'His advice to the next walk-on is simple: "Show up first and leave last. Somebody is always watching."'],related:['building-roster','visit-weekend','coachs-corner-acc']},
    'coachs-corner-acc':{by:STAFF.sam,date:'Oct. 18, 2026',dek:'The (fictional) head coach on cross-country road trips, packed visiting stadiums and what a second season in a power conference teaches you.',body:[
      'Year one in the ACC was about proving the Mustangs belonged. In year two, the question is whether they can do it again with every opponent circling the date. Coach Darren Ellsworth, a fictional coach for this concept, sat down with Mustangs+ before the open week.',
      '"The travel is real," he says. "We have trips where you leave Thursday afternoon and land after midnight. We had to rebuild the week around sleep, hydration and keeping the guys on their class schedule."',
      'The staff added a recovery day after long road games and moved the Tuesday film session to the plane on the way home. "You find hours where you can. The guys watch film at 35,000 feet now."',
      'On recruiting, the conference has opened doors. "When a kid from Houston or Atlanta knows he will play in front of 80,000 people on the road, that conversation is easier. Our pitch is simple: big stage, Dallas, a degree that means something."',
      'He credits the fan base too. "Our traveling crowd has shown up everywhere. Members ask me about it at every Q&A. When you look up and see red and blue in a road stadium, the guys feel it."'],related:['building-roster','walk-on','building-contender']},
    'building-contender':{by:STAFF.lena,date:'Oct. 14, 2026',dek:"Women's basketball rebuilt its roster in one offseason. The (fictional) head coach explains how.",body:[
      'When Coach Renee Castillo, a fictional coach for this concept, took over in the spring, she had six scholarship players and ninety days before summer workouts. She now has a full roster, three starters back and a team the conference coaches picked to finish in the top half.',
      '"We started with identity," Castillo says. "Before we talked about anybody\'s jump shot, we decided we would be the best defensive team in the league and play fast. Then we recruited to that."',
      'Four transfers joined from the portal, and two freshmen signed in the late period. Every player met the existing roster before committing. "Culture is not a poster on the wall. It is the players you bring in."',
      'NIL was part of every conversation, and Castillo is direct about it. "Families ask, and they should. Our answer is the fan fund. Members pay athletes for real work like camps, content and appearances. It is transparent and we can explain it."',
      'The first test comes in November with a road trip to a ranked opponent. "We will find out a lot that night," she says. "I like finding out early."'],related:['building-roster','coachs-corner-acc','visit-weekend']},
    'building-roster':{by:STAFF.jt,date:'Oct. 9, 2026',dek:'Inside a (fictional) roster meeting where the portal, NIL budgets and scheme fit all meet on one whiteboard.',body:[
      'There is a whiteboard in the football offices with every scholarship spot on it, color-coded by position, class and contract length. Staff call it "the board." This concept story imagines a Tuesday meeting where the staff argue about it.',
      'Building a roster today is part scouting and part capital budgeting. Every portal target has a fit score from the position coach, a projected role, and a number from the NIL collective the team works with. The general manager role in this story is fictional but modeled on how many programs now operate.',
      '"Fit beats stars," the general manager says. "A three-star who knows our system and wants to be here will outplay a five-star who is here for one year and a check."',
      'Retention matters as much as recruiting. The staff hold meetings with every returning starter in December, and fan-funded NIL from memberships like Mustangs+ helps keep players who could leave for more money elsewhere.',
      'By the end of the meeting the board has three new names in pencil. Pencil, not marker, because nothing is final until signing day.'],related:['walk-on','visit-weekend','building-contender']},
    'visit-weekend':{by:STAFF.jt,date:'Oct. 2, 2026',dek:'Forty-eight hours, a lot of barbecue and one big decision. What an official visit looks like from the inside.',body:[
      'An official visit is a scripted weekend, and the script matters. Every minute of the 48 hours is planned, from the airport pickup to the goodbye at the athletics building. This recap follows two fictional guards on a basketball visit.',
      'Friday starts with dinner at a Dallas steakhouse, with players, coaches and families at one long table. "The players do most of the talking," a staffer says. "Recruits want to hear from the guys they will be in the locker room with."',
      'Saturday is the full tour: academic advising, the Cox business school, the training room and a scrimmage with the visitors courtside. At halftime the student section chants their names. That part is not in the script, but the staff do not discourage it.',
      'The NIL conversation happens Saturday night with the families and compliance staff present. The program walks through the fan-funded model: what athletes are paid for, how payments are reported and what members see each quarter.',
      'Sunday is brunch, a last meeting with the head coach and a handshake. Both guards left without committing. A week later, one did.'],related:['building-roster','walk-on','coachs-corner-acc']}
  };
  var ART_CARDS={};HOME_CONTENT.forEach(function(c){if(c.id)ART_CARDS[c.id]=c});

  /* Article sheet: opens for any card with data-article; hash #article=<id> deep-links */
  document.body.insertAdjacentHTML('beforeend','<div class="reader" id="reader" role="dialog" aria-modal="true" aria-labelledby="reader-h" hidden><div class="reader-sheet" tabindex="-1"><button class="reader-x" id="readerClose" aria-label="Close article">×</button><div id="readerBody"></div></div></div>');
  var reader=$('#reader'),readerBody=$('#readerBody'),lastFocus=null;
  function openArticle(id,push){
    var a=ARTICLES[id],c=ART_CARDS[id];if(!a||!c)return false;
    lastFocus=lastFocus||document.activeElement;
    var rel=(a.related||[]).filter(function(r){return ARTICLES[r]&&ART_CARDS[r]}).map(function(r){var rc=ART_CARDS[r];
      return '<a class="rel" href="#article='+r+'" data-article="'+r+'"><span class="rel-art" style="background:'+rc.art+'"></span><span><small>'+esc(rc.label)+' · '+esc(rc.dur)+'</small><b>'+esc(rc.title)+'</b></span></a>'}).join('');
    readerBody.innerHTML='<div class="reader-hero" style="background:'+c.art+'"><div><span class="kicker">'+esc(c.label)+(c.lock?' · Members':' · Free')+'</span><h2 id="reader-h">'+esc(c.title)+'</h2></div></div>'+
      '<div class="reader-in"><p class="dek">'+esc(a.dek)+'</p><div class="byline"><span class="av staff" aria-hidden="true">'+a.by.charAt(0)+'</span><div><b>'+esc(a.by)+'</b><small>'+a.date+' · '+esc(c.dur)+'</small></div></div>'+
      a.body.map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+
      '<p class="demo-note">Fictional story written for a class-project concept. People, quotes and events are made up unless noted.</p>'+
      (rel?'<h3 class="rel-h">Related on Mustangs+</h3><div class="rels">'+rel+'</div>':'')+'</div>';
    reader.hidden=false;document.documentElement.classList.add('noscroll');$('.reader-sheet').scrollTop=0;$('.reader-sheet').focus();
    if(push!==false&&location.hash!=='#article='+id)history.pushState(null,'','#article='+id);
    document.title=c.title+' | Mustangs+';return true;
  }
  var baseTitle=document.title;
  function closeArticle(fromHash){if(reader.hidden)return;reader.hidden=true;document.documentElement.classList.remove('noscroll');document.title=baseTitle;
    if(!fromHash&&/^#article=/.test(location.hash))history.pushState(null,'',location.pathname+location.search);
    if(lastFocus&&lastFocus.focus)lastFocus.focus();lastFocus=null}
  document.addEventListener('click',function(e){var el=e.target.closest('[data-article]');if(!el)return;e.preventDefault();openArticle(el.dataset.article)});
  $('#readerClose').addEventListener('click',function(){closeArticle()});
  reader.addEventListener('click',function(e){if(e.target===reader)closeArticle()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeArticle()});
  function articleFromHash(){var m=location.hash.match(/^#article=([\w-]+)$/);if(m)openArticle(m[1],false);else closeArticle(true)}
  window.addEventListener('popstate',articleFromHash);
  /* ---------- Real-athlete profiles (On3-style) ---------- */
  function athleteUrl(id){return ROOT+'athletes/?id='+id}
  function profileCard(a){
    return '<a class="pcard" href="'+athleteUrl(a.id)+'"><span class="pc-pic" style="background:'+KIT_BG[a.kit]+'">'+kit(a.num,a.kit)+'<span class="pc-real">Real stats</span></span>'+
      '<span class="pc-b"><small>#'+a.num+' · '+a.pos+' · '+a.cls+'</small><b>'+esc(a.name)+'</b><span>'+esc(a.hometown)+'</span><em>View profile →</em></span></a>'}
  function athlete(){
    var main=$('#athleteMain'),id=new URLSearchParams(location.search).get('id'),a=MP.athleteBy&&MP.athleteBy(id);
    if(!a){main.innerHTML='<section class="sec"><div class="wrap"><p class="kicker">Athlete profiles</p><h2>Pick a Mustang.</h2><p class="lede">Profiles use public stats; sources are listed on each page.</p><div class="pgrid">'+MP.ATHLETES.map(profileCard).join('')+'</div></div></section>';return}
    var s=sportBy(a.sport);document.title=a.name+' | Mustangs+ Profile';
    function table(t,cls){return '<div class="tbl-wrap"><table class="tbl '+(cls||'')+'"><thead><tr>'+t.cols.map(function(c){return '<th>'+c+'</th>'}).join('')+'</tr></thead><tbody>'+
      t.rows.map(function(r){return '<tr>'+r.map(function(v){return '<td>'+esc(v)+'</td>'}).join('')+'</tr>'}).join('')+
      (t.total?'<tr class="tot">'+t.total.map(function(v){return '<td>'+esc(v)+'</td>'}).join('')+'</tr>':'')+'</tbody></table></div>'}
    var others=MP.ATHLETES.filter(function(x){return x.id!==a.id});
    main.innerHTML=
      '<section class="ap-hero" aria-labelledby="ap-h"><div class="wrap ap-in">'+
        '<p class="crumbs"><a href="'+ROOT+'#athletes">Athletes</a> › <a href="'+sportUrl(a.sport)+'">'+s.name+'</a> › <span>'+esc(a.name)+'</span></p>'+
        '<div class="ap-top"><div class="ap-photo" style="background:'+KIT_BG[a.kit]+'" role="img" aria-label="Photo placeholder: jersey number '+a.num+'">'+kit(a.num,a.kit)+'<span>Photo placeholder</span></div>'+
        '<div class="ap-id"><span class="ap-num">#'+a.num+'</span><h1 id="ap-h"><span>'+esc(a.first)+'</span> '+esc(a.last)+'</h1>'+
        '<p class="ap-sub"><b>'+a.pos+'</b> · SMU Mustangs · '+s.name+'</p>'+
        '<div class="ap-metrics">'+
          '<div><small>HT / WT</small><b>'+a.ht+' / '+a.wt+'</b></div><div><small>Class</small><b>'+a.cls+'</b></div>'+
          '<div><small>Hometown</small><b>'+esc(a.hometown)+'</b></div><div><small>High school / prev.</small><b>'+esc(a.prev)+'</b></div>'+
          '<div class="mock"><small>NIL value <i>illustrative</i></small><b>Not public</b></div>'+
          '<div class="mock"><small>Mustangs+ backers <i>illustrative</i></small><b>'+(900+a.name.length*97).toLocaleString()+'</b></div>'+
        '</div></div></div>'+
      '</div></section>'+
      '<div class="wrap ap-body">'+
        '<div class="ap-grid"><div>'+
          '<section class="panel"><h3>About</h3><p>'+esc(a.blurb)+'</p>'+(a.honors.length?'<ul class="honors">'+a.honors.map(function(h){return '<li>'+esc(h)+'</li>'}).join('')+'</ul>':'')+'</section>'+
          '<section class="panel"><div class="panel-h"><h3>'+a.season.label+'</h3></div><div class="statline">'+a.season.stats.map(function(x){return '<div><b>'+esc(x[1])+'</b><small>'+x[0]+'</small></div>'}).join('')+'</div></section>'+
          '<section class="panel"><h3>Career stats</h3>'+table(a.career)+'<p class="demo-note">* 2026 season in progress, through Oct. 24.</p></section>'+
          '<section class="panel"><h3>'+a.log.label+'</h3>'+table(a.log,'log')+'</section>'+
        '</div><aside>'+
          '<section class="panel"><h3>Recruiting ratings</h3>'+(a.ratings?'<ul class="ratings">'+a.ratings.map(function(r){return '<li><span>'+r[0]+'</span><b>'+r[1]+'</b></li>'}).join('')+'</ul><p class="demo-note">Star ratings as listed on the SMU Athletics bio.</p>':'<p class="muted">No ratings listed in the public sources we used.</p>')+'</section>'+
          '<section class="panel"><h3>Film room</h3><div class="film">'+['Season highlights','Best plays: 2026','Mic\'d up at practice'].map(function(f,i){return '<button class="film-i" data-demo="'+esc(a.name)+': '+f+'"><span class="film-art" style="background:'+(i%2?KIT_BG.away:KIT_BG.home)+'"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span><span><b>'+f+'</b><small>Members · demo video</small></span></button>'}).join('')+'</div></section>'+
          '<section class="panel"><h3>News &amp; notes</h3><ul class="news">'+a.news.map(function(n){return '<li>'+esc(n)+'</li>'}).join('')+'</ul></section>'+
          '<section class="panel"><h3>More profiles</h3><div class="mini">'+others.map(function(o){return '<a href="'+athleteUrl(o.id)+'"><b>#'+o.num+'</b> '+esc(o.name)+'<small>'+o.pos+'</small></a>'}).join('')+'</div></section>'+
        '</aside></div>'+
        '<section class="sources"><h3>Sources &amp; credits</h3><p>Bio, measurements and stats come from public pages, checked Oct. 25, 2026: '+a.src.map(function(x){return '<a href="'+x[1]+'" target="_blank" rel="noopener">'+esc(x[0])+'</a>'}).join(' · ')+'. ESPN lists defensive stats as unofficial.</p>'+
          '<p>NIL value, backer counts and film items are <b>illustrative mock content</b> for this class concept. They are not real figures, and no photos of the athlete are used.</p></section>'+
      '</div>';
  }

  /* ---------- Home ---------- */
  function home(){
    var content=HOME_CONTENT;
    var grid=$('#grid');grid.innerHTML=content.map(cardHTML).join('');
    function setFilter(f){
      $$('.chip').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.filter===f)});
      $$('.card',grid).forEach(function(c){c.hidden=!(f==='all'||c.dataset.type===f)});
    }
    $$('.chip').forEach(function(b){b.addEventListener('click',function(){setFilter(b.dataset.filter)})});
    $$('[data-filter-link]').forEach(function(a){a.addEventListener('click',function(){setFilter(a.dataset.filterLink)})});

    // Sports grid
    $('#sportGrid').innerHTML=MP.SPORTS.map(function(s){
      return '<a class="sport-tile" href="'+sportUrl(s.slug)+'">'+sportIcon(s.slug)+'<b>'+s.name+'</b><span>'+s.season+' · '+s.record+'</span></a>'}).join('');

    // Board preview
    var hot=MP.THREADS.filter(function(t){return t.hot||t.pin}).slice(0,5);
    $('#boardHot').innerHTML=hot.map(threadRow).join('');
    $('#boardForums').innerHTML=MP.FORUMS.map(function(f){
      return '<a class="forum'+(f.prem?' prem':'')+'" style="text-decoration:none" href="'+ROOT+'boards/?f='+f.id+'"><span class="fi">'+(f.prem?LOCK:CHAT)+'</span><div><h3>'+f.name+(f.prem?' <span class="pill red">Members</span>':' <span class="pill">Free</span>')+'</h3><p>'+f.desc+'</p><small>'+f.threads.toLocaleString()+' threads · '+f.posts.toLocaleString()+' posts</small></div></a>'}).join('');

    // Featured athletes (fictional)
    var athletes=[
      {n:'Jalen Whitaker',v:'home',num:'7',sport:'Football',slug:'football',pos:'Wide Receiver · Jr.',bio:"Track-speed slot receiver and film-room junkie who hosts the team's Game Week vlog.",fans:'2,140',g:'linear-gradient(170deg,#CC0035,#262626)'},
      {n:'Maya Okonkwo',v:'alt',num:'23',sport:'Basketball',slug:'womens-basketball',pos:'Guard · So.',bio:'Floor general with a 40% three-point clip. Mentors kids at a Dallas youth league.',fans:'1,860',g:'linear-gradient(170deg,#354CA1,#354CA1)'},
      {n:'Diego Castellanos',v:'away',num:'10',sport:'Soccer',slug:'mens-soccer',pos:'Forward · Sr.',bio:'Team captain and Cox finance major. Co-hosts the Pony Up podcast.',fans:'1,205',g:'linear-gradient(170deg,#59C3C3,#354CA1)'},
      {n:'Ava Lindqvist',v:'home',single:1,num:'4',sport:'Swim & Dive',slug:'swimming-diving',pos:'Freestyle · Jr.',bio:'Conference finalist in the 200 free. Documents early-morning practices on Mustangs+.',fans:'980',g:'linear-gradient(170deg,#CC0035,#354CA1)'}
    ];
    $('#athRow').innerHTML=(MP.ATHLETES||[]).map(function(a){return '<article class="ath real"><a class="pic" href="'+athleteUrl(a.id)+'" style="background:'+KIT_BG[a.kit]+'" aria-label="'+esc(a.name)+' profile"><span class="sport">Football</span><span class="pc-real">Real stats</span>'+kit(a.num,a.kit)+'</a>'+
        '<div class="b"><h3><a href="'+athleteUrl(a.id)+'">'+esc(a.name)+'</a></h3><div class="pos">#'+a.num+' · '+a.pos+' · '+a.cls+'</div><p>'+esc(a.blurb)+'</p>'+
        '<div class="sup"><span>'+esc(a.hometown)+'</span><a href="'+athleteUrl(a.id)+'" style="color:var(--red);font-weight:800;text-decoration:none">Profile →</a></div></div></article>'}).join('')+athletes.map(function(a){
      return '<article class="ath"><div class="pic" style="background:'+KIT_BG[a.v]+'"><span class="sport">'+a.sport+'</span>'+kit(a.num,a.v,a.single)+'</div>'+
        '<div class="b"><h3>'+a.n+'</h3><div class="pos">'+a.pos+'</div><p>'+a.bio+'</p>'+
        '<div class="sup"><span><b>'+a.fans+'</b> members supporting</span><a href="'+sportUrl(a.slug)+'" style="color:var(--red);font-weight:800;text-decoration:none">Team →</a></div></div></article>'}).join('');

    // Money split toggle
    var nilAmt=$('#nilAmt');function fmt(n){return '$'+n.toFixed(2)}
    $$('.tier-toggle button').forEach(function(b){b.addEventListener('click',function(){
      $$('.tier-toggle button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
      var p=parseFloat(b.dataset.price);nilAmt.textContent=fmt(p*0.40);
      $$('.legend .amt').forEach(function(el){el.textContent=fmt(p*parseFloat(el.dataset.share))});
    })});
    countUp($('#fundNum'),$('#fundBar'),1284550,2500000);
  }

  function countUp(numEl,barEl,target,goal){
    var done=false;
    function run(){if(done)return;done=true;barEl.style.width=(target/goal*100)+'%';var t0=performance.now();
      (function step(t){var k=Math.min(1,(t-t0)/1400);k=1-Math.pow(1-k,3);numEl.textContent=money(target*k);if(k<1)requestAnimationFrame(step)})(t0)}
    if('IntersectionObserver' in window)new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){run();o.disconnect()}})},{threshold:.3}).observe(barEl);else run();
  }

  /* ---------- Message boards ---------- */
  function boards(){
    var params=new URLSearchParams(location.search),state={f:params.get('f')||'all',sport:params.get('sport')||'',sort:'hot'};
    var member=store('mp_member')==='1';
    var listView=$('#listView'),threadView=$('#threadView');

    $('#forums').innerHTML='<button class="forum" data-f="all"><span class="fi">'+CHAT+'</span><div><h3>All Boards</h3><p>Everything happening across the Mustang Board.</p><small>'+MP.THREADS.length+' active threads in this demo</small></div></button>'+
      MP.FORUMS.map(function(f){return '<button class="forum'+(f.prem?' prem':'')+'" data-f="'+f.id+'"><span class="fi">'+(f.prem?LOCK:CHAT)+'</span><div><h3>'+f.name+(f.prem?' <span class="pill red">Members</span>':' <span class="pill">Free</span>')+'</h3><p>'+f.desc+'</p><small>'+f.threads.toLocaleString()+' threads · '+f.posts.toLocaleString()+' posts</small></div></button>'}).join('');
    var sel=$('#sportFilter');
    sel.innerHTML='<option value="">All sports</option>'+MP.SPORTS.map(function(s){return '<option value="'+s.slug+'">'+s.name+'</option>'}).join('');
    sel.value=state.sport;
    sel.addEventListener('change',function(){state.sport=sel.value;renderList()});
    $$('#forums .forum').forEach(function(b){b.addEventListener('click',function(){state.f=b.dataset.f;renderList();$('#threadList').scrollIntoView({behavior:'smooth',block:'start'})})});
    $$('.sort button').forEach(function(b){b.addEventListener('click',function(){state.sort=b.dataset.sort;renderList()})});

    function renderList(){
      $$('#forums .forum').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.f===state.f)});
      $$('.sort button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.sort===state.sort)});
      var list=MP.THREADS.filter(function(t){return (state.f==='all'||t.f===state.f)&&(!state.sport||t.sport===state.sport)});
      if(state.sort==='hot')list.sort(function(a,b){return (b.pin?1:0)-(a.pin?1:0)||b.replies-a.replies});
      var f=forumBy(state.f),s=sportBy(state.sport);
      $('#listTitle').textContent=(f?f.name:'All Boards')+(s?' · '+s.name:'');
      $('#threadRows').innerHTML=list.length?list.map(threadRow).join(''):'<div class="empty">No threads here yet. <button class="btn btn-red btn-sm" data-demo="Start a thread">Start one</button></div>';
    }

    function renderThread(id){
      var t=null;MP.THREADS.forEach(function(x){if(x.id===id)t=x});
      if(!t){location.hash='';return}
      var f=forumBy(t.f),s=t.sport&&sportBy(t.sport),locked=f.prem&&!member;
      var postHTML=t.posts.map(function(p,i){var u=MP.USERS[p[0]];
        return '<article class="post'+(i===0?' op':'')+'"><div class="post-h">'+avatar(p[0],true)+'<div class="who"><b>'+esc(u.n)+(u.staff?' <span class="pill red">Insider</span>':'')+'</b><small>'+esc(u.tier)+' · Member since '+u.since+' · '+u.posts+' posts</small></div><span class="when">'+(i===0?t.ago+' ago':'#'+(i+1))+'</span></div>'+
          '<p>'+esc(p[1])+'</p><div class="post-f"><button data-demo="Like this post">♥ '+(7+((t.id*13+i*29)%90))+'</button><button data-demo="Quote and reply">Quote</button><button data-demo="Reply">Reply</button></div></article>'});
      var shown=locked?postHTML.slice(0,1).join('')+'<div class="gate">'+postHTML.slice(1).join('')+(postHTML.length<3?'<article class="post"><p>Members are discussing this thread. Lorem ipsum preview text hidden.</p></article><article class="post"><p>More member replies hidden.</p></article>':'')+
        '<div class="gate-cta"><div><span class="pill red">'+LOCK+'Members only</span><h4>Join to read the full thread</h4><p>'+t.replies.toLocaleString()+' replies in '+esc(f.name)+'. Every membership funds SMU athlete NIL.</p><a class="btn btn-red" style="width:100%;padding:12px" href="'+ROOT+'#membership">See Plans</a><button class="btn btn-outline" style="width:100%;padding:10px;margin-top:8px" id="asMember">Preview as a member (demo)</button></div></div></div>':postHTML.join('');
      threadView.innerHTML='<p class="crumbs"><a href="#">Boards</a> › <a href="?f='+f.id+'">'+esc(f.name)+'</a>'+(s?' › <a href="'+sportUrl(s.slug)+'">'+esc(s.name)+'</a>':'')+'</p>'+
        '<div class="t-pills" style="display:flex;gap:6px;flex-wrap:wrap">'+(t.pin?'<span class="pill pin">'+PIN+'Pinned</span>':'')+(t.hot?'<span class="pill hot">'+FLAME+'Hot</span>':'')+(f.prem?'<span class="pill red">'+LOCK+'Members</span>':'<span class="pill">Free board</span>')+'</div>'+
        '<h1 class="tv-title">'+esc(t.title)+'</h1><div class="board-stats"><span>'+t.replies.toLocaleString()+' replies</span><span>'+t.views+' views</span><span class="online">'+(12+t.id*7%60)+' reading now</span></div>'+
        '<div class="posts">'+shown+'</div>'+
        (locked?'':'<div class="reply">'+avatar('mike')+'<input type="text" placeholder="Write a reply…" aria-label="Write a reply" readonly data-demo="Post a reply"><button class="btn btn-red btn-sm" data-demo="Post a reply">Post</button></div>')+
        (member&&f.prem?'<p class="demo-note">Viewing as a member (demo). <button class="see-all" style="border:0;background:none;padding:0" id="asGuest">Switch back to guest view</button></p>':'')+
        '<p class="demo-note">All usernames and posts are fictional sample content.</p>';
      var am=$('#asMember');if(am)am.addEventListener('click',function(){member=true;store('mp_member','1');renderThread(id)});
      var ag=$('#asGuest');if(ag)ag.addEventListener('click',function(){member=false;store('mp_member','0');renderThread(id)});
    }

    function route(){
      var m=location.hash.match(/^#t(\d+)$/);
      if(m){listView.hidden=true;threadView.hidden=false;renderThread(+m[1]);window.scrollTo(0,0)}
      else{threadView.hidden=true;listView.hidden=false;renderList()}
    }
    window.addEventListener('hashchange',route);route();
  }

  /* ---------- Sport program page ---------- */
  function sport(){
    var s=sportBy(body.dataset.sport);if(!s)return;
    var r=rng(s.slug),main=$('#sportMain');
    document.title=s.name+' | Mustangs+';

    // Roster: made-up names, deterministic per sport
    var size=Math.max(8,Math.min(12,s.pos.length+3)),used={},nums={},roster=[];
    for(var i=0;i<size;i++){
      var g=s.g==='X'?(i%2?'W':'M'):s.g,name,tries=0;
      do{name=pick(r,MP.NAMES[g])+' '+pick(r,MP.NAMES.L);tries++}while(used[name]&&tries<50);used[name]=1;
      var num='';if(s.num){do{num=s.num[0]+Math.floor(r()*(s.num[1]-s.num[0]+1))}while(nums[num]);nums[num]=1}
      var h=s.ht?s.ht[0]+Math.floor(r()*(s.ht[1]-s.ht[0]+1)):0;
      roster.push({v:['home','away','alt'][i%3],kn:num!==''?num:(i+1),name:name,g:g,num:num,pos:s.pos[i%s.pos.length],cls:pick(r,MP.CLASSES),town:pick(r,MP.TOWNS),ht:h?Math.floor(h/12)+"'"+(h%12)+'"':'',fans:120+Math.floor(r()*2200)});
    }
    roster.sort(function(a,b){return b.fans-a.fans});
    var star=roster[0];

    // Schedule: fictional opponents
    var teamSport=/football|basketball|soccer|volleyball/.test(s.slug),opp=MP.OPP.slice(),games=[];
    for(var k=opp.length-1;k>0;k--){var j=Math.floor(r()*(k+1)),tmp=opp[k];opp[k]=opp[j];opp[j]=tmp}
    var base=new Date(2026,9,24),mo=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    for(var n=0;n<8;n++){
      var past=n<5,d=new Date(base.getTime()+(n-4)*7*864e5+(past?0:7*864e5)),home=r()>.45,res='',cls='up';
      if(past){
        if(teamSport){
          var win=r()<.72,a,b2;
          if(/football/.test(s.slug)){a=17+Math.floor(r()*28);b2=Math.max(0,a-3-Math.floor(r()*20))}
          else if(/basketball/.test(s.slug)){a=64+Math.floor(r()*24);b2=a-2-Math.floor(r()*16)}
          else if(/soccer/.test(s.slug)){a=1+Math.floor(r()*3);b2=Math.floor(r()*a)}
          else{a=3;b2=Math.floor(r()*3)}
          var tie=/soccer/.test(s.slug)&&r()<.15;
          if(tie){res='T '+b2+'-'+b2;cls='t'}else{res=(win?'W '+a+'-'+b2:'L '+b2+'-'+a);cls=win?'w':'l'}
        }else{var place=1+Math.floor(r()*5);res=place+(place===1?'st':place===2?'nd':place===3?'rd':'th');cls=place<=2?'w':'t'}
      }else{res=(home?'7:00 PM':'TBA');}
      games.push({d:d,o:teamSport?opp[n]:opp[n]+' Invitational',home:home,res:res,cls:cls,past:past});
    }

    var content=[
      {t:'video',label:'Video Series',title:'Hilltop Unfiltered: '+s.name,desc:'All-access cameras inside practice, the locker room and road trips.',dur:(14+Math.floor(r()*14))+':'+(10+Math.floor(r()*49)),lock:true,art:'linear-gradient(135deg,#CC0035 0%,#262626 55%,#354CA1 100%)'},
      {t:'article',id:'feature-'+s.slug,label:'Player Feature',title:'Inside the grind with '+star.name,desc:'A day in the life of a Mustang (fictional athlete).',dur:(5+Math.floor(r()*6))+' min read',lock:true,art:'linear-gradient(160deg,#354CA1 0%,#354CA1 60%,#59C3C3 100%)'},
      {t:'podcast',label:'Podcast',title:s.coach+' on the season ahead',desc:'Expectations, culture and how NIL is changing the program.',dur:(25+Math.floor(r()*25))+' min',lock:false,art:'radial-gradient(circle at 30% 30%,#FF1053 0%,#CC0035 35%,#354CA1 100%)'}
    ];
    ART_CARDS['feature-'+s.slug]=content[1];
    ARTICLES['feature-'+s.slug]={by:STAFF.lena,date:'Oct. 20, 2026',dek:'A day in the life of a fictional Mustang, from the first alarm to the last film clip.',body:[
      star.name+' (a fictional athlete created for this concept) is up before 6 a.m. most days. Breakfast at the training table, then treatment, then class. '+s.name+' practice does not start until the afternoon, but the day is already full.',
      'Between classes there is film. "I watch every rep twice," '+star.name.split(' ')[0]+' says. "Once for me, once for the person next to me. If we are both right, the play works."',
      'Afternoons belong to '+s.coach+' (also fictional) and the rest of the staff. The '+s.season.toLowerCase()+' schedule means practice, lifting and meetings run until dinner, and road trips take whole weekends.',
      'Fan-funded NIL is part of the routine too. Through Mustangs+, members pay athletes like '+star.name.split(' ')[0]+' for clinics, behind-the-scenes content and Q&As. "It makes you feel like the city is behind you," '+star.name.split(' ')[0]+' says.',
      'Lights out is around 11. Then the alarm goes off and it starts again.'],related:['walk-on','building-roster','visit-weekend']};
    var threads=MP.THREADS.filter(function(t){return t.sport===s.slug});
    var others=MP.SPORTS.filter(function(x){return x.slug!==s.slug});

    main.innerHTML=
      '<section class="sp-hero" aria-labelledby="sp-h"><div class="wrap sp-in">'+
        '<p class="crumbs"><a href="'+ROOT+'#sports">Sports</a> › <span>'+s.name+'</span></p>'+
        '<div class="sp-top"><span class="sp-ic">'+sportIcon(s.slug)+'</span><div><span class="eyebrow" style="padding:4px 9px"><span class="dot"></span>'+s.season+' sport</span></div></div>'+
        '<h1 id="sp-h">'+s.name+'</h1>'+
        '<p class="sub" style="margin-top:10px">'+s.blurb+' <strong style="color:#fff">40% of every membership funds Mustang NIL.</strong></p>'+
        '<div class="sp-stats"><div><b>'+s.record+'</b><span>'+s.conf+'</span></div><div><b>'+s.members.toLocaleString()+'</b><span>members backing</span></div><div><b>'+roster.length+'</b><span>athletes featured</span></div></div>'+
        '<div class="sp-fund"><div class="row"><span>Program NIL fund (2026–27)</span><b id="spFund">$0</b></div><div class="bar"><i id="spBar"></i></div><div class="row"><small>Sample data</small><small>Goal '+money(s.fund*1.8)+'</small></div></div>'+
        '<div class="hero-ctas"><a href="'+ROOT+'#membership" class="btn btn-red btn-lg">Back '+s.name+'</a><a href="#board" class="btn btn-ghost btn-lg">Team Board</a></div>'+
      '</div></section>'+
      '<div class="wrap"><nav class="jump" aria-label="On this page"><a href="#roster">Roster</a><a href="#schedule">Schedule</a><a href="#content">Watch &amp; Listen</a><a href="#board">Board</a><a href="#more">Other Sports</a></nav></div>'+
      '<section class="sec" id="roster" aria-labelledby="r-h" style="padding-top:28px"><div class="wrap">'+
        '<div class="sec-hd"><div><p class="kicker">Roster spotlight</p><h2 id="r-h">Meet the team.</h2><p class="lede">'+(s.slug==='football'&&MP.ATHLETES?'The player profiles use real public stats with sources. The roster cards below are made-up placeholders for this concept.':'Every athlete below is a made-up placeholder for this concept, not a real SMU student-athlete.')+'</p></div></div>'+
        '<div class="roster">'+roster.map(function(a,i){
          return '<button class="rcard" data-demo="'+esc(a.name)+'\'s athlete profile"><span class="rnum" style="background:'+KIT_BG[a.v]+'">'+kit(a.kn,a.v,!JERSEY_SPORTS.test(s.slug))+'</span><div><h4>'+esc(a.name)+'</h4><div class="rp">'+esc(a.pos)+(s.g==='X'?' · '+(a.g==='M'?"Men's":"Women's"):'')+'</div>'+
            '<div class="rm">'+a.cls+(a.ht?' · '+a.ht:'')+' · '+esc(a.town)+'</div><div class="rs"><b>'+a.fans.toLocaleString()+'</b> members supporting · <span style="color:var(--red);font-weight:800">NIL ✓</span></div></div></button>'}).join('')+'</div>'+
        (s.slug==='football'&&MP.ATHLETES?'<div class="profiles-strip"><div class="ps-h"><p class="kicker">Player profiles · real public stats</p><a class="see-all" href="'+ROOT+'athletes/">All profiles →</a></div><div class="pgrid">'+MP.ATHLETES.filter(function(a){return a.sport===s.slug}).map(profileCard).join('')+'</div></div>':'')+
        '<div class="coach">'+'<span class="av lg staff">'+s.coach.split(' ')[1].charAt(0)+'</span><div><b style="color:var(--navy)">'+s.coach+'</b><div style="font-size:13px;color:var(--muted)">Head Coach (fictional) · Monthly live Q&amp;A for Pony Express members</div></div></div>'+
      '</div></section>'+
      '<section class="sec soft" id="schedule" aria-labelledby="s-h"><div class="wrap">'+
        '<div class="sec-hd"><div><p class="kicker">Schedule &amp; results</p><h2 id="s-h">'+(teamSport?'Game':'Meet')+' by '+(teamSport?'game':'meet')+'.</h2></div></div>'+
        '<div class="sched">'+games.map(function(g){
          return '<div class="game"><div class="d">'+mo[g.d.getMonth()]+'<b>'+g.d.getDate()+'</b></div><div class="o">'+(teamSport?(g.home?'vs. ':'at '):'')+esc(g.o)+'<small>'+(g.home?'Home · Dallas, TX':'Away')+(g.past?'':' · Mustangs+ live Q&amp;A after')+'</small></div><span class="res '+g.cls+'">'+g.res+'</span></div>'}).join('')+'</div>'+
        '<p class="demo-note">Sample schedule with fictional opponents.</p>'+
      '</div></section>'+
      '<section class="sec" id="content" aria-labelledby="c-h"><div class="wrap">'+
        '<div class="sec-hd"><div><p class="kicker">Only on Mustangs+</p><h2 id="c-h">'+s.name+' all access.</h2></div></div>'+
        '<div class="grid">'+content.map(cardHTML).join('')+'</div>'+
      '</div></section>'+
      '<section class="sec soft" id="board" aria-labelledby="b-h"><div class="wrap">'+
        '<div class="sec-hd"><div><p class="kicker">Team board</p><h2 id="b-h">Talk '+s.name+'.</h2></div><a class="see-all" href="'+ROOT+'boards/?sport='+s.slug+'">Open board →</a></div>'+
        '<div class="threads"><div class="th-head"><h3>Latest threads</h3><button class="btn btn-red btn-sm" data-demo="Start a '+esc(s.name)+' thread">New thread</button></div>'+
        (threads.length?threads.map(threadRow).join(''):'<div class="empty">No threads yet. Be the first to start the conversation.</div>')+'</div>'+
      '</div></section>'+
      '<section class="sec" id="more" aria-labelledby="m-h"><div class="wrap">'+
        '<div class="sec-hd"><div><p class="kicker">Every program</p><h2 id="m-h">More Mustang sports.</h2></div></div>'+
        '<div class="other">'+others.map(function(o){return '<a href="'+sportUrl(o.slug)+'">'+o.name+'</a>'}).join('')+'</div>'+
        '<div class="band" style="margin-top:32px"><div><h2>Back '+s.name+'.</h2><p>Plans from $9.99/mo. 40% goes to Mustang NIL.</p></div><a href="'+ROOT+'#membership" class="btn btn-lg">See Plans</a></div>'+
      '</div></section>';

    countUp($('#spFund'),$('#spBar'),s.fund,s.fund*1.8);
    heroEl=$('.sp-hero');
    if(heroEl&&'IntersectionObserver' in window)new IntersectionObserver(function(es){pastHero=!es[0].isIntersecting;upd()},{rootMargin:'-120px 0px 0px 0px'}).observe(heroEl);
  }

  if(PAGE==='home')home();else if(PAGE==='boards')boards();else if(PAGE==='sport')sport();else if(PAGE==='athlete')athlete();
  articleFromHash();
})();
