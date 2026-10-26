/* Page controllers for the SMU+ student engagement pages. Needs engage.js (window.ENG). */
(function(){
  'use strict';
  var E=window.ENG,U=E.ui,esc=U.esc,fmt=U.fmt,$=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var PAGE=document.body.getAttribute('data-eng'),ROOT=U.root();
  var CLASSES=[[2027,'Senior'],[2028,'Junior'],[2029,'Sophomore'],[2030,'First-year']];
  function cy(y){return y?'\u2019'+String(y).slice(-2):''}
  function bars(){var b=$('#egBars');if(b)b.innerHTML=U.demoBar()+U.clockBar()}
  function qrSVG(text,cell){var q=qrcode(0,'M');q.addData(text);q.make();return q.createSvgTag({cellSize:cell||8,margin:0,scalable:true})}
  function gameCard(g,state){var w=E.windowFor(g);
    return '<div class="eg-matchup"><div class="vs"><span>SMU vs</span>'+esc(g.opp)+'</div></div>'+
      '<div class="eg-when"><span><b>'+esc(U.koLabel(g))+'</b></span><span>'+esc(g.venue)+'</span>'+(g.tv?'<span>'+esc(g.tv)+'</span>':'')+(g.note?'<span>'+esc(g.note)+'</span>':'')+'</div>'+
      '<div class="eg-window'+(state==='open'?' open':'')+'">'+(state==='open'?'<span class="eg-dot" aria-hidden="true"></span><b>Check-in is open</b> until '+U.time(w.closes)+' CT. In by '+U.time(new Date(+g.ko-E.RULES.earlyMins*6e4))+' for the early bonus.':
        state==='tbd'?'SMU hasn\u2019t set a kickoff time yet. Check-in opens 2 hours before kickoff once it\u2019s announced.':
        'Check-in opens '+U.dt(w.opens,{weekday:'long',month:'short',day:'numeric'})+' at '+U.time(w.opens)+' CT, 2 hours before kickoff.')+'</div>'}
  function clockBtn(g){return (!E.live&&g&&g.ko)?'<button type="button" class="btn btn-outline btn-sm" data-clock="'+g.id+'">Demo: pretend it\u2019s game day</button>':''}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-clock]');if(b){E.setClock(b.getAttribute('data-clock'));U.toast('Demo clock set to an hour before kickoff.')}});

  /* ================= student/ ================= */
  function student(){var main=$('#egMain');
    function render(){E.summary().then(function(m){bars();main.innerHTML=m.verified?dash(m):join(m);wire(m)})}
    function rulesCard(){var R=E.RULES;return '<div class="eg-card"><p class="eg-kicker">How points work</p><h2>Earned at the gate</h2><ul class="eg-rules">'+
      '<li><span>Check in at a home game<small>Scan the gate screen at the student entrance</small></span><b>+'+R.checkin+'</b></li>'+
      '<li><span>Early arrival<small>In the gates 45+ minutes before kickoff</small></span><b>+'+R.early+'</b></li>'+
      '<li><span>Streak<small>+'+R.streakEach+' for each home game in a row before this one</small></span><b>up to +'+R.streakMax+'</b></li>'+
      '<li><span>Milestones<small>3rd and 5th check-in, then every home game</small></span><b>+150 / +250 / +500</b></li>'+
      '<li><span>Verify your @smu.edu email<small>Once</small></span><b>+'+R.welcome+'</b></li></ul>'+
      '<p style="margin-top:var(--s3);font-size:13px">'+U.labelTag()+'</p></div>'}
    function join(m){var signedIn=m.signed_in||(window.SMU&&SMU.user);
      var form=E.live&&!signedIn?'<p>Sign in with your @smu.edu email first, then come back here to verify.</p><div class="eg-btns"><a class="btn btn-red" href="'+ROOT+'account/#signup">Create account</a><a class="btn btn-outline" href="'+ROOT+'account/">Sign in</a></div>':
        '<form id="egJoin" class="eg-form" novalidate>'+
        (E.live?'<p>Signed in as <b>'+esc(SMU.user.email)+'</b>.</p>':'<div class="eg-fld"><label for="egEmail">SMU email</label><input id="egEmail" type="email" inputmode="email" autocomplete="email" placeholder="you@smu.edu" required value="'+esc(window.SMU&&SMU.user?SMU.user.email:'')+'"><small>Demo: nothing is sent. Any address ending in @smu.edu works.</small></div>'+
          (window.SMU&&SMU.user?'':'<div class="eg-fld"><label for="egName">Name on the leaderboard</label><input id="egName" maxlength="40" autocomplete="nickname" placeholder="First name and last initial"></div>'))+
        '<div class="eg-fld"><label for="egClass">Class year</label><select id="egClass" required><option value="">Choose</option>'+CLASSES.map(function(c){return '<option value="'+c[0]+'">Class of '+c[0]+' \u00b7 '+c[1]+'</option>'}).join('')+'</select></div>'+
        '<p class="eg-msg" aria-live="polite"></p><button class="btn btn-red" type="submit">Verify and get +'+E.RULES.welcome+'</button></form>';
      return '<section class="eg-sec"><div class="wrap eg-grid"><div class="eg-card"><p class="eg-kicker">Student account</p><h2>Verify you\u2019re a student</h2>'+
        '<p style="margin-bottom:var(--s4)">Student points are for current SMU students. Verify with your @smu.edu email, pick your class year, and your check-ins start counting.</p>'+form+'</div>'+rulesCard()+'</div></section>'}
    function strip(m){var nx=E.nextGame();return '<ol class="eg-games">'+E.GAMES.map(function(g){var c=m.checked[g.id],s=E.gameState(g),cls=c?'in':s==='final'?'missed':s==='open'?'open':(nx&&nx.id===g.id?'next':'');
      return '<li class="eg-game '+cls+'"><small>'+esc(U.dt(new Date(g.date+'T12:00:00-06:00'),{month:'short',day:'numeric'}))+'</small><b>'+esc(g.opp)+'</b><em>'+
        (c?'In \u00b7 +'+fmt(c.points):s==='final'?'Missed':s==='open'?'Open now':nx&&nx.id===g.id?'Next up':s==='tbd'?'Time TBA':'Upcoming')+'</em></li>'}).join('')+'</ol>'}
    function dash(m){var nx=E.openGame()||E.nextGame(),st=nx&&E.gameState(nx);
      return '<section class="eg-sec"><div class="wrap eg-grid"><div>'+
        '<div class="eg-card eg-dark"><p class="eg-kicker">Your points \u00b7 '+(m.class_year?'Class of '+m.class_year:'SMU student')+'</p>'+
          '<div class="eg-balance"><b id="egBal" data-from="0">0</b><span>points to spend</span></div>'+
          '<dl class="eg-stats"><div><dt>Season</dt><dd>'+fmt(m.season_earned)+'</dd></div><div><dt>Check-ins</dt><dd>'+m.checkins+'<small>of '+E.GAMES.length+'</small></dd></div><div><dt>Streak</dt><dd>'+m.streak+'<small>'+(m.streak===1?'game':'games')+'</small></dd></div></dl>'+
          U.tierBar(m.tier,m.season_earned)+'<p style="margin-top:var(--s4);font-size:13px">'+U.labelTag()+'</p></div>'+
        '<div class="eg-card"><p class="eg-kicker">2026 home games \u00b7 Ford Stadium</p><h2>Your season</h2>'+strip(m)+'</div>'+
        '<div class="eg-card"><p class="eg-kicker">Activity</p><h2>Points history</h2>'+U.historyList(m.history,30)+'</div></div><div>'+
        (nx?'<div class="eg-card eg-dark"><p class="eg-kicker">'+(st==='open'?'Happening now':'Next home game')+'</p>'+gameCard(nx,st)+
          '<div class="eg-btns"><a class="btn btn-red" href="'+ROOT+'checkin/">'+(m.checked[nx.id]?'You\u2019re checked in':'Go to check-in')+'</a>'+(st==='open'?'':clockBtn(nx))+'</div></div>':'')+
        '<div class="eg-card"><p class="eg-kicker">Spend them</p><h2>Rewards</h2><p>Concessions, gear and better seats. '+fmt(m.balance)+' points available.</p><div class="eg-btns"><a class="btn btn-navy" href="'+ROOT+'rewards/">See rewards</a><a class="btn btn-outline" href="'+ROOT+'leaderboard/">Leaderboard</a></div>'+
          (m.redemptions.length?'<h3 class="eg-h" style="font-size:18px;margin-top:var(--s5)">Your codes</h3><ul class="eg-redeemed">'+m.redemptions.map(function(r){return '<li><span>'+esc(r.reward)+'</span><code>'+esc(r.code)+'</code></li>'}).join('')+'</ul>':'')+'</div>'+
        '<div class="eg-card"><p class="eg-kicker">Settings</p><label class="eg-switch"><span>Show me on the leaderboard<small style="display:block;color:var(--ink-2);font-size:13px">Only your name, class year and points are shown.</small></span><input type="checkbox" id="egShow"'+(m.show_on_leaderboard?' checked':'')+'></label>'+
          (E.live?'':'<div class="eg-btns" style="border-top:1px solid var(--line);padding-top:var(--s4)"><button type="button" class="btn btn-outline btn-sm" id="egSample">Demo: fill in a sample season</button><button type="button" class="eg-link" id="egReset">Reset demo points</button></div>')+'</div>'+
        rulesCard()+'</div></div></section>'}
    function wire(m){var f=$('#egJoin');
      if(f)f.addEventListener('submit',function(e){e.preventDefault();var msg=$('.eg-msg',f),btn=$('button[type=submit]',f);
        var o={email:E.live?SMU.user.email:$('#egEmail').value,name:($('#egName')||{}).value,class_year:$('#egClass').value};
        if(!o.class_year){msg.textContent='Pick your class year.';return}
        btn.disabled=true;E.verify(o).then(function(r){btn.disabled=false;if(!r.ok){msg.textContent=r.message;return}U.toast('Verified. +'+(r.bonus||0)+' points.');render()},function(err){btn.disabled=false;msg.textContent=err.message||'Something went wrong.'})});
      var bal=$('#egBal');if(bal)U.countUp(bal,m.balance,900);
      var sh=$('#egShow');if(sh)sh.addEventListener('change',function(){E.setVisible(sh.checked).then(function(){U.toast(sh.checked?'You\u2019re on the leaderboard.':'Hidden from the leaderboard.')})});
      var sm=$('#egSample');if(sm)sm.addEventListener('click',function(){E.sampleSeason().then(function(){U.toast('Sample season added (demo).');render()})});
      var rs=$('#egReset');if(rs)rs.addEventListener('click',function(){if(confirm('Clear your demo points, check-ins and codes in this browser?'))E.reset().then(render)})}
    E.ready.then(render);E.on('change',render)}

  /* ================= checkin/ ================= */
  function checkin(){var main=$('#egMain'),params=new URLSearchParams(location.search),stream=null,scanning=false;
    function stop(){scanning=false;if(stream){stream.getTracks().forEach(function(t){t.stop()});stream=null}}
    function render(){stop();E.summary().then(function(m){bars();var g=(params.get('g')&&E.gameById(params.get('g')))||E.openGame()||E.nextGame(),st=g&&E.gameState(g);
      if(!g){main.innerHTML='<section class="eg-sec"><div class="wrap"><div class="eg-card"><h2>No home games left</h2><p>That\u2019s the 2026 home schedule. See you next season.</p></div></div></section>';return}
      var done=m.checked[g.id];
      var right=!m.verified?'<div class="eg-card"><p class="eg-kicker">One step first</p><h2>Verify you\u2019re a student</h2><p>Check-ins count for verified SMU students. It takes a minute with your @smu.edu email.</p><div class="eg-btns"><a class="btn btn-red" href="'+ROOT+'student/">Verify my student account</a></div></div>':
        done?'<div class="eg-card"><p class="eg-kicker">You\u2019re in</p><h2>Checked in vs '+esc(g.opp)+'</h2><p>+'+fmt(done.points)+' points, '+(done.mins>0?done.mins+' minutes before kickoff':'after kickoff')+'. Enjoy the game.</p><div class="eg-btns"><a class="btn btn-navy" href="'+ROOT+'student/">My points</a><a class="btn btn-outline" href="'+ROOT+'leaderboard/">Leaderboard</a></div></div>':
        st!=='open'?'<div class="eg-card"><p class="eg-kicker">Check-in</p><h2>Not open yet</h2><p>On game day, scan the screen at the student gate or type the 6-digit code under it. Codes change every 30 seconds, so you have to be there.</p><div class="eg-btns">'+clockBtn(g)+'<a class="btn btn-outline btn-sm" href="'+ROOT+'student/">My points</a></div></div>':
        '<div class="eg-card"><p class="eg-kicker">At the student gate</p><h2>Scan the gate screen</h2>'+
          '<div class="eg-scan" id="egScan" hidden><video id="egVid" playsinline muted></video><div class="eg-reticle" aria-hidden="true"></div></div>'+
          '<div class="eg-btns" style="margin-top:0"><button type="button" class="btn btn-red" id="egCam">Open camera</button></div><p class="eg-msg" id="egCamMsg" aria-live="polite"></p>'+
          '<div class="eg-or">or type the code</div><form id="egCodeF" novalidate><label for="egCode" class="sr" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">6-digit gate code</label><div class="eg-code"><input id="egCode" inputmode="numeric" autocomplete="one-time-code" maxlength="7" placeholder="000000" pattern="[0-9 ]*"><button class="btn btn-navy" type="submit">Check in</button></div>'+
          '<p class="eg-msg" id="egCodeMsg" aria-live="polite"></p></form><p style="font-size:13px;margin-top:var(--s2)">'+U.labelTag()+'</p></div>';
      main.innerHTML='<section class="eg-sec"><div class="wrap eg-ci"><div class="eg-card eg-dark"><p class="eg-kicker">'+(st==='open'?'Game day':'Next home game')+'</p>'+gameCard(g,st)+
        '<p style="margin-top:var(--s4);font-size:14px">Worth <b style="color:#fff">+'+E.RULES.checkin+'</b>, <b style="color:#fff">+'+E.RULES.early+'</b> more if you\u2019re in 45 minutes early, plus streak and milestone bonuses.</p></div>'+right+'</div></section>';
      wire(g,m);
      var pc=params.get('c');if(pc&&st==='open'&&m.verified&&!done){history.replaceState(null,'',location.pathname);submit(g,pc)}})}
    function submit(g,code){var msg=$('#egCodeMsg');return E.checkIn(g.id,code).then(function(r){if(!r.ok){if(msg)msg.textContent=r.message;if(r.reason==='already')render();return}stop();celebrate(g,r)},function(e){if(msg)msg.textContent=e.message||'Something went wrong. Try again.'})}
    function wire(g){var f=$('#egCodeF');if(!f)return;var inp=$('#egCode');
      inp.addEventListener('input',function(){var v=inp.value.replace(/\D/g,'').slice(0,6);inp.value=v.length>3?v.slice(0,3)+' '+v.slice(3):v});
      f.addEventListener('submit',function(e){e.preventDefault();var v=inp.value.replace(/\D/g,'');if(v.length!==6){$('#egCodeMsg').textContent='Enter all 6 digits.';return}submit(g,v)});
      $('#egCam').addEventListener('click',function(){var cm=$('#egCamMsg');
        if(!('BarcodeDetector' in window)||!navigator.mediaDevices){cm.textContent='This browser can\u2019t scan here. Point your phone\u2019s camera app at the gate screen, or type the code below.';return}
        navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}}).then(function(s){stream=s;var v=$('#egVid');v.srcObject=s;$('#egScan').hidden=false;$('#egCam').hidden=true;v.play();scanning=true;
          var det=new BarcodeDetector({formats:['qr_code']});
          (function tick(){if(!scanning)return;det.detect(v).then(function(codes){var hit=codes.map(function(c){return c.rawValue}).filter(Boolean)[0];
            if(hit){var u;try{u=new URL(hit,location.href)}catch(e){}var c=u&&u.searchParams.get('c'),gid=u&&u.searchParams.get('g');
              if(c&&(!gid||gid===g.id)){scanning=false;submit(g,c);return}cm.textContent='That QR isn\u2019t a gate code for this game.'}
            setTimeout(tick,250)},function(){setTimeout(tick,500)})})()},
          function(){cm.textContent='Camera access was blocked. Type the 6-digit code under the QR instead.'})})}
    function celebrate(g,r){var d=document.createElement('div');d.className='eg-win';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-labelledby','egWinT');
      d.innerHTML='<div class="eg-win-card"><div class="eg-check" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M12 25l8 8 16-17"/></svg></div>'+
        '<h2 id="egWinT">You\u2019re checked in</h2><p class="eg-win-sub">SMU vs '+esc(g.opp)+' \u00b7 '+(r.minutes_before_kickoff>0?r.minutes_before_kickoff+' min before kickoff':'after kickoff')+'</p>'+
        '<div class="eg-win-pts">+<span id="egWinN" data-from="0">0</span><small>PTS</small></div>'+
        '<ul class="eg-lines">'+r.lines.filter(function(l){return l.points}).map(function(l,i){return '<li style="animation-delay:'+(0.5+i*0.18)+'s"><span>'+esc(l.label)+'</span><b>+'+fmt(l.points)+'</b></li>'}).join('')+'</ul>'+
        '<div style="text-align:left;font-size:14px">Balance <b>'+fmt(r.balance)+'</b> points \u00b7 '+r.checkins+' of '+E.GAMES.length+' home games</div>'+U.tierBar(E.tierFor(r.season_earned),r.season_earned)+
        '<p style="font-size:12px;margin:var(--s4) 0 var(--s2);color:rgba(255,255,255,.7)">'+esc(E.LABEL)+'</p>'+
        '<a class="btn btn-red" href="'+ROOT+'student/">See my points</a><button type="button" class="btn btn-outline" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.4)" data-close>Done</button></div>';
      document.body.appendChild(d);requestAnimationFrame(function(){d.classList.add('in')});setTimeout(function(){U.countUp($('#egWinN'),r.points,1100)},350);
      var close=function(){d.classList.remove('in');setTimeout(function(){d.remove();render()},250)};
      $('[data-close]',d).addEventListener('click',close);d.addEventListener('keydown',function(e){if(e.key==='Escape')close()});$('[data-close]',d).focus({preventScroll:true})}
    E.ready.then(render);E.on('clock',render);window.addEventListener('pagehide',stop)}

  /* ================= checkin/gate/ ================= */
  function gate(){var main=$('#egMain'),timer=null,last='';
    function target(){var gid=new URLSearchParams(location.search).get('g');return (gid&&E.gameById(gid))||E.openGame()||E.nextGame()}
    function render(){clearInterval(timer);bars();var g=target();
      if(!g){main.innerHTML='<div class="wrap"><div class="eg-gate"><h1>Season complete</h1></div></div>';return}
      var st=E.gameState(g);
      main.innerHTML='<div class="wrap"><div class="eg-gate"><div><p class="eg-kicker">Student gate \u00b7 '+esc(g.venue)+'</p><h1><span>SMU vs</span>'+esc(g.opp)+'</h1>'+
        '<div class="eg-gate-meta"><span>'+esc(U.koLabel(g))+'</span>'+(g.tv?'<span>'+esc(g.tv)+'</span>':'')+(g.note?'<span>'+esc(g.note)+'</span>':'')+'</div>'+
        '<ol class="eg-gate-steps"><li>Open your phone camera, or SMU+ \u2192 Check-in</li><li>Scan this code, or type the 6 digits</li><li>Earn +'+E.RULES.checkin+', +'+E.RULES.early+' if you\u2019re 45 minutes early</li></ol>'+
        '<p style="margin-top:var(--s6)">'+U.labelTag()+'</p></div>'+
        (st==='open'||!E.live?'<div class="eg-qr-card"><p class="eg-kicker" style="color:var(--red)">'+(st==='open'?'Scan to check in':'Preview \u00b7 opens '+U.time(E.windowFor(g)?E.windowFor(g).opens:new Date())+' CT on game day')+'</p><div class="eg-qr" id="egQR" role="img" aria-label="Rotating check-in QR code"></div>'+
          '<div class="eg-gate-code" id="egGC" aria-live="off">\u2007\u2007\u2007\u2007\u2007\u2007</div><div class="eg-timer"><span id="egT">New code in 30s</span><i id="egBar"></i></div></div>':
          '<div class="eg-gate-closed"><h2 class="eg-h">Opens '+(E.windowFor(g)?U.time(E.windowFor(g).opens)+' CT':'when kickoff is set')+'</h2><p>The code appears here 2 hours before kickoff.</p></div>')+
        '</div><div class="eg-gate-foot"><span>Codes rotate every 30 seconds and only work at this game.</span><span>'+clockBtn(st==='open'?null:g)+' <a class="eg-link" href="'+ROOT+'checkin/" style="display:inline-flex;align-items:center;color:#fff">Open check-in</a></span></div></div>';
      if($('#egQR'))tick()}
    function tick(){var g=target();E.gateCode(g.id).then(function(r){
        var exp=new Date(r.expires_at),left=Math.max(0,Math.round((exp-Date.now())/1000));
        if(r.code!==last){last=r.code;var url=new URL(ROOT+'checkin/?g='+encodeURIComponent(g.id)+'&c='+r.code,location.href).href,q=$('#egQR');
          q.innerHTML=qrSVG(url,8);q.classList.remove('swap');void q.offsetWidth;q.classList.add('swap');$('#egGC').textContent=r.code.slice(0,3)+' '+r.code.slice(3)}
        $('#egT').textContent='New code in '+left+'s';$('#egBar').style.setProperty('--t',(left/E.RULES.windowSecs).toFixed(3));
        clearTimeout(timer);timer=setTimeout(tick,1000)},
      function(e){main.querySelector('.eg-qr-card').innerHTML='<h2 class="eg-h">Gate staff only</h2><p>Sign in with a gate staff account to show the live code.</p>'})}
    E.ready.then(render);E.on('clock',render)}

  /* ================= leaderboard/ ================= */
  function leaderboard(){var main=$('#egBoard'),scope='game',game=null,cls=null;
    var played=function(){return E.GAMES.filter(function(g){return E.gameState(g)==='final'||E.gameState(g)==='open'})};
    function render(){bars();var pl=played();if(!game||!E.gameById(game))game=(E.openGame()||pl[pl.length-1]||{}).id;
      $$('.eg-tab').forEach(function(t){t.setAttribute('aria-selected',String(t.getAttribute('data-scope')===scope));t.tabIndex=t.getAttribute('data-scope')===scope?0:-1});
      var chips=scope==='game'?'<div class="eg-chips" role="group" aria-label="Pick a game">'+pl.slice().reverse().map(function(g){return '<button type="button" class="eg-chip" data-game="'+g.id+'" aria-pressed="'+(g.id===game)+'">vs '+esc(g.opp)+' \u00b7 '+esc(U.dt(g.ko,{month:'short',day:'numeric'}))+'</button>'}).join('')+'</div>':
        scope==='class'?'<div class="eg-chips" role="group" aria-label="Pick a class">'+[[null,'All classes']].concat(CLASSES.map(function(c){return [c[0],'Class of '+c[0]]})).map(function(c){return '<button type="button" class="eg-chip" data-class="'+(c[0]||'')+'" aria-pressed="'+(cls===c[0])+'">'+c[1]+'</button>'}).join('')+'</div>':'';
      var g=E.gameById(game);
      var jobs=[E.leaderboard(scope==='game'?'game':'season',{game_id:game,class_year:scope==='class'?cls:null,limit:scope==='season'?25:20})];if(scope==='class')jobs.push(E.classStandings());
      Promise.all(jobs).then(function(a){var rows=a[0]||[],classes=a[1];
        var title=scope==='game'?(g?'SMU vs '+g.opp:'This game'):scope==='season'?E.SEASON+' season':(cls?'Class of '+cls:'Class race');
        var race=classes&&!cls?'<div class="eg-card" style="margin-bottom:var(--s5)"><p class="eg-kicker">Class race \u00b7 points per student</p><div class="eg-classes">'+classes.map(function(c){var mx=Math.max.apply(null,classes.map(function(x){return x.per_student}))||1;
          return '<div class="eg-class"><span><b>Class of \u2019'+String(c.class_year).slice(-2)+'</b><small>'+c.students+' students</small></span><span class="eg-cbar"><i style="--p:'+(c.per_student/mx).toFixed(3)+'"></i></span><span class="n">'+fmt(c.per_student)+'</span></div>'}).join('')+'</div></div>':'';
        $('#egBoard').innerHTML=chips+race+'<div class="eg-board"><div class="eg-board-h"><span>'+esc(title)+'</span><span>'+(E.live?'<span class="eg-dot" aria-hidden="true"></span>Live':'Demo standings')+'</span></div>'+
          '<div class="eg-board-cols" aria-hidden="true"><span>Rank</span><span>Student</span><span>'+(scope==='game'?'':'Games')+'</span><span>Points</span></div>'+
          (rows.length?'<ol class="eg-rows">'+rows.map(function(r,i){return '<li class="eg-row'+(r.rank<=3?' top':'')+(r.is_me?' me':'')+'" style="animation-delay:'+(U.reduced()?0:Math.min(i,14)*0.05)+'s"><span class="eg-rank">'+r.rank+'</span><span class="eg-who"><b>'+esc(r.display_name)+(r.is_me?'<span class="eg-you">You</span>':'')+'</b><small>'+(r.class_year?'Class of '+cy(r.class_year):'SMU student')+'</small></span><span class="eg-gp">'+(scope==='game'?'':r.checkins)+'</span><span class="eg-pts">'+fmt(r.points)+'</span></li>'}).join('')+'</ol>':
            '<p class="eg-board-f" style="border:0;padding:var(--s5) var(--s4)">No check-ins yet'+(scope==='game'?' for this game':'')+'.</p>')+
          '<div class="eg-board-f">'+(E.live?'Verified SMU students who chose to be listed. Names, class year and points only.':'Demo standings: every student name here is fictional. Their points follow the real rules on the real 2026 home dates.')+' '+esc(E.LABEL)+'.</div></div>'})}
    $('#egTabs').addEventListener('click',function(e){var t=e.target.closest('.eg-tab');if(!t)return;scope=t.getAttribute('data-scope');render()});
    $('#egTabs').addEventListener('keydown',function(e){if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;var ts=$$('.eg-tab'),i=ts.findIndex(function(t){return t.getAttribute('aria-selected')==='true'});
      var n=ts[(i+(e.key==='ArrowRight'?1:ts.length-1))%ts.length];scope=n.getAttribute('data-scope');render();n.focus()});
    main.addEventListener('click',function(e){var c=e.target.closest('[data-game]');if(c){game=c.getAttribute('data-game');render();return}
      var k=e.target.closest('[data-class]');if(k){cls=+k.getAttribute('data-class')||null;render()}});
    E.ready.then(render);E.on('change',render)}

  /* ================= rewards/ ================= */
  function rewards(){var main=$('#egMain'),cat='all';
    function render(){bars();Promise.all([E.summary(),E.rewards()]).then(function(a){var m=a[0],list=a[1];
      $('#egBalPill').innerHTML=m.verified?'<span class="eg-bal-pill"><b>'+fmt(m.balance)+'</b> points to spend</span>':'<a class="btn btn-red" href="'+ROOT+'student/" style="margin-top:var(--s5)">Verify your student account to earn points</a>';
      var cats=['all'].concat(Object.keys(E.CATS));
      main.innerHTML='<section class="eg-sec"><div class="wrap"><div class="eg-chips" role="group" aria-label="Filter rewards">'+cats.map(function(c){return '<button type="button" class="eg-chip" data-cat="'+c+'" aria-pressed="'+(c===cat)+'">'+(c==='all'?'Everything':E.CATS[c])+'</button>'}).join('')+'</div>'+
        '<div class="eg-rewards">'+list.filter(function(r){return cat==='all'||r.category===cat}).map(function(r){var short=r.cost-m.balance,mine=m.redemptions.filter(function(x){return x.reward_id===r.id}).length,
          lim=r.per_user_limit&&mine>=r.per_user_limit,out=r.stock===0;
          var label=!m.verified?'Students only':lim?'Claimed':out?'All claimed':short>0?'Need '+fmt(short)+' more':'Redeem';
          return '<article class="eg-rw"><div class="eg-rw-top"><span class="eg-rw-cat">'+esc(E.CATS[r.category]||r.category)+'</span><span class="eg-rw-cost">'+fmt(r.cost)+'<small>POINTS</small></span></div>'+
            '<div class="eg-rw-body"><h3>'+esc(r.name)+'</h3><p>'+esc(r.description)+'</p><p class="eg-rw-meta">'+(r.stock!=null?fmt(r.stock)+' available':'')+(r.per_user_limit?(r.stock!=null?' \u00b7 ':'')+'Limit '+r.per_user_limit+' per student':'')+'</p>'+U.labelTag()+
            '<button type="button" class="btn '+(label==='Redeem'?'btn-navy':'')+'" data-redeem="'+r.id+'"'+(label==='Redeem'?'':' disabled')+'>'+label+'</button></div></article>'}).join('')+'</div></div></section>'+
        '<section class="eg-sec" style="padding-top:0"><div class="wrap eg-grid"><div class="eg-card"><p class="eg-kicker">Your codes</p><h2>Redeemed</h2>'+
          (m.redemptions.length?'<ul class="eg-redeemed">'+m.redemptions.map(function(r){return '<li><span>'+esc(r.reward)+'<small style="display:block;color:var(--ink-2);font-size:12px">'+U.dt(new Date(r.created_at),{month:'short',day:'numeric'})+' \u00b7 \u2212'+fmt(r.cost)+' pts</small></span><code>'+esc(r.code)+'</code></li>'}).join('')+'</ul>':'<p class="eg-empty">Nothing redeemed yet. Codes you claim show up here.</p>')+'</div>'+
          '<div class="eg-card"><p class="eg-kicker">Points history</p><h2>Earned and spent</h2>'+U.historyList(m.history,12)+'</div></div></section>';
      list.forEach(function(r){REW[r.id]=r})})}
    var REW={};
    main.addEventListener('click',function(e){var c=e.target.closest('[data-cat]');if(c){cat=c.getAttribute('data-cat');render();return}
      var b=e.target.closest('[data-redeem]');if(b&&!b.disabled)confirmRedeem(REW[b.getAttribute('data-redeem')])});
    function confirmRedeem(r){var d=document.createElement('dialog');d.className='eg-dialog';d.setAttribute('aria-labelledby','egDT');
      d.innerHTML='<div class="eg-win-card"><p class="eg-kicker" style="color:#ff8fa8">'+esc(E.CATS[r.category])+'</p><h2 id="egDT">'+esc(r.name)+'</h2><p class="eg-win-sub">'+fmt(r.cost)+' points. '+esc(E.LABEL)+'.</p>'+
        '<div id="egDBody"><button type="button" class="btn btn-red" id="egGo" style="margin-top:var(--s5)">Redeem for '+fmt(r.cost)+' points</button><button type="button" class="btn btn-outline" style="background:transparent;color:#fff;border-color:rgba(255,255,255,.4)" data-close>Not now</button></div></div>';
      document.body.appendChild(d);d.showModal();
      d.addEventListener('close',function(){d.remove();render()});$('[data-close]',d).addEventListener('click',function(){d.close()});
      $('#egGo',d).addEventListener('click',function(){var go=this;go.disabled=true;E.redeem(r.id).then(function(x){
        if(!x.ok){$('#egDBody',d).insertAdjacentHTML('afterbegin','<p class="eg-msg" style="color:#ff8fa8;margin-top:var(--s4)">'+esc(x.message)+'</p>');go.disabled=false;return}
        $('#egDBody',d).innerHTML='<div class="eg-stub"><p class="eg-kicker" style="color:var(--red)">Show this at the stand</p><div class="eg-qr">'+qrSVG(x.code,6)+'</div><div class="code">'+esc(x.code)+'</div><p style="font-size:12px;color:var(--ink-2);margin-top:var(--s2)">'+esc(E.LABEL)+'</p></div>'+
          '<p class="eg-win-sub">'+fmt(x.balance)+' points left. The code is saved under Your codes.</p><button type="button" class="btn btn-red" data-close style="margin-top:var(--s4)">Done</button>';
        $('[data-close]',d).addEventListener('click',function(){d.close()})},function(e){go.disabled=false;U.toast(e.message||'Something went wrong.','err')})})}
    E.ready.then(render);E.on('change',render)}

  var PAGES={student:student,checkin:checkin,gate:gate,leaderboard:leaderboard,rewards:rewards};
  if(PAGES[PAGE])PAGES[PAGE]();
  E.on('clock',bars);
})();
