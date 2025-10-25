// ======== ألوان الفرح: قصاصات العشق ========
export default function confetti(options) {
  const نبض_الإطار = window.requestAnimationFrame || function(callback) { return window.setTimeout(callback, 1000 / 60) };
  const إلغاء_النبض = window.cancelAnimationFrame || function(id) { window.clearTimeout(id) };
  
  const ألوان_العشق = ["#f44336","#e91e63","#9c27b0","#673ab7","#3f51b5","#2196f3","#03a9f4","#00bcd4","#009688","#4caf50","#8bc34a","#cddc39","#ffeb3b","#ffc107","#ff9800","#ff5722","#795548","#9e9e9e","#607d8b"];
  const عدد_القصاصات = 200;
  const انتشار = 100;
  const سرعة_البداية = 100;
  const زاوية_القلب = Math.PI/2;
  const حياة_القصاصة = 500;
  const جاذبية = 1;
  const k = 1.3;
  
  let قصاصات_الفرح = [];
  let لوحة = null;
  let فرشاة = null;
  
  function إطلاق_الفرح(t) {
    if(!لوحة) {
      لوحة = document.createElement("canvas");
      لوحة.style.position = "fixed";
      لوحة.style.top = "0";
      لوحة.style.left = "0";
      لوحة.style.pointerEvents = "none";
      لوحة.style.zIndex = "100";
      document.body.appendChild(لوحة);
      فرشاة = لوحة.getContext("2d");
      window.addEventListener("resize", function() {
        لوحة.width = window.innerWidth;
        لوحة.height = window.innerHeight;
      });
      لوحة.width = window.innerWidth;
      لوحة.height = window.innerHeight;
    }
    
    const i = Object.assign({}, t);
    const n = i.origin || {x:0.5, y:0.5};
    const a = n.x * لوحة.width;
    const r = n.y * لوحة.height;
    const s = i.particleCount || عدد_القصاصات;
    const c = i.colors || ألوان_العشق;
    const f = i.spread || انتشار;
    const h = i.startVelocity || سرعة_البداية;
    const u = i.decay || 0.95;
    const l = i.ticks || حياة_القصاصة;
    const p = i.gravity || جاذبية;
    const d = i.scalar || k;
    const m = i.flat || false;
    const x = m ? Math.PI : زاوية_القلب;
    const y = Math.max(0, x - x * f / 360);
    const b = Math.min(x, x + x * f / 360);
    
    for(let C = 0; C < s; C++) {
      const L = Math.random() * (b - y) + y;
      const H = Math.random() * c.length;
      const J = c[Math.floor(H)];
      const V = Math.random() * (b - y) + y;
      
      قصاصات_الفرح.push({
        x: a,
        y: r,
        velocity: {
          x: (Math.random() < 0.5 ? -1 : 1) * Math.cos(L) * h,
          y: (Math.random() < 0.5 ? -1 : 1) * Math.sin(L) * h
        },
        color: J,
        flat: m,
        ticks: 0,
        life: l,
        decay: u,
        gravity: p,
        scalar: d,
        rotation: Math.random() * 2 * Math.PI,
        rotationVelocity: Math.random() * 0.1 + 0.05
      });
    }
    
    if(قصاصات_الفرح.length > 0) {
      نبض_الإطار(رسم_الفرح);
    }
  }
  
  function رسم_الفرح() {
    فرشاة.clearRect(0, 0, لوحة.width, لوحة.height);
    
    for(let t = قصاصات_الفرح.length - 1; t >= 0; t--) {
      const e = قصاصات_الفرح[t];
      e.x += e.velocity.x;
      e.y += e.velocity.y;
      e.velocity.y += e.gravity;
      e.velocity.x *= e.decay;
      e.velocity.y *= e.decay;
      e.ticks++;
      e.rotation += e.rotationVelocity;
      
      if(e.ticks > e.life || e.y > لوحة.height || e.x < 0 || e.x > لوحة.width) {
        قصاصات_الفرح.splice(t, 1);
      }
      
      فرشاة.save();
      فرشاة.translate(e.x, e.y);
      فرشاة.rotate(e.rotation);
      فرشاة.fillStyle = e.color;
      فرشاة.fillRect(-5, -5, 10, 10);
      فرشاة.restore();
    }
    
    if(قصاصات_الفرح.length > 0) {
      نبض_الإطار(رسم_الفرح);
    } else {
      لوحة.remove();
      لوحة = null;
    }
  }
  
  إطلاق_الفرح(options);
}
