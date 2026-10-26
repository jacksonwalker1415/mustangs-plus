/* SMU+ concept site: shell, media cards, library, recruiting, boards, sport pages and athlete profiles.
   Class-project mockup. Content is fictional except the athlete profiles, which cite public sources. */
(function(){
  var MP=window.MP, body=document.body, ROOT=body.dataset.root||'', PAGE=body.dataset.page||'home';
  function $(s,el){return (el||document).querySelector(s)}
  /* ---------- Feature flag: recruiting (MP.FEATURES.recruiting in data.js). Off = hidden everywhere; code and data stay in the repo. ---------- */
  var REC_ON=!(MP.FEATURES&&MP.FEATURES.recruiting===false),REC_RE=/recruit|portal|visit weekend|visit list|offer tracker|commitment|2028 (board|class)/i;
  function recOK(c){return REC_ON||!(c&&(c.cat==='recruiting'||c.cat==='portal'||c.f==='recruiting'||REC_RE.test([c.title,c.desc,c.label].join(' '))))}
  MP.recOK=recOK;
  if(!REC_ON){MP.CATS=MP.CATS.filter(function(c){return c[0]!=='recruiting'&&c[0]!=='portal'});MP.LIB=MP.LIB.filter(recOK);
    MP.FORUMS=MP.FORUMS.filter(function(f){return f.id!=='recruiting'});MP.THREADS=MP.THREADS.filter(recOK);
    /* recruiting off: drop recruiting paragraphs and related links from the stories that stay (data is untouched) */
    var LIVEIDS={};MP.LIB.forEach(function(c){LIVEIDS[c.id]=1});
    Object.keys(MP.ARTICLES||{}).forEach(function(k){var a=MP.ARTICLES[k];if(!a)return;
      if(a.body)a.body=a.body.filter(function(p){return !REC_RE.test(p)});if(a.related)a.related=a.related.filter(function(r){return LIVEIDS[r]})})}
  /* ---------- Expiring cards: an MP.LIB item with expires (ISO time, e.g. a preview's kickoff) leaves every list, rail, search result and Up next
     once that time passes. Direct links (#article=id) still open it. ?now=<ISO time> overrides the clock for testing. ---------- */
  var NOW=(function(){var m=/[?&]now=([^&#]+)/.exec(location.search),t=m&&Date.parse(decodeURIComponent(m[1]));return t||Date.now()})();
  function expired(c){var t=c&&c.expires&&Date.parse(c.expires);return !!t&&t<=NOW}MP.expired=expired;
  var LIB_ALL=MP.LIB;MP.LIB=MP.LIB.filter(function(c){return !expired(c)});
  function $$(s,el){return Array.prototype.slice.call((el||document).querySelectorAll(s))}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
  var SVG_SEARCH='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 3a7.5 7.5 0 0 1 5.9 12.1l4.8 4.8-1.4 1.4-4.8-4.8A7.5 7.5 0 1 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"/></svg>';
  var HEART='<svg class="ic-heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 4.4 2.6.8-1.5 2.3-2.6 4.4-2.6 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21z"/></svg>';
  var PLUS='<svg viewBox="0 0 20 20"><path d="M8 2h4v6h6v4h-6v6H8v-6H2V8h6z" fill="#fff"/></svg>';
  var PAID_OPEN=false;  /* paid plans are coming soon: see checkout() */
  var SHOW_PAID_PLANS=false;  /* Jackson, Oct 26: hidden for now, flip to true to bring the paid plans back (cards, Membership nav, Plans links, waitlist plan choices) */
  if(SHOW_PAID_PLANS)$$('[data-paid-plans]').forEach(function(el){el.hidden=false});
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
  var KIT_BG={home:'#354CA1',away:'#1c2a63',alt:'color-mix(in srgb,#354CA1 10%,#fff)'};
  var JERSEY_SPORTS=/football|basketball|soccer|volleyball/;
  var TEAM_LBL={M:"Men's",W:"Women's",XC:'Cross country'};
  function sportRec(s){var R=s.slug!=='football'&&MP.REAL&&MP.REAL[s.slug];if(R){var x=realSummary(R);return (x.dt==='Record'?'':x.dt+': ')+x.dd}return s.slug==='football'&&MP.SCHEDULE?MP.SCHEDULE.record:s.record}
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
  /* ---------- Shared roster card: real SMU Athletics photo when one exists, otherwise a sport-specific icon (assets/sport-icons.js) ---------- */
  function rosterPhotoKey(a,slug){var RP=(MP.ROSTER_PHOTOS||{})[slug]||{},m=String(a.url||'').match(/\/roster\/(.+?)\/?$/),k=m&&RP[m[1]];
    if(!k&&a.id&&RP[a.id])k=RP[a.id];
    if(!k){var nm=String(a.name||'').toLowerCase(),ath=(MP.ATHLETES||[]).filter(function(x){return x.sport===slug.replace(/^.*football.*$/,'football')&&x.name.toLowerCase()===nm})[0];if(ath)k=ath.cardPhoto||ath.photo}
    return k&&PH[k]?k:null}
  function rosterCard(a,i,s,o){o=o||{};var v=['home','away','alt'][i%3],key='key' in o?o.key:rosterPhotoKey(a,s.slug),p=key&&PH[key],hasNum=a.num!=null&&a.num!=='';
    var art=p?'<img class="rc-photo" src="'+ROOT+'assets/photos/'+(p.small||p.file)+'" alt="'+esc(o.alt||a.name+(hasNum?', number '+a.num:'')+', SMU '+s.name)+'" loading="lazy" decoding="async" style="object-position:'+(p.pos||'50% 22%')+'">'
      :(MP.sportIcon?MP.sportIcon(s.slug,hasNum?a.num:null,v==='alt'?'light':'dark'):'');
    var pr=o.coach?null:(MP.ATHLETES||[]).filter(function(x){return x.sport===s.slug&&x.name===a.name})[0];
    return '<a class="rcard roster-card'+(p?' has-photo':' has-icon')+(o.more?' r-more':'')+'"'+(o.more?' hidden':'')+' href="'+(pr?athleteUrl(pr.id):(a.url||'#'))+'"'+(pr?'':' target="_blank" rel="noopener"')+'><span class="rnum" style="background:'+KIT_BG[v]+'">'+art+'</span>'+
      '<span class="rc-b"><b>'+esc(a.name)+'</b><span class="rp">'+esc([a.pos,o.team].filter(Boolean).join(' \u00b7 ')||s.name)+'</span><small>'+esc([a.cls,a.ht,a.town].filter(Boolean).join(' \u00b7 '))+'</small>'+(pr?'<small class="r-bio">SMU+ profile <span aria-hidden="true">\u203a</span></small>':'<small class="r-bio">Official bio <span aria-hidden="true">\u2197</span></small>')+'</span></a>'}
  function sportBy(slug){for(var i=0;i<MP.SPORTS.length;i++)if(MP.SPORTS[i].slug===slug)return MP.SPORTS[i];return null}
  function sportUrl(slug){return ROOT+'sports/'+slug+'/'}
  function threadUrl(id){return ROOT+'boards/#t'+id}
  function athleteUrl(id){return ROOT+'athletes/?id='+id}
  function libUrl(cat){return ROOT+'library/'+(cat&&cat!=='all'?'?cat='+cat:'')}
  function rng(seed){var h=1779033703^seed.length;for(var i=0;i<seed.length;i++){h=Math.imul(h^seed.charCodeAt(i),3432918353);h=h<<13|h>>>19}
    return function(){h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);var t=(h^=h>>>16)>>>0;return t/4294967296}}
  function pick(r,a){return a[Math.floor(r()*a.length)]}
  function secHead(title,href,link){return '<div class="sec-hd"><div><h2 class="sec-t">'+title+'</h2></div>'+(href?'<a class="see-all" href="'+href+'">'+(link||'See all')+'<span aria-hidden="true"> →</span></a>':'')+'</div>'}

  /* ---------- Local state: member preview, watch history, photos ---------- */
  /* MP.FEATURES.gating=false (data.js): no locks, blurs, gates or preview switch; everyone sees member content. Old preview state is cleared. */
  var GATING=!!(MP.FEATURES&&MP.FEATURES.gating);if(!GATING){try{localStorage.removeItem('mp_member')}catch(e){}}
  function isMember(){return store('mp_member')==='1'}
  function seesMember(){return !GATING||isMember()}
  /* Third-party embeds (official SMU Athletics YouTube videos) are never behind the members gate */
  function gated(c){return GATING&&!!(c&&c.lock&&!c.yt&&(c.t==='video'||c.cat==='film'))}
  function blocked(c){return gated(c)&&!isMember()}
  function getJSON(k,d){try{return JSON.parse(store(k)||'null')||d}catch(e){return d}}
  function hist(){return getJSON('mp_history',[])}
  function progressOf(id){var x=hist().filter(function(h){return h.id===id})[0];return x?x.p:0}
  function track(id,p){var all=hist(),old=all.filter(function(x){return x.id===id})[0],rest=all.filter(function(x){return x.id!==id});
    rest.unshift({id:id,p:Math.min(1,Math.max(p||0,old?old.p:0)),t:Date.now()});store('mp_history',JSON.stringify(rest.slice(0,24)));document.dispatchEvent(new Event('mp:history'));syncProgress(id,rest[0].p)}
  var progT={};function syncProgress(id,p){if(!window.SMU||!SMU.live||!SMU.user)return;clearTimeout(progT[id]);progT[id]=setTimeout(function(){SMU.progress(id,p).catch(function(){})},1500)}
  function syncMember(){var on=seesMember();document.documentElement.classList.toggle('is-member',on);
    $$('[data-member-toggle]').forEach(function(b){b.setAttribute('aria-checked',on?'true':'false')})}
  /* 'student' is the free Student plan: never a paid membership (sb.js paidTier) */
  function paidT(t){return window.SMU&&SMU.paidTier?SMU.paidTier(t):!!t&&t!=='free'}
  function stOn(){return !!(window.SMU&&SMU.studentsOn&&SMU.studentsOn())}
  function backToStudent(){return stOn()&&SMU.student&&SMU.student()?SMU.claimStudent(null,null):null}
  function setMember(on,tier){if(on&&!PAID_OPEN){openJoin(tier||null);return}store('mp_member',on?'1':'0');syncMember();document.dispatchEvent(new Event('mp:member'));
    if(window.SMU&&SMU.user){var t=on?(tier||(paidT(SMU.tier())?SMU.tier():'pony')):'free';SMU.setTier(t).then(function(){if(!on)return backToStudent()}).catch(function(e){toast(e.message,'err');store('mp_member',on?'0':'1');syncMember();document.dispatchEvent(new Event('mp:member'))})}
    else{try{localStorage.setItem('mp_tier',on?(tier||'pony'):'free')}catch(e){}}}
  var PH=MP.PHOTOS||{},CREDIT='<span class="credit">Photo: SMU Athletics</span>';
  function creditOf(key){var p=PH[key];return '<span class="credit">'+esc((p&&p.credit)||'Photo: SMU Athletics')+'</span>'}
  function libPh(b,w){return ROOT+'assets/photos/lib/'+b+'-'+w+'.webp'}
  function photo(key,opt){var p=PH[key];if(!p)return '';opt=opt||{};
    /* library photos: heroes and game-day backgrounds get srcset 1200/big, cards the 1200 file */
    if(p.src||(opt.small&&p.cardSrc)){var card=opt.small&&!opt.gd,cs=card&&p.cardSrc,b=cs||p.src,big=!card&&p.big>1200;
      return '<img class="ph" src="'+libPh(b,1200)+'"'+(big?' srcset="'+libPh(b,1200)+' 1200w, '+libPh(b,p.big)+' '+p.big+'w" sizes="'+(opt.sizes||'100vw')+'"':'')+' alt="'+esc(cs?p.cardAlt:p.alt)+'" style="object-position:'+(p.pos||'50% 50%')+'"'+(opt.eager?' fetchpriority="high"':' loading="lazy"')+' decoding="async">'}
    var img='<img class="ph" src="'+ROOT+'assets/photos/'+(opt.small&&p.small?p.small:p.file)+'" alt="'+esc(p.alt)+'" style="object-position:'+(p.pos||'50% 50%')+'"'+(opt.eager?' fetchpriority="high"':' loading="lazy"')+' decoding="async">';
    /* heroes: a full-resolution 16:9 crop on wide screens so the photo is never upscaled */
    return opt.hero&&p.wide?'<picture><source media="(min-width:700px)" srcset="'+ROOT+'assets/photos/'+p.wide+'">'+img+'</picture>':img}
  function photoBg(key,opt){return PH[key]?'<div class="bgph" aria-hidden="false">'+photo(key,opt)+'</div>'+creditOf(key):''}
  var SVG={search:'<svg viewBox="0 0 24 24"><path d="M10.5 3a7.5 7.5 0 0 1 5.9 12.1l4.8 4.8-1.4 1.4-4.8-4.8A7.5 7.5 0 1 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"/></svg>',
    play:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',filter:'<svg viewBox="0 0 24 24"><path d="M3 5h18l-7 8v6l-4 2v-8z"/></svg>',
    chat:'<svg viewBox="0 0 24 24"><path d="M4 4h16v12H8l-4 4z"/></svg>',user:'<svg viewBox="0 0 24 24"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm-8 9c0-4.4 3.6-7 8-7s8 2.6 8 7z"/></svg>',
    grid:'<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z"/></svg>'};
  function emptyState(ic,title,text,act){return '<div class="empty-state"><span class="es-ic" aria-hidden="true">'+(SVG[ic]||SVG.search)+'</span><h3>'+title+'</h3><p>'+text+'</p>'+(act?'<div class="es-act">'+act+'</div>':'')+'</div>'}
  syncMember();

  /* ---------- Concept notice: one wording everywhere (top bar is in each page's HTML, see build_pages.py) ---------- */
  function conceptNotice(cls){return '<div class="cnotice'+(cls?' '+cls:'')+'" role="note"><b>Concept built for an SMU Cox MBA class project.</b> Not affiliated with or endorsed by SMU Athletics or Learfield. '+
    'No payments are taken. Membership and checkout here are a demo, and no card is ever asked for. <a href="'+ROOT+'privacy/#about">About this project</a></div>'}

  /* Single SMU+ contact (MP.CONTACT in data.js). Fills [data-contact] spans on static pages; data-contact="removal" adds a data-removal subject. */
  var CONTACT=(MP.CONTACT&&MP.CONTACT.email)||'smuplusmedia@gmail.com';
  function contactHTML(kind){return '<a href="mailto:'+esc(CONTACT)+(kind==='removal'?'?subject=SMU%2B%20data%20removal%20request':'')+'">'+esc(CONTACT)+'</a>'}
  $$('[data-contact]').forEach(function(el){el.innerHTML=contactHTML(el.getAttribute('data-contact'))});
  /* ---------- Waitlist: free, no payment. Live: public.waitlist (supabase/waitlist.sql), falling back to newsletter_signups until that migration runs. ---------- */
  var AFFIL=[['student','SMU student'],['alum','SMU alum'],['fan','Fan'],['parent','Parent or family'],['other','Other']];
  var TL=MP.TIER_LABELS||{},INTEREST=[['free','Free newsletter only'],['mustang',(TL.mustang||'Mustang')+' ($9.99/mo)'],['all_access',(TL.pony||'All-Access')+' ($24.99/mo)'],['red_blue',(TL.club||'Red & Blue')+' ($99/mo)'],['not_sure','Not sure yet']].filter(function(o){return SHOW_PAID_PLANS||!/^(mustang|all_access|red_blue)$/.test(o[0])});
  function waitlistHTML(id){return '<div class="wl" data-waitlist>'+
    '<form class="wl-f" id="'+id+'" novalidate><div class="fld"><label for="'+id+'-e">Email address</label><input id="'+id+'-e" type="email" name="email" autocomplete="email" placeholder="you@example.com" required aria-describedby="'+id+'-m"></div>'+
    '<div class="fld-row"><div class="fld"><label for="'+id+'-n">Name <small>(optional)</small></label><input id="'+id+'-n" type="text" name="name" autocomplete="name" maxlength="80"></div>'+
    '<div class="fld"><label for="'+id+'-a">SMU affiliation <small>(optional)</small></label><select id="'+id+'-a" name="affiliation"><option value="">Choose one</option>'+AFFIL.map(function(a){return '<option value="'+a[0]+'">'+a[1]+'</option>'}).join('')+'</select></div></div>'+
    '<div class="fld"><label for="'+id+'-t">Which plan would interest you? <small>(optional, nothing to buy)</small></label><select id="'+id+'-t" name="tier"><option value="">Choose one</option>'+INTEREST.map(function(a){return '<option value="'+a[0]+'">'+esc(a[1])+'</option>'}).join('')+'</select></div>'+
    '<label class="wl-consent" for="'+id+'-c"><input id="'+id+'-c" type="checkbox" name="consent" required><span class="wl-box" aria-hidden="true"></span><span>I agree that SMU+ can store these details to contact me about this student project, as described in the <a href="'+ROOT+'privacy/">privacy notice</a>.</span></label>'+
    '<p class="wl-m" id="'+id+'-m" aria-live="polite"></p><button class="btn btn-red wl-go" type="submit">Join the waitlist</button>'+
    '<p class="wl-fine">Free. There is nothing to buy. Ask to be removed anytime: '+contactHTML('removal')+'.</p></form>'+
    '<div class="wl-ok" role="status" tabindex="-1"><b>You\u2019re on the waitlist.</b> <span>We saved <em class="wl-email"></em>. We\u2019ll only use it to contact you about this project.</span>'+
    '<small><span class="wl-mode"></span> <button type="button" class="linkish" data-wl-undo>Add a different email</button></small></div></div>'}
  function waitlistSection(){return '<section class="sec wl-sec" id="waitlist" aria-labelledby="wl-h"><div class="wrap wl-grid">'+
    '<div class="wl-copy"><h2 class="sec-t" id="wl-h">Join the waitlist.</h2>'+
    '<p class="wl-lede">Leave your email if you\u2019d like to hear about SMU+. It\u2019s free and there\u2019s nothing to buy.</p>'+
    '<ul class="wl-pts"><li>Your email is used only to contact you about this student project.</li><li>It\u2019s never sold or shared for advertising.</li><li>Ask to be deleted anytime and we\u2019ll remove it.</li></ul>'+
    '<p class="wl-priv"><a href="'+ROOT+'privacy/">Read the privacy notice</a></p></div>'+
    '<div class="wl-card">'+waitlistHTML('wlHome')+'</div></div></section>'}
  function syncWaitlist(){var e=store('mp_waitlist'),live=window.SMU&&SMU.live;$$('[data-waitlist]').forEach(function(w){w.classList.toggle('done',!!e);var em=$('.wl-email',w);if(em)em.textContent=e||'';
    var md=$('.wl-mode',w);if(md)md.textContent=live?'Saved to the SMU+ waitlist.':'Demo mode: saved in this browser only, nothing was sent.'})}
  document.addEventListener('submit',function(ev){var f=ev.target;if(!f.classList||!f.classList.contains('wl-f'))return;ev.preventDefault();
    var em=f.elements.email,nm=f.elements.name,af=f.elements.affiliation,cs=f.elements.consent,msg=$('.wl-m',f),v=em.value.trim();
    f.classList.remove('err');[em,cs].forEach(function(x){x.removeAttribute('aria-invalid')});
    function bad(t,el){msg.textContent=t;f.classList.add('err');el.setAttribute('aria-invalid','true');el.focus()}
    if(!v)return bad('Enter your email address to join the waitlist.',em);
    if(!EMAIL_RE.test(v))return bad('That doesn\u2019t look like a full email address. Check for a typo.',em);
    if(!cs.checked)return bad('Please tick the box to agree to the privacy notice.',cs);
    var btn=$('button[type=submit]',f);btn.disabled=true;f.setAttribute('aria-busy','true');msg.textContent='Adding you to the waitlist\u2026';
    var row={email:v,name:nm.value.trim(),affiliation:af.value,tier_interest:f.elements.tier?f.elements.tier.value:'',consent:true};
    var go=window.SMU&&SMU.waitlist?SMU.waitlist(row):Promise.resolve(store('mp_waitlist',v.toLowerCase()));
    go.then(function(){msg.textContent='';f.reset();syncWaitlist();var ok=$('.wl-ok',f.parentNode);if(ok)ok.focus()},function(e){f.classList.add('err');msg.textContent=(e&&e.message)||'Something went wrong. Try again.'})
      .then(function(){btn.disabled=false;f.removeAttribute('aria-busy')})});
  document.addEventListener('click',function(e){if(!e.target.closest('[data-wl-undo]'))return;try{localStorage.removeItem('mp_waitlist')}catch(x){}syncWaitlist();var i=$('input[type=email]',e.target.closest('[data-waitlist]'));if(i)i.focus()});

  /* ---------- Shell ---------- */
  var NAV=[['Media',libUrl(),'library']].concat(REC_ON?[['Recruiting',ROOT+'recruiting/','recruiting']]:[],[['Sports',ROOT+'#sports','sport'],['Boards',ROOT+'boards/','boards']].concat(SHOW_PAID_PLANS?[['Membership',ROOT+'#membership','membership']]:[]));
  /* Sports is a dropdown (desktop) / accordion (phone menu) listing all 12 programs; #sports links anywhere open it */
  var CHEV='<svg class="dd-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>';
  /* Media (the Library page, /library/) is a dropdown too: Videos, Podcasts and Articles open the Library with that format filter set (?type=). */
  var MEDIA=[['Videos',ROOT+'library/?type=video'],['Podcasts',ROOT+'library/?type=podcast'],['Articles',ROOT+'library/?type=article#libRead']];
  function mediaCur(i){if(PAGE!=='library')return false;var t=new URLSearchParams(location.search).get('type');return t===['video','podcast','article'][i]}
  function mediaPanel(){return '<div class="sports-dd media-dd" id="mediaMenu" hidden><ul class="sdd-list">'+MEDIA.map(function(m,i){return '<li><a href="'+m[1]+'"'+(mediaCur(i)?' aria-current="page"':'')+'>'+m[0]+'</a></li>'}).join('')+'</ul></div>'}
  function navLinks(){return NAV.map(function(n){var on=PAGE===n[2];
    if(n[2]==='sport')return '<button type="button" class="nav-dd-btn'+(on?' on':'')+'" id="sportsBtn" aria-expanded="false" aria-controls="sportsMenu" aria-haspopup="true">'+n[0]+CHEV+'</button>';
    if(n[2]==='library')return '<button type="button" class="nav-dd-btn'+(on?' on':'')+'" id="mediaBtn" aria-expanded="false" aria-controls="mediaMenu" aria-haspopup="true">'+n[0]+CHEV+'</button>';
    return '<a href="'+n[1]+'"'+(on?' class="on" aria-current="page"':'')+'>'+n[0]+'</a>'}).join('')+
    '<a href="'+ROOT+'search/" class="nav-search'+(PAGE==='search'?' on" aria-current="page':'')+'">'+SVG_SEARCH+'<span>Search</span></a>'}
  function sportsPanel(){return '<div class="sports-dd" id="sportsMenu" hidden><p class="sdd-h">All 12 sports</p><ul class="sdd-list">'+MP.SPORTS.map(function(sp){var cur=PAGE==='sport'&&document.body.dataset.sport===sp.slug;
    return '<li><a href="'+sportUrl(sp.slug)+'"'+(cur?' aria-current="page"':'')+'>'+sportIcon(sp.slug)+'<span>'+esc(sp.name)+'</span></a></li>'}).join('')+'</ul></div>'}
  /* Header/footer logo. ONE swappable path (relative to the site root). Set to '' to fall back to the type-only SMU+ lockup. */
  var BRAND_LOGO='assets/brand/smu-plus-logo.png';
  function wordmark(cls){return '<a href="'+(ROOT||'./')+'" class="wordmark'+(cls||'')+(BRAND_LOGO?' has-logo':'')+'" aria-label="SMU+ home">'+
    (BRAND_LOGO?'<picture><source type="image/webp" srcset="'+ROOT+BRAND_LOGO.replace(/\.png$/,'.webp')+'"><img src="'+ROOT+BRAND_LOGO+'" alt="SMU+" width="360" height="128" decoding="async"></picture>':'<span class="wm-txt">SMU</span><span class="wm-plus" aria-hidden="true">+</span><span class="sr">+</span>')+'</a>'}
  function memberSwitch(label){if(!GATING)return '';return '<button type="button" class="mtoggle" data-member-toggle role="switch" aria-checked="false"><span class="sw-t" aria-hidden="true"></span><span class="mt-l">'+(label||'Preview as member')+'</span></button>'}
  /* Ad-free switch (header, and the phone menu). SMU+ runs no real ads: the slots are made-up sample ads from assets/ads.js, and this
     hides every one of them (anything marked data-ad-slot or .ad-slot) for signed-in accounts. Signed out, it opens sign-in first. */
  function adfreeSwitch(cls){return '<button type="button" class="adfree '+cls+'" data-adfree role="switch" aria-checked="false"><span class="af-l">Ad-free</span><span class="af-sw" aria-hidden="true"></span></button>'}
  /* Phone/tablet menu (under 960px). Every primary link, plus search, member preview and Join. */
  function mobileMenu(){
    return '<div class="mmenu" id="mmenu" role="dialog" aria-modal="true" aria-label="Site menu" hidden><div class="mm-in">'+
      '<form class="mm-sf" role="search" action="'+ROOT+'search/" method="get">'+SVG_SEARCH+'<label class="sr" for="mmQ">Search SMU+</label>'+
        '<input id="mmQ" name="q" type="search" placeholder="Search SMU+" autocomplete="off" spellcheck="false" enterkeyhint="search" maxlength="80"'+(PAGE==='search'?' value="'+esc(new URLSearchParams(location.search).get('q')||'')+'"':'')+'>'+
        '<button type="submit" class="mm-sf-go">Search</button></form>'+
      '<nav class="mm-nav" aria-label="Primary">'+NAV.filter(function(n){return n[2]!=='membership'}).map(function(n){var on=PAGE===n[2];
        if(n[2]==='sport')return '<button type="button" class="mm-acc'+(on?' on':'')+'" id="mmSportsBtn" aria-expanded="false" aria-controls="mmSports"><b>'+n[0]+'</b><span class="mm-chev" aria-hidden="true">›</span></button>'+
          '<div class="mm-sports" id="mmSports" hidden>'+MP.SPORTS.map(function(sp){return '<a href="'+sportUrl(sp.slug)+'">'+sportIcon(sp.slug)+'<span>'+esc(sp.name)+'</span></a>'}).join('')+'</div>';
        if(n[2]==='library')return '<button type="button" class="mm-acc'+(on?' on':'')+'" id="mmMediaBtn" aria-expanded="false" aria-controls="mmMedia"><b>'+n[0]+'</b><span class="mm-chev" aria-hidden="true">›</span></button>'+
          '<div class="mm-sports mm-media" id="mmMedia" hidden>'+MEDIA.map(function(m,i){return '<a href="'+m[1]+'"'+(mediaCur(i)?' aria-current="page"':'')+'><span>'+m[0]+'</span></a>'}).join('')+'</div>';
        return '<a href="'+n[1]+'"'+(on?' class="on" aria-current="page"':'')+'><b>'+n[0]+'</b><span class="mm-chev" aria-hidden="true">›</span></a>'}).join('')+'</nav>'+
      (GATING?'<div class="mm-member">'+memberSwitch('Member preview')+'<p>See the site the way members do. Demo setting: no payment is involved.</p></div>':'')+
      '<a class="mm-acct" href="'+ROOT+'account/"><span class="acct-av" aria-hidden="true">'+SVG.user+'</span><span><b class="mm-acct-l">Sign in or create an account</b><small class="mm-acct-s">Save athletes, post on the boards, sync what you watch</small></span><span class="mm-chev" aria-hidden="true">›</span></a>'+
      '<div class="mm-af">'+adfreeSwitch('af-mm')+'</div>'+
      '<a class="btn btn-red mm-join" href="'+ROOT+'#waitlist">Join SMU+</a>'+
      '<p class="mm-note">Concept built for an SMU Cox MBA class project. No payments are taken.</p></div></div>'}
  $('#site-header').outerHTML='<header class="site"><div class="wrap hdr">'+wordmark()+'<nav class="main" aria-label="Primary">'+navLinks()+'</nav>'+
    '<div class="hdr-act">'+memberSwitch('Member preview')+
    '<a class="btn btn-red btn-sm hdr-join" href="'+ROOT+'#waitlist">Join</a>'+adfreeSwitch('af-hdr')+
    '<a class="acct-btn" id="acctBtn" href="'+ROOT+'account/"'+(PAGE==='account'?' aria-current="page"':'')+'><span class="acct-av" aria-hidden="true">'+SVG.user+'</span><span class="acct-l sr">Sign in</span></a>'+
    '<button type="button" class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="mmenu" aria-label="Open menu"><span class="mb-bars" aria-hidden="true"><i></i><i></i><i></i></span></button></div></div>'+sportsPanel()+mediaPanel()+
    mobileMenu()+'</header>';
  var sportLinks=MP.SPORTS.map(function(s){return '<li><a href="'+sportUrl(s.slug)+'">'+s.name+'</a></li>'});
  $('#site-footer').outerHTML='<footer class="site-ft"><div class="wrap"><div class="ft">'+
    '<div class="ft-brand">'+wordmark(' lg')+'<p>Every moment. Every Mustang. A proposed fan membership for every SMU sport.</p>'+
      '<div class="ft-brief"><h4>SMU+ Weekly</h4><p>One email on Friday mornings in season.</p>'+briefHTML('briefFt',true)+'</div></div>'+
    '<div class="ft-cols"><div><h4>Fall &amp; Winter</h4><ul>'+sportLinks.slice(0,6).join('')+'</ul></div><div><h4>More Sports</h4><ul>'+sportLinks.slice(6).join('')+'</ul></div>'+
    '<div><h4>Media</h4><ul>'+MEDIA.map(function(m){return '<li><a href="'+m[1]+'">'+m[0]+'</a></li>'}).join('')+'<li><a href="'+libUrl()+'">Library</a></li>'+(REC_ON?'<li><a href="'+ROOT+'recruiting/">Recruiting</a></li>':'')+'</ul></div>'+
    '<div><h4>Community</h4><ul><li><a href="'+ROOT+'boards/">Message Boards</a></li><li><a href="'+ROOT+'athletes/">Player Profiles</a></li>'+(SHOW_PAID_PLANS?'<li><a href="'+ROOT+'#membership">Plans</a></li>':'')+'<li><a href="'+ROOT+'faq/">FAQ</a></li><li><a href="'+ROOT+'#waitlist">Join SMU+</a></li><li><a href="'+ROOT+'privacy/">Privacy notice</a></li><li><a href="mailto:'+esc(CONTACT)+'">Contact us</a></li></ul></div></div></div>'+
    '<div class="legal"><p><strong>Concept built for an SMU Cox MBA class project. Not affiliated with or endorsed by SMU Athletics or Learfield. No payments are taken.</strong> Membership and checkout are a demo. <a href="'+ROOT+'privacy/">Privacy notice</a> \u00b7 Contact: '+contactHTML()+'</p>'+
    '<p>All stories, athletes, coaches, '+(REC_ON?'recruits, portal names, ':'')+'board users, prices and figures are fictional sample data, with these exceptions: the Player Profiles show real SMU football players using public stats with sources on each page; the football schedule, kickoff times, TV and scores, and the schedules, results, rosters and head coaches on the other 11 sport pages, come from smumustangs.com with links on each page; photos credited "Photo: SMU Athletics" are SMU Athletics photography used for this class concept; videos and podcast episodes credited to SMU Athletics are official embeds from SMU\u2019s YouTube channel, not rehosted; and stories marked "Sourced story" use only facts from the SMU Athletics pages they link to. The SMU+ logo is concept artwork made for this class project; SMU marks belong to SMU, and no Learfield marks are used. No payments are processed. Accounts, board posts, newsletter and waitlist signups are saved only in this browser unless the site is connected to its own database; see the privacy notice for what is stored and how to have it deleted.</p></div></div></footer>';

  /* ---------- Newsletter: SMU+ Weekly (demo, localStorage only) ---------- */
  function briefHTML(id,compact){return '<div class="brief'+(compact?' compact':'')+'" data-brief>'+
    '<form class="brief-f" id="'+id+'" novalidate><label for="'+id+'-e" class="'+(compact?'sr':'brief-l')+'">Email address</label>'+
    '<div class="brief-row"><input id="'+id+'-e" type="email" name="email" placeholder="you@example.com" autocomplete="email" aria-describedby="'+id+'-m"><button class="btn btn-red" type="submit">Sign me up</button></div>'+
    '<p class="brief-m" id="'+id+'-m" aria-live="polite"></p></form>'+
    '<div class="brief-ok" role="status"><b>You\'re on the list.</b> <span>SMU+ Weekly goes to <em class="brief-email"></em> on Friday mornings in season.</span> <small><span class="brief-mode">Demo mode: the address is saved in this browser and nothing was sent.</span> <button type="button" class="linkish" data-brief-undo>Use a different email</button></small></div></div>'}
  var EMAIL_RE=/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[A-Za-z]{2,}$/;
  function syncBriefs(){var e=store('mp_brief'),live=window.SMU&&SMU.live;$$('[data-brief]').forEach(function(b){b.classList.toggle('done',!!e);var em=$('.brief-email',b);if(em)em.textContent=e||'';
    var md=$('.brief-mode',b);if(md)md.textContent=live?'Saved to the SMU+ list. This concept site does not send email yet.':'Demo mode: the address is saved in this browser and nothing was sent.'})}
  document.addEventListener('submit',function(ev){var f=ev.target;if(!f.classList||!f.classList.contains('brief-f'))return;ev.preventDefault();
    var inp=$('input',f),msg=$('.brief-m',f),v=inp.value.trim();f.classList.remove('err');
    if(!v){msg.textContent='Enter your email address to sign up.';f.classList.add('err');inp.setAttribute('aria-invalid','true');inp.focus();return}
    if(!EMAIL_RE.test(v)){msg.textContent='That doesn\u2019t look like a full email address. Check for a typo.';f.classList.add('err');inp.setAttribute('aria-invalid','true');inp.focus();return}
    inp.removeAttribute('aria-invalid');var btn=$('button[type=submit]',f);btn.disabled=true;f.setAttribute('aria-busy','true');msg.textContent='Signing you up…';
    var go=window.SMU?SMU.brief(v):Promise.resolve(store('mp_brief',v));
    go.then(function(){msg.textContent='';inp.value='';syncBriefs()},function(e){f.classList.add('err');msg.textContent=(e&&e.message)||'Something went wrong. Try again.'}).then(function(){btn.disabled=false;f.removeAttribute('aria-busy')})});
  document.addEventListener('click',function(e){if(!e.target.closest('[data-brief-undo]'))return;try{localStorage.removeItem('mp_brief')}catch(x){}syncBriefs();var i=$('input',e.target.closest('[data-brief]'));if(i)i.focus()});
  syncBriefs();

  /* ---------- Overlays: demo modal, reader, paywall, search ---------- */
  body.insertAdjacentHTML('beforeend',
    '<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modal-h"><div class="sheet"><div class="ic">'+PLUS+'</div>'+
    '<h3 id="modal-h">Demo only</h3><p><span class="what" id="modalWhat">Join SMU+</span><br>This part of SMU+ is concept-only for the class presentation. No streaming or payment happens on this site.</p>'+
    '<button class="btn btn-red" id="modalClose">Got it</button></div></div>'+
    '<div class="reader" id="reader" role="dialog" aria-modal="true" aria-labelledby="reader-h" hidden><div class="reader-sheet"><button class="reader-x" id="readerClose" aria-label="Close">×</button><div id="readerBody" tabindex="-1"></div></div></div>'+
    '<div class="pw" id="paywall" role="dialog" aria-modal="true" aria-labelledby="pw-h" hidden><div class="pw-sheet"><button class="reader-x" id="pwClose" aria-label="Close">×</button>'+
      '<div class="pw-art" id="pwArt"></div><div class="pw-b"><p class="eyebrow pw-eb">'+LOCK+'Members only</p><h3 id="pw-h">Unlock <span id="pwTitle"></span></h3>'+
      '<p class="pw-lede">The members-only boards today. Original SMU+ series, film breakdowns and podcasts are coming soon. Cancel anytime.</p>'+
      '<div class="pw-tiers">'+[[MP.TIER_LABELS.mustang,'9.99','4.00'],[MP.TIER_LABELS.pony,'24.99','10.00'],[MP.TIER_LABELS.club,'99','39.60']].map(function(t,i){return '<div class="pw-t'+(i===1?' pop':'')+'">'+(i===1?'<span class="pw-pop">Most popular</span>':'')+'<b>'+t[0]+'</b><span class="pw-p">$'+t[1]+'<small>/mo</small></span></div>'}).join('')+'</div>'+
      '<div class="pw-act"><a class="btn btn-red" href="'+ROOT+'#membership" id="pwPlans">See plans</a>'+memberSwitch()+'</div>'+
      conceptNotice('pw-cn')+'</div></div></div>'+
    '<div class="search" id="search" role="dialog" aria-modal="true" aria-label="Search SMU+" hidden><div class="search-sheet">'+
      '<div class="search-bar">'+SVG.search+'<input id="searchInput" type="text" placeholder="Search stories, episodes, players, threads" autocomplete="off" spellcheck="false" role="combobox" aria-expanded="true" aria-controls="searchResults" aria-autocomplete="list"><button type="button" class="search-esc" id="searchClose">Esc</button></div>'+
      '<div id="searchResults" class="sres" role="listbox" aria-label="Search results"></div>'+
      '<div class="search-ft"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div></div></div>');
  var modal=$('#modal'),what=$('#modalWhat');
  document.addEventListener('click',function(e){var el=e.target.closest('[data-demo]');if(!el)return;e.preventDefault();what.textContent=el.dataset.demo;modal.classList.add('open');$('#modalClose').focus()});
  function closeModal(){modal.classList.remove('open')}
  $('#modalClose').addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal()});
  syncMember();

  /* ---------- Media cards ---------- */
  var LIBBY={};LIB_ALL.forEach(function(c){LIBBY[c.id]=c});
  var CATNAME={};MP.CATS.forEach(function(c){CATNAME[c[0]]=c[1]});
  var TICON={video:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',article:'<svg viewBox="0 0 24 24"><path d="M5 4h14v2H5zm0 4h14v2H5zm0 4h14v2H5zm0 4h9v2H5z"/></svg>',podcast:'<svg viewBox="0 0 24 24"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11z"/></svg>'};
  var VERB={video:'Watch',article:'Read',podcast:'Listen'};
  var CARD_SPORT={'smu-fb-cal-highlights':'football','smu-fb-uva-highlights':'football','smu-msoc-cal-highlights':'mens-soccer','smu-vb-gt-highlights':'volleyball','smu-micd-up-s2e6':'football','preview-syracuse':'football','preview-msoc-louisville':'mens-soccer','vb-road-sweep':'volleyball','micd-setter':'volleyball','walk-on':'football','coachs-corner-acc':'football','thursday-notes':'football'};
  function cardSport(c){var k=c.sport||CARD_SPORT[c.id];if(!k)return null;var m=(MP.SPORTS||[]).filter(function(x){return x.slug===k||x.slug.indexOf(k)===0})[0];return {slug:m?m.slug:k,name:m?m.name:k}}
  /* SMU-style card template for items with no real video thumbnail (articles, sourced stories, Sample items), modeled on SMU Athletics'
     own graphics: a real SMU Athletics photo on the left (the item's own photo, else a venue/crowd/team shot for its sport) and a flat
     SMU-blue panel with the SMU+ mark, a small kicker, one or two big words and the date when there is one. HTML and CSS only. */
  var TPL_PH={football:['ford','helmet','runout','hype'],'mens-basketball':['moody-bowl','students'],'womens-basketball':['wbb-drive','students'],volleyball:['vb-spike'],
    'mens-soccer':['msoc'],'womens-soccer':['wsoc'],'swimming-diving':['swim'],golf:['golf'],tennis:['tennis'],'track-field':['track'],rowing:['rowing'],equestrian:['equestrian'],'':['ford','students','hype','storm']};
  var TPL_W=[[/mic'?d up/i,"MIC'D UP"],[/hall of fame|feature|profile/i,'FEATURE'],[/recap|final from|results/i,'RECAP'],[/preview/i,'PREVIEW'],[/film/i,'BREAKDOWN'],
    [/season notes/i,'SEASON NOTES'],[/roundup/i,'ROUNDUP'],[/poll|top 25|ranked|rankings/i,'RANKINGS'],[/record/i,'RECORD'],[/champion|title/i,'CHAMPIONS'],
    [/award|watch list|finalist|of the week/i,'HONORS'],[/schedule|slate|televised/i,'SCHEDULE'],[/patch|partnership|business|lacrosse|launch/i,'BUSINESS'],
    [/docuseries|boulevard/i,'DOCUSERIES'],[/interview/i,'INTERVIEW'],[/highlights/i,'HIGHLIGHTS'],[/press conference|availability|tipoff|postgame|postmatch/i,'MEDIA DAY'],[/coach/i,'STAFF']];
  var TPL_MARK='<span class="tpl-mark" aria-hidden="true"><b>SMU</b><i><svg viewBox="0 0 14 14"><path d="M6 2h2v4h4v2H8v4H6V8H2V6h4z" fill="#fff"/></svg></i></span>';
  function tplWord(c){var h=(c.label||'')+' '+c.title;if(c.t==='podcast'&&!/mic'?d up/i.test(h))return 'PODCAST';
    for(var i=0;i<TPL_W.length;i++)if(TPL_W[i][0].test(h))return TPL_W[i][1];return c.ext?'NEWS':c.t==='video'?'VIDEO':'STORY'}
  function tplPhoto(c){if(c.img&&PH[c.img])return c.img;var sp=cardSport(c),pool=TPL_PH[sp&&TPL_PH[sp.slug]?sp.slug:''],h=0;
    for(var i=0;i<c.id.length;i++)h=(h*31+c.id.charCodeAt(i))>>>0;return pool[h%pool.length]}
  function tplDate(c){var a=MP.ARTICLES&&MP.ARTICLES[c.id];return c.date||(c.real&&a&&a.date)||''}
  function smuTpl(c,opt){opt=opt||{};var sp=cardSport(c),sample=/^sample/i.test(c.label||''),k=c.ext?c.outlet+(sp?' \u00b7 '+sp.name:''):(sp?sp.name:(CATNAME[c.cat]||c.t)),d=tplDate(c),key=tplPhoto(c);
    if(sample)k='Sample \u00b7 '+k;
    return '<span class="tpl-ph">'+photo(key,{small:!opt.big,eager:opt.eager,sizes:'(max-width:639px) 90vw, 600px'})+creditOf(key)+'</span>'+
      '<span class="tpl-p" aria-hidden="true">'+TPL_MARK+'<span class="tpl-k">'+esc(k)+'</span><span class="tpl-w">'+esc(tplWord(c))+'</span>'+(d?'<span class="tpl-d">'+esc(d)+'</span>':'')+'</span>'}
  /* Official YouTube items show the video's real thumbnail (maxresdefault, falling back to hqdefault). Images load from i.ytimg.com. */
  function ytId(c){return c&&c.yt&&/^[A-Za-z0-9_-]{11}$/.test(c.yt)?c.yt:null}
  var NOMAX={};  /* feed videos with no HD thumbnail (tools/fetch_youtube.py marks them) go straight to hqdefault */
  function ytImg(id,cls,eager){return '<img class="'+cls+'" src="https://i.ytimg.com/vi/'+id+(NOMAX[id]?'/hqdefault.jpg':'/maxresdefault.jpg')+'" data-yt-fb="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg" alt="" '+(eager?'loading="eager"':'loading="lazy"')+' decoding="async" referrerpolicy="no-referrer">'}
  function ytFix(e){var i=e.target;if(!i||i.tagName!=='IMG'||!i.dataset||!i.dataset.ytFb)return;
    if(e.type==='error'||(i.naturalWidth&&i.naturalWidth<=120)){var fb=i.dataset.ytFb;delete i.dataset.ytFb;i.src=fb}}
  document.addEventListener('error',ytFix,true);document.addEventListener('load',ytFix,true);
  function poster(c,opt){opt=opt||{};var g=gated(c),pr=progressOf(c.id),yt=ytId(c);
    return '<div class="poster '+(yt?'tone-black has-img has-yt':'tpl-card')+'">'+(yt?ytImg(yt,'ph yt-ph',opt.eager)+'<span class="credit">'+esc(c.credit||'Video: SMU Athletics')+'</span>':smuTpl(c,opt))+
      (g?'<span class="lock-ov" aria-hidden="true">'+LOCK+'<b>Members only</b></span>':'')+
      '<span class="poster-verb">'+TICON[c.t]+(c.ext?'Read at '+esc(c.outlet)+EXT:g?'<span class="pv-g">Preview</span><span class="pv-m">'+VERB[c.t]+'</span>':VERB[c.t])+'</span>'+(c.isNew?'<span class="tag tag-new">New</span>':'')+
      (GATING&&c.lock?'<span class="tag tag-lock">'+LOCK+'Members</span>':'')+(c.ext||!c.dur||c.dur==='Video'?'':'<span class="dur">'+esc(c.dur)+'</span>')+
      (pr>0.02?'<span class="prog" role="progressbar" aria-label="Progress" aria-valuenow="'+Math.round(pr*100)+'" aria-valuemin="0" aria-valuemax="100"><i style="width:'+Math.round(pr*100)+'%"></i></span>':'')+'</div>'}
  function itemHref(c){return (c.t==='article'?'#article=':'#watch=')+c.id}
  /* Media batch 1: link-out articles (c.ext) open the outlet's own page in a new tab. Credited, free, our own summary only. */
  var EXT=' <svg class="ext-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14zM5 5h6v2H7v10h10v-4h2v6H5z"/></svg>';
  function extCard(c){return '<a class="mcard ext" data-type="'+c.t+'" data-cat="'+c.cat+'" data-item="'+c.id+'" data-ext href="'+esc(c.ext)+'" target="_blank" rel="noopener" aria-label="'+esc(c.title)+'. '+esc(c.outlet)+', '+esc(c.date)+'. Opens '+esc(c.outlet)+' in a new tab">'+poster(c)+
      '<div class="mcard-b"><span class="meta"><b class="outlet">'+esc(c.outlet)+'</b> · '+esc(c.date)+'</span><h3>'+esc(c.title)+'</h3><p>'+esc(c.desc)+'</p><span class="ext-cta">Read at '+esc(c.outlet)+EXT+(c.extNote?'<small>'+esc(c.extNote)+'</small>':'')+'</span></div></a>'}
  function cardHTML(c,opt){opt=opt||{};var pr=progressOf(c.id);if(c.ext)return extCard(c);
    return '<a class="mcard'+(gated(c)?' gated':'')+'" data-type="'+c.t+'" data-cat="'+c.cat+'" data-item="'+c.id+'" href="'+itemHref(c)+'">'+poster(c)+
      '<div class="mcard-b"><span class="meta">'+esc(c.label)+(opt.progress&&pr>0.02?' · <b class="pct">'+(pr>=0.97?'Finished':Math.round(pr*100)+'% done')+'</b>':'')+'</span><h3>'+esc(c.title)+'</h3><p>'+esc(c.desc)+'</p></div></a>'}
  function rail(items,opt){return '<div class="rail" role="list">'+items.map(function(c){return '<div class="rail-i" role="listitem">'+cardHTML(c,opt)+'</div>'}).join('')+'</div>'}
  function byCat(cat,n){return MP.LIB.filter(function(c){return c.cat===cat}).slice(0,n||8)}

  /* ---------- Reader: articles, episodes, paywall ---------- */
  var lastFocus=null,reader=$('#reader'),readerBody=$('#readerBody'),baseTitle=document.title,current=null;
  function seriesOf(c){if(c.t!=='video'||c.feed||c.title.indexOf(':')<0)return [];var k=c.title.split(':')[0];
    return Object.keys(LIBBY).map(function(i){return LIBBY[i]}).filter(function(x){return x.t==='video'&&!x.feed&&x.title.split(':')[0]===k})}
  function relatedFor(c){var out=[],seen={};seen[c.id]=1;function add(x){if(x&&!seen[x.id]&&!expired(x)&&out.length<3){seen[x.id]=1;out.push(x)}}
    var a=MP.ARTICLES[c.id];(a&&a.related||[]).forEach(function(r){add(LIBBY[r])});seriesOf(c).forEach(add);
    MP.LIB.forEach(function(x){if(x.cat===c.cat)add(x)});MP.LIB.forEach(function(x){if(x.t===c.t)add(x)});MP.LIB.forEach(add);return out}
  function relatedHTML(c){var r=relatedFor(c);return '<div class="sec-hd sm"><h3 class="sec-t">Up next</h3></div><div class="relgrid">'+r.map(function(x){return cardHTML(x)}).join('')+'</div>'}
  function inlineGate(c){return '<div class="pw-inline"><p class="eyebrow">'+LOCK+'Members only</p><h3>Keep '+(c.t==='article'?'reading':c.t==='podcast'?'listening':'watching')+' with any plan</h3>'+
    '<p>Plans start at $9.99 a month.</p><div class="pw-act"><a class="btn btn-red btn-sm" href="'+ROOT+'#membership">See plans</a>'+memberSwitch()+'</div></div>'}
  function showReader(c,push){reader.hidden=false;document.documentElement.classList.add('noscroll');readerBody.scrollTop=0;readerBody.focus();syncMember();
    var h=itemHref(c);if(push!==false&&location.hash!==h)history.pushState(null,'',h);document.title=c.title+' | SMU+';current=c.id}
  function openArticle(id,push){
    var a=MP.ARTICLES[id],c=LIBBY[id];if(!a||!c)return false;var lock=blocked(c);
    lastFocus=lastFocus||document.activeElement;var st=MP.STAFF[a.by]||{n:a.by,role:'SMU+'};
    readerBody.innerHTML='<header class="reader-hd tone-'+(c.tone||'blue')+(c.img?' has-img':'')+'">'+(c.img?photoBg(c.img):'')+'<p class="eyebrow">'+esc(c.label)+(GATING&&c.lock?' · Members':'')+'</p><h2 id="reader-h">'+esc(c.title)+'</h2></header>'+
      '<div class="reader-in"><p class="dek">'+esc(a.dek)+'</p><div class="byline"><span class="av staff" aria-hidden="true">'+st.n.charAt(0)+'</span><div><b>'+esc(st.n)+'</b><small>'+esc(st.role)+' · '+a.date+' · '+esc(c.dur)+'</small></div><button class="btn btn-outline btn-sm" data-demo="Share this story">Share</button></div>'+
      '<div class="prose'+(lock?' teaser':'')+'">'+(lock?a.body.slice(0,2):a.body).map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+'</div>'+(lock?inlineGate(c):'')+
      (a.sourced?'<p class="note">Sourced story. Facts and stats from '+(a.sources||[]).map(function(x){return '<a href="'+esc(x[1])+'" target="_blank" rel="noopener">'+esc(x[0])+'</a>'}).join(', ')+'. No quotes are used. SMU+ is an SMU Cox class-project concept, not affiliated with SMU Athletics.</p>':'<p class="note">Fictional story written for an SMU Cox class-project concept. Characters and quotes are invented; real places are used as setting only.</p>')+relatedHTML(c)+'</div>';
    showReader(c,push);if(!lock)track(id,0.04);if(MP.adsMount)MP.adsMount('article');/* sample ad slots: assets/ads.js */return true}
  function secs(d){var m=String(d).match(/(\d+):(\d+)/);if(m)return (+m[1])*60+(+m[2]);m=String(d).match(/(\d+)\s*min/);return m?(+m[1])*60:600}
  function clock(s){s=Math.round(s);return Math.floor(s/60)+':'+('0'+s%60).slice(-2)}
  function openMedia(id,push){var c=LIBBY[id];if(!c)return false;lastFocus=lastFocus||document.activeElement;
    var lock=blocked(c),p=progressOf(id),total=secs(c.dur),eps=seriesOf(c),audio=c.t==='podcast';
    var yt=c.yt&&/^[A-Za-z0-9_-]{11}$/.test(c.yt)?c.yt:null,ap=!yt&&c.apple&&/^https:\/\/embed\.podcasts\.apple\.com\//.test(c.apple)?c.apple:null;
    readerBody.innerHTML=(ap?'<div class="player tpl-card ap" id="apBox">'+smuTpl(c,{big:1,eager:1})+'<button type="button" class="play" id="apPlay" aria-label="Play this episode (loads Apple Podcasts)">'+SVG.play+'</button></div>':yt?'<div class="player yt'+(lock?' locked':'')+'" id="ytBox">'+ytImg(yt,'yt-thumb',1)+'<span class="credit">'+esc(c.credit||'Video: SMU Athletics')+'</span>'+
          (lock?'':'<button type="button" class="play" id="ytPlay" aria-label="'+(c.feed?'Play the '+esc(c.pub)+' video (loads YouTube)':'Play the official SMU Athletics video (loads YouTube)')+'">'+SVG.play+'</button>')+'</div>':
        '<div class="player tpl-card'+(lock?' locked':'')+'">'+smuTpl(c,{big:1,eager:1})+
        (lock?'':'<button type="button" class="play" id="playBtn" aria-label="'+(p>0.02?'Resume':'Play')+' (demo)">'+SVG.play+'</button>')+
        '<div class="pbar" aria-hidden="true"><i id="pFill" style="width:'+Math.round(p*100)+'%"></i></div></div>')+
      '<div class="reader-in">'+(lock?inlineGate(c):'')+'<p class="eyebrow red">'+esc(c.label)+(GATING&&c.lock?' · Members':'')+'</p><h2 id="reader-h" class="m-title">'+esc(c.title)+'</h2><p class="dek">'+esc(c.desc)+'</p>'+
        '<p class="m-meta"><span>'+(yt||ap?'':'<b id="pTime">'+clock(p*total)+'</b> / ')+esc(c.dur)+'</span><span>'+(audio?'Podcast':'Video')+'</span>'+(ap?'<span>'+esc(c.credit.replace(/^Podcast: /,''))+'. It loads from Apple Podcasts when you press play \u00b7 <a href="'+esc(c.src)+'" target="_blank" rel="noopener">Open in Apple Podcasts</a></span>':yt?'<span>'+(c.feed?'Public '+esc(c.pub)+' video.':'Official SMU Athletics video.')+' It loads from YouTube when you press play'+(c.channel?' \u00b7 <a href="'+esc(c.channel[1])+'" target="_blank" rel="noopener">'+esc(c.channel[0])+'</a>':'')+'</span>':'<span>Demo player: nothing streams in this concept</span>')+'</p>'+
        (eps.length>1?'<div class="eps"><h3 class="eps-h">'+esc(c.title.split(':')[0])+' · '+eps.length+' episodes</h3>'+eps.map(function(e,i){var ep=progressOf(e.id);
          return '<a class="ep'+(e.id===c.id?' on':'')+'" href="'+itemHref(e)+'" data-item="'+e.id+'"'+(e.id===c.id?' aria-current="true"':'')+'><span class="ep-n">'+(i+1)+'</span><span class="ep-b"><b>'+esc(e.title.split(':').slice(1).join(':').trim()||e.title)+'</b><small>'+esc(e.dur)+(ep>0.02?' · '+Math.round(ep*100)+'% watched':'')+'</small></span>'+(e.id===c.id?'<span class="ep-now">Now playing</span>':'')+'</a>'}).join('')+'</div>':'')+
        relatedHTML(c)+'</div>';
    showReader(c,push);
    if(ap){track(id,Math.max(p,0.03));$('#apPlay').addEventListener('click',function(){var box=$('#apBox');box.classList.add('on');
        box.innerHTML='<iframe src="'+esc(ap)+'" title="'+esc(c.title)+' (Apple Podcasts)" height="175" allow="autoplay *; encrypted-media *; clipboard-write" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" loading="eager"></iframe>';track(id,0.5)});return true}
    if(yt&&!lock){track(id,Math.max(p,0.03));$('#ytPlay').addEventListener('click',function(){var box=$('#ytBox');
        box.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+yt+'?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="'+esc(c.title)+'" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>';track(id,0.5)});return true}
    if(!lock){track(id,Math.max(p,0.03));var btn=$('#playBtn'),fill=$('#pFill'),tm=$('#pTime'),busy=false;
      btn.addEventListener('click',function(){if(busy)return;busy=true;var from=progressOf(id),to=Math.min(1,from+0.25),t0=performance.now();btn.classList.add('on');track(id,to);
        (function step(t){var k=Math.min(1,(t-t0)/1200),v=from+(to-from)*k;fill.style.width=(v*100)+'%';tm.textContent=clock(v*total);
          if(k<1)requestAnimationFrame(step);else{busy=false;btn.classList.remove('on');btn.setAttribute('aria-label',to>=1?'Watched (demo)':'Resume (demo)')}})(t0)})}
    return true}
  function openItem(id,push){var c=LIBBY[id];if(!c)return;if(c.ext){window.open(c.ext,'_blank','noopener');return}if(blocked(c)){openPaywall(c);return}
    if(c.t==='article')openArticle(id,push);else openMedia(id,push)}
  function closeArticle(fromHash){if(reader.hidden)return;reader.hidden=true;current=null;document.documentElement.classList.remove('noscroll');document.title=baseTitle;
    if(!fromHash&&/^#(article|watch)=/.test(location.hash))history.pushState(null,'',location.pathname+location.search);
    if(lastFocus&&lastFocus.focus)lastFocus.focus();lastFocus=null;document.dispatchEvent(new Event('mp:history'))}
  var lastSaved=0;readerBody.addEventListener('scroll',function(){var c=current&&LIBBY[current];if(!c||c.t!=='article'||blocked(c))return;
    var r=readerBody.scrollTop/Math.max(1,readerBody.scrollHeight-readerBody.clientHeight);if(r-lastSaved>0.05||r>0.95){lastSaved=r;track(c.id,Math.min(1,r*1.02))}},{passive:true});
  /* Paywall */
  var pw=$('#paywall'),pending=null;
  function openPaywall(c){pending=c.id;$('#pwTitle').textContent=c.title;$('#pwArt').innerHTML=poster(c.img?c:Object.assign({},c,{img:'storm'}));lastFocus=lastFocus||document.activeElement;pw.hidden=false;document.documentElement.classList.add('noscroll');syncMember();$('#pwClose').focus()}
  function closePaywall(){if(pw.hidden)return;pw.hidden=true;pending=null;if(reader.hidden)document.documentElement.classList.remove('noscroll');if(lastFocus&&lastFocus.focus&&reader.hidden){lastFocus.focus();lastFocus=null}}
  $('#pwClose').addEventListener('click',closePaywall);pw.addEventListener('click',function(e){if(e.target===pw)closePaywall()});
  document.addEventListener('click',function(e){var t=e.target.closest('[data-member-toggle]');if(!t)return;e.preventDefault();var on=!isMember();setMember(on);
    if(on&&!pw.hidden&&pending){var id=pending;pw.hidden=true;pending=null;openItem(id)}
    else if(current&&!reader.hidden){var c=LIBBY[current];if(c&&gated(c))(c.t==='article'?openArticle:openMedia)(c.id,false)}});
  document.addEventListener('click',function(e){var el=e.target.closest('[data-item],[data-article]');if(!el||el.hasAttribute('data-ext'))return;e.preventDefault();openItem(el.dataset.item||el.dataset.article)});
  $('#readerClose').addEventListener('click',function(){closeArticle()});
  reader.addEventListener('click',function(e){if(e.target===reader)closeArticle()});
  function articleFromHash(){var m=location.hash.match(/^#(article|watch)=([\w-]+)$/);
    if(m){var c=LIBBY[m[2]];if(c){if(c.t==='article')openArticle(c.id,false);else openMedia(c.id,false)}}else closeArticle(true)}
  window.addEventListener('popstate',articleFromHash);

  /* ---------- Site search ---------- */
  var search=$('#search'),sInput=$('#searchInput'),sRes=$('#searchResults'),INDEX=null,sActive=-1,sItems=[];
  function buildIndex(){INDEX=[];var kind={video:'Episode',article:'Story',podcast:'Podcast'};
    Object.keys(LIBBY).forEach(function(k){var c=LIBBY[k];if(expired(c))return;INDEX.push({g:'Watch & read',k:kind[c.t],ic:c.t,title:c.title,sub:c.label+' · '+c.dur+(gated(c)?' · Members':''),item:c.id,hay:[c.title,c.desc,c.label,CATNAME[c.cat]||'',kind[c.t]].join(' ')})});
    (MP.ATHLETES||[]).forEach(function(a){INDEX.push({g:'Players',k:'Player',ic:'user',title:a.name,sub:'#'+a.num+' · '+a.pos+' · '+a.cls+' · '+((sportBy(a.sport)||{}).name||'Football'),href:athleteUrl(a.id),hay:[a.name,a.pos,a.cls,a.hometown,a.sport.replace('-',' ')+' player profile #'+a.num].join(' ')})});
    MP.THREADS.forEach(function(t){var f=forumBy(t.f);INDEX.push({g:'Boards',k:'Thread',ic:'chat',title:t.title,sub:f.name+(t.replies==null?'':' · '+t.replies.toLocaleString()+(t.replies===1?' reply':' replies')),href:threadUrl(t.id),hay:[t.title,f.name,t.sport||'',t.posts.map(function(p){return p[1]}).join(' ')].join(' ')})});
    MP.SPORTS.forEach(function(s){INDEX.push({g:'Sports',k:'Sport',ic:'grid',title:s.name,sub:s.season+' · '+sportRec(s),href:sportUrl(s.slug),hay:s.name+' '+s.season+' '+s.slug})})}
  function hl(text,toks){var out=esc(text);toks.forEach(function(t){if(t.length<2)return;out=out.replace(new RegExp('('+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>')});return out}
  var SUGGEST=['Highlights','Jennings','Syracuse',"Mic'd Up",REC_ON?'portal':'Podcasts','basketball'];
  function runSearch(){if(!INDEX)buildIndex();var q=sInput.value.trim().toLowerCase(),toks=q.split(/\s+/).filter(Boolean);sActive=-1;
    if(!toks.length){sItems=[];sRes.innerHTML='<div class="s-hint"><p class="eyebrow">Try</p><div class="chips">'+SUGGEST.map(function(s){return '<button type="button" class="chip" data-q="'+s+'">'+s+'</button>'}).join('')+'</div></div>';sInput.removeAttribute('aria-activedescendant');return}
    var hits=INDEX.map(function(x){var h=x.hay.toLowerCase(),tl=x.title.toLowerCase();if(!toks.every(function(t){return h.indexOf(t)>=0}))return null;
      return {x:x,s:(tl.indexOf(q)===0?6:0)+(tl.indexOf(q)>=0?4:0)+toks.filter(function(t){return tl.indexOf(t)>=0}).length}}).filter(Boolean).sort(function(a,b){return b.s-a.s});
    if(!hits.length){sItems=[];sRes.innerHTML=emptyState('search','No matches for \u201c'+esc(sInput.value.trim())+'\u201d','Check the spelling, or try a player, a sport or a series name.','<div class="chips">'+SUGGEST.slice(0,4).map(function(s){return '<button type="button" class="chip" data-q="'+s+'">'+s+'</button>'}).join('')+'</div>');return}
    var html='',n=0;['Watch & read','Players','Boards','Sports'].forEach(function(g){var gh=hits.filter(function(h){return h.x.g===g}).slice(0,5);if(!gh.length)return;
      html+='<div class="s-group" role="group" aria-label="'+g+'"><p class="s-gh">'+g+'</p>'+gh.map(function(h){var x=h.x,i=n++;
        return '<a class="s-item" role="option" id="s-'+i+'" aria-selected="false" href="'+(x.href||'#')+'"'+(x.item?' data-sitem="'+x.item+'"':'')+'><span class="s-ic ic-'+x.ic+'">'+(x.ic==='video'?TICON.video:x.ic==='article'?TICON.article:x.ic==='podcast'?TICON.podcast:SVG[x.ic])+'</span><span class="s-b"><b>'+hl(x.title,toks)+'</b><small>'+esc(x.k)+' · '+esc(x.sub)+'</small></span><span class="s-go" aria-hidden="true">↵</span></a>'}).join('')+'</div>'});
    sRes.innerHTML=html;sItems=$$('.s-item',sRes);setActive(0)}
  function setActive(i){if(!sItems.length)return;sActive=(i+sItems.length)%sItems.length;sItems.forEach(function(el,j){el.setAttribute('aria-selected',j===sActive?'true':'false')});
    sInput.setAttribute('aria-activedescendant',sItems[sActive].id);sItems[sActive].scrollIntoView({block:'nearest'})}
  function openSearch(){search.hidden=false;document.documentElement.classList.add('noscroll');sInput.value='';runSearch();sInput.focus()}
  function closeSearch(){if(search.hidden)return;search.hidden=true;if(reader.hidden&&pw.hidden)document.documentElement.classList.remove('noscroll')}
  function activate(el){var id=el.dataset.sitem;closeSearch();if(id){openItem(id)}else location.href=el.getAttribute('href')}
  /* Header search: one field. Wide screens show it inline; narrower screens get an icon that drops the field open under the header. */
  /* Search lives in the menu (phones) and the nav (desktop); '/' and Ctrl/Cmd+K go to the search page, or focus its field there. */
  function hsFocus(){var f=$('#srchQ');if(f){f.focus();return}location.href=ROOT+'search/'}
  document.addEventListener('submit',function(e){if(e.target.classList&&e.target.classList.contains('mm-sf')){var q=$('#mmQ');if(!q.value.trim()){e.preventDefault();q.focus()}}});
  $('#searchClose').addEventListener('click',closeSearch);
  search.addEventListener('click',function(e){if(e.target===search){closeSearch();return}var ch=e.target.closest('[data-q]');if(ch){sInput.value=ch.dataset.q;runSearch();sInput.focus();return}
    var it=e.target.closest('.s-item');if(it){e.preventDefault();e.stopPropagation();activate(it)}});
  sRes.addEventListener('mousemove',function(e){var it=e.target.closest('.s-item');if(it){var i=sItems.indexOf(it);if(i!==sActive)setActive(i)}});
  sInput.addEventListener('input',runSearch);
  sInput.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){e.preventDefault();setActive(sActive+1)}else if(e.key==='ArrowUp'){e.preventDefault();setActive(sActive-1)}
    else if(e.key==='Enter'){e.preventDefault();if(sItems[sActive])activate(sItems[sActive])}});
  document.addEventListener('keydown',function(e){var typing=/INPUT|TEXTAREA|SELECT/.test((e.target.tagName||''));
    if(e.key==='Escape'){if(!search.hidden){closeSearch();return}if(!pw.hidden){closePaywall();return}closeModal();closeArticle();return}
    if((e.key==='/'&&!typing)||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k')){e.preventDefault();hsFocus()}});

  /* ---------- Header fit: collapse lowest-priority nav links into the menu before anything overlaps ---------- */
  /* Skip link (a11y): first tab stop on every page, jumps past the header to <main>. Header markup untouched. */
  (function(){var m=$('main');if(!m||$('.skip-link'))return;if(!m.id)m.id='main';if(!m.hasAttribute('tabindex'))m.setAttribute('tabindex','-1');document.body.insertAdjacentHTML('afterbegin','<a class="skip-link" href="#'+m.id+'">Skip to content</a>')})();
  (function(){var nav=$('nav.main'),hd=$('header.site');if(!nav||!hd)return;var links=Array.prototype.slice.call(nav.children);
    function fit(){links.forEach(function(a){a.classList.remove('nav-x')});hd.classList.remove('nav-collapsed');
      if(innerWidth<960)return;var i=links.length-1;
      var over=function(){var nr=nav.getBoundingClientRect().right;return links.some(function(a){return !a.classList.contains('nav-x')&&a.getBoundingClientRect().right>nr-2})};
      while(i>=0&&over()){links[i].classList.add('nav-x');hd.classList.add('nav-collapsed');i--}}
    window.fitNav=fit;var t;addEventListener('resize',function(){cancelAnimationFrame(t);t=requestAnimationFrame(fit)});
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
    if(window.ResizeObserver){var ro=new ResizeObserver(function(){cancelAnimationFrame(t);t=requestAnimationFrame(fit)});ro.observe($('.hdr-act'));ro.observe($('.hdr'))}fit()})();

  /* ---------- Measured header height for sticky offsets (sport/athlete sub-nav) ---------- */
  (function(){var h=$('header.site');if(!h)return;function set(){document.documentElement.style.setProperty('--hdr-h',Math.round(h.getBoundingClientRect().height)+'px')}
    set();if(window.ResizeObserver)new ResizeObserver(set).observe(h);addEventListener('resize',set)})();
  /* Focus ring only for keyboard use: a tap or click marks html.pointer (hides rings, including focus moved by script); any key clears it */
  addEventListener('pointerdown',function(){document.documentElement.classList.add('pointer')},true);
  addEventListener('keydown',function(e){if(e.key==='Tab'||e.key.indexOf('Arrow')===0)document.documentElement.classList.remove('pointer')},true);
  /* ---------- Mobile menu ---------- */
  var mm=$('#mmenu'),mb=$('#menuBtn'),hdrEl=$('header.site');
  function mmFocusables(){return [mb].concat($$('a,button,input',mm).filter(function(x){return x.offsetParent!==null}))}
  function openMenu(){mm.style.top=Math.max(0,hdrEl.getBoundingClientRect().bottom)+'px';mm.hidden=false;
    document.documentElement.classList.add('noscroll','menu-open');mb.setAttribute('aria-expanded','true');mb.setAttribute('aria-label','Close menu');
    requestAnimationFrame(function(){mm.classList.add('open')});var f=$('.mm-nav > a, .mm-nav > button',mm);if(f)f.focus({preventScroll:true})}
  function closeMenu(restore){if(mm.hidden)return;mm.classList.remove('open');mm.hidden=true;document.documentElement.classList.remove('menu-open');
    if(reader.hidden&&pw.hidden&&search.hidden)document.documentElement.classList.remove('noscroll');
    mb.setAttribute('aria-expanded','false');mb.setAttribute('aria-label','Open menu');if(restore)mb.focus()}
  mb.addEventListener('click',function(){if(mm.hidden)openMenu();else closeMenu(true)});
  mm.addEventListener('click',function(e){
    if(e.target.closest('a'))closeMenu();
    if(e.target.closest('[data-demo]'))closeMenu()});
  document.addEventListener('keydown',function(e){if(mm.hidden)return;
    if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeMenu(true);return}
    if(e.key==='Tab'){var f=mmFocusables(),i=f.indexOf(document.activeElement);
      if(e.shiftKey&&(i<=0)){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}},true);
  var wideMQ=window.matchMedia('(min-width:960px)');(wideMQ.addEventListener?wideMQ.addEventListener('change',function(q){if(q.matches)closeMenu()}):wideMQ.addListener(function(q){if(q.matches)closeMenu()}));
  window.addEventListener('pageshow',function(){closeMenu()});

  /* ---------- Sports dropdown (desktop) and accordion (phone menu) ---------- */
  /* One dropdown helper for Sports and Media: desktop panel (hover, click, arrow keys, Esc) and phone-menu accordion */
  function navDD(bid,did,aid,lid,isSports){var btn=$('#'+bid),dd=$('#'+did),acc=$('#'+aid),list=$('#'+lid),hov=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches,ht;
    function place(){var r=btn.getBoundingClientRect(),w=dd.offsetWidth,l=Math.min(Math.max(8,r.left),innerWidth-w-8);dd.style.left=l+'px';dd.style.top=Math.round(hdrEl.getBoundingClientRect().bottom)+'px'}
    function open(focus){if(!btn||!dd)return;dd.hidden=false;place();btn.setAttribute('aria-expanded','true');if(focus){var a=$('a',dd);if(a)a.focus()}}
    function close(back){if(!dd||dd.hidden)return;pinned=false;dd.hidden=true;btn.setAttribute('aria-expanded','false');if(back)btn.focus()}
    function setAcc(on){if(!acc)return;list.hidden=!on;acc.setAttribute('aria-expanded',on?'true':'false')}
    if(isSports)window.openSports=function(){if(btn&&innerWidth>=960&&btn.offsetParent!==null&&!btn.classList.contains('nav-x'))open(true);else{openMenu();setAcc(true);var a=$('a',list);if(a)a.focus({preventScroll:true})}};
    var pinned=false;
    if(btn&&dd){btn.addEventListener('click',function(){if(dd.hidden||!pinned){pinned=true;open(false)}else close(false)});
      btn.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){e.preventDefault();pinned=true;open(true)}});
      dd.addEventListener('keydown',function(e){var a=$$('a',dd),i=a.indexOf(document.activeElement);
        if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();a[(i+(e.key==='ArrowDown'?1:a.length-1))%a.length].focus()}
        else if(e.key==='Tab'&&((e.shiftKey&&i===0)||(!e.shiftKey&&i===a.length-1)))close(false)});
      if(hov){[btn,dd].forEach(function(el){el.addEventListener('mouseenter',function(){clearTimeout(ht);open(false)});el.addEventListener('mouseleave',function(){clearTimeout(ht);if(!pinned)ht=setTimeout(function(){close(false)},180)})})}
      document.addEventListener('click',function(e){if(!dd.hidden&&!e.target.closest('#'+did+',#'+bid))close(false)});
      dd.addEventListener('focusout',function(e){if(!dd.hidden&&e.relatedTarget&&!dd.contains(e.relatedTarget)&&e.relatedTarget!==btn)close(false)});
      document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!dd.hidden){e.stopPropagation();close(true)}},true);
      addEventListener('resize',function(){if(!dd.hidden){if(innerWidth<960)close(false);else place()}});addEventListener('scroll',function(){if(!dd.hidden)place()},{passive:true})}
    if(acc)acc.addEventListener('click',function(){setAcc(list.hidden)});
    if(!isSports)return;
    document.addEventListener('click',function(e){var a=e.target.closest('a[href$="#sports"]');if(!a)return;e.preventDefault();e.stopPropagation();window.openSports()},true);
    if(location.hash==='#sports'){history.replaceState(null,'',location.pathname+location.search);setTimeout(window.openSports,60)}}
  navDD('sportsBtn','sportsMenu','mmSportsBtn','mmSports',true);navDD('mediaBtn','mediaMenu','mmMediaBtn','mmMedia',false);

  /* ---------- Sortable tables ---------- */
  var MONTHS={jan:1,feb:2,mar:3,apr:4,may:5,jun:6,jul:7,aug:8,sep:9,sept:9,oct:10,nov:11,dec:12};
  function sortKey(td){var v=td.dataset.v!=null?td.dataset.v:td.textContent.trim();if(v===''||v==='\u2014'||v==='-')return null;
    if(/^★+$/.test(v))return v.length;var m=v.match(/^([A-Za-z]{3,4})\.? (\d+)/);if(m&&MONTHS[m[1].toLowerCase()])return MONTHS[m[1].toLowerCase()]*100+(+m[2]);
    if(/^-?[\d,.]+\*?$/.test(v))return parseFloat(v.replace(/[,*]/g,''));return v.toLowerCase()}
  function sortable(tbl){if(!tbl)return;var ths=$$('thead th',tbl);
    ths.forEach(function(th,i){th.setAttribute('aria-sort','none');th.innerHTML='<button type="button" class="th-sort">'+th.innerHTML+'<span class="si" aria-hidden="true"></span></button>';
      th.firstChild.addEventListener('click',function(){var cur=th.getAttribute('aria-sort'),num=th.classList.contains('n');
        var dir=cur==='none'?(num?'descending':'ascending'):cur==='ascending'?'descending':'ascending';ths.forEach(function(x){x.setAttribute('aria-sort','none')});th.setAttribute('aria-sort',dir);
        var tb=tbl.tBodies[0],rows=$$('tr',tb).filter(function(r){return !r.classList.contains('tot')}),tot=$('tr.tot',tb);
        rows.sort(function(a,b){var x=sortKey(a.cells[i]),y=sortKey(b.cells[i]);if(x===null&&y===null)return 0;if(x===null)return 1;if(y===null)return -1;
          var r=typeof x==='number'&&typeof y==='number'?x-y:String(x).localeCompare(String(y));return dir==='ascending'?r:-r});
        rows.forEach(function(r){tb.appendChild(r)});if(tot)tb.appendChild(tot)})})}

  /* ---------- Shared bits ---------- */
  /* Member photo if they uploaded one (sb.js only keeps URLs from our own avatars bucket, or a demo data: URL); initials otherwise.
     The initial sits under the photo, so a photo that fails to load (see avFix) falls back to it. */
  function avPhoto(u){return u&&!u.staff&&u.av&&window.SMU&&SMU.avatarsOn()&&SMU.avatarOK(u.av)?u.av:''}
  function avImg(src,eager){return '<img class="av-img" src="'+esc(src)+'" alt="" width="256" height="256" decoding="async"'+(eager?'':' loading="lazy"')+'>'}
  function avatar(uid,lg,xl){var u=MP.USERS[uid]||{n:'Member'},n=u.n.replace(/[^A-Za-z]/g,''),ph=avPhoto(u);
    var hues=['#354CA1','#1c2a63','#2a3d86','#4259b0','#CC0035'],h=0;for(var i=0;i<n.length;i++)h+=n.charCodeAt(i);
    return '<span class="av'+(lg?' lg':'')+(xl?' xl':'')+(u.staff?' staff':'')+(ph?' has-ph':'')+'" style="'+(u.staff?'':'background:'+hues[h%hues.length])+'" aria-hidden="true">'+(n.charAt(0).toUpperCase()||'M')+(ph?avImg(ph,xl):'')+'</span>'}
  function avFix(e){var i=e.target;if(i&&i.tagName==='IMG'&&i.classList&&i.classList.contains('av-img')){var p=i.parentNode;i.remove();if(p&&p.classList)p.classList.remove('has-ph')}}
  document.addEventListener('error',avFix,true);
  function forumBy(id){for(var i=0;i<MP.FORUMS.length;i++)if(MP.FORUMS[i].id===id)return MP.FORUMS[i]}
  function pills(t){var f=forumBy(t.f),s=t.sport&&sportBy(t.sport),p='';
    if(t.pin)p+='<span class="pill pill-pin">'+PIN+'Pinned</span>';if(t.hot)p+='<span class="pill pill-hot">'+FLAME+'Hot</span>';
    if(GATING&&f.prem)p+='<span class="pill pill-prem">'+LOCK+'Members</span>';p+='<span class="pill">'+esc(f.name)+'</span>';if(s)p+='<span class="pill">'+esc(s.name)+'</span>';return p}
  function lastBy(t){var p=t.posts[t.posts.length-1];return p[0]}
  function lastAgo(t){var m={m:1,h:60,d:1440,w:10080},x=t.ago.match(/(\d+)(\w)/),v=x?(+x[1])*(m[x[2]]||1):60;v=Math.max(1,Math.round(v/(t.posts.length+1)));return v<60?v+'m':v<1440?Math.round(v/60)+'h':Math.round(v/1440)+'d'}
  function nReplies(t){return t.replies==null?'':t.replies.toLocaleString()}
  function postsBy(id){var n=0;MP.THREADS.forEach(function(t){t.posts.forEach(function(p){if(p[0]===id)n++})});return n}
  function threadRow(t,compact){var u=MP.USERS[t.by],lu=MP.USERS[lastBy(t)];
    return '<a class="trow'+(compact?' compact':'')+'" href="'+threadUrl(t.id)+'">'+avatar(t.by)+'<div class="trow-main"><div class="pills">'+pills(t)+'</div><p class="t-title">'+esc(t.title)+'</p>'+
      '<p class="t-meta">Started by <b>'+esc(u.n)+'</b> · '+t.ago+' ago'+(t.replies==null?'':'<span class="t-mob"> · '+nReplies(t)+(t.replies===1?' reply':' replies')+'</span>')+'</p></div>'+
      (compact?'':'<span class="num">'+nReplies(t)+'</span><span class="t-last"><b>'+esc(lu.n)+'</b><small>'+lastAgo(t)+' ago</small></span>')+'</a>'}
  function profileCard(a){
    return '<a class="pcard" href="'+athleteUrl(a.id)+'">'+(a.cardPhoto?'<span class="pc-pic has-photo">'+photo(a.cardPhoto,{small:1})+'</span>':'<span class="pc-pic" style="background:'+KIT_BG[a.kit]+'">'+kit(a.num,a.kit)+'</span>')+
      '<span class="pc-b"><small>#'+a.num+' · '+a.pos+' · '+a.cls+'</small><b>'+esc(a.name)+'</b><span>'+esc(a.hometown)+'</span>'+(a.cardPhoto?'<small class="pc-credit">Photo: SMU Athletics</small>':'')+'</span></a>'}
  function table(t,opt){opt=opt||{};var numCol=t.cols.map(function(c,i){return t.rows.every(function(r){return /^[-+]?[\d,.]+\*?$|^-$|^\d+-\d+$/.test(String(r[i]))})&&!/^(Year|Date)$/.test(c)});
    var cell=function(v,i,tag){return '<'+tag+(numCol[i]?' class="n"':'')+'>'+(v&&v.html?v.html:esc(v))+'</'+tag+'>'};
    return '<div class="tbl-wrap"><table class="tbl'+(opt.cls?' '+opt.cls:'')+'">'+(opt.caption?'<caption class="sr">'+opt.caption+'</caption>':'')+'<thead><tr>'+t.cols.map(function(c,i){return cell(c,i,'th')}).join('')+'</tr></thead><tbody>'+
      t.rows.map(function(r){return '<tr>'+r.map(function(v,i){return cell(v,i,'td')}).join('')+'</tr>'}).join('')+
      (t.total?'<tr class="tot">'+t.total.map(function(v,i){return cell(v,i,'td')}).join('')+'</tr>':'')+'</tbody></table></div>'}
  function stars(n){return '<span class="stars" aria-label="'+n+' stars">'+'★★★★★'.slice(0,n)+'<i>'+'★★★★★'.slice(n)+'</i></span>'}

  /* ---------- Game day strip (real schedule, fictional commentary) ---------- */
  var SCH=MP.SCHEDULE,MON=['Jan.','Feb.','March','April','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'];
  function gDate(x){var d=new Date(x.d+'T12:00:00Z');return x.day+'., '+MON[d.getUTCMonth()]+' '+d.getUTCDate()}
  function gTime(x){if(!x.ko)return 'TBA';var h=+x.ko.substr(11,2),m=x.ko.substr(14,2);return (h%12||12)+(m!=='00'?':'+m:'')+' '+(h<12?'a.m.':'p.m.')+' CT'}
  function gWhen(x){return x.ko?Date.parse(x.ko):Date.parse(x.d+'T23:59:00-06:00')}
  /* Game day block (next game + last final). One component for every sport that has it: gameFeed() turns football's MP.SCHEDULE
     or a sport's real SMU Athletics schedule (MP.REAL) into the same shape, so football and basketball share markup and CSS. */
  var GD_SPORTS={football:{bg:'gd-football',act:'jennings-celebrate',verb:'Kickoff',thread:2},
    'mens-basketball':{bg:'gd-mbb',act:'mbb-layup',verb:'Tip-off'},
    'womens-basketball':{bg:'gd-wbb',act:'wbb-jumper',verb:'Tip-off'}};
  var DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  /* '7 p.m. CT' / '11 am CT' -> ISO kickoff in Central time (CDT until Nov. 1, 2026, CST after); null when TBA/TBD */
  function ctISO(d,t){var m=String(t||'').match(/^(\d{1,2})(?::(\d\d))?\s*(a\.?m\.?|p\.?m\.?)/i);if(!m)return null;var h=+m[1]%12+(/^p/i.test(m[3])?12:0);
    var dst=d>='2026-03-08'&&d<'2026-11-01'||d>='2027-03-14'&&d<'2027-11-07';return d+'T'+(h<10?'0':'')+h+':'+(m[2]||'00')+':00'+(dst?'-05:00':'-06:00')}
  function gameFeed(slug){var R=slug!=='football'&&MP.REAL&&MP.REAL[slug];
    if(slug==='football')return SCH?SCH.games:null;if(!R||!R.events)return null;
    return R.events.map(function(e){return {d:e.d,day:DOW[new Date(e.d+'T12:00:00Z').getUTCDay()],opp:e.name,home:e.ha!=='away',neutral:e.ha==='neutral',
      site:e.where||'TBA',ko:ctISO(e.d,e.time),tv:e.tv||'',res:e.res||'',ex:!!e.ex}})}
  function nextGame(G){G=G||(SCH&&SCH.games)||[];var now=Date.now();return G.filter(function(x){return !x.res&&gWhen(x)+4*3600e3>now})[0]||null}
  function lastGame(G){G=G||(SCH&&SCH.games)||[];var r=null;G.forEach(function(x){if(x.res)r=x});return r}
  function matchup(x){return 'SMU '+(x.home?'vs.':'at')+' '+x.opp}
  function gameStrip(slug){slug=slug||'football';var G=gameFeed(slug),C=GD_SPORTS[slug];if(!G||!C)return '';
    var sp=sportBy(slug),name=sp?sp.name:'Football',n=nextGame(G),l=lastGame(G),H=slug==='football'?MP.HURRYUP:null,
      sched=sportUrl(slug)+'#schedule',thr=n&&gameFor(slug,n.d)?gameThreadUrl(gameFor(slug,n.d)):C.thread?threadUrl(C.thread):sportUrl(slug)+'#board';
    var sc=l?l.res.match(/^([WL]) (\d+)-(\d+)/):null,us=sc?+sc[2]:0,them=sc?+sc[3]:0,exh=function(x){return x.ex?' (exh.)':''};
    return '<div class="gd-grid">'+
      (n?'<div class="gd-next">'+photoBg(C.bg,{gd:1,sizes:'(min-width:960px) 50vw, (min-width:640px) 100vw, 170vw'})+'<div class="gd-in"><p class="eyebrow"><span class="live-dot"></span>Next game · '+esc(name)+(n.ex?' · Exhibition':'')+'</p>'+
        '<h2 class="gd-title">'+(n.home?'SMU <span>vs.</span> ':'SMU <span>at</span> ')+esc(n.opp)+'</h2>'+
        '<dl class="gd-facts"><div><dt>Date</dt><dd>'+gDate(n)+'</dd></div><div><dt>'+C.verb+'</dt><dd>'+gTime(n)+'</dd></div><div><dt>Where</dt><dd>'+esc(n.site)+'</dd></div><div><dt>TV</dt><dd>'+(n.tv?esc(n.tv):'TBA')+'</dd></div></dl>'+
        '<div class="cd" data-ko="'+gWhen(n)+'" data-tba="'+(n.ko?'':'1')+'" role="timer" aria-label="Countdown to '+C.verb.toLowerCase()+'">'+['Days','Hrs','Min','Sec'].map(function(u){return '<div><b>--</b><small>'+u+'</small></div>'}).join('')+'</div>'+
        '<div class="gd-act"><a class="btn btn-red btn-sm" href="'+(gameFor(slug,n.d)?gameUrl(gameFor(slug,n.d)):sched)+'">Preview matchup</a><a class="btn btn-ghost btn-sm" href="'+thr+'">View thread</a></div>'+
        (n.note?'<p class="gd-note">'+esc(n.note)+'</p>':'')+'</div></div>':'<div class="gd-next"><div class="gd-in"><p class="eyebrow">'+esc(name)+'</p><h2 class="gd-title">Season complete</h2></div></div>')+
      (l&&sc?'<article class="gd-hurry"><div class="gd-hph">'+photo((H&&H.photo&&H.photo[l.d])||C.act,{small:1})+creditOf((H&&H.photo&&H.photo[l.d])||C.act)+'</div><div class="gd-hb">'+
        '<div class="score" role="group" aria-label="Final'+(l.ex?', exhibition':'')+', '+gDate(l)+': SMU '+us+', '+esc(l.opp)+' '+them+'"><span class="sc-t'+(us>them?' win':'')+'"><b>SMU</b><em>'+us+'</em></span><span class="sc-f"><b>Final'+(l.ex?' · Exh.':'')+'</b>'+gDate(l)+'</span><span class="sc-t sc-r'+(them>us?' win':'')+'"><em>'+them+'</em><b>'+esc(l.opp)+'</b></span></div>'+
        (gameFor(slug,l.d)?'<a class="gd-glink" href="'+gameUrl(gameFor(slug,l.d))+'">'+esc(matchup(l))+' game page<span aria-hidden="true"> \u2192</span></a>':'')+
        '</div></article>':'')+
      '</div>'}
  function tickCountdowns(){$$('.cd[data-ko]').forEach(function(el){var t=+el.dataset.ko,d=Math.max(0,t-Date.now()),b=$$('b',el);
    var v=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60];
    if(el.dataset.tba){b[0].textContent=v[0];b[1].textContent=b[2].textContent=b[3].textContent='\u2013'}else v.forEach(function(x,i){b[i].textContent=(i&&x<10?'0':'')+x})})}
  function startCountdowns(){tickCountdowns();if($('.cd[data-ko]'))setInterval(tickCountdowns,1000)}
  /* Game-day hub (games/?id=...): MP.GAMES from assets/games.js, built by tools/build_gameday.py from the official SMU
     Athletics schedule pages. One page per game for football and both basketball teams (latest result + every upcoming game). */
  var GAMES=(MP.GAMES&&MP.GAMES.games)||[],GBY={};GAMES.forEach(function(g){GBY[g.id]=g});
  function gameFor(slug,d){for(var i=0;i<GAMES.length;i++)if(GAMES[i].sport===slug&&GAMES[i].d===d)return GAMES[i];return null}
  function gameUrl(g){return ROOT+'games/?id='+g.id}
  /* Game threads: boards/#game=<id> finds the game's thread (created on first visit, supabase RUN_ME_24) and opens it */
  /* SMU's official StatBroadcast box score (id from the SMU Athletics schedule card). Link out only: nothing from it is shown here. */
  function sbUrl(id){return /^\d{3,9}$/.test(String(id||''))?'https://statbroadcast.com/broadcast/?id='+id:null}
  function gameThreadUrl(g){return ROOT+'boards/#game='+g.id}
  /* Pinned score box on a game thread: matchup, time and TV before the game; the official final from the schedule data
     after it. No live scores are shown here: during the game it points to the official Game Center. */
  function gtBox(g){var sp=sportBy(g.sport),C=GM_SPORT[g.sport]||{verb:'Start'},L=g.links||{},ko=g.ko?Date.parse(g.ko):null,now=Date.now(),
      state=g.res?'final':(ko&&now>=ko?'live':'pre'),where=[g.venue,g.city].filter(Boolean).join(', ');
    var gc=L.gamecenter?'<p class="gt-live">Live score on <a href="'+esc(L.gamecenter)+'" target="_blank" rel="noopener">the official SMU Athletics Game Center'+EXT+'</a></p>':'';
    return '<section class="gt-box gt-'+state+'" aria-label="Score box: SMU '+gmVs(g)+' '+esc(g.opp)+'">'+
      '<div class="gt-hd"><p class="gt-sp">'+esc(sp?sp.name:'')+(g.ex?' · Exhibition':'')+'</p><p class="gt-t">SMU '+gmVs(g)+' '+esc(g.opp)+'</p>'+
        '<p class="gt-st">'+(state==='final'?'Final':state==='live'?'Under way':'Upcoming')+'</p></div>'+
      (state==='final'&&gmScore(g)?gmScore(g)+'<p class="gt-links">'+gmOut(L.box,'Box score')+gmOut(L.recap,'Recap')+gmOut(sbUrl(g.sb),'Live stats')+gmOut(L.gamecenter,'Game Center')+'<a class="gm-out" href="'+gameUrl(g)+'">Game page</a></p>':
        '<dl class="gt-facts">'+gmFact('Date',gmDate(g,1))+gmFact(C.verb,g.time)+gmFact('TV',g.tv)+gmFact('Radio',g.radio)+(where?gmFact('Where',where):'')+'</dl>'+gc+
        '<p class="gt-links">'+gmOut(sbUrl(g.sb),'Live stats')+gmOut(L.watch,'Watch')+gmOut(L.listen,'Listen')+'<a class="gm-out" href="'+gameUrl(g)+'">Game page</a></p>')+
      '</section>'}
  function gmDate(g,long){var d=new Date(g.d+'T12:00:00Z'),y=d.getUTCFullYear();return (long?g.dow+'., ':'')+MON[d.getUTCMonth()]+' '+d.getUTCDate()+(long||y!==2026?', '+y:'')}
  function gmVs(g){return g.ha==='away'?'at':'vs.'}

  /* ---------- Continue watching ---------- */
  /* Continue watching: Library only. Hidden when nothing is in progress. */
  function continueRow(){var el=$('#railContinue');if(!el)return;var sec=el.closest('section'),h=hist().filter(function(x){return LIBBY[x.id]&&x.p<0.97});
    if(!h.length){el.innerHTML='';if(sec)sec.hidden=true;return}if(sec)sec.hidden=false;
    el.innerHTML='<div class="sec-hd"><div><h2 class="sec-t">Continue watching</h2></div><button type="button" class="see-all linkish-plain" id="clearHist">Clear history</button></div>'+rail(h.slice(0,8).map(function(x){return LIBBY[x.id]}),{progress:true});
    var c=$('#clearHist');if(c)c.addEventListener('click',function(){try{localStorage.removeItem('mp_history')}catch(e){}continueRow()})}

  /* ---------- From the feeds (media batch 1): official X posts + verified accounts to follow ----------
     Posts load from X on their own: X's widgets.js is added once, when a feed row comes within ~400px of the viewport, and turns each
     blockquote into X's official embed. Each blockquote is also the fallback card (author, date, link to the post on X) if X is blocked or fails.
     data-no-ads: keep ad slots out of this section and away from embedded posts and videos (ad-mock copy follows this). */
  var FEEDS=MP.FEEDS||{posts:{},follow:{}},FO_L={x:'X',instagram:'Instagram',youtube:'YouTube',tiktok:'TikTok'};
  /* Follow rows: each account as a mini X-style profile card (banner, round avatar, name, handle, the account's own bio, icon links),
     in one sideways swipe row per group. Avatars and banners are self-hosted copies (assets/img/x/), so nothing loads from X before a tap. */
  var XPROF=MP.XPROF||{},FO_I={
    x:'<path d="M3 3h4.2l3.6 5 4.2-5H17l-5.3 6.3L18 17h-4.2l-3.9-5.4L5.3 17H3.4l5.7-6.7z"/>',
    instagram:'<path d="M7 2.5h6A4.5 4.5 0 0 1 17.5 7v6a4.5 4.5 0 0 1-4.5 4.5H7A4.5 4.5 0 0 1 2.5 13V7A4.5 4.5 0 0 1 7 2.5zm0 1.8A2.7 2.7 0 0 0 4.3 7v6A2.7 2.7 0 0 0 7 15.7h6a2.7 2.7 0 0 0 2.7-2.7V7A2.7 2.7 0 0 0 13 4.3zm3 2.4a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6zm0 1.8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM14.2 4.9a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z"/>',
    youtube:'<path d="M18 6.3c-.2-.9-.9-1.6-1.8-1.8C14.6 4 10 4 10 4s-4.6 0-6.2.5C2.9 4.7 2.2 5.4 2 6.3 1.6 7.9 1.6 10 1.6 10s0 2.1.4 3.7c.2.9.9 1.6 1.8 1.8C5.4 16 10 16 10 16s4.6 0 6.2-.5c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-3.7.4-3.7s0-2.1-.4-3.7zM8.3 12.6V7.4L12.6 10z"/>',
    tiktok:'<path d="M13.6 2.5c.3 1.9 1.4 3.1 3.4 3.3v2.4c-1.2.1-2.3-.3-3.4-1v4.9c0 3.4-2.6 5.4-5.5 5.4A5 5 0 0 1 3 12.5c0-3.1 2.6-5.3 5.9-4.9v2.5c-1.6-.3-3.3.6-3.3 2.4 0 1.4 1.1 2.5 2.6 2.5s2.6-1 2.6-2.8V2.5z"/>'};
  function foCheck(v){return '<svg class="fo-v fo-v-'+(v==='business'?'g':'b')+'" viewBox="0 0 20 20" width="15" height="15" role="img" aria-label="Verified account"><path d="M10 1.5l2.3 1.7 2.8-.2.9 2.7 2.4 1.5-.9 2.7.9 2.7-2.4 1.5-.9 2.7-2.8-.2L10 18.5l-2.3-1.7-2.8.2-.9-2.7-2.4-1.5.9-2.7-.9-2.7 2.4-1.5.9-2.7 2.8.2z"/><path d="M6.5 10.2l2.3 2.3 4.8-5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
  function foCard(a){var h=a[1],k=h.toLowerCase(),p=XPROF[k]||{},nm=p.n||a[0],ban=p.ban?ROOT+'assets/img/x/'+k+'-banner.webp':'';
    var chk=p.v?foCheck(p.v):'';
    return '<li class="fo-card"><div class="fo-ban">'+(ban?'<img src="'+ban+'" alt="" loading="lazy" decoding="async" width="600" height="200">':'')+'</div>'+
      '<img class="fo-av" src="'+ROOT+'assets/img/x/'+k+'.webp" alt="" loading="lazy" decoding="async" width="96" height="96">'+
      '<div class="fo-body"><p class="fo-nm"><b>'+esc(nm)+'</b>'+chk+'</p><p class="fo-h">@'+esc(h)+'</p>'+(p.b?'<p class="fo-bio">'+esc(p.b)+'</p>':'')+
      (a[3]?'<p class="fo-d">'+esc(a[3])+'</p>':'')+
      '<p class="fo-links">'+Object.keys(FO_L).filter(function(t){return a[2][t]}).map(function(t){
        return '<a class="fo-a" href="'+esc(a[2][t])+'" target="_blank" rel="noopener" aria-label="'+esc(a[0])+' on '+FO_L[t]+' (opens in a new tab)" title="'+FO_L[t]+'"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="currentColor">'+FO_I[t]+'</svg></a>'}).join('')+'</p></div></li>'}
  var XARR='<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SLN=0;
  /* Follow rows use the same side arrows as the X posts row: one per side, centered on the cards, hidden when nothing scrolls */
  /* Player cards for the follow section: X and Instagram accounts from assets/socials.js (verified Oct. 26, 2026), laid out like the team cards.
     Banner, avatar, verified check and bio come from the player's own X profile (MP.XPROF, self-hosted copies in assets/img/x/) when they have one;
     otherwise the avatar is their official SMU Athletics roster headshot, else the jersey number, on a plain blue banner. */
  function plCard(p){var a=p.ath,ph=a&&PH[a.photo],xa=p.acc.filter(function(x){return x[0]==='x'})[0],k=xa?xa[1].toLowerCase():'',x=k&&XPROF[k]||null;
    var av=x?'<img class="fo-av" src="'+ROOT+'assets/img/x/'+k+'.webp" alt="" loading="lazy" decoding="async" width="96" height="96">':
      ph?'<img class="fo-av" src="'+ROOT+'assets/photos/'+(ph.small||ph.file)+'" alt="" loading="lazy" decoding="async" width="96" height="96" style="object-position:50% 18%">':'<span class="fo-av fo-num" aria-hidden="true">'+esc(p.num)+'</span>';
    return '<li class="fo-card fo-pc"><div class="fo-ban">'+(x&&x.ban?'<img src="'+ROOT+'assets/img/x/'+k+'-banner.webp" alt="" loading="lazy" decoding="async" width="600" height="200">':'')+'</div>'+av+
      '<div class="fo-body"><p class="fo-nm"><b>'+esc(p.name)+'</b>'+(x&&x.v?foCheck(x.v):'')+'</p><p class="fo-h">#'+esc(p.num)+(p.pos?' · '+esc(p.pos):'')+' · Player</p>'+(x&&x.b?'<p class="fo-bio">'+esc(x.b)+'</p>':'')+
      '<p class="fo-links">'+p.acc.map(function(x){return '<a class="fo-a" href="'+esc(x[2])+'" target="_blank" rel="noopener nofollow" aria-label="'+esc(p.name)+' on '+FO_L[x[0]]+', @'+esc(x[1])+' (opens in a new tab)" title="'+FO_L[x[0]]+' @'+esc(x[1])+'"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="currentColor">'+FO_I[x[0]]+'</svg></a>'}).join('')+'</p></div></li>'}
  function playerFollow(slug){var S=(MP.SOCIALS||{})[slug],R=(MP.REAL||{})[slug];if(!S)return [];
    return Object.keys(S).map(function(k){var i=k.indexOf('|'),num=k.slice(0,i),nm=k.slice(i+1),acc=S[k].filter(function(x){return x[0]==='x'||x[0]==='instagram'});
      var r=R&&(R.roster||[]).filter(function(p){return p.num===num&&p.name===nm})[0],ath=(MP.ATHLETES||[]).filter(function(a){return a.sport===slug&&a.name===nm})[0];
      return {num:num,name:nm,pos:r?r.pos:ath?ath.pos:'',ath:ath,acc:acc}}).filter(function(p){return p.acc.length}).sort(function(a,b){return a.num-b.num||(a.name<b.name?-1:1)})}
  function followRow(list,h,card){if(!list||!list.length)return '';var id='fo-track-'+(++SLN);
    return '<div class="follow"><h3 class="follow-h">'+h+'</h3><div class="xwrap" data-xnav="'+id+'"><button type="button" class="xarr xside xprev" data-xdir="-1" aria-label="Previous accounts" aria-controls="'+id+'" disabled>'+XARR+'</button>'+
      '<ul class="follow-l" id="'+id+'" data-slider role="list" aria-label="'+h+' accounts, scrolls sideways" tabindex="0">'+list.map(card||foCard).join('')+'</ul>'+
      '<button type="button" class="xarr xside xnext" data-xdir="1" aria-label="Next accounts" aria-controls="'+id+'">'+XARR+'</button></div></div>'}
  function feedsHTML(key){var P=FEEDS.posts[key]||[],F=FEEDS.follow[key]||[],home=key==='home',PL=home?[]:playerFollow(key);if(!P.length&&!F.length&&!PL.length)return '';
    return '<section class="sec feeds" id="feeds" data-no-ads aria-labelledby="feeds-h"><div class="wrap">'+
      '<div class="sec-hd"><div><h2 class="sec-t" id="feeds-h">'+(P.length?'From the feeds':'Follow along')+'</h2></div>'+
      '</div>'+
      (P.length?'<div class="xwrap" data-xnav="xtrack-'+key+'"><button type="button" class="xarr xside xprev" data-xdir="-1" aria-label="Previous posts" aria-controls="xtrack-'+key+'" disabled>'+XARR+'</button>'+
        '<div class="xposts" id="xtrack-'+key+'" data-xposts="'+key+'" data-slider role="region" aria-label="Posts from X, scrolls sideways" tabindex="0">'+P.map(function(x,i){return xPost(x,i,P.length)}).join('')+'</div>'+
        '<button type="button" class="xarr xside xnext" data-xdir="1" aria-label="Next posts" aria-controls="xtrack-'+key+'">'+XARR+'</button></div>':'')+
      followRow(F,home?'Follow SMU':'Follow SMU '+esc((sportBy(key)||{}).name||''))+
      followRow(PL,'Follow the players',plCard)+
      (home?followRow(FEEDS.media,'Conference and beat coverage'):'')+
      '</div></section>'}
  function xNavSync(box){var nav=document.querySelector('[data-xnav="'+box.id+'"]');if(!nav)return;var b=nav.querySelectorAll('.xarr'),m=box.scrollWidth-box.clientWidth;
    nav.classList.toggle('no-ovf',box.hidden||m<=2);b[0].disabled=box.scrollLeft<=2;b[1].disabled=box.scrollLeft>=m-2}
  function slSyncAll(){[].forEach.call(document.querySelectorAll('[data-slider]'),xNavSync)}
  document.addEventListener('scroll',function(e){var t=e.target;if(t&&t.hasAttribute&&t.hasAttribute('data-slider'))xNavSync(t)},{capture:true,passive:true});
  window.addEventListener('resize',slSyncAll);window.addEventListener('load',slSyncAll);setTimeout(slSyncAll,0);setTimeout(slSyncAll,800);
  function xPost(x,i,n){return '<div class="xpost" role="group" aria-label="Post '+(i+1)+' of '+n+'"><blockquote class="twitter-tweet" data-dnt="true" data-conversation="none" data-width="320"><p>Post from '+esc(x[2])+' (@'+esc(x[1])+'), '+esc(x[3])+'.</p><a href="'+esc(x[0])+'">View this post on X</a></blockquote></div>'}
  function loadX(box){if(box.dataset.xon)return;box.dataset.xon='1';[0,1500,4000].forEach(function(t){setTimeout(function(){xNavSync(box)},t)});
    /* a post X could not show (deleted, private, blocked) gets its fallback card back instead of an empty frame */
    setTimeout(function(){var P=FEEDS.posts[box.dataset.xposts]||[];[].forEach.call(box.querySelectorAll('.xpost'),function(el,i){var f=el.querySelector('iframe');
      if(!el.querySelector('blockquote')&&(!f||f.offsetHeight<60)&&P[i])el.outerHTML=xPost(P[i],i,P.length).replace('class="twitter-tweet"','class="twitter-tweet x-fb"')})},12000);
    if(window.twttr&&twttr.widgets&&twttr.widgets.load){twttr.widgets.load(box);return}
    if(!document.getElementById('x-wjs')){var sc=document.createElement('script');sc.id='x-wjs';sc.async=true;sc.charset='utf-8';sc.src='https://platform.twitter.com/widgets.js';
      sc.onerror=function(){[].forEach.call(document.querySelectorAll('[data-xposts]'),function(b){b.classList.add('x-off')})};document.body.appendChild(sc)}}
  function watchX(){var L=document.querySelectorAll('[data-xposts]:not([data-xw])');if(!L.length)return;
    [].forEach.call(L,function(b){b.setAttribute('data-xw','1')});
    if(!('IntersectionObserver' in window)){[].forEach.call(L,loadX);return}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);loadX(e.target)}})},{rootMargin:'400px 0px'});
    [].forEach.call(L,function(b){io.observe(b)})}
  document.addEventListener('click',function(e){var a=e.target.closest('[data-xdir]');if(a){var box=document.getElementById(a.getAttribute('aria-controls'));if(!box)return;var c=box.firstElementChild,st=c?c.getBoundingClientRect().width+16:box.clientWidth*.8;
      box.scrollBy({left:st*(+a.dataset.xdir),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}});
  function thirdFor(slug){return MP.LIB.filter(function(c){return c.third&&(c.sport===slug||(c.also||[]).indexOf(slug)>=0)}).sort(function(a,b){return (b.iso||'').localeCompare(a.iso||'')})}
  function mediaSection(slug,name){var L=thirdFor(slug);if(!L.length)return '';
    return '<section class="sec alt" id="media"><div class="wrap">'+secHead('Video, podcasts &amp; coverage',libUrl('all'),'Library','Official channels and the press')+
      '<p class="lede">Real '+esc(name.toLowerCase())+' media from SMU Athletics and outside outlets, credited to each source. Videos and podcasts play through YouTube and Apple Podcasts; articles open on the outlet\u2019s own site.</p>'+rail(L)+'</div></section>'}

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
  /* Insider, Film Room and Podcasts: empty groups are left out. 2+ groups = WAI-ARIA tabs; 1 group = a plain section; 0 = section hidden. No kicker line (main c73dccf removed section kickers). */
  function homeTabs(T){var el=$('#railTabs');if(!el)return;var sec=el.closest('section');
    T=T.filter(function(t){return t[4]&&t[4].length});if(sec)sec.hidden=!T.length;if(!T.length){el.innerHTML='';return}
    if(T.length===1){el.innerHTML=secHead(T[0][1],T[0][2],'See all')+rail(T[0][4]);return}
    el.innerHTML='<div class="sec-hd htabs-hd"><div><h2 class="sr">'+T.map(function(t){return t[1]}).join(', ')+'</h2>'+
      '<div class="htabs" role="tablist" aria-label="More from SMU+">'+T.map(function(t,i){return '<button type="button" role="tab" class="htab" id="ht-'+t[0]+'" aria-controls="hp-'+t[0]+'" aria-selected="'+(i===0)+'" tabindex="'+(i?-1:0)+'">'+t[1]+'</button>'}).join('')+'</div></div>'+
      '<a class="see-all" id="htAll" href="'+T[0][2]+'">See all<span aria-hidden="true"> →</span></a></div>'+
      T.map(function(t,i){return '<div class="htab-p" role="tabpanel" id="hp-'+t[0]+'" aria-labelledby="ht-'+t[0]+'"'+(i?' hidden':'')+'>'+rail(t[4])+'</div>'}).join('');
    var tabs=$$('.htab',el);
    function pick(i,focus){tabs.forEach(function(b,j){var on=i===j;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;$('#hp-'+T[j][0]).hidden=!on});
      $('#htAll').href=T[i][2];if(focus)tabs[i].focus()}
    tabs.forEach(function(b,i){b.addEventListener('click',function(){pick(i)});
      b.addEventListener('keydown',function(e){var n=tabs.length,k=e.key,j=k==='ArrowRight'?(i+1)%n:k==='ArrowLeft'?(i+n-1)%n:k==='Home'?0:k==='End'?n-1:-1;if(j>-1){e.preventDefault();pick(j,true)}})})}
  /* ---------- Home: Latest from the Hilltop (components from bot/forum-first). Newest activity first; replies are counted from real posts only ---------- */
  function hilltop(){var box=$('#hillList');if(!box)return;
    function replies(t){if(t.locked)return null;return t.replies!=null?t.replies:Math.max(0,t.posts.length-1)}
    function lastMin(t){var p=t.posts[t.posts.length-1];if(p&&p[3]&&!isNaN(Date.parse(p[3])))return (Date.now()-Date.parse(p[3]))/60000;var m={m:1,h:60,d:1440,w:10080},x=String(lastAgo(t)).match(/(\d+)(\w)/);return x?(+x[1])*(m[x[2]]||1):1e9}
    function plural(n,a,b){return n.toLocaleString()+' '+(n===1?a:b)}
    function render(){var hill=MP.THREADS.filter(function(t){return t.f==='hilltop'&&t.posts&&t.posts.length}).sort(function(a,b){return lastMin(a)-lastMin(b)}).slice(0,6);
      box.innerHTML=hill.length?hill.map(function(t){var s=t.sport&&sportBy(t.sport),r=replies(t),lu=MP.USERS[lastBy(t)];
        return '<li><a class="hill-row" href="'+threadUrl(t.id)+'"><span class="hill-ic" aria-hidden="true">'+(s?sportIcon(t.sport):CHAT)+'</span><span class="hill-main"><b>'+esc(t.title)+'</b>'+
          '<small><span class="hill-sp">'+(s?esc(s.name):'Around SMU')+'</span>'+(r==null?'':' \u00b7 '+plural(r,'reply','replies'))+' \u00b7 last post '+lastAgo(t)+' ago'+(lu?' by '+esc(lu.n):'')+'</small></span></a></li>'}).join('')
        :'<li class="hill-empty">Quiet on the Hilltop. Start the first thread.</li>'}
    render();SMU.on('threads',render);
    (SMU.ready||Promise.resolve()).then(function(){if(SMU.live&&SMU.loadThreads)SMU.loadThreads().then(render,function(){})})}

  /* ---------- Home: calendar ribbon. MP.UPCOMING from assets/upcoming.js (tools/build_upcoming.py, official SMU Athletics
     schedule pages). Next three weeks for every sport, plus each sport's next event if it is further out. TBA = not listed yet. ---------- */
  var RB_MON=['Jan.','Feb.','March','April','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'],RB_DOW=['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'];
  function rbDate(d){var x=new Date(d+'T12:00:00Z');return RB_DOW[x.getUTCDay()]+' '+RB_MON[x.getUTCMonth()]+' '+x.getUTCDate()}
  function rbToday(){try{return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}}
  function ribbonEvents(){var U=(MP.UPCOMING&&MP.UPCOMING.events)||[],t=rbToday(),lim=new Date(Date.parse(t+'T12:00:00Z')+21*864e5).toISOString().slice(0,10),first={},near=[],far=[];
    U.forEach(function(e){if((e.d2||e.d)<t)return;var k=e.sport+'|'+(e.team||'');if(e.d<=lim)near.push(e);else if(!first[k])far.push(e);first[k]=1});
    return near.slice(0,36).concat(far).sort(function(a,b){return a.d<b.d?-1:a.d>b.d?1:0})}
  function ribbonCard(e,i,n){var sp=sportBy(e.sport),nm=(e.team&&e.team.indexOf('Cross')<0&&e.team.indexOf('Track')<0?e.team+' ':'')+(sp?sp.name:e.sport),
      g=e.game&&GBY[e.game],href=g?gameUrl(g):sportUrl(e.sport)+'#schedule',
      vs=e.vs==='vs'?'vs. ':e.vs==='at'?'at ':'',ha=e.ha==='home'?'Home':e.ha==='away'?'Away':'Neutral site',
      when=rbDate(e.d)+(e.d2?' \u2013 '+rbDate(e.d2):''),tm=e.time||(e.d2?'':'TBA');
    function row(k,v,a){return '<div><dt>'+k+'</dt><dd>'+(a?'<a href="'+esc(a)+'" target="_blank" rel="noopener" aria-label="'+k+': '+esc(v)+' (official link, opens in a new tab)">'+esc(v)+'</a>':esc(v))+'</dd></div>'}
    return '<li class="rb-card" aria-label="'+(i+1)+' of '+n+'"><a class="rb-main" href="'+href+'"><span class="rb-sp">'+esc(nm)+'</span>'+
      '<span class="rb-m">'+vs+esc(e.name)+(e.ex?' (exh.)':'')+'</span><span class="rb-ha rb-'+e.ha+'">'+ha+'</span>'+
      '<span class="rb-w"><b>'+when+'</b>'+(tm?'<span>'+esc(tm)+'</span>':'')+'</span>'+(e.where?'<span class="rb-pl">'+esc(e.where)+'</span>':'')+
      '<span class="rb-go">'+(g?'Game page':'Schedule')+'<span aria-hidden="true"> \u2192</span></span></a>'+
      '<dl class="rb-tv">'+((e.tv?row('TV',e.tv):'')+(e.watch?row('Stream','Watch',e.watch):'')+(e.radio||e.listen?row('Radio',e.radio||'Listen',e.listen):'')||row('TV','TBA'))+'</dl>'+
      (sbUrl(e.sb)?'<a class="rb-stats" href="'+sbUrl(e.sb)+'" target="_blank" rel="noopener" aria-label="Live stats for SMU '+esc(vs+e.name)+' (official StatBroadcast box score, opens in a new tab)">Live stats</a>':'')+'</li>'}
  function ribbon(){var L=ribbonEvents();if(!L.length||$('#ribbon'))return;var gd=$('.gameday'),id='rb-track';if(!gd)return;
    gd.insertAdjacentHTML('beforebegin','<section class="sec tight ribbon" id="ribbon" aria-labelledby="rb-h"><div class="wrap">'+
      '<div class="rb-hd"><h2 id="rb-h">Upcoming games</h2><p>Every SMU sport, from the official <a href="https://smumustangs.com/calendar" target="_blank" rel="noopener">SMU Athletics schedules</a>. Times are Central.</p></div>'+
      '<div class="xwrap rb-wrap" data-xnav="'+id+'"><button type="button" class="xarr xside xprev" data-xdir="-1" aria-label="Earlier games" aria-controls="'+id+'" disabled>'+XARR+'</button>'+
      '<ul class="rb-l" id="'+id+'" data-slider aria-label="Upcoming SMU games, scrolls sideways" tabindex="0">'+L.map(function(e,i){return ribbonCard(e,i,L.length)}).join('')+'</ul>'+
      '<button type="button" class="xarr xside xnext" data-xdir="1" aria-label="Later games" aria-controls="'+id+'">'+XARR+'</button></div>'+
      '</div></section>');
    slSyncAll()}
  /* ---------- Search results page (search/?q=...). Static content comes from data/search-index.json (tools/build_search.js);
     forum threads and posts come live from Supabase (public read). Results update as you type; the URL keeps the query. ---------- */
  function searchPage(){var main=$('#searchMain');if(!main)return;
    var P=new URLSearchParams(location.search),q0=(P.get('q')||'').slice(0,80),only=P.get('type')||'all',IDX=null,live=[],liveQ=null,seq=0;
    var GROUPS=[['video','Videos'],['article','Articles'],['podcast','Podcasts'],['player','Players'],['post','Forum posts'],['game','Games'],['sport','Sports']];
    main.innerHTML='<section class="srch-hero"><div class="wrap"><h1 id="srch-h">Search SMU+</h1>'+
      '<form class="srch-f" role="search" id="srchF" action="./" method="get"><label class="sr" for="srchQ">Search videos, articles, podcasts, players and forum posts</label>'+
      '<input id="srchQ" name="q" type="search" value="'+esc(q0)+'" placeholder="Try Jennings, Syracuse or highlights" autocomplete="off" spellcheck="false" enterkeyhint="search" maxlength="80" aria-describedby="srchSum">'+
      '<button type="submit">Search</button></form><p class="srch-sum" id="srchSum" role="status" aria-live="polite"></p>'+
      '<div class="srch-tabs" role="group" aria-label="Filter results">'+[['all','All']].concat(GROUPS).map(function(g){return '<button type="button" data-st="'+g[0]+'" aria-pressed="'+(only===g[0])+'">'+g[1]+'</button>'}).join('')+'</div></div></section>'+
      '<section class="sec tight"><div class="wrap" id="srchRes"></div></section>';
    var inp=$('#srchQ'),res=$('#srchRes'),sum=$('#srchSum'),hq=$('#mmQ');
    function norm(x){return String(x||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[\u2018\u2019']/g,'').replace(/\s+/g,' ').trim()}
    function toks(q){return norm(q).split(' ').filter(Boolean).slice(0,6)}
    function hlx(text,T){var out=esc(text);T.forEach(function(t){if(t.length<2)return;out=out.replace(new RegExp('('+t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'),'<mark>$1</mark>')});return out}
    function href(u){return u.charAt(0)==='#'?u:ROOT+u}
    function score(d,T,q){var tl=norm(d.ti);if(!T.every(function(t){return d.h.indexOf(t)>=0}))return -1;
      return (tl===q?20:0)+(tl.indexOf(q)===0?8:0)+(tl.indexOf(q)>=0?5:0)+T.filter(function(t){return tl.indexOf(t)>=0}).length*2+(d.d?Math.max(0,3-(Date.now()-Date.parse(d.d))/(30*864e5)):0)}
    function snippet(body,T){var b=String(body||'').replace(/\s+/g,' '),lb=norm(b),i=-1;T.some(function(t){i=lb.indexOf(t);return i>=0});
      var st=Math.max(0,i-60),sn=b.slice(st,st+180);return (st?'\u2026':'')+sn+(st+180<b.length?'\u2026':'')}
    function fetchLive(q){var T=toks(q);if(!T.length){live=[];liveQ=q;return Promise.resolve()}var my=++seq;
      return (SMU.ready||Promise.resolve()).then(function(){var sb=SMU.live&&SMU.client;
        if(!sb){/* demo mode or Supabase unreachable: search the threads this browser already has */
          live=(MP.THREADS||[]).filter(function(t){return (REC_ON||t.f!=='recruiting')}).map(function(t){var body=(t.posts||[]).map(function(p){return p[1]}).join(' '),h=norm(t.title+' '+body);
            return T.every(function(x){return h.indexOf(x)>=0})?{t:'post',ti:t.title,s:'Thread',u:'boards/#t'+t.id,x:snippet(body,T),h:h}:null}).filter(Boolean).slice(0,20);liveQ=q;return}
        var pat='%'+T.reduce(function(a,b){return b.length>a.length?b:a},'').replace(/[%_\\]/g,'\\$&')+'%';
        return Promise.all([
          sb.from('threads').select('id,title,forum_id,sport,last_post_at').ilike('title',pat).order('last_post_at',{ascending:false}).limit(20),
          sb.from('posts').select('id,body,created_at,thread_id,threads(id,title,forum_id)').ilike('body',pat).order('created_at',{ascending:false}).limit(30)
        ]).then(function(r){if(my!==seq)return;var out=[],seenT={};
          ((r[0]&&r[0].data)||[]).forEach(function(t){if(!REC_ON&&t.forum_id==='recruiting')return;var f=forumBy(t.forum_id)||{name:'Boards'};seenT[t.id]=1;
            out.push({t:'post',ti:t.title,s:'Thread \u00b7 '+f.name,u:'boards/#t'+t.id,h:norm(t.title),d:t.last_post_at})});
          ((r[1]&&r[1].data)||[]).forEach(function(p){var t=p.threads;if(!t||(!REC_ON&&t.forum_id==='recruiting'))return;var f=forumBy(t.forum_id)||{name:'Boards'};
            out.push({t:'post',ti:t.title,s:'Post \u00b7 '+f.name,u:'boards/#t'+t.id,x:snippet(p.body,T),h:norm(t.title+' '+p.body),d:p.created_at})});
          live=out.filter(function(d){return T.every(function(x){return d.h.indexOf(x)>=0})});liveQ=q},function(){if(my===seq){live=[];liveQ=q}})})}
    var shown={};
    function render(){var q=inp.value.trim(),T=toks(q),nq=norm(q);
      $$('[data-st]',main).forEach(function(b){b.setAttribute('aria-pressed',b.dataset.st===only?'true':'false')});
      if(!T.length){res.innerHTML='<p class="srch-empty">Search every video, article, podcast, player and forum post on SMU+.</p>';sum.textContent='';return}
      if(!IDX){sum.textContent='Searching\u2026';return}
      var hits=IDX.concat(live).map(function(d){if(d.x&&d.t!=='post'&&Date.parse(d.x)<=Date.now())return null;var sc=score(d,T,nq);return sc<0?null:{d:d,s:sc}}).filter(Boolean).sort(function(a,b){return b.s-a.s});
      var by={};hits.forEach(function(h){(by[h.d.t]=by[h.d.t]||[]).push(h.d)});
      var total=hits.length,html='';
      var ord=[];hits.forEach(function(h){if(ord.indexOf(h.d.t)<0)ord.push(h.d.t)});
      GROUPS.slice().sort(function(a,b){var i=ord.indexOf(a[0]),j=ord.indexOf(b[0]);return (i<0?99:i)-(j<0?99:j)}).forEach(function(g){var L=by[g[0]];if(!L||!L.length||(only!=='all'&&only!==g[0]))return;var lim=only===g[0]||shown[g[0]]?50:5;
        html+='<div class="srch-g"><h2>'+g[1]+' <span class="sr">('+L.length+')</span></h2><ul class="srch-l">'+L.slice(0,lim).map(function(d){
          return '<li><a href="'+esc(href(d.u))+'"'+(d.u.indexOf('#watch=')>=0&&d.u.charAt(0)==='#'?' data-item="'+esc(d.u.split('=')[1])+'"':d.u.indexOf('#article=')===0?' data-item="'+esc(d.u.split('=')[1])+'"':'')+'><b>'+hlx(d.ti,T)+'</b><small>'+esc(d.s)+'</small>'+(d.x&&d.t==='post'?'<span class="srch-x">'+hlx(d.x,T)+'</span>':'')+'</a></li>'}).join('')+'</ul>'+
          (L.length>lim?'<button type="button" class="srch-more" data-more="'+g[0]+'">Show all '+L.length+' '+g[1].toLowerCase()+'</button>':'')+'</div>'});
      var n=only==='all'?total:(by[only]||[]).length;
      sum.textContent=(n?n+(n===1?' result':' results'):'No results')+' for \u201c'+q+'\u201d'+(liveQ!==q?' (checking the forum\u2026)':'');
      res.innerHTML=html||'<p class="srch-empty">Nothing matches \u201c'+esc(q)+'\u201d'+(only!=='all'?' in this filter':'')+'. Try fewer words or a player\u2019s last name.</p>'}
    var tm;function update(push){var q=inp.value.trim().slice(0,80);shown={};var u=new URL(location.href);if(q)u.searchParams.set('q',q);else u.searchParams.delete('q');
      if(only!=='all')u.searchParams.set('type',only);else u.searchParams.delete('type');history[push?'pushState':'replaceState'](null,'',u.pathname+u.search);
      document.title=(q?'\u201c'+q+'\u201d \u00b7 ':'')+'Search | SMU+';if(hq)hq.value=q;render();clearTimeout(tm);tm=setTimeout(function(){fetchLive(q).then(render)},250)}
    inp.addEventListener('input',function(){update(false)});
    $('#srchF').addEventListener('submit',function(e){e.preventDefault();update(true)});
    main.addEventListener('click',function(e){var b=e.target.closest('[data-st]');if(b){only=b.dataset.st;update(false);return}
      var m=e.target.closest('[data-more]');if(m){shown[m.dataset.more]=1;render()}});
    var mf=$('.mm-sf');if(hq&&mf)mf.addEventListener('submit',function(e){if(hq.value.trim()){e.preventDefault();e.stopImmediatePropagation();inp.value=hq.value.trim();closeMenu();update(true);inp.focus()}});
    addEventListener('popstate',function(){var p=new URLSearchParams(location.search);inp.value=p.get('q')||'';only=p.get('type')||'all';render();fetchLive(inp.value.trim()).then(render)});
    fetch(ROOT+'data/search-index.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw r.status;return r.json()}).then(function(J){IDX=J.docs||[];render()},function(){IDX=[];render()});
    render();if(q0)fetchLive(q0).then(render);if(!q0)inp.focus()}
  function home(){
    var mem=$('#membership');if(mem){var old=$('.note.center',mem),w=$('.wrap',mem);if(old)old.outerHTML=conceptNotice('plans-cn');else if(w)w.insertAdjacentHTML('beforeend',conceptNotice('plans-cn'));
      /* Home waitlist section removed (Oct 26, Jackson); Join CTAs open the join pop-up. */
      var tiers=$('.tiers',mem);if(tiers)tiers.insertAdjacentHTML('beforebegin',freeBands('home'))}
    var feat=LIBBY[MP.FEATURED]||LIBBY['boulevard-nights-1'];
    /* Weekly hero headline (MP.HERO in content.js). Only swap the h1 when its item is the card being shown, so headline and media always match. */
    (function(){var H=MP.HERO,h=$('#hero-h');if(!h||!H||!H.line1||!H.line2||!LIBBY[H.item]||LIBBY[H.item]!==feat)return;
      h.innerHTML='<b>'+esc(H.line1)+'</b><span>'+esc(H.line2)+'</span>';h.classList.add('hero-wk');
      /* Each line stays on one row: shrink from the CSS size until the longer line fits the column (floor 36px, then it may wrap). */
      function fit(){h.style.fontSize='';if(!h.offsetWidth)return;var base=parseFloat(getComputedStyle(h).fontSize),w=h.clientWidth,need=0;
        [].forEach.call(h.children,function(c){need=Math.max(need,c.scrollWidth)});
        if(need>w)h.style.fontSize=Math.max(36,Math.floor(base*w/need*0.98))+'px'}
      fit();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);var ft;addEventListener('resize',function(){clearTimeout(ft);ft=setTimeout(fit,100)})})();
    /* Hero featured card: desktop/tablet only. On phones the hero is display:none, so skip it there (no eager poster download) and fill it if the window widens. */
    (function(){var hf=$('#heroFeature'),mq=window.matchMedia&&matchMedia('(max-width:719px)');if(!hf)return;
      function fill(){if(hf.dataset.filled||(mq&&mq.matches))return;hf.dataset.filled='1';hf.innerHTML='<a class="hero-card'+(gated(feat)?' gated':'')+'" href="'+itemHref(feat)+'" data-item="'+feat.id+'">'+poster(feat,{big:1,eager:1})+'<div class="hero-card-b"><span class="meta">'+esc(feat.label)+' · Now streaming</span><h3>'+esc(feat.title)+'</h3><p>'+esc(feat.desc)+'</p></div></a>';}
      fill();if(mq&&mq.addEventListener)mq.addEventListener('change',fill)})();
    $('#gameday').innerHTML=gameStrip();startCountdowns();ribbon();
    $('#railWatch').innerHTML=secHead('Watch',libUrl('watch'),'See all','Official SMU Athletics video')+rail(byCat('watch'));
    homeTabs([['insider','Insider',libUrl('insider'),'Features & practice reports',byCat('insider')],['podcasts','Podcasts',libUrl('podcasts'),'Listen',MP.LIB.filter(function(c){return c.t==='podcast'})]]);
    var news=byCat('news',8),rd=$('#read');if(news.length&&rd&&!$('#news'))rd.insertAdjacentHTML('afterend','<section class="sec tight" id="news"><div class="wrap">'+secHead('In the news',libUrl('news'),'See all','Real coverage · opens at the source')+rail(news)+'</div></section>');
    var ls=$('#listen')||$('#recruiting');/* Podcasts is a tab now, so #listen is gone: anchor to #recruiting, which keeps the feeds where main places them (after the content block, before the Mustang Board) */if(ls&&!$('#feeds'))ls.insertAdjacentHTML('afterend',feedsHTML('home'));watchX();
    var rsec=$('#recruiting');if(!REC_ON){if(rsec)rsec.hidden=true}else $('#recruitBand').innerHTML=secHead('Recruiting &amp; Portal',ROOT+'recruiting/','Open hub','Visits, offers and the portal')+rail(byCat('recruiting').concat(byCat('portal')))+recruitBand();
    hilltop();
    var hot=MP.THREADS.filter(function(t){return t.hot||t.pin}).slice(0,6);
    $('#boardHot').innerHTML=hot.map(function(t){return threadRow(t,true)}).join('');
    function homeBoards(){var tt=0,tp=0;MP.FORUMS.forEach(function(f){tt+=f.threads;tp+=f.posts});var a=$('#homeThreads'),b=$('#homePosts');if(a)a.textContent=tt.toLocaleString();if(b)b.textContent=tp.toLocaleString();
      $('#boardForums').innerHTML=MP.FORUMS.slice(0,5).map(function(f){return '<a class="forum-mini" href="'+ROOT+'boards/?f='+f.id+'"><span class="fi'+(GATING&&f.prem?' prem':'')+'">'+(GATING&&f.prem?LOCK:CHAT)+'</span><span><b>'+f.name+'</b><small>'+f.threads.toLocaleString()+' threads · '+f.posts.toLocaleString()+' posts</small></span>'+(GATING&&f.prem?'<span class="pill pill-prem">Members</span>':'')+'</a>'}).join('');}
    (SMU.ready||Promise.resolve()).then(function(){return SMU.boardStats?SMU.boardStats():0}).then(homeBoards,homeBoards);
    $('#athRow').innerHTML='<div class="rail rail-ath" role="list">'+MP.ATHLETES.filter(function(a){return !a.basic}).map(function(a){return '<div class="rail-i" role="listitem">'+profileCard(a)+'</div>'}).join('')+'</div>';
    $('#briefHome').innerHTML=briefHTML('briefMain');syncBriefs();
  }

  /* ---------- Library ---------- */
  /* About page (privacy/#about): sources for schedules, rosters and feeds, which used to be footnotes under each section */
  function aboutSources(){var el=$('#srcList');if(!el)return;var L=[],seen={};function add(t,u){if(!u||seen[u])return;seen[u]=1;L.push('<li><a href="'+u+'" target="_blank" rel="noopener">'+esc(t)+'</a></li>')}
    if(SCH&&SCH.source)add(SCH.source[0]+' (record, kickoff times, TV, scores; radio: '+(SCH.radio||'')+')',SCH.source[1]);
    MP.SPORTS.forEach(function(sp){var r=(MP.REAL||{})[sp.slug];if(r&&r.src)r.src.forEach(function(x){add(x[0]+(r.checked?' (checked '+r.checked+')':''),x[1])})});
    el.innerHTML=L.join('')}
  /* Watch page outlet rows. data/videos-feed.json is rebuilt daily by tools/fetch_youtube.py (GitHub Actions) from each
     channel's public YouTube RSS feed: full videos only, embeddable, SMU-related. Embed only, never rehosted. */
  var FEED_DATE={timeZone:'America/Chicago',month:'short',day:'numeric',year:'numeric'};
  function feedItem(ch,v){if(v.nomax)NOMAX[v.id]=1;var id='yt-'+v.id,d=new Date(v.published),ds=isNaN(d)?'':d.toLocaleDateString('en-US',FEED_DATE);
    if(!LIBBY[id])LIBBY[id]={id:id,t:'video',cat:'watch',label:ch.name+(ds?' \u00b7 '+ds:''),title:v.title,desc:'Posted '+(ds||'recently')+' on the '+ch.name+' YouTube channel.',
      dur:v.dur||'Video',lock:false,tone:'black',yt:v.id,src:'https://www.youtube.com/watch?v='+v.id,credit:ch.name,pub:ch.name,channel:[ch.name+' on YouTube',ch.url],feed:true,real:true,iso:v.published};
    return LIBBY[id]}
  var ORN=0;
  function outletRail(items,label){var id='orow-'+(++ORN);
    return '<div class="xwrap orow" data-xnav="'+id+'"><button type="button" class="xarr xside xprev" data-xdir="-1" aria-label="Previous videos" aria-controls="'+id+'" disabled>'+XARR+'</button>'+
      '<div class="rail" id="'+id+'" data-slider role="list" aria-label="'+esc(label)+', scrolls sideways" tabindex="0">'+items.map(function(c){return '<div class="rail-i" role="listitem"'+(c.show?' data-show="'+esc(c.show)+'"':'')+'>'+cardHTML(c)+'</div>'}).join('')+'</div>'+
      '<button type="button" class="xarr xside xnext" data-xdir="1" aria-label="Next videos" aria-controls="'+id+'">'+XARR+'</button></div>'}
  /* centre the side arrows on the thumbnails rather than on the whole card */
  function orowArrows(){[].forEach.call(document.querySelectorAll('.orow'),function(w){var p=w.querySelector('.poster');if(!p)return;var t=p.offsetTop+p.offsetHeight/2;
    [].forEach.call(w.querySelectorAll('.xside'),function(b){b.style.top=t+'px'})})}
  window.addEventListener('resize',orowArrows);
  var LIB_SHOWS=[];   /* [key,name] for the show filter, filled by the outlet and podcast loaders */
  function addShow(k,n,g){if(!LIB_SHOWS.some(function(x){return x[0]===k}))LIB_SHOWS.push([k,n,g||0])}
  function outletsRow(){var el=$('#railOutlets');if(!el||!window.fetch)return Promise.resolve();
    return fetch(ROOT+'data/videos-feed.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw r.status;return r.json()}).then(function(F){
      var CH={},ROW={};(F.channels||[]).forEach(function(c){CH[c.key]=c});(F.rows||[]).forEach(function(r){r.channels.forEach(function(k){ROW[k]=r.key})});
      function item(ch,v){var c=feedItem(ch,v);c.show=ROW[ch.key]||ch.key;return c}
      var html='',fresh=(F.new||[]).map(function(n){var ch=CH[n.key],v=ch&&ch.videos.filter(function(x){return x.id===n.id})[0];return v?item(ch,v):null}).filter(Boolean);
      if(fresh.length)html+='<div class="orow-sec" data-new>'+secHead('New videos')+outletRail(fresh,'New videos')+'</div>';
      (F.rows||[]).forEach(function(r){var L=[];r.channels.forEach(function(k){var ch=CH[k];if(ch)ch.videos.forEach(function(v){L.push(item(ch,v))})});
        if(!L.length)return;L.sort(function(a,b){return (b.iso||'').localeCompare(a.iso||'')});L=L.slice(0,12);addShow(r.key,r.name);
        html+='<div class="orow-sec" data-show="'+esc(r.key)+'">'+secHead(esc(r.name),r.url,'YouTube channel')+outletRail(L,r.name+' videos')+'</div>'});
      if(!html)return;
      el.innerHTML=html+'<p class="studio-note">Public videos, shown for demo purposes. Not affiliated.</p>';
      [].forEach.call(el.querySelectorAll('.see-all'),function(a){a.target='_blank';a.rel='noopener';a.setAttribute('aria-label',a.closest('.sec-hd').querySelector('.sec-t').textContent+' on YouTube (opens in a new tab)')});
      el.closest('section').hidden=false;orowArrows();slSyncAll();setTimeout(function(){orowArrows();slSyncAll()},600);
      continueRow();if(/^#watch=yt-/.test(location.hash))articleFromHash()}).catch(function(){})}
  var PODBY={};
  /* Watch page podcast rows. data/podcasts-feed.json is rebuilt by tools/fetch_podcasts.py from each show's public RSS feed.
     Audio plays in the browser's own player straight from the feed's enclosure URL; cover art is the feed's own. */
  var PIC='<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" fill="currentColor">';
  function podCard(sh,e){var d=new Date(e.published),ds=isNaN(d)?'':d.toLocaleDateString('en-US',FEED_DATE),ap=e.apple||sh.apple;
    return '<article class="pcard" aria-label="'+esc(sh.name)+': '+esc(e.title)+'"><div class="pc-top">'+
      (sh.art?'<img class="pc-art" src="'+ROOT+esc(sh.art)+'" alt="" width="72" height="72" loading="lazy" decoding="async">':'')+
      '<div class="pc-txt"><p class="pc-show">'+esc(sh.name)+'</p><h3 class="pc-t" title="'+esc(e.title)+'">'+esc(e.title)+'</h3>'+
      '<p class="pc-m">'+[ds,e.dur].filter(Boolean).map(esc).join(' \u00b7 ')+'</p></div></div>'+
      '<audio class="pc-au" controls preload="none" src="'+esc(e.audio)+'" aria-label="Play '+esc(sh.name)+' episode: '+esc(e.title)+'"></audio>'+
      '<p class="pc-links">'+(ap?'<a href="'+esc(ap)+'" target="_blank" rel="noopener" aria-label="'+(e.apple?'This episode':esc(sh.name))+' on Apple Podcasts (opens in a new tab)">Apple Podcasts</a>':'')+
      (sh.spotify?'<a href="'+esc(sh.spotify)+'" target="_blank" rel="noopener" aria-label="'+esc(sh.name)+' on Spotify (opens in a new tab)">Spotify</a>':'')+'</p></article>'}
  /* data-pod, not data-item: the document click handler treats any [data-item] ancestor as a library card and swallows the click (that broke the Apple/Spotify links) */
  function podRail(items,label){var id='prow-'+(++ORN);
    return '<div class="xwrap prow" data-xnav="'+id+'"><button type="button" class="xarr xside xprev" data-xdir="-1" aria-label="Previous episodes" aria-controls="'+id+'" disabled>'+XARR+'</button>'+
      '<div class="rail" id="'+id+'" data-slider role="list" aria-label="'+esc(label)+', scrolls sideways" tabindex="0">'+items.map(function(x){var id='pod-'+x[1].id;PODBY[id]={id:id,t:'podcast',cat:'podcasts',title:x[1].title,desc:x[0].name,label:x[0].name};
        return '<div class="rail-i" role="listitem" data-show="'+esc(x[0].key)+'" data-pod="'+id+'">'+podCard(x[0],x[1])+'</div>'}).join('')+'</div>'+
      '<button type="button" class="xarr xside xnext" data-xdir="1" aria-label="Next episodes" aria-controls="'+id+'">'+XARR+'</button></div>'}
  function podsRow(){var el=$('#railPods');if(!el||!window.fetch)return Promise.resolve();
    return fetch(ROOT+'data/podcasts-feed.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw r.status;return r.json()}).then(function(F){
      var SH={},html='';(F.shows||[]).forEach(function(c){SH[c.key]=c});
      var fresh=(F.new||[]).map(function(n){var sh=SH[n.key],e=sh&&sh.episodes.filter(function(x){return x.id===n.id})[0];return e?[sh,e]:null}).filter(Boolean);
      if(fresh.length)html+='<div class="orow-sec" data-new>'+secHead('New episodes')+podRail(fresh,'New podcast episodes')+'</div>';
      (F.shows||[]).forEach(function(sh){if(!sh.episodes.length)return;addShow(sh.key,sh.name,1);
        html+='<div class="orow-sec" data-show="'+esc(sh.key)+'">'+secHead(esc(sh.name),sh.apple||sh.spotify,sh.apple?'Apple Podcasts':'Spotify')+podRail(sh.episodes.map(function(e){return [sh,e]}),sh.name+' episodes')+'</div>'});
      if(!html)return;
      el.innerHTML=html+'<p class="studio-note">Public podcasts, shown for demo purposes. Not affiliated.</p>';
      [].forEach.call(el.querySelectorAll('.see-all'),function(a){a.target='_blank';a.rel='noopener';a.setAttribute('aria-label',a.closest('.sec-hd').querySelector('.sec-t').textContent+' on '+a.textContent.replace(/\s*\u2192\s*$/,'')+' (opens in a new tab)')});
      el.closest('section').hidden=false;slSyncAll();setTimeout(slSyncAll,600)}).catch(function(){})}
  /* one episode at a time: starting one pauses any other */
  document.addEventListener('play',function(e){var t=e.target;if(!t||!t.classList||!t.classList.contains('pc-au'))return;
    [].forEach.call(document.querySelectorAll('audio.pc-au'),function(a){if(a!==t&&!a.paused)a.pause()})},true);
  /* ---------- Game-day hub: games/ (index) and games/?id=<game> (one page per game) ---------- */
  var GM_SPORT={football:{verb:'Kickoff',ph:'gd-football'},'mens-basketball':{verb:'Tip-off',ph:'gd-mbb'},'womens-basketball':{verb:'Tip-off',ph:'gd-wbb'}};
  /* opponent names as they appear in video titles; lookarounds keep 'Virginia' off 'Virginia Tech' and 'Texas A&M' off 'West Texas A&M' */
  var GM_ALIAS={'Cal':['Cal','California','Golden Bears'],'California':['Cal','California','Golden Bears'],'Virginia':['Virginia(?! Tech)(?<!West Virginia)','UVA'],
    'Virginia Tech':['Virginia Tech','Hokies'],'Syracuse':['Syracuse'],'Notre Dame':['Notre Dame','Fighting Irish'],'Wake Forest':['Wake Forest','Demon Deacons'],
    'Texas A&M':['(?<!West |East )Texas A&M','Aggies'],'West Texas A&M':['West Texas A&M'],'East Texas A&M':['East Texas A&M'],'Pittsburgh':['Pittsburgh','Pitt'],'Pitt':['Pitt','Pittsburgh'],
    'NC State':['NC State','N\\.C\\. State','Wolfpack'],'North Carolina':['North Carolina','UNC','Tar Heels'],'Virginia Military Institute':['VMI','Virginia Military'],
    'Miami':['Miami','Hurricanes'],'Duke':['Duke','Blue Devils'],'Georgia Tech':['Georgia Tech','Yellow Jackets'],'Georgia':['Georgia(?! Tech)'],'Florida State':['Florida State','FSU','Seminoles'],
    'Boston College':['Boston College'],'LSU':['LSU'],'UNLV':['UNLV'],'UTSA':['UTSA'],'Stanford':['Stanford'],'Louisville':['Louisville'],'Clemson':['Clemson']};
  var GM_SMU=/\bSMU\b|\bMustangs\b|\bPonies\b/i;
  var GM_NOT={football:/basketball|hoops|\bMBB\b|\bWBB\b|volleyball|soccer|women'?s/i,'mens-basketball':/football|volleyball|soccer|women'?s|\bWBB\b/i,'womens-basketball':/football|volleyball|soccer|\bMBB\b|men'?s basketball/i};
  var GM_NEED={'mens-basketball':/basketball|hoops|\bMBB\b|Moody|tip-?off/i,'womens-basketball':/women'?s|\bWBB\b|lady/i};
  function gmPair(g,t){var A=(GM_ALIAS[g.opp]||[g.opp.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')]).join('|'),J='\\s*(?:vs\\.?|at|-|\u2013|\u2014|v\\.?|and|against)\\s*';
    try{return new RegExp('\\bSMU(?: Mustangs)?'+J+'(?:'+A+')(?![A-Za-z])|(?:^|[^A-Za-z])(?:'+A+')'+J+'SMU\\b','i').test(t)}catch(e){return false}}
  function gmOppRx(g){if(/^ACC - /.test(g.opp))return null;var A=GM_ALIAS[g.opp]||[g.opp.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')];
    try{return new RegExp('(?:^|[^A-Za-z])(?:'+A.join('|')+')(?![A-Za-z])','i')}catch(e){return null}}
  /* videos for one game: SMU and the opponent named in the title, right sport, posted from two weeks before to a week after */
  function gmVideos(g,F){var rx=gmOppRx(g);if(!rx||!F)return [];var t0=Date.parse(g.d+'T00:00:00-06:00'),from=t0-14*864e5,to=t0+8*864e5,out=[],seen={};
    (F.channels||[]).forEach(function(ch){ch.videos.forEach(function(v){var t=Date.parse(v.published),k=v.title.toLowerCase().replace(/\W+/g,' ');
      if(seen[k]||!(t>=from&&t<=to)||!GM_SMU.test(v.title)||!rx.test(v.title)||(ch.broad&&!gmPair(g,v.title))||GM_NOT[g.sport].test(v.title)||(GM_NEED[g.sport]&&!GM_NEED[g.sport].test(v.title)))return;
      seen[k]=1;out.push(feedItem(ch,v))})});
    return out.sort(function(a,b){return (b.iso||'').localeCompare(a.iso||'')}).slice(0,12)}
  /* related articles: real items already on the site for this sport, ones naming the opponent first */
  function gmArticles(g){var rx=gmOppRx(g);return MP.LIB.filter(function(c){return c.real&&c.t==='article'&&!expired(c)&&(c.sport===g.sport||(c.also||[]).indexOf(g.sport)>=0)})
    .map(function(c){return {c:c,s:(rx&&rx.test(c.title+' '+c.desc)?10:0)}}).sort(function(a,b){return b.s-a.s||(b.c.iso||'').localeCompare(a.c.iso||'')}).slice(0,4).map(function(x){return x.c})}
  function gmFact(k,v,link){return '<div><dt>'+k+'</dt><dd>'+(v?esc(v):'TBA')+(link||'')+'</dd></div>'}
  function gmScore(g){var m=g.res&&g.res.match(/^([WLT]) (\d+)-(\d+)/);if(!m)return '';var us=+m[2],them=+m[3];
    return '<div class="score gm-score" role="group" aria-label="Final'+(g.ex?', exhibition':'')+': SMU '+us+', '+esc(g.opp)+' '+them+'"><span class="sc-t'+(us>them?' win':'')+'"><b>SMU</b><em>'+us+'</em></span>'+
      '<span class="sc-f"><b>Final'+(g.ex?' · Exh.':'')+'</b>'+gmDate(g)+'</span><span class="sc-t sc-r'+(them>us?' win':'')+'"><em>'+them+'</em><b>'+esc(g.opp)+'</b></span></div>'}
  function gmOut(href,label){return href?'<a class="gm-out" href="'+esc(href)+'" target="_blank" rel="noopener">'+label+EXT+'</a>':''}
  /* games board: one row per game. Date block, matchup, then the result or the kickoff time and TV, all from MP.GAMES */
  function gmWhere(g){return g.ha==='away'?'Away':g.ha==='neutral'?'Neutral site':'Home'}
  function gmRow(g,nx){var m=g.res&&g.res.match(/^([WLT]) (\d+)-(\d+)/),d=new Date(g.d+'T12:00:00Z');
    return '<li class="gmb-r'+(m?' is-final':'')+(nx?' is-next':'')+'"><a class="gm-li" href="'+gameUrl(g)+'">'+
      '<span class="gmb-d"><b>'+d.getUTCDate()+'</b><small>'+MON[d.getUTCMonth()]+' \u00b7 '+esc(g.dow)+'</small></span>'+
      '<span class="gmb-m"><b>SMU <i>'+gmVs(g)+'</i> '+esc(g.opp)+(g.ex?' (exh.)':'')+'</b><small>'+esc([gmWhere(g),g.city].filter(Boolean).join(' \u00b7 '))+'</small></span>'+
      (m?'<span class="gmb-s"><span class="gmb-wl wl-'+m[1]+'"><span aria-hidden="true">'+m[1]+'</span><span class="sr">'+(m[1]==='W'?'Win':m[1]==='L'?'Loss':'Tie')+'</span></span><b>'+m[2]+'\u2013'+m[3]+'</b><small>Final</small></span>':
        '<span class="gmb-s"><b>'+esc(g.time||'Time TBA')+'</b><small>'+esc(g.tv||'')+'</small></span>')+
      (nx?'<span class="gmb-nx">Next game</span>':'')+'<span class="gm-li-go" aria-hidden="true">\u2192</span></a></li>'}
  /* the next game for each sport as a tile in the index hero (same nextGame() the game pages use for the countdown) */
  function gmUpTile(slug){var sp=sportBy(slug),n=nextGame(GAMES.filter(function(g){return g.sport===slug}));if(!n)return '';
    return '<a class="gmu" href="'+gameUrl(n)+'"><span class="gmu-m">SMU <i>'+gmVs(n)+'</i> '+esc(n.opp)+'</span>'+
      '<span class="gmu-d">'+esc(sp?sp.name:'')+' \u00b7 '+gmDate(n,1)+'</span><span class="gmu-t">'+esc([n.time||'Time TBA',n.tv].filter(Boolean).join(' \u00b7 '))+'</span></a>'}
  function gamesIndex(main){document.title='Game day | SMU+';
    var tiles=Object.keys(GM_SPORT).map(gmUpTile).join('');
    main.innerHTML='<section class="page-hero compact gm-hero gmi-hero"><div class="wrap"><h1 class="display">Game day</h1><p class="lede on-dark">A page for every upcoming football and basketball game and the latest result, with how to watch and listen, the week\u2019s videos and related stories.</p>'+
        (tiles?'<div class="gmu-row" aria-label="Next games">'+tiles+'</div>':'')+'</div></section>'+
      Object.keys(GM_SPORT).map(function(slug){var sp=sportBy(slug),G=GAMES.filter(function(g){return g.sport===slug}),last=G.filter(function(g){return g.res}).slice(-1),up=G.filter(function(g){return !g.res}).slice(0,6),nx=nextGame(G);
        if(!G.length)return '';
        return '<section class="sec gm-idx"><div class="wrap"><div class="gmb-hd">'+photoBg(GM_SPORT[slug].ph,{gd:1,sizes:'(min-width:960px) 40vw, 100vw'})+
          '<h2 class="gmb-t">'+esc(sp?sp.name:slug)+'</h2><a class="gmb-all" href="'+sportUrl(slug)+'#schedule">Full schedule<span aria-hidden="true"> \u2192</span></a></div>'+
          '<ul class="gm-list gmb">'+last.concat(up).map(function(g){return gmRow(g,g===nx)}).join('')+'</ul></div></section>'}).join('')+
      '<section class="sec gm-src-sec"><div class="wrap"><p class="gm-src">Dates, times, venues, TV, radio and results come from the SMU Athletics schedule pages'+(MP.GAMES&&MP.GAMES.checked?', checked '+esc(MP.GAMES.checked):'')+'.</p></div></section>'}
  function gamePage(){var main=$('#gamesMain');if(!main)return;var id=new URLSearchParams(location.search).get('id'),g=id&&GBY[id];
    if(!id){gamesIndex(main);return}
    if(!g){document.title='Game not found | SMU+';main.innerHTML='<section class="page-hero compact gm-hero"><div class="wrap"><h1 class="display">Game not found</h1><p class="lede on-dark">This game is not in the game-day hub. Pick one from the list.</p><p class="nf-act"><a class="btn btn-red" href="'+ROOT+'games/">All games</a></p></div></section>';return}
    var sp=sportBy(g.sport),C=GM_SPORT[g.sport],G=GAMES.filter(function(x){return x.sport===g.sport}),i=G.indexOf(g),prev=G[i-1],next=G[i+1],L=g.links||{},title='SMU '+gmVs(g)+' '+g.opp;
    document.title=title+' \u00b7 '+(sp?sp.name:'')+' \u00b7 '+gmDate(g)+' | SMU+';
    var where=[g.venue,g.city].filter(Boolean).join(', ');
    /* matchup header: solid SMU blue with the sport's game-day photo; big scoreline for a final, countdown only for the
       sport's very next game, kickoff date and time for every other upcoming game */
    var m=g.res&&g.res.match(/^([WLT]) (\d+)-(\d+)/),us=m?+m[2]:0,them=m?+m[3]:0,isNext=!g.res&&g.ko&&nextGame(G)===g,
      HU=g.sport==='football'&&MP.HURRYUP&&MP.HURRYUP.photo&&MP.HURRYUP.photo[g.d],phk=HU&&PH[HU]?HU:C.ph;
    main.innerHTML='<section class="gmx'+(m?' gmx-final':' gmx-pre')+(PH[phk]?' has-ph':'')+'">'+(PH[phk]?'<div class="gmx-ph">'+photoBg(phk,{gd:1,eager:1,sizes:'(min-width:960px) 42vw, 100vw'})+'</div>':'')+
        '<div class="wrap gmx-in"><div class="gmx-body">'+
        '<p class="gmx-meta">'+esc(sp?sp.name:'')+(g.ex?' \u00b7 Exhibition':'')+' \u00b7 '+gmDate(g,1)+(g.note?' \u00b7 '+esc(g.note):'')+'</p>'+
        '<h1 class="gmx-h1"><span class="gmx-smu">SMU</span> <span class="gmx-vs">'+gmVs(g)+'</span> <span class="gmx-opp">'+esc(g.opp)+'</span></h1>'+
        (m?'<div class="gmx-score" role="group" aria-label="Final'+(g.ex?', exhibition':'')+': SMU '+us+', '+esc(g.opp)+' '+them+'">'+
            '<span class="gmx-n'+(us>them?' win':'')+'"><small>SMU</small><b>'+us+'</b></span><span class="gmx-f" aria-hidden="true">F</span>'+
            '<span class="gmx-n'+(them>us?' win':'')+'"><small>'+esc(g.opp)+'</small><b>'+them+'</b></span></div>':
          '<div class="gmx-when"><p class="gmx-ko"><span>'+C.verb+'</span><b>'+esc(g.time||'Time TBA')+'</b></p>'+
            (isNext?'<div class="cd gm-cd" data-ko="'+Date.parse(g.ko)+'" role="timer" aria-label="Countdown to '+C.verb.toLowerCase()+'">'+['Days','Hrs','Min','Sec'].map(function(u){return '<div><b>--</b><small>'+u+'</small></div>'}).join('')+'</div>':'')+'</div>')+
        '<p class="gm-links gmx-links"><a class="btn btn-red btn-sm gm-thread" href="'+gameThreadUrl(g)+'">Game thread</a>'+gmOut(L.recap,'Recap')+gmOut(L.box,'Box score')+gmOut(L.preview,'Preview')+gmOut(sbUrl(g.sb),'Live stats')+gmOut(L.gamecenter,'Game Center')+'</p>'+
        '</div></div></section>'+
      '<section class="gmx-facts-sec" aria-label="Game details"><div class="wrap"><dl class="gm-facts gmx-facts">'+gmFact('Date',gmDate(g,1))+gmFact(C.verb,g.time)+gmFact(g.venue?'Venue':'Where',where)+gmFact('TV / stream',g.tv)+gmFact('Radio',g.radio)+'</dl></div></section>'+
      /* live score / status and play-by-play: assets/cfbd-live.js finds this .gm-match card and adds its .cf-wrap block
         (with the CollegeFootballData.com credit); the section stays hidden until that block is there */
      '<section class="sec gm-live-sec" id="live"><div class="wrap"><div class="gm-live gm-match" id="gmLive"><h2 class="gm-h">Play-by-play</h2></div></div></section>'+
      '<section class="sec gm-top"><div class="wrap">'+
        '<div class="gm-how" id="how"><h2 class="sec-t gm-how-t">How to watch and listen</h2><div class="gm-how-g">'+
          '<div class="gm-how-i"><h3>Watch</h3><p>'+(g.tv?esc(g.tv):'TBA')+'</p>'+gmOut(L.watch,'Watch link from SMU Athletics')+'</div>'+
          '<div class="gm-how-i"><h3>Listen</h3><p>'+(g.radio?esc(g.radio):'TBA')+'</p>'+gmOut(L.listen,'Listen live')+'</div>'+
          (sbUrl(g.sb)?'<div class="gm-how-i"><h3>Follow</h3><p>Live stats during the game from SMU\u2019s official StatBroadcast box score.</p>'+gmOut(sbUrl(g.sb),'Live stats')+'</div>':'')+'</div></div>'+
      '</div></section>'+(MP.gameStats?MP.gameStats(g):'')+
      '<section class="sec tight outlets gm-vids" id="videos" hidden><div class="wrap" id="gmVideos"></div></section>'+
      (function(){var A=gmArticles(g);return A.length?'<section class="sec" id="stories"><div class="wrap">'+secHead('Related articles')+'<div class="cgrid">'+A.map(cardHTML).join('')+'</div></div></section>':''})()+
      (MP.FEATURES&&MP.FEATURES.checkin===true?'<section class="sec" id="checkin"><div class="wrap">'+secHead('Student check-in')+'<div class="gm-card gm-checkin"><p>Check in at the game.</p></div></div></section>':'')+
      '<section class="sec" id="team"><div class="wrap">'+secHead(esc(sp?sp.name:''))+'<div class="gm-team">'+
        '<a class="gm-tl" href="'+sportUrl(g.sport)+'#roster">Roster</a><a class="gm-tl" href="'+sportUrl(g.sport)+'#schedule">Schedule</a><a class="gm-tl" href="'+gameThreadUrl(g)+'">Game thread</a><a class="gm-tl" href="'+sportUrl(g.sport)+'#board">Team board</a><a class="gm-tl" href="'+ROOT+'games/">All games</a></div>'+
        '<nav class="gm-pn" aria-label="Other games">'+(prev?'<a class="gm-p" href="'+gameUrl(prev)+'"><small>Previous game</small><b>SMU '+gmVs(prev)+' '+esc(prev.opp)+' \u00b7 '+gmDate(prev)+'</b></a>':'<span></span>')+
          (next?'<a class="gm-n" href="'+gameUrl(next)+'"><small>Next game</small><b>SMU '+gmVs(next)+' '+esc(next.opp)+' \u00b7 '+gmDate(next)+'</b></a>':'')+'</nav>'+
        '<p class="gm-src">Game details from the <a href="'+esc((MP.GAMES.src||{})[g.sport]||'https://smumustangs.com')+'" target="_blank" rel="noopener">SMU Athletics schedule</a>'+(MP.GAMES.checked?', checked '+esc(MP.GAMES.checked):'')+'.</p></div></section>';
    startCountdowns();
    /* the one demo skin takeover (assets/ads.js): the next football game's page */
    if(isNext&&g.sport==='football'&&MP.adSkin)MP.adSkin();
    if(window.fetch)fetch(ROOT+'data/videos-feed.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw r.status;return r.json()}).then(function(F){var V=gmVideos(g,F),el=$('#gmVideos');
      el.innerHTML=secHead('Videos')+(V.length?outletRail(V,title+' videos')+'<p class="studio-note">Public videos, shown for demo purposes. Not affiliated.</p>':
        '<p class="gm-empty">No videos about this game yet. Previews and highlights from SMU outlets show up here as they are posted.</p>');
      el.closest('section').hidden=false;orowArrows();slSyncAll();setTimeout(function(){orowArrows();slSyncAll()},600);
      if(/^#watch=yt-/.test(location.hash))articleFromHash()}).catch(function(){})}
  /* which outlet or show a library item belongs to, for the show filter (articles belong to none) */
  function libShow(c){var h=(c.credit||'')+' '+(c.label||'');
    return /On The Pony Express/i.test(h)?'on-the-pony-express':/Locked On SMU/i.test(h)?'locked-on-smu':/ACC Digital/i.test(h)?'acc-media':c.t!=='article'&&/SMU Athletics/i.test(h)?'smu-mustangs':''}
  function library(){continueRow();document.addEventListener('mp:history',continueRow);
    var P=new URLSearchParams(location.search),st={cat:P.get('cat')||'all',type:P.get('type')||'all',access:'all',q:P.get('q')||'',show:P.get('show')||'all'};
    if(!CATNAME[st.cat])st.cat='all';if(!/^(all|video|article|podcast)$/.test(st.type))st.type='all';if(!/^(all|free|members)$/.test(st.access))st.access='all';if(!/^[\w-]+$/.test(st.show))st.show='all';
    var chips=$('#libChips'),grid=$('#libGrid'),rgrid=$('#libReadGrid'),count=$('#libCount'),q=$('#libQ'),empty=$('#libEmpty'),showSel=$('#libShowSel');
    chips.innerHTML=MP.CATS.map(function(c){return '<button type="button" class="chip" data-cat="'+c[0]+'" aria-pressed="false">'+c[1]+'</button>'}).join('');
    /* phones: category and format as two native dropdowns; the show chips scroll sideways */
    var catSel=$('#libCatSel'),typeSel=$('#libTypeSel');
    if(catSel)catSel.innerHTML=MP.CATS.map(function(c){return '<option value="'+c[0]+'">'+(c[0]==='all'?'All categories':c[1])+'</option>'}).join('');
    if(typeSel)typeSel.innerHTML=$$('#libType button').map(function(b){var t=b.dataset.type;return '<option value="'+t+'">'+(t==='all'?'Format':b.textContent.trim())+'</option>'}).join('');
    grid.innerHTML=MP.LIB.filter(function(c){return c.t!=='article'}).map(function(c){return cardHTML(c)}).join('');
    rgrid.innerHTML=MP.LIB.filter(function(c){return c.t==='article'}).map(function(c){return cardHTML(c)}).join('');q.value=st.q;
    function itemOf(el){var id=el.dataset.pod||el.dataset.item||(el.querySelector('[data-item]')||{dataset:{}}).dataset.item;return PODBY[id]||LIBBY[id]}
    function ok(c,show){if(!c)return false;var hay=(c.title+' '+c.desc+' '+c.label).toLowerCase();
      return (st.cat==='all'||c.cat===st.cat)&&(st.type==='all'||c.t===st.type)&&(st.access==='all'||(st.access==='free')===!c.lock)&&(st.show==='all'||show===st.show)&&
        st.q.toLowerCase().split(/\s+/).filter(Boolean).every(function(t){return hay.indexOf(t)>=0})}
    function apply(push){var seen={},n=0;function hit(c){if(!seen[c.id]){seen[c.id]=1;n++}}
      $$('.chip',chips).forEach(function(b){b.setAttribute('aria-pressed',b.dataset.cat===st.cat?'true':'false')});
      if(showSel){showSel.value=st.show;if(showSel.value!==st.show)showSel.value='all';showSel.classList.toggle('on',st.show!=='all')}
      $$('#libType button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.type===st.type?'true':'false')});
      if(catSel)catSel.value=st.cat;if(typeSel)typeSel.value=st.type;
      [grid,rgrid].forEach(function(g){var k=0;$$('.mcard',g).forEach(function(el){var c=LIBBY[el.dataset.item],y=ok(c,libShow(c));el.hidden=!y;if(y){k++;hit(c)}});g.closest('section').classList.toggle('is-off',!k)});
      ['#outlets','#pods'].forEach(function(sel){var sec=$(sel);if(!sec)return;var any=0;
        $$('.orow-sec',sec).forEach(function(r){var k=0;if(!(r.hasAttribute('data-new')&&st.show!=='all'))$$('.rail-i',r).forEach(function(i){var c=itemOf(i),y=ok(c,i.dataset.show);i.hidden=!y;if(y){k++;hit(c)}});
          r.hidden=!k;if(k){any=1;var rl=r.querySelector('.rail');if(rl)rl.scrollLeft=0}});
        sec.classList.toggle('is-off',!any)});
      var active=st.cat!=='all'||st.type!=='all'||st.access!=='all'||st.q||st.show!=='all';
      var cs=$('#continue');if(cs)cs.classList.toggle('is-off',!!active);
      count.textContent=n+' '+(n===1?'title':'titles');$('#libClear').hidden=!active;
      $('#libNone').hidden=n>0;if(!n)empty.innerHTML=emptyState('filter','Nothing matches those filters','Try a different category, show or format, or clear the filters.','<button type="button" class="btn btn-navy btn-sm" data-lib-clear>Clear filters</button>');
      slSyncAll();orowArrows();
      if(push){var u=new URLSearchParams();['cat','type','access','show'].forEach(function(k){if(st[k]!=='all')u.set(k,st[k])});if(st.q)u.set('q',st.q);var s=u.toString();history.replaceState(null,'',location.pathname+(s?'?'+s:'')+location.hash)}}
    function clear(){st={cat:'all',type:'all',access:'all',q:'',show:'all'};q.value='';apply(true)}
    chips.addEventListener('click',function(e){var b=e.target.closest('.chip');if(b){st.cat=b.dataset.cat;apply(true)}});
    if(showSel)showSel.addEventListener('change',function(){st.show=showSel.value;apply(true)});
    $('#libType').addEventListener('click',function(e){var b=e.target.closest('button');if(b){st.type=b.dataset.type;apply(true)}});
    q.addEventListener('input',function(){st.q=q.value.trim();apply(true)});
    if(catSel)catSel.addEventListener('change',function(){st.cat=catSel.value;apply(true)});
    if(typeSel)typeSel.addEventListener('change',function(){st.type=typeSel.value;apply(true)});
    document.addEventListener('click',function(e){if(e.target.closest('[data-lib-clear],#libClear'))clear()});
    apply(false);
    Promise.all([outletsRow().catch(function(){}),podsRow().catch(function(){})]).then(function(){
      if(LIB_SHOWS.length){LIB_SHOWS.sort(function(a,b){return a[2]-b[2]});if(showSel)showSel.innerHTML=[['all','All shows']].concat(LIB_SHOWS).map(function(x){return '<option value="'+esc(x[0])+'">'+esc(x[1])+'</option>'}).join('')}
      if(st.show!=='all'&&!LIB_SHOWS.some(function(x){return x[0]===st.show}))st.show='all';
      apply(false)})
  }

  /* ---------- Recruiting hub ---------- */
  function composite(v){var h=0,s=v[0];for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%997;return (0.80+v[4]*0.03+h/997*0.029).toFixed(4)}
  function recruiting(){
    if(!REC_ON){var mn=$('main');document.title='Recruiting is paused | SMU+';if(mn)mn.innerHTML='<section class="page-hero"><div class="wrap"><h1 class="display">This section is paused</h1><p class="lede on-dark">Recruiting coverage is off for now.</p><p class="nf-act"><a class="btn btn-red" href="'+(ROOT||'./')+'">Go to the home page</a> <a class="btn btn-ghost" href="'+ROOT+'boards/">The Mustang Board</a></p></div></section>';return}
    var all=[];MP.VISITS.forEach(function(w){w.list.forEach(function(v){all.push({v:v,w:w})})});
    all.sort(function(a,b){return composite(b.v)-composite(a.v)});
    $('#recBoard').innerHTML=all.slice(0,6).map(function(x,i){var v=x.v;return '<article class="rk"><span class="rk-n">'+(i+1)+'</span><div class="rk-b"><b>'+esc(v[0])+'</b><small>'+v[1]+' · '+v[2]+' · '+esc(v[3])+'</small>'+
      '<div class="rk-r">'+stars(v[4])+'<span class="rk-c" title="SMU+ composite (fictional)">'+composite(v)+'</span></div></div><span class="rk-s'+(/lean|SMU/.test(v[6])?' good':/elsewhere/.test(v[6])?' bad':'')+'">'+esc(v[6])+'</span></article>'}).join('');
    $('#recNotes').innerHTML=MP.NOTES.map(function(n){return '<article class="ncard"><p class="note-t">'+esc(n[1])+'<span>'+n[0]+' ago</span></p><p>'+esc(n[2])+'</p><p class="meta">'+esc((MP.STAFF.jt||{n:'Staff'}).n)+' · Insider (fictional)</p></article>'}).join('');
    var vf='all';function renderVisits(){var html=MP.VISITS.map(function(w){var list=w.list.filter(function(v){return vf==='all'||v[5]===vf});
        var ov=w.list.filter(function(v){return v[5]==='Official'}).length;
        return '<div class="visit-wk"><div class="visit-h"><b>'+w.date+'</b><span>'+esc(w.game)+'</span><em><span class="vb ov">'+ov+' official</span><span class="vb">'+(w.list.length-ov)+' unofficial</span></em></div>'+
          (list.length?table({cols:['Prospect','Pos','Class','Hometown','Rating','Visit','Status'],rows:list.map(function(v){return [v[0],v[1],v[2],v[3],'★'.repeat(v[4]),v[5],v[6]]})},{cls:'vis'}):'<p class="mini-empty">No '+vf.toLowerCase()+' visitors listed for this weekend.</p>')+'</div>'}).join('');
      $('#recVisits').innerHTML=html;$$('#visitFilter button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.v===vf?'true':'false')});$$('#recVisits .tbl.vis').forEach(sortable)}
    $('#visitFilter').addEventListener('click',function(e){var b=e.target.closest('button');if(b){vf=b.dataset.v;renderVisits()}});renderVisits();
    var dir='in',pf={pos:'',status:'',q:''};var posSel=$('#portalPos'),stSel=$('#portalStatus'),pq=$('#portalQ');
    function opts(sel,label,vals){sel.innerHTML='<option value="">'+label+'</option>'+vals.map(function(v){return '<option>'+esc(v)+'</option>'}).join('')}
    function uniq(i){var s={};MP.PORTAL.in.concat(MP.PORTAL.out).forEach(function(r){s[r[i]]=1});return Object.keys(s).sort()}
    opts(posSel,'All positions',uniq(1));opts(stSel,'All statuses',uniq(4));
    function renderPortal(){var rows=MP.PORTAL[dir].filter(function(r){return (!pf.pos||r[1]===pf.pos)&&(!pf.status||r[4]===pf.status)&&(!pf.q||(r[0]+' '+r[3]).toLowerCase().indexOf(pf.q)>=0)});
      $('#portalTable').innerHTML=rows.length?table({cols:['Player','Pos','Class',dir==='in'?'From':'To','Status','Date'],rows:rows},{cls:'portal',caption:'Transfer portal '+(dir==='in'?'incoming':'outgoing')}):
        emptyState('filter','No portal moves match','Nothing on the '+(dir==='in'?'incoming':'outgoing')+' list fits those filters.','<button type="button" class="btn btn-navy btn-sm" id="portalClear">Clear filters</button>');
      sortable($('#portalTable table'));$$('#portalTable td:nth-child(5)').forEach(function(td){var v=td.textContent;td.innerHTML='<span class="stat-chip '+(/Commit/.test(v)?'good':/Enter|Visit/.test(v)?'mid':'')+'">'+esc(v)+'</span>';td.dataset.v=v});
      $('#recCount').textContent=rows.length+' of '+MP.PORTAL[dir].length+' shown · '+MP.PORTAL.in.length+' in, '+MP.PORTAL.out.length+' out';
      $$('#portalTabs button').forEach(function(x){x.setAttribute('aria-selected',x.dataset.p===dir?'true':'false')});
      var pc=$('#portalClear');if(pc)pc.addEventListener('click',function(){pf={pos:'',status:'',q:''};posSel.value=stSel.value=pq.value='';renderPortal()})}
    $$('#portalTabs button').forEach(function(b){b.addEventListener('click',function(){dir=b.dataset.p;renderPortal()})});
    posSel.addEventListener('change',function(){pf.pos=posSel.value;renderPortal()});stSel.addEventListener('change',function(){pf.status=stSel.value;renderPortal()});
    pq.addEventListener('input',function(){pf.q=pq.value.trim().toLowerCase();renderPortal()});renderPortal();
    $('#recRail').innerHTML=secHead('Recruiting reads',libUrl('recruiting'),'See all')+rail(byCat('recruiting').concat(byCat('portal')));
  }

  /* ---------- Boards: a traditional forum (XenForo/On3-style index, thread list and thread view, Reddit-style sorting).
     Every number shown is counted from real threads and posts (or the database's views); nothing is seeded.
     Unread tracking, bookmarks and the "mark all read" cutoff live in this browser (localStorage). ---------- */
  function boards(){
    var Q=new URLSearchParams(location.search),PER=20,PPER=20;
    var indexView=$('#indexView'),listView=$('#listView'),threadView=$('#threadView');
    var state={f:Q.get('f')||'',sport:Q.get('sport')||'',team:Q.get('team')||'',sort:Q.get('sort')||'latest',q:(Q.get('q')||'').trim(),page:Math.max(1,parseInt(Q.get('page'),10)||1)};
    if(['latest','new','top'].indexOf(state.sort)<0)state.sort='latest';
    var TEAMS=[{id:'football',name:'Football',desc:'Game threads, depth chart talk and everything on the gridiron.',sports:['football']},
      {id:'basketball',name:'Basketball',desc:'Men\u2019s and women\u2019s hoops at Moody Coliseum.',sports:['mens-basketball','womens-basketball']},
      {id:'olympic',name:'Olympic sports',desc:'Soccer, volleyball, swimming and diving, golf, tennis, track, rowing and equestrian.',sports:null}];
    var MAIN=['football','mens-basketball','womens-basketball'];
    function teamSports(tm){return tm.sports||MP.SPORTS.map(function(s){return s.slug}).filter(function(s){return MAIN.indexOf(s)<0})}
    function teamBy(id){for(var i=0;i<TEAMS.length;i++)if(TEAMS[i].id===id)return TEAMS[i];return null}
    var CATS=[{name:'SMU sports talk',ids:['hilltop','paddock','recruiting']},{name:'Team boards',teams:true},{name:'Around the Hilltop',ids:['boulevard','help']}];
    var DESC={hilltop:'The main board for every Mustang fan. Game talk, takes and hype.',paddock:'Insider notes, practice reports and staff intel.'};
    function fdesc(f){return DESC[f.id]||String(f.desc||'').replace(/\s*Members[- ]only[^.]*\.?/ig,'').trim()}
    /* ---- time: real timestamps when the post has one; sample posts are spread between the thread's start and now ---- */
    var NOW=Date.now(),DAY=864e5;
    var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function agoMs(s){var m={m:6e4,h:36e5,d:DAY,w:7*DAY},x=String(s||'').match(/(\d+)\s*(\w)/);return x?(+x[1])*(m[x[2]]||6e4):36e5}
    function okT(v){return v&&!isNaN(Date.parse(v))}
    function times(t){var n=t.posts.length;if(t._ts&&t._tn===n)return t._ts;
      var start=t.posts[0]&&okT(t.posts[0][3])?Date.parse(t.posts[0][3]):NOW-agoMs(t.ago),tot=Math.max(6e4,NOW-start);
      t._ts=t.posts.map(function(p,i){return okT(p[3])?Date.parse(p[3]):Math.round(start+tot*(i/(n+1)))});t._tn=n;return t._ts}
    function startT(t){return times(t)[0]}
    function lastT(t){var a=times(t);return a[a.length-1]}
    function clock(d){var h=d.getHours(),m=d.getMinutes();return (h%12||12)+':'+(m<10?'0':'')+m+' '+(h<12?'AM':'PM')}
    function when(ms){var s=(Date.now()-ms)/1000;if(s<60)return 'A moment ago';if(s<3600){var m=Math.round(s/60);return m+(m===1?' minute ago':' minutes ago')}
      var d=new Date(ms),t0=new Date();t0.setHours(0,0,0,0);t0=t0.getTime();
      if(ms>=t0)return 'Today at '+clock(d);if(ms>=t0-DAY)return 'Yesterday at '+clock(d);if(ms>=t0-6*DAY)return DAYS[d.getDay()]+' at '+clock(d);
      return MON[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear()}
    function full(ms){var d=new Date(ms);return MON[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear()+' at '+clock(d)}
    function tm(ms){return '<time datetime="'+new Date(ms).toISOString()+'" title="'+full(ms)+'">'+when(ms)+'</time>'}
    /* ---- this browser's read state: {all: cutoff ms, t: {threadId: posts seen}} and bookmarks ---- */
    function lsj(k,d){try{return JSON.parse(localStorage.getItem(k)||'null')||d}catch(e){return d}}
    function lss(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
    var READ=lsj('mp_fx_read',{});READ.t=READ.t||{};var MARKS=lsj('mp_fx_marks',{});
    function seen(t){var v=READ.t[t.id];if(v!=null)return Math.min(v,t.posts.length);var cut=Math.max(READ.all||0,NOW-3*DAY),n=0;times(t).forEach(function(x){if(x<=cut)n++});return n}
    function unread(t){return !t.locked&&t.posts.length>seen(t)}
    function markRead(t){READ.t[t.id]=t.posts.length;var k=Object.keys(READ.t);if(k.length>400)k.slice(0,k.length-400).forEach(function(x){delete READ.t[x]});lss('mp_fx_read',READ)}
    function markAll(){READ={all:Date.now(),t:{}};lss('mp_fx_read',READ)}
    /* ---- shared helpers ---- */
    var RANKS=[[500,'All-American'],[150,'All-Conference'],[50,'Senior'],[15,'Junior'],[5,'Sophomore'],[0,'Freshman']];
    function rank(n){for(var i=0;i<RANKS.length;i++)if(n>=RANKS[i][0])return RANKS[i][1];return 'Freshman'}
    function U(id){return MP.USERS[id]||{n:'Member',since:''}}
    function prefix(t){var s=t.sport&&sportBy(t.sport);return s?'<span class="fx-pre">'+esc(s.name)+'</span>':''}
    function num(n){return (+n||0).toLocaleString()}
    function nRep(t){return t.locked?null:(t.replies!=null?t.replies:Math.max(0,t.posts.length-1))}
    function inTeam(t,tm){return !!t.sport&&teamSports(tm).indexOf(t.sport)>=0}
    function newest(list){var b=null;list.forEach(function(t){if(!b||lastT(t)>lastT(b))b=t});return b}
    function stat(k){return (MP.SPORT_STATS||{})[k]||{threads:0,posts:0}}
    function teamStats(tm){var o={threads:0,posts:0};teamSports(tm).forEach(function(s){var x=stat(s);o.threads+=x.threads||0;o.posts+=x.posts||0});return o}
    function fmt(s){var h=esc(String(s||'')).replace(/\r\n?/g,'\n');
      h=h.replace(/\bhttps?:\/\/[^\s<]+[^\s<.,;:!?)]/g,function(u){return '<a href="'+u+'" rel="nofollow noopener" target="_blank">'+u+'</a>'});
      h=h.replace(/(^|[\s(])@([A-Za-z0-9_][A-Za-z0-9_.-]{1,29}[A-Za-z0-9_])/g,'$1<span class="fx-at">@$2</span>');
      return h.split(/\n{2,}/).map(function(par){return '<p>'+par.replace(/\n/g,'<br>')+'</p>'}).join('')}
    function crumbs(items){return '<nav class="fx-crumbs" aria-label="Breadcrumb"><ol>'+items.map(function(x,i){return '<li>'+(x[1]?'<a href="'+x[1]+'">'+esc(x[0])+'</a>':'<span aria-current="page">'+esc(x[0])+'</span>')+'</li>'}).join('')+'</ol></nav>'}
    function pager(cur,pages,href){if(pages<2)return '';var out=[],sh={};[1,pages,cur-1,cur,cur+1].forEach(function(p){if(p>=1&&p<=pages)sh[p]=1});var last=0;
      for(var p=1;p<=pages;p++){if(!sh[p])continue;if(last&&p-last>1)out.push('<span class="fx-pg-gap" aria-hidden="true">\u2026</span>');
        out.push(p===cur?'<span class="fx-pg cur" aria-current="page">'+p+'</span>':'<a class="fx-pg" href="'+href(p)+'">'+p+'</a>');last=p}
      return '<nav class="fx-pages" aria-label="Pages">'+(cur>1?'<a class="fx-pg nav" href="'+href(cur-1)+'">Prev</a>':'')+out.join('')+(cur<pages?'<a class="fx-pg nav" href="'+href(cur+1)+'">Next</a>':'')+'</nav>'}
    var BOOK='<svg class="fx-book" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3.5h11v16.6l-5.5-3.7-5.5 3.7z"/></svg>',SHARE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7a3 3 0 0 0 .1.8L8.4 11.2a3 3 0 1 0 0 3.6l6.7 3.4A3 3 0 1 0 18 16z"/></svg>';
    var HEART='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.3 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.8 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>';
    /* ================= Board index ================= */
    function nodeRow(o){var t=o.last,lu=t&&U(t.posts[t.posts.length-1][0]),un=o.list.some(unread);
      return '<div class="fx-node'+(un?' unread':'')+'">'+
        '<div class="fx-node-main"><h3 class="fx-node-t"><a href="'+o.href+'">'+esc(o.name)+'</a>'+(un?'<span class="fx-new">New</span>':'')+'</h3><p class="fx-node-d">'+esc(o.desc)+'</p>'+
        (o.subs?'<p class="fx-subs">'+o.subs+'</p>':'')+
        '<p class="fx-node-mob">'+num(o.threads)+(o.threads===1?' thread':' threads')+' \u00b7 '+num(o.posts)+(o.posts===1?' message':' messages')+'</p></div>'+
        '<dl class="fx-node-stats"><div><dt>Threads</dt><dd>'+num(o.threads)+'</dd></div><div><dt>Messages</dt><dd>'+num(o.posts)+'</dd></div></dl>'+
        '<div class="fx-node-last">'+(t?avatar(t.posts[t.posts.length-1][0])+'<div><a class="fx-node-lt" href="#t'+t.id+'-last">'+esc(t.title)+'</a><span>'+tm(lastT(t))+' \u00b7 '+esc(lu.n)+'</span></div>':'<span class="fx-none">No posts yet</span>')+'</div></div>'}
    function renderIndex(){var used={},html='';
      CATS.forEach(function(c,ci){var rows=[];
        if(c.teams)TEAMS.forEach(function(tm){var list=MP.THREADS.filter(function(t){return inTeam(t,tm)}),st=teamStats(tm);
          rows.push(nodeRow({name:tm.name,desc:tm.desc,href:'?team='+tm.id,list:list,last:newest(list),threads:st.threads||list.length,posts:st.posts,
            subs:tm.sports&&tm.sports.length===1?'':teamSports(tm).map(function(s){var sp=sportBy(s);return sp?'<a href="?sport='+s+'">'+esc(sp.name)+'</a>':''}).join('')}))});
        else{var ids=c.ids.slice();if(ci===CATS.length-1)MP.FORUMS.forEach(function(f){if(!used[f.id]&&ids.indexOf(f.id)<0&&!CATS.some(function(x){return x.ids&&x.ids.indexOf(f.id)>=0}))ids.push(f.id)});
          ids.forEach(function(id){var f=forumBy(id);if(!f)return;used[id]=1;var list=MP.THREADS.filter(function(t){return t.f===id});
            rows.push(nodeRow({name:f.name,desc:fdesc(f),href:'?f='+id,list:list,last:newest(list),threads:f.threads,posts:f.posts}))})}
        if(rows.length)html+='<section class="fx-cat"><h2 class="fx-cat-h">'+esc(c.name)+'</h2><div class="fx-nodes">'+rows.join('')+'</div></section>'});
      $('#fxNodes').innerHTML=html;
      var tt=0,tp=0;MP.FORUMS.forEach(function(f){tt+=f.threads||0;tp+=f.posts||0});
      var posters={};MP.THREADS.forEach(function(t){if(!t.locked)t.posts.forEach(function(p){posters[p[0]]=1})});
      $('#fxStats').innerHTML='<div><dt>Threads</dt><dd>'+num(tt)+'</dd></div><div><dt>Messages</dt><dd>'+num(tp)+'</dd></div><div><dt>Posters</dt><dd>'+num(Object.keys(posters).length)+'</dd></div>';
      var lp=MP.THREADS.filter(function(t){return !t.locked}).slice().sort(function(a,b){return lastT(b)-lastT(a)}).slice(0,6);
      $('#fxLatest').innerHTML=lp.length?lp.map(function(t){var p=t.posts[t.posts.length-1];return '<li>'+avatar(p[0])+'<div><a href="#t'+t.id+'-last">'+esc(t.title)+'</a><span>'+esc(U(p[0]).n)+' \u00b7 '+tm(lastT(t))+'</span></div></li>'}).join(''):'<li class="fx-none">No posts yet</li>'}
    /* ================= Thread list ================= */
    function scope(){var f=state.f&&state.f!=='all'?forumBy(state.f):null,tmm=!f&&state.team?teamBy(state.team):null,sp=!f&&!tmm&&state.sport?sportBy(state.sport):null;
      var title=f?f.name:tmm?tmm.name:sp?sp.name:state.q?'Search results':'New posts',desc=f?fdesc(f):tmm?tmm.desc:sp?'Every thread tagged '+sp.name+', across all boards.':state.q?'Threads matching \u201c'+state.q+'\u201d across every board.':'The latest activity across every board.';
      var test=function(t){return f?t.f===f.id:tmm?inTeam(t,tmm):sp?t.sport===sp.slug:true};
      var crumb=[['Boards','./']];if(sp&&!f)crumb.push(['Team boards','./#team-boards']);
      return {f:f,team:tmm,sp:sp,title:title,desc:desc,test:test,crumb:crumb,all:!f}}
    function qs(o){var p=new URLSearchParams();var s=Object.assign({},state,o||{});
      if(s.f)p.set('f',s.f);if(s.team&&!s.f)p.set('team',s.team);if(s.sport&&!s.f&&!s.team)p.set('sport',s.sport);if(s.q)p.set('q',s.q);if(s.sort!=='latest')p.set('sort',s.sort);if(s.page>1)p.set('page',s.page);
      var x=p.toString();return x?'?'+x:'./'}
    function matches(t){if(!state.q)return true;var q=state.q.toLowerCase();return (t.title+' '+t.posts.map(function(p){return p[1]}).join(' ')).toLowerCase().indexOf(q)>=0}
    function threadRow(t,all){var last=t.posts[t.posts.length-1],lu=U(last[0]),r=nRep(t),un=unread(t),pages=Math.ceil(t.posts.length/PPER),f=forumBy(t.f);
      var jump='';if(pages>1){jump='<span class="fx-pj">';for(var p=1;p<=pages;p++)if(p<=3||p===pages)jump+='<a href="#t'+t.id+'-page'+p+'">'+p+'</a>';jump+='</span>'}
      return '<div class="fx-row'+(un?' unread':'')+(t.pin?' pinned':'')+'">'+'<span class="fx-row-av">'+avatar(t.by)+'</span>'+
        '<div class="fx-row-main"><p class="fx-row-t">'+(t.pin?'<span class="fx-pin" title="Pinned">'+PIN+'<span class="sr">Pinned</span></span>':'')+(un?'<span class="fx-new">New</span>':'')+prefix(t)+
          '<a class="fx-row-link" href="#t'+t.id+(un&&seen(t)>0?'-new':'')+'">'+esc(t.title)+'</a></p>'+
          '<p class="fx-row-m"><span>'+esc(U(t.by).n)+'</span> \u00b7 '+tm(startT(t))+(all&&f?' \u00b7 <a class="fx-row-f" href="?f='+f.id+'">'+esc(f.name)+'</a>':'')+jump+'</p>'+
          '<p class="fx-row-mob">'+(r==null?'':num(r)+(r===1?' reply':' replies')+' \u00b7 ')+'Last: '+esc(lu.n)+', '+tm(lastT(t))+'</p></div>'+
        '<dl class="fx-row-stats"><div><dt>Replies</dt><dd>'+(r==null?'\u2013':num(r))+'</dd></div>'+(VIEWS?'<div><dt>Views</dt><dd>'+(t.views?esc(t.views):'\u2013')+'</dd></div>':'')+'</dl>'+
        '<div class="fx-row-last"><a href="#t'+t.id+'-last">'+tm(lastT(t))+'</a><span>'+esc(lu.n)+'</span></div><span class="fx-row-lav">'+avatar(last[0])+'</span></div>'}
    var VIEWS=false;
    function renderList(){var sc=scope();
      var list=MP.THREADS.filter(function(t){return sc.test(t)&&matches(t)});
      VIEWS=!!SMU.live&&list.some(function(t){return !!t.views});  /* views only where the database really counted them */
      var by={latest:function(a,b){return lastT(b)-lastT(a)},'new':function(a,b){return startT(b)-startT(a)},top:function(a,b){return (nRep(b)||0)-(nRep(a)||0)||lastT(b)-lastT(a)}}[state.sort];
      var pins=list.filter(function(t){return t.pin}).sort(by),rest=list.filter(function(t){return !t.pin}).sort(by);
      var pages=Math.max(1,Math.ceil(rest.length/PER));if(state.page>pages)state.page=pages;var slice=rest.slice((state.page-1)*PER,state.page*PER);
      $('#fxListCrumbs').innerHTML=crumbs(sc.crumb.concat([[sc.title]]));
      $('#fxListTitle').textContent=sc.title;$('#fxListDesc').textContent=sc.desc;
      var pt=$('#fxPostThread');pt.dataset.forum=sc.f?sc.f.id:'';pt.dataset.sport=sc.sp?sc.sp.slug:sc.team&&sc.team.sports&&sc.team.sports.length===1?sc.team.sports[0]:'';
      $$('#fxSort button').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.sort===state.sort))});
      var lq=$('#fxListQ');if(document.activeElement!==lq)lq.value=state.q;lq.placeholder=sc.f?'Search '+sc.f.name:'Search threads';
      $('#fxListHead').innerHTML='<span class="fx-c-t">Thread</span><span class="fx-c-n"><span>Replies</span>'+(VIEWS?'<span>Views</span>':'')+'</span><span class="fx-c-l">Last post</span>';
      $('#fxListHead').classList.toggle('views',VIEWS);
      var rows='';if(pins.length&&state.page===1)rows+='<p class="fx-group">Pinned threads</p>'+pins.map(function(t){return threadRow(t,sc.all)}).join('')+(slice.length?'<p class="fx-group">Threads</p>':'');
      rows+=slice.map(function(t){return threadRow(t,sc.all)}).join('');
      $('#fxRows').classList.toggle('views',VIEWS);
      $('#fxRows').innerHTML=rows||(state.q?emptyState('search','No threads match \u201c'+esc(state.q)+'\u201d','Try fewer words, or search every board.','<a class="btn btn-outline btn-sm" href="'+qs({q:'',page:1})+'">Clear search</a>'):emptyState('chat','No threads here yet','Start the first one.','<button type="button" class="btn btn-red btn-sm" data-compose'+(sc.f?' data-forum="'+sc.f.id+'"':'')+(sc.sp?' data-sport="'+sc.sp.slug+'"':'')+'>Post thread</button>'));
      $('#fxListPages').innerHTML=pager(state.page,pages,function(p){return qs({page:p})});
      $('#fxListCount').textContent=list.length?num(list.length)+(list.length===1?' thread':' threads'):'';
      document.title=sc.title+' | The Mustang Board | SMU+'}
    $('#fxSort').addEventListener('click',function(e){var b=e.target.closest('[data-sort]');if(!b)return;state.sort=b.dataset.sort;state.page=1;history.replaceState(null,'',qs());renderList()});
    var qT;$('#fxListQ').addEventListener('input',function(){var v=this.value.trim();clearTimeout(qT);qT=setTimeout(function(){state.q=v;state.page=1;history.replaceState(null,'',qs());renderList()},150)});
    $('#fxListSearch').addEventListener('submit',function(e){e.preventDefault()});
    document.addEventListener('click',function(e){var b=e.target.closest('[data-mark-all]');if(!b)return;markAll();toast('Everything is marked as read.');renderIndex();if(!listView.hidden)renderList()});
    /* ================= Thread view ================= */
    var likes={},quoteIdx=null;
    function likeLine(o){if(!o||!o.names.length)return '';var n=o.names.slice();if(o.mine)n[0]='You';var s=n.length===1?n[0]:n.length===2?n[0]+' and '+n[1]:n.length===3?n[0]+', '+n[1]+' and '+n[2]:n[0]+', '+n[1]+' and '+(n.length-2)+' others';
      return '<span class="fx-likes-ic">'+HEART+'</span><span>'+esc(s)+'</span>'}
    function paintLikes(t){var m=likes[t.id]||{};$$('.fx-msg',threadView).forEach(function(el){var i=+el.dataset.i,o=m[i],bar=$('.fx-likes',el),b=$('[data-like]',el);
      if(bar){bar.innerHTML=likeLine(o);bar.hidden=!(o&&o.names.length)}if(b){b.setAttribute('aria-pressed',String(!!(o&&o.mine)));$('span',b).textContent=o&&o.mine?'Liked':'Like'}})}
    function loadLikes(t){SMU.likes(t).then(function(m){likes[t.id]=m;var cur=hashT();if(cur&&cur.id===t.id)paintLikes(t)},function(){})}
    function hashT(){var m=location.hash.match(/^#t(\d+)(?:-(p\d+|new|last|page\d+))?$/);return m?{id:+m[1],x:m[2]||''}:null}
    function findT(id){var t=null;MP.THREADS.forEach(function(x){if(x.id===id)t=x});return t}
    function msg(t,p,i,ctx){var u=U(p[0]),q=p[2]!=null?t.posts[p[2]]:null,me=SMU.me(),cnt=ctx.counts[p[0]]||0,ts=times(t)[i],st=u.staff,isNew=ctx.seen>0&&i>=ctx.seen&&ctx.unread;
      var badge=st?'<span class="fx-banner staff">Staff</span>':(p[0]===me&&SMU.tier&&SMU.tier()==='student')?'<span class="fx-banner">Student</span>':'<span class="fx-banner">Member</span>';
      var title=st?esc(u.tier||'SMU+ staff'):rank(cnt);
      var mk=MARKS[t.id+':'+i];
      return (isNew&&i===ctx.seen&&i>0?'<div class="fx-newline" id="t'+t.id+'-newline"><span>New</span></div>':'')+
        '<article class="fx-msg'+(i===0?' op':'')+'" id="t'+t.id+'-p'+(i+1)+'" data-i="'+i+'">'+
        '<div class="fx-user">'+avatar(p[0],true,true)+'<div class="fx-user-d"><b class="fx-name">'+esc(u.n)+'</b><span class="fx-rank">'+title+'</span>'+badge+
          '<span class="fx-time-m">'+tm(ts)+'</span></div>'+
          '<dl class="fx-user-x">'+(u.since?'<div><dt>Joined</dt><dd>'+esc(u.since)+'</dd></div>':'')+(ctx.all?'<div><dt>Messages</dt><dd>'+num(cnt)+'</dd></div>':'')+'</dl></div>'+
        '<div class="fx-main"><header class="fx-attr"><a class="fx-time" href="#t'+t.id+'-p'+(i+1)+'">'+tm(ts)+'</a>'+(p[0]===t.by&&i>0?'<span class="fx-op">Thread starter</span>':'')+
          '<span class="fx-attr-r">'+(isNew?'<span class="fx-new">New</span>':'')+
          '<button type="button" class="fx-ico" data-share="'+(i+1)+'" aria-label="Share post #'+(i+1)+'">'+SHARE+'</button>'+
          '<button type="button" class="fx-ico'+(mk?' on':'')+'" data-mark="'+i+'" aria-pressed="'+(mk?'true':'false')+'" aria-label="Bookmark post #'+(i+1)+'">'+BOOK+'</button>'+
          '<a class="fx-n" href="#t'+t.id+'-p'+(i+1)+'">#'+(i+1)+'</a></span></header>'+
        '<div class="fx-body">'+(q?'<blockquote class="fx-quote"><a class="fx-quote-h" href="#t'+t.id+'-p'+(p[2]+1)+'">'+esc(U(q[0]).n)+' said:</a><div class="fx-quote-b">'+fmt(q[1].length>400?q[1].slice(0,400)+'\u2026':q[1])+'</div></blockquote>':'')+
          (t.locked&&i===0?'<p class="fx-locked">The posts in this thread can\u2019t be shown right now.</p>':fmt(p[1]))+'</div>'+
        '<footer class="fx-act"><button type="button" class="fx-a rep" data-report="'+i+'" aria-label="Report post #'+(i+1)+'"'+(SMU.reported&&SMU.reported(t.id,i)?' data-done="1">Reported':'>Report')+'</button>'+
          (avPhoto(u)?'<button type="button" data-demo="Report profile photo" class="fx-a rep" aria-label="Report '+esc(u.n)+'\u2019s profile photo">Report photo</button>':'')+
          '<span class="fx-act-r"><button type="button" class="fx-a" data-like="'+i+'" aria-pressed="false">'+HEART+'<span>Like</span></button><button type="button" class="fx-a" data-quote="'+i+'">Quote</button><button type="button" class="fx-a" data-reply>Reply</button></span></footer>'+
        '<div class="fx-likes" hidden></div></div></article>'}
    function replyBox(t){if(!SMU.user)return '<div class="fx-reply out" id="fxReply"><p><b>Sign in or join free to post.</b> Anyone can read the boards. Posting takes a free account'+(SMU.live?'':' (demo accounts are saved in this browser)')+'. Please read the <a href="'+ROOT+'rules/">community rules</a> first.</p><a class="btn btn-red" href="'+ROOT+'account/" data-auth="in">Sign in</a> <a class="btn btn-outline" href="'+ROOT+'account/" data-auth="up">Join free</a></div>';
      return '<form class="fx-reply" id="fxReply" data-thread="'+t.id+'" novalidate><span class="fx-reply-av">'+avatar(SMU.me(),true)+'</span><div class="fx-reply-main"><div id="replyQ" hidden></div><label class="sr" for="replyText">Write your reply</label>'+
        '<textarea id="replyText" rows="4" maxlength="5000" placeholder="Write your reply\u2026" required></textarea><p class="reply-m" id="replyM" aria-live="polite"></p>'+
        '<div class="fx-reply-f"><span class="fx-reply-tip">Type @ and a name to mention someone. Keep it civil: <a href="'+ROOT+'rules/">community rules</a></span><button class="btn btn-red" type="submit">Post reply</button></div></div></form>'}
    function quotePreview(t){var rq=$('#replyQ');if(!rq)return;var p=quoteIdx!=null&&t.posts[quoteIdx];
      if(!p){rq.hidden=true;rq.innerHTML='';return}
      rq.hidden=false;rq.innerHTML='<blockquote class="fx-quote"><span class="fx-quote-h">'+esc(U(p[0]).n)+' said:</span><div class="fx-quote-b">'+fmt(p[1].length>240?p[1].slice(0,240)+'\u2026':p[1])+'</div><button type="button" class="fx-unquote" id="unquote" aria-label="Remove quote">Remove</button></blockquote>'}
    function renderThread(h){var t=findT(h.id);if(!t){threadView.innerHTML=crumbs([['Boards','./'],['Thread not found']])+emptyState('chat','That thread isn\u2019t here','It may have been removed, or the link is wrong.','<a class="btn btn-navy btn-sm" href="./">Back to the boards</a>');return}
      var f=forumBy(t.f)||{id:t.f,name:'Board'},n=t.posts.length,pages=Math.max(1,Math.ceil(n/PPER)),sn=seen(t),un=unread(t);
      var target=null,page=1;
      if(/^p\d+$/.test(h.x)){target=Math.min(n,Math.max(1,+h.x.slice(1)));page=Math.ceil(target/PPER)}
      else if(h.x==='last'){target=n;page=pages}else if(h.x==='new'){target=un?sn+1:n;page=Math.ceil(target/PPER)}
      else if(/^page\d+$/.test(h.x))page=Math.min(pages,Math.max(1,+h.x.slice(4)));
      var counts={};MP.THREADS.forEach(function(x){if(!x.locked)x.posts.forEach(function(p){counts[p[0]]=(counts[p[0]]||0)+1})});
      var ctx={counts:counts,seen:sn,unread:un,all:!SMU.live||paidT(SMU.tier())};
      var from=(page-1)*PPER,posts=t.posts.slice(from,from+PPER).map(function(p,j){return msg(t,p,from+j,ctx)}).join('');
      var r=nRep(t),ta=$('#replyText'),draft=ta&&+$('#fxReply').dataset.thread===t.id?ta.value:'';
      var pg=pager(page,pages,function(p){return '#t'+t.id+'-page'+p});
      var crumb=[['Boards','./'],[f.name,'?f='+f.id]];
      threadView.innerHTML=crumbs(crumb)+
        '<header class="fx-th"><h1 class="fx-th-t">'+prefix(t)+esc(t.title)+'</h1>'+
          '<p class="fx-th-m">'+(t.pin?'<span class="fx-pin">'+PIN+'</span>Pinned \u00b7 ':'')+'Started by <b>'+esc(U(t.by).n)+'</b> \u00b7 '+tm(startT(t))+(r==null?'':' \u00b7 '+num(r)+(r===1?' reply':' replies'))+(SMU.live&&t.views?' \u00b7 '+esc(t.views)+' views':'')+'</p></header>'+(t.game&&GBY[t.game]?gtBox(GBY[t.game]):'')+
        '<div class="fx-bar">'+pg+'<div class="fx-bar-r">'+(un&&sn>0?'<a class="btn btn-outline btn-sm" href="#t'+t.id+'-new">Jump to new</a>':'')+(n>1?'<a class="btn btn-outline btn-sm" href="#t'+t.id+'-last">Last post</a>':'')+'<button type="button" class="btn btn-red btn-sm" data-reply>Reply</button></div></div>'+
        '<div class="fx-msgs">'+posts+'</div>'+
        (pg?'<div class="fx-bar bottom">'+pg+'</div>':'')+
        (page===pages?replyBox(t):'<p class="fx-more"><a class="btn btn-outline" href="#t'+t.id+'-page'+(page+1)+'">Next page</a></p>')+
        '<button type="button" class="fx-fab" data-reply aria-label="Reply to this thread">Reply</button>';
      var t2=$('#replyText');if(t2&&draft)t2.value=draft;quotePreview(t);
      if(likes[t.id])paintLikes(t);loadLikes(t);
      document.title=t.title+' | '+f.name+' | SMU+';
      markRead(t);if(MP.adsMount)MP.adsMount('thread');/* sample ad slot after the 3rd post: assets/ads.js */
      if(watching.id!==t.id){watching.off();var u1=SMU.watch(t.id),u2=SMU.on('post:'+t.id,function(){setTimeout(function(){document.dispatchEvent(new CustomEvent('smu:post',{detail:t.id}))},0)});watching={id:t.id,off:function(){u1();u2()}}}
      fab();
      return target?(target===sn+1&&h.x==='new'&&$('#t'+t.id+'-newline')?'t'+t.id+'-newline':'t'+t.id+'-p'+target):null}
    var watching={id:null,off:function(){}},io=null;
    function fab(){var b=$('.fx-fab',threadView),els=[$('.fx-bar',threadView),$('#fxReply')].filter(Boolean),vis={};if(io)io.disconnect();if(!b)return;if(!('IntersectionObserver' in window)){b.classList.add('show');return}
      /* phones: the floating Reply shows only while neither the top Reply button nor the reply box is on screen */
      io=new IntersectionObserver(function(es){es.forEach(function(x){vis[els.indexOf(x.target)]=x.isIntersecting});b.classList.toggle('show',!els.some(function(_,i){return vis[i]}))});els.forEach(function(x){io.observe(x)})}
    threadView.addEventListener('click',function(e){var h=hashT();var t=h&&findT(h.id);if(!t)return;
      var qb=e.target.closest('[data-quote]'),rb=e.target.closest('[data-reply]'),lb=e.target.closest('[data-like]'),sb=e.target.closest('[data-share]'),mb=e.target.closest('[data-mark]');
      if(e.target.id==='unquote'){quoteIdx=null;quotePreview(t);var tx=$('#replyText');if(tx)tx.focus();return}
      if(lb){var i=+lb.dataset.like;requireUser('Sign in to like a post.',function(){var o=(likes[t.id]||{})[i],on=!(o&&o.mine);lb.disabled=true;
        SMU.toggleLike(t,i,on).then(function(){var m=likes[t.id]=likes[t.id]||{},x=m[i]=m[i]||{names:[],mine:false};
          if(on&&!x.mine){x.mine=true;x.names.unshift(SMU.user&&SMU.user.name||'You')}else if(!on&&x.mine){x.mine=false;x.names.shift()}lb.disabled=false;paintLikes(t)},function(err){lb.disabled=false;toast(err.message,'err')})});return}
      if(sb){var url=location.href.split('#')[0]+'#t'+t.id+'-p'+sb.dataset.share;
        if(navigator.share&&matchMedia('(pointer:coarse)').matches){navigator.share({title:t.title,url:url}).catch(function(){})}
        else if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(url).then(function(){toast('Link to post #'+sb.dataset.share+' copied.')},function(){prompt('Copy this link:',url)})}else prompt('Copy this link:',url);return}
      if(mb){var k=t.id+':'+mb.dataset.mark;if(MARKS[k])delete MARKS[k];else MARKS[k]=Date.now();lss('mp_fx_marks',MARKS);var on2=!!MARKS[k];mb.classList.toggle('on',on2);mb.setAttribute('aria-pressed',String(on2));toast(on2?'Bookmarked in this browser.':'Bookmark removed.');return}
      if(!qb&&!rb)return;
      var ta=$('#replyText');if(!ta){var a=$('[data-auth]',threadView);if(a)a.click();else{var nx=$('.fx-more a',threadView);if(nx)nx.click()}return}
      if(qb){quoteIdx=+qb.dataset.quote;quotePreview(t)}
      ta.scrollIntoView({block:'center',behavior:'smooth'});ta.focus()});
    threadView.addEventListener('submit',function(e){var f=e.target;if(f.id!=='fxReply')return;e.preventDefault();var ta=$('#replyText'),m=$('#replyM'),v=ta.value.trim(),tid=+f.dataset.thread;
      if(v.length<2){m.textContent='Write a little more before posting.';ta.focus();return}
      var b=$('button[type=submit]',f);b.disabled=true;m.textContent='Posting\u2026';
      SMU.reply(tid,v,quoteIdx).then(function(){quoteIdx=null;ta.value='';var t=findT(tid);location.hash='#t'+tid+'-p'+(t?t.posts.length:1);route();var el=$('#t'+tid+'-p'+(t?t.posts.length:1));if(el)el.classList.add('fx-just');toast('Reply posted.')},
        function(err){m.textContent=err.message||'Could not post. Try again.';b.disabled=false})});
    function rerender(){var h=hashT();if(h)renderThread(h);else if(!listView.hidden)renderList();else renderIndex()}
    SMU.on('auth',rerender);SMU.on('avatar',rerender);
    SMU.on('threads',function(){if(!indexView.hidden)renderIndex();if(!listView.hidden)renderList()});
    document.addEventListener('smu:post',function(ev){var h=hashT();if(!h||h.id!==ev.detail)return;renderThread({id:h.id,x:''})});
    function show(v){indexView.hidden=v!=='index';listView.hidden=v!=='list';threadView.hidden=v!=='thread';var m=$('main.fx');if(m)m.classList.toggle('fx-sub',v!=='index');
      /* one h1 per view: the board name on the index, the board or thread title elsewhere */
      var br=$('#fxBrand'),want=v==='index'?'H1':'P';if(br&&br.tagName!==want){var nb=document.createElement(want);nb.id='fxBrand';nb.className='fx-brand';nb.textContent=br.textContent;br.replaceWith(nb)}
      $$('.fx-tabs a').forEach(function(a){var h=a.getAttribute('href'),on=v==='index'?h==='./':v==='list'&&state.f==='all'&&!state.q?h==='?f=all':false;if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
    function gameRoute(){var m=location.hash.match(/^#game=([a-z]+-\d{3,8})$/);if(!m)return false;var gid=m[1],g=GBY[gid];show('thread');
      threadView.innerHTML=crumbs([['Boards','./'],['Game thread']])+'<p class="fx-wait" role="status">Opening the game thread…</p>';
      function fail(msg){threadView.innerHTML=crumbs([['Boards','./'],['Game thread']])+emptyState('chat','Game thread unavailable',msg,(g?'<a class="btn btn-navy btn-sm" href="'+gameUrl(g)+'">Back to the game page</a>':'<a class="btn btn-navy btn-sm" href="./">Back to the boards</a>'))}
      if(!g){fail('That game is not on the game-day hub.');return true}
      (SMU.ready||Promise.resolve()).then(function(){
        if(!SMU.live){var d=(MP.THREADS||[]).filter(function(x){return x.game===gid})[0];if(d){history.replaceState(null,'','#t'+d.id);route()}else fail('Game threads open on the live site. This copy is running in demo mode.');return}
        return SMU.gameThread(gid).then(function(id){if(!id){fail('This game does not have a thread yet.');return}
          return SMU.loadThread(id).then(function(){history.replaceState(null,'','#t'+id);route()})})}).catch(function(){fail('Could not reach the boards right now. Try again in a minute.')});
      return true}
    function route(){if(gameRoute())return;var h=hashT();
      if(h){show('thread');var anchor=renderThread(h);
        if(anchor){var el=document.getElementById(anchor);if(el)el.scrollIntoView({block:'start'})}else window.scrollTo(0,0);return}
      if(state.f||state.team||state.sport||state.q){show('list');renderList()}else{show('index');renderIndex()}}
    window.addEventListener('hashchange',function(){if(/^#(article|watch)=/.test(location.hash))return;route()});
    route();
    SMU.ready.then(function(){if(!SMU.live)return;$('#fxRows').setAttribute('aria-busy','true');
      return Promise.all([SMU.loadThreads(),SMU.boardStats()]).then(function(){NOW=Date.now();route()},function(){/* keep what's on screen; the toast explains */}).then(function(){$('#fxRows').removeAttribute('aria-busy')})});
  }

  /* ---------- Real non-football data (MP.REAL, from smumustangs.com) ---------- */
  function todayISO(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
  function rDate(iso){var d=new Date(iso+'T12:00:00Z');return MON[d.getUTCMonth()]+' '+d.getUTCDate()}
  function rRange(e){if(!e.d2||e.d2===e.d)return rDate(e.d);var a=new Date(e.d+'T12:00:00Z'),b=new Date(e.d2+'T12:00:00Z');return a.getUTCMonth()===b.getUTCMonth()?rDate(e.d)+'\u2013'+b.getUTCDate():rDate(e.d)+' \u2013 '+rDate(e.d2)}
  function realSummary(R){var parts=[],ks=Object.keys(R.rec);
    ks.forEach(function(k){var o=R.rec[k]&&R.rec[k][0];if(o&&!/^0-0(-0)?$/.test(o))parts.push((ks.length>1&&TEAM_LBL[k]?TEAM_LBL[k].replace("'s",'')+' ':'')+o)});
    if(parts.length)return {dt:'Record',dd:parts.join(' · ')};
    var done=R.events.filter(function(e){return e.res&&!e.ex&&/ of \d+/.test(e.res)});
    if(done.length){var l=done.sort(function(a,b){return (a.d2||a.d)<(b.d2||b.d)?-1:1})[done.length-1];return {dt:'Latest finish',dd:l.res,sub:(l.team&&TEAM_LBL[l.team]&&R.rec&&Object.keys(R.rec).length>1?TEAM_LBL[l.team]+' · ':'')+l.name}}
    var t=todayISO(),nx=R.events.filter(function(e){return !e.res&&!e.ex&&(e.d2||e.d)>=t})[0];
    return {dt:R.events.some(function(e){return e.res&&!e.ex})?'Next event':'Season opens',dd:nx?rDate(nx.d):'TBA',sub:nx?nx.name:''}}
  function realSched(R,team,slug){var t=todayISO(),multi=Object.keys(R.rec).length>1,ev=R.events,
      past=ev.filter(function(e){return (e.d2||e.d)<t||e.res}),firstUp=past.length,
      lo=Math.max(0,firstUp-5),hi=Math.min(ev.length,firstUp+8),hidden=ev.length-(hi-lo);
    var rows=ev.map(function(e,i){var name=(team&&e.ha!=='neutral'?(e.ha==='home'?'vs. ':'at '):'')+e.name+(e.ex?' (exh.)':''),
        who=multi&&TEAM_LBL[e.team]?'<span class="r-team">'+TEAM_LBL[e.team]+'</span>':'',
        tv=[e.time,e.tv].filter(Boolean).join(' · ');
      return '<tr'+(i<lo||i>=hi?' class="r-more" hidden':'')+(i===firstUp?' class="r-next"':'')+'><td>'+rRange(e)+'</td><td>'+who+(slug&&gameFor(slug,e.d)?'<a class="r-game" href="'+gameUrl(gameFor(slug,e.d))+'">'+esc(name)+'</a>':esc(name))+(e.recap?' <a class="r-recap" href="'+e.recap+'" target="_blank" rel="noopener">Recap<span class="sr"> (opens SMU Athletics)</span></a>':'')+'</td><td>'+esc(e.res||'\u2014')+'</td><td>'+esc(e.where||'')+'</td><td>'+esc(tv||'TBA')+'</td></tr>'}).join('');
    return '<div class="tbl-wrap"><table class="tbl sched sched-real"><thead><tr><th>Date</th><th>'+(team?'Opponent':'Event')+'</th><th>Result</th><th>Site</th><th>Time / TV</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
      (hidden>0?'<button type="button" class="btn btn-outline btn-sm r-toggle" data-r-toggle aria-expanded="false">Show full schedule ('+ev.length+')</button>':'')+
      ''}
  function realRoster(R,s){var multi=Object.keys(R.rec).length>1,SHOW=matchMedia('(max-width:639px)').matches?4:12;
    var cards=R.roster.map(function(a,i){return rosterCard(a,i,s,{more:i>=SHOW,team:multi&&TEAM_LBL[a.team]?TEAM_LBL[a.team]:''})}).join('');
    return '<div class="roster">'+cards+'</div>'+(R.roster.length>SHOW?'<button type="button" class="btn btn-outline btn-sm r-toggle" data-r-toggle aria-expanded="false">Show full roster ('+R.roster.length+')</button>':'')+
      '<div class="roster r-coaches">'+R.coaches.map(function(c,i){var cp=((MP.COACH_PHOTOS||{})[s.slug]||{})[c.name]||{};return rosterCard({name:c.name,pos:c.title,cls:'Coaching staff',url:cp.bio},i,s,{coach:1,key:cp.photo&&PH[cp.photo]?cp.photo:null,team:multi&&TEAM_LBL[c.team]?TEAM_LBL[c.team]:'',alt:c.name+', '+c.title+', SMU '+s.name})}).join('')+'</div>'+
      ''}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-r-toggle]');if(!b)return;
    var box=b.previousElementSibling,open=b.getAttribute('aria-expanded')==='true';if(!b.dataset.lbl)b.dataset.lbl=b.textContent;
    [].forEach.call(box.querySelectorAll('.r-more'),function(x){x.hidden=open});b.setAttribute('aria-expanded',String(!open));b.textContent=open?b.dataset.lbl:'Show less'});

  /* ---------- Sport program page ---------- */
  function sport(){
    var s=sportBy(body.dataset.sport);if(!s)return;
    var r=rng(s.slug),main=$('#sportMain');document.title=s.name+' | SMU+';
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
    var RD=s.slug!=='football'&&MP.REAL?MP.REAL[s.slug]:null,RS=RD?realSummary(RD):null;
    var GD=gameStrip(s.slug),realLog=s.slug==='football'&&SCH?SCH.games:null,record=realLog?SCH.record:RS?RS.dd:s.record,HERO_PH={football:'runout','mens-basketball':'mbb-jumper','mens-soccer':'msoc',volleyball:'vb-spike','swimming-diving':'swim','womens-basketball':'wbb-drive','womens-soccer':'wsoc',golf:'golf',tennis:'tennis','track-field':'track',rowing:'rowing',equestrian:'equestrian'}[s.slug];
    var content=((MP.ACCESS&&MP.ACCESS[s.slug])||[]).map(function(x){return typeof x==='string'?LIBBY[x]:x}).filter(Boolean).filter(recOK);
    content.forEach(function(c){LIBBY[c.id]=LIBBY[c.id]||c});
    var threads=MP.THREADS.filter(function(t){return t.sport===s.slug}),others=MP.SPORTS.filter(function(x){return x.slug!==s.slug});
    var RDR=RD||(s.slug==='football'&&MP.REAL&&MP.REAL.football)||null; /* roster block: football's real roster lives in MP.REAL.football */
    main.innerHTML=
      /* Phones: the hero is hidden so the sub-nav sits right under the header; this h1 stands in for screen readers (CSS shows only one) */
      '<h1 class="sr sp-srh">'+s.name+'</h1>'+
      '<section class="page-hero sp-hero'+(HERO_PH?' has-photo':'')+'">'+(HERO_PH?photoBg(HERO_PH,{eager:1,hero:1}):'')+'<div class="wrap">'+
        /* Title only: no breadcrumb trail, icon tile or kicker (Oct 26). Breadcrumbs live in the head as BreadcrumbList JSON-LD (build_pages.py). */
        '<h1 class="display sp-title">'+s.name+'</h1>'+
      '</div></section>'+
      '<nav class="jump" aria-label="On this page"><div class="wrap">'+(GD?'<a href="#gameday">Game day</a>':'')+'<a href="#roster">Roster</a><a href="#schedule">Schedule</a><a href="#content">Watch &amp; Read</a>'+(thirdFor(s.slug).length?'<a href="#media">Media</a>':'')+(FEEDS.posts[s.slug]?'<a href="#feeds">Feeds</a>':'')+'<a href="#board">Board</a><a href="#more">Other sports</a></div></nav>'+
      (GD?'<section class="gameday" aria-label="Game day"><div class="wrap" id="gameday">'+GD+'</div></section>':'')+'<section class="sec" id="roster"><div class="wrap">'+
        (RDR?secHead('Roster',null,null,'Real '+esc(RDR.season)+' roster')+'<p class="lede">The full '+esc(s.name.toLowerCase())+' roster from SMU Athletics. Tap a player for their bio.</p>'+realRoster(RDR,s):'')+
      '</div></section>'+
      '<section class="sec alt" id="schedule"><div class="wrap">'+secHead((teamSport?'Schedule':s.slug==='golf'||s.slug==='tennis'?'Events':'Meets')+' &amp; results',null,null,realLog?'2026 season · real results':RD?esc(RD.season)+' · real schedule':'2026–27 · sample data')+
        (RD?realSched(RD,teamSport,s.slug):realLog?table({cols:['Date','Opponent','Result','Site','Kickoff','TV'],rows:realLog.map(function(g){var gp=gameFor('football',g.d),nm=(g.home?'vs. ':'at ')+g.opp;return [gDate(g),gp?{html:'<a class="r-game" href="'+gameUrl(gp)+'">'+esc(nm)+'</a>'}:nm,g.res||'\u2014',g.site,gTime(g),g.tv||'TBA']})},{cls:'sched sched-full'}):
        table({cols:['Date',teamSport?'Opponent':'Event','Result','Site'],rows:games.map(function(g){return [mo[g.d.getMonth()]+' '+g.d.getDate(),(teamSport?(g.home?'vs. ':'at '):'')+g.o,g.res,g.home?'Home · Dallas':'Away']})},{cls:'sched'})+
        '<p class="note">Sample schedule with fictional opponents.</p>')+'</div></section>'+
      '<section class="sec" id="content"><div class="wrap">'+secHead(s.name+' all access',libUrl(),'Library','Only on SMU+')+'<div class="cgrid">'+content.map(cardHTML).join('')+'</div></div></section>'+
      mediaSection(s.slug,s.name)+feedsHTML(s.slug)+
      '<section class="sec alt" id="board"><div class="wrap">'+secHead('Team board',ROOT+'boards/?sport='+s.slug,'Open board','Talk '+s.name)+
        '<div class="box">'+(threads.length?threads.map(function(t){return threadRow(t,true)}).join(''):emptyState('chat','No '+esc(s.name)+' threads yet','Be the first to start the conversation on this board.','<button type="button" class="btn btn-red btn-sm" data-compose data-sport="'+s.slug+'">Start a thread</button><a class="btn btn-outline btn-sm" href="'+ROOT+'boards/">Browse all boards</a>'))+'</div></div></section>'+
      '<section class="sec" id="more"><div class="wrap">'+secHead('More Mustang sports',ROOT+'#sports','All sports')+
        '<div class="chips">'+others.map(function(o){return '<a class="chip" href="'+sportUrl(o.slug)+'">'+o.name+'</a>'}).join('')+'</div>'+
        (SHOW_PAID_PLANS?'<div class="band"><div><h2 class="sec-t">Never miss '+s.name+'.</h2><p>Plans from $9.99/mo.</p></div><a href="'+ROOT+'#membership" class="btn btn-white">See plans</a></div>':'')+'</div></section>';
    $$('.sched td:last-child').forEach(function(td){var v=td.textContent;td.innerHTML='<span class="res '+(/^W|^1st|^2nd/.test(v)?'w':/^L/.test(v)?'l':/^T|^\d/.test(v)&&!/PM|TBA/.test(v)?'t':'up')+'">'+esc(v)+'</span>'});
    if(GD)startCountdowns();
  }

  /* ---------- Athletes ---------- */
  /* ---------- Athletes comparison (real data from the profiles) ---------- */
  var CMP=[['PASS YDS','Pass yds'],['PASS TD','Pass TD'],['RUSH YDS','Rush yds'],['RUSH TD','Rush TD'],['REC','Rec'],['REC YDS','Rec yds'],['REC TD','Rec TD'],['TKL','Tackles'],['TFL','TFL'],['INT','Def. INT']];
  function compareHTML(){var FULL=MP.ATHLETES.filter(function(a){return !a.basic}),pos={};FULL.forEach(function(a){a.pos.split('/').forEach(function(p){pos[p]=1})});
    var rows=FULL.map(function(a){var m={};a.season.stats.forEach(function(x){m[x[0]]=x[1]});var def=/^(S|LB|CB|DL|DE|DT)$/.test(a.pos);
      var yr=(a.season.label.match(/^\d{4}/)||[''])[0];
      return '<tr data-pos="'+a.pos+'"><th scope="row"><a href="'+athleteUrl(a.id)+'">'+esc(a.name)+'</a></th><td class="n">'+a.num+'</td><td>'+a.pos+'</td><td>'+esc(a.cls)+'</td><td class="n">'+yr+(yr!=='2026'?'*':'')+'</td>'+
        CMP.map(function(c){var v=m[c[0]];if(c[0]==='INT'&&!def)v=undefined;return '<td class="n">'+(v==null?'\u2014':esc(v))+'</td>'}).join('')+'</tr>'}).join('');
    return '<div class="sec-hd" id="compare"><div><h2 class="sec-t">Compare players</h2></div></div>'+
      '<div class="toolbar"><div class="chips" id="cmpPos" role="group" aria-label="Filter by position"><button type="button" class="chip" data-pos="" aria-pressed="true">All</button>'+Object.keys(pos).map(function(p){return '<button type="button" class="chip" data-pos="'+p+'" aria-pressed="false">'+p+'</button>'}).join('')+'</div><span class="meta" id="cmpCount"></span></div>'+
      '<p class="swipe-hint" aria-hidden="true">Swipe the table for every stat <span>→</span></p><div class="tbl-wrap cmp-wrap"><table class="tbl cmp" id="cmpTable"><caption class="sr">Player comparison</caption><thead><tr><th>Player</th><th class="n">No.</th><th>Pos</th><th>Class</th><th class="n">Season</th>'+CMP.map(function(c){return '<th class="n">'+c[1]+'</th>'}).join('')+'</tr></thead><tbody>'+rows+'</tbody></table></div>'+
      '<p class="cmp-key">* 2025 season (no 2026 stats listed yet)</p>'}
  function initCompare(){var t=$('#cmpTable');if(!t)return;
    t.querySelectorAll('tbody th').forEach(function(th){th.dataset.v=th.textContent});
    var th0=$$('thead th',t);sortable(t);
    function apply(p){$$('#cmpPos .chip').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.pos===p?'true':'false')});var n=0;
      $$('tbody tr',t).forEach(function(r){var show=!p||r.dataset.pos.split('/').indexOf(p)>=0;r.hidden=!show;if(show)n++});$('#cmpCount').textContent=n+' of '+MP.ATHLETES.filter(function(a){return !a.basic}).length+' players'}
    $('#cmpPos').addEventListener('click',function(e){var b=e.target.closest('.chip');if(b)apply(b.dataset.pos)});apply('')}

  /* Verified public socials (assets/socials.js); the row is left out when a player has none. */
  function socialRow(a){var L=MP.socialsFor?MP.socialsFor(a.sport,a.num,a.name):[],NM={instagram:'Instagram',x:'X',tiktok:'TikTok',youtube:'YouTube'};if(!L.length)return '';
    return '<div class="pf-soc"><span class="pf-soc-k" aria-hidden="true">Follow</span><ul aria-label="'+esc(a.name)+' on social media">'+L.map(function(x){return '<li><a href="'+esc(x[2])+'" target="_blank" rel="noopener nofollow" aria-label="'+esc(a.name)+' on '+NM[x[0]]+' (opens in a new tab)">'+NM[x[0]]+'</a></li>'}).join('')+'</ul></div>'}
  function athlete(){
    var main=$('#athleteMain'),id=new URLSearchParams(location.search).get('id'),a=MP.athleteBy&&MP.athleteBy(id);
    if(!a){document.title='Football Player Profiles | SMU+';
      main.innerHTML='<section class="page-hero compact"><div class="wrap"><h1 class="display">Football player profiles</h1><p class="lede on-dark">Current SMU football players. Every stat and bio fact on these pages comes from a public source linked on the profile. Profiles for other sports are not built yet.</p></div></section>'+
        '<section class="sec"><div class="wrap"><div class="pgrid three">'+MP.ATHLETES.filter(function(a){return !a.basic}).map(profileCard).join('')+'</div></div></section>'+
        ['football','mens-basketball','womens-basketball'].map(function(sl){var L=MP.ATHLETES.filter(function(a){return a.basic&&a.sport===sl}).sort(function(x,y){return x.num-y.num});
          return L.length?'<section class="sec"><div class="wrap"><div class="sec-hd"><div><h2 class="sec-t">'+(sl==='football'?'More football profiles':esc(sportBy(sl).name)+' profiles')+'</h2></div><span class="meta">Roster facts from SMU Athletics</span></div><div class="pgrid three">'+L.map(profileCard).join('')+'</div></div></section>':''}).join('')+
        '<section class="sec alt"><div class="wrap">'+compareHTML()+'</div></section>';initCompare();return}
    var s=sportBy(a.sport),R=a.recruit,ext=' target="_blank" rel="noopener"',ARROW='<span aria-hidden="true"> ↗</span>';document.title=a.name+' · '+a.pos+' · SMU '+s.name+' | SMU+';
    var B=!!a.basic,others=MP.ATHLETES.filter(function(x){return x.id!==a.id&&x.sport===a.sport}).slice(0,8);
    var hero=a.photo?'<figure class="pf-photo has-photo">'+photo(a.photo,{eager:1})+CREDIT+'</figure>':
      '<div class="pf-photo" style="background:'+KIT_BG[a.kit]+'" role="img" aria-label="Photo placeholder, jersey number '+a.num+'">'+kit(a.num,a.kit)+'<span>Photo placeholder</span></div>';
    var vit=[[a.wt?'HT / WT':'Height',a.wt?a.ht+' / '+a.wt:a.ht],['Class',a.cls],['Hometown',a.hometown],['High school / prev.',a.prev]].filter(function(m){return m[1]});
    var recruitPanel=R?'<section class="panel" id="path"><div class="panel-h"><h3>Path to SMU</h3><span class="meta">Per SMU Athletics</span></div>'+
        '<dl class="pf-pre"><div><dt>High school</dt><dd>'+esc(R.hs)+'</dd></div><div><dt>Hometown</dt><dd>'+esc(R.town)+'</dd></div></dl>'+
        '<ol class="pf-path">'+R.path.map(function(p){return '<li><b>'+esc(p[0])+'</b><span>'+esc(p[1])+'</span>'+(p[2]?'<small>'+esc(p[2])+'</small>':'')+'</li>'}).join('')+'</ol>'+
        '</section>':'';
    var seen={},srcs=a.src.concat(R?R.src:[]).filter(function(x){var k=x[1].replace(/\/$/,'');if(seen[k])return false;seen[k]=1;return true});
    main.innerHTML=
      '<section class="pf-hero"><div class="wrap">'+
        '<nav class="crumbs pf-crumbs"><a href="'+ROOT+'athletes/">Player profiles</a> › <a href="'+sportUrl(a.sport)+'">'+s.name+'</a> › <span>'+esc(a.name)+'</span></nav>'+
        '<div class="pf-top">'+hero+
          '<div class="pf-id"><p class="pf-num" aria-label="Jersey number '+a.num+', '+a.pos+'"><b>#'+a.num+'</b><span>'+a.pos+'</span></p><h1 class="display"><span>'+esc(a.first)+'</span> '+esc(a.last)+'</h1>'+
            '<p class="pf-sub">SMU Mustangs · '+s.name+'</p>'+
            '<dl class="pf-vit">'+vit.map(function(m){return '<div><dt>'+m[0]+'</dt><dd>'+esc(m[1])+'</dd></div>'}).join('')+'</dl>'+
            '<div class="ctas"><button type="button" class="btn btn-red btn-sm save-ath" data-save-athlete="'+a.id+'" aria-pressed="false">'+HEART+'<span>Save player</span></button>'+(B?'':'<a class="btn btn-ghost btn-sm" href="#stats">Stats</a>')+'</div></div>'+
          (R?'<a class="pf-card" href="#path"><p class="pf-k">Path to SMU</p><ol class="pf-mini">'+R.path.map(function(p){return '<li><b>'+esc(p[1].split(/[;,(]/)[0].trim())+'</b><small>'+esc(p[2])+'</small></li>'}).join('')+'</ol><p class="pf-cs">'+esc(R.hs)+' · '+esc(R.town)+'</p></a>':'')+
        '</div></div></section>'+
      '<nav class="jump" aria-label="Profile sections"><div class="wrap"><a href="#overview">Overview</a>'+(B?'':'<a href="#stats">Stats</a><a href="#gamelog">Game log</a>')+(R?'<a href="#path">Path to SMU</a>':'')+(a.gallery&&a.gallery.length?'<a href="#photos">Photos</a>':'')+'<a href="#sources">Sources</a></div></nav>'+
      '<div class="wrap ap-body"><div class="ap-grid"><div class="ap-main">'+
        (B?'<section class="panel" id="overview"><div class="panel-h"><h3>Roster facts</h3><span class="meta">Per SMU Athletics</span></div><dl class="pf-pre">'+
          [['Number','#'+a.num],['Position',a.pos],['Class',a.cls],['Height',a.ht],['Weight',a.wt?a.wt+' lbs':''],['Hometown',a.hometown],['High school / previous school',a.prev]].filter(function(m){return m[1]}).map(function(m){return '<div><dt>'+m[0]+'</dt><dd>'+esc(m[1])+'</dd></div>'}).join('')+'</dl></section>':
        '<section class="panel" id="overview"><div class="panel-h"><h3>'+a.season.label+'</h3></div><div class="statline" style="--n:'+a.season.stats.length+'">'+a.season.stats.map(function(x){return '<div><b>'+esc(x[1])+'</b><small>'+x[0]+'</small></div>'}).join('')+'</div></section>'+
        '<section class="panel" id="stats"><div class="panel-h"><h3>Career stats by season</h3><span class="meta">* 2026 in progress</span></div>'+table(a.career,{caption:'Career stats'})+'</section>'+
        '<section class="panel" id="gamelog"><div class="panel-h"><h3>'+a.log.label+'</h3></div>'+table(a.log,{cls:'log',caption:'Game log'})+'</section>')+
        recruitPanel+
        (a.gallery&&a.gallery.length?'<section class="panel" id="photos"><div class="panel-h"><h3>Photos</h3><span class="meta">Photo: SMU Athletics</span></div><div class="gallery g'+a.gallery.length+'">'+a.gallery.map(function(k){return '<figure>'+photo(k,{small:1})+CREDIT+'</figure>'}).join('')+'</div></section>':'')+
      '</div><aside class="ap-side">'+
        (a.blurb?'<section class="panel"><div class="panel-h"><h3>About</h3></div><p>'+esc(a.blurb)+'</p>'+(a.honors&&a.honors.length?'<ul class="honors">'+a.honors.map(function(h){return '<li>'+esc(h)+'</li>'}).join('')+'</ul>':'')+'</section>':'')+
        (a.news&&a.news.length?'<section class="panel" id="news"><div class="panel-h"><h3>Career milestones</h3></div><ul class="news">'+a.news.map(function(n){return '<li>'+esc(n)+'</li>'}).join('')+'</ul></section>':'')+
        (others.length?'<section class="panel"><div class="panel-h"><h3>More profiles</h3></div><div class="mini">'+others.map(function(o){return '<a href="'+athleteUrl(o.id)+'"><b>#'+o.num+'</b><span>'+esc(o.name)+'</span><small>'+o.pos+'</small></a>'}).join('')+'</div></section>':'')+
      '</aside></div>'+
      '<section class="sources pf-src" id="sources"><h3>Sources &amp; credits</h3><p>'+(B?'Roster facts as SMU Athletics lists them on the player\u2019s bio and the team roster, checked '+esc(a.checked)+'. This profile shows no stats, recruiting ratings or rankings.':
        'Bio, measurements and stats checked Oct. 25, 2026; school path from SMU Athletics bios, checked Oct. 26, 2026. SMU+ shows no recruiting ratings or rankings. ESPN lists defensive stats as unofficial.'+(R?' Path to SMU is as stated on his SMU Athletics bio.':''))+(a.notes?' '+esc(a.notes):'')+'</p>'+
        '<ul class="pf-links">'+srcs.map(function(x){return '<li><a href="'+x[1]+'"'+ext+'>'+esc(x[0])+ARROW+'<span class="sr"> (opens in a new tab)</span></a></li>'}).join('')+'</ul>'+
        '<p>SMU+ shows no NIL figures for real athletes. '+(a.photo?'Photos credited SMU Athletics are used for this class concept.':'No photos of this athlete are used; the jersey graphic is a placeholder.')+'</p></section></div>';
  }

  /* ---------- Accounts, checkout (demo), saved athletes, compose, toasts ---------- */
  /* Everything here goes through window.SMU (assets/sb.js): Supabase when configured, this browser otherwise. */
  if(!window.SMU){window.SMU={live:false,user:null,on:function(){return function(){}},ready:Promise.resolve('demo'),tier:function(){return isMember()?'pony':'free'},saved:function(){return []},me:function(){return null},ago:function(){return ''},watch:function(){return function(){}}}}
  var TIER_NAME=MP.TIER_LABELS,TIER_PRICE={mustang:'9.99',pony:'24.99',club:'99'},TIER_NIL={mustang:'4.00',pony:'10.00',club:'39.60'};
  body.insertAdjacentHTML('beforeend','<div class="toasts" id="toasts" role="status" aria-live="polite" aria-atomic="false"></div>');
  function toast(msg,kind){var box=$('#toasts');if(!box)return;var el=document.createElement('div');el.className='toast'+(kind?' '+kind:'');el.textContent=msg;box.appendChild(el);
    requestAnimationFrame(function(){el.classList.add('in')});setTimeout(function(){el.classList.remove('in');setTimeout(function(){el.remove()},300)},kind==='err'?6000:3500)}
  var lastNetToast=0;
  SMU.on('error',function(e){if(e&&e.network&&Date.now()-lastNetToast>4000){lastNetToast=Date.now();toast(e.message,'err')}else if(e&&e.where==='connect')toast('Live features are unavailable right now, so SMU+ is running in demo mode.','err')});
  SMU.on('net',function(up){toast(up?'Back online.':'You\u2019re offline. Changes may not save until you reconnect.',up?'':'err')});

  /* dialog helper: focus trap, Esc, restore focus */
  function dialog(id,html,label){var d=document.createElement('div');d.className='dlg';d.id=id;d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-labelledby',id+'-h');
    d.innerHTML='<div class="dlg-sheet"><button type="button" class="reader-x dlg-x" aria-label="Close">\u00d7</button>'+html+'</div>';
    var back=document.activeElement;body.appendChild(d);document.documentElement.classList.add('noscroll');
    function close(){d.remove();if(!$('.dlg')&&$('#reader').hidden&&$('#paywall').hidden&&$('#search').hidden)document.documentElement.classList.remove('noscroll');if(back&&back.focus&&document.contains(back))back.focus();document.removeEventListener('keydown',key,true)}
    function key(e){if(!document.contains(d))return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close()}
      if(e.key==='Tab'){var f=$$('a[href],button:not([disabled]),input:not([type=hidden]),select,textarea',d).filter(function(x){return x.offsetParent!==null});if(!f.length)return;
        var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}}
    document.addEventListener('keydown',key,true);d.addEventListener('click',function(e){if(e.target===d||e.target.closest('.dlg-x'))close()});
    setTimeout(function(){var f=$('input,select,textarea,button:not(.dlg-x)',d);(f||d).focus()},30);d.close=close;return d}
  function modeNote(){return SMU.live?'':'<p class="dlg-mode"><b>Demo mode.</b> Accounts are saved only in this browser, no password is stored and no email is sent. Connect the database (see SETUP.md) to make accounts real.</p>'}

  /* ---------- Auth ---------- */
  var OAUTH_NAME={azure:'Microsoft',google:'Google',apple:'Apple'};
  function caps(){return SMU.authCaps?SMU.authCaps():{signup:true,email:true,oauth:[]}}
  function oauthBtns(cls,student){var c=caps();if(!c.oauth.length)return '';
    return '<div class="auth-oauth '+(cls||'')+'">'+c.oauth.map(function(p){return '<button type="button" class="btn btn-outline auth-oa" data-oauth="'+p+'">Continue with '+OAUTH_NAME[p]+(student&&p==='azure'?' (SMU email)':'')+'</button>'}).join('')+'</div>'}
  /* mode 'in' = sign in, 'up' = create a free Fan account. No email-link or password-reset options: Supabase can't deliver auth email yet. */
  function authForm(mode,ctx){var c=caps();mode=mode==='up'&&c.signup?'up':'in';var demo=!SMU.live;
    return '<div class="auth" data-mode="'+mode+'">'+(ctx?'<p class="auth-ctx">'+esc(ctx)+'</p>':'')+
      '<div class="auth-tabs" role="tablist"><button type="button" role="tab" data-auth-tab="in" aria-selected="'+(mode==='in')+'">Sign in</button>'+(c.signup?'<button type="button" role="tab" data-auth-tab="up" aria-selected="'+(mode==='up')+'">Create a free account</button>':'')+'</div>'+
      '<p class="auth-up-note">A free Fan account lets you read everything and post on the boards. SMU students can use the <button type="button" class="linkish" data-student>free Student plan</button> instead.</p>'+
      oauthBtns()+
      '<form class="auth-f" novalidate>'+
        '<div class="fld f-name"><label for="auName">Display name</label><input id="auName" name="name" autocomplete="nickname" maxlength="40" placeholder="How you appear on the boards"></div>'+
        '<div class="fld"><label for="auEmail">Email</label><input id="auEmail" name="email" type="email" autocomplete="email" required placeholder="you@example.com"></div>'+
        '<div class="fld f-pw"><label for="auPw">Password'+(demo?' <small>(not stored in demo mode)</small>':'')+'</label><input id="auPw" name="password" type="password" autocomplete="current-password" minlength="8" placeholder="At least 8 characters"'+(demo?'':' required')+'></div>'+
        '<p class="auth-m" aria-live="polite"></p>'+
        '<button class="btn btn-red auth-go" type="submit">Sign in</button>'+
      '</form>'+(c.signup?'':'<p class="auth-paused">New accounts are paused for a moment while we finish setting up sign-up. If you already have an account, sign in above.</p>')+modeNote()+'</div>'}
  function syncAuthForm(root){var a=$('.auth',root),m=a.dataset.mode,c=caps(),up=m==='up';$$('[data-auth-tab]',a).forEach(function(b){b.setAttribute('aria-selected',String(b.dataset.authTab===m))});
    $('.f-name',a).hidden=!up;$('.auth-up-note',a).hidden=!up||!stOn();var pw=$('#auPw',a);pw.setAttribute('autocomplete',up?'new-password':'current-password');
    /* Create account: the email form shows only when email sign-up needs no delivered email; otherwise just the OAuth buttons */
    $('.auth-f',a).hidden=up&&!c.email;
    $('.auth-go',a).textContent=up?'Create free account':'Sign in';$('.auth-m',a).textContent=''}
  function wireAuth(root,done){syncAuthForm(root);
    root.addEventListener('click',function(e){var t=e.target.closest('[data-auth-tab]');if(t){$('.auth',root).dataset.mode=t.dataset.authTab;syncAuthForm(root);var ae=$('#auEmail',root);if(ae&&!$('.auth-f',root).hidden)ae.focus()}
      var o=e.target.closest('[data-oauth]');if(o&&!o.closest('#studentDlg')){o.disabled=true;SMU.oauth(o.dataset.oauth).catch(function(err){o.disabled=false;$('.auth-m',root).textContent=friendlyAuth(err)})}});
    $('.auth-f',root).addEventListener('submit',function(e){e.preventDefault();var a=$('.auth',root),mode=a.dataset.mode,m=$('.auth-m',root),btn=$('.auth-go',root);
      var em=$('#auEmail',root).value.trim(),pw=$('#auPw',root).value,nm=$('#auName',root).value.trim();
      if(!EMAIL_RE.test(em)){m.textContent='Enter a full email address.';$('#auEmail',root).focus();return}
      if(SMU.live&&pw.length<8){m.textContent='Passwords are at least 8 characters.';$('#auPw',root).focus();return}
      btn.disabled=true;m.textContent='One moment\u2026';
      var p=mode==='up'?SMU.signUp({email:em,password:pw,name:nm}):SMU.signIn({email:em,password:pw});
      p.then(function(r){btn.disabled=false;
        if(mode==='up'&&r&&r.confirm){m.innerHTML='<b>Almost there.</b> Your account needs a confirmation email, which we can\u2019t send yet. Try again soon.';return}
        toast(mode==='up'?'Welcome to SMU+, '+(SMU.user&&SMU.user.name||'Mustang')+'.':'Signed in.');done&&done()},
       function(err){btn.disabled=false;m.textContent=friendlyAuth(err)})})}
  function friendlyAuth(e){var t=(e&&e.message)||'';if(/Invalid login/i.test(t))return 'That email and password don\u2019t match. Try again.';
    if(/already registered|already exists/i.test(t))return 'That email already has an account. Sign in instead.';if(/rate limit|security purposes/i.test(t))return 'Too many tries. Wait a minute and try again.';
    if(/not confirmed/i.test(t))return 'This account was never confirmed. Create a new free account instead.';return t||'Something went wrong. Try again.'}
  function openAuth(mode,ctx,after){var d=dialog('authDlg','<h3 id="authDlg-h" class="dlg-h">'+(mode==='up'?'Create your free SMU+ account':'Sign in to SMU+')+'</h3>'+authForm(mode,ctx));wireAuth(d,function(){d.close();after&&after()})}
  document.addEventListener('click',function(e){var a=e.target.closest('[data-auth]');if(!a)return;e.preventDefault();var jd=$('#joinDlg'),jx=jd&&$('.dlg-x',jd);if(jx)jx.click();
    if(SMU.user){location.href=ROOT+'account/';return}if(PAGE==='account'&&$('#acctMain .auth')){var t=$('#acctMain [data-auth-tab="'+(a.dataset.auth||'in')+'"]');if(t){t.click();t.scrollIntoView({block:'center'});return}}openAuth(a.dataset.auth||'in',a.dataset.authCtx)});
  function requireUser(ctx,then){if(SMU.user){then();return}openAuth('in',ctx,then)}

  /* header + menu account state */
  function initials(n){return String(n||'?').replace(/[^A-Za-z ]/g,'').split(/\s+/).filter(Boolean).map(function(w){return w[0]}).slice(0,2).join('').toUpperCase()||'?'}
  function syncAcct(){var u=SMU.user,b=$('#acctBtn');if(b){b.classList.toggle('in',!!u);$('.acct-l',b).textContent=u?'Your account':'Sign in';
      var ph=u&&u.avatar&&SMU.avatarsOn()&&SMU.avatarOK(u.avatar)?u.avatar:'';
      $('.acct-av',b).innerHTML=ph?avImg(ph,1):SVG.user;$('.acct-av',b).classList.toggle('has-ph',!!ph);
      var mav=$('.mm-acct .acct-av');if(mav){mav.innerHTML=ph?avImg(ph,1):SVG.user;mav.classList.toggle('has-ph',!!ph)}b.setAttribute('aria-label',u?'Your account ('+(u.name||u.email)+')':'Sign in or create an account')}
    var ml=$('.mm-acct-l'),ms=$('.mm-acct-s');if(ml){ml.textContent=u?(u.name||'Your account'):'Sign in or create an account';ms.textContent=u?TIER_NAME[SMU.tier()]+' member \u00b7 '+(SMU.live?'synced':'demo account'):'Save athletes, post on the boards, sync what you watch'}
    /* Join CTA: signed out = Join; signed in, free = smaller Upgrade link; signed in member = hidden (header + phone menu) */
    var st=!u?'out':(paidT(SMU.tier())?'member':'free');
    $$('.hdr-join,.mm-join').forEach(function(el){var mmj=el.classList.contains('mm-join');el.hidden=st==='member'||(st==='free'&&!SHOW_PAID_PLANS);el.classList.toggle('is-upgrade',st==='free');
      el.classList.toggle('btn-red',st!=='free');el.textContent=st==='free'?(mmj?'Upgrade your membership':'Upgrade'):(mmj?'Join SMU+':'Join');
      el.setAttribute('href',st==='free'?ROOT+'#membership':ROOT+'#waitlist')});
    syncAdfree();if(window.fitNav)window.fitNav();
    $$('[data-save-athlete]').forEach(syncSaveBtn)}
  /* Ad-free: one preference per account, kept in this browser (mp_adfree, by account id) and, on the live database, in the
     account's own auth metadata so it follows the account to other devices. Only signed-in accounts get it. */
  function afKey(){return SMU.user?'mp_adfree:'+(SMU.user.id||SMU.user.email):null}
  /* Paid gate: while SHOW_PAID_PLANS is false, any signed-in account can turn Ad-free on. Once paid plans are back, Ad-free comes with a
     paid plan only: a free account that flips the switch gets the plans pop-up instead, the switch stays off and the ads stay, and the
     choice is kept so ads go away as soon as the account has a paid plan (SMU.on('tier') re-syncs). */
  function adfreeAllowed(){return !SHOW_PAID_PLANS||!!(SMU.user&&paidT(SMU.tier()))}
  function adfreeUpsell(){var k=afKey();if(k)store(k,'1');syncAdfree();
    openJoin(null,'Ad-free comes with a paid plan. Pick one below and ads go away as soon as your plan starts.')}
  function adfreeOn(){var k=afKey();if(!k||!adfreeAllowed())return false;var v=store(k);if(v==null&&SMU.user.adfree!=null)return !!SMU.user.adfree;return v==='1'}
  function syncAdfree(){var on=adfreeOn();document.documentElement.classList.toggle('adfree',on);
    $$('[data-adfree]').forEach(function(b){b.setAttribute('aria-checked',on?'true':'false');
      b.setAttribute('aria-label',SMU.user?'Ad-free':'Ad-free, sign in to turn it on')})}
  function setAdfree(on){var k=afKey();if(!k)return;store(k,on?'1':'0');SMU.user.adfree=on;syncAdfree();toast(on?'Ad-free is on.':'Ad-free is off.');
    if(SMU.live&&SMU.client)SMU.client.auth.updateUser({data:{adfree:on}}).then(function(){},function(){})}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-adfree]');if(!b)return;e.preventDefault();
    if(!SMU.user){openAuth('in','Sign in to turn on Ad-free.',function(){if(adfreeAllowed())setAdfree(true);else adfreeUpsell()});return}
    if(!adfreeAllowed()){adfreeUpsell();return}
    setAdfree(!adfreeOn())});
  SMU.on('auth',function(u){syncAcct();if(u&&SMU.live)pullHistory()});SMU.on('avatar',syncAcct);SMU.on('tier',function(t){store('mp_member',paidT(t)?'1':'0');syncMember();document.dispatchEvent(new Event('mp:member'));syncAcct()});
  SMU.on('saved',function(){$$('[data-save-athlete]').forEach(syncSaveBtn)});
  function pullHistory(){SMU.pullProgress().then(function(rows){if(!rows||!rows.length)return;var local=hist(),by={};local.concat(rows).forEach(function(x){var o=by[x.id];if(!o||x.p>o.p||x.t>o.t)by[x.id]={id:x.id,p:Math.max(x.p,o?o.p:0),t:Math.max(x.t||0,o?o.t:0)}});
    var all=Object.keys(by).map(function(k){return by[k]}).sort(function(a,b){return b.t-a.t}).slice(0,24);store('mp_history',JSON.stringify(all));document.dispatchEvent(new Event('mp:history'))}).catch(function(){})}

  /* ---------- Saved athletes ---------- */
  function syncSaveBtn(b){var on=SMU.saved().indexOf(b.dataset.saveAthlete)>=0;b.setAttribute('aria-pressed',String(on));b.classList.toggle('on',on);var l=$('span',b);if(l)l.textContent=on?'Saved':'Save player'}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-save-athlete]');if(!b)return;var id=b.dataset.saveAthlete,a=(MP.ATHLETES||[]).filter(function(x){return x.id===id})[0];
    requireUser('Sign in to save '+(a?a.name:'players')+' to your account.',function(){b.disabled=true;var was=SMU.saved().indexOf(id)>=0;
      SMU.toggleSave(id).then(function(){toast(was?'Removed from saved players.':'Saved. Find '+(a?a.first:'them')+' on your account page.')},function(err){toast(err.message,'err')}).then(function(){b.disabled=false;syncSaveBtn(b)})})});

  /* ---------- Plans: clearly labeled DEMO checkout. No card, no charge. ---------- */
  /* Paid plans are coming soon (no paywall): nothing may switch anyone to a paid tier. Every 'choose a plan' path opens the
     Join pop-up's waitlist step with that plan pre-selected as tier_interest instead. Flip to true only when paid plans launch. */
  function checkout(tier){if(!PAID_OPEN){openJoin(JOIN_WL[tier]?tier:null);return}var cur=SMU.tier();
    var d=dialog('payDlg','<p class="eyebrow">'+LOCK+'Demo checkout</p><h3 id="payDlg-h" class="dlg-h">'+TIER_NAME[tier]+' \u00b7 $'+TIER_PRICE[tier]+'/mo</h3>'+
      conceptNotice()+'<p class="pay-what">Confirming only switches this demo account to '+TIER_NAME[tier]+'. Nothing is charged.</p>'+
      (cur===tier?'<p class="auth-m">You\u2019re already on this plan.</p>':'')+
      '<div class="dlg-act"><button type="button" class="btn btn-red" id="payGo"'+(cur===tier?' disabled':'')+'>Confirm demo membership</button><button type="button" class="btn btn-outline" id="payNo">Not now</button></div>'+modeNote());
    $('#payNo',d).addEventListener('click',d.close);
    $('#payGo',d).addEventListener('click',function(){var b=this;b.disabled=true;SMU.setTier(tier).then(function(){d.close();toast('You\u2019re a '+TIER_NAME[tier]+' member (demo).')},function(err){b.disabled=false;toast(err.message,'err')})})}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-plan]');if(!b)return;e.preventDefault();var t=b.dataset.plan;if(!PAID_OPEN){openJoin(JOIN_WL[t]?t:null);return}requireUser('Create an account or sign in to choose the '+TIER_NAME[t]+' plan.',function(){checkout(t)})});
  /* ---------- Join pop-up (On3-style): every Join / See plans / Join SMU+ CTA opens this instead of scrolling to #waitlist.
     Same three tiers, prices and perks as the home #membership cards. Each card's button opens the existing free waitlist form
     inline (same SMU.waitlist insert, utm attribution and tier_interest column). No payment. ---------- */
  /* Tier copy has ONE source: the home page #membership cards (index.html). The modal reads names, prices and perks from that
     markup (any 'Coming soon' text is dropped; no pills) (this page's DOM on home, a fetched copy elsewhere), so perk edits there show up here too. */
  var JOIN_ORDER=['mustang','pony','club'],JOIN_WL={mustang:'mustang',pony:'all_access',club:'red_blue'},joinTiers=null;
  function readTiers(doc){var out=[];$$('#membership .tier',doc).forEach(function(c){var b=$('[data-join],[data-plan]',c),k=b&&(b.getAttribute('data-join')||b.getAttribute('data-plan'));if(!JOIN_WL[k])return;
      var pr=$('.price b',c),h=$('h3',c),f=$('.for',c);
      out.push({k:k,name:h?h.textContent.trim():TIER_NAME[k],for:f?f.textContent.trim():'',p:pr?pr.textContent.trim():'$'+TIER_PRICE[k],per:(($('.price span',c)||{}).textContent||'/mo').trim(),
        pop:c.classList.contains('pop')?(($('.tag',c)||{}).textContent||'Most Popular').trim():'',
        perks:$$('li',c).map(function(li){var sp=$('.soon',li),soon=!!sp||/coming soon/i.test(li.textContent),t=li.textContent;if(sp)t=t.replace(sp.textContent,'');else t=t.replace(/\s*\(?coming soon\)?\s*$/i,'');
          return {t:t.replace(/\s+/g,' ').trim(),inc:li.classList.contains('inc'),soon:soon,sl:sp?sp.textContent.trim():'Coming soon'}}).filter(function(x){return x.t})})});
    out.sort(function(x,y){return JOIN_ORDER.indexOf(x.k)-JOIN_ORDER.indexOf(y.k)});return out.length===3?out:null}
  function loadTiers(){if(joinTiers)return Promise.resolve(joinTiers);var here=$('#membership .tier')?readTiers(document):null;if(here)return Promise.resolve(joinTiers=here);
    return fetch((ROOT||'./')+'index.html',{credentials:'same-origin'}).then(function(r){return r.ok?r.text():''}).then(function(t){joinTiers=t?readTiers(new DOMParser().parseFromString(t,'text/html')):null;return joinTiers})
      .catch(function(){return null}).then(function(t){return t||JOIN_ORDER.map(function(k){return {k:k,name:TIER_NAME[k],for:'',p:'$'+TIER_PRICE[k],per:'/mo',pop:k==='pony'?'Most Popular':'',perks:[]}})})}
  var JCHK='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="rgba(53,76,161,.12)"/><path d="m7 12.5 3 3 7-7" stroke="#354CA1" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function joinCard(t){return '<article class="jm-card soon" aria-labelledby="jm-'+t.k+'"><span class="jm-pill jm-soon">'+LOCK+'Coming soon</span>'+
    '<h4 id="jm-'+t.k+'">'+esc(t.name)+'</h4>'+(t.for?'<p class="jm-for">'+esc(t.for)+'</p>':'')+
    '<p class="jm-price"><b>'+esc(t.p)+'</b><span>'+esc(t.per)+'</span></p><p class="jm-fine">Sample price. Nothing is charged.</p>'+
    '<button type="button" class="btn btn-wl jm-go" data-join-pick="'+t.k+'">Join the waitlist<span class="sr"> for '+esc(t.name)+'</span></button>'+
    (t.perks.length?'<ul>'+t.perks.map(function(x){return '<li class="'+(x.inc?'inc':'')+'">'+JCHK+'<span>'+esc(x.t)+'</span></li>'}).join('')+'</ul>':'')+'</article>'}
  var joinDlg=null;
  function openJoin(tier,note){if(joinDlg&&document.contains(joinDlg)){if(tier)joinStep(tier);return}
    if(joinDlg===false)return;joinDlg=false;loadTiers().then(function(T){joinDlg=null;buildJoin(T,tier,note)})}
  function buildJoin(T,tier,note){
    var logo=BRAND_LOGO?'<picture><source type="image/webp" srcset="'+ROOT+BRAND_LOGO.replace(/\.png$/,'.webp')+'"><img src="'+ROOT+BRAND_LOGO+'" alt="SMU+" width="360" height="128" decoding="async"></picture>':'<span class="jm-wm">SMU+</span>';
    var d=joinDlg=dialog('joinDlg','<div class="jm-hd"><div class="jm-logo">'+logo+'</div>'+(SHOW_PAID_PLANS?'<p class="jm-eb">Membership</p>':'')+'<h3 id="joinDlg-h">Pick your seat.</h3>'+(note?'<p class="jm-lede jm-note">'+esc(note)+'</p>':'')+
      '<p class="jm-lede">Join free today with a Fan account, or a Student plan if you have an @smu.edu email.'+(SHOW_PAID_PLANS?' Paid plans are coming soon, and you can join the free waitlist for the one you want.':'')+' There is nothing to buy.</p></div>'+
      '<div class="jm-body"><div class="jm-plans">'+freeBands('jm')+(SHOW_PAID_PLANS?'<div class="jm-tiers">'+T.map(joinCard).join('')+'</div>':'')+'</div>'+
      '<div class="jm-wl" hidden><button type="button" class="jm-back" data-join-back><span aria-hidden="true">\u2190</span> All plans</button>'+
        '<p class="jm-pick">Waitlist for <b class="jm-pick-n"></b> <span class="jm-pick-p"></span></p>'+waitlistHTML('wlJoin')+'</div>'+
      conceptNotice('jm-cn')+'</div>');
    d.classList.add('dlg-join');syncWaitlist();
    var x=$('.dlg-x',d);if(x){x.setAttribute('aria-label','Close');d.querySelector('.dlg-sheet').insertBefore(x,d.querySelector('.dlg-sheet').firstChild)}
    var obs=new MutationObserver(function(){if(!document.contains(d)){obs.disconnect();joinDlg=null;if(/^#(join|waitlist)$/.test(location.hash))try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}}});obs.observe(body,{childList:true});
    if(tier)setTimeout(function(){joinStep(tier)},40)}
  function joinStep(tier){var d=joinDlg;if(!d)return;var plans=$('.jm-plans',d),wl=$('.jm-wl',d),sheet=$('.jm-body',d);
    if(!tier){wl.hidden=true;plans.hidden=false;sheet.scrollTop=0;var b=$('[data-join-pick="'+(d.dataset.tier||'pony')+'"]',d);if(b)b.focus();return}
    var t=(joinTiers||[]).filter(function(x){return x.k===tier})[0]||{p:'$'+TIER_PRICE[tier],per:'/mo'};if(!JOIN_WL[tier]||!SHOW_PAID_PLANS)return;d.dataset.tier=tier;
    $('.jm-pick-n',d).textContent=TIER_NAME[tier];$('.jm-pick-p',d).textContent=t.p+t.per+', sample price';
    var sel=$('select[name=tier]',wl);if(sel)sel.value=JOIN_WL[tier];
    plans.hidden=true;wl.hidden=false;sheet.scrollTop=0;
    var f=$('.wl',wl),target=f&&f.classList.contains('done')?$('.wl-ok',wl):$('input[type=email]',wl);if(target)target.focus()}
  var JOIN_SEL='.hdr-join,.mm-join,[data-join],a[href$="#waitlist"],a[href$="#join"],a.btn[href$="#membership"]';
  document.addEventListener('click',function(e){if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey)return;
    var p=e.target.closest('[data-join-pick]');if(p){e.preventDefault();joinStep(p.dataset.joinPick);return}
    if(e.target.closest('[data-join-back]')){e.preventDefault();joinStep(null);return}
    var a=e.target.closest(JOIN_SEL);if(!a||a.closest('#joinDlg'))return;e.preventDefault();
    if(!pw.hidden)closePaywall();openJoin(a.dataset.join||null)});
  /* Re-sync after a modal signup so the home #waitlist card shows the same done state. */
  document.addEventListener('submit',function(e){if(e.target&&e.target.id==='wlJoin')setTimeout(syncWaitlist,0)});
  function joinFromHash(){if(/^#(join|waitlist)$/.test(location.hash))openJoin()}
  window.addEventListener('hashchange',joinFromHash);setTimeout(joinFromHash,0);

  /* ---------- Free Student plan (SMU email only) ----------
     Live: email-link sign-up on an @smu.edu address; the plan starts only after the email is confirmed and
     claim_student_membership() (supabase/RUN_ME_16_students.sql) accepts it. Hidden on the live site while MP.FEATURES.students is false. */
  /* Free plans: a Fan account for anyone, and the Student plan for @smu.edu emails. Both read everything and post on the boards. */
  function fanBand(where){return '<div class="st-band fan-band st-'+where+'"><div class="st-b"><h4>Create your free account</h4></div>'+
      '<button type="button" class="btn btn-navy st-go" data-auth="up">Join free as a fan</button></div>'}
  function studentBand(where){if(!stOn())return '';
    return '<div class="st-band st-'+where+'"><div class="st-b"><h4>SMU student? Join free.</h4>'+
      '<p>Use your @smu.edu email for a free Student plan. No card, nothing to buy.</p></div>'+
      '<button type="button" class="btn btn-red st-go" data-student>Join free as a student</button></div>'}
  function freeBands(where){return '<div class="free-bands free-'+where+'">'+studentBand(where)+fanBand(where)+'</div>'}
  function yearOpts(sel){return '<option value="">Choose</option>'+SMU.studentYears().map(function(y){return '<option value="'+y+'"'+(+sel===y?' selected':'')+'>Class of '+y+'</option>'}).join('')}
  function openStudent(){if(!stOn())return;if(/^#student$/.test(location.hash))try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}
    var open=$('#studentDlg');if(open){var fi=$('input',open);if(fi)fi.focus();return}
    if(SMU.user){if(PAGE==='account'){var c=$('#acctStudent')||$('#acctPlan');if(c)c.scrollIntoView({block:'start'})}else location.href=ROOT+'account/#student';return}
    ['#joinDlg','#authDlg'].forEach(function(id){var jd=$(id),x=jd&&$('.dlg-x',jd);if(x)x.click()});
    var c=caps(),useEmail=!SMU.live||c.email,oa=SMU.live&&c.oauth.indexOf('azure')>=0;
    var d=dialog('studentDlg','<h3 id="studentDlg-h" class="dlg-h">Join free as an SMU student</h3>'+
      '<p class="st-lede">'+(useEmail||oa?'Use your SMU email, ending in @smu.edu. Your free Student plan starts right away.':'Student sign-up is paused for a moment while we finish setting up accounts.')+'</p>'+
      (useEmail||oa?'<form class="auth-f st-f" novalidate>'+
        (useEmail?'<div class="fld"><label for="stEmail">SMU email</label><input id="stEmail" name="email" type="email" autocomplete="email" required placeholder="you@smu.edu"></div>'+
        '<div class="fld-row"><div class="fld"><label for="stName">Name</label><input id="stName" name="name" autocomplete="name" maxlength="40" required placeholder="How you appear on the boards"></div>':'<div class="fld-row">')+
        '<div class="fld"><label for="stYear">Class year</label><select id="stYear" name="year" required>'+yearOpts()+'</select></div></div>'+
        (useEmail?'<div class="fld"><label for="stPw">Password'+(SMU.live?'':' <small>(not stored in demo mode)</small>')+'</label><input id="stPw" name="password" type="password" autocomplete="new-password" minlength="8" required placeholder="At least 8 characters"></div>':'')+
        '<label class="wl-consent st-consent" for="stOk"><input id="stOk" type="checkbox" name="consent" required><span class="wl-box" aria-hidden="true"></span><span>I agree that SMU+ can store these details for this student project, as described in the <a href="'+ROOT+'privacy/">privacy notice</a>.</span></label>'+
        '<p class="auth-m" aria-live="polite"></p>'+(useEmail?'<button class="btn btn-red st-submit" type="submit">Join free</button>':'')+
        (oa?'<button class="btn '+(useEmail?'btn-outline':'btn-red')+' st-submit st-oa" type="button" data-oauth="azure">Continue with Microsoft (SMU email)</button>':'')+
      '</form>':'')+conceptNotice('st-cn')+modeNote());
    var f=$('form',d),m=f&&$('.auth-m',d);if(!f)return;
    function bad(t,el){m.textContent=t;el.setAttribute('aria-invalid','true');el.focus()}
    function check(full){$$('[aria-invalid]',d).forEach(function(x){x.removeAttribute('aria-invalid')});
      if(full){var em=$('#stEmail',d).value.trim();if(!SMU.isSmuEmail(em))return bad('Use your SMU email, ending in @smu.edu.',$('#stEmail',d)),false;
        if(!$('#stName',d).value.trim())return bad('Add your name.',$('#stName',d)),false}
      if(!$('#stYear',d).value)return bad('Pick your class year.',$('#stYear',d)),false;
      if(full&&SMU.live&&$('#stPw',d).value.length<8)return bad('Passwords are at least 8 characters.',$('#stPw',d)),false;
      if(!$('#stOk',d).checked)return bad('Please tick the box to agree to the privacy notice.',$('#stOk',d)),false;return true}
    var ob=$('.st-oa',d);if(ob)ob.addEventListener('click',function(){if(!check(false))return;ob.disabled=true;m.textContent='Opening Microsoft sign-in\u2026';
      SMU.studentJoin({provider:'azure',year:$('#stYear',d).value}).catch(function(err){ob.disabled=false;m.textContent=friendlyAuth(err)})});
    f.addEventListener('submit',function(e){e.preventDefault();if(!useEmail||!check(true))return;
      var o={email:$('#stEmail',d).value.trim(),name:$('#stName',d).value.trim(),year:$('#stYear',d).value,password:$('#stPw',d).value};
      var b=$('.st-submit',d);b.disabled=true;m.textContent='One moment\u2026';
      /* Also join the waitlist as a student (email, name, affiliation and tier_interest only); the account is what counts */
      SMU.waitlist({email:o.email,name:o.name,affiliation:'student',tier_interest:'student',consent:true}).catch(function(){}).then(function(){syncWaitlist();return SMU.studentJoin(o)}).then(function(r){b.disabled=false;
        if(r&&r.confirm){m.textContent='Your account needs a confirmation email, which we can\u2019t send yet. Try again soon.';return}
        d.close();toast('You\u2019re in. Free Student plan, Class of '+o.year+'.');if(PAGE!=='account')location.href=ROOT+'account/#student'},
        function(err){b.disabled=false;m.textContent=friendlyAuth(err)||'Couldn\u2019t sign you up. Try again.'})});
    var first=$('input,select',f);if(first)first.focus()}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-student]');if(!b)return;e.preventDefault();openStudent()});
  /* home#student (e.g. a class QR code) opens the student form */
  if(PAGE!=='account')(SMU.ready||Promise.resolve()).then(function(){if(location.hash==='#student'&&stOn())openStudent()});
  function studentStatus(tier){var st=stOn()&&SMU.student&&SMU.student();if(!st)return '';
    return '<p class="st-status">'+(tier==='student'?'':'Verified SMU student. ')+'Class of '+esc(st.year||'\u2014')+(st.at?' \u00b7 verified '+esc(new Date(st.at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})):'')+'</p>'+
      '<p class="acct-meta">Checked with your @smu.edu email.</p>'}
  function studentCard(u,tier){if(!stOn()||tier==='student'||(SMU.student&&SMU.student()))return '';var msg=SMU.studentMsg?SMU.studentMsg():'';
    if(!SMU.isSmuEmail(u.email))return '<div class="acct-card st-card" id="acctStudent"><h2 class="acct-h">SMU student?</h2><p>The free Student plan needs an @smu.edu email. You\u2019re signed in as '+esc(u.email)+'.</p>'+
      '<button type="button" class="btn btn-outline btn-sm" id="stSwitch">Sign out and join with my SMU email</button></div>';
    return '<div class="acct-card st-card" id="acctStudent"><h2 class="acct-h">SMU student? Join free</h2><p>Your @smu.edu email qualifies this account for the free Student plan. Pick your class year to start it.</p>'+
      '<form class="auth-f" id="stClaim" novalidate><div class="fld"><label for="stYearA">Class year</label><select id="stYearA" required>'+yearOpts()+'</select></div>'+
      '<p class="auth-m" aria-live="polite">'+esc(msg)+'</p><button class="btn btn-red btn-sm" type="submit">Start my Student plan</button></form></div>'}
  function wireStudentCard(root,render){var sw=$('#stSwitch',root);if(sw)sw.addEventListener('click',function(){SMU.signOut().then(function(){render();openStudent()})});
    var f=$('#stClaim',root);if(!f)return;var m=$('.auth-m',f);
    f.addEventListener('submit',function(e){e.preventDefault();var yr=$('#stYearA',f).value;
      if(!yr){m.textContent='Pick your class year.';$('#stYearA',f).focus();return}
      var b=$('button[type=submit]',f);b.disabled=true;m.textContent='One moment\u2026';
      SMU.claimStudent(+yr).then(function(){toast('You\u2019re on the free Student plan.')},function(err){b.disabled=false;m.textContent=err.message})})}

  /* ---------- New thread ---------- */
  function compose(sport,forum){var pf=forum&&forumBy(forum),pick=pf?forum:'hilltop';
    var d=dialog('composeDlg','<h3 id="composeDlg-h" class="dlg-h">Start a thread</h3><form class="compose" novalidate>'+
      '<div class="fld-row"><div class="fld"><label for="cpForum">Board</label><select id="cpForum">'+MP.FORUMS.map(function(f){return '<option value="'+f.id+'"'+(f.id===pick?' selected':'')+'>'+esc(f.name)+'</option>'}).join('')+'</select></div>'+
      '<div class="fld"><label for="cpSport">Sport (optional)</label><select id="cpSport"><option value="">None</option>'+MP.SPORTS.map(function(s){return '<option value="'+s.slug+'"'+(s.slug===sport?' selected':'')+'>'+esc(s.name)+'</option>'}).join('')+'</select></div></div>'+
      '<div class="fld"><label for="cpTitle">Title</label><input id="cpTitle" maxlength="140" required placeholder="What do you want to talk about?"></div>'+
      '<div class="fld"><label for="cpBody">First post</label><textarea id="cpBody" rows="5" maxlength="5000" required></textarea></div>'+
      '<p class="cp-rules">Keep it civil and read the <a href="'+ROOT+'rules/">community rules</a> before you post. Mods may remove posts that break them.</p>'+
      '<p class="auth-m" aria-live="polite"></p><div class="dlg-act"><button class="btn btn-red" type="submit">Post thread</button></div></form>'+(SMU.live?'':'<p class="dlg-mode"><b>Demo mode.</b> Your thread is saved in this browser only.</p>'));
    $('form',d).addEventListener('submit',function(e){e.preventDefault();var ti=$('#cpTitle',d).value.trim(),bo=$('#cpBody',d).value.trim(),m=$('.auth-m',d);
      if(ti.length<3){m.textContent='Give your thread a title (3+ characters).';$('#cpTitle',d).focus();return}if(bo.length<2){m.textContent='Write a first post.';$('#cpBody',d).focus();return}
      var b=$('button[type=submit]',d);b.disabled=true;m.textContent='Posting\u2026';
      SMU.createThread({f:$('#cpForum',d).value,sport:$('#cpSport',d).value,title:ti,body:bo}).then(function(t){d.close();toast('Thread posted.');location.href=threadUrl(t.id)},function(err){b.disabled=false;m.textContent=err.message})})}
  /* ---------- Report a post: reason picker, then a confirmation. Demo (and live until REPORTS is on in sb.js) keeps it in this browser. ---------- */
  var REPORT_WHY={harassment:['Harassment','Goes after an athlete, a coach, their family or another fan'],recruit_minor:['Recruit or minor info','Rumors or personal details about a recruit or anyone under 18'],
    doxxing:['Doxxing','Shares an address, phone number, schedule or other private info'],spam:['Spam','Ads, scams, links or the same post over and over'],other:['Something else','Tell the mods below']};
  function reportDone(d,dup,where,n){var sh=$('.dlg-sheet',d);
    sh.innerHTML='<button type="button" class="reader-x dlg-x" aria-label="Close">\u00d7</button><div class="rp-done" role="status"><span class="rp-ic" aria-hidden="true">\u2713</span>'+
      '<h3 id="reportDlg-h" class="dlg-h">'+(dup?'You already reported this post':'Thanks, we got it')+'</h3>'+
      '<p>'+(dup?'Your report on post #'+n+' is already with the moderators. You only need to send it once.':'Your report on post #'+n+' is with the moderators. They\u2019ll check it against the <a href="'+ROOT+'rules/">community rules</a> and may remove the post. The poster isn\u2019t told who reported it.')+'</p>'+
      (where==='browser'?'<p class="dlg-mode"><b>'+(SMU.live?'Preview.':'Demo mode.')+'</b> This report is saved in this browser only.</p>':'')+
      '<div class="dlg-act"><button type="button" class="btn btn-navy" data-rp-close>Done</button></div></div>';
    $('[data-rp-close]',d).focus()}
  function reportPost(t,i,btn){var p=t.posts[i],u=MP.USERS[p[0]],n=i+1;
    if(SMU.reported(t.id,i)){var dd=dialog('reportDlg','<h3 id="reportDlg-h" class="dlg-h">Report</h3>');reportDone(dd,true,'browser',n);wire(dd);return}
    var d=dialog('reportDlg','<h3 id="reportDlg-h" class="dlg-h">Report this post</h3><p class="rp-sub">What\u2019s wrong with <b>'+esc(u?u.n:'this member')+'</b>\u2019s post (#'+n+')? Pick the closest reason.</p>'+
      '<form class="rp-form" novalidate><fieldset class="rp-set"><legend class="sr">Reason for reporting</legend>'+SMU.REPORT_REASONS.map(function(k){return '<label class="rp-opt"><input type="radio" name="rpReason" value="'+k+'"><span><b>'+REPORT_WHY[k][0]+'</b><small>'+REPORT_WHY[k][1]+'</small></span></label>'}).join('')+'</fieldset>'+
      '<div class="fld"><label for="rpNote">Anything the mods should know? (optional)</label><textarea id="rpNote" rows="2" maxlength="500"></textarea></div>'+
      '<p class="auth-m" aria-live="polite"></p><div class="dlg-act"><button type="button" class="btn btn-outline" data-rp-close>Cancel</button><button class="btn btn-red" type="submit">Send report</button></div></form>'+
      '<p class="dlg-mode">Only moderators see reports. <a href="'+ROOT+'rules/">Community rules</a></p>','Report this post');
    wire(d);
    $('form',d).addEventListener('submit',function(e){e.preventDefault();var r=$('input[name=rpReason]:checked',d),m=$('.auth-m',d);if(!r){m.textContent='Pick a reason so the mods know what to look for.';$('input[name=rpReason]',d).focus();return}
      var b=$('button[type=submit]',d);b.disabled=true;m.textContent='Sending\u2026';
      SMU.report({thread:t.id,post:i,postId:p[4]||null,reason:r.value,note:$('#rpNote',d).value.trim().slice(0,500)}).then(function(res){
        reportDone(d,res.dup,res.where,n);if(btn&&document.contains(btn)){btn.textContent='Reported';btn.dataset.done='1'}},function(err){b.disabled=false;m.textContent=err.message||'Couldn\u2019t send that. Try again.'})})
    function wire(x){x.addEventListener('click',function(e){if(e.target.closest('[data-rp-close]'))x.close()})}}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-report]');if(!b)return;e.preventDefault();var m=location.hash.match(/^#t(\d+)(?:-[a-z0-9]+)?$/),t=m&&MP.THREADS.filter(function(x){return x.id===+m[1]})[0];if(!t)return;
    var i=+b.dataset.report;requireUser('Sign in to report a post.',function(){reportPost(t,i,b)})});
  document.addEventListener('click',function(e){var b=e.target.closest('[data-compose]');if(!b)return;e.preventDefault();var sp=b.dataset.sport||'',fo=b.dataset.forum||'';requireUser('Sign in to start a thread.',function(){compose(sp,fo)})});

  /* ---------- Profile photo (Account page) ----------
     Checks type and size first (JPEG/PNG/WebP, 2 MB), then center-crops to a 256x256 square in the browser and uploads that
     (WebP, or JPEG where the browser can't make WebP). Storage enforces the same type and size limits on the server. */
  function squarePhoto(file){return new Promise(function(res,rej){var url=URL.createObjectURL(file),img=new Image();
    img.onload=function(){var w=img.naturalWidth,h=img.naturalHeight,s=Math.min(w,h);URL.revokeObjectURL(url);if(!s)return rej(new Error('That image couldn\u2019t be read. Try another photo.'));
      var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d');x.imageSmoothingQuality='high';x.fillStyle='#fff';x.fillRect(0,0,256,256);
      x.drawImage(img,(w-s)/2,(h-s)/2,s,s,0,0,256,256);
      c.toBlob(function(b){if(b&&b.type==='image/webp')return res(b);c.toBlob(function(j){j?res(j):rej(new Error('That image couldn\u2019t be processed. Try another photo.'))},'image/jpeg',0.86)},'image/webp',0.86)};
    img.onerror=function(){URL.revokeObjectURL(url);rej(new Error('That image couldn\u2019t be read. Try another photo.'))};img.src=url})}
  function wirePhoto(root){var pick=$('#avPick',root),inp=$('#avFile',root),rm=$('#avRemove',root),m=$('#avMsg',root);if(!pick)return;
    function busy(on,t){pick.disabled=on;if(rm)rm.disabled=on;m.textContent=t||''}
    pick.addEventListener('click',function(){inp.value='';inp.click()});
    inp.addEventListener('change',function(){var f=inp.files&&inp.files[0];if(!f)return;var bad=SMU.avatarCheck(f);if(bad){m.textContent=bad;return}
      var had=!!avPhoto(MP.USERS[SMU.me()]);busy(true,'Uploading\u2026');
      squarePhoto(f).then(function(b){return SMU.setAvatar(b)}).then(function(){toast(had?'Photo replaced.':'Photo added.')},function(err){busy(false,err.message||'Couldn\u2019t upload that photo. Try again.')})});
    if(rm)rm.addEventListener('click',function(){busy(true,'Removing\u2026');
      SMU.removeAvatar().then(function(){toast('Photo removed.')},function(err){busy(false,err.message||'Couldn\u2019t remove the photo. Try again.')})})}

  /* ---------- Account page ---------- */
  var SET_TABS=['profile','subscriptions','transactions'],acctTab=(location.hash||'').slice(1)==='student'?'subscriptions':(location.hash||'').slice(1);
  var EYE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 6c5 0 8.5 4 9.5 6-.4.9-1.3 2.2-2.6 3.4M6.6 7.6C4.6 8.9 3.1 10.8 2.5 12c1 2 4.5 6 9.5 6 1.6 0 3-.4 4.3-1M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
  var EYE_OPEN='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12C3.5 10 7 6 12 6s8.5 4 9.5 6c-1 2-4.5 6-9.5 6s-8.5-4-9.5-6z"/><circle cx="12" cy="12" r="3"/></svg>';
  function account(){var main=$('#acctMain');document.title='Settings | SMU+';
    function render(){var u=SMU.user;
      if(!u){main.innerHTML='<section class="page-hero acct-hero has-photo"><div class="bgph">'+photo('equestrian',{eager:1})+'</div>'+CREDIT+'<div class="wrap"><h1 class="display">Sign in</h1><p class="lede on-dark">Save players, post on the boards and pick up videos where you left off on any device.</p></div></section>'+
        '<section class="sec"><div class="wrap acct-wrap">'+conceptNotice('acct-cn')+'<div class="acct-card">'+authForm(location.hash==='#signup'?'up':'in')+'</div>'+freeBands('acct')+'</div></section>';wireAuth(main,render);
        if(location.hash==='#student'&&stOn())setTimeout(function(){openStudent()},60);return}
      if(location.hash==='#reset'&&SMU.live){main.innerHTML='<section class="sec"><div class="wrap acct-wrap"><div class="acct-card"><h2 class="sec-t">Choose a new password</h2><form id="npForm" class="auth-f" novalidate><div class="fld"><label for="npPw">New password</label><input id="npPw" type="password" autocomplete="new-password" minlength="8" required></div><p class="auth-m" aria-live="polite"></p><button class="btn btn-red" type="submit">Save password</button></form></div></div></section>';
        $('#npForm').addEventListener('submit',function(e){e.preventDefault();var v=$('#npPw').value,m=$('.auth-m',main);if(v.length<8){m.textContent='At least 8 characters.';return}SMU.newPassword(v).then(function(){history.replaceState(null,'',location.pathname);toast('Password updated.');render()},function(err){m.textContent=err.message})});return}
      var tier=SMU.tier(),saved=SMU.saved().map(function(id){return (MP.ATHLETES||[]).filter(function(a){return a.id===id})[0]}).filter(Boolean),h=hist().filter(function(x){return LIBBY[x.id]&&x.p<0.97}).slice(0,6);
      var tab=SET_TABS.indexOf(acctTab)<0?'profile':acctTab,me=SMU.me(),ph=SMU.avatarsOn()?avPhoto(MP.USERS[me]):'',pwOK=SMU.live&&u.pw!==false;
      var st=stOn()&&SMU.student&&SMU.student(),started=(tier==='student'&&st&&st.at)||u.created||u.since;
      function fmtD(d){var t=d?new Date(d):null;return t&&!isNaN(t)?t.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}):''}
      function pwFld(id,label,ph,ac){return '<div class="set-f"><label for="'+id+'">'+label+'</label><div class="set-pw"><input id="'+id+'" type="password" autocomplete="'+ac+'" placeholder="'+ph+'" maxlength="72">'+
        '<button type="button" class="set-eye" data-eye="'+id+'" aria-label="Show password" aria-pressed="false">'+EYE+'</button></div></div>'}
      var planName=tier==='student'?'Student plan':tier==='free'?'Fan account':TIER_NAME[tier]+' (demo)';
      var profile='<form id="setForm" class="set-form" novalidate>'+
          '<div class="set-sec"><h2 class="set-h">Profile information</h2><p class="set-sub">Update your profile information.</p>'+
          '<div class="set-av"><div class="set-av-img">'+(ph?avImg(ph,1):SVG.user)+'</div><div class="set-av-ctl">'+
            (SMU.avatarsOn()?'<input type="file" id="avFile" accept="image/jpeg,image/png,image/webp" hidden><div class="set-av-btns"><button type="button" class="btn set-out" id="avPick">Change avatar</button>'+(ph?'<button type="button" class="linkish" id="avRemove">Remove</button>':'')+'</div>':
              '<button type="button" class="btn set-out" disabled>Change avatar (coming soon)</button>')+
            '<p class="set-hint">For best results use an image at least 400x400 pixels.</p><p class="auth-m" id="avMsg" aria-live="polite"></p></div></div>'+
          '<div class="set-f"><label for="dispName">Username</label><input id="dispName" maxlength="40" autocomplete="nickname" value="'+esc(u.name||'')+'"></div>'+
          '<div class="set-f"><label for="setEmail">Email</label><input id="setEmail" type="email" value="'+esc(u.email||'')+'" readonly aria-describedby="setEmailH"><p class="set-hint" id="setEmailH">If you need to change your email, contact <a href="mailto:smuplusmedia@gmail.com">smuplusmedia@gmail.com</a>.</p></div></div>'+
          (pwOK?'<div class="set-sec"><h2 class="set-h">Change password</h2><p class="set-sub">Update the password for your account.</p>'+
            pwFld('pwCur','Current password','Enter your current password','current-password')+pwFld('pwNew','New password','Enter a new password','new-password')+pwFld('pwNew2','Confirm new password','Confirm your new password','new-password')+'</div>':'')+
          '<p class="auth-m set-m" aria-live="polite"></p><div class="set-act"><button type="submit" class="btn set-save" disabled>Save</button></div></form>'+
        '<div class="set-sec"><h2 class="set-h">Saved players</h2>'+(saved.length?'<ul class="acct-list">'+saved.map(function(a){return '<li><a href="'+athleteUrl(a.id)+'"><b>'+esc(a.name)+'</b><small>#'+a.num+' \u00b7 '+a.pos+'</small></a><button type="button" class="linkish" data-save-athlete="'+a.id+'" aria-pressed="true"><span>Saved</span></button></li>'}).join('')+'</ul>':'<p class="set-sub">No saved players yet. Tap <b>Save player</b> on any <a href="'+ROOT+'athletes/">player profile</a>.</p>')+'</div>'+
        '<div class="set-sec"><h2 class="set-h">Continue watching</h2>'+(h.length?'<ul class="acct-list">'+h.map(function(x){var c=LIBBY[x.id];return '<li><a href="'+libUrl()+itemHref(c)+'"><b>'+esc(c.title)+'</b><small>'+Math.round(x.p*100)+'% \u00b7 '+(VERB[c.t]||'Open')+'</small></a></li>'}).join('')+'</ul>':'<p class="set-sub">Nothing in progress. Start something in the <a href="'+libUrl()+'">library</a>.</p>')+'</div>';
      var subs='<div class="set-sec" id="acctPlan"><h2 class="set-h">Your plan</h2><p class="set-sub">'+(tier==='student'||tier==='free'?'Free with your SMU+ account.':'Demo membership. No payments are taken.')+'</p>'+
          '<div class="set-plan"><div><b>'+esc(planName)+'</b>'+(tier==='student'?'<span class="st-badge">Student</span>':'')+
            (tier==='student'&&st?'<p>Class of '+esc(st.year||'\u2014')+'. Checked with your @smu.edu email.</p>':'')+
            (fmtD(started)?'<p>Started '+fmtD(started)+'</p>':'')+'</div>'+
            (paidT(tier)?'<button type="button" class="linkish" id="cancelPlan">Cancel demo membership</button>':'')+'</div>'+
          (PAID_OPEN?'<div class="acct-plans">'+['mustang','pony','club'].map(function(t){return '<button type="button" class="btn btn-sm '+(t===tier?'btn-navy':'btn-outline')+'" data-plan="'+t+'"'+(t===tier?' aria-current="true" disabled':'')+'>'+TIER_NAME[t]+'</button>'}).join('')+'</div>':
            (!SHOW_PAID_PLANS?'':'<h3 class="set-h3">Other plans</h3><ul class="set-soon">'+['mustang','pony','club'].filter(function(t){return t!==tier}).map(function(t){return '<li><b>'+esc(TIER_NAME[t])+'</b><span>Coming soon</span></li>'}).join('')+'</ul>'+
            '<button type="button" class="btn btn-sm btn-outline" data-join>Join the waitlist</button>'))+'</div>'+
        studentCard(u,tier)+
        '<div class="set-sec"><h2 class="set-h">SMU+ Weekly</h2><p class="set-sub">One email on Friday mornings in season.</p>'+briefHTML('briefAcct')+'</div>';
      var tx='<div class="set-sec set-empty"><h2 class="set-h">Transactions</h2><p class="set-sub">No transactions yet.</p></div>';
      var P={profile:profile,subscriptions:subs,transactions:tx},L={profile:'Profile',subscriptions:'Subscriptions',transactions:'Transactions'};
      main.innerHTML='<section class="set"><div class="wrap set-wrap"><div class="set-top"><h1 class="set-title">Settings</h1><button type="button" class="btn set-out set-signout" id="signOut">Sign out</button></div>'+
        (SMU.live?'':'<p class="set-demo">Demo account. Everything here is saved only in this browser.</p>')+
        '<div class="set-tabs" role="tablist" aria-label="Settings">'+SET_TABS.map(function(k){return '<button type="button" role="tab" id="tab-'+k+'" aria-controls="pane-'+k+'" aria-selected="'+(k===tab)+'"'+(k===tab?'':' tabindex="-1"')+' data-set-tab="'+k+'">'+L[k]+'</button>'}).join('')+'</div>'+
        SET_TABS.map(function(k){return '<div class="set-pane" role="tabpanel" id="pane-'+k+'" aria-labelledby="tab-'+k+'"'+(k===tab?'':' hidden')+'>'+P[k]+'</div>'}).join('')+
        '</div></section>';
      syncBriefs();
      var tabs=$$('[data-set-tab]',main);
      function pick(k,focus){acctTab=k;tabs.forEach(function(b){var on=b.dataset.setTab===k;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;if(on&&focus)b.focus()});
        SET_TABS.forEach(function(x){$('#pane-'+x,main).hidden=x!==k});try{history.replaceState(null,'',k==='profile'?location.pathname:'#'+k)}catch(e){}}
      tabs.forEach(function(b,i){b.addEventListener('click',function(){pick(b.dataset.setTab)});
        b.addEventListener('keydown',function(e){var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;e.preventDefault();pick(SET_TABS[(i+d+SET_TABS.length)%SET_TABS.length],true)})});
      $('#signOut').addEventListener('click',function(){SMU.signOut().then(function(){toast('Signed out.');render()},function(err){toast(err.message,'err')})});
      var cp=$('#cancelPlan');if(cp)cp.addEventListener('click',function(){SMU.setTier('free').then(backToStudent).then(function(){toast(SMU.tier()==='student'?'Demo membership canceled. You\u2019re back on the free Student plan.':'Demo membership canceled.');render()},function(err){toast(err.message,'err')})});
      wirePhoto(main);wireStudentCard(main,render);
      $$('[data-eye]',main).forEach(function(b){b.addEventListener('click',function(){var i=$('#'+b.dataset.eye,main),show=i.type==='password';i.type=show?'text':'password';
        b.setAttribute('aria-pressed',show);b.setAttribute('aria-label',show?'Hide password':'Show password');b.innerHTML=show?EYE_OPEN:EYE})});
      var f=$('#setForm',main),save=$('.set-save',f),m=$('.set-m',f),nm=$('#dispName',f),pw=['pwCur','pwNew','pwNew2'].map(function(id){return $('#'+id,f)});
      function dirty(){return nm.value.trim()!==(u.name||'')||pw.some(function(i){return i&&i.value})}
      f.addEventListener('input',function(){save.disabled=!dirty();m.textContent=''});
      f.addEventListener('submit',function(e){e.preventDefault();if(!dirty())return;var v=nm.value.trim(),cur=pw[0]&&pw[0].value,nw=pw[1]&&pw[1].value,nw2=pw[2]&&pw[2].value,wantPw=!!(cur||nw||nw2);
        if(!v){m.textContent='Enter a username.';nm.focus();return}
        if(wantPw){if(!cur){m.textContent='Enter your current password.';pw[0].focus();return}if((nw||'').length<8){m.textContent='Use at least 8 characters for the new password.';pw[1].focus();return}
          if(nw!==nw2){m.textContent='The new passwords don\u2019t match.';pw[2].focus();return}}
        save.disabled=true;m.textContent='Saving\u2026';
        var steps=Promise.resolve(),did=[];
        if(v!==(u.name||''))steps=steps.then(function(){return SMU.updateName(v)}).then(function(){did.push('name')});
        if(wantPw)steps=steps.then(function(){return SMU.changePassword(cur,nw)}).then(function(){did.push('pw')});
        steps.then(function(){toast(did.length>1?'Username and password saved.':did[0]==='pw'?'Password updated.':'Username saved.');render()},
          function(err){m.textContent=err.message||'Couldn\u2019t save. Try again.';save.disabled=false;if(err.field==='cur'&&pw[0])pw[0].focus()})});
      if(location.hash==='#student'){pick('subscriptions');var sc=$('#acctStudent')||$('#acctPlan');if(sc)setTimeout(function(){sc.scrollIntoView({block:'start'})},60)}}
    main.innerHTML='<div class="skel-block" aria-hidden="true" style="min-height:420px"><i class="sk"></i></div>';
    SMU.ready.then(render);SMU.on('auth',function(){render()});SMU.on('avatar',function(){if(SMU.user)render()});SMU.on('tier',function(){if(SMU.user)render()});SMU.on('saved',function(){if(SMU.user)render()});SMU.on('student',function(){if(SMU.user)render()})}

  SMU.ready.then(function(){syncAcct();syncBriefs();syncWaitlist();if(SMU.user&&SMU.live)pullHistory();
    var s=SMU.user&&SMU.tier();if(SMU.user){store('mp_member',paidT(s)?'1':'0');syncMember()}});
  syncAcct();

  /* Sub-nav anchors: X posts and images keep loading (and growing) above the target while the page scrolls,
     so keep the section lined up under the sticky sub-nav for a moment, until the reader scrolls themselves. */
  document.addEventListener('click',function(e){var a=e.target.closest('.jump a[href^="#"]');if(!a||e.defaultPrevented)return;
    var id=a.getAttribute('href'),t=document.getElementById(id.slice(1));if(!t)return;e.preventDefault();
    try{history.replaceState(null,'',id)}catch(x){}
    var calm=matchMedia('(prefers-reduced-motion: reduce)').matches,stop=false,n=0;
    function quit(){stop=true;['wheel','touchstart','keydown'].forEach(function(k){removeEventListener(k,quit,true)})}
    ['wheel','touchstart','keydown'].forEach(function(k){addEventListener(k,quit,{capture:true,passive:true})});
    t.scrollIntoView({behavior:calm?'auto':'smooth',block:'start'});
    (function fix(){if(stop)return;var pad=parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop)||0,off=t.getBoundingClientRect().top-pad,
      max=document.documentElement.scrollHeight-innerHeight;
      if(n>2&&Math.abs(off)>2&&!(off>0&&scrollY>=max-1))scrollBy({top:off,behavior:'auto'});
      if(++n<14)setTimeout(fix,200);else quit()})()});
  aboutSources();if(PAGE==='home')home();else if(PAGE==='library'){library();/* Media > Articles: ?type=article#libRead lands on Read the Recap once the grid has rendered */if(location.hash==='#libRead')setTimeout(function(){var r=$('#libRead');if(r)r.scrollIntoView({block:'start'})},350)}else if(PAGE==='recruiting')recruiting();else if(PAGE==='boards')boards();else if(PAGE==='sport')sport();else if(PAGE==='athlete')athlete();else if(PAGE==='games')gamePage();else if(PAGE==='account')account();else if(PAGE==='search')searchPage();watchX();
  articleFromHash();
})();
