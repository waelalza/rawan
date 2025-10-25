// ======== سماء الحب: خلفية الأنيمي (Clouds) ========
export function initCloudAnimation() {
  const لوحة_السماء = document.querySelector('#animeCanvas');
  const فرشاة_السماء = لوحة_السماء.getContext('2d');
  let سحب_الغرام = [];
  let isVisible = true;
  let animationFrame = null;
  
  function إعادة_حجم_السماء() {
    لوحة_السماء.width = window.innerWidth;
    لوحة_السماء.height = window.innerHeight;
  }
  
  window.addEventListener('resize', إعادة_حجم_السماء);
  إعادة_حجم_السماء();
  
  function سحابة(x, y, حجم, سرعة) {
    this.x = x;
    this.y = y;
    this.حجم = حجم;
    this.سرعة = سرعة;
  }
  
  سحابة.prototype.تحديث = function() {
    this.x += this.سرعة;
    if(this.x > لوحة_السماء.width + this.حجم) {
      this.x = -this.حجم;
      this.y = Math.random() * لوحة_السماء.height * 0.4;
    }
  };
  
  سحابة.prototype.رسم = function() {
    فرشاة_السماء.fillStyle = 'rgba(255,255,255,0.5)';
    فرشاة_السماء.beginPath();
    فرشاة_السماء.ellipse(this.x, this.y, this.حجم, this.حجم * 0.6, 0, 0, Math.PI * 2);
    فرشاة_السماء.fill();
  };
  
  function بداية_السحب() {
    سحب_الغرام = [];
    for(let i = 0; i < 12; i++) {
      سحب_الغرام.push(new سحابة(
        Math.random() * لوحة_السماء.width,
        Math.random() * لوحة_السماء.height * 0.4,
        40 + Math.random() * 60,
        0.3 + Math.random() * 0.4
      ));
    }
  }
  
  function حركة_السماء() {
    if (!isVisible) return;
    
    فرشاة_السماء.clearRect(0, 0, لوحة_السماء.width, لوحة_السماء.height);
    const تدرج = فرشاة_السماء.createLinearGradient(0, 0, 0, لوحة_السماء.height);
    تدرج.addColorStop(0, '#FFB6C1');
    تدرج.addColorStop(1, '#ADD8E6');
    فرشاة_السماء.fillStyle = تدرج;
    فرشاة_السماء.fillRect(0, 0, لوحة_السماء.width, لوحة_السماء.height);
    
    سحب_الغرام.forEach(سحابة => {
      سحابة.تحديث();
      سحابة.رسم();
    });
    
    animationFrame = requestAnimationFrame(حركة_السماء);
  }
  
  // Use IntersectionObserver for performance optimization
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animationFrame) {
        animationFrame = requestAnimationFrame(حركة_السماء);
      } else if (!isVisible && animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    });
  }, { threshold: 0 });
  
  observer.observe(لوحة_السماء);
  
  بداية_السحب();
  حركة_السماء();
}

// ======== أزهار الكرز: رقصة الياسمين (Blossoms) ========
export function initBlossomAnimation() {
  const لوحة_الأزهار = document.querySelector('#blossomCanvas');
  const فرشاة_الأزهار = لوحة_الأزهار.getContext('2d');
  let بتلات_الياسمين = [];
  const عدد_البتلات = 80;
  let isVisible = true;
  let animationFrame = null;
  
  function إعادة_حجم_الأزهار() {
    لوحة_الأزهار.width = window.innerWidth;
    لوحة_الأزهار.height = window.innerHeight;
  }
  
  window.addEventListener('resize', إعادة_حجم_الأزهار);
  إعادة_حجم_الأزهار();
  
  function بتلة(x, y, حجم) {
    this.x = x;
    this.y = y;
    this.حجم = حجم;
    this.سرعة = 1 + Math.random() * 2.5;
    this.زاوية = Math.random() * 2 * Math.PI;
    this.سرعة_الزاوية = Math.random() * 0.04 - 0.02;
    this.انجراف = Math.random() * 1 - 0.5;
    this.لون = Math.random() > 0.5 ? 'rgba(255,200,220,0.9)' : 'rgba(255,255,255,0.9)';
  }
  
  بتلة.prototype.تحديث = function() {
    this.y += this.سرعة;
    this.x += this.انجراف + Math.sin(this.زاوية) * 1.2;
    this.زاوية += this.سرعة_الزاوية;
    
    if(this.y > لوحة_الأزهار.height) {
      this.y = -20;
      this.x = Math.random() * لوحة_الأزهار.width;
    }
  };
  
  بتلة.prototype.رسم = function() {
    فرشاة_الأزهار.save();
    فرشاة_الأزهار.translate(this.x, this.y);
    فرشاة_الأزهار.rotate(this.زاوية);
    فرشاة_الأزهار.fillStyle = this.لون;
    فرشاة_الأزهار.beginPath();
    فرشاة_الأزهار.ellipse(0, 0, this.حجم * 1.5, this.حجم, 0, 0, Math.PI * 2);
    فرشاة_الأزهار.fill();
    فرشاة_الأزهار.restore();
  };
  
  for(let i = 0; i < عدد_البتلات; i++) {
    بتلات_الياسمين.push(new بتلة(
      Math.random() * لوحة_الأزهار.width,
      Math.random() * لوحة_الأزهار.height,
      4 + Math.random() * 5
    ));
  }
  
  function رقصة_الأزهار() {
    if (!isVisible) return;
    
    فرشاة_الأزهار.clearRect(0, 0, لوحة_الأزهار.width, لوحة_الأزهار.height);
    بتلات_الياسمين.forEach(p => {
      p.تحديث();
      p.رسم();
    });
    
    animationFrame = requestAnimationFrame(رقصة_الأزهار);
  }
  
  // Use IntersectionObserver for performance optimization
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animationFrame) {
        animationFrame = requestAnimationFrame(رقصة_الأزهار);
      } else if (!isVisible && animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
    });
  }, { threshold: 0 });
  
  observer.observe(لوحة_الأزهار);
  
  رقصة_الأزهار();
}
