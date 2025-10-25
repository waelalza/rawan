<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#FF6B8B" />
  <title>وائل و روان — ديوان الخلود</title>
  <meta name="description" content="ديوانٌ ينبضُ بحبّ وائل وروان، حيثُ الحروفُ قصائدُ والنجومُ ذكريات، مكتوبٌ بروح نزار ودرويش." />
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=Caveat:wght@400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <canvas id="animeCanvas"></canvas>
  <canvas id="blossomCanvas"></canvas>
  
  <div class="wrap">
    <section class="hero" id="hero">
      <h1 class="title">وائل <span style="color:#FF6B8B">♥</span> روان</h1>
      <div class="tag" id="heroTag">أنتِ قصيدتي الأبدية</div>
      <div class="btns">
        <button class="btn pink" id="startBtn">انثري قهوة العشق</button>
        <button class="btn" id="musicBtn" aria-pressed="false">نغمة القلب</button>
        <button class="btn outline" id="toGuest">ذكرى عابرة</button>
        <button class="btn outline" id="copyLink">اقتباس الحب</button>
      </div>
      <div class="hint" id="musicHint"></div>
    </section>

    <section id="secretLove">
      <span class="badge">مفتاحُ القلب</span>
      <p style="text-align:center;margin:12px 0 16px;font-size:19px">يا روان، أدخلي عامَ ميلادِكِ لتُضيئي سرَّ القلب.</p>
      <div style="text-align:center;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
        <input type="number" id="secretPass" class="pill" placeholder="رمزُ السر" style="width:130px;text-align:center;font-size:24px" />
        <button class="btn pink" id="unlockBtn">افتحي أبوابَ العشق</button>
      </div>
      <div id="secretContent" class="poem-box" style="display:none;margin-top:18px;border-color:#ff6b8b;min-height:auto;">
        <p class="poem-line show" style="line-height:1.9;font-size:21px;font-weight:500;text-align:justify;">
          روان، يا لحنَ الياسمين، اسمُكِ قصيدةٌ تُنقشُ على جدرانِ قلبي. أنتِ النجمةُ التي لا تغيب، والميناءُ الذي يُرسي وائلَ إلى الأبد.
        </p>
      </div>
    </section>

    <section id="countdownSection">
      <span class="badge">عدّادُ الخلود</span>
      <div id="countdown">
        <div class="c-unit"><div class="c-val" id="cDays">00</div><div class="c-label">يوم</div></div>
        <div class="c-unit"><div class="c-val" id="cHrs">00</div><div class="c-label">ساعة</div></div>
        <div class="c-unit"><div class="c-val" id="cMins">00</div><div class="c-label">دقيقة</div></div>
        <div class="c-unit"><div class="c-val" id="cSeds">00</div><div class="c-label">ثانية</div></div>
      </div>
    </section>

    <section id="sky">
      <span class="badge" id="skyBadge">نجومُ العشق</span>
      <p style="text-align:center;opacity:.9;margin:10px 0 16px" id="skyNote">انظري إلى النجوم، فهي حكايتنا.</p>
      <div id="skyWrap">
        <canvas id="skyCanvas" width="800" height="380"></canvas>
        <span class="star-label" style="top:18%;left:30%" id="star1">ويغا</span>
        <span class="star-label" style="top:10%;right:25%" id="star2">دنيب</span>
        <span class="star-label" style="bottom:28%;left:42%" id="star3">الطائر</span>
        <span class="star-label" style="top:60%;left:12%" id="star4">عرق الجاثا</span>
        <span class="star-label" style="bottom:40%;right:35%" id="star5">سبيكا</span>
      </div>
    </section>

    <section id="s1"><span class="badge" id="b1">بدايةُ الوله</span><div class="lines" id="l1"></div></section>
    <section id="s2"><span class="badge" id="b2">همسُ الاسم</span><div class="lines" id="l2"></div></section>
    <section id="s4"><span class="badge" id="b4">عهدُ الخلود</span><div class="lines" id="l4"></div></section>

    <section id="poems">
      <span class="badge">ديوانُ الروح</span>
      <div class="poem-controls">
        <input id="herName" class="pill" style="min-width:150px" placeholder="اسمها الشاعري" value="روان" />
        <select id="poemMode" class="pill">
          <option value="qabbani" selected>نزار الكلاسيكي</option>
          <option value="free">نزار الهادئ</option>
          <option value="pledge">نزار الوعد</option>
          <option value="velvet">نزار المخملي</option>
        </select>
        <button class="btn pink" id="newPoem">نظمي قصيدتي</button>
      </div>
      <div class="poem-box" id="poemBox" aria-live="polite"></div>
    </section>

    <section id="fortune">
      <span class="badge">ليلةُ الوعد</span>
      <div style="text-align:center">
        <button class="btn pink" id="fortuneBtn">خططي ليلةَ الحب</button>
      </div>
      <div id="fortuneCard" style="display:none;margin-top:18px;background:#fff;padding:20px;border-radius:12px;box-shadow:var(--shadow)">
        <p id="fText" style="font-size:21px;font-weight:700;margin:0"></p>
      </div>
    </section>

    <section id="game">
      <span class="badge">مغامرةُ الحب</span>
      <canvas id="marioCanvas"></canvas>
      <div class="game-ui">
        <button class="btn pink" id="gStart">ابدأي المغامرة</button>
        <button class="btn outline" id="gReset">أعيدي الرحلة</button>
        <span class="game-pill">النتيجة: <b id="gScore">0</b></span>
        <span class="game-pill">الوقت: <b id="gTime">60</b></span>
        <span class="game-pill">الأرواح: <b id="gLives">3</b></span>
      </div>
    </section>

    <section id="guest">
      <span class="badge">دفترُ الذكرى</span>
      <div style="margin-top:12px">
        <script src="https://utteranc.es/client.js"
          repo="waelalza/rawan"
          issue-term="pathname"
          label="comment"
          theme="github-light"
          crossorigin="anonymous"
          async>
        </script>
      </div>
    </section>
  </div>
  
  <audio id="audio" preload="auto" playsinline webkit-playsinline src="./assets/audio/rawan-theme.mp3" loop></audio>
  <button class="vinyl" id="vinylBtn" aria-label="تشغيل/إيقاف النغمة"><span class="vinyl-label">R♥W</span></button>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>

  <script src="modules/main.js" type="module"></script>
</body>
</html>
