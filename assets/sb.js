/* SMU+ data layer.
   One API for the whole site, two backends:
   - live: Supabase (when assets/config.js has SUPABASE_URL and SUPABASE_ANON_KEY)
   - demo: localStorage in this browser (when config is empty, or if Supabase can't be reached)
   app.js only talks to window.SMU, never to Supabase directly. */
(function(){
  'use strict';
  var CFG=window.SMU_CONFIG||{},MP=window.MP||{};
  var SUPA_SRC='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.js';
  var SUPA_SRI='sha384-TcHRA3zBbn+Lexh5n+Oil4guNPOS3rjNDpGRAN46u/s/mB2IZ50ceC6TYDU2yvgK';
  var TIERS=(window.MP&&MP.TIER_LABELS)||{free:'Free',mustang:'Fan',pony:'Plus',club:'Founder'};
  var AFFIL=['student','alum','fan','parent','other'],PRIVACY_VERSION='2026-10-26';
  var INTEREST=['free','mustang','all_access','red_blue','not_sure','student'];
  /* Attribution (D4): utm_* + referrer host from the landing URL, kept in sessionStorage only (no cookies). A new URL with utm_* replaces it. */
  function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}}
  function clip(v,n){v=String(v||'').trim().slice(0,n||100);return v||null}
  var ATTR=(function(){var a=null;try{a=JSON.parse(ss('smu_attr')||'null')}catch(e){}
    var q;try{q=new URLSearchParams(location.search)}catch(e){q=null}
    var u=q?{utm_source:clip(q.get('utm_source')),utm_medium:clip(q.get('utm_medium')),utm_campaign:clip(q.get('utm_campaign')),utm_content:clip(q.get('utm_content'))}:{};
    var ref=null;try{if(document.referrer){var h=new URL(document.referrer).hostname;if(h&&h!==location.hostname)ref=clip(h,200)}}catch(e){}
    if(u.utm_source||u.utm_medium||u.utm_campaign||u.utm_content||!a){a={utm_source:u.utm_source||null,utm_medium:u.utm_medium||null,utm_campaign:u.utm_campaign||null,utm_content:u.utm_content||null,referrer_host:ref||(a&&a.referrer_host)||null};ss('smu_attr',JSON.stringify(a))}
    return a})();
  /* Cookie-free visit counter: one insert per page load, live mode only, never in automated browsers. Fire-and-forget. */
  function pageView(sb){try{if(navigator.webdriver||window.__SMU_NOBOOT||ss('smu_pv_off'))return;
    var path=(location.pathname.replace(/^\/mustangs-plus/,'')||'/').slice(0,200),mob=window.matchMedia&&matchMedia('(max-width: 767px), (pointer: coarse)').matches;
    sb.from('page_views').insert({path:path,utm_source:ATTR.utm_source,utm_medium:ATTR.utm_medium,utm_campaign:ATTR.utm_campaign,referrer_host:ATTR.referrer_host,session_id:sid(),device:mob?'mobile':'desktop'})
      .then(function(r){if(r&&r.error&&(r.status===404||r.error.code==='PGRST205'||r.error.code==='42P01'))ss('smu_pv_off','1')},function(){})}catch(e){}}
  function sid(){var v=ss('smu_sid');if(!v||!/^[A-Za-z0-9-]{8,64}$/.test(v)){v=(window.crypto&&crypto.randomUUID)?crypto.randomUUID():(Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12));ss('smu_sid',v)}return v}
  var configured=!!(CFG.SUPABASE_URL&&CFG.SUPABASE_ANON_KEY&&/^https:\/\/.+/.test(CFG.SUPABASE_URL));

  /* ---------- tiny utils ---------- */
  function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
  function lj(k,d){try{return JSON.parse(ls(k)||'null')||d}catch(e){return d}}
  function sj(k,v){ls(k,JSON.stringify(v))}
  var subs={};
  function on(ev,cb){(subs[ev]=subs[ev]||[]).push(cb);return function(){subs[ev]=(subs[ev]||[]).filter(function(x){return x!==cb})}}
  function emit(ev,d){(subs[ev]||[]).slice().forEach(function(cb){try{cb(d)}catch(e){console.error(e)}})}
  function fail(where,err){var msg=(err&&err.message)||String(err||'Unknown error');
    var net=/fetch|network|Failed to fetch|NetworkError|timeout|Load failed/i.test(msg)||(typeof navigator!=='undefined'&&navigator.onLine===false);
    var e=new Error(net?'We couldn\u2019t reach the SMU+ server. Check your connection and try again.':msg);e.network=net;e.where=where;e.cause=err;
    console.warn('[SMU+]',where,err);emit('error',e);return e}
  function withTimeout(p,ms){return new Promise(function(res,rej){var t=setTimeout(function(){rej(new Error('timeout'))},ms||12000);p.then(function(v){clearTimeout(t);res(v)},function(e){clearTimeout(t);rej(e)})})}
  function q(where,p){return withTimeout(Promise.resolve(p),12000).then(function(r){if(r&&r.error)throw r.error;return r?r.data:r}).catch(function(e){throw fail(where,e)})}
  function ago(iso){var s=Math.max(1,(Date.now()-Date.parse(iso))/1000),m=s/60;return m<60?Math.max(1,Math.round(m))+'m':m<1440?Math.round(m/60)+'h':m<10080?Math.round(m/1440)+'d':Math.round(m/10080)+'w'}
  function kfmt(n){n=+n||0;return n>=1000?(n/1000).toFixed(n>=10000?0:1).replace(/\.0$/,'')+'k':String(n)}
  function uid(){return 'l'+Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
  function nameFromEmail(e){return String(e||'').split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()}).slice(0,40)||'Member'}

  var SMU={live:false,configured:configured,mode:'demo',user:null,TIERS:TIERS,on:on,ago:ago,
    reason:configured?'connecting':'no-config'};
  window.SMU=SMU;SMU.attr=ATTR;
  var sb=null;
  /* Feature flag (data.js): with recruiting off, the Recruiting Trail forum and its threads are hidden client-side. Nothing is deleted in Supabase. */
  function recOff(){return !!(MP.FEATURES&&MP.FEATURES.recruiting===false)}
  function recFilter(){if(!recOff())return;MP.FORUMS=(MP.FORUMS||[]).filter(function(f){return f.id!=='recruiting'});
    MP.THREADS=(MP.THREADS||[]).filter(function(t){return t.f!=='recruiting'&&(!MP.recOK||MP.recOK(t))})}

  /* ---------- users shown on the boards ---------- */
  function ensureUser(id,name,tier,since,av){MP.USERS=MP.USERS||{};
    if(!MP.USERS[id])MP.USERS[id]={n:name||'Member',tier:TIERS[tier]||'Member',since:since||String(new Date().getFullYear()),posts:'',real:true};
    else if(name)MP.USERS[id].n=name;
    if(av!==undefined)MP.USERS[id].av=avOK(av)?av:null;return id}
  /* ---------- profile photos (supabase/RUN_ME_15_avatars.sql) ----------
     Demo mode: always on, the photo is a small data: URL kept in this browser with the demo account.
     Live: off until MP.FEATURES.avatars is true (flip it only after RUN_ME_15 has run), so the site never asks
     Supabase for a column or bucket that isn't there yet. Only URLs in our own avatars bucket are ever shown. */
  var AV_LIVE=new RegExp('^'+String(CFG.SUPABASE_URL||'').replace(/[.*+?^${}()|[\]\\\/]/g,'\\$&')+'/storage/v1/object/public/avatars/[0-9a-f-]{36}/[A-Za-z0-9._-]{1,80}$');
  var AV_TYPES=['image/jpeg','image/png','image/webp'],AV_MAX=2*1024*1024;
  /* ---------- free Student plan (supabase/RUN_ME_16_students.sql) ----------
     Demo: always on, saved in this browser. Live: off until MP.FEATURES.students is true (after RUN_ME_16 has run).
     'student' is a free plan, never a paid membership, so it doesn't unlock members-only content. No student ID is asked for
     (RUN_ME_17): claim_student_membership() verifies the confirmed @smu.edu email; only the class year and verified date come back. */
  function paid(t){return !!t&&t!=='free'&&t!=='student'&&!!TIERS[t]}
  var SMU_EMAIL=/^[^@\s]+@smu\.edu$/i,stCache=null,stMsg='';
  /* Student IDs are no longer collected: clear any this browser saved for the old on-device claim */
  (function(){try{ls('mp_student_ids',null);var u=lj('mp_user',null);if(u&&u.student&&'sid' in u.student){delete u.student.sid;sj('mp_user',u)}
    var p=lj('mp_student_pending',null);if(p&&'sid' in p){delete p.sid;ls('mp_student_pending',JSON.stringify(p))}}catch(e){}})();
  function stOn(){/* decided from config, not SMU.live (set only after supabase-js loads), so pages that render early stay flag-gated */return !configured||SMU.reason==='unreachable'||!!(MP.FEATURES&&MP.FEATURES.students===true)}
  function stYears(){var y=new Date().getFullYear(),out=[];for(var i=Math.max(2026,y);i<=Math.min(2034,y+6);i++)out.push(i);return out}
  function stCheck(o){var em=String(o.email||'').trim().toLowerCase(),yr=+o.year;
    if(o.email!==undefined&&!SMU_EMAIL.test(em))return 'Use your SMU email, ending in @smu.edu.';
    if(stYears().indexOf(yr)<0)return 'Pick your class year.';return ''}
  function avOn(){return !SMU.live||!!(MP.FEATURES&&MP.FEATURES.avatars===true)}
  function avOK(u){if(typeof u!=='string'||u.length>200000)return false;
    return SMU.live?!!configured&&AV_LIVE.test(u):/^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+\/=]+$/.test(u)}
  function blobURL(b){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(r.result)};r.onerror=function(){rej(new Error('Could not read that photo.'))};r.readAsDataURL(b)})}
  function avCheck(b){if(!b||AV_TYPES.indexOf(b.type)<0)return 'Use a JPEG, PNG or WebP image.';if(b.size>AV_MAX)return 'That photo is over 2 MB. Pick a smaller one.';return ''}
  /* every author on the boards needs a USERS entry (e.g. posts written in this browser before signing out) */
  function fillUsers(){(MP.THREADS||[]).forEach(function(t){[t.by].concat((t.posts||[]).map(function(p){return p[0]})).forEach(function(id){
    if(id&&!(MP.USERS&&MP.USERS[id]))ensureUser(id,id==='me'?(ls('mp_lastname')||'Demo member'):'Member')})})}
  /* Board totals. Live: the forum_stats/sport_stats views (supabase/boards_stats.sql). Demo, or if the views aren't there yet:
     counted from the threads this page actually has (the seed plus this browser's posts). Never the old sample numbers. */
  function countBoards(){var F={},S={};(MP.THREADS||[]).forEach(function(t){var n=(t.posts||[]).length||1,f=F[t.f]=F[t.f]||{threads:0,posts:0};f.threads++;f.posts+=n;
    if(t.sport){var s=S[t.sport]=S[t.sport]||{threads:0,posts:0};s.threads++;s.posts+=n}});return {forums:F,sports:S}}
  /* Per-thread numbers must be real too: replies = posts after the first; views only where the database really counted them */
  var THREAD_STATS=false;  /* flip after PROPOSED_8_board_counts.sql is applied */
  function realCounts(){(MP.THREADS||[]).forEach(function(t){if(!t.live){t.replies=Math.max(0,(t.posts||[]).length-1);t.views=null}})}
  function applyBoards(c){(MP.FORUMS||[]).forEach(function(f){var x=c.forums[f.id]||{};f.threads=x.threads||0;f.posts=x.posts||0});MP.SPORT_STATS=c.sports;return c}
  function meKey(){return SMU.user?(SMU.live?'u:'+SMU.user.id:'me'):null}

  /* ================= DEMO backend (localStorage) ================= */
  var demo={
    init:function(){var u=lj('mp_user',null);SMU.user=u;if(u)ensureUser('me',u.name,demo.tier(),String(new Date(u.since||Date.now()).getFullYear()),u.avatar||null);demo.mergeThreads();realCounts();fillUsers();applyBoards(countBoards());return Promise.resolve()},
    signUp:function(o){var u={id:uid(),email:String(o.email).trim().toLowerCase(),name:(o.name||'').trim()||nameFromEmail(o.email),since:Date.now()};
      sj('mp_user',u);ls('mp_lastname',u.name);SMU.user=u;ensureUser('me',u.name,demo.tier(),undefined,null);MP.USERS.me.n=u.name;emit('auth',u);return Promise.resolve({user:u,confirm:false})},
    signIn:function(o){var u=lj('mp_user',null),em=String(o.email).trim().toLowerCase();
      if(!u||u.email!==em){u={id:uid(),email:em,name:nameFromEmail(em),since:Date.now()};sj('mp_user',u)}
      SMU.user=u;ensureUser('me',u.name,demo.tier(),undefined,u.avatar||null);emit('auth',u);return Promise.resolve({user:u})},
    oauth:function(){return Promise.reject(new Error('This sign-in option needs the live database.'))},
    signOut:function(){ls('mp_user',null);if(ls('mp_tier')==='student')demo.setTier('free');SMU.user=null;if(MP.USERS&&MP.USERS.me)MP.USERS.me.av=null;emit('auth',null);return Promise.resolve()},
    setAvatar:function(b){var u=lj('mp_user',null),bad=avCheck(b);if(!u)return Promise.reject(new Error('Sign in to add a photo.'));if(bad)return Promise.reject(new Error(bad));
      return blobURL(b).then(function(d){u.avatar=d;sj('mp_user',u);SMU.user=u;ensureUser('me',u.name,demo.tier(),undefined,d);emit('avatar',d);return d})},
    removeAvatar:function(){var u=lj('mp_user',null);if(!u)return Promise.reject(new Error('Not signed in'));delete u.avatar;sj('mp_user',u);SMU.user=u;ensureUser('me',u.name,demo.tier(),undefined,null);emit('avatar',null);return Promise.resolve()},
    updateName:function(n){var u=lj('mp_user',null);if(!u)return Promise.reject(new Error('Not signed in'));u.name=n;sj('mp_user',u);ls('mp_lastname',n);SMU.user=u;MP.USERS.me&&(MP.USERS.me.n=n);emit('auth',u);return Promise.resolve(u)},
    tier:function(){var t=ls('mp_tier');return TIERS[t]?t:(ls('mp_member')==='1'?'pony':'free')},
    /* Demo student sign-up: no email is sent, so the account is created and confirmed at once. */
    studentJoin:function(o){var bad=stCheck(o);if(bad)return Promise.reject(new Error(bad));
      var em=String(o.email).trim().toLowerCase();
      var u=lj('mp_user',null);if(u&&u.email!==em)return Promise.reject(new Error('Sign out first, then join with your SMU email.'));
      var p=u?Promise.resolve({user:u}):demo.signUp({email:em,name:o.name});
      return p.then(function(){return demo.claimStudent(+o.year)}).then(function(r){r.demo=true;return r})},
    claimStudent:function(year){var u=lj('mp_user',null);if(!u)return Promise.reject(new Error('Sign in first.'));
      if(!SMU_EMAIL.test(u.email))return Promise.reject(new Error('Student membership needs an @smu.edu email.'));
      var st=u.student;
      if(!st){var bad=stCheck({year:year});if(bad)return Promise.reject(new Error(bad));st={year:year,at:new Date().toISOString()}}
      else if(year)st.year=year;
      u.student=st;sj('mp_user',u);SMU.user=u;var t=demo.tier();if(!paid(t))demo.setTier('student');emit('student',demo.student());return Promise.resolve({ok:true,tier:demo.tier(),class_year:st.year})},
    student:function(){var u=lj('mp_user',null);return u&&u.student?{year:u.student.year,at:u.student.at}:null},
    setTier:function(t){ls('mp_tier',t);ls('mp_member',paid(t)?'1':'0');emit('tier',t);return Promise.resolve(t)},
    brief:function(email){ls('mp_brief',email);return Promise.resolve({ok:true})},
    unbrief:function(){ls('mp_brief',null);return Promise.resolve()},
    waitlist:function(o){var e=String(o.email).trim().toLowerCase();ls('mp_waitlist',e);return Promise.resolve({ok:true,table:'local'})},
    progress:function(id,p){return Promise.resolve()},  /* app.js already keeps mp_history locally */
    pullProgress:function(){return Promise.resolve(null)},
    saved:function(){return lj('mp_saved',[])},
    toggleSave:function(id){var s=demo.saved(),i=s.indexOf(id);if(i>=0)s.splice(i,1);else s.unshift(id);sj('mp_saved',s);emit('saved',s);return Promise.resolve(s)},
    /* user-written threads and replies live next to the sample boards */
    local:function(){return lj('mp_posts',{threads:[],replies:{}})},
    mergeThreads:function(){var L=demo.local();
      L.threads.forEach(function(t){if(!MP.THREADS.some(function(x){return x.id===t.id}))MP.THREADS.unshift(t)});
      Object.keys(L.replies).forEach(function(id){var t=MP.THREADS.filter(function(x){return String(x.id)===id})[0];if(!t||t._merged)return;t._merged=1;
        L.replies[id].forEach(function(p){t.posts.push(p);t.replies++})})},
    loadThreads:function(){return Promise.resolve(MP.THREADS)},
    boardStats:function(){return Promise.resolve(applyBoards(countBoards()))},
    loadThread:function(id){return Promise.resolve(MP.THREADS.filter(function(t){return t.id===id})[0]||null)},
    createThread:function(o){if(!SMU.user)return Promise.reject(new Error('Sign in to start a thread.'));
      var L=demo.local(),id=Math.max.apply(null,MP.THREADS.map(function(t){return t.id}).concat([100]))+1,now=new Date().toISOString();
      var md=mediaDemo(o.media),t={id:id,f:o.f,sport:o.sport||null,title:o.title,by:'me',ago:'1m',replies:0,views:'1',mine:true,posts:[['me',o.body,null,now].concat(md?[null,md]:[])]};
      L.threads.unshift(t);mediaSave(L,!!md);MP.THREADS.unshift(t);emit('threads');return Promise.resolve(t)},
    reply:function(tid,body,quote,media){if(!SMU.user)return Promise.reject(new Error('Sign in to reply.'));
      var md=mediaDemo(media),L=demo.local(),p=['me',body,quote==null?null:quote,new Date().toISOString()].concat(md?[null,md]:[]);(L.replies[tid]=L.replies[tid]||[]).push(p);mediaSave(L,!!md);
      var t=MP.THREADS.filter(function(x){return x.id===tid})[0];if(t){t.posts.push(p);t.replies++}emit('post:'+tid,p);return Promise.resolve(p)},
    watch:function(){return function(){}}
  };

  /* ================= LIVE backend (Supabase) ================= */
  function loadScript(src,sri){return new Promise(function(res,rej){if(window.supabase&&window.supabase.createClient)return res();
    var s=document.createElement('script');s.src=src;if(sri){s.integrity=sri;s.crossOrigin='anonymous'}s.async=true;
    s.onload=function(){window.supabase&&window.supabase.createClient?res():rej(new Error('supabase-js did not load'))};s.onerror=function(){rej(new Error('Could not load supabase-js from the CDN'))};
    document.head.appendChild(s)})}
  /* Speed: outside boards and account (and OAuth returns), fetch supabase-js only after app.js has drawn the page (DOMContentLoaded + one task),
     so the CDN script never runs between the deferred scripts and holds up first render. Everything still waits on SMU.ready as before. */
  function afterFirstRender(){var pg=(document.body&&document.body.dataset.page)||'',now=pg==='boards'||pg==='account'||/[?&#](code|access_token|error)=/.test(location.href);
    if(now)return Promise.resolve();return new Promise(function(res){function go(){setTimeout(res,0)}
      var n=null;try{n=performance.getEntriesByType('navigation')[0]}catch(e){}
      if(document.readyState==='loading'||(n&&!n.domContentLoadedEventStart))document.addEventListener('DOMContentLoaded',go);else go()})}
  var tierCache='free',savedCache=[];
  /* Which sign-up paths really work, read from Supabase's public auth settings (no key beyond the anon key).
     email: email + password sign-up that needs no delivered email ("Confirm email" off, so mailer_autoconfirm is true).
     oauth: enabled providers we offer (Microsoft for SMU email, Google, Apple). signup: at least one way to make a new account.
     Demo mode: email sign-up always works (nothing is sent). Sign-in with an existing email + password always works. */
  var caps={signup:false,email:false,oauth:[]},OAUTH=['azure','google','apple'];
  function loadCaps(){return withTimeout(fetch(CFG.SUPABASE_URL+'/auth/v1/settings',{headers:{apikey:CFG.SUPABASE_ANON_KEY}}).then(function(r){if(!r.ok)throw new Error('settings '+r.status);return r.json()}),8000)
    .then(function(s){var ex=s.external||{},open=!s.disable_signup;caps={email:open&&!!ex.email&&!!s.mailer_autoconfirm,oauth:open?OAUTH.filter(function(p){return !!ex[p]}):[]};
      caps.signup=caps.email||caps.oauth.length>0},function(){caps={signup:false,email:false,oauth:[]}})}
  function toThread(r){
    var by=r.author_handle||ensureUser('u:'+r.author_id,r.author&&r.author.display_name,undefined,undefined,avOf(r.author));
    var posts=(r.posts||[]).slice().sort(function(a,b){return a.created_at<b.created_at?-1:1});
    var idx={};posts.forEach(function(p,i){idx[p.id]=i});
    var P=posts.map(function(p){var u=p.author_handle||ensureUser('u:'+p.author_id,p.author&&p.author.display_name,undefined,undefined,avOf(p.author));
      var row=[u,p.body,p.quote_post_id!=null&&idx[p.quote_post_id]!=null?idx[p.quote_post_id]:null,p.created_at,p.id],md=mediaClean(p.media);if(md)row[5]=md;return row});
    return {id:r.id,f:r.forum_id,sport:r.sport,title:r.title,game:r.game_id||null,by:by,ago:ago(r.created_at),replies:P.length?P.length-1:(r.author_handle?null:Math.max(0,r.reply_count||0)),views:r.author_handle?null:kfmt(r.view_count),
      pin:!!r.pinned,hot:!!r.hot,posts:P.length?P:[[by,'',null,r.created_at]],locked:!P.length,live:true,mine:SMU.user&&r.author_id===SMU.user.id}}
  function threadSel(){var pf=avOn()?'display_name,avatar_url':'display_name';
    return 'id,forum_id,sport,title,pinned,hot,reply_count,view_count,created_at,last_post_at,author_handle,author_id,game_id,author:profiles!threads_author_id_fkey('+pf+'),'+
      'posts(id,author_handle,author_id,body,quote_post_id,created_at'+(mediaLive()?',media':'')+',author:profiles!posts_author_id_fkey('+pf+'))'}
  function avOf(a){return avOn()&&a?(a.avatar_url||null):undefined}
  var myAv={id:null,url:null};
  var live={
    init:function(){
      return afterFirstRender().then(function(){return loadScript(SUPA_SRC,SUPA_SRI)}).then(function(){
        sb=window.supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce'}});
        SMU.client=sb;SMU.live=true;SMU.mode='live';SMU.reason='ok';pageView(sb);
        sb.auth.onAuthStateChange(function(ev,session){var was=SMU.user&&SMU.user.id;setSession(session);
          if((SMU.user&&SMU.user.id)!==was){emit('auth',SMU.user);if(SMU.user)live.afterSignIn()}});
        return Promise.all([loadCaps(),q('session',sb.auth.getSession()).then(function(d){setSession(d&&d.session);if(SMU.user)return live.afterSignIn()})])
      }).then(function(){return live.loadForums(true)}).catch(function(e){
        /* Never break the site: fall back to demo mode if Supabase can't be reached */
        SMU.live=false;SMU.mode='demo';SMU.reason='unreachable';sb=null;console.warn('[SMU+] Live backend unavailable, using demo mode.',e);
        emit('error',fail('connect',e));return demo.init()})},
    afterSignIn:function(){return Promise.all([live.fetchTier(),live.fetchSaved(),live.ensureProfileName(),live.fetchAvatar()]).catch(function(){}).then(live.studentAfter)},
    /* After an OAuth return: read this account's student row; if a student sign-up from this browser is waiting, claim it now. */
    studentAfter:function(){if(!stOn()||!SMU.user)return;
      return live.fetchStudent().then(function(st){var pend=null;try{pend=JSON.parse(ls('mp_student_pending')||'null')}catch(e){}
        if(!pend||st||(pend.email!=='*'&&String(pend.email||'')!==String(SMU.user.email||'').toLowerCase()))return;
        if(!SMU_EMAIL.test(SMU.user.email||'')){ls('mp_student_pending',null);stMsg='That account isn\u2019t an @smu.edu email, so it\u2019s a free Fan account. Sign out and use your SMU email for the Student plan.';emit('student',null);return}
        return live.claimStudent(pend.year).then(function(){ls('mp_student_pending',null)},function(e){stMsg=e.message;if(e.final)ls('mp_student_pending',null);emit('student',null)})}).catch(function(){})},
    fetchStudent:function(){return q('student',sb.from('student_verifications').select('class_year,verified_at').eq('user_id',SMU.user.id).maybeSingle())
      .then(function(r){stCache=r?{year:r.class_year,at:r.verified_at}:null;emit('student',stCache);return stCache})},
    /* Student sign-up with email + password (works only while caps.email: no email has to be delivered), then the server-side claim.
       o.provider instead: OAuth (e.g. Microsoft, which SMU email runs on); the class year waits in this browser and studentAfter claims it on return. */
    studentJoin:function(o){var bad=stCheck(o.provider?{year:o.year}:o);if(bad)return Promise.reject(new Error(bad));if(!stOn())return Promise.reject(new Error('Student sign-up isn\u2019t open yet.'));
      if(o.provider){ls('mp_student_pending',JSON.stringify({email:'*',year:+o.year,t:Date.now()}));return live.oauth(o.provider)}
      if(!caps.email)return Promise.reject(new Error('Sign-up with email isn\u2019t open right now.'));
      return live.signUp({email:String(o.email).trim().toLowerCase(),password:o.password,name:o.name}).then(function(r){if(r.confirm)return r;return live.claimStudent(+o.year)})},
    claimStudent:function(year){if(!SMU.user)return Promise.reject(new Error('Sign in first.'));
      return q('student',sb.rpc('claim_student_membership',{p_student_id:null,p_class_year:year||null})).then(function(r){
        if(!r||!r.ok){var e=new Error((r&&r.message)||'Couldn\u2019t start your Student membership.');e.reason=r&&r.reason;e.final=/^(id_taken|id_mismatch|not_smu|bad_id)$/.test(e.reason||'');throw e}
        stMsg='';tierCache=r.tier||'student';ls('mp_tier',tierCache);ls('mp_member',paid(tierCache)?'1':'0');emit('tier',tierCache);
        return live.fetchStudent().then(function(){return r})})},
    student:function(){return SMU.user?stCache:null},
    fetchAvatar:function(){if(!avOn()||!SMU.user)return Promise.resolve(null);var id=SMU.user.id;
      return q('avatar',sb.from('profiles').select('avatar_url').eq('id',id).maybeSingle()).then(function(r){var url=r&&avOK(r.avatar_url)?r.avatar_url:null;live.useAvatar(id,url);return url})},
    useAvatar:function(id,url){myAv={id:id,url:url};if(SMU.user&&SMU.user.id===id){SMU.user.avatar=url;ensureUser('u:'+id,SMU.user.name,tierCache,undefined,url)}emit('avatar',url)},
    /* Upload goes to avatars/<user id>/avatar-<time>.webp (a new name each time, so caches never show the old photo),
       then the profile points at it, then older files in the folder are removed. */
    avFiles:function(id){return q('avatar',sb.storage.from('avatars').list(id,{limit:100})).then(function(rows){return (rows||[]).map(function(x){return id+'/'+x.name}).filter(function(n){return !/\/\.emptyFolderPlaceholder$/.test(n)})})},
    setAvatar:function(b){if(!SMU.user)return Promise.reject(new Error('Sign in to add a photo.'));if(!avOn())return Promise.reject(new Error('Profile photos aren\u2019t switched on yet.'));
      var bad=avCheck(b);if(bad)return Promise.reject(new Error(bad));
      var id=SMU.user.id,path=id+'/avatar-'+Date.now().toString(36)+(b.type==='image/webp'?'.webp':b.type==='image/png'?'.png':'.jpg'),st=sb.storage.from('avatars');
      return q('avatar',st.upload(path,b,{contentType:b.type,cacheControl:'31536000',upsert:false})).then(function(){
        var url=st.getPublicUrl(path).data.publicUrl;
        return q('avatar',sb.from('profiles').update({avatar_url:url}).eq('id',id)).then(function(){return url},function(e){st.remove([path]).then(function(){},function(){});throw e})
      }).then(function(url){live.useAvatar(id,url);
        live.avFiles(id).then(function(all){var old=all.filter(function(n){return n!==path});if(old.length)return st.remove(old)}).catch(function(){});return url})},
    removeAvatar:function(){if(!SMU.user)return Promise.reject(new Error('Not signed in'));var id=SMU.user.id,st=sb.storage.from('avatars');
      return live.avFiles(id).then(function(all){return all.length?q('avatar',st.remove(all)):null})
        .then(function(){return q('avatar',sb.from('profiles').update({avatar_url:null}).eq('id',id))}).then(function(){live.useAvatar(id,null)})},
    ensureProfileName:function(){var u=SMU.user;if(!u)return;ensureUser('u:'+u.id,u.name,tierCache)},
    loadForums:function(strict){return q('forums',sb.from('forums').select('id,name,description,premium,grp,sort').order('sort')).then(function(rows){
      if(rows&&rows.length)MP.FORUMS=rows.map(function(f){var old=(MP.FORUMS||[]).filter(function(x){return x.id===f.id})[0]||{};
        return {id:f.id,name:f.name,desc:recOff()&&/recruit/i.test(f.description||'')&&old.desc?old.desc:f.description,prem:f.premium,group:f.grp,threads:old.threads||0,posts:old.posts||0}});recFilter();if(MP.cleanBoards)MP.cleanBoards()}).catch(function(e){if(strict)throw e})},
    /* views from supabase/RUN_ME_7_boards_stats.sql; rows marked rec are left out while recruiting is off */
    boardStats:function(){return Promise.all([q('stats',sb.from('forum_stats').select('forum_id,rec,threads,posts')),q('stats',sb.from('sport_stats').select('sport,rec,threads,posts'))]).then(function(r){
      var c={forums:{},sports:{}};function add(m,k,x){if(x.rec&&recOff())return;var o=m[k]=m[k]||{threads:0,posts:0};o.threads+=x.threads||0;o.posts+=x.posts||0}
      (r[0]||[]).forEach(function(x){add(c.forums,x.forum_id,x)});(r[1]||[]).forEach(function(x){add(c.sports,x.sport,x)});return applyBoards(c)},
      function(){return applyBoards(countBoards())})},
    signUp:function(o){if(!caps.email)return Promise.reject(new Error('Sign-up with email isn\u2019t open right now.'));return q('signup',sb.auth.signUp({email:o.email,password:o.password,options:{data:{display_name:o.name||nameFromEmail(o.email)},emailRedirectTo:CFG.SITE_URL+'account/'}}))
      .then(function(d){return {user:d.user,confirm:!d.session}})},
    signIn:function(o){return q('signin',sb.auth.signInWithPassword({email:o.email,password:o.password})).then(function(d){return {user:d.user}})},
    oauth:function(p){if(caps.oauth.indexOf(p)<0)return Promise.reject(new Error('That sign-in option isn\u2019t switched on.'));
      return q('oauth',sb.auth.signInWithOAuth({provider:p,options:{redirectTo:CFG.SITE_URL+'account/',scopes:p==='azure'?'email openid profile':undefined}})).then(function(){return {redirect:true}})},
    reset:function(email){return q('reset',sb.auth.resetPasswordForEmail(email,{redirectTo:CFG.SITE_URL+'account/#reset'})).then(function(){return {sent:true}})},
    newPassword:function(pw){return q('password',sb.auth.updateUser({password:pw}))},
    /* Settings > Change password: check the current password first (a fresh sign-in as the same account), then set the new one. */
    changePassword:function(cur,pw){if(!SMU.user)return Promise.reject(new Error('Sign in first.'));var em=SMU.user.email;
      return withTimeout(Promise.resolve(sb.auth.signInWithPassword({email:em,password:cur})),12000).then(function(r){
        if(r&&r.error){var e=/invalid/i.test(r.error.message||'')?new Error('Your current password isn\u2019t right.'):fail('password',r.error);e.field='cur';throw e}
        return q('password',sb.auth.updateUser({password:pw}))})},
    signOut:function(){return q('signout',sb.auth.signOut()).then(function(){setSession(null);emit('auth',null)})},
    updateName:function(n){return q('profile',sb.from('profiles').update({display_name:n}).eq('id',SMU.user.id)).then(function(){SMU.user.name=n;ensureUser('u:'+SMU.user.id,n);MP.USERS['u:'+SMU.user.id].n=n;emit('auth',SMU.user);return SMU.user})},
    tier:function(){return SMU.user?tierCache:demo.tier()},
    fetchTier:function(){return q('tier',sb.from('memberships').select('tier').eq('user_id',SMU.user.id).maybeSingle()).then(function(r){tierCache=(r&&r.tier)||'free';ls('mp_member',paid(tierCache)?'1':'0');ls('mp_tier',tierCache);emit('tier',tierCache);return tierCache})},
    setTier:function(t){if(!SMU.user)return demo.setTier(t);
      return q('tier',sb.from('memberships').upsert({user_id:SMU.user.id,tier:t,status:'demo',updated_at:new Date().toISOString()})).then(function(){tierCache=t;ls('mp_tier',t);ls('mp_member',paid(t)?'1':'0');emit('tier',t);return t})},
    brief:function(email){var row={email:String(email).trim().toLowerCase(),source:'site'};if(SMU.user)row.user_id=SMU.user.id;
      return withTimeout(sb.from('newsletter_signups').insert(row),12000).then(function(r){if(r.error&&r.error.code!=='23505')throw r.error;ls('mp_brief',row.email);return {ok:true,dupe:!!r.error}}).catch(function(e){throw fail('brief',e)})},
    unbrief:function(){ls('mp_brief',null);return Promise.resolve()},
    /* Waitlist: insert-only (anon can't read it back). Uses public.waitlist once supabase/waitlist.sql has run;
       until then the table is missing, so the signup goes to newsletter_signups tagged source 'waitlist[:affiliation]'. */
    waitlist:function(o){var email=String(o.email).trim().toLowerCase(),aff=AFFIL.indexOf(o.affiliation)>=0?o.affiliation:null,name=String(o.name||'').trim().slice(0,80)||null;
      if(!o.consent)return Promise.reject(new Error('Please agree to the privacy notice first.'));
      function done(table,r){if(r.error&&r.error.code!=='23505')throw r.error;ls('mp_waitlist',email);return {ok:true,dupe:!!r.error,table:table}}
      function missing(r){var e=r&&r.error;return !!e&&(e.code==='PGRST205'||e.code==='42P01'||r.status===404||/does not exist|schema cache/i.test(e.message||''))}
      var base={email:email,name:name,affiliation:aff,consent:true,consent_version:PRIVACY_VERSION,source:'site'};
      var full=Object.assign({},base,{utm_source:ATTR.utm_source,utm_medium:ATTR.utm_medium,utm_campaign:ATTR.utm_campaign,utm_content:ATTR.utm_content,referrer_host:ATTR.referrer_host,tier_interest:INTEREST.indexOf(o.tier_interest)>=0?o.tier_interest:null});
      function nocol(r){var e=r&&r.error;return !!e&&(e.code==='PGRST204'||e.code==='42703'||/column/i.test(e.message||'')&&/(find|exist)/i.test(e.message||''))}
      /* Price survey (supabase/RUN_ME_30_waitlist_survey.sql): would_pay true/false, billing_choice 'monthly'|'annual' (null when free or unanswered), adfree_interest 'yes'|'no'|'maybe' (paid answers only). */
      var wp=o.would_pay===true||o.would_pay===false?o.would_pay:null,bc=wp===true&&(o.billing_choice==='monthly'||o.billing_choice==='annual')?o.billing_choice:null;
      if(wp===true&&!bc)wp=null;
      var survey=Object.assign({},full,{would_pay:wp,billing_choice:bc,survey_prices:wp===null?null:clip(o.survey_prices,20),adfree_interest:wp===true&&/^(yes|no|maybe)$/.test(o.adfree_interest||'')?o.adfree_interest:null});
      return withTimeout(sb.from('waitlist').insert(survey),12000).then(function(r){
        if(nocol(r))return withTimeout(sb.from('waitlist').insert(full),12000);  /* survey columns not added yet: save without them */
        return r}).then(function(r){
        if(nocol(r))return withTimeout(sb.from('waitlist').insert(base),12000);  /* RUN_ME_2.sql not applied yet: save without attribution */
        return r}).then(function(r){
        if(!missing(r))return done('waitlist',r);
        return withTimeout(sb.from('newsletter_signups').insert({email:email,source:'waitlist'+(aff?':'+aff:'')}),12000).then(function(r2){return done('newsletter_signups',r2)})
      }).catch(function(e){throw fail('waitlist',e)})},
    progress:function(id,p){if(!SMU.user)return Promise.resolve();return q('progress',sb.from('watch_progress').upsert({user_id:SMU.user.id,item_id:id,progress:Math.round(p*1000)/1000,updated_at:new Date().toISOString()}))},
    pullProgress:function(){if(!SMU.user)return Promise.resolve(null);return q('progress',sb.from('watch_progress').select('item_id,progress,updated_at').eq('user_id',SMU.user.id).order('updated_at',{ascending:false}).limit(24))
      .then(function(rows){return (rows||[]).map(function(r){return {id:r.item_id,p:r.progress,t:Date.parse(r.updated_at)}})})},
    saved:function(){return SMU.user?savedCache:demo.saved()},
    fetchSaved:function(){return q('saved',sb.from('saved_athletes').select('athlete_id,created_at').eq('user_id',SMU.user.id).order('created_at',{ascending:false})).then(function(r){savedCache=(r||[]).map(function(x){return x.athlete_id});emit('saved',savedCache);return savedCache})},
    toggleSave:function(id){if(!SMU.user)return Promise.reject(new Error('Sign in to save athletes.'));var has=savedCache.indexOf(id)>=0;
      var op=has?sb.from('saved_athletes').delete().eq('user_id',SMU.user.id).eq('athlete_id',id):sb.from('saved_athletes').insert({user_id:SMU.user.id,athlete_id:id});
      return q('saved',op).then(function(){if(has)savedCache=savedCache.filter(function(x){return x!==id});else savedCache.unshift(id);emit('saved',savedCache);return savedCache})},
    loadThreads:function(){return q('threads',sb.from('threads').select(threadSel()).order('last_post_at',{ascending:false}).limit(200)).then(function(rows){
      MP.THREADS=(rows||[]).map(toThread);recFilter();if(MP.cleanBoards)MP.cleanBoards();fillUsers();
      /* Members-only posts aren't readable signed out, so their reply counts stay hidden. Once supabase/PROPOSED_8_board_counts.sql
         has run, set THREAD_STATS to true and the real totals come from the thread_stats view (kept off until then to avoid a 404). */
      if(!THREAD_STATS||!MP.THREADS.some(function(t){return t.replies==null}))return;
      return sb.from('thread_stats').select('thread_id,posts').then(function(r){if(r&&!r.error&&r.data){var m={};r.data.forEach(function(x){m[x.thread_id]=x.posts});
        MP.THREADS.forEach(function(t){if(t.replies==null&&m[t.id]!=null)t.replies=Math.max(0,m[t.id]-1)})}},function(){})}).then(function(){emit('threads');return MP.THREADS})},
    loadThread:function(id){return q('thread',sb.from('threads').select(threadSel()).eq('id',id).maybeSingle()).then(function(r){if(!r||(recOff()&&r.forum_id==='recruiting'))return null;var t=toThread(r);
      MP.THREADS=MP.THREADS.filter(function(x){return x.id!==id});MP.THREADS.unshift(t);if(MP.cleanBoards){MP.cleanBoards();if(MP.THREADS.indexOf(t)<0)return null}
      sb.rpc('bump_thread_view',{tid:id}).then(function(){},function(){});return t})},
    createThread:function(o){if(!SMU.user)return Promise.reject(new Error('Sign in to start a thread.'));
      var up=mediaLive()&&o.media&&o.media.length?mediaUpload(o.media):Promise.resolve(null);
      return up.then(function(md){return q('newthread',sb.rpc('create_thread',{p_forum:o.f,p_sport:o.sport||null,p_title:o.title,p_body:o.body})).then(function(id){
        if(!md)return id;return live.loadThread(+id).then(function(t){var pid=t&&t.posts[0]&&t.posts[0][4];if(pid==null)return id;
          return q('media',sb.rpc('set_post_media',{p_post:pid,p_media:md})).then(function(){return id},function(){return id})})})}).then(function(id){return live.loadThread(+id)}).then(function(t){emit('threads');return t})},
    reply:function(tid,body,quote,media){if(!SMU.user)return Promise.reject(new Error('Sign in to reply.'));
      var t=MP.THREADS.filter(function(x){return x.id===tid})[0],qid=quote!=null&&t&&t.posts[quote]?t.posts[quote][4]:null,md=null;
      return (mediaLive()&&media&&media.length?mediaUpload(media):Promise.resolve(null)).then(function(m){md=m;var row={thread_id:tid,author_id:SMU.user.id,body:body,quote_post_id:qid};if(md)row.media=md;
        return q('reply',sb.from('posts').insert(row).select('id,created_at').single())}).then(function(r){
        var p=['u:'+SMU.user.id,body,quote==null?null:quote,r.created_at,r.id];if(md)p[5]=md;if(t&&!t.posts.some(function(x){return x[4]===r.id})){t.posts.push(p);t.replies++}emit('post:'+tid,p);return p})},
    watch:function(tid){var ch=sb.channel('thread-'+tid).on('postgres_changes',{event:'INSERT',schema:'public',table:'posts',filter:'thread_id=eq.'+tid},function(){
        live.loadThread(tid).then(function(t){emit('post:'+tid,t)})}).subscribe();
      return function(){try{sb.removeChannel(ch)}catch(e){}}}
  };
  function setSession(s){var u=s&&s.user;if(!u||!SMU.user||SMU.user.id!==u.id)stCache=null;SMU.user=u?{id:u.id,email:u.email,name:(u.user_metadata&&u.user_metadata.display_name)||nameFromEmail(u.email),confirmed:!!u.email_confirmed_at||!!u.confirmed_at,created:u.created_at||null,adfree:u.user_metadata&&typeof u.user_metadata.adfree==='boolean'?u.user_metadata.adfree:null,pw:!u.app_metadata||!u.app_metadata.providers||u.app_metadata.providers.indexOf('email')>=0}:null;
    if(SMU.user&&myAv.id===SMU.user.id)SMU.user.avatar=myAv.url;  /* token refreshes rebuild the user object; keep the photo */
    if(SMU.user)ensureUser('u:'+SMU.user.id,SMU.user.name,tierCache)}

  /* ---------- Post reports ----------
     REPORTS is on (PROPOSED_12_post_reports.sql applied Oct. 26). In demo mode, or if it is turned off, a report is kept in
     this browser (localStorage mp_reports). Once on, signed-in members send it to public.post_reports; if that table is missing or
     unreachable, the report falls back to this browser instead of failing. Reports are never readable from the site. */
  var REPORTS=true, REASONS=['harassment','recruit_minor','doxxing','spam','other'];
  function reportKey(o){return o.thread+':'+o.post}
  function reportLocal(o,where){var list=lj('mp_reports',[]),k=reportKey(o),me=SMU.user&&SMU.user.id;
    if(list.some(function(r){return r.key===k&&r.by===me}))return {dup:true,where:where};
    list.push({key:k,thread:o.thread,post:o.post,postId:o.postId||null,reason:o.reason,note:o.note||'',by:me,at:new Date().toISOString()});sj('mp_reports',list.slice(-200));return {dup:false,where:where}}
  SMU.REPORT_REASONS=REASONS;
  SMU.reported=function(thread,post){var k=thread+':'+post,me=SMU.user&&SMU.user.id;return lj('mp_reports',[]).some(function(r){return r.key===k&&r.by===me})};
  SMU.report=function(o){if(!SMU.user)return Promise.reject(new Error('Sign in to report a post.'));
    if(REASONS.indexOf(o.reason)<0)return Promise.reject(new Error('Pick a reason.'));
    if(SMU.reported(o.thread,o.post))return Promise.resolve({dup:true,where:'browser'});
    if(!SMU.live||!REPORTS||!o.postId||!sb)return Promise.resolve(reportLocal(o,'browser'));
    return withTimeout(Promise.resolve(sb.from('post_reports').insert({post_id:o.postId,reason:o.reason,note:o.note||null})),12000).then(function(r){
      if(r&&r.error){if(r.error.code==='23505'){reportLocal(o,'server');return {dup:true,where:'server'}}
        console.warn('[SMU+] reports table unavailable, keeping the report in this browser',r.error);return reportLocal(o,'browser')}
      reportLocal(o,'server');return {dup:false,where:'server'}},function(e){console.warn('[SMU+] report not sent, kept in this browser',e);return reportLocal(o,'browser')})};

  /* ---------- Post likes (supabase/RUN_ME_20_post_likes.sql) ----------
     Demo mode: kept in this browser (localStorage mp_likes), only the demo account's own likes.
     Live: public.post_likes, with the liker's display name for "Liked by". If the table is missing (RUN_ME_20 not run yet)
     or unreachable, likes fall back to this browser instead of failing. Nothing is ever seeded: counts are real likes only. */
  var LIKES=true,likesOff=false;
  function likeKey(t,i){return t.id+':'+i}
  function likesLocal(t){var all=lj('mp_likes',{}),out={},me=SMU.user?'me':null,nm=SMU.user&&(SMU.user.name||'You');
    t.posts.forEach(function(p,i){var on=me&&all[likeKey(t,i)];if(on)out[i]={names:[nm],mine:true}});return out}
  function likesMissing(r){var e=r&&r.error;return !!e&&(e.code==='PGRST205'||e.code==='42P01'||r.status===404||/does not exist|schema cache/i.test(e.message||''))}
  function likesLive(){return SMU.live&&LIKES&&!likesOff&&!!sb}
  SMU.likes=function(t){if(!t||!t.posts)return Promise.resolve({});
    var ids=t.posts.map(function(p){return p[4]}).filter(function(x){return x!=null});
    if(!likesLive()||!ids.length)return Promise.resolve(likesLocal(t));
    return withTimeout(Promise.resolve(sb.from('post_likes').select('post_id,user_id,profiles(display_name)').in('post_id',ids).order('created_at')),12000).then(function(r){
      if(r&&r.error){if(likesMissing(r))likesOff=true;return likesLocal(t)}
      var at={},out={};t.posts.forEach(function(p,i){if(p[4]!=null)at[p[4]]=i});
      (r.data||[]).forEach(function(x){var i=at[x.post_id];if(i==null)return;var o=out[i]=out[i]||{names:[],mine:false};
        var mine=SMU.user&&x.user_id===SMU.user.id;if(mine){o.mine=true;o.names.unshift(SMU.user.name||'You')}else o.names.push((x.profiles&&x.profiles.display_name)||'Member')});
      return out},function(){return likesLocal(t)})};
  SMU.toggleLike=function(t,i,on){if(!SMU.user)return Promise.reject(new Error('Sign in to like a post.'));var p=t.posts[i];if(!p)return Promise.reject(new Error('Post not found.'));
    function local(){var all=lj('mp_likes',{}),k=likeKey(t,i);if(on)all[k]=1;else delete all[k];sj('mp_likes',all);return on}
    if(!likesLive()||p[4]==null)return Promise.resolve(local());
    var op=on?sb.from('post_likes').insert({post_id:p[4]}):sb.from('post_likes').delete().eq('post_id',p[4]).eq('user_id',SMU.user.id);
    return withTimeout(Promise.resolve(op),12000).then(function(r){if(r&&r.error){if(likesMissing(r)){likesOff=true;return local()}if(r.error.code==='23505')return on;throw fail('like',r.error)}return on})};

  /* ---------- Thread follows + reply notifications (supabase/PROPOSAL_boards_follows.sql) ----------
     FOLLOWS stays false until that SQL is applied, so the site never asks Supabase for a table or function that isn't there (no 404s).
     While off, in demo mode, or if the server call fails, follows are kept in this browser per account (localStorage mp_follows:
     {account:{threadId:[postsSeen,followedAt]}}) and unread counts come from the threads this page has loaded. In-app only, no email. */
  var FOLLOWS=true,followsOff=false,folCache=null,folNotes=[];
  function folLive(){return SMU.live&&!!sb&&!!SMU.user&&!followsOff&&(FOLLOWS||!!(MP.FEATURES&&MP.FEATURES.follows===true))}
  function folKey(){return SMU.user?(SMU.live?'u:'+SMU.user.id:'me'):null}
  function folAll(){var a=lj('mp_follows',{});return a&&typeof a==='object'?a:{}}
  function folMine(){var k=folKey();return k?(folAll()[k]||{}):{}}
  function folSave(m){var k=folKey();if(!k)return;var a=folAll();a[k]=m;sj('mp_follows',a)}
  function folThread(id){return (MP.THREADS||[]).filter(function(t){return String(t.id)===String(id)})[0]||null}
  function folBad(r){var e=r&&r.error;if(!e)return false;if(likesMissing(r)||e.code==='PGRST202'||e.code==='42883')followsOff=true;return true}
  function folLocalNotes(){var m=folMine(),me=meKey(),out=[];Object.keys(m).forEach(function(id){var t=folThread(id);if(!t||t.locked)return;
    var seen=+((m[id]||[])[0])||0,np=t.posts.slice(seen).filter(function(p){return p[0]!==me});
    if(np.length)out.push({thread:t.id,title:t.title,unread:np.length,post:seen+1,at:np[np.length-1][3]||null})});
    return out.sort(function(a,b){return (b.at||'')<(a.at||'')?-1:1}).slice(0,20)}
  function folEmit(){emit('follows',{ids:SMU.followed(),notes:folNotes})}
  SMU.followsOn=function(){return !!SMU.user};
  SMU.followsServer=folLive;
  SMU.followed=function(){if(!SMU.user)return [];if(folLive()&&folCache)return folCache.slice();return Object.keys(folMine()).map(Number)};
  SMU.isFollowing=function(id){return SMU.followed().indexOf(+id)>=0};
  /* Load this account's follows from the server (no-op locally). Never throws. */
  SMU.loadFollows=function(){if(!folLive()){folCache=null;return Promise.resolve(SMU.followed())}
    return withTimeout(Promise.resolve(sb.from('thread_follows').select('thread_id').eq('user_id',SMU.user.id).limit(500)),12000).then(function(r){
      if(folBad(r))return SMU.followed();folCache=(r.data||[]).map(function(x){return +x.thread_id});return folCache.slice()},function(){return SMU.followed()})};
  SMU.toggleFollow=function(t,on){if(!SMU.user)return Promise.reject(new Error('Sign in to follow threads.'));if(!t)return Promise.reject(new Error('Thread not found.'));
    function local(){var m=folMine();if(on)m[t.id]=[(t.posts||[]).length,Date.now()];else delete m[t.id];folSave(m);return on}
    function done(v){if(!on)folNotes=folNotes.filter(function(n){return n.thread!==t.id});folEmit();return v}
    if(!folLive()||!t.live)return Promise.resolve(done(local()));
    var op=on?sb.from('thread_follows').insert({thread_id:t.id}):sb.from('thread_follows').delete().eq('user_id',SMU.user.id).eq('thread_id',t.id);
    return withTimeout(Promise.resolve(op),12000).then(function(r){
      if(r&&r.error&&r.error.code!=='23505'){if(folBad(r)&&followsOff){folCache=null;return done(local())}throw fail('follow',r.error)}
      folCache=folCache||[];folCache=folCache.filter(function(x){return x!==t.id});if(on)folCache.unshift(t.id);return done(on)})};
  /* New replies on followed threads: [{thread,title,unread,post,at}], newest first. Never throws; empty when signed out. */
  SMU.followNotes=function(){if(!SMU.user){folNotes=[];return Promise.resolve([])}
    if(!folLive()){folNotes=folLocalNotes();folEmit();return Promise.resolve(folNotes)}
    return withTimeout(Promise.resolve(sb.rpc('follow_notifications',{p_limit:20})),12000).then(function(r){
      if(folBad(r)){folNotes=folLocalNotes()}else folNotes=(r.data||[]).map(function(x){var t=folThread(x.thread_id),i=-1;
        if(t)t.posts.forEach(function(p,j){if(i<0&&p[4]===x.first_unread_post_id)i=j});
        return {thread:+x.thread_id,title:x.title,unread:x.unread,post:i>=0?i+1:null,at:x.last_post_at}});
      folEmit();return folNotes},function(){folNotes=folLocalNotes();folEmit();return folNotes})};
  /* Mark one followed thread read (opening it), or all of them (null). Never throws. */
  SMU.followRead=function(t){if(!SMU.user)return Promise.resolve();var m=folMine(),ch=false;
    (t?[t]:Object.keys(m).map(folThread).filter(Boolean)).forEach(function(x){if(m[x.id]&&m[x.id][0]!==x.posts.length){m[x.id][0]=x.posts.length;ch=true}});if(ch)folSave(m);
    var had=folNotes.length;folNotes=t?folNotes.filter(function(n){return n.thread!==t.id}):[];if(had!==folNotes.length||ch)folEmit();
    if(!folLive()||(t&&!SMU.isFollowing(t.id)))return Promise.resolve();
    return withTimeout(Promise.resolve(sb.rpc('follow_mark_read',{p_thread:t?t.id:null})),12000).then(function(r){folBad(r)},function(){})};
  on('auth',function(){folCache=null;folNotes=[];SMU.loadFollows().then(function(){return SMU.followNotes()})});

  /* ---------- Photos on posts (supabase/PROPOSAL_boards_media.sql) ----------
     MEDIA stays false until that SQL is applied, so the live site never asks for the board-media bucket or the posts.media column
     (no 404s or 400s) and the photo button stays hidden there. Demo mode (or Supabase unreachable): photos are a local preview kept
     in this browser with the demo post (data: URLs, already resized and re-encoded by app.js). A post's media is [{u,w,h,t}], up to 4.
     Only our own bucket's public URLs (live) or data:image URLs (demo) are ever shown. */
  var MEDIA=false,MEDIA_MAX=4,MEDIA_TYPES=['image/jpeg','image/png','image/webp','image/gif'],MEDIA_BYTES=5*1024*1024;
  var MEDIA_LIVE=new RegExp('^'+String(CFG.SUPABASE_URL||'').replace(/[.*+?^${}()|[\]\\\/]/g,'\\$&')+'/storage/v1/object/public/board-media/[0-9a-f-]{36}/[A-Za-z0-9._-]{1,100}$');
  function mediaLive(){return SMU.live&&!!sb&&(MEDIA||!!(MP.FEATURES&&MP.FEATURES.media===true))}
  function mediaURLok(u){if(typeof u!=='string')return false;
    return MEDIA_LIVE.test(u)&&!!configured||(!SMU.live&&/^data:image\/(jpeg|png|webp|gif);base64,[A-Za-z0-9+\/=]+$/.test(u)&&u.length<7500000)}
  function mediaClean(a){if(!Array.isArray(a))return null;var out=a.slice(0,MEDIA_MAX).filter(function(x){return x&&mediaURLok(x.u)&&+x.w>0&&+x.h>0}).map(function(x){
      return {u:x.u,w:Math.min(10000,Math.round(+x.w)),h:Math.min(10000,Math.round(+x.h)),t:MEDIA_TYPES.indexOf(x.t)>=0?x.t:'image/jpeg'}});return out.length?out:null}
  function mediaDemo(m){return m&&m.length?mediaClean(m.map(function(x){return {u:x.data,w:x.w,h:x.h,t:x.t}})):null}
  /* demo: localStorage holds about 5 MB per site; if the photos don't fit, the post is still saved without them and they show until reload */
  function mediaSave(L,has){var v=JSON.stringify(L);try{localStorage.setItem('mp_posts',v);return}catch(e){}
    if(!has)return;var lite=JSON.parse(v);lite.threads.forEach(function(t){t.posts.forEach(function(p){if(p[5])p.length=5})});
    Object.keys(lite.replies).forEach(function(k){lite.replies[k].forEach(function(p){if(p[5])p.length=5})});
    try{localStorage.setItem('mp_posts',JSON.stringify(lite))}catch(e){}emit('media:full')}
  function mediaUpload(items){var id=SMU.user.id,st=sb.storage.from('board-media');
    return Promise.all(items.slice(0,MEDIA_MAX).map(function(x,i){var ext=x.t==='image/gif'?'gif':x.t==='image/png'?'png':x.t==='image/webp'?'webp':'jpg';
      var path=id+'/'+Date.now().toString(36)+'-'+i+'-'+Math.random().toString(36).slice(2,8)+'.'+ext;
      return q('media',st.upload(path,x.blob,{contentType:x.t,cacheControl:'31536000',upsert:false})).then(function(){return {u:st.getPublicUrl(path).data.publicUrl,w:x.w,h:x.h,t:x.t}})}))
      .then(function(m){return mediaClean(m)})}
  SMU.mediaOn=function(){return !!SMU.user&&(!SMU.live||mediaLive())};
  SMU.mediaLocal=function(){return !SMU.live};
  SMU.mediaOf=function(p){return p&&p[5]?mediaClean(p[5]):null};
  SMU.MEDIA={max:MEDIA_MAX,types:MEDIA_TYPES,bytes:MEDIA_BYTES};

  /* ---------- public API: pick the backend at call time ---------- */
  function B(){return SMU.live?live:demo}
  ['signUp','signIn','oauth','signOut','updateName','setTier','brief','unbrief','waitlist','progress','pullProgress','toggleSave','loadThreads','boardStats','loadThread','createThread','reply','watch','setAvatar','removeAvatar','studentJoin','claimStudent'].forEach(function(k){
    SMU[k]=function(){var b=B();return b[k].apply(b,arguments)}});
  /* Game threads (RUN_ME_24): the thread for a game page, created with a staff opening post on first visit. Live database only. */
  SMU.gameThread=function(g){return SMU.live?q('gamethread',SMU.client.rpc('game_thread',{p_game:String(g).slice(0,40)})).then(function(id){return id==null?null:+id}):Promise.resolve(null)};
  SMU.reset=function(e){return SMU.live?live.reset(e):Promise.reject(new Error('Password reset needs the live database. In demo mode, just sign in with your email.'))};
  SMU.changePassword=function(c,p){return SMU.live?live.changePassword(c,p):Promise.reject(new Error('Passwords are only used with the live database. Demo accounts don\u2019t have one.'))};
  SMU.newPassword=function(p){return SMU.live?live.newPassword(p):Promise.reject(new Error('Not available in demo mode.'))};
  SMU.tier=function(){return B().tier()};
  SMU.saved=function(){return B().saved()};
  SMU.me=meKey;SMU.authCaps=function(){return SMU.live?caps:{signup:true,email:true,oauth:[]}};SMU.studentsOn=stOn;SMU.student=function(){return B().student()};SMU.studentMsg=function(){return stMsg};SMU.isSmuEmail=function(e){return SMU_EMAIL.test(String(e||'').trim())};SMU.studentYears=stYears;SMU.paidTier=paid;SMU.avatarsOn=avOn;SMU.avatarOK=avOK;SMU.avatarCheck=avCheck;
  realCounts();applyBoards(countBoards());  /* replace the sample totals and per-thread counts before anything renders */
  SMU.ready=(configured?live.init():demo.init()).then(function(){emit('ready',SMU.mode);return SMU.mode});
  if(typeof window!=='undefined'){window.addEventListener('offline',function(){emit('net',false)});window.addEventListener('online',function(){emit('net',true)})}
})();
