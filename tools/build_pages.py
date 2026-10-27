"""Rebuild the shared bits of every HTML page (idempotent):
  - canonical script list + ?v= cache-bust
  - SEO / Open Graph / manifest tags
  - page-load bar + View Transitions (inline, never blocks if JS fails)
  - account/index.html and 404.html shells, sitemap.xml, robots.txt, manifest.webmanifest
Usage: python3 build_pages.py [VERSION]   (default: current time, YYYYMMDDHHMM)"""
import re,sys,glob,os,time,json,html
REPO=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE='https://fanplatformdemo.com/'
VER=sys.argv[1] if len(sys.argv)>1 else time.strftime('%Y%m%d%H%M')
# Order matters: config -> data -> app. supabase-js is loaded lazily by sb.js only when config has keys.
# Every script is `defer`: they still run in this order, after the HTML is parsed and before DOMContentLoaded,
# but no longer hold up first paint. No inline script may call into these files at parse time.
SCRIPTS=['config.js','data.js','content.js','real.js','athletes.js','socials.js','sport-icons.js','games.js','upcoming.js','boxscores.js','gamestats.js','sb.js','ads.js','app.js','cfbd-live.js']
# Data files only one page reads. upcoming.js (MP.UPCOMING) feeds the home calendar ribbon only; boxscores.js (MP.BOX) and
# gamestats.js (MP.gameStats) are read only by the game page (app.js gamePage). Every other script loads on every page.
ONLY_ON={'upcoming.js':('index.html',),'boxscores.js':('games/index.html',),'gamestats.js':('games/index.html',)}
# Phones (<640px): the bar is a dismissible pop-up; the X stores mp_disc_x so it stays gone on later pages and visits (site.css)
DISC_X='<button type="button" class="disc-x" aria-label="Dismiss"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z"/></svg></button><script>(function(){var h=document.documentElement,b=document.currentScript.previousElementSibling,k="mp_disc_x";try{if(localStorage.getItem(k))h.classList.add("disc-off")}catch(e){}b.addEventListener("click",function(){h.classList.add("disc-off");try{localStorage.setItem(k,"1")}catch(e){}})})()</script>'
def DISC(root):
    # One wording site-wide (Business Ops lock-exposure notice). build_pages.py rewrites it on every page.
    # Full wording on tablets/desktop; phones get the short line (CSS swaps them) so the bar stays two lines max.
    return ('<div class="disclaimer" role="note"><span class="disc-full">Built for an SMU Cox MBA class project. Not affiliated with, endorsed by, or sponsored by SMU, SMU Athletics, Mustang Partners, Learfield or any athlete or organization shown. Memberships are for demonstration only. No payments are taken and no real product or service is offered. For educational purposes only.</span><span class="disc-short">SMU Cox MBA class project. Not affiliated with SMU, Mustang Partners or Learfield. No payments taken.</span> '
            f'<a href="{root}privacy/#about">About this project</a>'+DISC_X+'</div>')

def head(title,desc,page,root,extra=''):
    return f'''<!doctype html>
<html lang="en">
<head>
{extra}<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#23347a">
<meta property="og:site_name" content="SMU+">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta name="twitter:title" content="{title}">
<link rel="icon" type="image/png" sizes="64x64" href="{root}assets/brand/favicon-64.png">
<link rel="apple-touch-icon" href="{root}assets/brand/apple-touch-icon.png">
<link rel="stylesheet" href="{root}assets/site.css?v={VER}">
</head>
<body data-page="{page}" data-root="{root}">
{DISC(root)}
<div id="site-header"></div>
'''

PRIVACY_BODY='''<main id="top"><section class="page-hero has-photo"><div class="bgph"><picture><img class="ph" src="../assets/photos/lib/rowing-boat-wide-ncaa-2021-1200.webp" srcset="../assets/photos/lib/rowing-boat-wide-ncaa-2021-1200.webp 1200w, ../assets/photos/lib/rowing-boat-wide-ncaa-2021-2400.webp 2400w" sizes="100vw" alt="An SMU rowing crew races on open water" style="object-position:60% 55%" fetchpriority="high" decoding="async"></picture></div><span class="credit">Photo: SMU Athletics</span><div class="wrap"><h1 class="display">Your data on SMU+</h1>
<p class="lede on-dark">A plain-language guide to what this student project collects, why, where it’s kept and how to have it deleted. Last updated October 26, 2026.</p></div></section>
<section class="sec"><div class="wrap policy">
<nav class="policy-toc" aria-label="On this page"><p class="eyebrow">On this page</p><ol><li><a href="#about">About this project</a></li><li><a href="#collect">What we collect</a></li><li><a href="#why">Why we collect it</a></li><li><a href="#where">Where it’s stored</a></li><li><a href="#share">Selling and sharing</a></li><li><a href="#delete">Deleting your data</a></li><li><a href="#browser">Your browser</a></li><li><a href="#contact">Contact</a></li></ol></nav>
<div class="policy-body">
<section id="about"><h2>About this project</h2>
<p>SMU+ was built for an SMU Cox MBA class project. It is <strong>not affiliated with, endorsed by, or sponsored by SMU, SMU Athletics, Mustang Partners, Learfield or any athlete or organization shown</strong>.</p>
<p><strong>Memberships are for demonstration only.</strong> No payments are taken and no real product or service is offered. For educational purposes only.</p></section>
<section id="collect"><h2>What we collect</h2>
<ul><li><strong>Waitlist:</strong> your email address, your name, SMU affiliation and the plan you’d be interested in if you choose to give them, the date you joined, that you agreed to this notice, and how you found the site (the campaign tag in the link you used, such as a QR code, and the name of the website that linked you, if any).</li>
<li><strong>Page visits:</strong> a simple visit count. For each page load we save the page address, the campaign tags and linking website (if any), whether you’re on a phone or a computer, and a random code that lasts only until you close the tab, so visits in one session can be counted once. No cookies and no browser details are saved with the visit. Our hosting and database providers may log IP addresses in their standard request logs. Visit records are deleted automatically after 90 days.</li>
<li><strong>SMU+ Weekly sign-up:</strong> your email address.</li>
<li><strong>Accounts</strong> (if you create one): your email address, the display name you choose, your board posts, the players you save, how far you got in videos, and your demo membership tier. Your password is handled by Supabase’s sign-in service and is never visible to us.</li></ul>
<p>We don’t collect payment details, and we don’t use advertising trackers, third-party analytics or cookies. The visit count above is our own and stays in the SMU+ database. Videos from SMU Athletics on YouTube are YouTube embeds: the video player loads from YouTube only when you press play (the preview picture comes from YouTube’s image server), and from then on YouTube’s own privacy policy applies.</p></section>
<section id="why"><h2>Why we collect it</h2>
<p>Waitlist and newsletter addresses are used only to contact you about this student project. Account details are used only to run the account features you use, such as posting on the boards and keeping your saved players.</p></section>
<section id="where"><h2>Where it’s stored</h2>
<p>Sign-ups, accounts and posts are stored in a database run by <a href="https://supabase.com/privacy" target="_blank" rel="noopener">Supabase</a>, the hosting service this project uses. Access rules on the database stop visitors from reading the waitlist or anyone else’s email address. The site itself is hosted on GitHub Pages, and it loads its fonts from Google Fonts and one code library from jsDelivr. Like most web hosts, those services may keep standard request logs such as IP addresses.</p></section>
<section id="share"><h2>Selling and sharing</h2>
<p><strong>We never sell your information</strong> and we don’t share it with anyone for advertising. It stays with this project.</p></section>
<section id="delete"><h2>Deleting your data</h2>
<p>To ask for your data to be deleted, email SMU+ from the address you signed up with at <span data-contact="removal"><a href="mailto:smuplusmedia@gmail.com?subject=SMU%2B%20data%20removal%20request">smuplusmedia@gmail.com</a></span>. Your waitlist entry, newsletter sign-up, account and posts will be removed. You can also ask what we hold about you. Page-visit records can’t be linked to you, so there is nothing to look up; they are deleted automatically after 90 days.</p></section>
<section id="browser"><h2>Your browser</h2>
<p>The site saves a few settings in your browser’s local storage, such as whether you’ve seen the loading screen and what you’ve watched. In demo mode, everything you enter stays in your browser and is never sent anywhere. Clearing your browser data removes it.</p></section>
<section id="contact"><h2>Contact</h2>
<p>Questions about this notice or this project: <span data-contact><a href="mailto:smuplusmedia@gmail.com">smuplusmedia@gmail.com</a></span>. SMU+ is not intended for children under 13.</p></section>
</div></div></section></main>
<div id="site-footer"></div>
</body>
</html>
'''
SHELLS={
 'privacy/index.html': head('Privacy notice | SMU+','What the SMU+ student concept project collects, why, where it is stored and how to have it deleted.','privacy','../')+PRIVACY_BODY,
 'account/index.html': head('Your account | SMU+','Sign in to SMU+ to save players, post on the message boards and keep your place in videos (concept site).','account','../')+
   '<main id="acctMain"><section class="page-hero acct-hero"><div class="wrap"><p class="eyebrow">SMU+ account</p><h1 class="display">Your account</h1><p class="lede on-dark">Loading your account\u2026</p></div></section>'
   '<noscript><section class="sec"><div class="wrap"><p>Your account needs JavaScript turned on.</p></div></section></noscript></main>\n<div id="site-footer"></div>\n</body>\n</html>\n',
 'search/index.html': head('Search | SMU+','Search SMU+ videos, articles, podcasts, players and forum posts (class-project concept).','search','../')+
   '<main id="searchMain"><section class="srch-hero"><div class="wrap"><h1>Search SMU+</h1>'
   '<form class="srch-f" role="search" action="./" method="get"><label class="sr" for="srchQ0">Search</label><input id="srchQ0" name="q" type="search"><button type="submit">Search</button></form>'
   '<noscript><p class="srch-note">Search needs JavaScript turned on.</p></noscript></div></section></main>\n<div id="site-footer"></div>\n</body>\n</html>\n',
 # GitHub Pages serves 404.html for any missing path at any depth, so resolve assets from the site root with <base>.
 '404.html': head('Page not found | SMU+','That page is not on SMU+.','notfound','',
   '<script>document.write(\'<base href="\'+(location.pathname.indexOf("/mustangs-plus/")===0?"/mustangs-plus/":"/")+\'">\')</script>\n'
   '')+
   '<main id="top"><section class="page-hero nf-hero"><div class="wrap"><h1 class="display">Off the field</h1>'
   '<p class="lede on-dark">We couldn\u2019t find that page. It may have moved, or the link has a typo.</p>'
   '<form class="srch-f nf-sf" role="search" action="search/" method="get"><label class="sr" for="nfQ">Search SMU+</label><input id="nfQ" name="q" type="search" placeholder="Search players, games and videos" autocomplete="off" spellcheck="false" enterkeyhint="search" maxlength="80"><button type="submit">Search</button></form>'
   '<p class="nf-act"><a class="btn btn-red" href="./">Go to the home page</a> <a class="btn btn-ghost" href="library/">Browse the library</a> <a class="btn btn-ghost" href="boards/">Message Boards</a></p></div></section></main>\n'
   '<div id="site-footer"></div>\n</body>\n</html>\n',
}
for rel,src in SHELLS.items():
    p=os.path.join(REPO,rel);os.makedirs(os.path.dirname(p),exist_ok=True)
    if not os.path.exists(p): open(p,'w').write(src);print('created',rel)

# Page loads: no full-screen loader. A slim white bar appears only if a load is still going after 300ms (never on fast or cached loads),
# cross-document View Transitions fade pages in 180ms (off for reduced motion), and nothing sticks after Back/Forward (bfcache).
# Fonts are self-hosted (assets/fonts, @font-face in site.css). Preload the two latin files every page paints above the fold.
BOOT_HEAD='''<!--boot--><link rel="preload" href="{PRE}assets/fonts/dm-sans-var-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{PRE}assets/fonts/anton-400-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>@view-transition{navigation:auto}
::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation-duration:.18s;animation-timing-function:ease}
#pgbar{position:fixed;top:env(safe-area-inset-top,0px);left:0;right:0;z-index:10000;height:3px;background:#fff;box-shadow:0 1px 0 rgba(22,33,79,.2);transform:scaleX(0);transform-origin:0 50%;opacity:0;pointer-events:none}
html.pg-wait #pgbar{opacity:1;animation:pgGrow 12s cubic-bezier(.08,.7,.2,1) forwards}
html.pg-done #pgbar{transform:scaleX(1);opacity:0;transition:transform .15s ease,opacity .2s ease .12s}
@keyframes pgGrow{from{transform:scaleX(.06)}to{transform:scaleX(.9)}}
@media (prefers-reduced-motion:reduce){@view-transition{navigation:none}html.pg-wait #pgbar{animation:none;transform:scaleX(1)}html.pg-done #pgbar{transition:none}}
</style>
<script>/* Page-load bar: nothing on fast loads. A slim bar shows only when a load is still going after 300ms: on this page until the app has rendered (DOMContentLoaded), and on the page being left after a same-site link tap or form submit. Never covers content; cleared on pagehide and on a back/forward-cache restore.
   The fade is skipped when the next page took over a second to arrive (it adds nothing then, and the browser would drop it on its render timeout with a console error). */
(function(d,w){var cl=d.documentElement.classList,t,cap,off,leaving=0,tap=0;if(w.__SMU_NOBOOT)return;
function show(){clearTimeout(off);cl.remove('pg-done');cl.add('pg-wait');if(leaving)cap=setTimeout(function(){leaving=0;hide()},15000)}
function hide(){clearTimeout(t);clearTimeout(cap);if(!cl.contains('pg-wait'))return;cl.remove('pg-wait');cl.add('pg-done');off=setTimeout(function(){cl.remove('pg-done')},450)}
function reset(){leaving=0;clearTimeout(t);clearTimeout(cap);clearTimeout(off);cl.remove('pg-wait','pg-done')}
function soon(){clearTimeout(t);clearTimeout(cap);t=setTimeout(show,300)}
soon();d.addEventListener('DOMContentLoaded',function(){if(!leaving)hide()});
w.addEventListener('click',function(e){if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
var a=e.target.closest&&e.target.closest('a[href]');if(!a||(a.target&&a.target!=='_self')||a.hasAttribute('download'))return;
var u=new URL(a.href,location.href);if(u.origin!==location.origin||(u.pathname===location.pathname&&u.search===location.search)||/\\.(pdf|png|jpe?g|webp|gif|svg|zip|txt|xml|json|mp3|mp4|ics)$/i.test(u.pathname))return;leaving=1;tap=performance.now();soon()});
w.addEventListener('submit',function(e){var f=e.target;if(!e.defaultPrevented&&!(f.getAttribute('target')&&f.getAttribute('target')!=='_self')){leaving=1;tap=performance.now();soon()}});
w.addEventListener('pagehide',reset);w.addEventListener('pageshow',function(e){if(e.persisted)reset()});
function quiet(e){var v=e.viewTransition;if(v)[v.ready,v.finished,v.updateCallbackDone].forEach(function(p){if(p)p.catch(function(){})})}
w.addEventListener('pageswap',function(e){quiet(e);if(e.viewTransition&&leaving&&performance.now()-tap>1000)e.viewTransition.skipTransition()});w.addEventListener('pagereveal',quiet)})(document,window)</script><!--/boot-->
'''
def boot_body(pre):
    return '<!--bootui--><div id="pgbar" aria-hidden="true"></div><!--/bootui-->\n'

def crumbs_ld(rel,s):
    """BreadcrumbList JSON-LD for sport pages (no visible trail on the page): SMU+ home > sport."""
    m=re.match(r'sports/([a-z-]+)/index\.html$',rel);t=re.search(r'<title>([^<|]+?)\s*\|',s)
    if not m or not t: return ''
    ld={'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[
        {'@type':'ListItem','position':1,'name':'SMU+','item':SITE},
        {'@type':'ListItem','position':2,'name':html.unescape(t.group(1).strip()),'item':SITE+'sports/'+m.group(1)+'/'}]}
    return '<script type="application/ld+json">'+json.dumps(ld,ensure_ascii=False)+'</script>\n'

def meta(url,root,noindex=False,desc=None,ld=''):
    img=SITE+'assets/brand/og-share.png'
    alt='The SMU+ logo on flat SMU blue, with the line SMU+ · fan concept, not affiliated with SMU'
    return ('<!--meta--><meta name="robots" content="noindex, nofollow">\n'+('' if noindex else f'<link rel="canonical" href="{url}">\n<meta property="og:url" content="{url}">\n')+
      f'<meta property="og:type" content="website">\n<meta property="og:image" content="{img}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n'
      f'<meta property="og:image:type" content="image/png">\n<meta property="og:image:alt" content="{alt}">\n'
      f'<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="{img}">\n<meta name="twitter:image:alt" content="{alt}">\n'
      +(f'<meta name="twitter:description" content="{desc}">\n' if desc else '')+
      f'<link rel="manifest" href="{root}manifest.webmanifest">\n'+ld+'<!--/meta-->\n')


# ---- Installable iPhone web app (PWA) head block: iOS meta, startup images, safe-area CSS, service worker.
# Managed like meta/boot: stripped and re-inserted on every page right after <!--/meta-->.
PWA_DEV=[(320,568,2),(375,667,2),(414,736,3),(375,812,3),(414,896,2),(414,896,3),(390,844,3),(428,926,3),(393,852,3),(430,932,3),(402,874,3),(440,956,3),(420,912,3)]
PWA_CSS=(':root{--sat:env(safe-area-inset-top,0px);--sab:env(safe-area-inset-bottom,0px);--sal:env(safe-area-inset-left,0px);--sar:env(safe-area-inset-right,0px)}'
 # status-bar strip: in the home-screen app the page runs under the status bar / Dynamic Island
 'body::before{content:"";position:fixed;z-index:9000;top:0;left:0;right:0;height:var(--sat);background:#23347a;pointer-events:none}'
 'html body{padding-top:var(--sat)}'
 'html header.site{top:var(--sat)}'
 'html .jump{top:calc(var(--hdr-h,var(--hdr)) + var(--sat))}'
 ':root{scroll-padding-top:calc(var(--hdr-h,var(--hdr)) + 56px + var(--sat))}'
 '@media(min-width:960px){html .gt-box{top:calc(var(--hdr-h,64px) + 8px + var(--sat))}}'
 'html .rec-grid aside{top:calc(var(--hdr) + var(--s5) + var(--sat))}'
 'html .policy-toc{top:calc(var(--hdr) + 24px + var(--sat))}'
 'html .wrap,html .disclaimer{padding-left:max(var(--gut),var(--sal));padding-right:max(var(--gut),var(--sar))}'
 )
def pwa_block(pre):
    reg=f"navigator.serviceWorker.register('{pre}sw.js',{{scope:'{pre or './'}'}})"
    if not pre: reg="navigator.serviceWorker.register(document.baseURI.replace(/[^/]*$/,'')+'sw.js',{scope:document.baseURI.replace(/[^/]*$/,'')})"
    return ('<!--pwa--><meta name="apple-mobile-web-app-capable" content="yes">\n'
      '<meta name="mobile-web-app-capable" content="yes">\n'
      '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">\n'
      '<meta name="apple-mobile-web-app-title" content="SMU+">\n'
      '<meta name="application-name" content="SMU+">\n'
      f'<link rel="icon" type="image/png" sizes="192x192" href="{pre}assets/brand/icon-192.png">\n'
      +''.join(f'<link rel="apple-touch-startup-image" media="screen and (device-width: {w}px) and (device-height: {h}px) and (-webkit-device-pixel-ratio: {d}) and (orientation: portrait)" href="{pre}assets/brand/splash/splash-{w*d}x{h*d}.png">\n' for w,h,d in PWA_DEV)+
      f'<style>{PWA_CSS}</style>\n'
      "<script>if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){addEventListener('load',function(){"+reg+".catch(function(){})})}</script>\n"
      '<!--/pwa-->\n')

# Feature flag lives in assets/data.js (MP.FEATURES.recruiting). Off -> recruiting/ is left out of the sitemap.
REC_ON=not re.search(r'MP\.FEATURES\.recruiting\s*=\s*false',open(REPO+'/assets/data.js').read())
pages=sorted(p for p in glob.glob(REPO+'/**/*.html',recursive=True) if '/node_modules/' not in p and '/ios-app/' not in p)
urls=[]
for p in pages:
    s=open(p).read();rel=os.path.relpath(p,REPO)
    m=re.search(r'href="((?:\.\./)*)assets/site\.css',s)
    if not m: print('skip',p);continue
    pre=m.group(1);is404=rel=='404.html'
    s=re.sub(r'(assets/site\.css)\?v=\d+',r'\1?v='+VER,s)
    # athletes page only: profiles.css right after site.css (managed, versioned)
    s=re.sub(r'\n<link rel="stylesheet" href="(?:\.\./)*assets/profiles\.css(?:\?v=\d+)?">','',s)
    s=re.sub(r'\n<link rel="stylesheet" href="(?:\.\./)*assets/games\.css(?:\?v=\d+)?">','',s)
    if rel=='games/index.html': s=re.sub(r'(<link rel="stylesheet" href="((?:\.\./)*)assets/site\.css\?v=\d+">)',lambda m_:m_.group(1)+'\n<link rel="stylesheet" href="'+m_.group(2)+'assets/games.css?v='+VER+'">',s,count=1)
    if rel=='athletes/index.html': s=re.sub(r'(<link rel="stylesheet" href="((?:\.\./)*)assets/site\.css\?v=\d+">)',lambda m_:m_.group(1)+'\n<link rel="stylesheet" href="'+m_.group(2)+'assets/profiles.css?v='+VER+'">',s,count=1)
    s=re.sub(r'\n?<script src="(?:\.\./)*assets/[a-z-]+\.js(?:\?v=\d+)?"(?: defer)?></script>','',s)
    s=s.replace('</body>','\n'.join('<script src="%sassets/%s?v=%s" defer></script>'%(pre,f,VER) for f in SCRIPTS if rel in ONLY_ON.get(f,(rel,)))+'\n</body>',1)
    # managed blocks: strip then re-insert
    s=re.sub(r'<!--(meta|boot|bootui|pwa)-->.*?<!--/\1-->\n?','',s,flags=re.S)
    s=re.sub(r'<div class="disclaimer" role="note">.*?</div>',lambda m_:DISC(pre),s,count=1,flags=re.S)
    s=re.sub(r'<meta name="twitter:card" content="summary">\n','',s)
    s=re.sub(r'<meta name="robots" content="noindex">\n','',s)
    url=SITE+re.sub(r'index\.html$','',rel)
    s=re.sub(r'(<link rel="apple-touch-icon"[^>]*>\n)',lambda m_:m_.group(1)+meta(url,pre,is404,(re.search(r'<meta property="og:description" content="([^"]*)">',s) or [None,None])[1],crumbs_ld(rel,s)),s,count=1)
    s=s.replace('<!--/meta-->\n','<!--/meta-->\n'+pwa_block(pre),1)
    s=s.replace('<link rel="stylesheet" href="',BOOT_HEAD.replace('{PRE}',pre)+'<link rel="stylesheet" href="',1)
    s=re.sub(r'(<body[^>]*>\n)',lambda m_:m_.group(1)+boot_body(pre),s,count=1)
    open(p,'w').write(s)
    if not is404 and not (rel=='recruiting/index.html' and not REC_ON): urls.append(url)
    print(rel,pre or './')

today=time.strftime('%Y-%m-%d')
open(REPO+'/sitemap.xml','w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
  ''.join(f'  <url><loc>{html.escape(u)}</loc><lastmod>{today}</lastmod></url>\n' for u in urls)+'</urlset>\n')
# Approved 2026-10-26: keep the concept out of search engines (same URL keeps serving).
open(REPO+'/robots.txt','w').write('User-agent: *\nDisallow: /\n')
json.dump({'id':'./','name':'SMU+','short_name':'SMU+','description':'Concept SMU fan membership site for an SMU Cox class project. Not affiliated with, endorsed by, or sponsored by SMU, SMU Athletics, Mustang Partners or Learfield.',
  'lang':'en-US','dir':'ltr','start_url':'./','scope':'./','display':'standalone','background_color':'#354CA1','theme_color':'#23347a','categories':['sports','entertainment'],
  'icons':[{'src':'assets/brand/icon-192.png','sizes':'192x192','type':'image/png','purpose':'any'},
           {'src':'assets/brand/icon-512.png','sizes':'512x512','type':'image/png','purpose':'any'},
           {'src':'assets/brand/icon-maskable-512.png','sizes':'512x512','type':'image/png','purpose':'maskable'}]},
  open(REPO+'/manifest.webmanifest','w'),indent=2)
open(REPO+'/manifest.webmanifest','a').write('\n')
print('VER',VER,'urls',len(urls))
