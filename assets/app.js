/* Mustangs+ concept site. Shared header/footer, demo modal and per-page renderers. */
(function(){
  var MP=window.MP, body=document.body, ROOT=body.dataset.root||'', PAGE=body.dataset.page||'home';
  function $(s,el){return (el||document).querySelector(s)}
  function $$(s,el){return Array.prototype.slice.call((el||document).querySelectorAll(s))}
  function esc(s){return String(s).replace(/[&<>\"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]})}
  function money(n){return '$'+Math.round(n).toLocaleString()}
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}

  var PLUS='<svg viewBox=\"0 0 20 20\"><path d=\"M8 2h4v6h6v4h-6v6H8v-6H2V8h6z\" fill=\"#fff\"/></svg>';
  var LOCK='<svg viewBox=\"0 0 24 24\"><path d=\"M17 9V7A5 5 0 0 0 7 7v2H5v13h14V9zM9 7a3 3 0 0 1 6 0v2H9z\"/></svg>';
  // ... rest of original functions remain, content array updated below ...
  function home(){
    var content=[
      {t:'video',label:'Docuseries',title:'Boulevard Nights: Ford Stadium',desc:'All-access from the tunnel to the final whistle. Episode 3 of the fall series.',dur:'28:44',lock:true,art:'linear-gradient(135deg,#CC0035 0%,#4A0014 50%,#0F1A3C 100%)'},
      {t:'article',label:'Feature',title:'The Walk-On Who Became the Heart of the Defense',desc:'How a former high-school safety turned himself into a Saturday starter through film and relentless work.',dur:'9 min read',lock:true,art:'linear-gradient(160deg,#0F1A3C 0%,#2A3F9A 100%)'},
      {t:'podcast',label:'Podcast',title:\"The Coach's Corner: ACC Reality\",desc:'Head coach on the transition, recruiting in the NIL era, and what Saturday nights feel like now.',dur:'46 min',lock:true,art:'radial-gradient(circle at 30% 30%,#FF4D6D 0%,#CC0035 40%,#0F1A3C 100%)'},
      {t:'video',label:'Game Week',title:'Rivalry Week: Inside the Building',desc:'Walkthroughs, film sessions, and the bus ride. Members-only access.',dur:'19:12',lock:true,art:'linear-gradient(115deg,#0F1A3C 0 40%,#CC0035 40% 55%,#0F1A3C 55% 100%)'},
      {t:'article',label:'Interview',title:'Building the Roster in 90 Days',desc:\"Women's basketball coach on transfers, culture, and why the NIL fund changed the math.\",dur:'7 min read',lock:false,art:'linear-gradient(200deg,#E8ECF4 0%,#6B7488 40%,#0F1A3C 100%)'},
      {t:'podcast',label:'Podcast',title:'Pony Up: Athletes Unfiltered',desc:'Players host. Pregame rituals, playlists, and the real cost of competing at this level.',dur:'35 min',lock:true,art:'conic-gradient(from 200deg at 60% 40%,#CC0035,#0F1A3C,#2A3F9A,#CC0035)'},
      {t:'article',label:'Story',title:'5 a.m. Laps and the Quiet Grind of Swim',desc:'Behind the lane lines with the freestyle group as they prepare for conference.',dur:'6 min read',lock:true,art:'linear-gradient(180deg,#1A2A6B 0%,#0A1020 100%)'},
      {t:'video',label:'Mic\'d Up',title:'Setter\'s Timeout: The Huddle You Never Hear',desc:'Raw audio from Saturday\'s match. How the rotation change was called in real time.',dur:'12:08',lock:true,art:'linear-gradient(135deg,#CC0035,#1A2A6B)'},
      {t:'article',label:'Recruiting',title:'Visit Weekend: Two Guards, One Impression',desc:'What the staff saw and why the NIL numbers mattered in the room.',dur:'5 min read',lock:true,art:'linear-gradient(145deg,#0F1A3C,#354CA1)'}
    ];
    var grid=$('#grid');grid.innerHTML=content.map(cardHTML).join('');
    // remaining home() logic unchanged
  }
  // rest of file remains as original
})();
