/* Mustangs+ concept site: shell, media cards, library, recruiting, boards, sport pages and athlete profiles.
   Class-project mockup. Content is fictional except the athlete profiles, which cite public sources. */
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
  var KIT_BG={home:'#354CA1',away:'#262626',alt:'color-mix(in srgb,#354CA1 10%,#fff)'};
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
  function athleteUrl(id){return ROOT+'athletes/?id='+id}
  function libUrl(cat){return ROOT+'library/'+(cat&&cat!=='all'?'?cat='+cat:'')}
  function rng(seed){var h=1779033703^seed.length;for(var i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19}
    return function(){h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);var t=(h^=h>>>16)>>>0;return t/4294967296}}
  function pick(r,a){return a[Math.floor(r()*a.length)]}
  function secHead(title,href,link,kicker){return '<div class="sec-hd"><div>'+(kicker?'<p class="eyebrow">'+kicker+'</p>':'')+'<h2 class="sec-t">'+title+'</h2></div>'+(href?'<a class="see-all" href="'+href+'">'+(link||'See all')+'<span aria-hidden="true"> →</span></a>':'')+'</div>'}

  /* ---------- Shell ---------- */
  var NAV=[['Watch',libUrl(),'library'],['Recruiting',ROOT+'recruiting/','recruiting'],['Sports',ROOT+'#sports','sport'],['Boards',ROOT+'boards/','boards'],['Athletes',ROOT+'athletes/','athlete'],['Membership',ROOT+'#membership','membership']];
  function navLinks(){return NAV.map(function(n){var on=PAGE===n[2];return '<a href="'+n[1]+'"'+(on?' class="on" aria-current="page"':'')+'>'+n[0]+'</a>'}).join('')}
  function wordmark(cls){return '<a href="'+(ROOT||'./')+'" class="wordmark'+(cls||'')+'" aria-label="Mustangs+ home"><span class="m">Mustangs</span><span class="plus" aria-hidden="true">'+PLUS+'</span></a>'}
  $('#site-header').outerHTML='<header class="site"><div class="wrap hdr">'+wordmark()+'<nav class="main" aria-label="Primary">'+navLinks()+'</nav>'+
    '<div class="hdr-act"><button class="btn btn-quiet btn-sm" data-demo="Sign in">Sign in</button><button class="btn btn-red btn-sm" data-demo="Join Mustangs+">Join</button></div></div>'+
    '<nav class="subnav" aria-label="Sections"><div class="wrap">'+navLinks()+'</div></nav></header>';
  var sportLinks=MP.SPORTS.map(function(s){return '<li><a href="'+sportUrl(s.slug)+'">'+s.name+'</a></li>'});
  $('#site-footer').outerHTML='<footer class="site-ft"><div class="wrap"><div class="ft">'+
    '<div class="ft-brand">'+wordmark(' lg')+'<p>Every moment. Every Mustang. A fan membership where your subscription helps pay the athletes you cheer for.</p><span class="powered">Powered by Learfield <em>(concept)</em></span></div>'+
    '<div class="ft-cols"><div><h4>Fall &amp; Winter</h4><ul>'+sportLinks.slice(0,6).join('')+'</ul></div><div><h4>More Sports</h4><ul>'+sportLinks.slice(6).join('')+'</ul></div>'+
    '<div><h4>Watch &amp; Read</h4><ul><li><a href="'+libUrl()+'">Library</a></li><li><a href="'+libUrl('film')+'">Film Room</a></li><li><a href="'+libUrl('podcasts')+'">Podcasts</a></li><li><a href="'+ROOT+'recruiting/">Recruiting</a></li></ul></div>'+
    '<div><h4>Community</h4><ul><li><a href="'+ROOT+'boards/">Message Boards</a></li><li><a href="'+ROOT+'athletes/">Player Profiles</a></li><li><a href="'+ROOT+'#membership">Plans</a></li><li><a href="'+ROOT+'#faq">FAQ</a></li></ul></div></div></div>'+
    '<div class="legal"><p><strong>Concept mockup for an SMU Cox class project. Not affiliated with or endorsed by SMU Athletics or Learfield.</strong></p>'+
    '<p>All stories, athletes, coaches, recruits, portal names, board users, schedules, prices and figures are fictional sample data, except the Player Profiles, which show real SMU football players using public stats with sources linked on each page (NIL values and film there are illustrative). No SMU or Learfield logos or trademarks are used. No payments are processed.</p></div></div></footer>';

  body.insertAdjacentHTML('beforeend',
    '<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modal-h"><div class="sheet"><div class="ic">'+PLUS+'</div>'+
    '<h3 id="modal-h">Demo only</h3><p><span class="what" id="modalWhat">Join Mustangs+</span><br>This is a concept mockup for a class presentation. No sign-up, streaming, posting or payment happens here.</p>'+
    '<button class="btn btn-red" id="modalClose">Got it</button></div></div>'+
    '<div class="reader" id="reader" role="dialog" aria-modal="true" aria-labelledby="reader-h" hidden><div class="reader-sheet"><button class="reader-x" id="readerClose" aria-label="Close article">×</button><div id="readerBody" tabindex="-1"></div></div></div>');
  var modal=$('#modal'),what=$('#modalWhat');
  document.addEventListener('click',function(e){var el=e.target.closest('[data-demo]');if(!el)return;e.preventDefault();what.textContent=el.dataset.demo;modal.classList.add('open');$('#modalClose').focus()});
  function closeModal(){modal.classList.remove('open')}
  $('#modalClose').addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal()});

  /* ---------- Media cards ---------- */
  var LIBBY={};MP.LIB.forEach(function(c){LIBBY[c.id]=c});
  var CATNAME={};MP.CATS.forEach(function(c){CATNAME[c[0]]=c[1]});
  var TICON={video:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',article:'<svg viewBox="0 0 24 24"><path d="M5 4h14v2H5zm0 4h14v2H5zm0 4h14v2H5zm0 4h9v2H5z"/></svg>',podcast:'<svg viewBox="0 0 24 24"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11z"/></svg>'};
  var VERB={video:'Watch',article:'Read',podcast:'Listen'};
  function poster(c){return '<div class="poster tone-'+(c.tone||'blue')+'"><span class="poster-type" aria-hidden="true">'+esc(c.big||'')+'</span>'+
      '<span class="poster-verb">'+TICON[c.t]+VERB[c.t]+'</span>'+(c.isNew?'<span class="tag tag-new">New</span>':'')+
      (c.lock?'<span class="tag tag-lock">'+LOCK+'Members</span>':'<span class="tag tag-free">Free</span>')+'<span class="dur">'+esc(c.dur)+'</span></div>'}
  function cardHTML(c){
    var act=c.t==='article'?'data-article="'+c.id+'" href="#article='+c.id+'"':'data-demo="'+esc(VERB[c.t]+': '+c.title)+'" href="#"';
    return '<a class="mcard" data-type="'+c.t+'" data-cat="'+c.cat+'" '+act+'>'+poster(c)+
      '<div class="mcard-b"><span class="meta">'+esc(c.label)+'</span><h3>'+esc(c.title)+'</h3><p>'+esc(c.desc)+'</p></div></a>'}
  function rail(items){return '<div class="rail" role="list">'+items.map(function(c){return '<div class="rail-i" role="listitem">'+cardHTML(c)+'</div>'}).join('')+'</div>'}
  function byCat(cat,n){return MP.LIB.filter(function(c){return c.cat===cat}).slice(0,n||8)}

  /* ---------- Article reader ---------- */
  function articleCard(id){return LIBBY[id]}
  var lastFocus=null,reader=$('#reader'),readerBody=$('#readerBody'),baseTitle=document.title;
  function openArticle(id,push){
    var a=MP.ARTICLES[id],c=articleCard(id);if(!a||!c)return false;
    lastFocus=lastFocus||document.activeElement;var st=MP.STAFF[a.by]||{n:a.by,role:'Mustangs+'};
    var rel=(a.related||[]).filter(function(r){return MP.ARTICLES[r]&&articleCard(r)}).map(function(r){var rc=articleCard(r);
      return '<a class="rel" href="#article='+r+'" data-article="'+r+'"><span class="rel-p">'+poster(rc)+'</span><span class="rel-b"><small>'+esc(rc.label)+' · '+esc(rc.dur)+'</small><b>'+esc(rc.title)+'</b></span></a>'}).join('');
    readerBody.innerHTML='<header class="reader-hd tone-'+(c.tone||'blue')+'"><p class="eyebrow">'+esc(c.label)+(c.lock?' · Members':' · Free')+'</p><h2 id="reader-h">'+esc(c.title)+'</h2></header>'+
      '<div class="reader-in"><p class="dek">'+esc(a.dek)+'</p><div class="byline"><span class="av staff" aria-hidden="true">'+st.n.charAt(0)+'</span><div><b>'+esc(st.n)+'</b><small>'+esc(st.role)+' · '+a.date+' · '+esc(c.dur)+'</small></div><button class="btn btn-outline btn-sm" data-demo="Share this story">Share</button></div>'+
      '<div class="prose">'+a.body.map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+'</div>'+
      '<p class="note">Fictional story written for an SMU Cox class-project concept. Characters and quotes are invented; real places are used as setting only.</p>'+
      (rel?'<div class="sec-hd sm"><h3 class="sec-t">Keep reading</h3></div><div class="rels">'+rel+'</div>':'')+'</div>';
    reader.hidden=false;document.documentElement.classList.add('noscroll');readerBody.scrollTop=0;readerBody.focus();
    if(push!==false&&location.hash!=='#article='+id)history.pushState(null,'','#article='+id);
    document.title=c.title+' | Mustangs+';return true}
  function closeArticle(fromHash){if(reader.hidden)return;reader.hidden=true;document.documentElement.classList.remove('noscroll');document.title=baseTitle;
    if(!fromHash&&/^#article=/.test(location.hash))history.pushState(null,'',location.pathname+location.search);
    if(lastFocus&&lastFocus.focus)lastFocus.focus();lastFocus=null}
  document.addEventListener('click',function(e){var el=e.target.closest('[data-article]');if(!el)return;e.preventDefault();openArticle(el.dataset.article)});
  $('#readerClose').addEventListener('click',function(){closeArticle()});
  reader.addEventListener('click',function(e){if(e.target===reader)closeArticle()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeModal();closeArticle()}});
  function articleFromHash(){var m=location.hash.match(/^#article=([\w-]+)$/);if(m)openArticle(m[1],false);else closeArticle(true)}
  window.addEventListener('popstate',articleFromHash);

  /* ---------- Shared bits ---------- */
  function avatar(uid,lg){var u=MP.USERS[uid],n=u.n.replace(/[^A-Za-z]/g,'');
    var hues=['#354CA1','#262626','#354CA1','#262626','#CC0035'],h=0;for(var i=0;i<n.length;i++)h+=n.charCodeAt(i);
    return '<span class="av'+(lg?' lg':'')+(u.staff?' staff':'')+'" style="'+(u.staff?'':'background:'+hues[h%hues.length])+'" aria-hidden="true">'+n.charAt(0).toUpperCase()+'</span>'}
  function forumBy(id){for(var i=0;i<MP.FORUMS.length;i++)if(MP.FORUMS[i].id===id)return MP.FORUMS[i]}
  function pills(t){var f=forumBy(t.f),s=t.sport&&sportBy(t.sport),p='';
    if(t.pin)p+='<span class="pill pill-pin">'+PIN+'Pinned</span>';if(t.hot)p+='<span class="pill pill-hot">'+FLAME+'Hot</span>';
    if(f.prem)p+='<span class="pill pill-prem">'+LOCK+'Members</span>';p+='<span class="pill">'+esc(f.name)+'</span>';if(s)p+='<span class="pill">'+esc(s.name)+'</span>';return p}
  function lastBy(t){var p=t.posts[t.posts.length-1];return p[0]}
  function lastAgo(t){var m={m:1,h:60,d:1440,w:10080},x=t.ago.match(/(\d+)(\w)/),v=x?(+x[1])*(m[x[2]]||1):60;v=Math.max(1,Math.round(v/(t.posts.length+1)));return v<60?v+'m':v<1440?Math.round(v/60)+'h':Math.round(v/1440)+'d'}
  function threadRow(t,compact){var u=MP.USERS[t.by],lu=MP.USERS[lastBy(t)];
    return '<a class="trow'+(compact?' compact':'')+'" href="'+threadUrl(t.id)+'">'+avatar(t.by)+'<div class="trow-main"><div class="pills">'+pills(t)+'</div><p class="t-title">'+esc(t.title)+'</p>'+
      '<p class="t-meta">Started by <b>'+esc(u.n)+'</b> · '+t.ago+' ago<span class="t-mob"> · '+t.replies.toLocaleString()+' replies</span></p></div>'+
      (compact?'':'<span class="num">'+t.replies.toLocaleString()+'</span><span class="num">'+t.views+'</span><span class="t-last"><b>'+esc(lu.n)+'</b><small>'+lastAgo(t)+' ago</small></span>')+'</a>'}
  function profileCard(a){
    return '<a class="pcard" href="'+athleteUrl(a.id)+'"><span class="pc-pic" style="background:'+KIT_BG[a.kit]+'">'+kit(a.num,a.kit)+'</span>'+
      '<span class="pc-b"><span class="tag tag-real">Real stats</span><small>#'+a.num+' · '+a.pos+' · '+a.cls+'</small><b>'+esc(a.name)+'</b><span>'+esc(a.hometown)+'</span></span></a>'}
  function countUp(numEl,barEl,target,goal){var done=false;
    function run(){if(done)return;done=true;barEl.style.width=(target/goal*100)+'%';var t0=performance.now();
      (function step(t){var k=Math.min(1,(t-t0)/1400);k=1-Math.pow(1-k,3);numEl.textContent=money(target*k);if(k<1)requestAnimationFrame(step)})(t0)}
    if('IntersectionObserver' in window)new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){run();o.disconnect()}})},{threshold:.3}).observe(barEl);else run()}
  function table(t,opt){opt=opt||{};var numCol=t.cols.map(function(c,i){return t.rows.every(function(r){return /^[-+]?[\d,.]+\*?$|^-$|^\d+-\d+$/.test(String(r[i]))})&&!/^(Year|Date)$/.test(c)});
    var cell=function(v,i,tag){return '<'+tag+(numCol[i]?' class="n"':'')+'>'+esc(v)+'</'+tag+'>'};
    return '<div class="tbl-wrap"><table class="tbl'+(opt.cls?' '+opt.cls:'')+'">'+(opt.caption?'<caption class="sr">'+opt.caption+'</caption>':'')+'<thead><tr>'+t.cols.map(function(c,i){return cell(c,i,'th')}).join('')+'</tr></thead><tbody>'+
      t.rows.map(function(r){return '<tr>'+r.map(function(v,i){return cell(v,i,'td')}).join('')+'</tr>'}).join('')+
      (t.total?'<tr class="tot">'+t.total.map(function(v,i){return cell(v,i,'td')}).join('')+'</tr>':'')+'</tbody></table></div>'}
  function stars(n){return '<span class="stars" aria-label="'+n+' stars">'+'★★★★★'.slice(0,n)+'<i>'+'★★★★★'.slice(n)+'</i></span>'}

  /* ---------- Home ---------- */
  function recruitBand(){
    return '<div class="rb-grid">'+
      '<div class="panel dark"><div class="panel-h"><h3>Insider notes</h3><a class="see-all" href="'+ROOT+'recruiting/#notes">All notes →</a></div><ul class="notes">'+MP.NOTES.slice(0,4).map(function(n){return '<li><span class="note-t">'+n[0]+' · '+n[1]+'</span><p>'+esc(n[2])+'</p></li>'}).join('')+'</ul></div>'+
      '<div class="panel dark"><div class="panel-h"><h3>Portal tracker</h3><a class="see-all" href="'+ROOT+'recruiting/#portal">Full tracker →</a></div>'+
        '<ul class="plist">'+MP.PORTAL.in.slice(0,3).map(function(p){return '<li><span class="dir in">In</span><b>'+p[0]+'</b><small>'+p[1]+' · from '+p[3]+'</small><em>'+p[4]+'</em></li>'}).join('')+
        MP.PORTAL.out.slice(0,2).map(function(p){return '<li><span class="dir out">Out</span><b>'+p[0]+'</b><small>'+p[1]+' · to '+p[3]+'</small><em>'+p[4]+'</em></li>'}).join('')+'</ul></div>'+
      '<div class="panel dark"><div class="panel-h"><h3>Visit list · '+MP.VISITS[0].date+'</h3><a class="see-all" href="'+ROOT+'recruiting/#visits">All visits →</a></div>'+
        '<ul class="plist">'+MP.VISITS[0].list.map(function(v){return '<li><span class="dir '+(v[5]==='Official'?'in':'neutral')+'">'+(v[5]==='Official'?'OV':'UV')+'</span><b>'+v[0]+'</b><small>'+v[1]+' · '+v[2]+' · '+v[3]+'</small>'+stars(v[4])+'</li>'}).join('')+'</ul></div>'+
      '</div><p class="note on-dark">Every recruit, portal name and school in this section is fictional.</p>'}
  function home(){
    var feat=LIBBY['boulevard-nights-1'];
    $('#heroFeature').innerHTML='<a class="hero-card" href="#" data-demo="Watch: '+esc(feat.title)+'">'+poster(feat)+'<div class="hero-card-b"><span class="meta">'+esc(feat.label)+' · Now streaming</span><h3>'+esc(feat.title)+'</h3><p>'+esc(feat.desc)+'</p></div></a>';
    $('#railWatch').innerHTML=secHead('Watch',libUrl('watch'),'See all','Docuseries & originals')+rail(byCat('watch'));
    $('#railInsider').innerHTML=secHead('Insider',libUrl('insider'),'See all','Features & practice reports')+rail(byCat('insider'));
    $('#railFilm').innerHTML=secHead('Film Room',libUrl('film'),'See all','Breakdowns')+rail(byCat('film'));
    $('#railPods').innerHTML=secHead('Podcasts',libUrl('podcasts'),'See all','Listen')+rail(MP.LIB.filter(function(c){return c.t==='podcast'}));
    $('#recruitBand').innerHTML=secHead('Recruiting &amp; Portal',ROOT+'recruiting/','Open hub','Visits, offers and the portal')+rail(byCat('recruiting').concat(byCat('portal')))+recruitBand();
    $('#sportGrid').innerHTML=MP.SPORTS.map(function(s){return '<a class="sport-tile" href="'+sportUrl(s.slug)+'">'+sportIcon(s.slug)+'<span><b>'+s.name+'</b><small>'+s.season+' · '+s.record+'</small></span></a>'}).join('');
    var hot=MP.THREADS.filter(function(t){return t.hot||t.pin}).slice(0,6);
    $('#boardHot').innerHTML=hot.map(function(t){return threadRow(t,true)}).join('');
    $('#boardForums').innerHTML=MP.FORUMS.slice(0,5).map(function(f){return '<a class="forum-mini" href="'+ROOT+'boards/?f='+f.id+'"><span class="fi'+(f.prem?' prem':'')+'">'+(f.prem?LOCK:CHAT)+'</span><span><b>'+f.name+'</b><small>'+f.threads.toLocaleString()+' threads · '+f.posts.toLocaleString()+' posts</small></span>'+(f.prem?'<span class="pill pill-prem">Members</span>':'<span class="pill">Free</span>')+'</a>'}).join('');
    $('#athRow').innerHTML='<div class="rail rail-ath" role="list">'+MP.ATHLETES.map(function(a){return '<div class="rail-i" role="listitem">'+profileCard(a)+'</div>'}).join('')+'</div>';
    var nilAmt=$('#nilAmt');function fmt(n){return '$'+n.toFixed(2)}
    $$('.tier-toggle button').forEach(function(b){b.addEventListener('click',function(){
      $$('.tier-toggle button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
      var p=parseFloat(b.dataset.price);nilAmt.textContent=fmt(p*0.40);$$('.legend .amt').forEach(function(el){el.textContent=fmt(p*parseFloat(el.dataset.share))})})});
    countUp($('#fundNum'),$('#fundBar'),1284550,2500000);
  }

  /* ---------- Library ---------- */
  function library(){
    var cat=new URLSearchParams(location.search).get('cat')||'all';if(!CATNAME[cat])cat='all';
    var chips=$('#libChips'),grid=$('#libGrid'),count=$('#libCount');
    chips.innerHTML=MP.CATS.map(function(c){var n=c[0]==='all'?MP.LIB.length:MP.LIB.filter(function(x){return x.cat===c[0]}).length;return '<button class="chip" data-cat="'+c[0]+'" aria-pressed="false">'+c[1]+'<span>'+n+'</span></button>'}).join('');
    grid.innerHTML=MP.LIB.map(cardHTML).join('');
    function set(c,push){cat=c;$$('.chip',chips).forEach(function(b){b.setAttribute('aria-pressed',b.dataset.cat===c)});
      var n=0;$$('.mcard',grid).forEach(function(el){var show=c==='all'||el.dataset.cat===c;el.hidden=!show;if(show)n++});
      count.textContent=n+' '+(n===1?'title':'titles')+(c==='all'?'':' in '+CATNAME[c]);
      $('#libTitle').textContent=c==='all'?'Library':CATNAME[c];
      if(push)history.replaceState(null,'',c==='all'?location.pathname:'?cat='+c)}
    chips.addEventListener('click',function(e){var b=e.target.closest('.chip');if(b)set(b.dataset.cat,true)});
    set(cat,false);
  }

  /* ---------- Recruiting hub ---------- */
  function recruiting(){
    $('#recNotes').innerHTML='<ul class="notes feed">'+MP.NOTES.map(function(n){return '<li><span class="note-t">'+n[0]+' ago · '+n[1]+'</span><p>'+esc(n[2])+'</p></li>'}).join('')+'</ul>';
    $('#recVisits').innerHTML=MP.VISITS.map(function(w){return '<div class="visit-wk"><div class="visit-h"><b>'+w.date+'</b><span>'+w.game+'</span><em>'+w.list.length+' visitors</em></div>'+
      table({cols:['Prospect','Pos','Class','Hometown','Rating','Visit','Status'],rows:w.list.map(function(v){return [v[0],v[1],v[2],v[3],'★'.repeat(v[4]),v[5],v[6]]})},{cls:'vis'})+'</div>'}).join('');
    function ptable(rows,dir){return table({cols:['Player','Pos','Class',dir==='in'?'From':'To','Status','Date'],rows:rows},{cls:'portal'})}
    var pin=$('#portalIn'),pout=$('#portalOut');pin.innerHTML=ptable(MP.PORTAL.in,'in');pout.innerHTML=ptable(MP.PORTAL.out,'out');
    $$('#portalTabs button').forEach(function(b){b.addEventListener('click',function(){$$('#portalTabs button').forEach(function(x){x.setAttribute('aria-selected',x===b)});pin.hidden=b.dataset.p!=='in';pout.hidden=b.dataset.p!=='out'})});
    $('#recCount').textContent=MP.PORTAL.in.length+' in · '+MP.PORTAL.out.length+' out';
    $('#recRail').innerHTML=secHead('Recruiting reads',libUrl('recruiting'),'See all')+rail(byCat('recruiting').concat(byCat('portal')));
  }

  /* ---------- Boards ---------- */
  function boards(){
    var params=new URLSearchParams(location.search),state={f:params.get('f')||'all',sport:params.get('sport')||'',sort:'hot'};
    var member=store('mp_member')==='1',listView=$('#listView'),threadView=$('#threadView');
    function lastIn(f){var l=MP.THREADS.filter(function(t){return t.f===f.id});return l[0]}
    var groups=['Premium','Community'];
    $('#forumIndex').innerHTML=groups.map(function(g){return '<div class="fgroup"><div class="fgroup-h"><h3>'+g+(g==='Premium'?' <span class="pill pill-prem">'+LOCK+'Members</span>':'')+'</h3><span class="num">Threads</span><span class="num">Posts</span><span class="f-last-h">Last post</span></div>'+
      MP.FORUMS.filter(function(f){return f.group===g}).map(function(f){var t=lastIn(f);
        return '<button class="frow" data-f="'+f.id+'"><span class="fi'+(f.prem?' prem':'')+'">'+(f.prem?LOCK:CHAT)+'</span><span class="frow-main"><b>'+f.name+'</b><small>'+f.desc+'</small></span>'+
        '<span class="num">'+f.threads.toLocaleString()+'</span><span class="num">'+f.posts.toLocaleString()+'</span>'+
        '<span class="f-last">'+(t?'<b>'+esc(t.title)+'</b><small>'+esc(MP.USERS[lastBy(t)].n)+' · '+lastAgo(t)+' ago</small>':'<small>No posts yet</small>')+'</span></button>'}).join('')+'</div>'}).join('')+
      '<div class="fgroup"><div class="fgroup-h"><h3>Team boards</h3><span class="f-last-h">12 programs</span></div><div class="team-boards">'+
      MP.SPORTS.map(function(s){var n=MP.THREADS.filter(function(t){return t.sport===s.slug}).length;return '<button class="tb" data-sport="'+s.slug+'">'+sportIcon(s.slug)+'<b>'+s.name+'</b><small>'+(n*37+40)+' threads</small></button>'}).join('')+'</div></div>';
    var sel=$('#sportFilter');sel.innerHTML='<option value="">All sports</option>'+MP.SPORTS.map(function(s){return '<option value="'+s.slug+'">'+s.name+'</option>'}).join('');sel.value=state.sport;
    sel.addEventListener('change',function(){state.sport=sel.value;renderList()});
    var fsel=$('#forumFilter');fsel.innerHTML='<option value="all">All boards</option>'+MP.FORUMS.map(function(f){return '<option value="'+f.id+'">'+f.name+'</option>'}).join('');fsel.value=state.f;
    fsel.addEventListener('change',function(){state.f=fsel.value;renderList()});
    $('#forumIndex').addEventListener('click',function(e){var b=e.target.closest('[data-f],[data-sport]');if(!b)return;
      if(b.dataset.f){state.f=b.dataset.f;state.sport=''}else{state.sport=b.dataset.sport;state.f='all'}
      fsel.value=state.f;sel.value=state.sport;renderList();$('#threadList').scrollIntoView({behavior:'smooth',block:'start'})});
    $$('.sort button').forEach(function(b){b.addEventListener('click',function(){state.sort=b.dataset.sort;renderList()})});
    function renderList(){
      $$('.sort button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.sort===state.sort)});
      var list=MP.THREADS.filter(function(t){return (state.f==='all'||t.f===state.f)&&(!state.sport||t.sport===state.sport)});
      if(state.sort==='hot')list.sort(function(a,b){return (b.pin?1:0)-(a.pin?1:0)||b.replies-a.replies});else list.sort(function(a,b){return (b.pin?1:0)-(a.pin?1:0)||(b.id-a.id)});
      var f=forumBy(state.f),s=sportBy(state.sport);$('#listTitle').textContent=(f?f.name:'All threads')+(s?' · '+s.name:'');
      $('#threadRows').innerHTML=list.length?list.map(function(t){return threadRow(t)}).join(''):'<div class="empty">No threads here yet. <button class="btn btn-red btn-sm" data-demo="Start a thread">Start one</button></div>';
    }
    function renderThread(id){
      var t=null;MP.THREADS.forEach(function(x){if(x.id===id)t=x});if(!t){location.hash='';return}
      var f=forumBy(t.f),s=t.sport&&sportBy(t.sport),locked=f.prem&&!member,n=t.posts.length;
      var times=t.posts.map(function(p,i){if(!i)return t.ago+' ago';var m={m:1,h:60,d:1440,w:10080},x=t.ago.match(/(\d+)(\w)/),tot=x?(+x[1])*(m[x[2]]||1):60,v=Math.max(1,Math.round(tot*(1-i/(n+1))));return (v<60?v+'m':v<1440?Math.round(v/60)+'h':Math.round(v/1440)+'d')+' ago'});
      var postHTML=t.posts.map(function(p,i){var u=MP.USERS[p[0]],q=p[2]!=null?t.posts[p[2]]:null,likes=3+((t.id*13+i*29)%90);
        return '<article class="post'+(i===0?' op':'')+'" id="p'+(i+1)+'"><aside class="post-user">'+avatar(p[0],true)+'<div><b>'+esc(u.n)+'</b>'+(u.staff?'<span class="badge-ins">Insider</span>':'<span class="badge-tier">'+esc(u.tier)+'</span>')+'<small>Joined '+u.since+' · '+u.posts+' posts</small></div></aside>'+
          '<div class="post-body"><div class="post-h"><span>'+times[i]+'</span><a href="#t'+t.id+'" class="post-n">#'+(i+1)+'</a></div>'+
          (q?'<blockquote><b>'+esc(MP.USERS[q[0]].n)+' said:</b> '+esc(q[1].length>140?q[1].slice(0,140)+'…':q[1])+'</blockquote>':'')+
          '<p>'+esc(p[1])+'</p><div class="post-f"><button data-demo="Like this post">♥ <span>'+likes+'</span></button><button data-demo="Quote and reply">Quote</button><button data-demo="Reply">Reply</button><button data-demo="Report post" class="rep">Report</button></div></div></article>'});
      var shown=locked?postHTML[0]+'<div class="gate">'+postHTML.slice(1,3).join('')+'<div class="gate-cta"><div>'+LOCK+'<h4>Members-only board</h4><p>'+t.replies.toLocaleString()+' replies in '+esc(f.name)+'. Join any plan to read and post.</p><a class="btn btn-red" href="'+ROOT+'#membership">See plans</a> <button class="btn btn-outline" id="asMember">Preview as member</button></div></div></div>':postHTML.join('');
      threadView.innerHTML='<nav class="crumbs"><a href="#">Boards</a> › <a href="?f='+f.id+'" data-f-link="'+f.id+'">'+esc(f.name)+'</a>'+(s?' › <span>'+esc(s.name)+'</span>':'')+'</nav>'+
        '<div class="tv-head"><div class="pills">'+pills(t)+'</div><h1 class="tv-title">'+esc(t.title)+'</h1><p class="t-meta">Started by <b>'+esc(MP.USERS[t.by].n)+'</b> · '+t.ago+' ago · '+t.replies.toLocaleString()+' replies · '+t.views+' views · <span class="online">'+(12+t.id*7%60)+' reading now</span></p></div>'+
        '<div class="pager"><span>Page 1 of '+Math.max(1,Math.ceil(t.replies/20))+'</span><div><button class="btn btn-outline btn-sm" data-demo="Watch thread">Watch</button><button class="btn btn-red btn-sm" data-demo="Reply to thread">Reply</button></div></div>'+
        '<div class="posts">'+shown+'</div>'+
        (locked?'':'<div class="reply">'+avatar('mike')+'<input type="text" placeholder="Write a reply…" aria-label="Write a reply" readonly data-demo="Post a reply"><button class="btn btn-red btn-sm" data-demo="Post a reply">Post</button></div>')+
        (member&&f.prem?'<p class="note">Viewing as a member (demo). <button class="linkish" id="asGuest">Switch back to guest view</button></p>':'')+
        '<p class="note">All usernames and posts are fictional sample content.</p>';
      var am=$('#asMember');if(am)am.addEventListener('click',function(){member=true;store('mp_member','1');renderThread(id)});
      var ag=$('#asGuest');if(ag)ag.addEventListener('click',function(){member=false;store('mp_member','0');renderThread(id)});
    }
    function route(){var m=location.hash.match(/^#t(\d+)$/);
      if(m){listView.hidden=true;threadView.hidden=false;renderThread(+m[1]);window.scrollTo(0,0)}
      else if(!/^#article=/.test(location.hash)){threadView.hidden=true;listView.hidden=false;renderList()}}
    window.addEventListener('hashchange',route);route();
  }

  /* ---------- Sport program page ---------- */
  function sport(){
    var s=sportBy(body.dataset.sport);if(!s)return;
    var r=rng(s.slug),main=$('#sportMain');document.title=s.name+' | Mustangs+';
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
    var realLog=s.slug==='football'&&MP.athleteBy&&MP.athleteBy('derrick-mcfall'),record=s.record;
    if(realLog){realLog=realLog.log.rows.map(function(r){return [r[0],r[1],r[2]]});var w=realLog.filter(function(r){return /^W/.test(r[2])}).length;record=w+'-'+(realLog.length-w)}
    var feature={id:'feature-'+s.slug,t:'article',cat:'insider',label:'Player Feature',title:'A Tuesday with '+star.name,desc:'Class, film, practice and a late dinner. One ordinary, very long day.',dur:(5+Math.floor(r()*4))+' min read',lock:true,tone:'white',big:s.season.split('/')[0].toUpperCase()};
    LIBBY[feature.id]=feature;var first=star.name.split(' ')[0];
    MP.ARTICLES[feature.id]={by:'lena',date:'Oct. 20, 2026',dek:'One ordinary Tuesday in the life of a fictional '+s.name.toLowerCase()+' athlete, from a 6:15 alarm to lights out.',related:['walk-on','visit-weekend','film-pressure'],body:[
      'The alarm goes off at 6:15. '+star.name+' (a fictional athlete created for this concept) is out the door of a dorm on the north side of campus by 6:40, headed for treatment before an 8 a.m. accounting class in Fincher.',
      'Breakfast is eaten walking. Nobody on the team claims otherwise.',
      'Between classes there is film, usually alone in a meeting room with a laptop and a cold brew from the Dallas Hall lawn cart. "I watch everything twice," '+first+' says. "Once for me, once for whoever is next to me."',
      s.name+' practice runs through the afternoon under '+s.coach+' (also fictional). The '+s.season.toLowerCase()+' schedule means weekends on the road are normal, and homework happens on buses and in hotel lobbies in cities '+first+' has mostly seen through a window.',
      'Fan-funded NIL is part of the week too. Through Mustangs+, members pay athletes for youth clinics, behind-the-scenes content and Q&As. '+first+' did a clinic in University Park last month and signed more shin guards than expected.',
      'Dinner is late, sometimes at the training table and sometimes at a taco place on Lovers Lane. Lights out is around 11. Then it starts again.']};
    var content=[
      {id:'unfiltered-'+s.slug,t:'video',cat:'watch',label:'Video Series',title:'Hilltop Unfiltered: '+s.name,desc:'All-access cameras inside practice, the locker room and road trips.',dur:(14+Math.floor(r()*14))+':'+(10+Math.floor(r()*49)),lock:true,tone:'blue',big:'EP 0'+(1+Math.floor(r()*6))},
      feature,
      {id:'pod-'+s.slug,t:'podcast',cat:'podcasts',label:'Podcast',title:s.coach+' on the season ahead',desc:'Expectations, culture and how NIL is changing the program.',dur:(25+Math.floor(r()*25))+' min',lock:false,tone:'black',big:'POD'}];
    var threads=MP.THREADS.filter(function(t){return t.sport===s.slug}),others=MP.SPORTS.filter(function(x){return x.slug!==s.slug});
    var profs=(MP.ATHLETES||[]).filter(function(a){return a.sport===s.slug});
    main.innerHTML=
      '<section class="page-hero"><div class="wrap">'+
        '<nav class="crumbs"><a href="'+ROOT+'#sports">Sports</a> › <span>'+s.name+'</span></nav>'+
        '<div class="ph-row"><span class="sp-ic">'+sportIcon(s.slug)+'</span><div><p class="eyebrow">'+s.season+' sport · '+s.conf+'</p><h1 class="display">'+s.name+'</h1></div></div>'+
        '<p class="lede on-dark">'+s.blurb+' <strong>40% of every membership funds Mustang NIL.</strong></p>'+
        '<dl class="statbar"><div><dt>Record'+(realLog?'':' <span>sample</span>')+'</dt><dd>'+record+'</dd></div><div><dt>Members backing</dt><dd>'+s.members.toLocaleString()+'</dd></div><div><dt>Athletes featured</dt><dd>'+roster.length+'</dd></div><div class="fundcell"><dt>Program NIL fund <span>sample</span></dt><dd id="spFund">$0</dd><div class="bar"><i id="spBar"></i></div><small>Goal '+money(s.fund*1.8)+'</small></div></dl>'+
        '<div class="ctas"><a href="'+ROOT+'#membership" class="btn btn-red">Back '+s.name+'</a><a href="#board" class="btn btn-ghost">Team board</a></div>'+
      '</div></section>'+
      '<nav class="jump" aria-label="On this page"><div class="wrap"><a href="#roster">Roster</a><a href="#schedule">Schedule</a><a href="#content">Watch &amp; Read</a><a href="#board">Board</a><a href="#more">Other sports</a></div></nav>'+
      '<section class="sec" id="roster"><div class="wrap">'+
        (profs.length?secHead('Player profiles',ROOT+'athletes/','All profiles','Real public stats')+'<div class="pgrid">'+profs.map(profileCard).join('')+'</div><div class="gap"></div>':'')+
        secHead('Roster spotlight',null,null,profs.length?'Fictional placeholder roster':'Meet the team')+
        '<p class="lede">'+(profs.length?'The profiles above are real players with sourced stats. The roster cards below are made-up placeholders for this concept.':'Every athlete below is a made-up placeholder for this concept, not a real SMU student-athlete.')+'</p>'+
        '<div class="roster">'+roster.map(function(a){return '<button class="rcard" data-demo="'+esc(a.name)+'\'s athlete profile"><span class="rnum" style="background:'+KIT_BG[a.v]+'">'+kit(a.kn,a.v,!JERSEY_SPORTS.test(s.slug))+'</span><span class="rc-b"><b>'+esc(a.name)+'</b><span class="rp">'+esc(a.pos)+(s.g==='X'?' · '+(a.g==='M'?"Men's":"Women's"):'')+'</span><small>'+a.cls+(a.ht?' · '+a.ht:'')+' · '+esc(a.town)+'</small><small><b>'+a.fans.toLocaleString()+'</b> members supporting</small></span></button>'}).join('')+'</div>'+
        '<div class="coach">'+'<span class="av lg staff">'+s.coach.split(' ')[1].charAt(0)+'</span><div><b>'+s.coach+'</b><small>Head Coach (fictional) · Monthly live Q&amp;A for Pony Express members</small></div></div>'+
      '</div></section>'+
      '<section class="sec alt" id="schedule"><div class="wrap">'+secHead((teamSport?'Schedule':'Meets')+' &amp; results',null,null,realLog?'2026 season · real results':'2026–27 · sample data')+
        (realLog?table({cols:['Date','Opponent','Result'],rows:realLog},{cls:'sched'})+'<p class="note">2026 results through Oct. 24 from the public ESPN game logs linked on each player profile.</p>':
        table({cols:['Date',teamSport?'Opponent':'Event','Site','Result'],rows:games.map(function(g){return [mo[g.d.getMonth()]+' '+g.d.getDate(),(teamSport?(g.home?'vs. ':'at '):'')+g.o,g.home?'Home · Dallas':'Away',g.res]})},{cls:'sched'})+
        '<p class="note">Sample schedule with fictional opponents.</p>')+'</div></section>'+
      '<section class="sec" id="content"><div class="wrap">'+secHead(s.name+' all access',libUrl(),'Library','Only on Mustangs+')+'<div class="cgrid">'+content.map(cardHTML).join('')+'</div></div></section>'+
      '<section class="sec alt" id="board"><div class="wrap">'+secHead('Team board',ROOT+'boards/?sport='+s.slug,'Open board','Talk '+s.name)+
        '<div class="box">'+(threads.length?threads.map(function(t){return threadRow(t,true)}).join(''):'<div class="empty">No threads yet. Be the first to start the conversation.</div>')+'</div></div></section>'+
      '<section class="sec" id="more"><div class="wrap">'+secHead('More Mustang sports',ROOT+'#sports','All sports')+
        '<div class="chips">'+others.map(function(o){return '<a class="chip" href="'+sportUrl(o.slug)+'">'+o.name+'</a>'}).join('')+'</div>'+
        '<div class="band"><div><h2 class="sec-t">Back '+s.name+'.</h2><p>Plans from $9.99/mo. 40% goes to Mustang NIL.</p></div><a href="'+ROOT+'#membership" class="btn btn-white">See plans</a></div></div></section>';
    $$('.sched td:last-child').forEach(function(td){var v=td.textContent;td.innerHTML='<span class="res '+(/^W|^1st|^2nd/.test(v)?'w':/^L/.test(v)?'l':/^T|^\d/.test(v)&&!/PM|TBA/.test(v)?'t':'up')+'">'+esc(v)+'</span>'});
    countUp($('#spFund'),$('#spBar'),s.fund,s.fund*1.8);
  }

  /* ---------- Athletes ---------- */
  function athlete(){
    var main=$('#athleteMain'),id=new URLSearchParams(location.search).get('id'),a=MP.athleteBy&&MP.athleteBy(id);
    if(!a){document.title='Player Profiles | Mustangs+';
      main.innerHTML='<section class="page-hero compact"><div class="wrap"><p class="eyebrow">Real players · public stats</p><h1 class="display">Player profiles</h1><p class="lede on-dark">Current SMU football players. Every stat on these pages comes from a public source linked at the bottom of the profile.</p></div></section>'+
        '<section class="sec"><div class="wrap"><div class="pgrid three">'+MP.ATHLETES.map(profileCard).join('')+'</div><p class="note">NIL values, backer counts and film on profiles are illustrative mock content.</p></div></section>';return}
    var s=sportBy(a.sport);document.title=a.name+' | Mustangs+ Profile';
    var others=MP.ATHLETES.filter(function(x){return x.id!==a.id});
    var rating=a.ratings?a.ratings[0][1]+' ('+a.ratings[0][0]+')':'Not listed';
    main.innerHTML=
      '<section class="ap-hero"><div class="wrap">'+
        '<nav class="crumbs"><a href="'+ROOT+'athletes/">Player profiles</a> › <a href="'+sportUrl(a.sport)+'">'+s.name+'</a> › <span>'+esc(a.name)+'</span></nav>'+
        '<div class="ap-top"><div class="ap-photo" style="background:'+KIT_BG[a.kit]+'" role="img" aria-label="Photo placeholder, jersey number '+a.num+'">'+kit(a.num,a.kit)+'<span>Photo placeholder</span></div>'+
        '<div class="ap-id"><p class="eyebrow">#'+a.num+' · '+a.pos+' · SMU Mustangs</p><h1 class="display"><span>'+esc(a.first)+'</span> '+esc(a.last)+'</h1>'+
        '<p class="ap-sub">'+s.name+' · '+a.cls+' · '+esc(a.hometown)+'</p><div class="ctas"><button class="btn btn-red btn-sm" data-demo="Follow '+esc(a.name)+'">Follow</button><button class="btn btn-ghost btn-sm" data-demo="Back '+esc(a.name)+' through the NIL fund">Back via NIL fund</button></div></div></div>'+
      '</div></section>'+
      '<div class="metricbar"><div class="wrap"><dl>'+
        [['HT',a.ht],['WT',a.wt],['Class',a.cls],['Hometown',a.hometown],['High school / prev.',a.prev],['Rating',rating],['NIL value','Not public',1]].map(function(m){return '<div'+(m[2]?' class="mock"':'')+'><dt>'+m[0]+(m[2]?' <i>illustrative</i>':'')+'</dt><dd>'+esc(m[1])+'</dd></div>'}).join('')+
      '</dl></div></div>'+
      '<nav class="jump" aria-label="Profile sections"><div class="wrap"><a href="#overview">Overview</a><a href="#stats">Stats</a><a href="#gamelog">Game log</a><a href="#film">Film</a><a href="#news">News</a></div></nav>'+
      '<div class="wrap ap-body"><div class="ap-grid"><div class="ap-main">'+
        '<section class="panel" id="overview"><div class="panel-h"><h3>'+a.season.label+'</h3></div><div class="statline" style="--n:'+a.season.stats.length+'">'+a.season.stats.map(function(x){return '<div><b>'+esc(x[1])+'</b><small>'+x[0]+'</small></div>'}).join('')+'</div></section>'+
        '<section class="panel" id="stats"><div class="panel-h"><h3>Career stats</h3><span class="meta">* 2026 in progress</span></div>'+table(a.career,{caption:'Career stats'})+(a.notes?'<p class="note">'+esc(a.notes)+'</p>':'')+'</section>'+
        '<section class="panel" id="gamelog"><div class="panel-h"><h3>'+a.log.label+'</h3></div>'+table(a.log,{cls:'log',caption:'Game log'})+'</section>'+
        '<section class="panel" id="film"><div class="panel-h"><h3>Film room</h3><span class="meta">Demo videos</span></div><div class="film">'+['Season highlights','Best plays: 2026','Mic\'d up at practice'].map(function(f,i){return '<button class="film-i" data-demo="'+esc(a.name)+': '+f+'"><span class="film-art tone-'+(i===1?'black':'blue')+'">'+TICON.video+'</span><b>'+f+'</b><small>Members · illustrative</small></button>'}).join('')+'</div></section>'+
      '</div><aside class="ap-side">'+
        '<section class="panel"><div class="panel-h"><h3>About</h3></div><p>'+esc(a.blurb)+'</p>'+(a.honors.length?'<ul class="honors">'+a.honors.map(function(h){return '<li>'+esc(h)+'</li>'}).join('')+'</ul>':'')+'</section>'+
        '<section class="panel"><div class="panel-h"><h3>Recruiting</h3></div>'+(a.ratings?'<dl class="ratings">'+a.ratings.map(function(x){return '<div><dt>'+x[0]+'</dt><dd>'+x[1]+'</dd></div>'}).join('')+'</dl><p class="note">As listed on the SMU Athletics bio.</p>':'<p class="muted">No star ratings listed in the sources used.</p>')+'</section>'+
        '<section class="panel" id="news"><div class="panel-h"><h3>News &amp; notes</h3></div><ul class="news">'+a.news.map(function(n){return '<li>'+esc(n)+'</li>'}).join('')+'</ul></section>'+
        '<section class="panel"><div class="panel-h"><h3>More profiles</h3></div><div class="mini">'+others.map(function(o){return '<a href="'+athleteUrl(o.id)+'"><b>#'+o.num+'</b><span>'+esc(o.name)+'</span><small>'+o.pos+'</small></a>'}).join('')+'</div></section>'+
      '</aside></div>'+
      '<section class="sources"><h3>Sources &amp; credits</h3><p>Bio, measurements and stats from public pages, checked Oct. 25, 2026: '+a.src.map(function(x){return '<a href="'+x[1]+'" target="_blank" rel="noopener">'+esc(x[0])+'</a>'}).join(' · ')+'. ESPN lists defensive stats as unofficial.</p>'+
        '<p>NIL value and film items are <b>illustrative mock content</b> for this class concept. No photos of the athlete are used.</p></section></div>';
  }

  if(PAGE==='home')home();else if(PAGE==='library')library();else if(PAGE==='recruiting')recruiting();else if(PAGE==='boards')boards();else if(PAGE==='sport')sport();else if(PAGE==='athlete')athlete();
  articleFromHash();
})();
