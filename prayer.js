// prayer.js – core game logic for Prayer Hero
// Expects these elements in HTML:
// canvas#game, #difficulty, #length, #speed, #play, #pause, #restart,
// #score, #streak, #mult, #timeFill, #hearts, #touchControls, aside#hud, .drawer-grip

(() => {
  // ===== Utility =====
  const clamp = (n, a, b) => Math.min(Math.max(n, a), b);
  const rand = (a,b) => a + Math.random()*(b-a);

 // ===== Canvas setup (HiDPI) =====
 const canvas = document.getElementById('game');
 const ctx = canvas.getContext('2d');
 const DPR = window.devicePixelRatio || 1;
 function resize(){
   const {clientWidth:w, clientHeight:h} = canvas;
   canvas.width = Math.floor(w*DPR); canvas.height = Math.floor(h*DPR);
   ctx.setTransform(DPR,0,0,DPR,0,0);
   laneGeom.compute();
 }
 new ResizeObserver(resize).observe(canvas);

  // ===== Lane geometry =====
  const laneGeom = {
    lanes:4, width:0, height:0, hitY:0,
    topW:140, bottomW:520, gap:16, left:0,
    compute(){
      this.width = canvas.clientWidth; this.height = canvas.clientHeight;
      this.hitY = this.height - 110; this.left = (this.width - this.bottomW)/2;
    },
    laneCenter(i, y){
      const t = clamp((y)/(this.height), 0, 1);
      const w = this.topW*(1-t) + this.bottomW*(t);
      const start = (this.width - w)/2;
      const totalGap = this.gap*(this.lanes-1);
      const laneW = (w - totalGap)/this.lanes;
      return start + i*(laneW+this.gap) + laneW/2;
    },
    laneRadius(y){
      const t = clamp((y)/(this.height), 0, 1);
      const w = this.topW*(1-t) + this.bottomW*(t);
      const totalGap = this.gap*(this.lanes-1);
      const laneW = (w - totalGap)/this.lanes;
      return laneW*0.42;
    }
  };

  // ===== Game State =====
  const state = {
    running:false, paused:false,
    startAt:0, pauseAt:0, duration:75000,
    approach:1500,
    hitWindow:{good:140, ok:200},
    notes:[], active:[], nextIdx:0,
    score:0, streak:0, mult:1, healthMax:5, health:5,
    speed:5,
    holds: new Set(), // lanes currently held (keys/touch)
  };

  // ===== UI refs =====
  const $ = sel => document.querySelector(sel);
  const scoreEl = $('#score'), streakEl = $('#streak'), multEl = $('#mult');
  const timeFill = $('#timeFill');
  const heartsEl = $('#hearts');
  const playBtn = $('#play'), pauseBtn = $('#pause'), restartBtn = $('#restart');
  const diffSel = $('#difficulty'), lenSel = $('#length'), speedSlider = $('#speed');
  const touchControls = document.getElementById('touchControls');
  const hud = document.getElementById('hud');
  const drawerGrip = document.querySelector('.drawer-grip');

  // ===== Hearts =====
  function renderHearts(){
    heartsEl.innerHTML = '';
    for(let i=0;i<state.healthMax;i++){
      const d = document.createElement('div');
      d.className = 'heart'+(i<state.health?'':' off');
      heartsEl.appendChild(d);
    }
  }

  // ===== Difficulty & Length =====
  const seconds = (s)=> s*1000;
  function difficultyToParams(diff){
    switch(diff){
      case 'easy': return {bpm:92, density:0.55, approach:1900, windowGood:160, windowOk:240, slideRate:0.08, shieldRate:0.08, slideDur:[600,900]};
      case 'medium': return {bpm:108, density:0.7, approach:1600, windowGood:140, windowOk:200, slideRate:0.12, shieldRate:0.10, slideDur:[650,1100]};
      case 'hard': return {bpm:128, density:0.85, approach:1350, windowGood:120, windowOk:180, slideRate:0.16, shieldRate:0.10, slideDur:[700,1200]};
      case 'insane': return {bpm:150, density:1.0, approach:1150, windowGood:100, windowOk:150, slideRate:0.22, shieldRate:0.12, slideDur:[750,1400]};
    }
  }
  function lengthToMs(len){
    return len==='short'?seconds(45): len==='long'?seconds(120): seconds(75);
  }

  // ===== Map generation (tap, shield, slide) =====
  function generateMap(params, totalMs){
    const beat = 60000/params.bpm;
    const map = [];
    let t=0; let lastLane=-1;
    while(t < totalMs){
      if(Math.random() < params.density){
        let type='tap';
        const roll = Math.random();
        if(roll < params.slideRate){ type='slide'; }
        else if(roll < params.slideRate + params.shieldRate){ type='shield'; }

        let lane = Math.floor(rand(0,4));
        if(lane===lastLane) lane = (lane+1)%4; lastLane = lane;
        const note = {t:Math.floor(t), lane, type};
        if(type==='slide') note.dur = Math.floor(rand(params.slideDur[0], params.slideDur[1]));
        map.push(note);
      }
      t += (Math.random()<0.25? beat/2 : beat);
    }
    map.sort((a,b)=> a.t===b.t ? (a.lane-b.lane) : (a.t-b.t));
    return map;
  }

  // ===== Audio =====
  const audio = {
    ctx:null,
    ensure(){ if(!this.ctx) this.ctx = new (window.AudioContext||window.webkitAudioContext)(); },
    beep(lane, type){
      this.ensure();
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = (type==='shield') ? 'sine' : 'triangle';
      const base = 300; o.frequency.value = base + lane*70 + (type==='slide'?30:0);
      g.gain.value = (type==='shield')? 0.16 : 0.12;
      o.connect(g).connect(this.ctx.destination);
      o.start(); o.stop(this.ctx.currentTime + 0.10);
    },
    whiff(){
      this.ensure(); const o=this.ctx.createOscillator(); const g=this.ctx.createGain();
      o.type='sawtooth'; o.frequency.value=140; g.gain.setValueAtTime(0.12,this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001,this.ctx.currentTime+0.12);
      o.connect(g).connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime+0.14);
    }
  };

  // ===== Input =====
  const laneForKey = (code) => ({ArrowLeft:0,KeyA:0,ArrowDown:1,KeyS:1,ArrowUp:2,KeyW:2,ArrowRight:3,KeyD:3}[code] ?? -1);
  const pressed = new Set();
  window.addEventListener('keydown', (e)=>{
    const lane = laneForKey(e.code); if(lane===-1) return;
    e.preventDefault();
    pressed.add(lane); state.holds.add(lane);
    onLanePress(lane);
  });
  window.addEventListener('keyup', (e)=>{
    const lane = laneForKey(e.code); if(lane===-1) return;
    pressed.delete(lane); state.holds.delete(lane);
    onLaneRelease(lane);
  });

  // Touch buttons behave like holds for slides
  function maybeShowTouch(){
    const isTouch = matchMedia('(hover: none)').matches || 'ontouchstart' in window;
    touchControls.hidden = !isTouch;
  }
  maybeShowTouch();
  touchControls.addEventListener('touchstart', (e)=>{
    const btn = e.target.closest('.key'); if(!btn) return;
    const lane = Number(btn.dataset.lane); state.holds.add(lane); onLanePress(lane);
  }, {passive:true});
  touchControls.addEventListener('touchend', (e)=>{
    const btn = e.target.closest('.key'); if(!btn) return;
    const lane = Number(btn.dataset.lane); state.holds.delete(lane); onLaneRelease(lane);
  });

  function onLanePress(lane){ hit(lane); }
  function onLaneRelease(lane){ /* slide judgement happens in loop */ }

  // ===== Hit / Slide Logic =====
  function nowMs(){ if(!state.running) return 0; return performance.now() - state.startAt; }
  function scheduleNotes(){ state.active.length = 0; state.nextIdx = 0; }
  function effectiveApproach(){
    const s = state.speed; const minA = state.approach*0.65, maxA = state.approach*1.35; const t = (s-3)/(9-3); return maxA*(1-t) + minA*(t);
  }

  function hit(lane){
    if(!state.running || state.paused) return;
    const t = nowMs();

    // Prefer earliest hittable note in this lane
    let targetIdx = -1; let deltaMin = Infinity;
    for(let i=0;i<state.notes.length;i++){
      const n = state.notes[i];
      if(n.hit) continue; if(n.lane!==lane) continue;
      const d = Math.abs(n.t - t);
      if(d < deltaMin){ deltaMin = d; targetIdx = i; }
      if(n.t > t + state.hitWindow.ok) break;
    }

    if(targetIdx!==-1){
      const n = state.notes[targetIdx];
      if(n.type==='slide'){
        if(Math.abs(n.t - t) <= state.hitWindow.ok){ n.holdStart = t; n.holding = true; return; }
      } else {
        if(Math.abs(n.t - t) <= state.hitWindow.ok){
          n.hit = true; n.res = (Math.abs(n.t - t) <= state.hitWindow.good? 'good':'ok');
          scoreFor(n);
          if(n.type==='shield'){ gainHp(1); toast('+1 HP'); }
          audio.beep(lane, n.type); flashAtLane(lane, n.res);
          updateHud(); return;
        }
      }
    }

    // ghost tap
    audio.whiff(); state.streak=0; state.mult=1; loseHp(0.2); flashAtLane(lane,'miss'); updateHud();
  }

  function scoreFor(n){
    const add = n.type==='slide'? 150 : (n.res==='good'? 100 : 50);
    state.streak++; if(state.streak%10===0) state.mult = Math.min(8, state.mult+1);
    state.score += Math.floor(add * state.mult);
  }

  function gainHp(q){ state.health = Math.min(state.healthMax, state.health + q); renderHearts(); }
  function loseHp(q=1){ state.health = clamp(state.health - q, 0, state.healthMax); renderHearts(); if(state.health<=0) endRun(); }

  // ===== Visual FX =====
  const sparks = [];
  function flashAtLane(lane, type){ const y=laneGeom.hitY; const x=laneGeom.laneCenter(lane,y); sparks.push({x,y,life:0.3,type}); }

  // ===== Run Control =====
  function startRun(){
    const params = difficultyToParams(diffSel.value);
    state.duration = lengthToMs(lenSel.value);
    state.approach = params.approach;
    state.hitWindow.good = params.windowGood;
    state.hitWindow.ok = params.windowOk;
    state.speed = Number(speedSlider.value);

    state.notes = generateMap(params, state.duration);
    state.score = 0; state.streak = 0; state.mult = 1; state.health = state.healthMax; renderHearts();
    scheduleNotes(); updateHud();
    toast(`Chart built: ${state.notes.length} notes · ${params.bpm} BPM`);

    state.running = true; state.paused=false; state.startAt = performance.now();
    loop();
  }
  function pauseRun(){ if(!state.running||state.paused) return; state.paused=true; state.pauseAt=performance.now(); }
  function resumeRun(){ if(!state.running||!state.paused) return; const dt=performance.now()-state.pauseAt; state.startAt+=dt; state.paused=false; loop(); }
  function endRun(){ state.running=false; state.paused=false; toast(`Run over — Score ${state.score}  |  Max Streak ${state.streak}`); }
  function restart(){ startRun(); }

  playBtn.addEventListener('click', ()=>{ if(!state.running) startRun(); else resumeRun(); });
  pauseBtn.addEventListener('click', ()=> pauseRun());
  restartBtn.addEventListener('click', ()=> restart());
  speedSlider.addEventListener('input', ()=>{ state.speed = Number(speedSlider.value); });

  // ===== HUD Drawer (mobile) =====
  let startY=null, curY=null;
  if(drawerGrip){
    drawerGrip.addEventListener('touchstart', e=>{ startY=e.touches[0].clientY; curY=startY; }, {passive:true});
    drawerGrip.addEventListener('touchmove', e=>{ if(startY!=null) curY=e.touches[0].clientY; }, {passive:true});
    drawerGrip.addEventListener('touchend', ()=>{ if(startY!=null && curY!=null){ const dy=curY-startY; if(Math.abs(dy)>40){ if(dy<0) hud.classList.add('open'); else hud.classList.remove('open'); } } startY=null; curY=null; });
  }

  // ===== Heads-up display =====
  function updateHud(){ scoreEl.textContent=state.score|0; streakEl.textContent=state.streak|0; multEl.textContent=`x${state.mult}`; }
  function setTimeProgress(p){ timeFill.style.width = (p*100).toFixed(1)+'%'; }
  function toast(text){ const d=document.createElement('div'); d.textContent=text; d.style.position='absolute'; d.style.left='50%'; d.style.top='18px'; d.style.transform='translateX(-50%)'; d.style.padding='10px 14px'; d.style.border='1px solid #2a3550'; d.style.background='#0f1421cc'; d.style.borderRadius='10px'; d.style.zIndex=99; d.style.backdropFilter='blur(2px)'; d.style.boxShadow='0 10px 20px #0007'; document.body.appendChild(d); setTimeout(()=>d.remove(), 2200); }

  // ===== Main loop =====
  function loop(){
    if(!state.running || state.paused) return;
    const t = nowMs(); const A = effectiveApproach();
    while(state.nextIdx < state.notes.length && state.notes[state.nextIdx].t - t < A){ state.active.push(state.notes[state.nextIdx]); state.nextIdx++; }

    // Judge slide holds & late misses
    for(const n of state.active){
      if(n.hit) continue;
      if(n.type==='slide'){
        if(n.holding && t >= n.t + (n.dur - state.hitWindow.good)){
          n.hit=true; n.res='good'; scoreFor(n); audio.beep(n.lane,'slide'); flashAtLane(n.lane,'good'); updateHud(); continue;
        }
        if(t - (n.t + n.dur) > state.hitWindow.ok){ n.hit=true; n.res='miss'; state.streak=0; state.mult=1; loseHp(1); }
        if(n.holding && !state.holds.has(n.lane) && t < n.t + n.dur - state.hitWindow.good){ n.holding=false; }
      } else {
        if(t - n.t > state.hitWindow.ok + 60){ n.hit=true; n.res='miss'; state.streak=0; state.mult=1; loseHp(1); }
      }
    }

    draw(t, A);
    const p = clamp(t/state.duration,0,1); setTimeProgress(p);
    if(t >= state.duration && state.health>0){ endRun(); return; }
    requestAnimationFrame(loop);
  }

  function draw(t, approach){
    const w = canvas.clientWidth, h = canvas.clientHeight; ctx.clearRect(0,0,w,h);

    // background glow & path deck
    const grad = ctx.createRadialGradient(w/2, h*0.2, 10, w/2, h*0.2, Math.max(w,h)*0.6);
    grad.addColorStop(0,'#2a1137'); grad.addColorStop(1,'#07080c'); ctx.fillStyle = grad; ctx.fillRect(0,0,w,h);
    ctx.save(); ctx.fillStyle = '#121721'; ctx.strokeStyle = '#313b52'; ctx.beginPath();
    const topW = laneGeom.topW, bottomW = laneGeom.bottomW; const topX = (w-topW)/2, bottomX = (w-bottomW)/2;
    ctx.moveTo(topX, h*0.1); ctx.lineTo(topX+topW, h*0.1); ctx.lineTo(bottomX+bottomW, h*0.96); ctx.lineTo(bottomX, h*0.96); ctx.closePath(); ctx.fill(); ctx.globalAlpha=.35; ctx.stroke(); ctx.globalAlpha=1;

    // hit line
    ctx.strokeStyle='#4461a8'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(bottomX, laneGeom.hitY); ctx.lineTo(bottomX+bottomW, laneGeom.hitY); ctx.stroke();

    // separators
    for(let i=1;i<4;i++){ const y1=h*0.11, y2=h*0.95; const cx1=laneGeom.laneCenter(i,y1), cx2=laneGeom.laneCenter(i,y2); ctx.strokeStyle='#25304a'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(cx1,y1); ctx.lineTo(cx2,y2); ctx.stroke(); }

    // draw active notes
    for(const n of state.active){ if(n.hit && n.res==='miss') continue; const prog = clamp(1 - (n.t - t)/approach, 0, 1); const y = h*0.12 + prog*(laneGeom.hitY - h*0.12); const x = laneGeom.laneCenter(n.lane, y); const r = laneGeom.laneRadius(y);
      if(n.type==='slide'){
        const tailProg = clamp(1 - ((n.t + n.dur) - t)/approach, 0, 1);
        const yTail = h*0.12 + tailProg*(laneGeom.hitY - h*0.12);
        const color = getComputedStyle(document.documentElement).getPropertyValue('--slide').trim();
        ctx.save(); ctx.strokeStyle='#3a4667'; ctx.lineWidth=3; ctx.fillStyle='#0c0f16';
        ctx.beginPath();
        const y1 = Math.min(y, yTail), y2 = Math.max(y, yTail);
        ctx.rect(x-r*0.6, y1, r*1.2, Math.max(6, y2-y1));
        ctx.fill(); ctx.stroke();
        const inner = ctx.createLinearGradient(x, y1, x, y2); inner.addColorStop(0, color); inner.addColorStop(1, '#001018');
        ctx.globalAlpha = .8; ctx.fillStyle = inner; ctx.fillRect(x-r*0.45, y1, r*0.9, Math.max(6, y2-y1)); ctx.globalAlpha=1; ctx.restore();
      } else {
        const palette=['--lane0','--lane1','--lane2','--lane3'];
        const varName = (n.type==='shield')? '--shield' : palette[n.lane];
        const color = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        ctx.save(); ctx.fillStyle = '#0c0f16'; ctx.strokeStyle = '#3a4667'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.stroke();
        const rr=r*0.62; const g2=ctx.createRadialGradient(x-r*0.3,y-r*0.3, rr*0.2, x,y, rr); g2.addColorStop(0, color); g2.addColorStop(1, '#000');
        ctx.fillStyle=g2; ctx.beginPath(); ctx.arc(x,y,rr,0,Math.PI*2); ctx.fill();
        if(n.hit && (n.res==='good'||n.res==='ok')){ const age=(t-n.t); if(age<160){ ctx.globalAlpha=1-age/160; ctx.strokeStyle=n.res==='good'? '#7dffa6':'#ffe18a'; ctx.lineWidth=6; ctx.beginPath(); ctx.arc(x,y, r*0.95, 0, Math.PI*2); ctx.stroke(); ctx.globalAlpha=1; } }
        ctx.restore();
      }
    }

    // pressed key glows at hit line
    for(let i=0;i<4;i++){ const y=laneGeom.hitY; const x=laneGeom.laneCenter(i,y); const r=laneGeom.laneRadius(y)*0.9; ctx.save(); ctx.globalAlpha= state.holds.has(i)? 1 : .55; const color=getComputedStyle(document.documentElement).getPropertyValue(['--lane0','--lane1','--lane2','--lane3'][i]).trim(); ctx.strokeStyle='#40507a'; ctx.lineWidth=4; ctx.fillStyle='#0c1018'; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.globalAlpha= state.holds.has(i)? 0.45 : 0.18; ctx.fillStyle=color; ctx.beginPath(); ctx.arc(x,y, r*0.6, 0, Math.PI*2); ctx.fill(); ctx.restore(); }

    // sparks
    for(let i=sparks.length-1;i>=0;i--){ const s=sparks[i]; s.life-=1/60; if(s.life<=0){ sparks.splice(i,1); continue; } const a=clamp(s.life/0.3,0,1); ctx.globalAlpha=a; ctx.strokeStyle= s.type==='miss'? 'var(--miss)': s.type==='good'? 'var(--good)':'var(--ok)'; ctx.lineWidth=6; ctx.beginPath(); ctx.arc(s.x,s.y, 42*(1-a), 0, Math.PI*2); ctx.stroke(); ctx.globalAlpha=1; }

    ctx.restore();
  }

  // ===== Boot =====
  resize(); renderHearts(); updateHud(); setTimeProgress(0);
  // Quick-start on Space if you want:
  window.addEventListener('keydown', (e)=>{ if(e.code==='Space' && !state.running){ e.preventDefault(); startRun(); } });
})();