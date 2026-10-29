/* From Socials (Media > From Socials, /socials/): one timeline of public X posts from SMU-related accounts.
   Data: data/socials.json from tools/build_socials.py (which picks the posts, their order and the filters). Each post is X's own
   embed (blockquote.twitter-tweet, data-dnt), turned into a live embed by platform.twitter.com/widgets.js only as it nears the
   viewport. Until then, and if widgets.js cannot load, the blockquote is a text-only card: name, @handle, time, excerpt, View on X.
   No X images or bios are copied onto this site. The Following list uses initial circles, except writer and outlet accounts
   (Counsel, Oct 27): their X profile picture is hotlinked from pbs.twimg.com (URL from the latest X users read, "av" in
   socials.json) and links to the profile; a missing or broken picture leaves the initials. A post X no longer shows (deleted or
   withheld) has its card removed. Desktop (1024px+) also gets a rail: next games, videos and podcasts with two sample ads. */
(function(){
  var feed=document.getElementById('sxFeed');if(!feed)return;
  var ROOT=document.body.getAttribute('data-root')||'../',$=function(id){return document.getElementById(id)};
  var sel=$('sxShow'),count=$('sxCount'),clear=$('sxClear'),empty=$('sxEmpty'),aside=$('sxFollow'),flBtn=$('sxFollowBtn'),list=$('sxFollowList');
  var GL={official:'Official',teams:'Teams',writers:'Writers',athletes:'Athletes'},ORDER=['official','teams','writers','athletes'],D=null,F='';
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function ago(iso){var t=new Date(iso),s=(Date.now()-t)/1000;if(s<3600)return Math.max(1,Math.floor(s/60))+'m';if(s<86400)return Math.floor(s/3600)+'h';if(s<7*86400)return Math.floor(s/86400)+'d';
    return t.toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'America/Chicago'})}
  function full(iso){return new Date(iso).toLocaleString('en-US',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Chicago'})+' CT'}
  function ini(n){return esc(String(n).replace(/^SMU\s+/,'').replace(/[^A-Za-z0-9 ]/g,'').trim().charAt(0).toUpperCase()||'S')}
  function card(p){var u='https://x.com/'+esc(p.h)+'/status/'+p.id;
    return '<li class="sx-card'+(p.m?' sx-m':'')+'" data-g="'+p.g+'" data-h="'+esc(p.h)+'" data-id="'+p.id+'">'+
      '<blockquote class="sx-bq" data-dnt="true" data-conversation="none" data-width="550">'+
        '<p class="sx-by"><b>'+esc(p.n)+'</b> <span>@'+esc(p.h)+' \u00b7 <time datetime="'+p.t+'" title="'+full(p.t)+'">'+ago(p.t)+'</time> \u00b7 on X</span></p>'+
        (p.x?'<p class="sx-x">'+esc(p.x).replace(/\n+/g,'<br>')+'</p>':'')+
        '<a class="sx-view" href="'+u+'">View on X<span class="sr"> (post by '+esc(p.n)+(p.pw?', may link to a subscriber story':'')+')</span> <span aria-hidden="true">\u2197</span></a>'+
      '</blockquote></li>'}
  /* ---- widgets.js, loaded on first need; embeds built as cards come within ~1.5 screens ---- */
  var W=null,io=null,failed=false;
  function widgets(){if(W)return W;W=new Promise(function(ok,no){var s=document.createElement('script');s.src='https://platform.twitter.com/widgets.js';s.async=true;s.charset='utf-8';
    s.onload=function(){if(window.twttr&&twttr.ready)twttr.ready(function(t){ok(t)});else no()};s.onerror=no;document.head.appendChild(s)});
    W.catch(function(){failed=true;document.documentElement.classList.add('sx-noembed')});return W}
  /* the blockquote only gets X's class when its card nears the screen, so widgets.js (which scans the page on load) never builds all 150 at once */
  function embed(li){if(li.dataset.e)return;li.dataset.e='1';var q=li.querySelector('.sx-bq');if(q)q.classList.add('twitter-tweet');
    widgets().then(function(t){return t.widgets.load(li)}).then(function(){
      /* live once X's iframe has its real height; a post X will not show (deleted, withheld) never gets one, so after 12s its card goes */
      var k=0;(function poll(){var f=li.querySelector('iframe');
        if(f&&f.offsetHeight>60){li.classList.add('sx-live');return}
        if(++k<24)return setTimeout(poll,500);
        if(!failed){li.remove();tally()}})()},function(){})}
  function watch(){if(!('IntersectionObserver' in window)){[].forEach.call(feed.children,function(li){if(li.matches('.sx-card'))embed(li)});return}
    io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);embed(e.target)}})},{rootMargin:'1200px 0px'});
    [].forEach.call(feed.querySelectorAll('.sx-card'),function(li){io.observe(li)})}
  /* ---- filter: all, a group, or one account (select, Following list) ---- */
  function apply(v,fromList){F=v||'';sel.value=F;var n=0;
    [].forEach.call(feed.querySelectorAll('.sx-card'),function(li){var on=!F||(F.slice(0,2)==='g:'?li.dataset.g===F.slice(2):li.dataset.h===F.slice(2));li.hidden=!on;if(on)n++});
    [].forEach.call(feed.querySelectorAll('[data-ad-slot]'),function(a){a.hidden=!!F});
    [].forEach.call(list.querySelectorAll('[data-acct]'),function(b){b.setAttribute('aria-pressed',String(F==='h:'+b.dataset.acct))});
    count.textContent=n+(n===1?' post':' posts');clear.hidden=!F;empty.hidden=!!n;
    if(fromList){closeSheet();var top=$('sxBar').getBoundingClientRect().top+scrollY;if(scrollY>top)scrollTo({top:top,behavior:'instant'})}}
  function tally(){apply(F)}
  function followList(){var by={};D.accounts.forEach(function(a){(by[a.g]=by[a.g]||[]).push(a)});
    list.innerHTML=ORDER.filter(function(g){return by[g]}).map(function(g){return '<h3 class="sx-fg">'+GL[g]+'</h3><ul class="sx-fl'+(g==='writers'?' sx-fl-w':'')+'">'+by[g].map(function(a){
      var pic=a.av&&/^https:\/\/pbs\.twimg\.com\/profile_images\//.test(a.av)?a.av.replace('_normal.','_bigger.'):'';
      return '<li>'+(pic?'<a class="sx-xav" href="https://x.com/'+esc(a.h)+'" target="_blank" rel="noopener" aria-label="@'+esc(a.h)+' on X (opens X)"><span class="sx-ini" aria-hidden="true">'+ini(a.n)+'</span>'+
          '<img src="'+esc(pic)+'" alt="" width="32" height="32" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.remove()"></a>':
          '<span class="sx-xav" aria-hidden="true"><span class="sx-ini">'+ini(a.n)+'</span></span>')+
        '<button type="button" class="sx-acct" data-acct="'+esc(a.h)+'" aria-pressed="false"><span class="sx-an"><b>'+esc(a.n)+'</b><span>@'+esc(a.h)+'</span></span></button>'+
        '<a class="sx-prof" href="https://x.com/'+esc(a.h)+'" target="_blank" rel="noopener" aria-label="@'+esc(a.h)+' on X (opens X)"><span aria-hidden="true">\u2197</span></a></li>'}).join('')+'</ul>'}).join('');
    $('sxFlNote').hidden=!D.accounts.some(function(a){return a.av});
    flBtn.textContent='Following ('+D.accounts.length+')';flBtn.hidden=false}
  function options(){var gs=ORDER.filter(function(g){return D.posts.some(function(p){return p.g===g})});
    sel.innerHTML='<option value="">All posts</option><optgroup label="Groups">'+gs.map(function(g){return '<option value="g:'+g+'">'+GL[g]+'</option>'}).join('')+'</optgroup>'+
      '<optgroup label="Accounts">'+D.accounts.map(function(a){return '<option value="h:'+esc(a.h)+'">'+esc(a.n)+' (@'+esc(a.h)+')</option>'}).join('')+'</optgroup>'}
  /* phones and tablets (<1024px): the Following list opens as a sheet */
  var wide=matchMedia('(min-width:1024px)'),sheetInert=[];
  function openSheet(){if(wide.matches||aside.classList.contains('open'))return;
    for(var n=aside;n.parentNode&&n!==document.body;n=n.parentNode){[].forEach.call(n.parentNode.children,function(s){if(s!==n&&!s.hasAttribute('inert')){s.setAttribute('inert','');sheetInert.push(s)}})}
    aside.classList.add('open');flBtn.setAttribute('aria-expanded','true');document.documentElement.classList.add('noscroll');var b=$('sxFollowX');if(b)b.focus()}
  function closeSheet(){if(!aside.classList.contains('open'))return;sheetInert.forEach(function(n){n.removeAttribute('inert')});sheetInert=[];aside.classList.remove('open');flBtn.setAttribute('aria-expanded','false');document.documentElement.classList.remove('noscroll');flBtn.focus({preventScroll:true})}
  flBtn.addEventListener('click',openSheet);$('sxFollowX').addEventListener('click',closeSheet);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSheet();else if(e.key==='Tab'&&aside.classList.contains('open')){
    var a=[].filter.call(aside.querySelectorAll('a[href],button,input,select,textarea,[tabindex]'),function(n){return !n.disabled&&n.tabIndex>=0&&n.getClientRects().length}),i=a.indexOf(document.activeElement);
    if(i<0||(!e.shiftKey&&i===a.length-1)||(e.shiftKey&&i===0)){e.preventDefault();if(a.length)a[e.shiftKey?a.length-1:0].focus()}}});
  if(wide.addEventListener)wide.addEventListener('change',function(){if(wide.matches)closeSheet()});
  list.addEventListener('click',function(e){var b=e.target.closest('[data-acct]');if(!b)return;var v='h:'+b.dataset.acct;apply(F===v?'':v,true)});
  sel.addEventListener('change',function(){apply(sel.value)});clear.addEventListener('click',function(){apply('');sel.focus()});

  /* ---- desktop rail (1024px+): next 3 games (MP.UPCOMING, every sport), 3 newest Library videos, 3 newest podcast episodes.
     Same sources and links as the home ribbon and the Library. Built only when the rail can show, so phones fetch nothing extra. ---- */
  var MON=['Jan.','Feb.','March','April','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'],DOW=['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'];
  function ctDay(t){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(t||new Date())}catch(e){return new Date().toISOString().slice(0,10)}}
  function dLabel(d){var x=new Date(d+'T12:00:00Z');return DOW[x.getUTCDay()]+' '+MON[x.getUTCMonth()]+' '+x.getUTCDate()}
  function tc(t){return window.MP&&MP.tcase?MP.tcase(t):t}
  function games(){var el=$('sxGames');if(!el)return;var M=window.MP||{},U=(M.UPCOMING&&M.UPCOMING.events)||[],G={},t=ctDay(),now=Date.now();
    ((M.GAMES&&M.GAMES.games)||[]).forEach(function(g){G[g.id]=g});
    /* upcoming = starts today or later (CT); a game page game drops off 3 hours after its start time */
    var L=U.filter(function(e){if(e.d<t)return false;var g=e.game&&G[e.game];return !(g&&g.ko&&Date.parse(g.ko)+3*3600e3<now)&&!(g&&g.res)}).slice(0,3);
    if(!L.length){$('sxRgGames').hidden=true;return}
    el.innerHTML=L.map(function(e){var sp=(M.SPORTS||[]).filter(function(x){return x.slug===e.sport})[0],
        nm=(e.team&&e.team.indexOf('Cross')<0&&e.team.indexOf('Track')<0?e.team+' ':'')+(sp?sp.name:e.sport),g=e.game&&G[e.game],
        href=g?ROOT+'games/?id='+g.id:ROOT+'sports/'+e.sport+'/#schedule',vs=e.vs==='vs'?'vs. ':e.vs==='at'?'at ':'',
        ha=e.ha==='home'?'Home':e.ha==='away'?'Away':'Neutral site',when=dLabel(e.d)+(e.d2?' \u2013 '+dLabel(e.d2):'');
      return '<li><a class="sx-gm" href="'+href+'"><span class="sx-gm-sp">'+esc(nm)+'</span><b>'+vs+esc(e.name)+(e.ex?' (exh.)':'')+'</b>'+
        '<span class="sx-gm-w">'+esc(when)+' \u00b7 '+esc(e.time||(e.d2?'All day':'Time TBA'))+' \u00b7 '+ha+'</span>'+
        '<span class="sx-gm-go">'+(g?'Game page':'Schedule')+'<span aria-hidden="true"> \u2192</span></span></a></li>'}).join('')}
  function getJ(u){return fetch(ROOT+u,{cache:'no-cache'}).then(function(r){if(!r.ok)throw r.status;return r.json()})}
  var FD={timeZone:'America/Chicago',month:'short',day:'numeric'};
  function vids(){var el=$('sxVids');return getJ('data/videos-feed.json').then(function(F){var CH={};(F.channels||[]).forEach(function(c){CH[c.key]=c});
    /* the Library's own "New videos" list (newest first), first three */
    var L=(F['new']||[]).map(function(n){var ch=CH[n.key],v=ch&&(ch.videos||[]).filter(function(x){return x.id===n.id})[0];return v?{ch:ch,v:v}:null}).filter(Boolean).slice(0,3);
    if(!L.length)throw 0;
    el.innerHTML=L.map(function(x){var d=new Date(x.v.published),ds=isNaN(d)?'':d.toLocaleDateString('en-US',FD);
      return '<li><a class="pm-i" href="'+ROOT+'library/#watch=yt-'+esc(x.v.id)+'"><span class="pm-th"><img src="https://i.ytimg.com/vi/'+esc(x.v.id)+'/mqdefault.jpg" alt="" width="320" height="180" loading="lazy" decoding="async" referrerpolicy="no-referrer">'+
        (x.v.dur?'<span class="pm-dur">'+esc(x.v.dur)+'</span>':'')+'</span><span class="pm-b"><b>'+esc(tc(x.v.title))+'</b><small>'+esc(x.ch.name)+(ds?' \u00b7 '+ds:'')+'</small></span></a></li>'}).join('')}).catch(function(){$('sxRgVids').hidden=true})}
  function pods(){var el=$('sxPods');return getJ('data/podcasts-feed.json').then(function(F){var SH={};(F.shows||[]).forEach(function(c){SH[c.key]=c});
    var L=(F['new']||[]).map(function(n){var sh=SH[n.key],e=sh&&(sh.episodes||[]).filter(function(x){return x.id===n.id})[0];return e?{sh:sh,e:e}:null}).filter(Boolean).slice(0,3);
    if(!L.length)throw 0;
    el.innerHTML=L.map(function(x){var d=new Date(x.e.published),ds=isNaN(d)?'':d.toLocaleDateString('en-US',FD),ap=x.e.apple||x.sh.apple||x.sh.spotify,href=ap||ROOT+'library/?type=podcast';
      return '<li><a class="pm-i" href="'+esc(href)+'"'+(ap?' target="_blank" rel="noopener" aria-label="'+esc(x.sh.name)+': '+esc(x.e.title)+' (opens in a new tab)"':'')+'><span class="pm-th pm-art">'+(x.sh.art?'<img src="'+ROOT+esc(x.sh.art)+'" alt="" width="72" height="72" loading="lazy" decoding="async">':'')+'</span>'+
        '<span class="pm-b"><small class="sx-show-n">'+esc(x.sh.name)+'</small><b>'+esc(tc(x.e.title))+'</b><small>'+[ds,x.e.dur].filter(Boolean).map(esc).join(' \u00b7 ')+'</small></span></a></li>'}).join('')}).catch(function(){$('sxRgPods').hidden=true})}
  /* no sample ad beside the Writers rows (Counsel): on 1260px+, where the rail sits next to the Following column, an ad whose
     rows would line up with the Writers list is pushed below it. Runs after anything that changes either column's height. */
  var three=matchMedia('(min-width:1260px)');
  function adGuard(){var ads=document.querySelectorAll('.sx-rail [data-ad-slot]');[].forEach.call(ads,function(a){a.style.marginTop=''});if(!three.matches)return;
    var w=list.querySelector('.sx-fl-w');if(!w)return;var r=w.getBoundingClientRect(),t=r.top-8,b=r.bottom+8;
    [].forEach.call(ads,function(a){var q=a.getBoundingClientRect();if(q.bottom>t&&q.top<b)a.style.marginTop=Math.ceil(b-q.top+16)+'px'})}
  var agT;function adGuardSoon(){clearTimeout(agT);agT=setTimeout(adGuard,80)}
  addEventListener('resize',adGuardSoon);if(window.ResizeObserver){var agRO=new ResizeObserver(adGuardSoon);agRO.observe(aside);var rl=$('sxRail');if(rl)agRO.observe(rl)}
  var railOn=false;function railUp(){if(railOn||!wide.matches)return;railOn=true;games();vids();pods()}
  railUp();if(wide.addEventListener)wide.addEventListener('change',railUp);
  fetch(ROOT+'data/socials.json',{cache:'no-cache'}).then(function(r){return r.json()}).then(function(d){D=d;
    feed.innerHTML=(d.posts||[]).map(card).join('');feed.setAttribute('aria-busy','false');
    $('sxSrc').textContent='Posts picked from public X accounts, checked '+full(d.checked)+'. Each post is shown with X\u2019s embed and opens on X.';
    options();followList();document.documentElement.classList.add('sx-ready');apply('');watch();if(window.MP&&MP.adsMount){MP.adsMount();if(MP.adsCap)MP.adsCap()}},
    function(){document.documentElement.classList.add('sx-ready');feed.setAttribute('aria-busy','false');empty.textContent='Posts could not load. Try again in a bit.';empty.hidden=false});
})();
