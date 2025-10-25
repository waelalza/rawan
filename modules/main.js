// ======== main.js: القلب النابض للتطبيق ========
import { initCloudAnimation, initBlossomAnimation } from './animations.js';
import confetti from './confetti.js';
import { initGame } from './game.js';

// ======== إعداد الصوت ========
const audio = document.getElementById('audio');
const musicBtn = document.getElementById('musicBtn');
const vinylBtn = document.getElementById('vinylBtn');
let isPlaying = false;

function toggleMusic() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    musicBtn.setAttribute('aria-pressed', 'false');
    vinylBtn.classList.remove('playing');
  } else {
    audio.play().catch(e => console.log('Audio play failed:', e));
    isPlaying = true;
    musicBtn.setAttribute('aria-pressed', 'true');
    vinylBtn.classList.add('playing');
  }
}

musicBtn?.addEventListener('click', toggleMusic);
vinylBtn?.addEventListener('click', toggleMusic);

// ======== زر البداية ========
document.getElementById('startBtn')?.addEventListener('click', () => {
  confetti({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  showToast('انثري قهوة العشق يا روان! ☕');
  if (!isPlaying) toggleMusic();
});

// ======== زر نسخ الرابط ========
document.getElementById('copyLink')?.addEventListener('click', async () => {
  const url = 'https://rawan.pages.dev/';
  try {
    await navigator.clipboard.writeText(url);
    showToast('تم نسخ رابط الحب إلى قلبك 💕');
    confetti({ x: window.innerWidth / 2, y: window.innerHeight / 3 });
  } catch (err) {
    showToast('فشل نسخ الرابط، حاولي مرة أخرى');
  }
});

// ======== زر الانتقال للضيوف ========
document.getElementById('toGuest')?.addEventListener('click', () => {
  document.getElementById('guest')?.scrollIntoView({ behavior: 'smooth' });
});

// ======== القسم السري ========
const secretBtn = document.getElementById('unlockBtn');
const secretInput = document.getElementById('secretPass');
const secretContent = document.getElementById('secretContent');

secretBtn?.addEventListener('click', () => {
  const pass = secretInput?.value;
  if (pass === '2003') {
    secretContent.style.display = 'block';
    confetti({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    showToast('فُتحَت أبوابُ القلب يا روان 💖');
  } else {
    showToast('رمز السر خاطئ، حاولي مرة أخرى 🔐');
  }
});

// ======== العد التنازلي ========
function updateCountdown() {
  const target = new Date('2025-12-31T23:59:59');
  const now = new Date();
  const diff = target - now;

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cDays').textContent = String(days).padStart(2, '0');
    document.getElementById('cHrs').textContent = String(hours).padStart(2, '0');
    document.getElementById('cMins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cSeds').textContent = String(secs).padStart(2, '0');
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ======== السماء والنجوم ========
const skyCanvas = document.getElementById('skyCanvas');
const skyCtx = skyCanvas?.getContext('2d');

function drawSky() {
  if (!skyCtx) return;
  
  const w = skyCanvas.width;
  const h = skyCanvas.height;
  
  // خلفية السماء
  const gradient = skyCtx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, '#001a33');
  gradient.addColorStop(1, '#000814');
  skyCtx.fillStyle = gradient;
  skyCtx.fillRect(0, 0, w, h);
  
  // النجوم
  const stars = [
    { x: w * 0.3, y: h * 0.18, size: 4 },
    { x: w * 0.75, y: h * 0.1, size: 4 },
    { x: w * 0.42, y: h * 0.72, size: 3 },
    { x: w * 0.12, y: h * 0.6, size: 3 },
    { x: w * 0.65, y: h * 0.6, size: 3 }
  ];
  
  stars.forEach(star => {
    skyCtx.fillStyle = '#FFD700';
    skyCtx.beginPath();
    skyCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    skyCtx.fill();
    
    skyCtx.fillStyle = 'rgba(255, 215, 0, 0.3)';
    skyCtx.beginPath();
    skyCtx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
    skyCtx.fill();
  });
}

drawSky();

// ======== الأقسام النصية ========
const sections = {
  s1: ['في لحظةٍ من لحظاتِ القدر، التقتْ عيونُنا', 'وكانَ القلبُ يعرفُ، قبلَ العقل، أنّكِ أنتِ'],
  s2: ['روان... اسمٌ يُشبهُ الماء، يُشبهُ الحياة', 'ينسابُ في الروحِ كنهرٍ من الياسمين'],
  s4: ['سأحبُّكِ اليوم وغداً وإلى الأبد', 'وأعِدُكِ بأن تكوني دائماً، ملكةً في قلبي']
};

Object.entries(sections).forEach(([id, lines]) => {
  const container = document.getElementById(`l${id.slice(1)}`);
  if (container) {
    lines.forEach(line => {
      const p = document.createElement('p');
      p.className = 'poem-line';
      p.textContent = line;
      container.appendChild(p);
      
      setTimeout(() => p.classList.add('show'), 100);
    });
  }
});

// ======== مولد القصائد ========
const poemModes = {
  qabbani: [
    'يا {name}، أنتِ القصيدةُ التي لم أكتبْها بعد',
    'أنتِ الحبُّ الذي يُعيدُ تعريفَ الحب',
    'في عينيكِ أرى كلَّ ما لم أفهمْهُ من الدنيا'
  ],
  free: [
    '{name}... اسمٌ يكفي لملءِ السماء',
    'كلُّ نجمةٍ في الليل تهمسُ باسمِك',
    'وأنا هنا، أكتبُ الحبَّ من جديد'
  ],
  pledge: [
    'أقسمُ، يا {name}، أن أحبَّكِ كما لم يُحَب أحد',
    'سأكونُ ظِلَّكِ في الشمس، ونورَكِ في الليل',
    'وسأبقى معكِ حتى آخرِ نبضة'
  ],
  velvet: [
    'همسةٌ في أذنِك يا {name}: أنتِ كلُّ شيء',
    'أنتِ السكونُ الذي أبحثُ عنه',
    'والعاصفةُ التي أرغبُ فيها'
  ]
};

document.getElementById('newPoem')?.addEventListener('click', () => {
  const mode = document.getElementById('poemMode')?.value || 'qabbani';
  const name = document.getElementById('herName')?.value || 'روان';
  const poemBox = document.getElementById('poemBox');
  
  if (poemBox) {
    const lines = poemModes[mode] || poemModes.qabbani;
    poemBox.innerHTML = '';
    
    lines.forEach((line, i) => {
      const p = document.createElement('p');
      p.className = 'poem-line';
      p.textContent = line.replace('{name}', name);
      poemBox.appendChild(p);
      
      setTimeout(() => p.classList.add('show'), i * 300);
    });
  }
});

// ======== قارئة الطالع (Fortune) ========
const fortunes = [
  'الليلةَ، خذيها إلى مطعمٍ على البحر، واحكي لها عن النجوم',
  'اصنعي لها هديةً بيديك، شيءٌ صغيرٌ لكنّه من القلب',
  'اكتبي لها رسالةً بخط يدك، واتركيها تحتَ وسادتها',
  'خذيها في نزهةٍ طويلة، فقط أنتما والطبيعة',
  'احجزي ليلةً تحتَ النجوم، وارويْ لها حكايةَ حبّكما'
];

document.getElementById('fortuneBtn')?.addEventListener('click', () => {
  const card = document.getElementById('fortuneCard');
  const text = document.getElementById('fText');
  
  if (card && text) {
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    text.textContent = randomFortune;
    card.style.display = 'block';
    confetti({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }
});

// ======== إظهار الرسائل المؤقتة ========
function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

// ======== تهيئة الرسوم المتحركة ========
initCloudAnimation();
initBlossomAnimation();
initGame();

console.log('💕 مرحباً يا روان، هذا الموقع مصنوعٌ بحب من وائل 💕');
