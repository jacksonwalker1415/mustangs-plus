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
  function rosterCard(a,i,s,o){o=o||{};var v=['home','away','alt'][i%3],key=rosterPhotoKey(a,s.slug),p=key&&PH[key],hasNum=a.num!=null&&a.num!=='';
    var art=p?'<img class="rc-photo" src="'+ROOT+'assets/photos/'+(p.small||p.file)+'" alt="'+esc(a.name+(hasNum?', number '+a.num:'')+', SMU '+s.name)+'" loading="lazy" decoding="async" style="object-position:'+(p.pos||'50% 22%')+'">'
      :(MP.sportIcon?MP.sportIcon(s.slug,hasNum?a.num:null,v==='alt'?'light':'dark'):'');
    return '<a class="rcard roster-card'+(p?' has-photo':' has-icon')+(o.more?' r-more':'')+'"'+(o.more?' hidden':'')+' href="'+(a.url||'#')+'" target="_blank" rel="noopener"><span class="rnum" style="background:'+KIT_BG[v]+'">'+art+'</span>'+
      '<span class="rc-b"><b>'+esc(a.name)+'</b><span class="rp">'+esc([a.pos,o.team].filter(Boolean).join(' \u00b7 ')||s.name)+'</span><small>'+esc([a.cls,a.ht,a.town].filter(Boolean).join(' \u00b7 '))+'</small><small class="r-bio">Official bio <span aria-hidden="true">\u2197</span></small></span></a>'}
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
  function isMember(){return store('mp_member')==='1'}
  /* Third-party embeds (official SMU Athletics YouTube videos) are never behind the members gate */
  function gated(c){return !!(c&&c.lock&&!c.yt&&(c.t==='video'||c.cat==='film'))}
  function blocked(c){return gated(c)&&!isMember()}
  function getJSON(k,d){try{return JSON.parse(store(k)||'null')||d}catch(e){return d}}
  function hist(){return getJSON('mp_history',[])}
  function progressOf(id){var x=hist().filter(function(h){return h.id===id})[0];return x?x.p:0}
  function track(id,p){var all=hist(),old=all.filter(function(x){return x.id===id})[0],rest=all.filter(function(x){return x.id!==id});
    rest.unshift({id:id,p:Math.min(1,Math.max(p||0,old?old.p:0)),t:Date.now()});store('mp_history',JSON.stringify(rest.slice(0,24)));document.dispatchEvent(new Event('mp:history'));syncProgress(id,rest[0].p)}
  var progT={};function syncProgress(id,p){if(!window.SMU||!SMU.live||!SMU.user)return;clearTimeout(progT[id]);progT[id]=setTimeout(function(){SMU.progress(id,p).catch(function(){})},1500)}
  function syncMember(){var on=isMember();document.documentElement.classList.toggle('is-member',on);
    $$('[data-member-toggle]').forEach(function(b){b.setAttribute('aria-checked',on?'true':'false')})}
  /* 'student' is the free Student plan: never a paid membership (sb.js paidTier) */
  function paidT(t){return window.SMU&&SMU.paidTier?SMU.paidTier(t):!!t&&t!=='free'}
  function stOn(){return !!(window.SMU&&SMU.studentsOn&&SMU.studentsOn())}
  function backToStudent(){return stOn()&&SMU.student&&SMU.student()?SMU.claimStudent(null,null):null}
  function setMember(on,tier){store('mp_member',on?'1':'0');syncMember();document.dispatchEvent(new Event('mp:member'));
    if(window.SMU&&SMU.user){var t=on?(tier||(paidT(SMU.tier())?SMU.tier():'pony')):'free';SMU.setTier(t).then(function(){if(!on)return backToStudent()}).catch(function(e){toast(e.message,'err');store('mp_member',on?'0':'1');syncMember();document.dispatchEvent(new Event('mp:member'))})}
    else{try{localStorage.setItem('mp_tier',on?(tier||'pony'):'free')}catch(e){}}}
  var PH=MP.PHOTOS||{},CREDIT='<span class="credit">Photo: SMU Athletics</span>';
  function photo(key,opt){var p=PH[key];if(!p)return '';opt=opt||{};
    var img='<img class="ph" src="'+ROOT+'assets/photos/'+(opt.small&&p.small?p.small:p.file)+'" alt="'+esc(p.alt)+'" style="object-position:'+(p.pos||'50% 50%')+'"'+(opt.eager?' fetchpriority="high"':' loading="lazy"')+' decoding="async">';
    /* heroes: a full-resolution 16:9 crop on wide screens so the photo is never upscaled */
    return opt.hero&&p.wide?'<picture><source media="(min-width:700px)" srcset="'+ROOT+'assets/photos/'+p.wide+'">'+img+'</picture>':img}
  function photoBg(key,opt){return PH[key]?'<div class="bgph" aria-hidden="false">'+photo(key,opt)+'</div>'+CREDIT:''}
  var SVG={search:'<svg viewBox="0 0 24 24"><path d="M10.5 3a7.5 7.5 0 0 1 5.9 12.1l4.8 4.8-1.4 1.4-4.8-4.8A7.5 7.5 0 1 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"/></svg>',
    play:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',filter:'<svg viewBox="0 0 24 24"><path d="M3 5h18l-7 8v6l-4 2v-8z"/></svg>',
    chat:'<svg viewBox="0 0 24 24"><path d="M4 4h16v12H8l-4 4z"/></svg>',user:'<svg viewBox="0 0 24 24"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm-8 9c0-4.4 3.6-7 8-7s8 2.6 8 7z"/></svg>',
    grid:'<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z"/></svg>'};
  function emptyState(ic,title,text,act){return '<div class="empty-state"><span class="es-ic" aria-hidden="true">'+(SVG[ic]||SVG.search)+'</span><h3>'+title+'</h3><p>'+text+'</p>'+(act?'<div class="es-act">'+act+'</div>':'')+'</div>'}
  syncMember();

  /* ---------- Concept notice: one wording everywhere (top bar is in each page's HTML, see build_pages.py) ---------- */
  function conceptNotice(cls){return '<div class="cnotice'+(cls?' '+cls:'')+'" role="note"><b>Concept built for an SMU Cox MBA class project.</b> Not affiliated with or endorsed by SMU Athletics or Learfield. '+
    'No payments are taken. Membership and checkout here are a demo, and no card is ever asked for. <a href="'+ROOT+'privacy/#about">About this project</a></div>'}

  /* Single privacy contact (MP.CONTACT in data.js). Empty email -> placeholder sentence. Also fills [data-contact] spans on static pages. */
  function contactHTML(){var C=MP.CONTACT||{};return C.email?'<a href="mailto:'+esc(C.email)+'?subject=SMU%2B%20data%20removal">'+esc(C.email)+'</a>':esc(C.pending||'a dedicated SMU+ contact email will be posted here before launch')}
  $$('[data-contact]').forEach(function(el){el.innerHTML=contactHTML()});
  /* ---------- Waitlist: free, no payment. Live: public.waitlist (supabase/waitlist.sql), falling back to newsletter_signups until that migration runs. ---------- */
  var AFFIL=[['student','SMU student'],['alum','SMU alum'],['fan','Fan'],['parent','Parent or family'],['other','Other']];
  var TL=MP.TIER_LABELS||{},INTEREST=[['free','Free newsletter only'],['mustang',(TL.mustang||'Mustang')+' ($9.99/mo)'],['all_access',(TL.pony||'All-Access')+' ($24.99/mo)'],['red_blue',(TL.club||'Red & Blue')+' ($99/mo)'],['not_sure','Not sure yet']];
  function waitlistHTML(id){return '<div class="wl" data-waitlist>'+
    '<form class="wl-f" id="'+id+'" novalidate><div class="fld"><label for="'+id+'-e">Email address</label><input id="'+id+'-e" type="email" name="email" autocomplete="email" placeholder="you@example.com" required aria-describedby="'+id+'-m"></div>'+
    '<div class="fld-row"><div class="fld"><label for="'+id+'-n">Name <small>(optional)</small></label><input id="'+id+'-n" type="text" name="name" autocomplete="name" maxlength="80"></div>'+
    '<div class="fld"><label for="'+id+'-a">SMU affiliation <small>(optional)</small></label><select id="'+id+'-a" name="affiliation"><option value="">Choose one</option>'+AFFIL.map(function(a){return '<option value="'+a[0]+'">'+a[1]+'</option>'}).join('')+'</select></div></div>'+
    '<div class="fld"><label for="'+id+'-t">Which plan would interest you? <small>(optional, nothing to buy)</small></label><select id="'+id+'-t" name="tier"><option value="">Choose one</option>'+INTEREST.map(function(a){return '<option value="'+a[0]+'">'+esc(a[1])+'</option>'}).join('')+'</select></div>'+
    '<label class="wl-consent" for="'+id+'-c"><input id="'+id+'-c" type="checkbox" name="consent" required><span class="wl-box" aria-hidden="true"></span><span>I agree that SMU+ can store these details to contact me about this student project, as described in the <a href="'+ROOT+'privacy/">privacy notice</a>.</span></label>'+
    '<p class="wl-m" id="'+id+'-m" aria-live="polite"></p><button class="btn btn-red wl-go" type="submit">Join the waitlist</button>'+
    '<p class="wl-fine">Free. There is nothing to buy. Ask to be removed anytime: '+contactHTML()+'.</p></form>'+
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
  var NAV=[['Watch',libUrl(),'library']].concat(REC_ON?[['Recruiting',ROOT+'recruiting/','recruiting']]:[],[['Sports',ROOT+'#sports','sport'],['Boards',ROOT+'boards/','boards'],['Athletes',ROOT+'athletes/','athlete'],['Membership',ROOT+'#membership','membership']]);
  /* Sports is a dropdown (desktop) / accordion (phone menu) listing all 12 programs; #sports links anywhere open it */
  var CHEV='<svg class="dd-chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg>';
  function navLinks(){return NAV.map(function(n){var on=PAGE===n[2];
    if(n[2]==='sport')return '<button type="button" class="nav-dd-btn'+(on?' on':'')+'" id="sportsBtn" aria-expanded="false" aria-controls="sportsMenu" aria-haspopup="true">'+n[0]+CHEV+'</button>';
    return '<a href="'+n[1]+'"'+(on?' class="on" aria-current="page"':'')+'>'+n[0]+'</a>'}).join('')}
  function sportsPanel(){return '<div class="sports-dd" id="sportsMenu" hidden><p class="sdd-h">All 12 sports</p><ul class="sdd-list">'+MP.SPORTS.map(function(sp){var cur=PAGE==='sport'&&document.body.dataset.sport===sp.slug;
    return '<li><a href="'+sportUrl(sp.slug)+'"'+(cur?' aria-current="page"':'')+'>'+sportIcon(sp.slug)+'<span>'+esc(sp.name)+'</span></a></li>'}).join('')+'</ul></div>'}
  /* Header/footer logo. ONE swappable path (relative to the site root). Set to '' to fall back to the type-only SMU+ lockup. */
  var BRAND_LOGO='assets/brand/smu-plus-logo.png';
  function wordmark(cls){return '<a href="'+(ROOT||'./')+'" class="wordmark'+(cls||'')+(BRAND_LOGO?' has-logo':'')+'" aria-label="SMU+ home">'+
    (BRAND_LOGO?'<picture><source type="image/webp" srcset="'+ROOT+BRAND_LOGO.replace(/\.png$/,'.webp')+'"><img src="'+ROOT+BRAND_LOGO+'" alt="SMU+" width="360" height="128" decoding="async"></picture>':'<span class="wm-txt">SMU</span><span class="wm-plus" aria-hidden="true">+</span><span class="sr">+</span>')+'</a>'}
  function memberSwitch(label){return '<button type="button" class="mtoggle" data-member-toggle role="switch" aria-checked="false"><span class="sw-t" aria-hidden="true"></span><span class="mt-l">'+(label||'Preview as member')+'</span></button>'}
  /* Phone/tablet menu (under 960px). Every primary link, plus search, member preview and Join. */
  function mobileMenu(){
    return '<div class="mmenu" id="mmenu" role="dialog" aria-modal="true" aria-label="Site menu" hidden><div class="mm-in">'+
      '<button type="button" class="mm-search" data-mm-search>'+SVG_SEARCH+'<span>Search stories, players, threads</span></button>'+
      '<nav class="mm-nav" aria-label="Primary">'+NAV.map(function(n){var on=PAGE===n[2];
        if(n[2]==='sport')return '<button type="button" class="mm-acc'+(on?' on':'')+'" id="mmSportsBtn" aria-expanded="false" aria-controls="mmSports"><b>'+n[0]+'</b><span class="mm-chev" aria-hidden="true">›</span></button>'+
          '<div class="mm-sports" id="mmSports" hidden>'+MP.SPORTS.map(function(sp){return '<a href="'+sportUrl(sp.slug)+'">'+sportIcon(sp.slug)+'<span>'+esc(sp.name)+'</span></a>'}).join('')+'</div>';
        return '<a href="'+n[1]+'"'+(on?' class="on" aria-current="page"':'')+'><b>'+n[0]+'</b><span class="mm-chev" aria-hidden="true">›</span></a>'}).join('')+'</nav>'+
      '<div class="mm-member">'+memberSwitch('Member preview')+'<p>See the site the way members do. Demo setting: no payment is involved.</p></div>'+
      '<a class="mm-acct" href="'+ROOT+'account/"><span class="acct-av" aria-hidden="true">'+SVG.user+'</span><span><b class="mm-acct-l">Sign in or create an account</b><small class="mm-acct-s">Save athletes, post on the boards, sync what you watch</small></span><span class="mm-chev" aria-hidden="true">›</span></a>'+
      '<a class="btn btn-red mm-join" href="'+ROOT+'#waitlist">Join SMU+</a>'+
      '<p class="mm-note">Concept built for an SMU Cox MBA class project. No payments are taken.</p></div></div>'}
  $('#site-header').outerHTML='<header class="site"><div class="wrap hdr">'+wordmark()+'<nav class="main" aria-label="Primary">'+navLinks()+'</nav>'+
    '<div class="hdr-act"><button type="button" class="hsearch" id="searchBtn" aria-haspopup="dialog" aria-label="Search SMU+">'+SVG.search+'<span>Search</span><kbd>/</kbd></button>'+memberSwitch('Member preview')+
    '<a class="acct-btn" id="acctBtn" href="'+ROOT+'account/"'+(PAGE==='account'?' aria-current="page"':'')+'><span class="acct-av" aria-hidden="true">'+SVG.user+'</span><span class="acct-l">Sign in</span></a>'+
    '<a class="btn btn-red btn-sm hdr-join" href="'+ROOT+'#waitlist">Join</a>'+
    '<button type="button" class="menu-btn" id="menuBtn" aria-expanded="false" aria-controls="mmenu" aria-label="Open menu"><span class="mb-bars" aria-hidden="true"><i></i><i></i><i></i></span></button></div></div>'+sportsPanel()+
    mobileMenu()+'</header>';
  var sportLinks=MP.SPORTS.map(function(s){return '<li><a href="'+sportUrl(s.slug)+'">'+s.name+'</a></li>'});
  $('#site-footer').outerHTML='<footer class="site-ft"><div class="wrap"><div class="ft">'+
    '<div class="ft-brand">'+wordmark(' lg')+'<p>Every moment. Every Mustang. A proposed fan membership for every SMU sport. 40% to SMU\u2019s official NIL programs (proposed).</p>'+
      '<div class="ft-brief"><h4>SMU+ Weekly</h4><p>One email on Friday mornings in season.</p>'+briefHTML('briefFt',true)+'</div><span class="powered">Powered by Learfield <em>(concept)</em></span></div>'+
    '<div class="ft-cols"><div><h4>Fall &amp; Winter</h4><ul>'+sportLinks.slice(0,6).join('')+'</ul></div><div><h4>More Sports</h4><ul>'+sportLinks.slice(6).join('')+'</ul></div>'+
    '<div><h4>Watch &amp; Read</h4><ul><li><a href="'+libUrl()+'">Library</a></li><li><a href="'+libUrl('film')+'">Film Room</a></li><li><a href="'+libUrl('podcasts')+'">Podcasts</a></li>'+(REC_ON?'<li><a href="'+ROOT+'recruiting/">Recruiting</a></li>':'')+'</ul></div>'+
    '<div><h4>Community</h4><ul><li><a href="'+ROOT+'boards/">Message Boards</a></li><li><a href="'+ROOT+'athletes/">Player Profiles</a></li><li><a href="'+ROOT+'#membership">Plans</a></li><li><a href="'+ROOT+'#faq">FAQ</a></li><li><a href="'+ROOT+'#waitlist">Join the waitlist</a></li><li><a href="'+ROOT+'privacy/">Privacy notice</a></li></ul></div></div></div>'+
    '<div class="legal"><p><strong>Concept built for an SMU Cox MBA class project. Not affiliated with or endorsed by SMU Athletics or Learfield. No payments are taken.</strong> Membership and checkout are a demo. <a href="'+ROOT+'privacy/">Privacy notice</a></p>'+
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
      '<p class="pw-nil"><b>In the proposed model, 40% of membership revenue would go to SMU Athletics\u2019 official NIL and revenue-sharing programs, with athlete deals disclosed through the NIL Go clearinghouse.</b></p>'+
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
  var TPL_W=[[/mic'?d up/i,"MIC'D UP"],[/hall of fame|feature|profile/i,'FEATURE'],[/recap|final from|results/i,'RECAP'],[/preview/i,'PREVIEW'],[/film/i,'FILM ROOM'],
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
    return '<span class="tpl-ph">'+photo(key,{small:!opt.big,eager:opt.eager})+'<span class="credit">Photo: SMU Athletics</span></span>'+
      '<span class="tpl-p" aria-hidden="true">'+TPL_MARK+'<span class="tpl-k">'+esc(k)+'</span><span class="tpl-w">'+esc(tplWord(c))+'</span>'+(d?'<span class="tpl-d">'+esc(d)+'</span>':'')+'</span>'}
  /* Official YouTube items show the video's real thumbnail (maxresdefault, falling back to hqdefault). Images load from i.ytimg.com. */
  function ytId(c){return c&&c.yt&&/^[A-Za-z0-9_-]{11}$/.test(c.yt)?c.yt:null}
  function ytImg(id,cls,eager){return '<img class="'+cls+'" src="https://i.ytimg.com/vi/'+id+'/maxresdefault.jpg" data-yt-fb="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg" alt="" '+(eager?'loading="eager"':'loading="lazy"')+' decoding="async" referrerpolicy="no-referrer">'}
  function ytFix(e){var i=e.target;if(!i||i.tagName!=='IMG'||!i.dataset||!i.dataset.ytFb)return;
    if(e.type==='error'||(i.naturalWidth&&i.naturalWidth<=120)){var fb=i.dataset.ytFb;delete i.dataset.ytFb;i.src=fb}}
  document.addEventListener('error',ytFix,true);document.addEventListener('load',ytFix,true);
  function poster(c,opt){opt=opt||{};var g=gated(c),pr=progressOf(c.id),yt=ytId(c);
    return '<div class="poster '+(yt?'tone-black has-img has-yt':'tpl-card')+'">'+(yt?ytImg(yt,'ph yt-ph',opt.eager)+'<span class="credit">'+esc(c.credit||'Video: SMU Athletics')+'</span>':smuTpl(c,opt))+
      (g?'<span class="lock-ov" aria-hidden="true">'+LOCK+'<b>Members only</b></span>':'')+
      '<span class="poster-verb">'+TICON[c.t]+(c.ext?'Read at '+esc(c.outlet)+EXT:g?'<span class="pv-g">Preview</span><span class="pv-m">'+VERB[c.t]+'</span>':VERB[c.t])+'</span>'+(c.isNew?'<span class="tag tag-new">New</span>':'')+
      (c.lock?'<span class="tag tag-lock">'+LOCK+'Members</span>':'')+(c.ext||!c.dur||c.dur==='Video'?'':'<span class="dur">'+esc(c.dur)+'</span>')+
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
  function seriesOf(c){if(c.t!=='video'||c.title.indexOf(':')<0)return [];var k=c.title.split(':')[0];
    return Object.keys(LIBBY).map(function(i){return LIBBY[i]}).filter(function(x){return x.t==='video'&&x.title.split(':')[0]===k})}
  function relatedFor(c){var out=[],seen={};seen[c.id]=1;function add(x){if(x&&!seen[x.id]&&!expired(x)&&out.length<3){seen[x.id]=1;out.push(x)}}
    var a=MP.ARTICLES[c.id];(a&&a.related||[]).forEach(function(r){add(LIBBY[r])});seriesOf(c).forEach(add);
    MP.LIB.forEach(function(x){if(x.cat===c.cat)add(x)});MP.LIB.forEach(function(x){if(x.t===c.t)add(x)});MP.LIB.forEach(add);return out}
  function relatedHTML(c){var r=relatedFor(c);return '<div class="sec-hd sm"><h3 class="sec-t">Up next</h3></div><div class="relgrid">'+r.map(function(x){return cardHTML(x)}).join('')+'</div>'}
  function inlineGate(c){return '<div class="pw-inline"><p class="eyebrow">'+LOCK+'Members only</p><h3>Keep '+(c.t==='article'?'reading':c.t==='podcast'?'listening':'watching')+' with any plan</h3>'+
    '<p>Plans start at $9.99 a month. 40% to SMU\u2019s official NIL programs (proposed).</p><div class="pw-act"><a class="btn btn-red btn-sm" href="'+ROOT+'#membership">See plans</a>'+memberSwitch()+'</div></div>'}
  function showReader(c,push){reader.hidden=false;document.documentElement.classList.add('noscroll');readerBody.scrollTop=0;readerBody.focus();syncMember();
    var h=itemHref(c);if(push!==false&&location.hash!==h)history.pushState(null,'',h);document.title=c.title+' | SMU+';current=c.id}
  function openArticle(id,push){
    var a=MP.ARTICLES[id],c=LIBBY[id];if(!a||!c)return false;var lock=blocked(c);
    lastFocus=lastFocus||document.activeElement;var st=MP.STAFF[a.by]||{n:a.by,role:'SMU+'};
    readerBody.innerHTML='<header class="reader-hd tone-'+(c.tone||'blue')+(c.img?' has-img':'')+'">'+(c.img?photoBg(c.img):'')+'<p class="eyebrow">'+esc(c.label)+(c.lock?' · Members':'')+'</p><h2 id="reader-h">'+esc(c.title)+'</h2></header>'+
      '<div class="reader-in"><p class="dek">'+esc(a.dek)+'</p><div class="byline"><span class="av staff" aria-hidden="true">'+st.n.charAt(0)+'</span><div><b>'+esc(st.n)+'</b><small>'+esc(st.role)+' · '+a.date+' · '+esc(c.dur)+'</small></div><button class="btn btn-outline btn-sm" data-demo="Share this story">Share</button></div>'+
      '<div class="prose'+(lock?' teaser':'')+'">'+(lock?a.body.slice(0,2):a.body).map(function(p){return '<p>'+esc(p)+'</p>'}).join('')+'</div>'+(lock?inlineGate(c):'')+
      (a.sourced?'<p class="note">Sourced story. Facts and stats from '+(a.sources||[]).map(function(x){return '<a href="'+esc(x[1])+'" target="_blank" rel="noopener">'+esc(x[0])+'</a>'}).join(', ')+'. No quotes are used. SMU+ is an SMU Cox class-project concept, not affiliated with SMU Athletics.</p>':'<p class="note">Fictional story written for an SMU Cox class-project concept. Characters and quotes are invented; real places are used as setting only.</p>')+relatedHTML(c)+'</div>';
    showReader(c,push);if(!lock)track(id,0.04);return true}
  function secs(d){var m=String(d).match(/(\d+):(\d+)/);if(m)return (+m[1])*60+(+m[2]);m=String(d).match(/(\d+)\s*min/);return m?(+m[1])*60:600}
  function clock(s){s=Math.round(s);return Math.floor(s/60)+':'+('0'+s%60).slice(-2)}
  function openMedia(id,push){var c=LIBBY[id];if(!c)return false;lastFocus=lastFocus||document.activeElement;
    var lock=blocked(c),p=progressOf(id),total=secs(c.dur),eps=seriesOf(c),audio=c.t==='podcast';
    var yt=c.yt&&/^[A-Za-z0-9_-]{11}$/.test(c.yt)?c.yt:null,ap=!yt&&c.apple&&/^https:\/\/embed\.podcasts\.apple\.com\//.test(c.apple)?c.apple:null;
    readerBody.innerHTML=(ap?'<div class="player tpl-card ap" id="apBox">'+smuTpl(c,{big:1,eager:1})+'<button type="button" class="play" id="apPlay" aria-label="Play this episode (loads Apple Podcasts)">'+SVG.play+'</button></div>':yt?'<div class="player yt'+(lock?' locked':'')+'" id="ytBox">'+ytImg(yt,'yt-thumb',1)+'<span class="credit">'+esc(c.credit||'Video: SMU Athletics')+'</span>'+
          (lock?'':'<button type="button" class="play" id="ytPlay" aria-label="Play the official SMU Athletics video (loads YouTube)">'+SVG.play+'</button>')+'</div>':
        '<div class="player tpl-card'+(lock?' locked':'')+'">'+smuTpl(c,{big:1,eager:1})+
        (lock?'':'<button type="button" class="play" id="playBtn" aria-label="'+(p>0.02?'Resume':'Play')+' (demo)">'+SVG.play+'</button>')+
        '<div class="pbar" aria-hidden="true"><i id="pFill" style="width:'+Math.round(p*100)+'%"></i></div></div>')+
      '<div class="reader-in">'+(lock?inlineGate(c):'')+'<p class="eyebrow red">'+esc(c.label)+(c.lock?' · Members':'')+'</p><h2 id="reader-h" class="m-title">'+esc(c.title)+'</h2><p class="dek">'+esc(c.desc)+'</p>'+
        '<p class="m-meta"><span>'+(yt||ap?'':'<b id="pTime">'+clock(p*total)+'</b> / ')+esc(c.dur)+'</span><span>'+(audio?'Podcast':'Video')+'</span>'+(ap?'<span>'+esc(c.credit.replace(/^Podcast: /,''))+'. It loads from Apple Podcasts when you press play \u00b7 <a href="'+esc(c.src)+'" target="_blank" rel="noopener">Open in Apple Podcasts</a></span>':yt?'<span>Official SMU Athletics video. It loads from YouTube when you press play'+(c.channel?' \u00b7 <a href="'+esc(c.channel[1])+'" target="_blank" rel="noopener">'+esc(c.channel[0])+'</a>':'')+'</span>':'<span>Demo player: nothing streams in this concept</span>')+'</p>'+
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
    (MP.ATHLETES||[]).forEach(function(a){INDEX.push({g:'Players',k:'Player',ic:'user',title:a.name,sub:'#'+a.num+' · '+a.pos+' · '+a.cls+' · Football',href:athleteUrl(a.id),hay:[a.name,a.pos,a.cls,a.hometown,'football player profile #'+a.num].join(' ')})});
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
  function closeSearch(){if(search.hidden)return;search.hidden=true;if(reader.hidden&&pw.hidden)document.documentElement.classList.remove('noscroll');$('#searchBtn').focus()}
  function activate(el){var id=el.dataset.sitem;closeSearch();if(id){openItem(id)}else location.href=el.getAttribute('href')}
  $('#searchBtn').addEventListener('click',openSearch);$('#searchClose').addEventListener('click',closeSearch);
  search.addEventListener('click',function(e){if(e.target===search){closeSearch();return}var ch=e.target.closest('[data-q]');if(ch){sInput.value=ch.dataset.q;runSearch();sInput.focus();return}
    var it=e.target.closest('.s-item');if(it){e.preventDefault();e.stopPropagation();activate(it)}});
  sRes.addEventListener('mousemove',function(e){var it=e.target.closest('.s-item');if(it){var i=sItems.indexOf(it);if(i!==sActive)setActive(i)}});
  sInput.addEventListener('input',runSearch);
  sInput.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){e.preventDefault();setActive(sActive+1)}else if(e.key==='ArrowUp'){e.preventDefault();setActive(sActive-1)}
    else if(e.key==='Enter'){e.preventDefault();if(sItems[sActive])activate(sItems[sActive])}});
  document.addEventListener('keydown',function(e){var typing=/INPUT|TEXTAREA|SELECT/.test((e.target.tagName||''));
    if(e.key==='Escape'){if(!search.hidden){closeSearch();return}if(!pw.hidden){closePaywall();return}closeModal();closeArticle();return}
    if(((e.key==='/'&&!typing)||((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'))&&search.hidden){e.preventDefault();openSearch()}});

  /* ---------- Header fit: collapse lowest-priority nav links into the menu before anything overlaps ---------- */
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
  /* ---------- Mobile menu ---------- */
  var mm=$('#mmenu'),mb=$('#menuBtn'),hdrEl=$('header.site');
  function mmFocusables(){return [mb].concat($$('a,button,input',mm).filter(function(x){return x.offsetParent!==null}))}
  function openMenu(){mm.style.top=Math.max(0,hdrEl.getBoundingClientRect().bottom)+'px';mm.hidden=false;
    document.documentElement.classList.add('noscroll','menu-open');mb.setAttribute('aria-expanded','true');mb.setAttribute('aria-label','Close menu');
    requestAnimationFrame(function(){mm.classList.add('open')});var f=$('.mm-nav a',mm);if(f)f.focus({preventScroll:true})}
  function closeMenu(restore){if(mm.hidden)return;mm.classList.remove('open');mm.hidden=true;document.documentElement.classList.remove('menu-open');
    if(reader.hidden&&pw.hidden&&search.hidden)document.documentElement.classList.remove('noscroll');
    mb.setAttribute('aria-expanded','false');mb.setAttribute('aria-label','Open menu');if(restore)mb.focus()}
  mb.addEventListener('click',function(){if(mm.hidden)openMenu();else closeMenu(true)});
  mm.addEventListener('click',function(e){
    if(e.target.closest('[data-mm-search]')){closeMenu();$('#searchBtn').click();return}
    if(e.target.closest('a'))closeMenu();
    if(e.target.closest('[data-demo]'))closeMenu()});
  document.addEventListener('keydown',function(e){if(mm.hidden)return;
    if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();closeMenu(true);return}
    if(e.key==='Tab'){var f=mmFocusables(),i=f.indexOf(document.activeElement);
      if(e.shiftKey&&(i<=0)){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}},true);
  var wideMQ=window.matchMedia('(min-width:960px)');(wideMQ.addEventListener?wideMQ.addEventListener('change',function(q){if(q.matches)closeMenu()}):wideMQ.addListener(function(q){if(q.matches)closeMenu()}));
  window.addEventListener('pageshow',function(){closeMenu()});

  /* ---------- Sports dropdown (desktop) and accordion (phone menu) ---------- */
  (function(){var btn=$('#sportsBtn'),dd=$('#sportsMenu'),acc=$('#mmSportsBtn'),list=$('#mmSports'),hov=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches,ht;
    function place(){var r=btn.getBoundingClientRect(),w=dd.offsetWidth,l=Math.min(Math.max(8,r.left),innerWidth-w-8);dd.style.left=l+'px';dd.style.top=Math.round(hdrEl.getBoundingClientRect().bottom)+'px'}
    function open(focus){if(!btn||!dd)return;dd.hidden=false;place();btn.setAttribute('aria-expanded','true');if(focus){var a=$('a',dd);if(a)a.focus()}}
    function close(back){if(!dd||dd.hidden)return;pinned=false;dd.hidden=true;btn.setAttribute('aria-expanded','false');if(back)btn.focus()}
    function setAcc(on){if(!acc)return;list.hidden=!on;acc.setAttribute('aria-expanded',on?'true':'false')}
    window.openSports=function(){if(btn&&innerWidth>=960&&btn.offsetParent!==null&&!btn.classList.contains('nav-x'))open(true);else{openMenu();setAcc(true);var a=$('a',list);if(a)a.focus({preventScroll:true})}};
    var pinned=false;
    if(btn&&dd){btn.addEventListener('click',function(){if(dd.hidden||!pinned){pinned=true;open(false)}else close(false)});
      btn.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){e.preventDefault();pinned=true;open(true)}});
      dd.addEventListener('keydown',function(e){var a=$$('a',dd),i=a.indexOf(document.activeElement);
        if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();a[(i+(e.key==='ArrowDown'?1:a.length-1))%a.length].focus()}
        else if(e.key==='Tab'&&((e.shiftKey&&i===0)||(!e.shiftKey&&i===a.length-1)))close(false)});
      if(hov){[btn,dd].forEach(function(el){el.addEventListener('mouseenter',function(){clearTimeout(ht);open(false)});el.addEventListener('mouseleave',function(){clearTimeout(ht);if(!pinned)ht=setTimeout(function(){close(false)},180)})})}
      document.addEventListener('click',function(e){if(!dd.hidden&&!e.target.closest('#sportsMenu,#sportsBtn'))close(false)});
      document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!dd.hidden){e.stopPropagation();close(true)}},true);
      addEventListener('resize',function(){if(!dd.hidden){if(innerWidth<960)close(false);else place()}});addEventListener('scroll',function(){if(!dd.hidden)place()},{passive:true})}
    if(acc)acc.addEventListener('click',function(){setAcc(list.hidden)});
    document.addEventListener('click',function(e){var a=e.target.closest('a[href$="#sports"]');if(!a)return;e.preventDefault();e.stopPropagation();window.openSports()},true);
    if(location.hash==='#sports'){history.replaceState(null,'',location.pathname+location.search);setTimeout(window.openSports,60)}})();

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
    if(f.prem)p+='<span class="pill pill-prem">'+LOCK+'Members</span>';p+='<span class="pill">'+esc(f.name)+'</span>';if(s)p+='<span class="pill">'+esc(s.name)+'</span>';return p}
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
    var cell=function(v,i,tag){return '<'+tag+(numCol[i]?' class="n"':'')+'>'+esc(v)+'</'+tag+'>'};
    return '<div class="tbl-wrap"><table class="tbl'+(opt.cls?' '+opt.cls:'')+'">'+(opt.caption?'<caption class="sr">'+opt.caption+'</caption>':'')+'<thead><tr>'+t.cols.map(function(c,i){return cell(c,i,'th')}).join('')+'</tr></thead><tbody>'+
      t.rows.map(function(r){return '<tr>'+r.map(function(v,i){return cell(v,i,'td')}).join('')+'</tr>'}).join('')+
      (t.total?'<tr class="tot">'+t.total.map(function(v,i){return cell(v,i,'td')}).join('')+'</tr>':'')+'</tbody></table></div>'}
  function stars(n){return '<span class="stars" aria-label="'+n+' stars">'+'★★★★★'.slice(0,n)+'<i>'+'★★★★★'.slice(n)+'</i></span>'}

  /* ---------- Game day strip (real schedule, fictional commentary) ---------- */
  var SCH=MP.SCHEDULE,MON=['Jan.','Feb.','March','April','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'];
  function gDate(x){var d=new Date(x.d+'T12:00:00Z');return x.day+'., '+MON[d.getUTCMonth()]+' '+d.getUTCDate()}
  function gTime(x){if(!x.ko)return 'TBA';var h=+x.ko.substr(11,2),m=x.ko.substr(14,2);return (h%12||12)+(m!=='00'?':'+m:'')+' '+(h<12?'a.m.':'p.m.')+' CT'}
  function gWhen(x){return x.ko?Date.parse(x.ko):Date.parse(x.d+'T23:59:00-06:00')}
  function nextGame(){var now=Date.now();return SCH.games.filter(function(x){return !x.res&&gWhen(x)+4*3600e3>now})[0]||null}
  function lastGame(){var r=null;SCH.games.forEach(function(x){if(x.res)r=x});return r}
  function matchup(x){return 'SMU '+(x.home?'vs.':'at')+' '+x.opp}
  function gameStrip(){if(!SCH)return '';var n=nextGame(),l=lastGame(),H=MP.HURRYUP,st=H&&MP.STAFF[H.by];
    var sc=l?l.res.match(/^([WL]) (\d+)-(\d+)/):null,us=sc?+sc[2]:0,them=sc?+sc[3]:0;
    return '<div class="gd-grid">'+
      (n?'<div class="gd-next">'+photoBg('helmet',{small:1})+'<div class="gd-in"><p class="eyebrow"><span class="live-dot"></span>Next game · Football</p>'+
        '<h2 class="gd-title">'+(n.home?'SMU <span>vs.</span> ':'SMU <span>at</span> ')+esc(n.opp)+'</h2>'+
        '<dl class="gd-facts"><div><dt>Date</dt><dd>'+gDate(n)+'</dd></div><div><dt>Kickoff</dt><dd>'+gTime(n)+'</dd></div><div><dt>Where</dt><dd>'+esc(n.site)+'</dd></div><div><dt>TV</dt><dd>'+(n.tv?esc(n.tv):'TBA')+'</dd></div></dl>'+
        '<div class="cd" data-ko="'+gWhen(n)+'" data-tba="'+(n.ko?'':'1')+'" role="timer" aria-label="Countdown to kickoff">'+['Days','Hrs','Min','Sec'].map(function(u){return '<div><b>--</b><small>'+u+'</small></div>'}).join('')+'</div>'+
        '<div class="gd-act"><a class="btn btn-red btn-sm" href="'+ROOT+'sports/football/#schedule">Full schedule</a><a class="btn btn-ghost btn-sm" href="'+threadUrl(2)+'">Game thread</a></div>'+
        (n.note?'<p class="gd-note">'+esc(n.note)+'</p>':'')+'</div></div>':'<div class="gd-next"><div class="gd-in"><p class="eyebrow">Football</p><h2 class="gd-title">Season complete</h2></div></div>')+
      (l?'<article class="gd-hurry"><div class="gd-hph">'+photo((H&&H.photo&&H.photo[l.d])||'jennings-celebrate',{small:1})+CREDIT+'</div><div class="gd-hb">'+
        '<p class="eyebrow red">Hurry Up · Postgame</p><div class="score"><span class="sc-t"><b>SMU</b><em>'+us+'</em></span><span class="sc-t"><b>'+esc(l.opp)+'</b><em>'+them+'</em></span><span class="sc-f">Final · '+gDate(l)+'</span></div>'+
        '</div></article>':'')+
      '</div>'}
  function tickCountdowns(){$$('.cd[data-ko]').forEach(function(el){var t=+el.dataset.ko,d=Math.max(0,t-Date.now()),b=$$('b',el);
    var v=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60];
    if(el.dataset.tba){b[0].textContent=v[0];b[1].textContent=b[2].textContent=b[3].textContent='\u2013'}else v.forEach(function(x,i){b[i].textContent=(i&&x<10?'0':'')+x})})}
  function startCountdowns(){tickCountdowns();if($('.cd[data-ko]'))setInterval(tickCountdowns,1000)}

  /* ---------- Continue watching ---------- */
  /* Continue watching: Library only. Hidden when nothing is in progress. */
  function continueRow(){var el=$('#railContinue');if(!el)return;var sec=el.closest('section'),h=hist().filter(function(x){return LIBBY[x.id]&&x.p<0.97});
    if(!h.length){el.innerHTML='';if(sec)sec.hidden=true;return}if(sec)sec.hidden=false;
    el.innerHTML='<div class="sec-hd"><div><h2 class="sec-t">Continue watching</h2></div><button type="button" class="see-all linkish-plain" id="clearHist">Clear history</button></div>'+rail(h.slice(0,8).map(function(x){return LIBBY[x.id]}),{progress:true});
    var c=$('#clearHist');if(c)c.addEventListener('click',function(){try{localStorage.removeItem('mp_history')}catch(e){}continueRow()})}

  /* ---------- From the feeds (media batch 1): official X posts + verified accounts to follow ----------
     Nothing from X loads until the visitor taps "Load posts from X": no script, no iframe, no request. Then X's own embed
     (blockquote + platform.twitter.com/widgets.js) shows each post with its author and a link back.
     data-no-ads: keep ad slots out of this section and away from embedded posts and videos (ad-mock copy follows this). */
  var FEEDS=MP.FEEDS||{posts:{},follow:{}},FO_L={x:'X',instagram:'Instagram',youtube:'YouTube',tiktok:'TikTok'};
  /* Follow rows: each account as a mini X-style profile card (banner, round avatar, name, handle, the account's own bio, icon links),
     in one sideways swipe row per group. Avatars and banners are self-hosted copies (assets/img/x/), so nothing loads from X before a tap. */
  var XPROF=MP.XPROF||{},FO_I={
    x:'<path d="M3 3h4.2l3.6 5 4.2-5H17l-5.3 6.3L18 17h-4.2l-3.9-5.4L5.3 17H3.4l5.7-6.7z"/>',
    instagram:'<path d="M7 2.5h6A4.5 4.5 0 0 1 17.5 7v6a4.5 4.5 0 0 1-4.5 4.5H7A4.5 4.5 0 0 1 2.5 13V7A4.5 4.5 0 0 1 7 2.5zm0 1.8A2.7 2.7 0 0 0 4.3 7v6A2.7 2.7 0 0 0 7 15.7h6a2.7 2.7 0 0 0 2.7-2.7V7A2.7 2.7 0 0 0 13 4.3zm3 2.4a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6zm0 1.8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM14.2 4.9a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8z"/>',
    youtube:'<path d="M18 6.3c-.2-.9-.9-1.6-1.8-1.8C14.6 4 10 4 10 4s-4.6 0-6.2.5C2.9 4.7 2.2 5.4 2 6.3 1.6 7.9 1.6 10 1.6 10s0 2.1.4 3.7c.2.9.9 1.6 1.8 1.8C5.4 16 10 16 10 16s4.6 0 6.2-.5c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-3.7.4-3.7s0-2.1-.4-3.7zM8.3 12.6V7.4L12.6 10z"/>',
    tiktok:'<path d="M13.6 2.5c.3 1.9 1.4 3.1 3.4 3.3v2.4c-1.2.1-2.3-.3-3.4-1v4.9c0 3.4-2.6 5.4-5.5 5.4A5 5 0 0 1 3 12.5c0-3.1 2.6-5.3 5.9-4.9v2.5c-1.6-.3-3.3.6-3.3 2.4 0 1.4 1.1 2.5 2.6 2.5s2.6-1 2.6-2.8V2.5z"/>'};
  function foCard(a){var h=a[1],k=h.toLowerCase(),p=XPROF[k]||{},nm=p.n||a[0],ban=p.ban?ROOT+'assets/img/x/'+k+'-banner.webp':'';
    var chk=p.v?'<svg class="fo-v fo-v-'+(p.v==='business'?'g':'b')+'" viewBox="0 0 20 20" width="15" height="15" role="img" aria-label="Verified account"><path d="M10 1.5l2.3 1.7 2.8-.2.9 2.7 2.4 1.5-.9 2.7.9 2.7-2.4 1.5-.9 2.7-2.8-.2L10 18.5l-2.3-1.7-2.8.2-.9-2.7-2.4-1.5.9-2.7-.9-2.7 2.4-1.5.9-2.7 2.8.2z"/><path d="M6.5 10.2l2.3 2.3 4.8-5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>':'';
    return '<li class="fo-card"><div class="fo-ban">'+(ban?'<img src="'+ban+'" alt="" loading="lazy" decoding="async" width="600" height="200">':'')+'</div>'+
      '<img class="fo-av" src="'+ROOT+'assets/img/x/'+k+'.webp" alt="" loading="lazy" decoding="async" width="96" height="96">'+
      '<div class="fo-body"><p class="fo-nm"><b>'+esc(nm)+'</b>'+chk+'</p><p class="fo-h">@'+esc(h)+'</p>'+(p.b?'<p class="fo-bio">'+esc(p.b)+'</p>':'')+
      (a[3]?'<p class="fo-d">'+esc(a[3])+'</p>':'')+
      '<p class="fo-links">'+Object.keys(FO_L).filter(function(t){return a[2][t]}).map(function(t){
        return '<a class="fo-a" href="'+esc(a[2][t])+'" target="_blank" rel="noopener" aria-label="'+esc(a[0])+' on '+FO_L[t]+' (opens in a new tab)" title="'+FO_L[t]+'"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="currentColor">'+FO_I[t]+'</svg></a>'}).join('')+'</p></div></li>'}
  var XARR='<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SLN=0;
  function navHTML(id,what){return '<div class="xnav" data-xnav="'+id+'" hidden><button type="button" class="xarr xprev" data-xdir="-1" aria-label="Previous '+what+'" aria-controls="'+id+'" disabled>'+XARR+'</button><button type="button" class="xarr" data-xdir="1" aria-label="Next '+what+'" aria-controls="'+id+'">'+XARR+'</button></div>'}
  function followRow(list,h){if(!list||!list.length)return '';var id='fo-track-'+(++SLN);
    return '<div class="follow"><div class="follow-hd"><h3 class="follow-h">'+h+'</h3>'+navHTML(id,'accounts')+'</div><ul class="follow-l" id="'+id+'" data-slider role="list" aria-label="'+h+' accounts, scrolls sideways" tabindex="0">'+list.map(foCard).join('')+'</ul></div>'}
  function feedsHTML(key){var P=FEEDS.posts[key]||[],F=FEEDS.follow[key]||[],home=key==='home';if(!P.length&&!F.length)return '';
    var who={};P.forEach(function(x){who['@'+x[1]]=1});var hs=Object.keys(who);
    return '<section class="sec feeds" id="feeds" data-no-ads aria-labelledby="feeds-h"><div class="wrap">'+
      '<div class="sec-hd"><div><h2 class="sec-t" id="feeds-h">'+(P.length?'From the feeds':'Follow along')+'</h2></div>'+
      (P.length?navHTML('xtrack-'+key,'posts'):'')+'</div>'+
      (P.length?'<div class="xgate" data-xgate="'+key+'"><span class="xg-x" aria-hidden="true">X</span><p class="xg-b"><b>'+P.length+' '+(P.length===1?'post':'posts')+'</b><span class="xg-w"> from '+esc(hs.slice(0,2).join(', '))+(hs.length>2?' and more':'')+'</span>'+
        '<span class="xg-n"> · load from X only when you tap · <a href="'+ROOT+'privacy/">Privacy</a></span></p>'+
        '<button type="button" class="btn btn-navy xg-btn" data-load-x>Load posts from X</button></div>'+
        '<div class="xposts" id="xtrack-'+key+'" data-xposts data-slider role="region" aria-label="Posts from X, scrolls sideways" tabindex="0" hidden></div>':'')+
      followRow(F,home?'Follow SMU':'Follow SMU '+esc((sportBy(key)||{}).name||''))+
      (home?followRow(FEEDS.media,'Conference and beat coverage'):'')+
      '</div></section>'}
  function xNavSync(box){var nav=document.querySelector('[data-xnav="'+box.id+'"]');if(!nav)return;var b=nav.querySelectorAll('.xarr'),m=box.scrollWidth-box.clientWidth;
    nav.hidden=box.hidden||m<=2;b[0].disabled=box.scrollLeft<=2;b[1].disabled=box.scrollLeft>=m-2}
  function slSyncAll(){[].forEach.call(document.querySelectorAll('[data-slider]'),xNavSync)}
  document.addEventListener('scroll',function(e){var t=e.target;if(t&&t.hasAttribute&&t.hasAttribute('data-slider'))xNavSync(t)},{capture:true,passive:true});
  window.addEventListener('resize',slSyncAll);window.addEventListener('load',slSyncAll);setTimeout(slSyncAll,0);setTimeout(slSyncAll,800);
  function loadX(btn){var gate=btn.closest('[data-xgate]'),key=gate.dataset.xgate,box=document.getElementById('xtrack-'+key),P=FEEDS.posts[key]||[];
    box.innerHTML=P.map(function(x,i){return '<div class="xpost" role="group" aria-label="Post '+(i+1)+' of '+P.length+'"><blockquote class="twitter-tweet" data-dnt="true" data-conversation="none" data-width="320"><p>Post from '+esc(x[2])+' (@'+esc(x[1])+'), '+esc(x[3])+'.</p><a href="'+esc(x[0])+'">View this post on X</a></blockquote></div>'}).join('');
    box.hidden=false;gate.hidden=true;xNavSync(box);setTimeout(function(){xNavSync(box)},1500);setTimeout(function(){xNavSync(box)},4000);
    if(window.twttr&&twttr.widgets&&twttr.widgets.load){twttr.widgets.load(box);return}
    if(!document.getElementById('x-wjs')){var sc=document.createElement('script');sc.id='x-wjs';sc.async=true;sc.charset='utf-8';sc.src='https://platform.twitter.com/widgets.js';document.body.appendChild(sc)}}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-load-x]');if(b){e.preventDefault();loadX(b);return}
    var a=e.target.closest('[data-xdir]');if(a){var box=document.getElementById(a.getAttribute('aria-controls'));if(!box)return;var c=box.firstElementChild,st=c?c.getBoundingClientRect().width+16:box.clientWidth*.8;
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
  function home(){
    var mem=$('#membership');if(mem){var old=$('.note.center',mem),w=$('.wrap',mem);if(old)old.outerHTML=conceptNotice('plans-cn');else if(w)w.insertAdjacentHTML('beforeend',conceptNotice('plans-cn'));
      if(!$('#waitlist'))mem.insertAdjacentHTML('afterend',waitlistSection());syncWaitlist();
      var tiers=$('.tiers',mem);if(tiers&&stOn())tiers.insertAdjacentHTML('beforebegin',studentBand('home'))}
    var feat=LIBBY[MP.FEATURED]||LIBBY['boulevard-nights-1'];
    $('#heroFeature').innerHTML='<a class="hero-card'+(gated(feat)?' gated':'')+'" href="'+itemHref(feat)+'" data-item="'+feat.id+'">'+poster(feat,{big:1,eager:1})+'<div class="hero-card-b"><span class="meta">'+esc(feat.label)+' · Now streaming</span><h3>'+esc(feat.title)+'</h3><p>'+esc(feat.desc)+'</p></div></a>';
    $('#gameday').innerHTML=gameStrip();startCountdowns();
    $('#railWatch').innerHTML=secHead('Watch',libUrl('watch'),'See all','Official SMU Athletics video')+rail(byCat('watch'));
    $('#railInsider').innerHTML=secHead('Insider',libUrl('insider'),'See all','Features & practice reports')+rail(byCat('insider'));
    $('#railFilm').innerHTML=secHead('Film Room',libUrl('film'),'See all','Breakdowns')+rail(byCat('film'));
    $('#railPods').innerHTML=secHead('Podcasts',libUrl('podcasts'),'See all','Listen')+rail(MP.LIB.filter(function(c){return c.t==='podcast'}));
    var news=byCat('news',8),rd=$('#read');if(news.length&&rd&&!$('#news'))rd.insertAdjacentHTML('afterend','<section class="sec tight" id="news"><div class="wrap">'+secHead('In the news',libUrl('news'),'See all','Real coverage · opens at the source')+rail(news)+'</div></section>');
    var ls=$('#listen');if(ls&&!$('#feeds'))ls.insertAdjacentHTML('afterend',feedsHTML('home'));
    var rsec=$('#recruiting');if(!REC_ON){if(rsec)rsec.hidden=true}else $('#recruitBand').innerHTML=secHead('Recruiting &amp; Portal',ROOT+'recruiting/','Open hub','Visits, offers and the portal')+rail(byCat('recruiting').concat(byCat('portal')))+recruitBand();
    hilltop();
    var hot=MP.THREADS.filter(function(t){return t.hot||t.pin}).slice(0,6);
    $('#boardHot').innerHTML=hot.map(function(t){return threadRow(t,true)}).join('');
    function homeBoards(){var tt=0,tp=0;MP.FORUMS.forEach(function(f){tt+=f.threads;tp+=f.posts});var a=$('#homeThreads'),b=$('#homePosts');if(a)a.textContent=tt.toLocaleString();if(b)b.textContent=tp.toLocaleString();
      $('#boardForums').innerHTML=MP.FORUMS.slice(0,5).map(function(f){return '<a class="forum-mini" href="'+ROOT+'boards/?f='+f.id+'"><span class="fi'+(f.prem?' prem':'')+'">'+(f.prem?LOCK:CHAT)+'</span><span><b>'+f.name+'</b><small>'+f.threads.toLocaleString()+' threads · '+f.posts.toLocaleString()+' posts</small></span>'+(f.prem?'<span class="pill pill-prem">Members</span>':'')+'</a>'}).join('');}
    (SMU.ready||Promise.resolve()).then(function(){return SMU.boardStats?SMU.boardStats():0}).then(homeBoards,homeBoards);
    $('#athRow').innerHTML='<div class="rail rail-ath" role="list">'+MP.ATHLETES.map(function(a){return '<div class="rail-i" role="listitem">'+profileCard(a)+'</div>'}).join('')+'</div>';
    $('#briefHome').innerHTML=briefHTML('briefMain');syncBriefs();
  }

  /* ---------- Library ---------- */
  /* About page (privacy/#about): sources for schedules, rosters and feeds, which used to be footnotes under each section */
  function aboutSources(){var el=$('#srcList');if(!el)return;var L=[],seen={};function add(t,u){if(!u||seen[u])return;seen[u]=1;L.push('<li><a href="'+u+'" target="_blank" rel="noopener">'+esc(t)+'</a></li>')}
    if(SCH&&SCH.source)add(SCH.source[0]+' (record, kickoff times, TV, scores; radio: '+(SCH.radio||'')+')',SCH.source[1]);
    MP.SPORTS.forEach(function(sp){var r=(MP.REAL||{})[sp.slug];if(r&&r.src)r.src.forEach(function(x){add(x[0]+(r.checked?' (checked '+r.checked+')':''),x[1])})});
    el.innerHTML=L.join('')}
  function library(){continueRow();document.addEventListener('mp:history',continueRow);
    var P=new URLSearchParams(location.search),st={cat:P.get('cat')||'all',type:P.get('type')||'all',access:'all',q:P.get('q')||''};
    if(!CATNAME[st.cat])st.cat='all';if(!/^(all|video|article|podcast)$/.test(st.type))st.type='all';if(!/^(all|free|members)$/.test(st.access))st.access='all';
    var chips=$('#libChips'),grid=$('#libGrid'),count=$('#libCount'),q=$('#libQ'),empty=$('#libEmpty');
    chips.innerHTML=MP.CATS.map(function(c){var n=c[0]==='all'?MP.LIB.length:MP.LIB.filter(function(x){return x.cat===c[0]}).length;return '<button type="button" class="chip" data-cat="'+c[0]+'" aria-pressed="false">'+c[1]+'<span>'+n+'</span></button>'}).join('');
    grid.innerHTML=MP.LIB.map(function(c){return cardHTML(c)}).join('');q.value=st.q;
    function apply(push){var toks=st.q.toLowerCase().split(/\s+/).filter(Boolean),n=0;
      $$('.chip',chips).forEach(function(b){b.setAttribute('aria-pressed',b.dataset.cat===st.cat?'true':'false')});
      $$('#libType button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.type===st.type?'true':'false')});
      $$('.mcard',grid).forEach(function(el){var c=LIBBY[el.dataset.item],hay=(c.title+' '+c.desc+' '+c.label).toLowerCase();
        var show=(st.cat==='all'||c.cat===st.cat)&&(st.type==='all'||c.t===st.type)&&(st.access==='all'||(st.access==='free')===!c.lock)&&toks.every(function(t){return hay.indexOf(t)>=0});
        el.hidden=!show;if(show)n++});
      count.textContent=n+' '+(n===1?'title':'titles');$('#libTitle').textContent=st.cat==='all'?'Library':CATNAME[st.cat];
      var active=st.cat!=='all'||st.type!=='all'||st.access!=='all'||st.q;$('#libClear').hidden=!active;
      empty.hidden=n>0;if(!n)empty.innerHTML=emptyState('filter','Nothing matches those filters','Try a different category or format, or clear the filters to see all '+MP.LIB.length+' titles.','<button type="button" class="btn btn-navy btn-sm" data-lib-clear>Clear filters</button>');
      if(push){var u=new URLSearchParams();['cat','type','access'].forEach(function(k){if(st[k]!=='all')u.set(k,st[k])});if(st.q)u.set('q',st.q);var s=u.toString();history.replaceState(null,'',location.pathname+(s?'?'+s:''))}}
    function clear(){st={cat:'all',type:'all',access:'all',q:''};q.value='';apply(true)}
    chips.addEventListener('click',function(e){var b=e.target.closest('.chip');if(b){st.cat=b.dataset.cat;apply(true)}});
    $('#libType').addEventListener('click',function(e){var b=e.target.closest('button');if(b){st.type=b.dataset.type;apply(true)}});
    q.addEventListener('input',function(){st.q=q.value.trim();apply(true)});
    document.addEventListener('click',function(e){if(e.target.closest('[data-lib-clear],#libClear'))clear()});
    apply(false);
  }

  /* ---------- Recruiting hub ---------- */
  function composite(v){var h=0,s=v[0];for(var i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%997;return (0.80+v[4]*0.03+h/997*0.029).toFixed(4)}
  function recruiting(){
    if(!REC_ON){var mn=$('main');document.title='Recruiting is paused | SMU+';if(mn)mn.innerHTML='<section class="page-hero"><div class="wrap"><p class="eyebrow">SMU+</p><h1 class="display">This section is paused</h1><p class="lede on-dark">Recruiting coverage is off for now.</p><p class="nf-act"><a class="btn btn-red" href="'+(ROOT||'./')+'">Go to the home page</a> <a class="btn btn-ghost" href="'+ROOT+'boards/">The Mustang Board</a></p></div></section>';return}
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

  /* ---------- Boards ---------- */
  function boards(){
    var params=new URLSearchParams(location.search),state={f:params.get('f')||'all',sport:params.get('sport')||'',sort:'hot',q:''};
    var member=isMember(),listView=$('#listView'),threadView=$('#threadView');
    function lastIn(f){var l=MP.THREADS.filter(function(t){return t.f===f.id});return l[0]}
    var groups=['Premium','Community'];
    function renderIndex(){if(!SMU.live)SMU.boardStats();
      var tt=0,tp=0;MP.FORUMS.forEach(function(f){tt+=f.threads;tp+=f.posts});[['#statBoards',MP.FORUMS.length],['#statThreads',tt],['#statPosts',tp]].forEach(function(x){var el=$(x[0]);if(el)el.textContent=x[1].toLocaleString()});
      $('#forumIndex').innerHTML=groups.map(function(g){return '<div class="fgroup"><div class="fgroup-h"><h3>'+g+(g==='Premium'?' <span class="pill pill-prem">'+LOCK+'Members</span>':'')+'</h3><span class="num">Threads</span><span class="num">Posts</span><span class="f-last-h">Last post</span></div>'+
      MP.FORUMS.filter(function(f){return f.group===g}).map(function(f){var t=lastIn(f);
        return '<button class="frow" data-f="'+f.id+'"><span class="fi'+(f.prem?' prem':'')+'">'+(f.prem?LOCK:CHAT)+'</span><span class="frow-main"><b>'+f.name+'</b><small>'+f.desc+'</small></span>'+
        '<span class="num">'+f.threads.toLocaleString()+'</span><span class="num">'+f.posts.toLocaleString()+'</span>'+
        '<span class="f-last">'+(t?'<b>'+esc(t.title)+'</b><small>'+esc(MP.USERS[lastBy(t)].n)+' · '+lastAgo(t)+' ago</small>':'<small>No posts yet</small>')+'</span></button>'}).join('')+'</div>'}).join('')+
      '<div class="fgroup"><div class="fgroup-h"><h3>Team boards</h3><span class="f-last-h">12 programs</span></div><div class="team-boards">'+
      MP.SPORTS.map(function(s){var n=((MP.SPORT_STATS||{})[s.slug]||{}).threads||0;return '<button class="tb" data-sport="'+s.slug+'">'+sportIcon(s.slug)+'<b>'+s.name+'</b><small>'+(n?n.toLocaleString()+(n===1?' thread':' threads'):'No threads yet')+'</small></button>'}).join('')+'</div></div>'}
    renderIndex();
    var sel=$('#sportFilter');sel.innerHTML='<option value="">All sports</option>'+MP.SPORTS.map(function(s){return '<option value="'+s.slug+'">'+s.name+'</option>'}).join('');sel.value=state.sport;
    sel.addEventListener('change',function(){state.sport=sel.value;renderList()});
    var fsel=$('#forumFilter');fsel.innerHTML='<option value="all">All boards</option>'+MP.FORUMS.map(function(f){return '<option value="'+f.id+'">'+f.name+'</option>'}).join('');fsel.value=state.f;
    fsel.addEventListener('change',function(){state.f=fsel.value;renderList()});
    $('#forumIndex').addEventListener('click',function(e){var b=e.target.closest('[data-f],[data-sport]');if(!b)return;
      if(b.dataset.f){state.f=b.dataset.f;state.sport=''}else{state.sport=b.dataset.sport;state.f='all'}
      fsel.value=state.f;sel.value=state.sport;renderList();$('#threadList').scrollIntoView({behavior:'smooth',block:'start'})});
    $$('.sort button').forEach(function(b){b.addEventListener('click',function(){state.sort=b.dataset.sort;renderList()})});
    var tq=$('#threadQ');tq.addEventListener('input',function(){state.q=tq.value.trim().toLowerCase();renderList()});
    function clearAll(){state.f='all';state.sport='';state.q='';tq.value='';fsel.value='all';sel.value='';renderList()}
    $('#boardClear').addEventListener('click',clearAll);
    $('#threadRows').addEventListener('click',function(e){if(e.target.closest('[data-board-clear]'))clearAll()});
    document.addEventListener('mp:member',function(){member=isMember();var m=location.hash.match(/^#t(\d+)$/);if(m)renderThread(+m[1])});
    function renderList(){
      $$('.sort button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.sort===state.sort)});
      var list=MP.THREADS.filter(function(t){return (state.f==='all'||t.f===state.f)&&(!state.sport||t.sport===state.sport)&&(!state.q||(t.title+' '+t.posts.map(function(p){return p[1]}).join(' ')).toLowerCase().indexOf(state.q)>=0)});
      $('#boardClear').hidden=!(state.f!=='all'||state.sport||state.q);
      if(state.sort==='hot')list.sort(function(a,b){return (b.pin?1:0)-(a.pin?1:0)||(b.replies||0)-(a.replies||0)});else list.sort(function(a,b){return (b.pin?1:0)-(a.pin?1:0)||(b.id-a.id)});
      var f=forumBy(state.f),s=sportBy(state.sport);$('#listTitle').textContent=(f?f.name:'All threads')+(s?' · '+s.name:'');
      $('#threadRows').innerHTML=list.length?list.map(function(t){return threadRow(t)}).join(''):(state.q?emptyState('search','No threads match \u201c'+esc(tq.value.trim())+'\u201d','Try fewer words, or clear the filters and browse every board.','<button type="button" class="btn btn-navy btn-sm" data-board-clear>Clear filters</button>'):emptyState('chat','Quiet in here so far','No threads on this board yet. Start the first one, or clear the filters to see everything.','<button type="button" class="btn btn-red btn-sm" data-compose>Start a thread</button><button type="button" class="btn btn-outline btn-sm" data-board-clear>Clear filters</button>'));
    }
    function renderThread(id){
      var t=null;MP.THREADS.forEach(function(x){if(x.id===id)t=x});if(!t){location.hash='';return}
      var f=forumBy(t.f),s=t.sport&&sportBy(t.sport),locked=f.prem&&!member,n=t.posts.length;
      var times=t.posts.map(function(p,i){if(p[3])return SMU.ago(p[3])+' ago';if(!i)return t.ago+' ago';var m={m:1,h:60,d:1440,w:10080},x=t.ago.match(/(\d+)(\w)/),tot=x?(+x[1])*(m[x[2]]||1):60,v=Math.max(1,Math.round(tot*(1-i/(n+1))));return (v<60?v+'m':v<1440?Math.round(v/60)+'h':Math.round(v/1440)+'d')+' ago'});
      /* Post counts only when every post is loaded; signed-out live visitors can't see members-only posts, so a count would be short. */
      var allPosts=!SMU.live||paidT(SMU.tier());
      var postHTML=t.posts.map(function(p,i){var u=MP.USERS[p[0]],q=p[2]!=null?t.posts[p[2]]:null,pc=allPosts?postsBy(p[0]):null;
        return '<article class="post'+(i===0?' op':'')+'" id="p'+(i+1)+'"><aside class="post-user">'+avatar(p[0],true)+'<div><b>'+esc(u.n)+'</b>'+(u.staff?'<span class="badge-ins">Insider</span>':'<span class="badge-tier">'+esc(u.tier)+'</span>')+'<small>Joined '+u.since+(pc==null?'':' · '+pc.toLocaleString()+(pc===1?' post':' posts')+' here')+'</small></div></aside>'+
          '<div class="post-body"><div class="post-h"><span>'+times[i]+'</span><a href="#t'+t.id+'" class="post-n">#'+(i+1)+'</a></div>'+
          (q?'<blockquote><b>'+esc(MP.USERS[q[0]].n)+' said:</b> '+esc(q[1].length>140?q[1].slice(0,140)+'…':q[1])+'</blockquote>':'')+
          '<p>'+esc(p[1])+'</p><div class="post-f"><button type="button" data-demo="Like this post">♥ Like</button><button type="button" data-quote="'+i+'">Quote</button><button type="button" data-reply>Reply</button><button type="button" class="rep" data-report="'+i+'" aria-label="Report post #'+(i+1)+'"'+(SMU.reported&&SMU.reported(t.id,i)?' data-done="1"':'')+'>'+(SMU.reported&&SMU.reported(t.id,i)?'Reported':'Report')+'</button>'+(avPhoto(u)?'<button type="button" data-demo="Report profile photo" class="rep-ph" aria-label="Report '+esc(u.n)+'\u2019s profile photo">Report photo</button>':'')+'</div></div></article>'});
      var shown=locked?postHTML[0]+'<div class="gate">'+postHTML.slice(1,3).join('')+'<div class="gate-cta"><div>'+LOCK+'<h4>Members-only board</h4><p>'+(t.replies?nReplies(t)+(t.replies===1?' reply':' replies')+' in ':'This thread is in ')+esc(f.name)+'. Join any plan to read and post.</p><a class="btn btn-red" href="'+ROOT+'#membership">See plans</a> <button class="btn btn-outline" id="asMember">Preview as member</button></div></div></div>':postHTML.join('');
      threadView.innerHTML='<nav class="crumbs"><a href="#">Boards</a> › <a href="?f='+f.id+'" data-f-link="'+f.id+'">'+esc(f.name)+'</a>'+(s?' › <span>'+esc(s.name)+'</span>':'')+'</nav>'+
        '<div class="tv-head"><div class="pills">'+pills(t)+'</div><h1 class="tv-title">'+esc(t.title)+'</h1><p class="t-meta">Started by <b>'+esc(MP.USERS[t.by].n)+'</b> · '+t.ago+' ago'+(t.replies==null?'':' · '+nReplies(t)+(t.replies===1?' reply':' replies'))+(t.views?' · '+t.views+' views':'')+'</p></div>'+
        '<div class="pager"><span>Page 1 of '+Math.max(1,Math.ceil((t.replies||0)/20))+'</span><div><button class="btn btn-outline btn-sm" data-demo="Watch thread">Watch</button><button type="button" class="btn btn-red btn-sm" data-reply>Reply</button></div></div>'+
        '<div class="posts">'+shown+'</div>'+
        (locked?'':replyBox(t))+
        (member&&f.prem?'<p class="note">Viewing as a member (demo). <button class="linkish" id="asGuest">Switch back to guest view</button></p>':'')+
        '';
      var am=$('#asMember');if(am)am.addEventListener('click',function(){setMember(true)});
      if(watching.id!==t.id){watching.off();var u1=SMU.watch(t.id),u2=SMU.on('post:'+t.id,function(){setTimeout(function(){document.dispatchEvent(new CustomEvent('smu:post',{detail:t.id}))},0)});
        watching={id:t.id,off:function(){u1();u2()}}}
      var ag=$('#asGuest');if(ag)ag.addEventListener('click',function(){setMember(false)});
    }
    var watching={id:null,off:function(){}};
    function replyBox(t){if(!SMU.user)return '<div class="reply reply-out"><p><b>Join the conversation.</b> Sign in to reply'+(SMU.live?'':' (demo accounts are saved in this browser)')+'. Please read the <a href="'+ROOT+'rules/">community rules</a> first.</p><button type="button" class="btn btn-red btn-sm" data-auth>Sign in to reply</button></div>';
      var me=SMU.me();return '<form class="reply" id="replyForm" data-thread="'+t.id+'" novalidate>'+avatar(me)+'<div class="reply-main"><p class="reply-q" id="replyQ" hidden></p><label class="sr" for="replyText">Write a reply</label><textarea id="replyText" rows="2" maxlength="5000" placeholder="Write a reply…" required></textarea><p class="reply-m" id="replyM" aria-live="polite"></p><p class="reply-rules">Keep it civil: <a href="'+ROOT+'rules/">community rules</a></p></div><button class="btn btn-red btn-sm" type="submit">Post</button></form>'}
    var quoteIdx=null;
    threadView.addEventListener('click',function(e){var qb=e.target.closest('[data-quote]'),rb=e.target.closest('[data-reply]');if(!qb&&!rb)return;
      var ta=$('#replyText');if(!ta){var a=$('[data-auth]',threadView);if(a)a.click();return}
      if(qb){quoteIdx=+qb.dataset.quote;var m=location.hash.match(/^#t(\d+)$/),t=m&&MP.THREADS.filter(function(x){return x.id===+m[1]})[0],p=t&&t.posts[quoteIdx];
        var rq=$('#replyQ');if(p){rq.hidden=false;rq.innerHTML='Quoting <b>'+esc(MP.USERS[p[0]]?MP.USERS[p[0]].n:'a member')+'</b> <button type="button" class="linkish" id="unquote">Remove quote</button>'}}
      ta.scrollIntoView({block:'center',behavior:'smooth'});ta.focus()});
    threadView.addEventListener('click',function(e){if(e.target.id==='unquote'){quoteIdx=null;var rq=$('#replyQ');rq.hidden=true;rq.innerHTML='';$('#replyText').focus()}});
    threadView.addEventListener('submit',function(e){var f=e.target;if(f.id!=='replyForm')return;e.preventDefault();var ta=$('#replyText'),m=$('#replyM'),v=ta.value.trim(),tid=+f.dataset.thread;
      if(v.length<2){m.textContent='Write a little more before posting.';ta.focus();return}
      var b=$('button[type=submit]',f);b.disabled=true;m.textContent='Posting…';
      SMU.reply(tid,v,quoteIdx).then(function(){quoteIdx=null;renderThread(tid);var posts=$$('.post',threadView);var last=posts[posts.length-1];if(last){last.classList.add('post-new');last.scrollIntoView({block:'center'})}toast('Reply posted.')},
        function(err){m.textContent=err.message||'Could not post. Try again.';b.disabled=false})});
    SMU.on('auth',function(){var m=location.hash.match(/^#t(\d+)$/);if(m)renderThread(+m[1])});
    SMU.on('avatar',function(){var m=location.hash.match(/^#t(\d+)$/);if(m)renderThread(+m[1]);else if(!listView.hidden)renderList()});
    SMU.on('threads',function(){renderIndex();if(!listView.hidden)renderList()});
    document.addEventListener('smu:post',function(ev){var m=location.hash.match(/^#t(\d+)$/);if(!m||+m[1]!==ev.detail)return;var ta=$('#replyText'),draft=ta?ta.value:'';renderThread(+m[1]);var t2=$('#replyText');if(t2&&draft){t2.value=draft}});
    function route(){var m=location.hash.match(/^#t(\d+)$/);
      if(m){renderList();listView.hidden=true;threadView.hidden=false;renderThread(+m[1]);window.scrollTo(0,0)}
      else if(!/^#(article|watch)=/.test(location.hash)){threadView.hidden=true;listView.hidden=false;renderList()}}
    window.addEventListener('hashchange',route);route();
    SMU.ready.then(function(){if(!SMU.live)return;$('#threadRows').setAttribute('aria-busy','true');
      return Promise.all([SMU.loadThreads(),SMU.boardStats()]).then(function(){renderIndex();route()},function(){/* keep the sample boards on screen; the toast explains */}).then(function(){$('#threadRows').removeAttribute('aria-busy')})});
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
  function realConf(R){var c=R.rec['']&&R.rec[''][1];return c&&!/^0-0(-0)?$/.test(c)?c+' ACC':''}
  function realSched(R,team){var t=todayISO(),multi=Object.keys(R.rec).length>1,ev=R.events,
      past=ev.filter(function(e){return (e.d2||e.d)<t||e.res}),firstUp=past.length,
      lo=Math.max(0,firstUp-5),hi=Math.min(ev.length,firstUp+8),hidden=ev.length-(hi-lo);
    var rows=ev.map(function(e,i){var name=(team&&e.ha!=='neutral'?(e.ha==='home'?'vs. ':'at '):'')+e.name+(e.ex?' (exh.)':''),
        who=multi&&TEAM_LBL[e.team]?'<span class="r-team">'+TEAM_LBL[e.team]+'</span>':'',
        tv=[e.time,e.tv].filter(Boolean).join(' · ');
      return '<tr'+(i<lo||i>=hi?' class="r-more" hidden':'')+(i===firstUp?' class="r-next"':'')+'><td>'+rRange(e)+'</td><td>'+who+esc(name)+(e.recap?' <a class="r-recap" href="'+e.recap+'" target="_blank" rel="noopener">Recap<span class="sr"> (opens SMU Athletics)</span></a>':'')+'</td><td>'+esc(e.where||'')+'</td><td>'+esc(tv||'TBA')+'</td><td>'+esc(e.res||'\u2014')+'</td></tr>'}).join('');
    return '<div class="tbl-wrap"><table class="tbl sched sched-real"><thead><tr><th>Date</th><th>'+(team?'Opponent':'Event')+'</th><th>Site</th><th>Time / TV</th><th>Result</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
      (hidden>0?'<button type="button" class="btn btn-outline btn-sm r-toggle" data-r-toggle aria-expanded="false">Show full schedule ('+ev.length+')</button>':'')+
      ''}
  function realRoster(R,s){var multi=Object.keys(R.rec).length>1,SHOW=12;
    var cards=R.roster.map(function(a,i){return rosterCard(a,i,s,{more:i>=SHOW,team:multi&&TEAM_LBL[a.team]?TEAM_LBL[a.team]:''})}).join('');
    return '<div class="roster">'+cards+'</div>'+(R.roster.length>SHOW?'<button type="button" class="btn btn-outline btn-sm r-toggle" data-r-toggle aria-expanded="false">Show full roster ('+R.roster.length+')</button>':'')+
      '<div class="coach-row">'+R.coaches.map(function(c){return '<div class="coach"><span class="av lg staff">'+esc(c.name.replace(/^'/,'').split(' ').slice(-1)[0].charAt(0))+'</span><div><b>'+esc(c.name)+'</b><small>'+esc(c.title)+(multi&&TEAM_LBL[c.team]?' · '+TEAM_LBL[c.team]:'')+'</small></div></div>'}).join('')+'</div>'+
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
    var realLog=s.slug==='football'&&SCH?SCH.games:null,record=realLog?SCH.record:RS?RS.dd:s.record,HERO_PH={football:'runout','mens-basketball':'mbb-jumper','mens-soccer':'msoc',volleyball:'vb-spike','swimming-diving':'swim','womens-basketball':'wbb-drive','womens-soccer':'wsoc',golf:'golf',tennis:'tennis','track-field':'track',rowing:'rowing',equestrian:'equestrian'}[s.slug];
    var content=((MP.ACCESS&&MP.ACCESS[s.slug])||[]).map(function(x){return typeof x==='string'?LIBBY[x]:x}).filter(Boolean).filter(recOK);
    content.forEach(function(c){LIBBY[c.id]=LIBBY[c.id]||c});
    var threads=MP.THREADS.filter(function(t){return t.sport===s.slug}),others=MP.SPORTS.filter(function(x){return x.slug!==s.slug});
    var profs=(MP.ATHLETES||[]).filter(function(a){return a.sport===s.slug});
    var RDR=RD||(s.slug==='football'&&MP.REAL&&MP.REAL.football)||null; /* roster block: football's real roster lives in MP.REAL.football */
    main.innerHTML=
      '<section class="page-hero'+(HERO_PH?' has-photo':'')+'">'+(HERO_PH?photoBg(HERO_PH,{eager:1,hero:1}):'')+'<div class="wrap">'+
        '<nav class="crumbs"><a href="'+ROOT+'#sports">Sports</a> › <span>'+s.name+'</span></nav>'+
        '<div class="ph-row"><span class="sp-ic">'+sportIcon(s.slug)+'</span><div><p class="eyebrow">'+(RD?esc(RD.season)+' season'+(realConf(RD)?' · '+realConf(RD):''):s.season+' sport · '+s.conf)+'</p><h1 class="display">'+s.name+'</h1></div></div>'+
        '<p class="lede on-dark">'+s.blurb+' <strong>40% to SMU\u2019s official NIL programs (proposed).</strong></p>'+
        '<dl class="statbar"><div><dt>'+(RS?RS.dt:'Record')+(realLog||RD?'':' <span>sample</span>')+'</dt><dd>'+esc(record)+'</dd>'+(RS&&RS.sub?'<small class="sb-sub">'+esc(RS.sub)+'</small>':'')+'</div><div><dt>Members following <span>sample</span></dt><dd>'+s.members.toLocaleString()+'</dd></div><div><dt>'+(RDR?'On the roster':'Athletes featured')+'</dt><dd>'+(RDR?'<a href="'+((RDR.src.filter(function(x){return /roster/.test(x[1])})[0]||[])[1]||'#roster')+'" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;min-height:44px;color:inherit" aria-label="'+RDR.roster.length+' players on the official SMU Athletics roster (opens in a new tab)">'+RDR.roster.length+'</a>':roster.length)+'</dd></div></dl>'+
        '<div class="ctas"><a href="'+ROOT+'#membership" class="btn btn-red">Join SMU+</a><a href="#board" class="btn btn-ghost">Team board</a></div>'+
      '</div></section>'+
      '<nav class="jump" aria-label="On this page"><div class="wrap">'+(realLog?'<a href="#gameday">Game day</a>':'')+'<a href="#roster">Roster</a><a href="#schedule">Schedule</a><a href="#content">Watch &amp; Read</a>'+(thirdFor(s.slug).length?'<a href="#media">Media</a>':'')+(FEEDS.posts[s.slug]?'<a href="#feeds">Feeds</a>':'')+'<a href="#board">Board</a><a href="#more">Other sports</a></div></nav>'+
      (realLog?'<section class="gameday" aria-label="Game day"><div class="wrap" id="gameday">'+gameStrip()+'</div></section>':'')+'<section class="sec" id="roster"><div class="wrap">'+
        (profs.length?secHead('Player profiles',ROOT+'athletes/','All profiles','Real public stats')+'<div class="pgrid">'+profs.map(profileCard).join('')+'</div><div class="gap"></div>':'')+
        (RDR?secHead('Roster',null,null,'Real '+esc(RDR.season)+' roster')+'<p class="lede">The full '+esc(s.name.toLowerCase())+' roster from SMU Athletics. Tap a player for the official bio.</p>'+realRoster(RDR,s):'')+
      '</div></section>'+
      '<section class="sec alt" id="schedule"><div class="wrap">'+secHead((teamSport?'Schedule':s.slug==='golf'||s.slug==='tennis'?'Events':'Meets')+' &amp; results',null,null,realLog?'2026 season · real results':RD?esc(RD.season)+' · real schedule':'2026–27 · sample data')+
        (RD?realSched(RD,teamSport):realLog?table({cols:['Date','Opponent','Site','Kickoff','TV','Result'],rows:realLog.map(function(g){return [gDate(g),(g.home?'vs. ':'at ')+g.opp,g.site,gTime(g),g.tv||'TBA',g.res||'\u2014']})},{cls:'sched sched-full'}):
        table({cols:['Date',teamSport?'Opponent':'Event','Site','Result'],rows:games.map(function(g){return [mo[g.d.getMonth()]+' '+g.d.getDate(),(teamSport?(g.home?'vs. ':'at '):'')+g.o,g.home?'Home · Dallas':'Away',g.res]})},{cls:'sched'})+
        '<p class="note">Sample schedule with fictional opponents.</p>')+'</div></section>'+
      '<section class="sec" id="content"><div class="wrap">'+secHead(s.name+' all access',libUrl(),'Library','Only on SMU+')+'<div class="cgrid">'+content.map(cardHTML).join('')+'</div></div></section>'+
      mediaSection(s.slug,s.name)+feedsHTML(s.slug)+
      '<section class="sec alt" id="board"><div class="wrap">'+secHead('Team board',ROOT+'boards/?sport='+s.slug,'Open board','Talk '+s.name)+
        '<div class="box">'+(threads.length?threads.map(function(t){return threadRow(t,true)}).join(''):emptyState('chat','No '+esc(s.name)+' threads yet','Be the first to start the conversation on this board.','<button type="button" class="btn btn-red btn-sm" data-compose data-sport="'+s.slug+'">Start a thread</button><a class="btn btn-outline btn-sm" href="'+ROOT+'boards/">Browse all boards</a>'))+'</div></div></section>'+
      '<section class="sec" id="more"><div class="wrap">'+secHead('More Mustang sports',ROOT+'#sports','All sports')+
        '<div class="chips">'+others.map(function(o){return '<a class="chip" href="'+sportUrl(o.slug)+'">'+o.name+'</a>'}).join('')+'</div>'+
        '<div class="band"><div><h2 class="sec-t">Never miss '+s.name+'.</h2><p>Plans from $9.99/mo. 40% to SMU\u2019s official NIL programs (proposed).</p></div><a href="'+ROOT+'#membership" class="btn btn-white">See plans</a></div></div></section>';
    $$('.sched td:last-child').forEach(function(td){var v=td.textContent;td.innerHTML='<span class="res '+(/^W|^1st|^2nd/.test(v)?'w':/^L/.test(v)?'l':/^T|^\d/.test(v)&&!/PM|TBA/.test(v)?'t':'up')+'">'+esc(v)+'</span>'});
    if(realLog)startCountdowns();
  }

  /* ---------- Athletes ---------- */
  /* ---------- Athletes comparison (real data from the profiles) ---------- */
  var CMP=[['PASS YDS','Pass yds'],['PASS TD','Pass TD'],['RUSH YDS','Rush yds'],['RUSH TD','Rush TD'],['REC','Rec'],['REC YDS','Rec yds'],['REC TD','Rec TD'],['TKL','Tackles'],['TFL','TFL'],['INT','Def. INT']];
  function compareHTML(){var pos={};MP.ATHLETES.forEach(function(a){a.pos.split('/').forEach(function(p){pos[p]=1})});
    var rows=MP.ATHLETES.map(function(a){var m={};a.season.stats.forEach(function(x){m[x[0]]=x[1]});var def=/^(S|LB|CB|DL|DE|DT)$/.test(a.pos);
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
      $$('tbody tr',t).forEach(function(r){var show=!p||r.dataset.pos.split('/').indexOf(p)>=0;r.hidden=!show;if(show)n++});$('#cmpCount').textContent=n+' of '+MP.ATHLETES.length+' players'}
    $('#cmpPos').addEventListener('click',function(e){var b=e.target.closest('.chip');if(b)apply(b.dataset.pos)});apply('')}

  function athlete(){
    var main=$('#athleteMain'),id=new URLSearchParams(location.search).get('id'),a=MP.athleteBy&&MP.athleteBy(id);
    if(!a){document.title='Football Player Profiles | SMU+';
      main.innerHTML='<section class="page-hero compact"><div class="wrap"><p class="eyebrow">Football · real players · public stats</p><h1 class="display">Football player profiles</h1><p class="lede on-dark">Current SMU football players. Every stat and bio fact on these pages comes from a public source linked on the profile. Profiles for other sports are not built yet.</p></div></section>'+
        '<section class="sec"><div class="wrap"><div class="pgrid three">'+MP.ATHLETES.map(profileCard).join('')+'</div></div></section>'+
        '<section class="sec alt"><div class="wrap">'+compareHTML()+'</div></section>';initCompare();return}
    var s=sportBy(a.sport),R=a.recruit,ext=' target="_blank" rel="noopener"',ARROW='<span aria-hidden="true"> ↗</span>';document.title=a.name+' · '+a.pos+' · SMU Football | SMU+';
    var others=MP.ATHLETES.filter(function(x){return x.id!==a.id});
    var hero=a.photo?'<figure class="pf-photo has-photo">'+photo(a.photo,{eager:1})+CREDIT+'</figure>':
      '<div class="pf-photo" style="background:'+KIT_BG[a.kit]+'" role="img" aria-label="Photo placeholder, jersey number '+a.num+'">'+kit(a.num,a.kit)+'<span>Photo placeholder</span></div>';
    var vit=[['HT / WT',a.ht+' / '+a.wt],['Class',a.cls],['Hometown',a.hometown],['High school / prev.',a.prev]];
    var recruitPanel=R?'<section class="panel" id="path"><div class="panel-h"><h3>Path to SMU</h3><span class="meta">Per SMU Athletics</span></div>'+
        '<dl class="pf-pre"><div><dt>High school</dt><dd>'+esc(R.hs)+'</dd></div><div><dt>Hometown</dt><dd>'+esc(R.town)+'</dd></div></dl>'+
        '<ol class="pf-path">'+R.path.map(function(p){return '<li><b>'+esc(p[0])+'</b><span>'+esc(p[1])+'</span>'+(p[2]?'<small>'+esc(p[2])+'</small>':'')+'</li>'}).join('')+'</ol>'+
        '</section>':'';
    var seen={},srcs=a.src.concat(R?R.src:[]).filter(function(x){var k=x[1].replace(/\/$/,'');if(seen[k])return false;seen[k]=1;return true});
    main.innerHTML=
      '<section class="pf-hero"><div class="wrap">'+
        '<nav class="crumbs pf-crumbs"><a href="'+ROOT+'athletes/">Football profiles</a> › <a href="'+sportUrl(a.sport)+'">'+s.name+'</a> › <span>'+esc(a.name)+'</span></nav>'+
        '<div class="pf-top">'+hero+
          '<div class="pf-id"><p class="pf-num" aria-label="Jersey number '+a.num+', '+a.pos+'"><b>#'+a.num+'</b><span>'+a.pos+'</span></p><h1 class="display"><span>'+esc(a.first)+'</span> '+esc(a.last)+'</h1>'+
            '<p class="pf-sub">SMU Mustangs · '+s.name+'</p>'+
            '<dl class="pf-vit">'+vit.map(function(m){return '<div><dt>'+m[0]+'</dt><dd>'+esc(m[1])+'</dd></div>'}).join('')+'</dl>'+
            '<div class="ctas"><button type="button" class="btn btn-red btn-sm save-ath" data-save-athlete="'+a.id+'" aria-pressed="false">'+HEART+'<span>Save player</span></button><a class="btn btn-ghost btn-sm" href="#stats">Stats</a></div></div>'+
          (R?'<a class="pf-card" href="#path"><p class="pf-k">Path to SMU</p><ol class="pf-mini">'+R.path.map(function(p){return '<li><b>'+esc(p[1].split(/[;,(]/)[0].trim())+'</b><small>'+esc(p[2])+'</small></li>'}).join('')+'</ol><p class="pf-cs">'+esc(R.hs)+' · '+esc(R.town)+'</p></a>':'')+
        '</div></div></section>'+
      '<nav class="jump" aria-label="Profile sections"><div class="wrap"><a href="#overview">Overview</a><a href="#stats">Stats</a><a href="#gamelog">Game log</a>'+(R?'<a href="#path">Path to SMU</a>':'')+(a.gallery&&a.gallery.length?'<a href="#photos">Photos</a>':'')+'<a href="#sources">Sources</a></div></nav>'+
      '<div class="wrap ap-body"><div class="ap-grid"><div class="ap-main">'+
        '<section class="panel" id="overview"><div class="panel-h"><h3>'+a.season.label+'</h3></div><div class="statline" style="--n:'+a.season.stats.length+'">'+a.season.stats.map(function(x){return '<div><b>'+esc(x[1])+'</b><small>'+x[0]+'</small></div>'}).join('')+'</div></section>'+
        '<section class="panel" id="stats"><div class="panel-h"><h3>Career stats by season</h3><span class="meta">* 2026 in progress</span></div>'+table(a.career,{caption:'Career stats'})+'</section>'+
        '<section class="panel" id="gamelog"><div class="panel-h"><h3>'+a.log.label+'</h3></div>'+table(a.log,{cls:'log',caption:'Game log'})+'</section>'+
        recruitPanel+
        (a.gallery&&a.gallery.length?'<section class="panel" id="photos"><div class="panel-h"><h3>Photos</h3><span class="meta">Photo: SMU Athletics</span></div><div class="gallery g'+a.gallery.length+'">'+a.gallery.map(function(k){return '<figure>'+photo(k,{small:1})+CREDIT+'</figure>'}).join('')+'</div></section>':'')+
      '</div><aside class="ap-side">'+
        '<section class="panel"><div class="panel-h"><h3>About</h3></div><p>'+esc(a.blurb)+'</p>'+(a.honors.length?'<ul class="honors">'+a.honors.map(function(h){return '<li>'+esc(h)+'</li>'}).join('')+'</ul>':'')+'</section>'+
        '<section class="panel" id="news"><div class="panel-h"><h3>Career milestones</h3></div><ul class="news">'+a.news.map(function(n){return '<li>'+esc(n)+'</li>'}).join('')+'</ul></section>'+
        '<section class="panel"><div class="panel-h"><h3>More profiles</h3></div><div class="mini">'+others.map(function(o){return '<a href="'+athleteUrl(o.id)+'"><b>#'+o.num+'</b><span>'+esc(o.name)+'</span><small>'+o.pos+'</small></a>'}).join('')+'</div></section>'+
      '</aside></div>'+
      '<section class="sources pf-src" id="sources"><h3>Sources &amp; credits</h3><p>Bio, measurements and stats checked Oct. 25, 2026; school path from SMU Athletics bios, checked Oct. 26, 2026. SMU+ shows no recruiting ratings or rankings. ESPN lists defensive stats as unofficial.'+(R?' Path to SMU is as stated on his SMU Athletics bio.':'')+(a.notes?' '+esc(a.notes):'')+'</p>'+
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
  function authForm(mode,ctx){mode=mode||'in';var demo=!SMU.live;
    return '<div class="auth" data-mode="'+mode+'">'+(ctx?'<p class="auth-ctx">'+esc(ctx)+'</p>':'')+
      '<div class="auth-tabs" role="tablist"><button type="button" role="tab" data-auth-tab="in" aria-selected="'+(mode==='in')+'">Sign in</button><button type="button" role="tab" data-auth-tab="up" aria-selected="'+(mode==='up')+'">Create account</button><button type="button" role="tab" data-auth-tab="link" aria-selected="'+(mode==='link')+'">Email me a link</button></div>'+
      '<form class="auth-f" novalidate>'+
        '<div class="fld f-name"><label for="auName">Display name</label><input id="auName" name="name" autocomplete="nickname" maxlength="40" placeholder="How you appear on the boards"></div>'+
        '<div class="fld"><label for="auEmail">Email</label><input id="auEmail" name="email" type="email" autocomplete="email" required placeholder="you@example.com"></div>'+
        '<div class="fld f-pw"><label for="auPw">Password'+(demo?' <small>(not stored in demo mode)</small>':'')+'</label><input id="auPw" name="password" type="password" autocomplete="current-password" minlength="8" placeholder="At least 8 characters"'+(demo?'':' required')+'></div>'+
        '<p class="auth-m" aria-live="polite"></p>'+
        '<button class="btn btn-red auth-go" type="submit">Sign in</button>'+
        (SMU.live?'<button type="button" class="linkish auth-forgot">Forgot password?</button>':'')+
      '</form>'+modeNote()+'</div>'}
  function syncAuthForm(root){var a=$('.auth',root),m=a.dataset.mode;$$('[data-auth-tab]',a).forEach(function(b){b.setAttribute('aria-selected',String(b.dataset.authTab===m))});
    $('.f-name',a).hidden=m!=='up';$('.f-pw',a).hidden=m==='link';var pw=$('#auPw',a);pw.setAttribute('autocomplete',m==='up'?'new-password':'current-password');
    $('.auth-go',a).textContent=m==='up'?'Create account':m==='link'?(SMU.live?'Email me a sign-in link':'Sign in with email'):'Sign in';$('.auth-m',a).textContent='';var fg=$('.auth-forgot',a);if(fg)fg.hidden=m!=='in'}
  function wireAuth(root,done){syncAuthForm(root);
    root.addEventListener('click',function(e){var t=e.target.closest('[data-auth-tab]');if(t){$('.auth',root).dataset.mode=t.dataset.authTab;syncAuthForm(root);$('#auEmail',root).focus()}
      if(e.target.closest('.auth-forgot')){var em=$('#auEmail',root).value.trim(),m=$('.auth-m',root);if(!EMAIL_RE.test(em)){m.textContent='Enter your email above first, then tap Forgot password.';return}
        SMU.reset(em).then(function(){m.textContent='Check '+em+' for a reset link.'},function(err){m.textContent=err.message})}});
    $('.auth-f',root).addEventListener('submit',function(e){e.preventDefault();var a=$('.auth',root),mode=a.dataset.mode,m=$('.auth-m',root),btn=$('.auth-go',root);
      var em=$('#auEmail',root).value.trim(),pw=$('#auPw',root).value,nm=$('#auName',root).value.trim();
      if(!EMAIL_RE.test(em)){m.textContent='Enter a full email address.';$('#auEmail',root).focus();return}
      if(mode!=='link'&&SMU.live&&pw.length<8){m.textContent='Passwords are at least 8 characters.';$('#auPw',root).focus();return}
      btn.disabled=true;m.textContent=mode==='link'?'Sending\u2026':'One moment\u2026';
      var p=mode==='up'?SMU.signUp({email:em,password:pw,name:nm}):mode==='link'?SMU.magic(em):SMU.signIn({email:em,password:pw});
      p.then(function(r){btn.disabled=false;
        if(mode==='up'&&r&&r.confirm){m.innerHTML='<b>Almost there.</b> We sent a confirmation link to '+esc(em)+'. Open it on this device to finish.';return}
        if(mode==='link'&&r&&r.sent){m.innerHTML='<b>Check your inbox.</b> We sent a sign-in link to '+esc(em)+'.';return}
        toast(mode==='up'?'Welcome to SMU+, '+(SMU.user&&SMU.user.name||'Mustang')+'.':'Signed in.');done&&done()},
       function(err){btn.disabled=false;m.textContent=friendlyAuth(err)})})}
  function friendlyAuth(e){var t=(e&&e.message)||'';if(/Invalid login/i.test(t))return 'That email and password don\u2019t match. Try again or use \u201cEmail me a link\u201d.';
    if(/already registered|already exists/i.test(t))return 'That email already has an account. Sign in instead.';if(/rate limit|security purposes/i.test(t))return 'Too many tries. Wait a minute and try again.';
    if(/not confirmed/i.test(t))return 'Confirm your email first. Check your inbox for the link.';return t||'Something went wrong. Try again.'}
  function openAuth(mode,ctx,after){var d=dialog('authDlg','<h3 id="authDlg-h" class="dlg-h">'+(mode==='up'?'Create your SMU+ account':'Sign in to SMU+')+'</h3>'+authForm(mode,ctx));wireAuth(d,function(){d.close();after&&after()})}
  document.addEventListener('click',function(e){var a=e.target.closest('[data-auth]');if(!a)return;e.preventDefault();openAuth(a.dataset.auth||'in',a.dataset.authCtx)});
  function requireUser(ctx,then){if(SMU.user){then();return}openAuth('in',ctx,then)}

  /* header + menu account state */
  function initials(n){return String(n||'?').replace(/[^A-Za-z ]/g,'').split(/\s+/).filter(Boolean).map(function(w){return w[0]}).slice(0,2).join('').toUpperCase()||'?'}
  function syncAcct(){var u=SMU.user,b=$('#acctBtn');if(b){b.classList.toggle('in',!!u);$('.acct-l',b).textContent=u?(u.name||'Account').split(' ')[0]:'Sign in';
      var ph=u&&u.avatar&&SMU.avatarsOn()&&SMU.avatarOK(u.avatar)?u.avatar:'';
      $('.acct-av',b).innerHTML=u?'<span>'+esc(initials(u.name))+'</span>'+(ph?avImg(ph,1):''):SVG.user;$('.acct-av',b).classList.toggle('has-ph',!!ph);
      var mav=$('.mm-acct .acct-av');if(mav){mav.innerHTML=ph?avImg(ph,1):SVG.user;mav.classList.toggle('has-ph',!!ph)}b.setAttribute('aria-label',u?'Your account ('+(u.name||u.email)+')':'Sign in or create an account')}
    var ml=$('.mm-acct-l'),ms=$('.mm-acct-s');if(ml){ml.textContent=u?(u.name||'Your account'):'Sign in or create an account';ms.textContent=u?TIER_NAME[SMU.tier()]+' member \u00b7 '+(SMU.live?'synced':'demo account'):'Save athletes, post on the boards, sync what you watch'}
    /* Join CTA: signed out = Join; signed in, free = smaller Upgrade link; signed in member = hidden (header + phone menu) */
    var st=!u?'out':(paidT(SMU.tier())?'member':'free');
    $$('.hdr-join,.mm-join').forEach(function(el){var mmj=el.classList.contains('mm-join');el.hidden=st==='member';el.classList.toggle('is-upgrade',st==='free');
      el.classList.toggle('btn-red',st!=='free');el.textContent=st==='free'?(mmj?'Upgrade your membership':'Upgrade'):(mmj?'Join SMU+':'Join');
      el.setAttribute('href',st==='free'?ROOT+'#membership':ROOT+'#waitlist')});
    if(window.fitNav)window.fitNav();
    $$('[data-save-athlete]').forEach(syncSaveBtn)}
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
  function checkout(tier){var cur=SMU.tier();
    var d=dialog('payDlg','<p class="eyebrow">'+LOCK+'Demo checkout</p><h3 id="payDlg-h" class="dlg-h">'+TIER_NAME[tier]+' \u00b7 $'+TIER_PRICE[tier]+'/mo</h3>'+
      '<p>In the proposed model, 40% of membership revenue would go to SMU Athletics\u2019 official NIL and revenue-sharing programs, with athlete deals disclosed through the NIL Go clearinghouse.</p>'+
      conceptNotice()+'<p class="pay-what">Confirming only switches this demo account to '+TIER_NAME[tier]+'. Nothing is charged.</p>'+
      (cur===tier?'<p class="auth-m">You\u2019re already on this plan.</p>':'')+
      '<div class="dlg-act"><button type="button" class="btn btn-red" id="payGo"'+(cur===tier?' disabled':'')+'>Confirm demo membership</button><button type="button" class="btn btn-outline" id="payNo">Not now</button></div>'+modeNote());
    $('#payNo',d).addEventListener('click',d.close);
    $('#payGo',d).addEventListener('click',function(){var b=this;b.disabled=true;SMU.setTier(tier).then(function(){d.close();toast('You\u2019re a '+TIER_NAME[tier]+' member (demo). The members-only boards are unlocked.')},function(err){b.disabled=false;toast(err.message,'err')})})}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-plan]');if(!b)return;e.preventDefault();var t=b.dataset.plan;requireUser('Create an account or sign in to choose the '+TIER_NAME[t]+' plan.',function(){checkout(t)})});
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
  function joinCard(t){return '<article class="jm-card'+(t.pop?' pop':'')+'" aria-labelledby="jm-'+t.k+'">'+(t.pop?'<span class="jm-pill">'+esc(t.pop)+'</span>':'')+
    '<h4 id="jm-'+t.k+'">'+esc(t.name)+'</h4>'+(t.for?'<p class="jm-for">'+esc(t.for)+'</p>':'')+
    '<p class="jm-price"><b>'+esc(t.p)+'</b><span>'+esc(t.per)+'</span></p><p class="jm-fine">Sample price. Nothing is charged.</p>'+
    '<button type="button" class="btn btn-red jm-go" data-join-pick="'+t.k+'">Join the waitlist<span class="sr"> for '+esc(t.name)+'</span></button>'+
    (t.perks.length?'<ul>'+t.perks.map(function(x){return '<li class="'+(x.inc?'inc':'')+'">'+JCHK+'<span>'+esc(x.t)+'</span></li>'}).join('')+'</ul>':'')+'</article>'}
  var joinDlg=null;
  function openJoin(tier){if(joinDlg&&document.contains(joinDlg)){if(tier)joinStep(tier);return}
    if(joinDlg===false)return;joinDlg=false;loadTiers().then(function(T){joinDlg=null;buildJoin(T,tier)})}
  function buildJoin(T,tier){
    var logo=BRAND_LOGO?'<picture><source type="image/webp" srcset="'+ROOT+BRAND_LOGO.replace(/\.png$/,'.webp')+'"><img src="'+ROOT+BRAND_LOGO+'" alt="SMU+" width="360" height="128" decoding="async"></picture>':'<span class="jm-wm">SMU+</span>';
    var d=joinDlg=dialog('joinDlg','<div class="jm-hd"><div class="jm-logo">'+logo+'</div><p class="jm-eb">Membership</p><h3 id="joinDlg-h">Pick your seat.</h3>'+
      '<p class="jm-lede">Join the free waitlist for the plan you want. There is nothing to buy.</p></div>'+
      '<div class="jm-body"><div class="jm-plans">'+(stOn()?studentBand('jm'):'')+'<div class="jm-tiers">'+T.map(joinCard).join('')+'</div></div>'+
      '<div class="jm-wl" hidden><button type="button" class="jm-back" data-join-back><span aria-hidden="true">\u2190</span> All plans</button>'+
        '<p class="jm-pick">Waitlist for <b class="jm-pick-n"></b> <span class="jm-pick-p"></span></p>'+waitlistHTML('wlJoin')+'</div>'+
      conceptNotice('jm-cn')+'</div>');
    d.classList.add('dlg-join');syncWaitlist();
    var x=$('.dlg-x',d);if(x){x.setAttribute('aria-label','Close');d.querySelector('.dlg-sheet').insertBefore(x,d.querySelector('.dlg-sheet').firstChild)}
    var obs=new MutationObserver(function(){if(!document.contains(d)){obs.disconnect();joinDlg=null;if(/^#(join|waitlist)$/.test(location.hash))try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}}});obs.observe(body,{childList:true});
    if(tier)setTimeout(function(){joinStep(tier)},40)}
  function joinStep(tier){var d=joinDlg;if(!d)return;var plans=$('.jm-plans',d),wl=$('.jm-wl',d),sheet=$('.jm-body',d);
    if(!tier){wl.hidden=true;plans.hidden=false;sheet.scrollTop=0;var b=$('[data-join-pick="'+(d.dataset.tier||'pony')+'"]',d);if(b)b.focus();return}
    var t=(joinTiers||[]).filter(function(x){return x.k===tier})[0]||{p:'$'+TIER_PRICE[tier],per:'/mo'};if(!JOIN_WL[tier])return;d.dataset.tier=tier;
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

  /* ---------- Free Student plan (SMU email + student ID) ----------
     Live: email-link sign-up on an @smu.edu address; the plan starts only after the email is confirmed and
     claim_student_membership() (supabase/RUN_ME_16_students.sql) accepts it. Hidden on the live site while MP.FEATURES.students is false. */
  var ST_NOTE='Used only to keep student memberships to one per student. It isn\u2019t shown on your profile or shared. SMU+ can\u2019t check it against SMU\u2019s records yet.';
  function studentBand(where){if(!stOn())return '';
    return '<div class="st-band st-'+where+'"><div class="st-b"><p class="st-k">SMU students</p><h4>SMU student? Join free.</h4>'+
      '<p>Sign up with your @smu.edu email and student ID for a free Student plan. No card, nothing to buy.</p></div>'+
      '<button type="button" class="btn btn-red st-go" data-student>Join free as a student</button></div>'}
  function yearOpts(sel){return '<option value="">Choose</option>'+SMU.studentYears().map(function(y){return '<option value="'+y+'"'+(+sel===y?' selected':'')+'>Class of '+y+'</option>'}).join('')}
  function sidField(id){return '<div class="fld"><label for="'+id+'">Student ID</label><input id="'+id+'" name="sid" inputmode="numeric" pattern="[0-9]*" autocomplete="off" maxlength="10" required aria-describedby="'+id+'-n" placeholder="6 to 10 digits">'+
    '<p class="fld-n" id="'+id+'-n">'+ST_NOTE+'</p></div>'}
  function openStudent(){if(!stOn())return;if(/^#student$/.test(location.hash))try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}
    var open=$('#studentDlg');if(open){var fi=$('input',open);if(fi)fi.focus();return}
    if(SMU.user){if(PAGE==='account'){var c=$('#acctStudent')||$('#acctPlan');if(c)c.scrollIntoView({block:'start'})}else location.href=ROOT+'account/#student';return}
    var jd=$('#joinDlg');if(jd){var x=$('.dlg-x',jd);if(x)x.click()}
    var d=dialog('studentDlg','<p class="eyebrow">Free Student plan</p><h3 id="studentDlg-h" class="dlg-h">Join free as an SMU student</h3>'+
      '<p class="st-lede">'+(SMU.live?'Use your SMU email. We\u2019ll email you a link to confirm it, and your Student plan starts when you open that link.':'Use your SMU email. On the real site we email you a link to confirm it first; in this demo the account is confirmed right away.')+'</p>'+
      '<form class="auth-f st-f" novalidate>'+
        '<div class="fld"><label for="stEmail">SMU email</label><input id="stEmail" name="email" type="email" autocomplete="email" required placeholder="you@smu.edu"></div>'+
        sidField('stId')+
        '<div class="fld-row"><div class="fld"><label for="stName">Name</label><input id="stName" name="name" autocomplete="name" maxlength="40" required placeholder="How you appear on the boards"></div>'+
        '<div class="fld"><label for="stYear">Class year</label><select id="stYear" name="year" required>'+yearOpts()+'</select></div></div>'+
        '<label class="wl-consent st-consent" for="stOk"><input id="stOk" type="checkbox" name="consent" required><span class="wl-box" aria-hidden="true"></span><span>I agree that SMU+ can store these details for this student project, as described in the <a href="'+ROOT+'privacy/">privacy notice</a>.</span></label>'+
        '<p class="auth-m" aria-live="polite"></p><button class="btn btn-red st-submit" type="submit">'+(SMU.live?'Email me a link':'Join free')+'</button>'+
      '</form>'+conceptNotice('st-cn')+modeNote());
    var f=$('form',d),m=$('.auth-m',d);
    $('#stId',d).addEventListener('input',function(){var v=this.value.replace(/\D+/g,'').slice(0,10);if(v!==this.value)this.value=v});
    f.addEventListener('submit',function(e){e.preventDefault();var o={email:$('#stEmail',d).value.trim(),sid:$('#stId',d).value.trim(),name:$('#stName',d).value.trim(),year:$('#stYear',d).value};
      function bad(t,el){m.textContent=t;el.setAttribute('aria-invalid','true');el.focus()}
      $$('[aria-invalid]',d).forEach(function(x){x.removeAttribute('aria-invalid')});
      if(!SMU.isSmuEmail(o.email))return bad('Use your SMU email, ending in @smu.edu.',$('#stEmail',d));
      if(!/^[0-9]{6,10}$/.test(o.sid))return bad('Student ID is 6 to 10 digits, numbers only.',$('#stId',d));
      if(!o.name)return bad('Add your name.',$('#stName',d));
      if(!o.year)return bad('Pick your class year.',$('#stYear',d));
      if(!$('#stOk',d).checked)return bad('Please tick the box to agree to the privacy notice.',$('#stOk',d));
      var b=$('.st-submit',d);b.disabled=true;m.textContent=SMU.live?'Sending\u2026':'One moment\u2026';
      /* Also join the waitlist as a student (email, name, affiliation and tier_interest only; the student ID never goes there) */
      SMU.waitlist({email:o.email,name:o.name,affiliation:'student',tier_interest:'student',consent:true}).catch(function(){}).then(function(){syncWaitlist();return SMU.studentJoin(o)}).then(function(r){b.disabled=false;
        if(r&&r.sent){f.outerHTML='<div class="st-sent" role="status"><h4>Check your SMU inbox.</h4><p>We sent a link to <b>'+esc(r.email)+'</b>. Open it on this device and your free Student plan starts. Nothing happens until you do.</p></div>';return}
        d.close();toast('You\u2019re in. Free Student plan, Class of '+o.year+'.');if(PAGE!=='account')location.href=ROOT+'account/#student'},
        function(err){b.disabled=false;m.textContent=err.message||'Couldn\u2019t sign you up. Try again.'})});
    $('#stEmail',d).focus()}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-student]');if(!b)return;e.preventDefault();openStudent()});
  /* home#student (e.g. a class QR code) opens the student form */
  if(PAGE!=='account')(SMU.ready||Promise.resolve()).then(function(){if(location.hash==='#student'&&stOn())openStudent()});
  function studentStatus(tier){var st=stOn()&&SMU.student&&SMU.student();if(!st)return '';
    return '<p class="st-status">'+(tier==='student'?'':'Verified SMU student. ')+'Class of '+esc(st.year||'\u2014')+(st.at?' \u00b7 verified '+esc(new Date(st.at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})):'')+'</p>'+
      '<p class="acct-meta">Checked with your @smu.edu email. SMU+ can\u2019t check student IDs against SMU\u2019s records yet.</p>'}
  function studentCard(u,tier){if(!stOn()||tier==='student'||(SMU.student&&SMU.student()))return '';var msg=SMU.studentMsg?SMU.studentMsg():'';
    if(!SMU.isSmuEmail(u.email))return '<div class="acct-card st-card" id="acctStudent"><h2 class="acct-h">SMU student?</h2><p>The free Student plan needs an @smu.edu email. You\u2019re signed in as '+esc(u.email)+'.</p>'+
      '<button type="button" class="btn btn-outline btn-sm" id="stSwitch">Sign out and join with my SMU email</button></div>';
    return '<div class="acct-card st-card" id="acctStudent"><h2 class="acct-h">SMU student? Join free</h2><p>Add your student ID to start the free Student plan on this account.</p>'+
      '<form class="auth-f" id="stClaim" novalidate>'+sidField('stIdA')+'<div class="fld"><label for="stYearA">Class year</label><select id="stYearA" required>'+yearOpts()+'</select></div>'+
      '<p class="auth-m" aria-live="polite">'+esc(msg)+'</p><button class="btn btn-red btn-sm" type="submit">Start my Student plan</button></form></div>'}
  function wireStudentCard(root,render){var sw=$('#stSwitch',root);if(sw)sw.addEventListener('click',function(){SMU.signOut().then(function(){render();openStudent()})});
    var f=$('#stClaim',root);if(!f)return;var m=$('.auth-m',f);
    $('#stIdA',f).addEventListener('input',function(){var v=this.value.replace(/\D+/g,'').slice(0,10);if(v!==this.value)this.value=v});
    f.addEventListener('submit',function(e){e.preventDefault();var sid=$('#stIdA',f).value.trim(),yr=$('#stYearA',f).value;
      if(!/^[0-9]{6,10}$/.test(sid)){m.textContent='Student ID is 6 to 10 digits, numbers only.';$('#stIdA',f).focus();return}
      if(!yr){m.textContent='Pick your class year.';$('#stYearA',f).focus();return}
      var b=$('button[type=submit]',f);b.disabled=true;m.textContent='One moment\u2026';
      SMU.claimStudent(sid,+yr).then(function(){toast('You\u2019re on the free Student plan.')},function(err){b.disabled=false;m.textContent=err.message})})}

  /* ---------- New thread ---------- */
  function compose(sport){var member=isMember();
    var d=dialog('composeDlg','<h3 id="composeDlg-h" class="dlg-h">Start a thread</h3><form class="compose" novalidate>'+
      '<div class="fld-row"><div class="fld"><label for="cpForum">Board</label><select id="cpForum">'+MP.FORUMS.map(function(f){return '<option value="'+f.id+'"'+(f.prem&&!member?' disabled':'')+(f.id==='hilltop'?' selected':'')+'>'+esc(f.name)+(f.prem?(member?' (members)':' (members only)'):'')+'</option>'}).join('')+'</select></div>'+
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
  document.addEventListener('click',function(e){var b=e.target.closest('[data-report]');if(!b)return;e.preventDefault();var m=location.hash.match(/^#t(\d+)$/),t=m&&MP.THREADS.filter(function(x){return x.id===+m[1]})[0];if(!t)return;
    var i=+b.dataset.report;requireUser('Sign in to report a post.',function(){reportPost(t,i,b)})});
  document.addEventListener('click',function(e){var b=e.target.closest('[data-compose]');if(!b)return;e.preventDefault();var sp=b.dataset.sport||'';requireUser('Sign in to start a thread.',function(){compose(sp)})});

  /* ---------- Profile photo (Account page) ----------
     Checks type and size first (JPEG/PNG/WebP, 2 MB), then center-crops to a 256x256 square in the browser and uploads that
     (WebP, or JPEG where the browser can't make WebP). Storage enforces the same type and size limits on the server. */
  var AV_RULES='No SMU logos, no photos of athletes or other people, nothing offensive. Photos can be reported.';
  function photoBlock(u){if(!SMU.avatarsOn())return '';var me=SMU.me(),has=!!avPhoto(MP.USERS[me]);
    return '<div class="pf"><div class="pf-av">'+avatar(me,true,true)+'</div><div class="pf-ctl"><p class="pf-l" id="pfL">Profile photo</p>'+
      '<p class="pf-s">Shown next to your posts and on your account button. JPEG, PNG or WebP, up to 2 MB. We crop it to a square.</p>'+
      '<input type="file" id="avFile" accept="image/jpeg,image/png,image/webp" hidden>'+
      '<div class="pf-btns"><button type="button" class="btn btn-navy btn-sm" id="avPick" aria-describedby="pfRules">'+(has?'Replace photo':'Upload photo')+'</button>'+
      (has?'<button type="button" class="btn btn-outline btn-sm" id="avRemove">Remove photo</button>':'')+'</div>'+
      '<p class="pf-rules" id="pfRules">'+AV_RULES+'</p><p class="auth-m" id="avMsg" aria-live="polite"></p></div></div>'}
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
  function account(){var main=$('#acctMain');document.title='Your account | SMU+';
    function render(){var u=SMU.user;
      if(!u){main.innerHTML='<section class="page-hero acct-hero has-photo"><div class="bgph">'+photo('equestrian',{eager:1})+'</div>'+CREDIT+'<div class="wrap"><p class="eyebrow">SMU+ account</p><h1 class="display">Sign in</h1><p class="lede on-dark">Save players, post on the boards and pick up videos where you left off on any device.</p></div></section>'+
        '<section class="sec"><div class="wrap acct-wrap">'+conceptNotice('acct-cn')+'<div class="acct-card">'+authForm(location.hash==='#signup'?'up':'in')+'</div>'+studentBand('acct')+'</div></section>';wireAuth(main,render);
        if(location.hash==='#student'&&stOn())setTimeout(function(){openStudent()},60);return}
      if(location.hash==='#reset'&&SMU.live){main.innerHTML='<section class="sec"><div class="wrap acct-wrap"><div class="acct-card"><h2 class="sec-t">Choose a new password</h2><form id="npForm" class="auth-f" novalidate><div class="fld"><label for="npPw">New password</label><input id="npPw" type="password" autocomplete="new-password" minlength="8" required></div><p class="auth-m" aria-live="polite"></p><button class="btn btn-red" type="submit">Save password</button></form></div></div></section>';
        $('#npForm').addEventListener('submit',function(e){e.preventDefault();var v=$('#npPw').value,m=$('.auth-m',main);if(v.length<8){m.textContent='At least 8 characters.';return}SMU.newPassword(v).then(function(){history.replaceState(null,'',location.pathname);toast('Password updated.');render()},function(err){m.textContent=err.message})});return}
      var tier=SMU.tier(),saved=SMU.saved().map(function(id){return (MP.ATHLETES||[]).filter(function(a){return a.id===id})[0]}).filter(Boolean),h=hist().filter(function(x){return LIBBY[x.id]&&x.p<0.97}).slice(0,6),br=store('mp_brief');
      main.innerHTML='<section class="page-hero acct-hero has-photo"><div class="bgph">'+photo('equestrian',{eager:1})+'</div>'+CREDIT+'<div class="wrap"><p class="eyebrow">'+(SMU.live?'Your SMU+ account':'Demo account \u00b7 this browser only')+'</p><h1 class="display">'+esc(u.name||'Your account')+'</h1><p class="lede on-dark">'+esc(u.email)+' \u00b7 '+TIER_NAME[tier]+' member'+(tier==='student'?' <span class="st-badge">Student</span>':'')+'</p></div></section>'+
        '<section class="sec"><div class="wrap">'+conceptNotice('acct-cn')+'</div><div class="wrap acct-grid">'+
          '<div class="acct-card"><h2 class="acct-h">Profile</h2>'+photoBlock(u)+'<form id="nameForm" class="auth-f" novalidate><div class="fld"><label for="dispName">Display name on the boards</label><input id="dispName" maxlength="40" value="'+esc(u.name||'')+'"></div><p class="auth-m" aria-live="polite"></p><button class="btn btn-outline btn-sm" type="submit">Save name</button></form>'+
            '<p class="acct-meta">'+(SMU.live?'Signed in with '+esc(u.email)+'. Your data is stored in the SMU+ database.':'Demo mode: this account, your tier and your posts are saved only in this browser.')+'</p><button type="button" class="btn btn-outline btn-sm" id="signOut">Sign out</button></div>'+
          '<div class="acct-card" id="acctPlan"><h2 class="acct-h">Membership</h2><p class="acct-tier"><b>'+(tier==='student'?'Free Student plan':TIER_NAME[tier])+'</b>'+(tier==='student'?' <span class="st-badge">Student</span>':'')+(paidT(tier)?' \u00b7 $'+TIER_PRICE[tier]+'/mo (demo)':'')+'</p>'+studentStatus(tier)+
            '<div class="acct-plans">'+['mustang','pony','club'].map(function(t){return '<button type="button" class="btn btn-sm '+(t===tier?'btn-navy':'btn-outline')+'" data-plan="'+t+'"'+(t===tier?' aria-current="true" disabled':'')+'>'+TIER_NAME[t]+'</button>'}).join('')+'</div>'+
            (paidT(tier)?'<button type="button" class="linkish" id="cancelPlan">Cancel demo membership</button>':'')+'<p class="acct-meta">Demo membership: no payments are taken and no card is ever asked for.</p></div>'+studentCard(u,tier)+
          '<div class="acct-card"><h2 class="acct-h">Saved players</h2>'+(saved.length?'<ul class="acct-list">'+saved.map(function(a){return '<li><a href="'+athleteUrl(a.id)+'"><b>'+esc(a.name)+'</b><small>#'+a.num+' \u00b7 '+a.pos+'</small></a><button type="button" class="linkish" data-save-athlete="'+a.id+'" aria-pressed="true"><span>Saved</span></button></li>'}).join('')+'</ul>':'<p class="acct-empty">No saved players yet. Tap <b>Save player</b> on any <a href="'+ROOT+'athletes/">player profile</a>.</p>')+'</div>'+
          '<div class="acct-card"><h2 class="acct-h">Continue watching</h2>'+(h.length?'<ul class="acct-list">'+h.map(function(x){var c=LIBBY[x.id];return '<li><a href="'+libUrl()+itemHref(c)+'"><b>'+esc(c.title)+'</b><small>'+Math.round(x.p*100)+'% \u00b7 '+(VERB[c.t]||'Open')+'</small></a></li>'}).join('')+'</ul>':'<p class="acct-empty">Nothing in progress. Start something in the <a href="'+libUrl()+'">library</a>.</p>')+
            '<p class="acct-meta">'+(SMU.live?'Synced to your account across devices.':'Saved in this browser.')+'</p></div>'+
          '<div class="acct-card"><h2 class="acct-h">SMU+ Weekly</h2>'+briefHTML('briefAcct')+'</div>'+
        '</div></section>';
      syncBriefs();
      $('#signOut').addEventListener('click',function(){SMU.signOut().then(function(){toast('Signed out.');render()},function(err){toast(err.message,'err')})});
      var cp=$('#cancelPlan');if(cp)cp.addEventListener('click',function(){SMU.setTier('free').then(backToStudent).then(function(){toast(SMU.tier()==='student'?'Demo membership canceled. You\u2019re back on the free Student plan.':'Demo membership canceled.');render()},function(err){toast(err.message,'err')})});
      wirePhoto(main);wireStudentCard(main,render);
      if(location.hash==='#student'){var sc=$('#acctStudent')||$('#acctPlan');if(sc)setTimeout(function(){sc.scrollIntoView({block:'start'})},60)}
      $('#nameForm').addEventListener('submit',function(e){e.preventDefault();var v=$('#dispName').value.trim(),m=$('.auth-m',this);if(!v){m.textContent='Enter a name.';return}SMU.updateName(v).then(function(){toast('Name saved.');render()},function(err){m.textContent=err.message})})}
    main.innerHTML='<div class="skel-block" aria-hidden="true" style="min-height:420px"><i class="sk"></i></div>';
    SMU.ready.then(render);SMU.on('auth',function(){render()});SMU.on('avatar',function(){if(SMU.user)render()});SMU.on('tier',function(){if(SMU.user)render()});SMU.on('saved',function(){if(SMU.user)render()});SMU.on('student',function(){if(SMU.user)render()})}

  SMU.ready.then(function(){syncAcct();syncBriefs();syncWaitlist();if(SMU.user&&SMU.live)pullHistory();
    var s=SMU.user&&SMU.tier();if(SMU.user){store('mp_member',paidT(s)?'1':'0');syncMember()}});
  syncAcct();

  aboutSources();if(PAGE==='home')home();else if(PAGE==='library')library();else if(PAGE==='recruiting')recruiting();else if(PAGE==='boards')boards();else if(PAGE==='sport')sport();else if(PAGE==='athlete')athlete();else if(PAGE==='account')account();
  articleFromHash();
})();
