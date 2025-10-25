// ======== سماء الحب: خلفية الأنيمي ========

function Cloud(x, y, size, speed, canvasWidth, canvasHeight) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.speed = speed;
  this.canvasWidth = canvasWidth;
  this.canvasHeight = canvasHeight;
}

Cloud.prototype.update = function() {
  this.x += this.speed;
  if (this.x > this.canvasWidth + this.size) {
    this.x = -this.size;
    this.y = Math.random() * this.canvasHeight * 0.4;
  }
};

Cloud.prototype.draw = function(ctx) {
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.ellipse(this.x, this.y, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
  ctx.fill();
};

export function initCloudAnimation() {
  const canvas = document.querySelector('#animeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let clouds = [];
  let animationFrameId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initClouds();
  }

  function initClouds() {
    clouds = [];
    for (let i = 0; i < 12; i++) {
      clouds.push(new Cloud(
        Math.random() * canvas.width,
        Math.random() * canvas.height * 0.4,
        40 + Math.random() * 60,
        0.3 + Math.random() * 0.4,
        canvas.width,
        canvas.height
      ));
    }
  }

  function animateClouds() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#FFB6C1');
    gradient.addColorStop(1, '#ADD8E6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    clouds.forEach(cloud => {
      cloud.update();
      cloud.draw(ctx);
    });
    animationFrameId = requestAnimationFrame(animateClouds);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Optimization: Only run animation when canvas is visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateClouds();
    } else {
      cancelAnimationFrame(animationFrameId);
    }
  }, { threshold: 0 });

  observer.observe(canvas);
}


// ======== أزهار الكرز: رقصة الياسمين ========

function Petal(x, y, size, canvasWidth, canvasHeight) {
  this.x = x;
  this.y = y;
  this.size = size;
  this.speed = 1 + Math.random() * 2.5;
  this.angle = Math.random() * 2 * Math.PI;
  this.angleSpeed = Math.random() * 0.04 - 0.02;
  this.drift = Math.random() * 1 - 0.5;
  this.color = Math.random() > 0.5 ? 'rgba(255,200,220,0.9)' : 'rgba(255,255,255,0.9)';
  this.canvasWidth = canvasWidth;
  this.canvasHeight = canvasHeight;
}

Petal.prototype.update = function() {
  this.y += this.speed;
  this.x += this.drift + Math.sin(this.angle) * 1.2;
  this.angle += this.angleSpeed;
  if (this.y > this.canvasHeight) {
    this.y = -20;
    this.x = Math.random() * this.canvasWidth;
  }
};

Petal.prototype.draw = function(ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, this.size * 1.5, this.size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

export function initBlossomAnimation() {
  const canvas = document.querySelector('#blossomCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const petalCount = 80;
  let petals = [];
  let animationFrameId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initPetals();
  }

  function initPetals() {
    petals = [];
    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        4 + Math.random() * 5,
        canvas.width,
        canvas.height
      ));
    }
  }

  function animateBlossoms() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      p.update();
      p.draw(ctx);
    });
    animationFrameId = requestAnimationFrame(animateBlossoms);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Optimization: Only run animation when canvas is visible
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateBlossoms();
    } else {
      cancelAnimationFrame(animationFrameId);
    }
  }, { threshold: 0 });

  observer.observe(canvas);
}
