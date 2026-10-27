/* SMU+ ad slots: demo creative only.
   Every ad on the site is a sample built here in HTML/CSS for made-up brands. There is no ad network code, no tracking, no pixels and
   no third-party cookies. Formats follow the standard display units (sticky 320x50 / 728x90, medium rectangle 300x250, half page 300x600,
   billboard 970x250, interscroller and interstitial 320x480, one skin takeover).
   Ad-free (header and menu switches in app.js) puts class "adfree" on <html>; site.css then hides every [data-ad-slot], the sticky bar,
   the interstitial and the skin, and removes the space they used. Toggling it updates the page live.

   To swap in real creative later, edit MP.ADS below:
   - per placement, add creative:{img:'url', href:'https://...', alt:'...'} or creative:{html:'<...>'} (the "Sample ad" label is replaced
     by label:'Advertisement' or whatever the seller requires), or point brand at another entry in brands;
   - or set MP.ADS.render=function(slot){return html} to hand every slot to a network or ad server tag.
   A page can reserve a slot's space in its HTML with a same-size placeholder carrying data-ad-hold="<placement id>" (no layout shift
   when the ad fills it; library/index.html does this for its billboard).
   Placements with "at" are mounted by MP.adsMount() (on load, and by app.js after it renders an article or a board thread). */
(function(){
var MP=window.MP=window.MP||{};
var ADS=MP.ADS={
  enabled:true,
  label:'Sample ad',
  /* unit sizes (width x height in px) */
  units:{sticky:[320,50],leaderboard:[728,90],mpu:[300,250],halfpage:[300,600],billboard:[970,250],interscroller:[320,480],interstitial:[320,480],skin:[1920,860],presented:[0,0]},
  /* made-up brands. Not real companies; no gambling, alcohol or crypto. bg = creative background, fg = text, ac = accent / button, ct = button text (default white). */
  brands:{
    tellivant:{name:'Tellivant Wireless',line:'Game day coverage, end zone to end zone.',cta:'See plans',bg:'#354CA1',fg:'#fff',ac:'#CC0035',mark:'wave'},
    brindlecup:{name:'Brindlecup Coffee',line:'Small-batch roasts for early kickoffs.',cta:'Find a caf\u00e9',bg:'#fff',fg:'#354CA1',ac:'#CC0035',mark:'cup'},
    wrenhollow:{name:'Wrenhollow Sports Medicine',line:'Sprains, strains and weekend warriors. Same-week visits.',cta:'Book a visit',bg:'#354CA1',fg:'#fff',ac:'#CC0035',mark:'cross'},
    pelloway:{name:'Pelloway Insurance',line:'Home, auto and the drive to the game.',cta:'Get a quote',bg:'#CC0035',fg:'#fff',ac:'#fff',ct:'#CC0035',mark:'shield'},
    kestrelvale:{name:'Kestrelvale Auto Care',line:'Oil, tires and a wash before the tailgate.',cta:'Schedule service',bg:'#fff',fg:'#354CA1',ac:'#354CA1',mark:'gear'},
    marrowbys:{name:'Marrowby\u2019s Burgers',line:'Smash burgers with game-day hours.',cta:'Order ahead',bg:'#354CA1',fg:'#fff',ac:'#fff',ct:'#354CA1',mark:'burger'}
  },
  /* where slots go. page = body[data-page]; at = [selector, position] for insertAdjacentHTML; wide/phone = breakpoint only */
  placements:{
    'home-billboard':{unit:'billboard',brand:'brindlecup',page:'home',at:['section.hero','afterend'],wide:1},
    'ribbon-presented':{unit:'presented',brand:'tellivant',page:'home',at:['#ribbon .rb-hd','beforeend'],inline:1},
    'library-billboard':{unit:'billboard',brand:'kestrelvale',page:'library',at:['#libBar','afterend'],wide:1},
    /* From Socials: phones get one 300x250 after the 5th post; desktop (1024px+, where the rail shows) gets the two rail slots instead.
       With the sticky bar that is 3 at most either way. The second rail ad goes after Podcasts, not between Videos and Podcasts: on
       1260px+ that spot lines up with the Writers rows (X profile pictures) in the Following column, and Counsel wants no ad beside them. */
    'socials-mpu':{unit:'mpu',brand:'brindlecup',page:'socials',at:['#sxFeed > :nth-child(5)','afterend'],cls:'ad-sx-ph'},
    'socials-rail-1':{unit:'mpu',brand:'kestrelvale',page:'socials',at:['#sxRgGames','afterend'],cls:'ad-sx-dk'},
    'socials-rail-2':{unit:'mpu',brand:'pelloway',page:'socials',at:['#sxRgPods','afterend'],cls:'ad-sx-dk'},
    'library-mpu':{unit:'mpu',brand:'marrowbys',page:'library',at:['#libView [data-ad-after]','afterend'],band:1},
    'games-billboard':{unit:'billboard',brand:'pelloway',page:'games',at:['.gmi-hero','afterend'],wide:1},
    'game-presented':{unit:'presented',brand:'tellivant',page:'games',at:['.gc-hd','beforebegin']},
    /* every game page (/games/?id=...): the sponsor strip above the title (between the scoreboard and the page title, well away from
       Game leaders headshots and player stats) and a 300x250 at the end of the right column (Game info,
       How to watch, Game links), away from Game leaders and player stats; with the sticky bar that is the 3-ad cap.
       noSkin: hidden only where the skin takeover actually shows (1300px+), so the skin game still has it on phones and laptops. */
    'game-mpu':{unit:'mpu',brand:'wrenhollow',page:'games',at:['.gc-c3 .gc-links','afterend'],noSkin:1},
    'boards-halfpage':{unit:'halfpage',brand:'pelloway',page:'boards',at:['#indexView .fx-side','beforeend'],wide:1},
    'thread-mpu':{unit:'mpu',brand:'brindlecup',page:'boards',at:['#threadView .fx-msgs > :nth-child(3)','afterend'],ctx:'thread'},
    'article-mid':{unit:'mpu',brand:'wrenhollow',at:['#readerBody .prose:not(.teaser) > p:nth-child(3):not(:last-child)','afterend'],ctx:'article',tab:1,noAthlete:1},
    'article-mid-phone':{unit:'interscroller',brand:'tellivant',at:['#readerBody .prose:not(.teaser) > p:nth-child(3):not(:last-child)','afterend'],ctx:'article',phone:1,noAthlete:1},
    'article-end':{unit:'mpu',brand:'pelloway',at:['#readerBody .prose:not(.teaser) ~ .note','afterend'],ctx:'article'}
  },
  /* site-wide sticky bar (320x50 phones, 728x90 desktop), dismissible for the session. Not on athlete, roster, recruiting or account pages. */
  sticky:{brand:'marrowbys',noPages:['athlete','sport','recruiting','account']},
  /* phone takeover: once per session, never on the first page of a visit */
  interstitial:{brand:'kestrelvale',fromPage:2,delay:1500,noPages:['athlete','sport','recruiting','account','boards']},
  /* one skin takeover: the next football game's page (desktop). Every unit on that page shows the skin brand. */
  skin:{brand:'tellivant',minWidth:1300}
};

var MARKS={
  wave:'<path d="M4 20a16 16 0 0 1 32 0" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M10 20a10 10 0 0 1 20 0" stroke="currentColor" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="20" cy="21" r="3.5" fill="currentColor"/>',
  cup:'<path d="M8 14h20v8a10 10 0 0 1-20 0z" fill="currentColor"/><path d="M28 16h3a4 4 0 0 1 0 8h-3" stroke="currentColor" stroke-width="3" fill="none"/><path d="M14 5c-2 3 2 4 0 7M20 5c-2 3 2 4 0 7" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
  cross:'<rect x="15" y="5" width="10" height="30" rx="2" fill="currentColor"/><rect x="5" y="15" width="30" height="10" rx="2" fill="currentColor"/>',
  shield:'<path d="M20 4l13 5v9c0 9-6 15-13 18C13 33 7 27 7 18V9z" fill="currentColor"/>',
  gear:'<circle cx="20" cy="20" r="12" stroke="currentColor" stroke-width="5" fill="none" stroke-dasharray="6 3.4"/><circle cx="20" cy="20" r="4.5" fill="currentColor"/>',
  burger:'<path d="M7 17a13 9 0 0 1 26 0z" fill="currentColor"/><rect x="6" y="20" width="28" height="4" rx="2" fill="currentColor"/><path d="M7 27h26a4 4 0 0 1-4 5H11a4 4 0 0 1-4-5z" fill="currentColor"/>'
};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function page(){return document.body&&document.body.getAttribute('data-page')||''}
function brandOf(id,p){return ADS.brands[(ADS.skinOn&&!(p&&p.keepBrand))?ADS.skin.brand:id]||ADS.brands.tellivant}
function mark(b){return '<svg class="ad-mk" viewBox="0 0 40 40" aria-hidden="true">'+(MARKS[b.mark]||MARKS.wave)+'</svg>'}
/* house creative: the made-up brand drawn in HTML/CSS at the unit's size */
function creative(unit,b){var U=ADS.units[unit]||[300,250];
  return '<div class="ad-cr ad-cr-'+unit+'" role="img" aria-label="'+esc(ADS.label+': '+b.name+', a made-up brand. '+b.line)+'" style="--adw:'+U[0]+'px;--adh:'+U[1]+'px;--adbg:'+b.bg+';--adfg:'+b.fg+';--adac:'+b.ac+';--adct:'+(b.ct||'#fff')+'">'+
    mark(b)+'<span class="ad-tx"><b class="ad-nm">'+esc(b.name)+'</b><span class="ad-ln">'+esc(b.line)+'</span></span><span class="ad-cta">'+esc(b.cta)+'</span></div>'}
function slotBody(id,p){var c=p.creative;
  if(typeof ADS.render==='function'){var r=ADS.render({id:id,unit:p.unit,size:ADS.units[p.unit]});if(r)return r}
  if(c&&c.html)return c.html;
  if(c&&c.img)return '<a class="ad-cr ad-img" href="'+esc(c.href||'#')+'" target="_blank" rel="noopener sponsored"><img src="'+esc(c.img)+'" alt="'+esc(c.alt||'')+'" width="'+ADS.units[p.unit][0]+'" height="'+ADS.units[p.unit][1]+'" loading="lazy"></a>';
  return creative(p.unit,brandOf(p.brand,p))}
function lbl(p){return '<span class="ad-lbl">'+esc(p.label||ADS.label)+'</span>'}
/* one slot's markup, by placement id */
MP.ad=function(id){var p=ADS.placements[id];if(!ADS.enabled||!p)return '';
  var cls='ad ad-'+p.unit+(p.wide?' ad-wide':'')+(p.tab?' ad-tab':'')+(p.phone?' ad-phone':'')+(p.band?' ad-band':'')+(p.cls?' '+p.cls:'');
  if(p.unit==='presented'){var b=brandOf(p.brand,p);
    return '<div class="ad ad-presented'+(p.inline?' ad-pr-inline':'')+'" data-ad-slot="'+id+'"><div class="'+(p.inline?'':'wrap ')+'ad-pr-in"><span class="ad-pr-t">Game Day presented by</span>'+
      '<span class="ad-pr-b" style="--adac:'+b.bg+'">'+mark(b)+'<b>'+esc(b.name)+'</b></span>'+lbl(p)+'</div></div>'}
  if(p.unit==='interscroller')return '<div class="'+cls+'" data-ad-slot="'+id+'">'+lbl(p)+'<div class="ad-is-win"><div class="ad-is-fix">'+slotBody(id,p)+'</div></div><span class="ad-is-note">Keep scrolling</span></div>';
  var inner='<div class="ad-box">'+lbl(p)+slotBody(id,p)+'</div>';
  return '<div class="'+cls+'" data-ad-slot="'+id+'"'+(p.noSkin?' data-noskin':'')+'>'+(p.band?'<div class="wrap">'+inner+'</div>':inner)+'</div>'};
/* insert every placement whose anchor exists (once each). ctx limits to one render context (article, thread). */
MP.adsMount=function(ctx){if(!ADS.enabled)return;var pg=page();
  Object.keys(ADS.placements).forEach(function(id){var p=ADS.placements[id];if(!p.at)return;
    if((p.ctx||'')!==(ctx||''))return;if(p.page&&p.page!==pg)return;if(p.noAthlete&&document.querySelector('#readerBody[data-athlete]'))return;
    var hold=document.querySelector('[data-ad-hold="'+id+'"]');if(hold){hold.outerHTML=MP.ad(id);return}
    var a=document.querySelector(p.at[0]);if(!a||document.querySelector('[data-ad-slot="'+id+'"]'))return;
    a.insertAdjacentHTML(p.at[1],MP.ad(id))});MP.adsCap()};

/* At most ADS.max (3) ad slots showing on any page, the sticky bar included (the skin is a page background, not a slot).
   Order of who keeps a slot: the sticky bar, then slots in an open reader (the article you are reading), then the page's own
   slots top to bottom. Slots over the cap get class ad-capped (display:none, no gap) and come back when room frees up: closing the
   article, dismissing the sticky bar, or a resize that hides a wide-only or phone-only slot. Re-run after every mount and change. */
ADS.max=3;
MP.adsCap=function(){var all=[].slice.call(document.querySelectorAll('[data-ad-slot]')).filter(function(e){return e.getAttribute('data-ad-slot')!=='skin'&&!e.hasAttribute('data-ad-hold')});
  all.forEach(function(e){e.classList.remove('ad-capped')});
  var vis=all.filter(function(e){return e.getClientRects().length>0}),rd=document.getElementById('reader'),open=rd&&!rd.hidden;
  function rank(e){return e.classList.contains('ad-sticky')?0:(open&&rd.contains(e))?1:2}
  vis.map(function(e,i){return [rank(e),i,e]}).sort(function(a,b){return a[0]-b[0]||a[1]-b[1]}).forEach(function(x,i){if(i>=ADS.max)x[2].classList.add('ad-capped')})};
var capT;function capSoon(){clearTimeout(capT);capT=setTimeout(MP.adsCap,60)}
addEventListener('resize',capSoon);
if(window.MutationObserver)new MutationObserver(capSoon).observe(document.documentElement,{attributes:true,attributeFilter:['class']});

/* skin takeover (called by app.js on the one game page that carries it) */
MP.adSkin=function(){if(!ADS.enabled||!ADS.skin)return;ADS.skinOn=true;var b=ADS.brands[ADS.skin.brand];if(!b)return;
  document.documentElement.classList.add('ad-skin');
  var side='<div class="ad-skin-side">'+mark(b)+'<b>'+esc(b.name)+'</b><span>'+esc(b.line)+'</span><span class="ad-cta">'+esc(b.cta)+'</span></div>';
  document.body.insertAdjacentHTML('afterbegin','<div class="ad-skin-bg" data-ad-slot="skin" role="img" aria-label="'+esc(ADS.label+': '+b.name+' page skin, a made-up brand')+'" style="--adbg:'+b.bg+';--adfg:'+b.fg+';--adac:'+b.ac+';--adct:'+(b.ct||'#fff')+'">'+
    '<span class="ad-lbl ad-lbl-skin">'+esc(ADS.label)+'</span>'+side+side+'</div>')};

function ss(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}}
function sticky(){var S=ADS.sticky;if(!S||S.noPages.indexOf(page())>=0||ss('mp_ad_sticky_x')||document.querySelector('.ad-sticky'))return;
  var b=brandOf(S.brand,{});
  document.body.insertAdjacentHTML('beforeend','<div class="ad-sticky" data-ad-slot="sticky" role="complementary" aria-label="'+esc(ADS.label)+'">'+
    '<span class="ad-lbl">'+esc(ADS.label)+'</span><button type="button" class="ad-x" aria-label="Close this sample ad">Close<span aria-hidden="true"> \u00d7</span></button>'+
    '<div class="ad-st-ph">'+creative('sticky',b)+'</div><div class="ad-st-dk">'+creative('leaderboard',b)+'</div></div>');
  document.documentElement.classList.add('ad-sticky-on');if(MP.adFlow)MP.adFlow(); /* board threads on phones: app.js moves it into the page */
  document.querySelector('.ad-sticky .ad-x').addEventListener('click',function(){ss('mp_ad_sticky_x','1');var el=document.querySelector('.ad-sticky');if(el)el.remove();document.documentElement.classList.remove('ad-sticky-on');MP.adsCap()})}
function interstitial(){var I=ADS.interstitial;if(!I)return;var n=(+ss('mp_ad_pv')||0)+1;ss('mp_ad_pv',String(n));
  if(n<I.fromPage||ss('mp_ad_ist')||I.noPages.indexOf(page())>=0)return;
  setTimeout(function(){var h=document.documentElement;
    if(h.classList.contains('adfree')||h.classList.contains('noscroll')||!(window.matchMedia&&matchMedia('(max-width:719px)').matches)||ss('mp_ad_ist'))return;
    ss('mp_ad_ist','1');var b=brandOf(I.brand,{}),last=document.activeElement;
    document.body.insertAdjacentHTML('beforeend','<div class="ad-ist" data-ad-slot="interstitial" role="dialog" aria-modal="true" aria-label="'+esc(ADS.label)+'">'+
      '<div class="ad-ist-in"><div class="ad-ist-top"><span class="ad-lbl">'+esc(ADS.label)+'</span><button type="button" class="ad-x" aria-label="Close this sample ad">Close<span aria-hidden="true"> \u00d7</span></button></div>'+creative('interstitial',b)+
      '<button type="button" class="ad-ist-go">Continue to SMU+</button></div></div>');
    var el=document.querySelector('.ad-ist');
    function close(){document.removeEventListener('keydown',key);el.remove();if(last&&last.focus)last.focus()}
    function key(e){if(e.key==='Escape')close()}
    el.addEventListener('click',function(e){if(e.target===el||e.target.closest('.ad-x,.ad-ist-go'))close()});document.addEventListener('keydown',key);
    el.querySelector('.ad-x').focus()},I.delay||1500)}
/* Game pages render in app.js from ?id= (preview, live or final). Mount their slots in the same task as that render (a
   MutationObserver callback runs before the next paint), so the ads never push the gamecast down after it shows. No app.js hook needed. */
if(page()==='games'&&window.MutationObserver){var gmo=new MutationObserver(function(){if(document.querySelector('.gc-hd')&&!document.querySelector('[data-ad-slot="game-presented"]'))MP.adsMount()});
  gmo.observe(document.documentElement,{childList:true,subtree:true});addEventListener('load',function(){setTimeout(function(){gmo.disconnect()},4000)})}
/* Scripts load with defer, so readyState is already 'interactive' here; wait for DOMContentLoaded anyway (until it has fired) so boot runs after app.js renders, as before. */
function boot(){if(!ADS.enabled)return;MP.adsMount();sticky();MP.adsCap();interstitial()}
if(document.readyState==='loading'||(function(){try{var n=performance.getEntriesByType('navigation')[0];return !!n&&!n.domContentLoadedEventStart}catch(e){return false}})())document.addEventListener('DOMContentLoaded',boot);else setTimeout(boot,0);
/* No ads next to athlete content: while the home "Meet the Mustangs" row is on screen the sticky bar steps aside (class ad-quiet on <html>).
   Also covers any athlete section on athletes/ pages (where the sticky bar is already off). visibility only, so nothing shifts.
   Counsel, Oct 27: the same for account-follow sections (Follow SMU and coverage rows in "From the feeds", the From Socials
   Following list, including its phone sheet). app.js calls MP.adsQuietScan() after it renders a feeds section. */
(function(){if(!('IntersectionObserver' in window))return;var on=new Set(),seen=new WeakSet(),io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting)on.add(e.target);else on.delete(e.target)});document.documentElement.classList.toggle('ad-quiet',on.size>0)});
  function scan(){var sel='#athletes,#athRow,.rail-ath,#feeds .follow,#sxFollow'+(page()==='athlete'?',main section':'');
    Array.prototype.forEach.call(document.querySelectorAll(sel),function(el){if(!seen.has(el)){seen.add(el);io.observe(el)}})}
  if(document.readyState==='loading'||(function(){try{var n=performance.getEntriesByType('navigation')[0];return !!n&&!n.domContentLoadedEventStart}catch(e){return false}})())document.addEventListener('DOMContentLoaded',scan);else scan();setTimeout(scan,1500);setTimeout(scan,4000);MP.adsQuietScan=scan})();
})();
