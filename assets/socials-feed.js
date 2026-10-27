/* From Socials (Media > From Socials, /socials/): one timeline of the newest public X posts from SMU accounts.
   Data: data/socials.json, written by tools/build_socials.py from Grok Bot's public X reads. Real posts only, exactly as X returned them;
   no like or repost counts. Avatars and photos load from X's own image servers (pbs.twimg.com), lazily, inside fixed-ratio boxes. */
(function(){
  var feed=document.getElementById('sxFeed');if(!feed)return;
  var ROOT=document.body.getAttribute('data-root')||'../',chips=document.getElementById('sxChips'),empty=document.getElementById('sxEmpty'),POSTS=[],G='';
  var GL={official:'Official',teams:'Team',writers:'Writer',athletes:'Athlete'};
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function ago(iso){var t=new Date(iso),s=(Date.now()-t)/1000;if(s<60)return 'now';if(s<3600)return Math.floor(s/60)+'m';if(s<86400)return Math.floor(s/3600)+'h';if(s<7*86400)return Math.floor(s/86400)+'d';
    return t.toLocaleDateString('en-US',{month:'short',day:'numeric',year:t.getFullYear()===new Date().getFullYear()?undefined:'numeric',timeZone:'America/Chicago'})}
  function full(iso){return new Date(iso).toLocaleString('en-US',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Chicago'})+' CT'}
  /* links: t.co links become their real URL when X sent it; @mentions and #tags open on X */
  function linkify(p){var map={};(p.urls||[]).forEach(function(u){map[u.u]=u});
    return esc(p.txt).replace(/https?:\/\/[^\s<]+|(^|[^\w])@(\w{1,15})|(^|[^\w&])#(\w+)/g,function(m,pre1,h,pre2,tag){
      if(h)return pre1+'<a href="https://x.com/'+h+'" target="_blank" rel="noopener">@'+h+'</a>';
      if(tag)return pre2+'<a href="https://x.com/hashtag/'+encodeURIComponent(tag)+'" target="_blank" rel="noopener">#'+tag+'</a>';
      var u=map[m],href=u?u.x:m,d=u?u.d:m.replace(/^https?:\/\//,'');return '<a href="'+esc(href)+'" target="_blank" rel="noopener">'+esc(d)+'</a>'}).replace(/\n/g,'<br>')}
  function photo(p){var m=p.ph;if(!m)return '';var r=m.w&&m.h?m.w/m.h:16/9;r=Math.max(1,Math.min(16/9,r)); /* tall photos crop to square so the feed stays scannable */
    return '<a class="sx-ph" href="'+esc(p.url)+'" target="_blank" rel="noopener" style="aspect-ratio:'+r.toFixed(4)+'" aria-label="'+(m.video?'Play the video':'Open the photo')+' on X">'+
      '<img src="'+esc(m.src)+'" alt="'+esc(m.alt)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer">'+(m.video?'<span class="sx-vid">Video</span>':'')+'</a>'}
  function card(p){var who=esc(p.n);
    return '<li class="sx-card" data-g="'+p.g+'"><article aria-label="Post by '+who+'">'+
      '<header class="sx-hd"><a class="sx-av" href="https://x.com/'+esc(p.h)+'" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true"><img src="'+esc(p.av)+'" alt="" width="44" height="44" loading="lazy" decoding="async" referrerpolicy="no-referrer"></a>'+
        '<div class="sx-who"><a class="sx-n" href="https://x.com/'+esc(p.h)+'" target="_blank" rel="noopener">'+who+'</a>'+
        '<span class="sx-m"><span class="sx-h">@'+esc(p.h)+'</span> \u00b7 <time datetime="'+p.t+'" title="'+full(p.t)+'">'+ago(p.t)+'</time> \u00b7 <span class="sx-on">on X</span></span></div>'+
        '<span class="sx-g">'+GL[p.g]+'</span></header>'+
      (p.txt?'<p class="sx-t">'+linkify(p)+'</p>':'')+(p.q?'<p class="sx-q">Quoted a post. See it on X.</p>':'')+photo(p)+
      '<footer class="sx-ft"><a class="sx-view" href="'+esc(p.url)+'" target="_blank" rel="noopener">View on X<span class="sr"> (opens the post by '+who+')</span> <span aria-hidden="true">\u2197</span></a></footer>'+
    '</article></li>'}
  function render(){var L=POSTS.filter(function(p){return !G||p.g===G});
    feed.innerHTML=L.map(card).join('');feed.setAttribute('aria-busy','false');empty.hidden=!!L.length;
    if(window.MP&&MP.adsMount){MP.adsMount();if(MP.adsCap)MP.adsCap()}}
  chips.addEventListener('click',function(e){var b=e.target.closest('[data-g]');if(!b)return;G=b.dataset.g;
    [].forEach.call(chips.querySelectorAll('[data-g]'),function(x){x.setAttribute('aria-pressed',String(x===b))});render()});
  fetch(ROOT+'data/socials.json',{cache:'no-cache'}).then(function(r){return r.json()}).then(function(d){POSTS=d.posts||[];
    document.getElementById('sxSrc').textContent=POSTS.length?'Public posts read from X, checked '+full(d.checked)+'. Each post links to the original on X.':'';render()},
    function(){feed.setAttribute('aria-busy','false');empty.textContent='Posts could not load. Try again in a bit.';empty.hidden=false});
})();
