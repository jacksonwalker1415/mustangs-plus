/* SMU+ student engagement: points, game-day check-in, leaderboards, rewards, student accounts.
   Uses the Supabase RPCs in supabase/engagement.sql when the site is live AND that migration is applied.
   Otherwise runs as a labeled demo in this browser (localStorage), the same way assets/sb.js falls back.
   The browser never sends a points amount: in live mode the server derives every amount from the rules.
   Keep RULES in sync with engagement.sql. */
(function(){
  'use strict';
  var MP=window.MP||{},SMU=window.SMU||null;
  var SEASON=2026,TZ='America/Chicago',LABEL='Demo, no cash value, not a real ticket';
  var RULES={checkin:100,early:50,earlyMins:45,streakEach:25,streakMax:100,welcome:100,
    milestones:[[3,150,'3 home games'],[5,250,'5 home games']],allHome:500,
    opensMins:120,closesMins:90,windowSecs:30};
  var TIERS=[{key:'hilltop',name:'Hilltop',floor:0},{key:'dallashall',name:'Dallas Hall',floor:400},
    {key:'ford',name:'Ford Stadium',floor:1000},{key:'peruna',name:'Peruna',floor:1800}];
  var REWARDS=[ /* mirrors the seed in engagement.sql */
    {id:'drink-popcorn',category:'concessions',name:'Fountain drink + popcorn',description:'One of each at any Ford Stadium concession stand.',cost:250,stock:null,per_user_limit:null},
    {id:'combo',category:'concessions',name:'Hot dog combo',description:'Hot dog, chips and a drink.',cost:400,stock:null,per_user_limit:null},
    {id:'rally-towel',category:'merch',name:'Red-and-blue rally towel',description:'Pick up at the student gate merch table.',cost:300,stock:400,per_user_limit:2},
    {id:'student-tee',category:'merch',name:'Student section tee',description:'This season\u2019s student section shirt, while sizes last.',cost:600,stock:250,per_user_limit:1},
    {id:'beanie',category:'merch',name:'Knit beanie',description:'SMU Blue cuffed beanie for the November games.',cost:800,stock:120,per_user_limit:1},
    {id:'early-entry',category:'seating',name:'Early gate entry',description:'Skip the student line and walk in when the gates open.',cost:700,stock:150,per_user_limit:null},
    {id:'front-row',category:'seating',name:'Front-row student section',description:'A held spot on the rail for one home game.',cost:1200,stock:40,per_user_limit:1},
    {id:'tunnel-line',category:'access',name:'Team runout tunnel line',description:'Line the tunnel as the team takes the field. One game.',cost:1500,stock:20,per_user_limit:1},
    {id:'sideline-pass',category:'access',name:'Pregame sideline pass',description:'Watch warmups from the sideline, then head to your seat.',cost:2000,stock:10,per_user_limit:1}];
  var CATS={concessions:'Concessions',merch:'Gear',seating:'Seating',access:'Field access'};

  function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
  function lj(k,d){try{return JSON.parse(ls(k)||'null')||d}catch(e){return d}}
  function sj(k,v){ls(k,JSON.stringify(v))}
  var subs={};
  function on(ev,cb){(subs[ev]=subs[ev]||[]).push(cb)}
  function emit(ev,d){(subs[ev]||[]).slice().forEach(function(cb){try{cb(d)}catch(e){console.error(e)}})}

  /* ---------- games: the real 2026 home schedule in content.js ---------- */
  var GAMES=((MP.SCHEDULE&&MP.SCHEDULE.games)||[]).filter(function(g){return g.home}).map(function(g){
    return {id:'fb-'+g.d,date:g.d,day:g.day,opp:g.opp,venue:'Gerald J. Ford Stadium',ko:g.ko?new Date(g.ko):null,tv:g.tv,res:g.res,note:g.note||null}});
  function gameById(id){return GAMES.filter(function(g){return g.id===id})[0]||null}
  function windowFor(g){if(!g||!g.ko)return null;return {opens:new Date(+g.ko-RULES.opensMins*6e4),closes:new Date(+g.ko+RULES.closesMins*6e4)}}
  function gameState(g,at){at=at||now();var w=windowFor(g);if(!w)return 'tbd';if(at<w.opens)return 'upcoming';if(at>w.closes)return 'final';return 'open'}
  function nextGame(at){at=at||now();return GAMES.filter(function(g){return gameState(g,at)!=='final'})[0]||null}
  function lastGame(at){at=at||now();var p=GAMES.filter(function(g){return gameState(g,at)==='final'});return p[p.length-1]||null}
  function openGame(at){at=at||now();return GAMES.filter(function(g){return gameState(g,at)==='open'})[0]||null}

  /* ---------- demo clock: lets a class demo pretend it's game day (demo mode only) ---------- */
  function clock(){return E.live?null:lj('eng_clock',null)}
  function now(){var c=clock();return new Date(Date.now()+(c?c.offset:0))}
  function setClock(gameId,minsBefore){var g=gameById(gameId);if(!g||!g.ko)return;
    sj('eng_clock',{game:gameId,offset:(+g.ko-(minsBefore==null?62:minsBefore)*6e4)-Date.now()});emit('clock');emit('change')}
  function clearClock(){ls('eng_clock',null);emit('clock');emit('change')}

  /* ---------- rotating gate code: HMAC-SHA256(secret, gameId:window) -> 6 digits (same math as engage_code in SQL).
     The 30-second window always comes from the REAL clock, so the gate screen and a phone agree even with the demo clock on. */
  function win(t){return Math.floor((t||Date.now())/1000/RULES.windowSecs)}
  var enc=new TextEncoder();
  function hmacHex(key,msg){
    if(window.crypto&&crypto.subtle)return crypto.subtle.importKey('raw',enc.encode(key),{name:'HMAC',hash:'SHA-256'},false,['sign'])
      .then(function(k){return crypto.subtle.sign('HMAC',k,enc.encode(msg))}).then(function(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return ('0'+x.toString(16)).slice(-2)}).join('')});
    var h=0x811c9dc5,s=key+'|'+msg;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0} /* no WebCrypto (plain http on a LAN IP): demo-only stand-in */
    return Promise.resolve(('00000000'+h.toString(16)).slice(-8))}
  function demoCode(gameId,w){return hmacHex('smu-plus-demo-gate:'+gameId,gameId+':'+w).then(function(hex){return ('000000'+(parseInt(hex.slice(0,8),16)%1000000)).slice(-6)})}

  function tierFor(earned){earned=+earned||0;var t=TIERS[0];TIERS.forEach(function(x){if(earned>=x.floor)t=x});var n=TIERS[TIERS.indexOf(t)+1]||null;
    return {key:t.key,name:t.name,floor:t.floor,next:n?n.floor:null,next_name:n?n.name:null,progress:n?Math.min(1,(earned-t.floor)/(n.floor-t.floor)):1,toNext:n?n.floor-earned:0}}

  /* ---------- demo backend ---------- */
  function key(){return 'eng_v1:'+((SMU&&SMU.user&&SMU.user.email)||'guest')}
  function blank(){return {student:null,events:[],checkins:{},redemptions:[],fails:{}}}
  function st(){return lj(key(),blank())}
  function save(s){sj(key(),s);emit('change')}
  function award(s,kind,pts,ref,game,note,at){if(s.events.some(function(e){return e.kind===kind&&e.ref===ref}))return 0;
    s.events.push({id:s.events.length+1,kind:kind,points:pts,ref:ref,game_id:game||null,note:note,created_at:(at||now()).toISOString()});return pts}
  function priorStreak(s,g){var n=0,prior=GAMES.filter(function(x){return x.ko&&x.ko<g.ko}).reverse();
    for(var i=0;i<prior.length;i++){if(!s.checkins[prior[i].id])break;n++}return n}
  function scoreCheckin(s,g,at){
    var mins=Math.floor((g.ko-at)/6e4),streak=priorStreak(s,g),lines=[],pts=0,got;
    s.checkins[g.id]={at:at.toISOString(),mins:mins,points:0};
    got=award(s,'checkin',RULES.checkin,g.id,g.id,'Checked in vs '+g.opp,at);pts+=got;lines.push({kind:'checkin',label:'Game-day check-in',points:got});
    if(mins>=RULES.earlyMins){got=award(s,'early',RULES.early,g.id,g.id,'In the gates 45+ minutes early',at);pts+=got;lines.push({kind:'early',label:'Early arrival',points:got})}
    if(streak>=1){got=award(s,'streak',Math.min(RULES.streakMax,RULES.streakEach*streak),g.id,g.id,(streak+1)+' home games in a row',at);pts+=got;lines.push({kind:'streak',label:(streak+1)+'-game streak',points:got})}
    var n=Object.keys(s.checkins).length,ms=RULES.milestones.filter(function(m){return m[0]===n});
    if(n===GAMES.length)ms.push([n,RULES.allHome,'Every home game']);
    ms.forEach(function(m){got=award(s,'milestone',m[1],'season-'+SEASON+'-'+m[0],g.id,m[2],at);pts+=got;if(got)lines.push({kind:'milestone',label:m[2],points:got})});
    s.checkins[g.id].points=pts;return {points:pts,lines:lines,mins:mins,streak:streak+1}}
  function demoSummary(){var s=st(),bal=0,earned=0;s.events.forEach(function(e){bal+=e.points;if(e.points>0)earned+=e.points});
    var streak=0,past=GAMES.filter(function(g){return gameState(g)==='final'}).reverse();for(var i=0;i<past.length;i++){if(!s.checkins[past[i].id])break;streak++}
    var stu=s.student;
    return {signed_in:!!(SMU&&SMU.user),is_student:!!(stu&&stu.verified),verified:!!(stu&&stu.verified),class_year:stu?stu.class_year:null,
      show_on_leaderboard:stu?stu.show!==false:true,email:stu?stu.email:null,name:(SMU&&SMU.user&&SMU.user.name)||null,
      balance:bal,season_earned:earned,tier:tierFor(earned),streak:streak,checkins:Object.keys(s.checkins).length,
      checked:s.checkins,history:s.events.slice().reverse(),redemptions:s.redemptions.slice().reverse()}}
  function res(o){return Promise.resolve(o)}
  var demo={
    summary:function(){return res(demoSummary())},
    verify:function(o){var em=String(o.email||'').trim().toLowerCase(),cy=+o.class_year||null;
      if(!/^[^@\s]+@smu\.edu$/.test(em))return res({ok:false,reason:'not_smu',message:'Use your @smu.edu email to verify as a student.'});
      if(!cy||cy<2026||cy>2034)return res({ok:false,reason:'class_year',message:'Pick your class year.'});
      var p=(SMU&&!SMU.user)?SMU.signUp({email:em,name:o.name||'',password:'demo-only'}).catch(function(){}):Promise.resolve();
      return p.then(function(){var s=st();s.student={verified:true,email:em,class_year:cy,verified_at:new Date().toISOString(),show:true};
        var bonus=award(s,'welcome',RULES.welcome,'student',null,'Verified SMU student');save(s);var r=demoSummary();r.ok=true;r.bonus=bonus;return r})},
    setVisible:function(v){var s=st();if(s.student){s.student.show=!!v;save(s)}return res()},
    checkIn:function(gameId,code){var s=st(),g=gameById(gameId),at=now(),c=String(code||'').replace(/\D/g,'');
      if(!s.student||!s.student.verified)return res({ok:false,reason:'student',message:'Verify your @smu.edu email to earn student points.'});
      if(!g)return res({ok:false,reason:'game',message:'That game isn\u2019t open for check-in.'});
      if(s.checkins[g.id])return res({ok:false,reason:'already',message:'You\u2019re already checked in for this game.'});
      if(gameState(g,at)!=='open')return res({ok:false,reason:'closed',message:'Check-in opens 2 hours before kickoff and closes 90 minutes after.'});
      var f=s.fails[g.id];if(f&&f.n>=8&&Date.now()-f.t<6e5)return res({ok:false,reason:'locked',message:'Too many wrong codes. Try again in a few minutes or ask gate staff.'});
      var w=win();return Promise.all([demoCode(g.id,w),demoCode(g.id,w-1)]).then(function(ok){
        if(ok.indexOf(c)<0){s.fails[g.id]={n:(f&&Date.now()-f.t<6e5?f.n:0)+1,t:Date.now()};save(s);
          return {ok:false,reason:'code',message:'That code didn\u2019t match. Codes change every 30 seconds, so scan the gate screen again.'}}
        delete s.fails[g.id];var r=scoreCheckin(s,g,at);save(s);
        var out=demoSummary();out.ok=true;out.game_id=g.id;out.opponent=g.opp;out.minutes_before_kickoff=r.mins;out.streak=r.streak;out.points=r.points;out.lines=r.lines;return out})},
    gateCode:function(gameId){var w=win();return demoCode(gameId,w).then(function(c){return {code:c,expires_at:new Date((w+1)*RULES.windowSecs*1000).toISOString()}})},
    rewards:function(){return res(REWARDS)},
    redeem:function(id){var s=st(),r=REWARDS.filter(function(x){return x.id===id})[0],sum=demoSummary();
      if(!s.student||!s.student.verified)return res({ok:false,reason:'student',message:'Rewards are for verified SMU students.'});
      if(!r)return res({ok:false,reason:'reward',message:'That reward isn\u2019t available.'});
      if(sum.balance<r.cost)return res({ok:false,reason:'balance',message:'You need '+(r.cost-sum.balance)+' more points for this.',balance:sum.balance});
      if(r.per_user_limit&&s.redemptions.filter(function(x){return x.reward_id===id}).length>=r.per_user_limit)return res({ok:false,reason:'limit',message:'You\u2019ve already claimed this one.'});
      var code='DEMO-'+hex4()+'-'+hex4(),rid=s.redemptions.length+1;
      s.redemptions.push({id:rid,reward_id:id,reward:r.name,cost:r.cost,code:code,status:'issued',created_at:new Date().toISOString()});
      award(s,'redeem',-r.cost,'redemption-'+rid,null,r.name);save(s);
      return res({ok:true,code:code,reward_id:id,reward:r.name,cost:r.cost,balance:sum.balance-r.cost})},
    leaderboard:function(scope,opt){return res(demoBoard(scope,opt||{}))},
    classStandings:function(){return res(demoClasses())},
    sampleSeason:function(){ /* demo only: check in to home games already played, at believable arrival times */
      var s=st();if(!s.student||!s.student.verified)return res(false);
      GAMES.filter(function(g){return gameState(g)==='final'}).forEach(function(g,i){if(s.checkins[g.id]||i===1)return;
        scoreCheckin(s,g,new Date(+g.ko-[78,52,31,64,47,58,70][i%7]*6e4))});
      save(s);return res(true)},
    reset:function(){ls(key(),null);emit('change');return res()}
  };
  function hex4(){var a=new Uint8Array(2);crypto.getRandomValues(a);return Array.prototype.map.call(a,function(x){return ('0'+x.toString(16)).slice(-2)}).join('').toUpperCase()}

  /* ---------- fictional demo standings: made-up students; their points follow the real rules on the real home dates ---------- */
  function rng(seed){var h=2166136261;for(var i=0;i<seed.length;i++){h^=seed.charCodeAt(i);h=Math.imul(h,16777619)}
    return function(){h+=0x6D2B79F5;var t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
  var FIRST=['Maddie','Cole','Avery','Jalen','Priya','Grant','Sofia','Trey','Elena','Marcus','Hannah','Diego','Kendall','Noah','Tessa','Isaiah','Claire','Andre','Lauren','Wyatt','Nia','Brooks','Camila','Reid','Olivia','Mateo','Sydney','Caleb','Ruby','Ethan','Jada','Luke'];
  var LAST='KRMTBHWSCLPDGFNVAEJ',CROWD=null;
  function crowd(){if(CROWD)return CROWD;var r=rng('smu-plus-demo-standings-2026'),played=GAMES.filter(function(g){return g.res});
    CROWD=FIRST.map(function(f,i){var cy=[2027,2028,2029,2030][Math.floor(r()*4)],keen=.35+r()*.6,s=blank();
      played.forEach(function(g){if(r()<keen)scoreCheckin(s,g,new Date(+g.ko-Math.floor(10+r()*100)*6e4))});
      var byGame={},byGameAt={};s.events.forEach(function(e){if(e.game_id)byGame[e.game_id]=(byGame[e.game_id]||0)+e.points});
      Object.keys(s.checkins).forEach(function(k){byGameAt[k]=s.checkins[k].mins});
      return {display_name:f+' '+LAST.charAt(i%LAST.length)+'.',class_year:cy,points:s.events.reduce(function(a,e){return a+e.points},0),
        checkins:Object.keys(s.checkins).length,byGame:byGame,mins:byGameAt}}).filter(function(x){return x.points>0});
    return CROWD}
  function meRow(scope,gameId){var m=demoSummary();if(!m.verified||!m.show_on_leaderboard)return null;var pts=0;
    if(scope==='game')m.history.forEach(function(e){if(e.game_id===gameId&&e.points>0)pts+=e.points});else pts=m.season_earned;
    return pts>0?{display_name:m.name||'You',class_year:m.class_year,points:pts,checkins:m.checkins,is_me:true}:null}
  function demoBoard(scope,opt){var gid=opt.game_id,rows=crowd().map(function(c){return {display_name:c.display_name,class_year:c.class_year,
      points:scope==='game'?(c.byGame[gid]||0):c.points,checkins:c.checkins,is_me:false,fictional:true}}).filter(function(x){return x.points>0});
    var me=meRow(scope,gid);if(me)rows.push(me);
    if(opt.class_year)rows=rows.filter(function(x){return x.class_year===+opt.class_year});
    rows.sort(function(a,b){return b.points-a.points||(a.is_me?-1:b.is_me?1:0)});rows.forEach(function(x,i){x.rank=i+1});return rows.slice(0,opt.limit||50)}
  function demoClasses(){var m={};crowd().concat([meRow('season')].filter(Boolean)).forEach(function(x){if(!x.class_year)return;
      var c=m[x.class_year]=m[x.class_year]||{class_year:x.class_year,students:0,points:0};c.students++;c.points+=x.points});
    return Object.keys(m).map(function(k){var c=m[k];c.per_student=Math.round(c.points/c.students);return c}).sort(function(a,b){return b.per_student-a.per_student})}

  /* ---------- live backend: Supabase RPCs (no amounts ever sent) ---------- */
  function rpc(fn,args){return SMU.client.rpc(fn,args||{}).then(function(r){if(r.error)throw r.error;return r.data})}
  function rows(p){return p.then(function(r){if(r.error)throw r.error;return r.data||[]})}
  var live={
    summary:function(){if(!SMU.user)return res({signed_in:false,tier:tierFor(0),balance:0,season_earned:0,streak:0,checkins:0,history:[],redemptions:[],checked:{}});
      return Promise.all([rpc('my_engagement'),
        rows(SMU.client.from('point_events').select('id,kind,points,ref,game_id,note,created_at').order('created_at',{ascending:false}).limit(100)),
        rows(SMU.client.from('checkins').select('game_id,checked_at,minutes_before_kickoff,points')),
        rows(SMU.client.from('redemptions').select('id,reward_id,cost,code,status,created_at').order('created_at',{ascending:false}))]).then(function(a){
        var m=a[0]||{},ch={};a[2].forEach(function(c){ch[c.game_id]={at:c.checked_at,mins:c.minutes_before_kickoff,points:c.points}});
        m.tier=tierFor(m.season_earned);m.history=a[1];m.checked=ch;m.email=SMU.user.email;m.name=SMU.user.name;
        m.redemptions=a[3].map(function(r){var rw=REWARDS.filter(function(x){return x.id===r.reward_id})[0];r.reward=rw?rw.name:r.reward_id;return r});return m})},
    verify:function(o){if(!SMU.user)return res({ok:false,reason:'signin',message:'Sign in with your @smu.edu email first.'});
      return rpc('verify_student',{p_class_year:+o.class_year||null}).then(function(r){if(r&&r.ok)r.tier=tierFor(r.season_earned);return r})},
    setVisible:function(v){return rpc('set_leaderboard_visibility',{p_show:!!v})},
    checkIn:function(g,c){return rpc('check_in',{p_game_id:g,p_code:String(c||'')})},
    gateCode:function(g){return rpc('gate_code',{p_game_id:g})},
    rewards:function(){return rows(SMU.client.from('rewards').select('id,category,name,description,cost,stock,per_user_limit').order('sort'))},
    redeem:function(id){return rpc('redeem_reward',{p_reward_id:id})},
    leaderboard:function(scope,opt){opt=opt||{};return rpc('leaderboard',{p_scope:scope,p_game_id:opt.game_id||null,p_class_year:opt.class_year||null,p_limit:opt.limit||50})},
    classStandings:function(){return rpc('class_standings')},
    sampleSeason:function(){return res(false)},
    reset:function(){return res()}
  };

  var E={live:false,mode:'demo',LABEL:LABEL,RULES:RULES,TIERS:TIERS,REWARDS:REWARDS,CATS:CATS,GAMES:GAMES,SEASON:SEASON,TZ:TZ,
    on:on,now:now,gameById:gameById,gameState:gameState,windowFor:windowFor,nextGame:nextGame,lastGame:lastGame,openGame:openGame,
    tierFor:tierFor,clock:clock,setClock:setClock,clearClock:clearClock,win:win};
  function B(){return E.live?live:demo}
  ['summary','verify','setVisible','checkIn','gateCode','rewards','redeem','leaderboard','classStandings','sampleSeason','reset'].forEach(function(k){
    E[k]=function(){var b=B();return b[k].apply(b,arguments)}});
  /* live only if the site is live AND the engagement tables exist; otherwise a labeled demo */
  E.ready=(SMU&&SMU.ready?SMU.ready:res('demo')).then(function(){
    if(!(SMU&&SMU.live&&SMU.client))return 'demo';
    return rows(SMU.client.from('rewards').select('id').limit(1)).then(function(){E.live=true;E.mode='live';return 'live'},
      function(){console.info('[SMU+] Engagement tables not found; student points run as a demo in this browser.');return 'demo'})});
  if(SMU&&SMU.on)SMU.on('auth',function(){emit('change')});

  /* ---------- shared UI helpers ---------- */
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function fmt(n){return (+n||0).toLocaleString('en-US')}
  function dt(d,o){return new Intl.DateTimeFormat('en-US',Object.assign({timeZone:TZ},o)).format(d)}
  function time(d){return dt(d,{hour:'numeric',minute:'2-digit'}).replace(':00','')}
  function koLabel(g,short){if(!g.ko)return dt(new Date(g.date+'T12:00:00-06:00'),{weekday:'short',month:'short',day:'numeric'})+' \u00b7 Time TBA';
    return dt(g.ko,{weekday:'short',month:'short',day:'numeric'})+' \u00b7 '+time(g.ko)+' CT'}
  function toast(msg,kind){var t=document.createElement('div');t.className='eg-toast'+(kind?' '+kind:'');t.setAttribute('role','status');t.textContent=msg;
    document.body.appendChild(t);requestAnimationFrame(function(){t.classList.add('in')});setTimeout(function(){t.classList.remove('in');setTimeout(function(){t.remove()},300)},3400)}
  function reduced(){return window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches}
  function countUp(el,to,ms){var from=+(el.getAttribute('data-from')||0),t0=performance.now();if(reduced()){el.textContent=fmt(to);return}
    (function step(t){var p=Math.min(1,(t-t0)/(ms||900)),e=1-Math.pow(1-p,3);el.textContent=fmt(Math.round(from+(to-from)*e));if(p<1)requestAnimationFrame(step)})(t0)}
  function root(){return document.body.getAttribute('data-root')||'../'}
  function labelTag(){return '<span class="eg-label">'+LABEL+'</span>'}
  function demoBar(){return '<div class="eg-demo" role="note"><div class="wrap"><b>'+LABEL+'.</b> <span>Student points, check-ins and rewards are a concept demo'+(E.live?'.':', saved in this browser only.')+'</span></div></div>'}
  function clockBar(){var c=clock(),g=c&&gameById(c.game);if(!c||!g)return '';
    return '<div class="eg-clock" role="status"><div class="wrap"><span><b>Demo clock</b> It\u2019s '+dt(now(),{weekday:'short',month:'short',day:'numeric'})+', '+time(now())+' CT. Game day vs '+esc(g.opp)+'.</span><button type="button" class="eg-link" data-clock-reset>Back to real time</button></div></div>'}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-clock-reset]');if(b){clearClock();toast('Back to real time.')}});
  function tierBar(t,earned){return '<div class="eg-tier"><div class="eg-tier-h"><b>'+esc(t.name)+'</b><span>'+(t.next?fmt(t.toNext)+' to '+esc(t.next_name):'Top tier')+'</span></div>'+
    '<div class="eg-meter" role="progressbar" aria-label="Progress to '+esc(t.next_name||t.name)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+Math.round(t.progress*100)+'"><i style="--p:'+t.progress.toFixed(3)+'"></i></div>'+
    '<ol class="eg-tier-steps">'+TIERS.map(function(x){return '<li class="'+(earned>=x.floor?'on':'')+'"><span>'+esc(x.name)+'</span><small>'+fmt(x.floor)+'</small></li>'}).join('')+'</ol></div>'}
  var KIND={checkin:'Check-in',early:'Early arrival',streak:'Streak bonus',milestone:'Milestone',welcome:'Student welcome',redeem:'Redeemed',adjust:'Adjustment'};
  function historyList(h,limit){if(!h||!h.length)return '<p class="eg-empty">No points yet. Your first check-in at Ford Stadium is worth '+RULES.checkin+', plus '+RULES.early+' if you\u2019re in 45 minutes early.</p>';
    return '<ul class="eg-hist">'+h.slice(0,limit||50).map(function(e){var g=e.game_id&&gameById(e.game_id);
      return '<li><span class="eg-hist-k">'+esc(KIND[e.kind]||e.kind)+'</span><span class="eg-hist-n">'+esc(e.note||'')+(g&&e.kind!=='checkin'?' \u00b7 vs '+esc(g.opp):'')+'<small>'+dt(new Date(e.created_at),{month:'short',day:'numeric'})+'</small></span><b class="'+(e.points<0?'neg':'pos')+'">'+(e.points>0?'+':'\u2212')+fmt(Math.abs(e.points))+'</b></li>'}).join('')+'</ul>'}

  E.ui={esc:esc,fmt:fmt,dt:dt,time:time,koLabel:koLabel,toast:toast,countUp:countUp,root:root,reduced:reduced,labelTag:labelTag,demoBar:demoBar,clockBar:clockBar,tierBar:tierBar,historyList:historyList,KIND:KIND};
  window.ENG=E;
})();
