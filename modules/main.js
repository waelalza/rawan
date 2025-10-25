// ======== ديوانٌ من الكود، حيث الحبُّ قصيدةٌ تُكتبُ بلغةِ الروح ========
import confetti from './confetti.js';
import { initCloudAnimation, initBlossomAnimation } from './animations.js';
import { initGame } from './game.js';

// ======== بوابة الشعر: ربطٌ بالنجوم ========
const بوابة_القلب = "https://cf-ai.waeel-zahrani.workers.dev";

// ======== أدوات القصيدة ========
const اختر = s => document.querySelector(s);
const همسة_الفرح = اختر('#toast');
const همس = (t) => {
  همسة_الفرح.textContent = t || "";
  همسة_الفرح.classList.add('show');
  setTimeout(() => همسة_الفرح.classList.remove('show'), 1400);
};
const قسم_الأبيات = s => (s || "").split(/\n|[.!؟]\s*/).map(v => v.trim()).filter(Boolean);
const قص = (t, m) => (t || "").slice(0, m).trim();

function تهذيب_الكلام(txt) {
  if(!txt) return "";
  txt = txt.replace(/[A-Za-z[\]{}_*<>`~]/g, "").replace(/\s{2,}/g, " ").replace(/["""']/g, "").trim();
  const ممنوعات = ["مساعدتك", "خدمتك", "كمساعدة", "الذكاء الاصطناعي", "إليك", "كمثال", "كمستخدم"];
  if(ممنوعات.some(b => txt.includes(b))) return "";
  return txt;
}

// ======== استدعاء الشعر: روح نزار ودرويش ========
async function نزار_يناجي(p) {
  const أسلوب = "اكتب بأسلوب نزار قباني أو محمود درويش. لغة فصيحة، شاعرية، موجزة، تخاطب القلب. بلا حشو أو تعليقات.";
  const نص = `${p}\n${أسلوب}`;
  const رد = await fetch(بوابة_القلب, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({prompt: نص})
  });
  const نص_الرد = await رد.text();
  let بيانات = {};
  try {
    بيانات = JSON.parse(نص_الرد);
  } catch {
    return "";
  }
  return تهذيب_الكلام(بيانات.response || (بيانات.result && بيانات.result.response) || "");
}

// ======== نغمة العشق: لحن القلب ========
const صوت_الحب = اختر('#audio');
const زر_النغمة = اختر('#musicBtn');
const قرص_النبض = اختر('#vinylBtn');
const تلميح_النغمة = اختر('#musicHint');

function مزامرة_النغمة(يعزف) {
  زر_النغمة.textContent = يعزف ? "أوقفي النغمة" : "نغمة القلب";
  زر_النغمة.setAttribute("aria-pressed", يعزف ? "true" : "false");
  قرص_النبض.classList.toggle("playing", يعزف);
}

async function جرب_العزف() {
  try {
    صوت_الحب.muted = false;
    صوت_الحب.volume = 1;
    await صوت_الحب.play();
    مزامرة_النغمة(true);
    تلميح_النغمة.textContent = "";
  } catch {
    تلميح_النغمة.textContent = "إذنُ القلبِ مطلوبٌ للنغم.";
  }
}

window.addEventListener("load", جرب_العزف);

زر_النغمة.onclick = async () => {
  if(صوت_الحب.paused) {
    try {
      await صوت_الحب.play();
      مزامرة_النغمة(true);
    } catch {}
  } else {
    صوت_الحب.pause();
    مزامرة_النغمة(false);
  }
};

قرص_النبض.onclick = زر_النغمة.onclick;

اختر('#startBtn').onclick = () => اختر('#poems').scrollIntoView({behavior: 'smooth'});
اختر('#toGuest').onclick = () => اختر('#guest').scrollIntoView({behavior: 'smooth'});
اختر('#copyLink').onclick = async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    همس("نُسخَ الحبُّ كقصيدة!");
  } catch {}
};

// ======== عدّاد الخلود: انتظار الوصال ========
function جدد_العدّاد() {
  const موعد_القلب = new Date('2026-01-01T00:00:00').getTime();
  const الآن = new Date().getTime();
  const مسافة = موعد_القلب - الآن;
  const أيام = Math.floor(مسافة / (1000 * 60 * 60 * 24));
  const ساعات = Math.floor((مسافة % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const دقائق = Math.floor((مسافة % (1000 * 60 * 60)) / (1000 * 60));
  const ثواني = Math.floor((مسافة % (1000 * 60)) / 1000);
  
  اختر('#cDays').textContent = أيام > 0 ? أيام.toString().padStart(2, '0') : '00';
  اختر('#cHrs').textContent = ساعات.toString().padStart(2, '0');
  اختر('#cMins').textContent = دقائق.toString().padStart(2, '0');
  اختر('#cSeds').textContent = ثواني.toString().padStart(2, '0');
  
  if(مسافة < 0) {
    clearInterval(عدّاد_الخلود);
    اختر('#countdown').innerHTML = `<span class="badge" style="font-size:22px;">وائل وروان، وصالٌ أبدي!</span>`;
  }
}

const عدّاد_الخلود = setInterval(جدد_العدّاد, 1000);
جدد_العدّاد();

// ======== خريطة النجوم: ذكرياتٌ مضيئة ========
const سماء = اختر('#skyCanvas');
const فرشاة = سماء.getContext('2d');
const نجوم = [
  {x: 150, y: 100, s: 3},
  {x: 500, y: 80, s: 3},
  {x: 300, y: 250, s: 2},
  {x: 100, y: 300, s: 2},
  {x: 250, y: 330, s: 2},
  {x: 400, y: 200, s: 2}
];

(function رسم_السماء() {
  فرشاة.clearRect(0, 0, سماء.width, سماء.height);
  نجوم.forEach(st => {
    فرشاة.beginPath();
    فرشاة.arc(st.x, st.y, st.s, 0, 2 * Math.PI);
    فرشاة.fillStyle = '#fff';
    فرشاة.fill();
  });
  فرشاة.beginPath();
  فرشاة.moveTo(150, 100);
  فرشاة.lineTo(500, 80);
  فرشاة.lineTo(300, 250);
  فرشاة.closePath();
  فرشاة.strokeStyle = 'rgba(255,255,255,.28)';
  فرشاة.lineWidth = 1;
  فرشاة.stroke();
  requestAnimationFrame(رسم_السماء);
})();

// ======== همسات القلب: نصوص العشق ========
async function ملء_البداية() {
  const وسم = await نزار_يناجي("قصيدة موجزة من ٤-٥ كلمات تصف حبًا خالدًا كالنجوم.");
  اختر('#heroTag').textContent = قص(وسم, 40);
}

async function ملء_السماء() {
  const شارة = await نزار_يناجي("شارة من كلمتين تلمح لحبٍ مضيء كالنجوم.");
  const ملاحظة = await نزار_يناجي("جملة شاعرية: انظري للسماء لتجدي حبنا.");
  اختر('#skyBadge').textContent = قص(شارة, 18);
  اختر('#skyNote').textContent = قص(ملاحظة, 70);
}

async function ملء_النجوم() {
  const معرفات = ['#star1', '#star2', '#star3', '#star4', '#star5'];
  const أسماء = ['ويغا', 'دنيب', 'الطائر', 'عرق الجاثا', 'سبيكا'];
  for(let i = 0; i < معرفات.length; i++) {
    const عنصر = document.querySelector(معرفات[i]);
    const ذكرى = await نزار_يناجي(`وسم قصير من ٣-٥ كلمات لنجمة "${أسماء[i]}" تحمل غزلًا شاعريًا.`);
    عنصر.textContent = أسماء[i];
    عنصر.dataset.msg = قص(ذكرى, 42);
    عنصر.onclick = () => همس(عنصر.dataset.msg || "");
  }
}

// ======== مشاهد الحب: قصائد متسلسلة ========
function أضف_بيت(صندوق, نص, تأخير = 0) {
  const بيت = document.createElement('div');
  بيت.className = 'line';
  بيت.textContent = نص;
  صندوق.appendChild(بيت);
  setTimeout(() => بيت.classList.add('show'), 150 * تأخير);
}

async function ملء_مشهد(شارة_معرف, سطور_معرف, موجه_شارة, موجه_سطور, أقصى_سطور = 4) {
  const شارة = await نزار_يناجي(موجه_شارة);
  document.querySelector(شارة_معرف).textContent = قص(شارة, 16);
  const نص = await نزار_يناجي(موجه_سطور);
  const سطور = قسم_الأبيات(نص).slice(0, أقصى_سطور);
  const صندوق = document.querySelector(سطور_معرف);
  صندوق.innerHTML = "";
  سطور.forEach((سطر, تأخير) => أضف_بيت(صندوق, سطر, تأخير));
}

// ======== ديوان الروح: قصائد لها ========
const صندوق_القصيدة = اختر('#poemBox');
const اسمها = اختر('#herName');
const نمط_القصيدة = اختر('#poemMode');

async function نظم_قصيدة() {
  صندوق_القصيدة.innerHTML = '<div class="poem-line show">…</div>';
  const الاسم = (اسمها.value || "روان").trim();
  const نغمة =
    نمط_القصيدة.value === 'qabbani' ? "بأسلوب نزار الكلاسيكي، ناعم وموجز، يستخدم 'يا امرأة'." :
    نمط_القصيدة.value === 'free' ? "بأسلوب نزار الحديث، إيقاع هادئ، كلمات عصرية." :
    نمط_القصيدة.value === 'pledge' ? "وعد غزلي بلغة نزار، ينتهي بوعد شاعري." :
    "بأسلوب نزار المخملي، صور شاعرية رقيقة، يستخدم 'مخملي'.";
  const موجه = `قصيدة موجزة عن ${الاسم}. ${نغمة} خمسة أسطر. افصل الأسطر بسطر جديد. بلا تعليقات.`;
  const نص = await نزار_يناجي(موجه);
  صندوق_القصيدة.innerHTML = "";
  قسم_الأبيات(نص).slice(0, 5).forEach((سطر, تأخير) => {
    const بيت = document.createElement('div');
    بيت.className = 'poem-line';
    بيت.textContent = سطر;
    صندوق_القصيدة.appendChild(بيت);
    setTimeout(() => بيت.classList.add('show'), 150 * تأخير);
  });
}

اختر('#newPoem').addEventListener('click', نظم_قصيدة);

// ======== مفتاح القلب: الرسالة السرية (2003) ========
اختر('#unlockBtn').addEventListener('click', () => {
  const رمز = اختر('#secretPass').value.trim();
  if(رمز === '2003') {
    اختر('#secretContent').style.display = 'block';
    همس("فتحتِ قلبي، يا روان!");
    confetti({particleCount: 100, spread: 70, origin: {y: 0.6}});
    اختر('#unlockBtn').textContent = 'مُغلقٌ للأبد';
    اختر('#unlockBtn').classList.add('success');
    اختر('#unlockBtn').disabled = true;
  } else {
    همس("رمزٌ خاطئ، حاولي مجددًا!");
  }
});

// ======== ليلة الوعد: موعدٌ شاعري ========
const بطاقة_الوعد = اختر('#fortuneCard');
const أفكار_الموعد = [
  "قهوةٌ تحت النجوم، وقصيدةٌ لكِ.",
  "سهرةُ فيلمٍ، وعدٌ بالدفء.",
  "عشاءٌ بالشموع، أسرارٌ تُروى.",
  "نرسمُ قلبينا، خريطةَ العشق.",
  "أغنيتنا الأولى، زمنٌ يتوقف.",
  "أسئلةٌ عميقة: ما سرُّ حبكِ؟"
];

اختر('#fortuneBtn').addEventListener('click', () => {
  const موعد_عشوائي = أفكار_الموعد[Math.floor(Math.random() * أفكار_الموعد.length)];
  اختر('#fText').textContent = موعد_عشوائي;
  بطاقة_الوعد.style.display = 'block';
  همس("ليلةُ العشقِ جاهزة!");
});

// ======== Initialize Background Animations ========
initCloudAnimation();
initBlossomAnimation();

// ======== Initialize Game ========
initGame();

// ======== بداية الديوان: حيث يُولد الحب ========
(async function بداية_العشق() {
  await ملء_البداية();
  await ملء_السماء();
  await ملء_النجوم();
  await ملء_مشهد('#b1', '#l1', 'شارة موجزة عن بداية الحب', 'ثلاثة أسطر شاعرية عن أول لقاء مليء بالوله.', 3);
  await ملء_مشهد('#b2', '#l2', 'شارة موجزة عن اسم روان', 'ثلاثة أسطر شاعرية عن اسم روان كلحنٍ خالد.', 3);
  await ملء_مشهد('#b4', '#l4', 'شارة موجزة عن وعدٍ أبدي', 'أربعة أسطر شاعرية عن وعدٍ خالد بالحب.', 4);
  await نظم_قصيدة();
})();
