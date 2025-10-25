// ======== مغامرة الحب: لعبة ماريو الرومانسية ========
import confetti from './confetti.js';

export function initGame() {
  const لوحة_المغامرة = document.querySelector('#marioCanvas');
  const فرشاة_المغامرة = لوحة_المغامرة.getContext('2d');
  const ابدأ_المغامرة = document.querySelector('#gStart');
  const أعد_الرحلة = document.querySelector('#gReset');
  const القلوب = document.querySelector('#gScore');
  const الوقت = document.querySelector('#gTime');
  const الأرواح = document.querySelector('#gLives');
  
  let وائل, منصات = [], قلوب_المغامرة = [];
  let تدور = false;
  let الوقت_المتبقي = 60;
  let النتيجة = 0;
  let الأرواح_المتبقية = 3;
  let إطار = 0;
  let gameInitialized = false;
  
  function مستطيل(x, y, عرض, ارتفاع) {
    return {x, y, عرض, ارتفاع};
  }
  
  function يصطدم(a, b) {
    return a.x < b.x + b.عرض && 
           a.x + a.عرض > b.x && 
           a.y < b.y + b.ارتفاع && 
           a.y + a.ارتفاع > b.y;
  }
  
  function تهيئة_المغامرة() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const cssW = لوحة_المغامرة.clientWidth;
    const cssH = Math.round(cssW * 0.53);
    لوحة_المغامرة.style.height = cssH + 'px';
    لوحة_المغامرة.width = Math.round(cssW * dpr);
    لوحة_المغامرة.height = Math.round(cssH * dpr);
    فرشاة_المغامرة.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  
  function رسم_وائل() {
    فرشاة_المغامرة.fillStyle = '#FF6B8B';
    فرشاة_المغامرة.fillRect(وائل.x, وائل.y, وائل.عرض, وائل.ارتفاع);
    فرشاة_المغامرة.fillStyle = '#000';
    فرشاة_المغامرة.fillRect(وائل.x + 4, وائل.y + 8, 4, 4);
  }
  
  function رسم_منصة(m) {
    فرشاة_المغامرة.fillStyle = '#228B22';
    فرشاة_المغامرة.fillRect(m.x, m.y, m.عرض, m.ارتفاع);
  }
  
  function رسم_قلب(h) {
    فرشاة_المغامرة.fillStyle = '#FF4040';
    فرشاة_المغامرة.beginPath();
    فرشاة_المغامرة.moveTo(h.x, h.y - 6);
    فرشاة_المغامرة.bezierCurveTo(h.x + 8, h.y - 18, h.x + 28, h.y - 10, h.x + 28, h.y + 6);
    فرشاة_المغامرة.bezierCurveTo(h.x + 28, h.y + 22, h.x + 14, h.y + 30, h.x, h.y + 38);
    فرشاة_المغامرة.bezierCurveTo(h.x - 14, h.y + 30, h.x - 28, h.y + 22, h.x - 28, h.y + 6);
    فرشاة_المغامرة.bezierCurveTo(h.x - 28, h.y - 10, h.x - 8, h.y - 18, h.x, h.y - 6);
    فرشاة_المغامرة.fill();
  }
  
  function إنتاج_منصات() {
    const W = لوحة_المغامرة.clientWidth;
    const H = لوحة_المغامرة.clientHeight;
    منصات = [مستطيل(0, H - 10, W, 10)];
    for(let i = 0; i < 5; i++) {
      const x = 100 + i * 150;
      const y = 150 + Math.random() * 50;
      منصات.push(مستطيل(x, y, 80, 10));
    }
  }
  
  function إنتاج_قلوب() {
    قلوب_المغامرة = [];
    for(let i = 0; i < 3; i++) {
      قلوب_المغامرة.push({
        x: 150 + i * 150,
        y: 100 + Math.random() * 50,
        r: 18
      });
    }
  }
  
  function بدء_المغامرة() {
    وائل = {
      x: 50,
      y: 200,
      vx: 0,
      vy: 0,
      عرض: 16,
      ارتفاع: 32,
      يقفز: false
    };
    النتيجة = 0;
    الأرواح_المتبقية = 3;
    الوقت_المتبقي = 60;
    القلوب.textContent = 0;
    الوقت.textContent = 60;
    الأرواح.textContent = 3;
    تهيئة_المغامرة();
    إنتاج_منصات();
    إنتاج_قلوب();
    تدور = true;
    cancelAnimationFrame(إطار);
    مغامرة_الحب.آخر_ثانية = performance.now();
    مغامرة_الحب();
  }
  
  function مغامرة_الحب() {
    if(!تدور) return;
    إطار = requestAnimationFrame(مغامرة_الحب);
    
    const W = لوحة_المغامرة.clientWidth;
    const H = لوحة_المغامرة.clientHeight;
    
    فرشاة_المغامرة.clearRect(0, 0, W, H);
    فرشاة_المغامرة.fillStyle = '#87CEEB';
    فرشاة_المغامرة.fillRect(0, 0, W, H);
    
    وائل.x += وائل.vx;
    وائل.y += وائل.vy;
    وائل.vy += 0.5;
    
    if(وائل.x < 0) وائل.x = 0;
    if(وائل.x > W - وائل.عرض) وائل.x = W - وائل.عرض;
    
    if(وائل.y > H - وائل.ارتفاع) {
      وائل.y = H - وائل.ارتفاع;
      وائل.vy = 0;
      وائل.يقفز = false;
    }
    
    for(const p of منصات) {
      const قبل = {...وائل};
      if(يصطدم(وائل, p) && وائل.vy > 0 && قبل.y + قبل.ارتفاع <= p.y + 5) {
        وائل.y = p.y - وائل.ارتفاع;
        وائل.vy = 0;
        وائل.يقفز = false;
      }
      رسم_منصة(p);
    }
    
    for(let i = قلوب_المغامرة.length - 1; i >= 0; i--) {
      const h = قلوب_المغامرة[i];
      const cx = Math.max(وائل.x, Math.min(h.x, وائل.x + وائل.عرض));
      const cy = Math.max(وائل.y, Math.min(h.y, وائل.y + وائل.ارتفاع));
      const dx = h.x - cx;
      const dy = h.y - cy;
      if(dx * dx + dy * dy <= h.r * h.r) {
        قلوب_المغامرة.splice(i, 1);
        النتيجة++;
        القلوب.textContent = النتيجة;
        confetti({
          particleCount: 50,
          spread: 50,
          origin: {x: (وائل.x + 8) / W, y: (وائل.y + 16) / H}
        });
      }
      رسم_قلب(h);
    }
    
    رسم_وائل();
    
    const الآن = performance.now();
    if(الآن - مغامرة_الحب.آخر_ثانية >= 1000) {
      مغامرة_الحب.آخر_ثانية = الآن;
      الوقت_المتبقي--;
      الوقت.textContent = الوقت_المتبقي;
      if(الوقت_المتبقي <= 0 || الأرواح_المتبقية <= 0) {
        تدور = false;
        cancelAnimationFrame(إطار);
        const msg = النتيجة >= 3 ? "قلبي لكِ، يا روان!" : "حاولي مجددًا، يا فاتنتي!";
        const همسة_الفرح = document.querySelector('#toast');
        همسة_الفرح.textContent = msg;
        همسة_الفرح.classList.add('show');
        setTimeout(() => همسة_الفرح.classList.remove('show'), 1400);
      }
    }
  }
  
  function handleKeyDown(e) {
    if(!تدور) return;
    if(e.key === 'ArrowLeft') وائل.vx = -3;
    if(e.key === 'ArrowRight') وائل.vx = 3;
    if((e.code === 'Space' || e.key === ' ') && !وائل.يقفز) {
      e.preventDefault();
      وائل.vy = -10;
      وائل.يقفز = true;
    }
  }
  
  function handleKeyUp(e) {
    if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') وائل.vx = 0;
  }
  
  function handleResize() {
    if(!تدور) {
      تهيئة_المغامرة();
      إنتاج_منصات();
    }
  }
  
  // Only initialize event listeners once
  if (!gameInitialized) {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);
    
    ابدأ_المغامرة.addEventListener('click', بدء_المغامرة);
    أعد_الرحلة.addEventListener('click', () => {
      تدور = false;
      cancelAnimationFrame(إطار);
      النتيجة = 0;
      القلوب.textContent = 0;
      الأرواح_المتبقية = 3;
      الأرواح.textContent = 3;
      الوقت_المتبقي = 60;
      الوقت.textContent = 60;
      تهيئة_المغامرة();
      إنتاج_منصات();
      إنتاج_قلوب();
    });
    
    gameInitialized = true;
  }
  
  // Initialize canvas size
  تهيئة_المغامرة();
  إنتاج_منصات();
}
