/* Game-day stats blocks for games/?id=... (box score, team stats, leaders, scoring summary, season comparison,
   last meeting). Data: MP.BOX from assets/boxscores.js, built by tools/build_boxscores.py from official pages.
   Renders nothing for a game with no data, and leaves out any block whose data is missing. */
(function(){var MP=window.MP=window.MP||{};
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  var EXT=' <svg class="ext-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14zM5 5h6v2H7v10h10v-4h2v6H5z"/></svg>';
  var MONS=['Jan.','Feb.','March','April','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'];
  function day(d){var x=new Date(d+'T12:00:00Z');return MONS[x.getUTCMonth()]+' '+x.getUTCDate()+', '+x.getUTCFullYear()}
  function root(){return (document.body&&document.body.getAttribute('data-root'))||'./'}
  function nm(s){return String(s||'').toLowerCase().replace(/\b(jr|sr|ii|iii|iv)\b\.?/g,'').replace(/[^a-z]+/g,' ').trim()}
  /* a leader's name links to their SMU+ profile when one exists for this sport */
  function profile(name,sport){var A=MP.ATHLETES||[],k=nm(name);for(var i=0;i<A.length;i++){var a=A[i];if(a.sport===sport&&nm(a.name)===k)return root()+'athletes/?id='+encodeURIComponent(a.id)}return ''}
  function out(href,label){return href?'<a class="gm-out" href="'+esc(href)+'" target="_blank" rel="noopener">'+label+EXT+'</a>':''}
  function srcLine(src,extra){return '<p class="gs-src">'+(extra||'')+'Source: '+src.map(function(s){return '<a href="'+esc(s.u)+'" target="_blank" rel="noopener">'+esc(s.n)+'</a>'}).join(' and ')+
    (MP.BOX&&MP.BOX.checked?', checked '+esc(MP.BOX.checked):'')+'.</p>'}

  /* side-by-side comparison: SMU on the left in blue, the opponent on the right */
  function compare(rows,opp,title,label){
    return '<div class="gs-cmp" role="table" aria-label="'+esc(label)+'">'+
      '<div class="gs-cmp-hd" role="row"><span role="columnheader">SMU</span><span role="columnheader" class="sr">Stat</span><span role="columnheader">'+esc(opp)+'</span></div>'+
      rows.map(function(r){var has=typeof r.sv==='number'&&typeof r.ov==='number'&&(r.sv+r.ov)>0,ps=has?Math.round(r.sv/(r.sv+r.ov)*100):0,
          sb=has&&(r.low?r.sv<r.ov:r.sv>r.ov),ob=has&&(r.low?r.ov<r.sv:r.ov>r.sv);
        return '<div class="gs-row" role="row"><span class="gs-v'+(sb?' best':'')+'" role="cell">'+esc(r.s)+'</span><span class="gs-l" role="rowheader">'+esc(r.l)+'</span><span class="gs-v gs-vo'+(ob?' best':'')+'" role="cell">'+esc(r.o)+'</span>'+
          (has?'<span class="gs-bar" aria-hidden="true"><i style="width:'+ps+'%"></i><b style="width:'+(100-ps)+'%"></b></span>':'')+'</div>'}).join('')+'</div>'}

  function lineScore(L,g){var maxT=Math.max(L.rows[0].tot,L.rows[1].tot);
    return '<div class="gs-ls-wrap"><table class="gs-ls"><caption class="sr">Score by '+(g.sport==='mens-basketball'?'half':'quarter')+'</caption><thead><tr><th scope="col">Team</th>'+
      L.h.map(function(h){return '<th scope="col">'+esc(h)+'</th>'}).join('')+'<th scope="col">Final</th></tr></thead><tbody>'+
      L.rows.map(function(r){return '<tr'+(r.smu?' class="smu"':'')+'><th scope="row">'+esc(r.t)+'</th>'+r.s.map(function(v){return '<td>'+v+'</td>'}).join('')+'<td class="tot'+(r.tot===maxT?' win':'')+'">'+r.tot+'</td></tr>'}).join('')+
      '</tbody></table></div>'}

  function leaderCell(p,sport,team){if(!p)return '<div class="gs-pl"><span class="gs-pl-t">'+esc(team)+'</span><span class="gs-pl-n">No stats</span></div>';
    var href=team==='SMU'?profile(p.n,sport):'';
    return '<div class="gs-pl"><span class="gs-pl-t">'+esc(team)+(p.no?' \u00b7 #'+esc(p.no):'')+'</span>'+
      (href?'<a class="gs-pl-n" href="'+href+'">'+esc(p.n)+'</a>':'<span class="gs-pl-n">'+esc(p.n)+'</span>')+
      '<span class="gs-pl-v"><b>'+esc(p.v)+'</b>'+(p.d?' \u00b7 '+esc(p.d):'')+'</span></div>'}
  function leaders(L,g){return '<div class="gs-lead">'+L.map(function(c){return '<div class="gs-lc"><h4>'+esc(c.c)+'</h4><div class="gs-lc-p">'+leaderCell(c.s,g.sport,'SMU')+leaderCell(c.o,g.sport,g.opp)+'</div></div>'}).join('')+'</div>'}

  function scoring(S,g){var q='',h='';S.forEach(function(p){if(p.q!==q){if(q)h+='</ol>';q=p.q;h+='<h4 class="gs-q">'+esc(p.q)+' quarter</h4><ol class="gs-plays">'}
      h+='<li class="'+(p.smu?'smu':'')+'"><span class="gs-pt"><b>'+esc(p.smu?'SMU':g.opp)+'</b><small>'+esc(p.clk)+'</small></span><span class="gs-px">'+esc(p.txt)+(p.dr?'<small>'+esc(p.dr)+'</small>':'')+'</span>'+
        '<span class="gs-ps" aria-label="SMU '+p.ss+', '+esc(g.opp)+' '+p.os+'">'+p.ss+'\u2013'+p.os+'</span></li>'});
    return '<p class="gs-sk">Score shown as SMU\u2013'+esc(g.opp)+'</p>'+h+(q?'</ol>':'')}

  MP.gameStats=function(g){var B=MP.BOX&&MP.BOX.games&&MP.BOX.games[g.id];if(!B)return '';var h='';
    if(B.kind==='final'&&g.res){
      var top='';
      if(B.line)top+='<article class="gm-card gs-card"><h3 class="gm-h">Score by '+(g.sport==='mens-basketball'?'half':'quarter')+'</h3>'+lineScore(B.line,g)+
        (B.att?'<p class="gs-att">Attendance: '+esc(B.att)+'</p>':'')+'</article>';
      if(B.stats&&B.stats.length)top+='<article class="gm-card gs-card"><h3 class="gm-h">Team stats</h3>'+compare(B.stats,g.opp,'Team stats','Team stats, SMU and '+g.opp)+'</article>';
      var side='';
      if(B.leaders&&B.leaders.length)side+='<article class="gm-card gs-card"><h3 class="gm-h">Game leaders</h3>'+leaders(B.leaders,g)+'</article>';
      if(B.scoring&&B.scoring.length)side+='<article class="gm-card gs-card"><h3 class="gm-h">Scoring summary</h3>'+scoring(B.scoring,g)+'</article>';
      if(!top&&!side)return '';
      h='<section class="sec gm-stats" id="box"><div class="wrap"><div class="sec-hd"><div><h2 class="sec-t">Box score</h2></div></div>'+
        '<div class="gs-grid"><div class="gs-col">'+top+'</div><div class="gs-col">'+side+'</div></div>'+
        '<div class="gs-foot">'+out(B.box,B.box&&/boxscore/.test(B.box)?'Full box score':'Full stats on Game Center')+srcLine(B.src)+'</div></div></section>'}
    else if(B.kind==='pre'&&!g.res){
      var parts='';
      if(B.season)parts+='<article class="gm-card gs-card"><h3 class="gm-h">Season so far</h3>'+compare(B.season.rows,g.opp,'Season so far','Season to date, SMU and '+g.opp)+srcLine(B.season.src)+'</article>';
      if(B.last){var m=/^([WLT]) (\d+)-(\d+)/.exec(B.last.res||''),verb=m?(m[1]==='W'?'SMU won':m[1]==='L'?'SMU lost':'Tied'):'';
        if(m)parts+='<article class="gm-card gs-card gs-last"><h3 class="gm-h">Last meeting</h3><p class="gs-last-r"><b>'+verb+' '+(+m[2])+'\u2013'+(+m[3])+'</b></p>'+
          '<p class="gs-last-d">'+day(B.last.d)+(B.last.opp&&nm(B.last.opp)!==nm(g.opp)?' \u00b7 listed as '+esc(B.last.opp)+' on SMU\u2019s schedule':'')+'</p>'+
          '<p class="gm-links">'+out(B.last.u,'Box score')+'</p>'+srcLine([{n:'SMU Athletics schedule',u:B.last.src}])+'</article>'}
      if(!parts)return '';
      h='<section class="sec gm-stats" id="matchup"><div class="wrap"><div class="sec-hd"><div><h2 class="sec-t">By the numbers</h2></div></div><div class="gs-pre'+(B.season&&B.last?'':' one')+'">'+parts+'</div></div></section>'}
    return h};
})();
