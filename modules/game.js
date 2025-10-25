// ======== مغامرة الحب: 8-Bit Platformer ========

export function initGame() {
  // DOM Elements
  const canvas = document.querySelector('#marioCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const scoreEl = document.querySelector('#gScore');
  const timeEl = document.querySelector('#gTime');
  const livesEl = document.querySelector('#gLives');
  const startBtn = document.querySelector('#gStart');
  const resetBtn = document.querySelector('#gReset');
  const toastEl = document.querySelector('#toast');

  // Game State
  let player, platforms, enemies, score, lives, timeLeft, isRunning, keys, timerInterval, animationFrameId;
  let isInvincible = false, invincibilityTimer = 0;
  const gravity = 0.5;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  let canvasWidth, canvasHeight;

  // Utility to show toast
  const showToast = (t) => {
    toastEl.textContent = t || "";
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 1400);
  };

  function setupCanvas() {
    const cssW = canvas.clientWidth;
    const cssH = Math.round(cssW * 0.53); // Aspect ratio
    canvas.style.height = cssH + 'px';
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    canvasWidth = cssW;
    canvasHeight = cssH;
  }

  function resetGame() {
    isRunning = false;
    if (timerInterval) clearInterval(timerInterval);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    
    setupCanvas();
    
    score = 0;
    lives = 3;
    timeLeft = 60;
    isInvincible = false;
    invincibilityTimer = 0;
    keys = { ArrowLeft: false, ArrowRight: false };

    player = { x: 50, y: canvasHeight - 50, w: 16, h: 32, vx: 0, vy: 0, onGround: false };
    
    platforms = [
      { x: 0, y: canvasHeight - 10, w: canvasWidth, h: 10 }, // Floor
      { x: 150, y: canvasHeight - 60, w: 80, h: 10 },
      { x: 300, y: canvasHeight - 110, w: 80, h: 10 },
      { x: 450, y: canvasHeight - 60, w: 80, h: 10 },
      { x: 600, y: canvasHeight - 110, w: 80, h: 10 }
    ];

    enemies = [
      { x: 150, y: canvasHeight - 76, w: 16, h: 16, vx: -0.5, initialX: 150, range: 64 }, // On platform 1
      { x: 300, y: canvasHeight - 126, w: 16, h: 16, vx: -0.5, initialX: 300, range: 64 }, // On platform 2
      { x: 450, y: canvasHeight - 26, w: 16, h: 16, vx: -0.5, initialX: 450, range: 64 }, // On floor
      { x: 600, y: canvasHeight - 126, w: 16, h: 16, vx: -0.5, initialX: 600, range: 64 } // On platform 4
    ];

    updateUI();
    draw(); // Initial draw
  }

  function startGame() {
    if (isRunning) return;
    resetGame();
    isRunning = true;
    
    timerInterval = setInterval(() => {
      if (!isRunning) return;
      timeLeft--;
      updateUI();
      if (timeLeft <= 0) {
        endGame(false);
      }
    }, 1000);
    
    gameLoop();
  }

  function endGame(didWin) {
    isRunning = false;
    clearInterval(timerInterval);
    cancelAnimationFrame(animationFrameId);
    const msg = didWin ? "قلبي لكِ، يا روان!" : "حاولي مجددًا، يا فاتنتي!";
    showToast(msg);
  }

  function updateUI() {
    scoreEl.textContent = score;
    timeEl.textContent = timeLeft;
    livesEl.textContent = lives;
  }

  function drawRect(obj, color) {
    ctx.fillStyle = color;
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
  }

  function checkCollision(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function update() {
    if (!isRunning) return;

    // Handle horizontal movement
    if (keys.ArrowLeft) player.vx = -3;
    else if (keys.ArrowRight) player.vx = 3;
    else player.vx = 0;

    // Apply gravity
    player.vy += gravity;
    player.onGround = false;

    // Update position
    player.x += player.vx;
    player.y += player.vy;

    // Screen bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.w > canvasWidth) player.x = canvasWidth - player.w;

    // Check platform collisions
    for (const p of platforms) {
      if (checkCollision(player, p) && player.vy > 0 && (player.y + player.h - player.vy) <= p.y) {
        player.y = p.y - player.h;
        player.vy = 0;
        player.onGround = true;
      }
    }

    // Fall off screen
    if (player.y > canvasHeight) {
      loseLife();
    }

    // Invincibility timer
    if (isInvincible) {
      invincibilityTimer--;
      if (invincibilityTimer <= 0) {
        isInvincible = false;
      }
    }

    // Update and check enemy collisions
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      
      // Move enemy
      e.x += e.vx;
      if (e.x < e.initialX - e.range || e.x + e.w > e.initialX + e.range + 80) { // 80 is platform width
          e.vx *= -1;
      }
      
      if (checkCollision(player, e)) {
        // Stomp
        if (player.vy > 0 && (player.y + player.h - player.vy) <= e.y) {
          enemies.splice(i, 1);
          score += 10;
          player.vy = -5; // Bounce
          updateUI();
        } 
        // Got hit
        else if (!isInvincible) {
          loseLife();
        }
      }
    }
    
    // Check for win
    if (enemies.length === 0) {
        endGame(true);
    }
  }

  function loseLife() {
    lives--;
    updateUI();
    if (lives <= 0) {
      endGame(false);
    } else {
      isInvincible = true;
      invincibilityTimer = 120; // 2 seconds (60fps)
      player.x = 50;
      player.y = canvasHeight - 50;
      player.vy = 0;
    }
  }

  function draw() {
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw platforms
    platforms.forEach(p => drawRect(p, '#228B22'));

    // Draw enemies
    enemies.forEach(e => drawRect(e, '#D2691E')); // Brown

    // Draw player
    if (isInvincible && Math.floor(invincibilityTimer / 6) % 2 === 0) {
      // Flash by not drawing
    } else {
      drawRect(player, '#FF6B8B'); // Pink
    }
  }

  function gameLoop() {
    if (!isRunning) return;
    update();
    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
  }

  // --- Setup Event Listeners ---
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') keys.ArrowLeft = true;
    if (e.key === 'ArrowRight') keys.ArrowRight = true;
    if ((e.code === 'Space' || e.key === ' ') && player.onGround) {
      e.preventDefault();
      player.vy = -10;
      player.onGround = false;
    }
  });

  document.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') keys.ArrowLeft = false;
    if (e.key === 'ArrowRight') keys.ArrowRight = false;
  });
  
  startBtn.addEventListener('click', startGame);
  resetBtn.addEventListener('click', resetGame);
  window.addEventListener('resize', resetGame);

  // Initial setup
  resetGame();
}
