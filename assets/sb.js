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
  var TIERS={free:'Free',mustang:'Mustang',pony:'Pony Express',club:'Boulevard Club'};
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
  window.SMU=SMU;
  var sb=null;

  /* ---------- users shown on the boards ---------- */
  function ensureUser(id,name,tier,since){MP.USERS=MP.USERS||{};
    if(!MP.USERS[id])MP.USERS[id]={n:name||'Member',tier:TIERS[tier]||'Member',since:since||String(new Date().getFullYear()),posts:'',real:true};
    else if(name)MP.USERS[id].n=name;return id}
  /* every author on the boards needs a USERS entry (e.g. posts written in this browser before signing out) */
  function fillUsers(){(MP.THREADS||[]).forEach(function(t){[t.by].concat((t.posts||[]).map(function(p){return p[0]})).forEach(function(id){
    if(id&&!(MP.USERS&&MP.USERS[id]))ensureUser(id,id==='me'?(ls('mp_lastname')||'Demo member'):'Member')})})}
  function meKey(){return SMU.user?(SMU.live?'u:'+SMU.user.id:'me'):null}

  /* ================= DEMO backend (localStorage) ================= */
  var demo={
    init:function(){var u=lj('mp_user',null);SMU.user=u;if(u)ensureUser('me',u.name,demo.tier(),String(new Date(u.since||Date.now()).getFullYear()));demo.mergeThreads();fillUsers();return Promise.resolve()},
    signUp:function(o){var u={id:uid(),email:String(o.email).trim().toLowerCase(),name:(o.name||'').trim()||nameFromEmail(o.email),since:Date.now()};
      sj('mp_user',u);ls('mp_lastname',u.name);SMU.user=u;ensureUser('me',u.name,demo.tier());MP.USERS.me.n=u.name;emit('auth',u);return Promise.resolve({user:u,confirm:false})},
    signIn:function(o){var u=lj('mp_user',null),em=String(o.email).trim().toLowerCase();
      if(!u||u.email!==em){u={id:uid(),email:em,name:nameFromEmail(em),since:Date.now()};sj('mp_user',u)}
      SMU.user=u;ensureUser('me',u.name,demo.tier());emit('auth',u);return Promise.resolve({user:u})},
    magic:function(email){return demo.signIn({email:email}).then(function(r){r.instant=true;return r})},
    signOut:function(){ls('mp_user',null);SMU.user=null;emit('auth',null);return Promise.resolve()},
    updateName:function(n){var u=lj('mp_user',null);if(!u)return Promise.reject(new Error('Not signed in'));u.name=n;sj('mp_user',u);ls('mp_lastname',n);SMU.user=u;MP.USERS.me&&(MP.USERS.me.n=n);emit('auth',u);return Promise.resolve(u)},
    tier:function(){var t=ls('mp_tier');return TIERS[t]?t:(ls('mp_member')==='1'?'pony':'free')},
    setTier:function(t){ls('mp_tier',t);ls('mp_member',t!=='free'?'1':'0');emit('tier',t);return Promise.resolve(t)},
    brief:function(email){ls('mp_brief',email);return Promise.resolve({ok:true})},
    unbrief:function(){ls('mp_brief',null);return Promise.resolve()},
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
    loadThread:function(id){return Promise.resolve(MP.THREADS.filter(function(t){return t.id===id})[0]||null)},
    createThread:function(o){if(!SMU.user)return Promise.reject(new Error('Sign in to start a thread.'));
      var L=demo.local(),id=Math.max.apply(null,MP.THREADS.map(function(t){return t.id}).concat([100]))+1,now=new Date().toISOString();
      var t={id:id,f:o.f,sport:o.sport||null,title:o.title,by:'me',ago:'1m',replies:0,views:'1',mine:true,posts:[['me',o.body,null,now]]};
      L.threads.unshift(t);sj('mp_posts',L);MP.THREADS.unshift(t);emit('threads');return Promise.resolve(t)},
    reply:function(tid,body,quote){if(!SMU.user)return Promise.reject(new Error('Sign in to reply.'));
      var L=demo.local(),p=['me',body,quote==null?null:quote,new Date().toISOString()];(L.replies[tid]=L.replies[tid]||[]).push(p);sj('mp_posts',L);
      var t=MP.THREADS.filter(function(x){return x.id===tid})[0];if(t){t.posts.push(p);t.replies++}emit('post:'+tid,p);return Promise.resolve(p)},
    watch:function(){return function(){}}
  };

  /* ================= LIVE backend (Supabase) ================= */
  function loadScript(src,sri){return new Promise(function(res,rej){if(window.supabase&&window.supabase.createClient)return res();
    var s=document.createElement('script');s.src=src;if(sri){s.integrity=sri;s.crossOrigin='anonymous'}s.async=true;
    s.onload=function(){window.supabase&&window.supabase.createClient?res():rej(new Error('supabase-js did not load'))};s.onerror=function(){rej(new Error('Could not load supabase-js from the CDN'))};
    document.head.appendChild(s)})}
  var tierCache='free',savedCache=[];
  function toThread(r){
    var by=r.author_handle||ensureUser('u:'+r.author_id,r.author&&r.author.display_name);
    var posts=(r.posts||[]).slice().sort(function(a,b){return a.created_at<b.created_at?-1:1});
    var idx={};posts.forEach(function(p,i){idx[p.id]=i});
    var P=posts.map(function(p){var u=p.author_handle||ensureUser('u:'+p.author_id,p.author&&p.author.display_name);
      return [u,p.body,p.quote_post_id!=null&&idx[p.quote_post_id]!=null?idx[p.quote_post_id]:null,p.created_at,p.id]});
    return {id:r.id,f:r.forum_id,sport:r.sport,title:r.title,by:by,ago:ago(r.created_at),replies:Math.max(r.reply_count||0,Math.max(0,P.length-1)),views:kfmt(r.view_count),
      pin:!!r.pinned,hot:!!r.hot,posts:P.length?P:[[by,'',null,r.created_at]],locked:!P.length,live:true,mine:SMU.user&&r.author_id===SMU.user.id}}
  var THREAD_SEL='id,forum_id,sport,title,pinned,hot,reply_count,view_count,created_at,last_post_at,author_handle,author_id,author:profiles!threads_author_id_fkey(display_name),'+
    'posts(id,author_handle,author_id,body,quote_post_id,created_at,author:profiles!posts_author_id_fkey(display_name))';
  var live={
    init:function(){
      return loadScript(SUPA_SRC,SUPA_SRI).then(function(){
        sb=window.supabase.createClient(CFG.SUPABASE_URL,CFG.SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,flowType:'pkce'}});
        SMU.client=sb;SMU.live=true;SMU.mode='live';SMU.reason='ok';
        sb.auth.onAuthStateChange(function(ev,session){var was=SMU.user&&SMU.user.id;setSession(session);
          if((SMU.user&&SMU.user.id)!==was){emit('auth',SMU.user);if(SMU.user)live.afterSignIn()}});
        return q('session',sb.auth.getSession()).then(function(d){setSession(d&&d.session);if(SMU.user)return live.afterSignIn()})
      }).then(function(){return live.loadForums()}).catch(function(e){
        /* Never break the site: fall back to demo mode if Supabase can't be reached */
        SMU.live=false;SMU.mode='demo';SMU.reason='unreachable';sb=null;console.warn('[SMU+] Live backend unavailable, using demo mode.',e);
        emit('error',fail('connect',e));return demo.init()})},
    afterSignIn:function(){return Promise.all([live.fetchTier(),live.fetchSaved(),live.ensureProfileName()]).catch(function(){})},
    ensureProfileName:function(){var u=SMU.user;if(!u)return;ensureUser('u:'+u.id,u.name,tierCache)},
    loadForums:function(){return q('forums',sb.from('forums').select('id,name,description,premium,grp,sort').order('sort')).then(function(rows){
      if(rows&&rows.length)MP.FORUMS=rows.map(function(f){var old=(MP.FORUMS||[]).filter(function(x){return x.id===f.id})[0]||{};
        return {id:f.id,name:f.name,desc:f.description,prem:f.premium,group:f.grp,threads:old.threads||0,posts:old.posts||0}})}).catch(function(){})},
    signUp:function(o){return q('signup',sb.auth.signUp({email:o.email,password:o.password,options:{data:{display_name:o.name||nameFromEmail(o.email)},emailRedirectTo:CFG.SITE_URL+'account/'}}))
      .then(function(d){return {user:d.user,confirm:!d.session}})},
    signIn:function(o){return q('signin',sb.auth.signInWithPassword({email:o.email,password:o.password})).then(function(d){return {user:d.user}})},
    magic:function(email){return q('magic',sb.auth.signInWithOtp({email:email,options:{emailRedirectTo:CFG.SITE_URL+'account/'}})).then(function(){return {sent:true}})},
    reset:function(email){return q('reset',sb.auth.resetPasswordForEmail(email,{redirectTo:CFG.SITE_URL+'account/#reset'})).then(function(){return {sent:true}})},
    newPassword:function(pw){return q('password',sb.auth.updateUser({password:pw}))},
    signOut:function(){return q('signout',sb.auth.signOut()).then(function(){setSession(null);emit('auth',null)})},
    updateName:function(n){return q('profile',sb.from('profiles').update({display_name:n}).eq('id',SMU.user.id)).then(function(){SMU.user.name=n;ensureUser('u:'+SMU.user.id,n);MP.USERS['u:'+SMU.user.id].n=n;emit('auth',SMU.user);return SMU.user})},
    tier:function(){return SMU.user?tierCache:demo.tier()},
    fetchTier:function(){return q('tier',sb.from('memberships').select('tier').eq('user_id',SMU.user.id).maybeSingle()).then(function(r){tierCache=(r&&r.tier)||'free';ls('mp_member',tierCache!=='free'?'1':'0');ls('mp_tier',tierCache);emit('tier',tierCache);return tierCache})},
    setTier:function(t){if(!SMU.user)return demo.setTier(t);
      return q('tier',sb.from('memberships').upsert({user_id:SMU.user.id,tier:t,status:'demo',updated_at:new Date().toISOString()})).then(function(){tierCache=t;ls('mp_tier',t);ls('mp_member',t!=='free'?'1':'0');emit('tier',t);return t})},
    brief:function(email){var row={email:String(email).trim().toLowerCase(),source:'site'};if(SMU.user)row.user_id=SMU.user.id;
      return withTimeout(sb.from('newsletter_signups').insert(row),12000).then(function(r){if(r.error&&r.error.code!=='23505')throw r.error;ls('mp_brief',row.email);return {ok:true,dupe:!!r.error}}).catch(function(e){throw fail('brief',e)})},
    unbrief:function(){ls('mp_brief',null);return Promise.resolve()},
    progress:function(id,p){if(!SMU.user)return Promise.resolve();return q('progress',sb.from('watch_progress').upsert({user_id:SMU.user.id,item_id:id,progress:Math.round(p*1000)/1000,updated_at:new Date().toISOString()}))},
    pullProgress:function(){if(!SMU.user)return Promise.resolve(null);return q('progress',sb.from('watch_progress').select('item_id,progress,updated_at').eq('user_id',SMU.user.id).order('updated_at',{ascending:false}).limit(24))
      .then(function(rows){return (rows||[]).map(function(r){return {id:r.item_id,p:r.progress,t:Date.parse(r.updated_at)}})})},
    saved:function(){return SMU.user?savedCache:demo.saved()},
    fetchSaved:function(){return q('saved',sb.from('saved_athletes').select('athlete_id,created_at').eq('user_id',SMU.user.id).order('created_at',{ascending:false})).then(function(r){savedCache=(r||[]).map(function(x){return x.athlete_id});emit('saved',savedCache);return savedCache})},
    toggleSave:function(id){if(!SMU.user)return Promise.reject(new Error('Sign in to save athletes.'));var has=savedCache.indexOf(id)>=0;
      var op=has?sb.from('saved_athletes').delete().eq('user_id',SMU.user.id).eq('athlete_id',id):sb.from('saved_athletes').insert({user_id:SMU.user.id,athlete_id:id});
      return q('saved',op).then(function(){if(has)savedCache=savedCache.filter(function(x){return x!==id});else savedCache.unshift(id);emit('saved',savedCache);return savedCache})},
    loadThreads:function(){return q('threads',sb.from('threads').select(THREAD_SEL).order('last_post_at',{ascending:false}).limit(200)).then(function(rows){
      MP.THREADS=(rows||[]).map(toThread);fillUsers();emit('threads');return MP.THREADS})},
    loadThread:function(id){return q('thread',sb.from('threads').select(THREAD_SEL).eq('id',id).maybeSingle()).then(function(r){if(!r)return null;var t=toThread(r);
      MP.THREADS=MP.THREADS.filter(function(x){return x.id!==id});MP.THREADS.unshift(t);
      sb.rpc('bump_thread_view',{tid:id}).then(function(){},function(){});return t})},
    createThread:function(o){if(!SMU.user)return Promise.reject(new Error('Sign in to start a thread.'));
      return q('newthread',sb.rpc('create_thread',{p_forum:o.f,p_sport:o.sport||null,p_title:o.title,p_body:o.body})).then(function(id){return live.loadThread(+id)}).then(function(t){emit('threads');return t})},
    reply:function(tid,body,quote){if(!SMU.user)return Promise.reject(new Error('Sign in to reply.'));
      var t=MP.THREADS.filter(function(x){return x.id===tid})[0],qid=quote!=null&&t&&t.posts[quote]?t.posts[quote][4]:null;
      return q('reply',sb.from('posts').insert({thread_id:tid,author_id:SMU.user.id,body:body,quote_post_id:qid}).select('id,created_at').single()).then(function(r){
        var p=['u:'+SMU.user.id,body,quote==null?null:quote,r.created_at,r.id];if(t&&!t.posts.some(function(x){return x[4]===r.id})){t.posts.push(p);t.replies++}emit('post:'+tid,p);return p})},
    watch:function(tid){var ch=sb.channel('thread-'+tid).on('postgres_changes',{event:'INSERT',schema:'public',table:'posts',filter:'thread_id=eq.'+tid},function(){
        live.loadThread(tid).then(function(t){emit('post:'+tid,t)})}).subscribe();
      return function(){try{sb.removeChannel(ch)}catch(e){}}}
  };
  function setSession(s){var u=s&&s.user;SMU.user=u?{id:u.id,email:u.email,name:(u.user_metadata&&u.user_metadata.display_name)||nameFromEmail(u.email),confirmed:!!u.email_confirmed_at||!!u.confirmed_at}:null;
    if(SMU.user)ensureUser('u:'+SMU.user.id,SMU.user.name,tierCache)}

  /* ---------- public API: pick the backend at call time ---------- */
  function B(){return SMU.live?live:demo}
  ['signUp','signIn','magic','signOut','updateName','setTier','brief','unbrief','progress','pullProgress','toggleSave','loadThreads','loadThread','createThread','reply','watch'].forEach(function(k){
    SMU[k]=function(){var b=B();return b[k].apply(b,arguments)}});
  SMU.reset=function(e){return SMU.live?live.reset(e):Promise.reject(new Error('Password reset needs the live database. In demo mode, just sign in with your email.'))};
  SMU.newPassword=function(p){return SMU.live?live.newPassword(p):Promise.reject(new Error('Not available in demo mode.'))};
  SMU.tier=function(){return B().tier()};
  SMU.saved=function(){return B().saved()};
  SMU.me=meKey;
  SMU.ready=(configured?live.init():demo.init()).then(function(){emit('ready',SMU.mode);return SMU.mode});
  if(typeof window!=='undefined'){window.addEventListener('offline',function(){emit('net',false)});window.addEventListener('online',function(){emit('net',true)})}
})();
