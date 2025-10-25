// Kawaii Sakura Playground — interactive, cute, anime‑style
// Drop‑in replacement for initGame(). Uses #marioCanvas and optional #gScore/#gTime/#gLives.
// Controls: move mouse/touch to guide Chibi. Click to spawn stickers. [A]/[D] = wind. [Space] = dash.

export function initGame(){
  // DOM
  const canvas = document.querySelector('#marioCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d', { alpha:false });
  const scoreEl = document.querySelector('#gScore');
  const timeEl  = document.querySelector('#gTime');
  const livesEl = document.querySelector('#gLives');
  const startBtn = document.querySelector('#gStart');
  const resetBtn = document.querySelector('#gReset');
  const toastEl  = document.querySelector('#toast');

  // Settings
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const MAX_STICKERS = 40;
  const PETAL_COUNT  = 80;
  const FIREFLY_COUNT = 16;
  const GAME_SECONDS = 60;

  // State
  let W=0, H=0, raf, started=false, over=false;
  let t0 = 0, last = 0, timeLeft = GAME_SECONDS;
  let wind = 0; // -1..1
  let target = {x:0,y:0};
  let score = 0, lives = 3;

  const chibi = {
    x:0, y:0, vx:0, vy:0, r:26, faceBlink:0, dash:0,
    trail: [] // recent positions
  };

  const petals = [];
  const stickers = [];
  const fireflies = [];
  const pops = [];

  // Utils
  const rand = (a,b)=> a + Math.random()*(b-a);
  const clamp = (v,a,b)=> Math.max(a, Math.min(b,v));
  const lerp = (a,b,t)=> a + (b-a)*t;
  const easeOut = (t)=> 1- Math.pow(1-t, 3);

  let toastTimeout;
  function showToast(msg){
    if(!toastEl) return;
    toastEl.textContent = msg;
    toastEl.style.display = 'block';
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(()=> toastEl.style.display='none', 1500);
  }

  // Layout
  function resize(){
    const cssW = Math.min(900, canvas.parentElement.clientWidth);
    const cssH = Math.round(cssW * 0.56);
    canvas.style.height = cssH+'px';
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    W = cssW; H = cssH;
    target.x = W*0.5; target.y = H*0.6;
    chibi.x = W*0.5; chibi.y = H*0.6;
    spawnWorld();
  }

  // World
  function spawnWorld(){
    petals.length = 0; stickers.length = 0; fireflies.length = 0; pops.length = 0;
    for(let i=0;i<PETAL_COUNT;i++) petals.push(makePetal(true));
    for(let i=0;i<FIREFLY_COUNT;i++) fireflies.push(makeFly());
  }

  function makePetal(seed=false){
    const speed = rand(0.2, 1.0);
    return {
      x: seed? rand(0,W): rand(-40,W+40),
      y: seed? rand(0,H): -20,
      z: rand(0.6, 1.0), // depth
      r: rand(6, 12),
      a: rand(0, Math.PI*2),
      w: speed, // fall speed
      sway: rand(14, 36),
      spin: rand(-0.03, 0.03)
    };
  }

  function makeFly(){
    const r = rand(10, 18);
    return {
      x: rand(40, W-40), y: rand(40, H*0.7), r,
      a: rand(0, Math.PI*2), speed: rand(0.4,0.9), phase: rand(0, 6.28),
      glow: rand(0.55, 0.95), caught:false
    };
  }

  function makeSticker(x,y){
    const set = ['☆','❤','✿','✨','♡','🎀','☁','❀'];
    const txt = set[Math.floor(rand(0,set.length))];
    return { x, y, vy: rand(-1.8,-0.6), life: 1200, rot: rand(-0.5,0.5), s: rand(18,30), txt, alpha:1 };
  }

  function pop(x,y){ // small ring pop animation
    pops.push({x,y, r:2, max: 26, a:1});
  }

  // Audio pop via WebAudio
  let ac; function beep(){
    try{
      ac = ac || new (window.AudioContext||window.webkitAudioContext)();
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = 'triangle'; o.frequency.value = 720;
      g.gain.value = 0.08; o.connect(g); g.connect(ac.destination);
      o.start();
      setTimeout(()=>{ try{ o.stop(); }catch{} }, 100);
    }catch{ /* ignore */ }
  }

  // Input
  canvas.addEventListener('mousemove', e=>{
    const r = canvas.getBoundingClientRect();
    target.x = (e.clientX - r.left);
    target.y = (e.clientY - r.top);
  }, {passive:true});
  canvas.addEventListener('touchmove', e=>{
    const r = canvas.getBoundingClientRect();
    const t = e.touches[0];
    target.x = (t.clientX - r.left);
    target.y = (t.clientY - r.top);
  }, {passive:true});
  canvas.addEventListener('click', e=>{
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left), y = (e.clientY - r.top);
    stickers.push(makeSticker(x,y));
    if(stickers.length>MAX_STICKERS) stickers.shift();
  });

  const keys = { A:false, D:false, Space:false };
  document.addEventListener('keydown', e=>{
    if(e.key==='a' || e.key==='A') keys.A = true;
    if(e.key==='d' || e.key==='D') keys.D = true;
    if(e.code==='Space'){ keys.Space = true; e.preventDefault(); dash(); }
  });
  document.addEventListener('keyup', e=>{
    if(e.key==='a' || e.key==='A') keys.A = false;
    if(e.key==='d' || e.key==='D') keys.D = false;
    if(e.code==='Space') keys.Space = false;
  });

  function dash(){
    chibi.dash = 1; // brief speed boost
    showToast && showToast('ちびダッシュ!');
  }

  // HUD
  function updateHUD(){
    if(scoreEl) scoreEl.textContent = score;
    if(timeEl)  timeEl.textContent  = Math.max(0, Math.ceil(timeLeft));
    if(livesEl) livesEl.textContent = lives;
  }

  function start(){
    if(started) return; started = true; over = false;
    t0 = performance.now(); last = t0; timeLeft = GAME_SECONDS; score = 0; lives = 3;
    updateHUD();
    showToast && showToast('ابدئي اللعب — التقطي اليراعات');
  }

  function reset(){
    started=false; over=false; spawnWorld();
    chibi.trail.length = 0; chibi.dash = 0;
    score = 0; lives = 3; timeLeft = GAME_SECONDS; updateHUD();
    drawBG(); drawScene(0); // paint idle frame
  }

  // Bind buttons if present
  startBtn && startBtn.addEventListener('click', start);
  resetBtn && resetBtn.addEventListener('click', reset);

  // Always run ambient even if not started
  resize();
  window.addEventListener('resize', resize);
  drawBG(); drawScene(0);

  // Main loop
  function loop(now){
    const dt = Math.min(32, now - last); last = now;
    
    if(started){
      timeLeft -= dt/1000; 
      if(timeLeft<=0){ gameOver(); }
      // wind control
      wind = lerp(wind, (keys.D?1:0) - (keys.A?1:0), 0.05);
      update(dt);
    }
    
    drawBG();
    drawScene(dt);
    if(started) updateHUD();
    raf = requestAnimationFrame(loop);
  }

  // Start animation loop
  raf = requestAnimationFrame(loop);

  function gameOver(){
    started=false; over=true;
    showToast && showToast(score>=FIREFLY_COUNT? '勝利! — نجحتِ': 'انتهى الوقت');
  }

  function update(dt){
    // Chibi follows target with easing
    const speed = 0.08 + (chibi.dash>0? 0.18: 0);
    chibi.x = lerp(chibi.x, target.x, speed);
    chibi.y = lerp(chibi.y, target.y, speed);
    if(chibi.dash>0){ chibi.dash = Math.max(0, chibi.dash - dt*0.004); }

    // Face blink
    chibi.faceBlink -= dt; if(chibi.faceBlink<=0){ chibi.faceBlink = rand(1400, 2800); }

    // Trail
    chibi.trail.push({x:chibi.x, y:chibi.y, a:0.8});
    if(chibi.trail.length>16) chibi.trail.shift();

    // Petals
    for(const p of petals){
      p.a += p.spin; p.y += p.w * (0.6 + 0.6*Math.abs(wind));
      p.x += 0.6*wind + Math.sin(p.a)*0.4;
      if(p.y>H+20) Object.assign(p, makePetal(false));
    }

    // Stickers
    for(let i=stickers.length-1;i>=0;i--){
      const s = stickers[i]; s.y += s.vy; s.life -= dt; s.alpha = s.life/1200;
      if(s.life<=0) stickers.splice(i,1);
    }

    // Fireflies wander, check collect
    for(const f of fireflies){
      if(f.caught) continue;
      f.phase += dt*0.005;
      f.x += Math.cos(f.phase)*f.speed + wind*0.2;
      f.y += Math.sin(f.phase*1.3)*f.speed*0.8 + (Math.random()-0.5)*0.2;
      f.x = clamp(f.x, 20, W-20); f.y = clamp(f.y, 20, H*0.8);
      const dx = f.x - chibi.x, dy = f.y - chibi.y;
      if(dx*dx + dy*dy < (chibi.r*chibi.r)){
        f.caught = true; score += 1; pop(f.x,f.y); beep();
      }
    }
  }

  // Drawing
  function drawBG(){
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#fff7fb'); g.addColorStop(1,'#ffeef3');
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);

    // distant hills
    ctx.fillStyle = '#ffe0ea';
    roundedHill(0,H*0.82, W*0.55, H*0.28);
    ctx.fillStyle = '#ffd2df';
    roundedHill(W*0.45,H*0.84, W*0.7, H*0.26);

    // cherry tree trunks silhouettes
    ctx.fillStyle = '#b56576';
    ctx.fillRect(W*0.1, H*0.52, 10, H*0.5);
    ctx.fillRect(W*0.82, H*0.50, 12, H*0.5);
  }

  function roundedHill(x,y,w,h){
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.bezierCurveTo(x+w*0.25, y-h, x+w*0.75, y-h, x+w, y);
    ctx.lineTo(x+w, H);
    ctx.lineTo(x, H);
    ctx.closePath();
    ctx.fill();
  }

  function drawScene(dt){
    // Petals
    for(const p of petals){
      const px = p.x, py = p.y;
      ctx.save();
      ctx.translate(px,py); ctx.rotate(p.a);
      ctx.fillStyle = 'rgba(255,107,139,0.85)';
      ctx.beginPath();
      ctx.moveTo(0, -p.r*0.5);
      ctx.quadraticCurveTo(p.r*0.8, 0, 0, p.r);
      ctx.quadraticCurveTo(-p.r*0.8, 0, 0, -p.r*0.5);
      ctx.fill();
      ctx.restore();
    }

    // Stickers
    for(const s of stickers){
      ctx.save(); ctx.globalAlpha = s.alpha;
      ctx.translate(s.x, s.y); ctx.rotate(s.rot);
      ctx.font = `${s.s}px "Tajawal", system-ui`;
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillStyle = '#ff6b8b';
      ctx.fillText(s.txt, 0, 0);
      ctx.restore();
    }

    // Fireflies
    for(const f of fireflies){
      ctx.save();
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r*1.6);
      g.addColorStop(0, `rgba(255, 238, 120, ${f.caught?0:0.95})`);
      g.addColorStop(1, 'rgba(255, 238, 120, 0)');
      ctx.fillStyle = g; ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();
    }

    // Pops
    for(let i=pops.length-1;i>=0;i--){
      const p = pops[i]; p.r += 1.6; p.a -= 0.05; if(p.a<=0) pops.splice(i,1);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(255,107,139,${p.a})`; ctx.lineWidth = 2; ctx.stroke();
    }

    // Chibi trail
    for(let i=0;i<chibi.trail.length;i++){
      const tr = chibi.trail[i]; const alpha = (i+1)/chibi.trail.length * 0.3;
      ctx.fillStyle = `rgba(255,107,139,${alpha})`;
      ctx.beginPath(); ctx.arc(tr.x, tr.y, 12, 0, Math.PI*2); ctx.fill();
    }

    // Chibi body
    drawChibi(chibi.x, chibi.y, chibi.r);

    // Goal hint text
    ctx.font = '14px "Tajawal", system-ui';
    ctx.fillStyle = '#8a6b74';
    ctx.textAlign='center';
    ctx.fillText('التقطي اليراعات — انقري لإطلاق ملصقات', W/2, H-18);
  }

  function drawChibi(x,y,r){
    // blob body
    ctx.save();
    ctx.translate(x,y);
    // subtle bobbing
    const bob = Math.sin(performance.now()*0.004)*2;
    ctx.translate(0,bob);

    const g = ctx.createLinearGradient(-r, -r, r, r);
    g.addColorStop(0,'#ffd1dd'); g.addColorStop(1,'#ffb4c7');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();

    // face
    const eyesOpen = chibi.faceBlink > 120;
    ctx.strokeStyle = '#5a2a36'; ctx.lineWidth = 2;
    // eyes
    ctx.beginPath();
    if(eyesOpen){ ctx.arc(-10, -4, 3.2, 0, Math.PI*2); ctx.arc(10, -4, 3.2, 0, Math.PI*2); }
    else { ctx.moveTo(-14,-4); ctx.lineTo(-6,-4); ctx.moveTo(6,-4); ctx.lineTo(14,-4); }
    ctx.stroke();
    // mouth
    ctx.beginPath(); ctx.arc(0, 6, 5, 0, Math.PI); ctx.stroke();

    // small heart badge
    ctx.fillStyle = '#ff6b8b'; ctx.beginPath(); ctx.arc(r*0.55, r*0.1, 4, 0, Math.PI*2); ctx.fill();

    ctx.restore();
  }
}
