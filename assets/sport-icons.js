/* SMU+ roster-card fallback art: one hand-drawn SVG per sport, used when an athlete has no photo.
   One stroke style everywhere (2.5px, round caps and joins), flat SMU colours, no gradients.
   MP.sportIcon(slug, number, tone) -> SVG string. tone: 'dark' (blue/navy tile) or 'light' (white tile). */
(function(){
  var MP=window.MP=window.MP||{};
  var BLUE='#354CA1',NAVY='#1c2a63',RED='#CC0035',WHITE='#fff';
  function pal(tone){return tone==='light'?{body:BLUE,line:NAVY,num:WHITE,acc:RED,soft:'#e6e9f5'}:{body:WHITE,line:WHITE,num:BLUE,acc:RED,soft:'rgba(255,255,255,.2)'}}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  var S=' stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"';
  function num(n,x,y,size,c){if(n==null||n==='')return '';n=String(n);var fs=size*(n.length>2?.62:n.length>1?.85:1);
    return '<text x="'+x+'" y="'+y+'" text-anchor="middle" font-family="Anton,Impact,\'Arial Narrow\',sans-serif" font-size="'+fs.toFixed(1)+'" fill="'+c+'" letter-spacing=".5">'+esc(n)+'</text>'}
  function wrap(inner,label){return '<svg class="sport-ic" viewBox="0 0 120 120" role="img" aria-label="'+esc(label)+'">'+inner+'</svg>'}
  var DRAW={
    /* sleeveless tank: deep armholes, wide straps, scoop neck */
    basketball:function(n,p){return '<path d="M41 13 Q60 31 79 13 L89 15 Q87 39 99 49 V108 H21 V49 Q33 39 31 15 Z" fill="'+p.body+'" stroke="'+p.line+'"'+S+'/>'+
      '<path d="M41 13 Q60 31 79 13" fill="none" stroke="'+p.acc+'" stroke-width="4.5" stroke-linecap="round"/><path d="M31 15 Q33 39 21 49 M89 15 Q87 39 99 49" fill="none" stroke="'+p.acc+'" stroke-width="3.5" stroke-linecap="round"/>'+
      '<path d="M21 100 H99" stroke="'+p.acc+'" stroke-width="3" stroke-linecap="round"/>'+num(n,60,86,40,p.num)},
    /* football: padded shoulders, short sleeves with stripes, V collar */
    football:function(n,p){return '<path d="M38 18 Q60 8 82 18 Q98 18 110 30 L104 56 L92 52 V108 H28 V52 L16 56 L10 30 Q22 18 38 18 Z" fill="'+p.body+'" stroke="'+p.line+'"'+S+'/>'+
      '<path d="M22 24 Q30 34 30 48 M98 24 Q90 34 90 48" fill="none" stroke="'+p.soft+'" stroke-width="2.5" stroke-linecap="round"/>'+
      '<path d="M48 15 L60 28 L72 15" fill="none" stroke="'+p.acc+'" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'+
      '<path d="M12 38 L22 41 M108 38 L98 41 M14 32 L24 35 M106 32 L96 35" stroke="'+p.acc+'" stroke-width="3" stroke-linecap="round"/>'+num(n,60,88,40,p.num)},
    /* soccer: short sleeves, polo collar */
    soccer:function(n,p){return '<path d="M44 14 L52 11 H68 L76 14 L104 30 L96 49 L86 45 V108 H34 V45 L24 49 L16 30 Z" fill="'+p.body+'" stroke="'+p.line+'"'+S+'/>'+
      '<path d="M52 11 L60 22 L68 11 M52 11 L48 22 L56 25 M68 11 L72 22 L64 25" fill="none" stroke="'+p.acc+'" stroke-width="3"'+' stroke-linecap="round" stroke-linejoin="round"/>'+
      '<path d="M98 43 L88 39 M22 43 L32 39" stroke="'+p.acc+'" stroke-width="3" stroke-linecap="round"/>'+num(n,60,86,36,p.num)},
    /* volleyball: cap sleeves, round neck */
    volleyball:function(n,p){return '<path d="M42 13 Q60 23 78 13 L93 18 Q101 28 99 41 L88 42 V108 H32 V42 L21 41 Q19 28 27 18 Z" fill="'+p.body+'" stroke="'+p.line+'"'+S+'/>'+
      '<path d="M42 13 Q60 23 78 13" fill="none" stroke="'+p.acc+'" stroke-width="4" stroke-linecap="round"/><path d="M27 18 Q24 30 21 41 M93 18 Q96 30 99 41" fill="none" stroke="'+p.acc+'" stroke-width="3" stroke-linecap="round"/>'+num(n,60,86,38,p.num)},
    /* swim cap with the number on it, goggles below */
    swim:function(n,p){return '<path d="M20 74 Q18 24 60 22 Q102 24 100 74 Q60 86 20 74 Z" fill="'+p.body+'" stroke="'+p.line+'"'+S+'/>'+
      '<path d="M28 44 Q60 30 92 44" fill="none" stroke="'+p.acc+'" stroke-width="3" stroke-linecap="round"/>'+num(n,60,70,30,p.num)+
      '<path d="M16 88 H104" stroke="'+p.line+'" stroke-width="2.5" stroke-linecap="round"/><rect x="34" y="82" width="20" height="13" rx="6.5" fill="'+p.acc+'" stroke="'+p.line+'"'+S+'/><rect x="66" y="82" width="20" height="13" rx="6.5" fill="'+p.acc+'" stroke="'+p.line+'"'+S+'/>'},
    /* golf ball on a tee */
    golf:function(n,p){return '<circle cx="60" cy="48" r="26" fill="'+p.body+'" stroke="'+p.line+'"'+S+'/>'+
      [[50,38],[62,34],[72,42],[54,50],[66,52],[48,60],[60,64],[72,58]].map(function(d){return '<circle cx="'+d[0]+'" cy="'+d[1]+'" r="2.4" fill="'+p.soft.replace('rgba(255,255,255,.2)','#c9d0ea')+'"/>'}).join('')+
      '<path d="M46 76 H74 L64 84 V106 Q60 110 56 106 V84 Z" fill="'+p.acc+'" stroke="'+p.line+'"'+S+'/>'},
    /* tennis racket with a ball */
    tennis:function(n,p){return '<g transform="rotate(-35 54 54)"><ellipse cx="54" cy="44" rx="24" ry="30" fill="none" stroke="'+p.line+'" stroke-width="5"/>'+
      '<path d="M42 20 V68 M54 14 V74 M66 20 V68 M31 32 H77 M30 44 H78 M31 56 H77" stroke="'+p.line+'" stroke-width="1.6" opacity=".7"/>'+
      '<path d="M54 74 V82" stroke="'+p.line+'" stroke-width="5" stroke-linecap="round"/><rect x="49" y="82" width="10" height="28" rx="4" fill="'+p.acc+'" stroke="'+p.line+'"'+S+'/></g>'+
      '<circle cx="92" cy="88" r="12" fill="#fff" stroke="'+p.line+'"'+S+'/><path d="M82 82 Q92 88 82 95 M102 81 Q92 88 102 95" fill="none" stroke="'+p.line+'" stroke-width="2"/>'},
    /* racing singlet with a bib number */
    track:function(n,p){return '<path d="M45 12 Q60 26 75 12 L82 14 Q82 36 94 46 V108 H26 V46 Q38 36 38 14 Z" fill="'+p.body+'" stroke="'+p.line+'"'+S+'/>'+
      '<path d="M45 12 Q60 26 75 12" fill="none" stroke="'+p.acc+'" stroke-width="3.5" stroke-linecap="round"/>'+
      '<rect x="38" y="56" width="44" height="32" rx="3" fill="#fff" stroke="'+(p.body===WHITE?BLUE:NAVY)+'"'+S+'/><circle cx="42.5" cy="60.5" r="1.6" fill="'+RED+'"/><circle cx="77.5" cy="60.5" r="1.6" fill="'+RED+'"/>'+num(n==null||n===''?'SMU':n,60,82,22,BLUE)},
    /* oar blade */
    rowing:function(n,p){return '<path d="M18 104 L74 48" stroke="'+p.line+'" stroke-width="6" stroke-linecap="round"/><path d="M26 96 L34 104" stroke="'+p.acc+'" stroke-width="5" stroke-linecap="round"/>'+
      '<path d="M70 52 Q66 30 86 16 Q104 6 108 14 Q114 24 102 40 Q88 58 70 52 Z" fill="'+p.body+'" stroke="'+p.line+'"'+S+'/><path d="M80 44 Q84 28 100 18" fill="none" stroke="'+p.acc+'" stroke-width="3.5" stroke-linecap="round"/>'},
    /* horseshoe with nail holes */
    equestrian:function(n,p){return '<path d="M30 102 L26 60 Q24 18 60 18 Q96 18 94 60 L90 102 L76 102 L80 62 Q82 34 60 34 Q38 34 40 62 L44 102 Z" fill="'+p.body+'" stroke="'+p.line+'"'+S+'/>'+
      [[33,82],[32,64],[38,44],[87,82],[88,64],[82,44]].map(function(d){return '<rect x="'+(d[0]-2)+'" y="'+(d[1]-3.5)+'" width="4" height="7" rx="1.5" fill="'+p.acc+'"/>'}).join('')}
  };
  var BY={'football':'football','mens-basketball':'basketball','womens-basketball':'basketball','womens-soccer':'soccer','mens-soccer':'soccer','volleyball':'volleyball',
    'swimming-diving':'swim','golf':'golf','tennis':'tennis','track-field':'track','rowing':'rowing','equestrian':'equestrian'};
  var NAME={basketball:'Basketball tank top',football:'Football jersey with shoulder pads',soccer:'Soccer kit',volleyball:'Volleyball jersey',swim:'Swim cap',golf:'Golf ball on a tee',tennis:'Tennis racket and ball',track:'Racing singlet with bib',rowing:'Rowing oar blade',equestrian:'Horseshoe'};
  MP.sportIconKind=function(slug){return BY[slug]||(/basketball/.test(slug)?'basketball':/soccer/.test(slug)?'soccer':/football/.test(slug)?'football':'track')};
  MP.sportIcon=function(slug,n,tone){var k=MP.sportIconKind(slug);return wrap(DRAW[k](n,pal(tone)),NAME[k]+(n!=null&&n!==''&&k!=='golf'&&k!=='tennis'&&k!=='rowing'&&k!=='equestrian'?' with number '+n:''))};
})();
