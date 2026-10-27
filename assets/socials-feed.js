/* From Socials (Media > From Socials, /socials/): one timeline of public X posts from SMU-related accounts.
   Data: data/socials.json from tools/build_socials.py (which picks the posts, their order and the filters). Each post is X's own
   embed (blockquote.twitter-tweet, data-dnt), turned into a live embed by platform.twitter.com/widgets.js only as it nears the
   viewport. Until then, and if widgets.js cannot load, the blockquote is a text-only card: name, @handle, time, excerpt, View on X.
   No X images, avatars or bios are copied onto this site; the Following list uses initial circles. A post X no longer shows
   (deleted or withheld) has its card removed. */
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
    list.innerHTML=ORDER.filter(function(g){return by[g]}).map(function(g){return '<h3 class="sx-fg">'+GL[g]+'</h3><ul class="sx-fl">'+by[g].map(function(a){
      return '<li><button type="button" class="sx-acct" data-acct="'+esc(a.h)+'" aria-pressed="false"><span class="sx-ini" aria-hidden="true">'+ini(a.n)+'</span><span class="sx-an"><b>'+esc(a.n)+'</b><span>@'+esc(a.h)+'</span></span></button>'+
        '<a class="sx-prof" href="https://x.com/'+esc(a.h)+'" target="_blank" rel="noopener" aria-label="@'+esc(a.h)+' on X (opens X)"><span aria-hidden="true">\u2197</span></a></li>'}).join('')+'</ul>'}).join('');
    flBtn.textContent='Following ('+D.accounts.length+')';flBtn.hidden=false}
  function options(){var gs=ORDER.filter(function(g){return D.posts.some(function(p){return p.g===g})});
    sel.innerHTML='<option value="">All posts</option><optgroup label="Groups">'+gs.map(function(g){return '<option value="g:'+g+'">'+GL[g]+'</option>'}).join('')+'</optgroup>'+
      '<optgroup label="Accounts">'+D.accounts.map(function(a){return '<option value="h:'+esc(a.h)+'">'+esc(a.n)+' (@'+esc(a.h)+')</option>'}).join('')+'</optgroup>'}
  /* phones and tablets (<1024px): the Following list opens as a sheet */
  var wide=matchMedia('(min-width:1024px)');
  function openSheet(){aside.classList.add('open');flBtn.setAttribute('aria-expanded','true');document.documentElement.classList.add('noscroll');var b=$('sxFollowX');if(b)b.focus()}
  function closeSheet(){if(!aside.classList.contains('open'))return;aside.classList.remove('open');flBtn.setAttribute('aria-expanded','false');document.documentElement.classList.remove('noscroll');flBtn.focus({preventScroll:true})}
  flBtn.addEventListener('click',openSheet);$('sxFollowX').addEventListener('click',closeSheet);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSheet()});
  if(wide.addEventListener)wide.addEventListener('change',function(){if(wide.matches)closeSheet()});
  list.addEventListener('click',function(e){var b=e.target.closest('[data-acct]');if(!b)return;var v='h:'+b.dataset.acct;apply(F===v?'':v,true)});
  sel.addEventListener('change',function(){apply(sel.value)});clear.addEventListener('click',function(){apply('');sel.focus()});
  fetch(ROOT+'data/socials.json',{cache:'no-cache'}).then(function(r){return r.json()}).then(function(d){D=d;
    feed.innerHTML=(d.posts||[]).map(card).join('');feed.setAttribute('aria-busy','false');
    $('sxSrc').textContent='Posts picked from public X accounts, checked '+full(d.checked)+'. Each post is shown with X\u2019s embed and opens on X.';
    options();followList();apply('');watch();if(window.MP&&MP.adsMount){MP.adsMount();if(MP.adsCap)MP.adsCap()}},
    function(){feed.setAttribute('aria-busy','false');empty.textContent='Posts could not load. Try again in a bit.';empty.hidden=false});
})();
