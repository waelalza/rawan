// modules/game.js
export function initGame(){
  const canvas = document.querySelector('#marioCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d',{alpha:false});
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let W=0,H=0, raf;

  // Scene state
  const particles = [];
  const P = 90;               // particle count
  const baseHue = 345;        // near your brand pink
  const center = {x:0,y:0};
  const monogram = { text: 'R♥W', fontPx: 96, opacity: 0 };

  function resize(){
    const cssW = Math.min(900, canvas.parentElement.clientWidth);
    const cssH = Math.round(cssW * 0.42);
    canvas.style.height = cssH+'px';
    canvas.width  = Math.round(cssW*dpr);
    canvas.height = Math.round(cssH*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    W = cssW; H = cssH;
    center.x = W/2; center.y = H/2;
    initParticles();
  }

  function rand(a,b){ return a + Math.random()*(b-a); }

  function initParticles(){
    particles.length = 0;
    const Rmin = Math.max(60, Math.min(W,H)*0.18);
    const Rmax = Math.max(90, Math.min(W,H)*0.32);
    for(let i=0;i<P;i++){
      const r = rand(Rmin,Rmax);
      const a = rand(0, Math.PI*2);
      const s = rand(0.2, 0.7);   // angular speed
      particles.push({
        r, a, s: (Math.random()<0.5?-s:s),
        size: rand(1.2, 2.4),
        hue: baseHue + rand(-6,6),
        alpha: rand(0.35,0.8)
      });
    }
  }

  function bg(){
    // subtle vertical gradient
    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,   '#fff');
    g.addColorStop(1,   '#fff5f8');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,W,H);

    // soft vignette
    const vg = ctx.createRadialGradient(center.x, center.y, 10, center.x, center.y, Math.max(W,H));
    vg.addColorStop(0,'rgba(255,107,139,0.08)');
    vg.addColorStop(1,'rgba(255,107,139,0)');
    ctx.fillStyle = vg;
    ctx.fillRect(0,0,W,H);
  }

  function drawMonogram(t){
    ctx.save();
    ctx.globalAlpha = monogram.opacity;
    ctx.font = `700 ${monogram.fontPx}px "Caveat","Tajawal",system-ui`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // subtle gradient ink
    const mg = ctx.createLinearGradient(center.x-80,center.y,center.x+80,center.y);
    mg.addColorStop(0, '#ff6b8b');
    mg.addColorStop(1, '#b64058');
    ctx.fillStyle = mg;
    ctx.fillText(monogram.text, center.x, center.y);
    ctx.restore();

    // thin orbit ring
    ctx.beginPath();
    ctx.arc(center.x, center.y, Math.min(W,H)*0.26, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,107,139,0.25)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function drawParticles(dt){
    for(const p of particles){
      p.a += p.s * dt * 0.001; // radians per ms
      const x = center.x + Math.cos(p.a)*p.r;
      const y = center.y + Math.sin(p.a)*p.r*0.82; // slight ellipse
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${p.hue}, 82%, 58%, ${p.alpha})`;
      ctx.fill();
    }
  }

  function animate(now){
    if(!animate.prev) animate.prev = now;
    const dt = Math.min(32, now - animate.prev); // clamp delta
    animate.prev = now;

    bg();
    drawParticles(dt);
    // ease-in the monogram
    monogram.opacity = Math.min(1, monogram.opacity + dt*0.0015);
    drawMonogram(now);

    raf = requestAnimationFrame(animate);
  }

  // pointer sparkle
  canvas.addEventListener('mousemove', (e)=>{
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    particles.push({
      r: Math.hypot(x-center.x, y-center.y),
      a: Math.atan2(y-center.y, x-center.x),
      s: (Math.random()<0.5?-0.9:0.9),
      size: rand(1.8, 3.0),
      hue: baseHue + rand(-10,10),
      alpha: 0.9
    });
    if(particles.length > P+20) particles.splice(0, particles.length-(P+20));
  }, {passive:true});

  // lifecycle
  resize();
  window.addEventListener('resize', resize);
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(animate);
}
