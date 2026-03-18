const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const UI = {
  score: document.getElementById('score'),
  phase: document.getElementById('phase'),
  lives: document.getElementById('lives'),
  startScreen: document.getElementById('start-screen'),
  gameOverScreen: document.getElementById('game-over-screen'),
  phaseTransition: document.getElementById('phase-transition'),
  nextPhase: document.getElementById('next-phase'),
  finalScore: document.getElementById('final-score'),
  startBtn: document.getElementById('start-btn'),
  restartBtn: document.getElementById('restart-btn'),
};

const GROUND_Y = 500;
const DOG_COLOR = '#8B4513';
const EARS_COLOR = '#5C2E0A';

// --- AUDIO SYSTEM ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// YT BGM Player (KARAOKE El show del perro salchicha sem voz)
let ytPlayer = null;

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
if(firstScriptTag && firstScriptTag.parentNode) {
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
} else {
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('yt-player', {
    height: '200',
    width: '200',
    videoId: 'nOxqhZKZ91Q', // Karaoke
    playerVars: {
      'autoplay': 0,
      'controls': 0,
      'disablekb': 1,
      'loop': 1,
      'playlist': 'nOxqhZKZ91Q' 
    },
    events: {
      'onReady': function(event) {
        event.target.setVolume(60); 
      }
    }
  });
};

function startBGM() {
  if (ytPlayer && ytPlayer.playVideo) {
    ytPlayer.playVideo();
  }
}

function stopBGM() {
  if (ytPlayer && ytPlayer.pauseVideo) {
    ytPlayer.pauseVideo();
  }
}

function playTone(freq, type, duration, vol=0.1) {
  if(!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function soundJump() {
  if(!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
}

function soundShoot() {
  if(!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine'; 
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

function soundPoof() { 
  if(!audioCtx) return;
  const bufferSize = audioCtx.sampleRate * 0.2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(500, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.2);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
}

function soundTink() { 
  playTone(880, 'sine', 0.1, 0.1);
  setTimeout(() => playTone(1200, 'sine', 0.1, 0.1), 50);
}

function soundHappy() {
  playTone(523.25, 'sine', 0.1, 0.1); 
  setTimeout(() => playTone(659.25, 'sine', 0.1, 0.1), 100); 
  setTimeout(() => playTone(783.99, 'sine', 0.2, 0.1), 200); 
}

function soundFreeAnimal() {
  playTone(659.25, 'sine', 0.1, 0.1); 
  setTimeout(() => playTone(880.00, 'sine', 0.2, 0.1), 100); 
}

function soundDie() {
  if(!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 1.0);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.0);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 1.0);
}
// --- END AUDIO ---

let gameState = 'START'; 
let lastTime = 0;
let keys = {};

let game = {
  score: 0,
  phase: 1,
  lives: 3,
  speed: 250, 
  bgSpeed: 50, 
  bgOffset: 0,
  timeInPhase: 0,
  phaseDuration: 30000,
};

let player = {
  x: 200,
  y: GROUND_Y,
  width: 80,
  height: 30, 
  vx: 0,
  vy: 0,
  speed: 300,
  jumpPower: -600,
  gravity: 1600,
  isJumping: false,
  isFalling: false,
  animTimer: 0,
  lastShootTime: 0,
  shootCooldown: 300 
};

let bullets = [];
let upBullets = [];
let holes = [];
let bulldogs = [];
let enemies = [];
let savedAnimals = [];
let bombs = [];
let particles = [];
let stars = [];
let mountains = [];

function getTheme(phase) {
  const p = (phase - 1) % 4;
  if (p === 0) return { sky: '#87CEEB', g1: '#8B4513', g2: '#3a5f0b', m1: '#2e8b57', type: 'forest', starAlpha: 0 };
  if (p === 1) return { sky: '#FF7F50', g1: '#A0522D', g2: '#D2691E', m1: '#8B4513', type: 'mountain', starAlpha: 0.2 };
  if (p === 2) return { sky: '#0a0a2a', g1: '#444', g2: '#777', m1: '#555', type: 'lunar', starAlpha: 1 };
  if (p === 3) return { sky: '#4B0082', g1: '#2F4F4F', g2: '#556B2F', m1: '#483D8B', type: 'alien', starAlpha: 0.8 };
  return { sky: '#87CEEB', g1: '#8B4513', g2: '#3a5f0b', m1: '#2e8b57', type: 'forest', starAlpha: 0 };
}

for(let i=0; i<100; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * 400,
    size: Math.random() * 2 + 1,
    blinkOffset: Math.random() * Math.PI * 2
  });
}

function initMountains() {
  mountains = [];
  const theme = getTheme(game.phase);
  for(let i=0; i<10; i++) {
    mountains.push({
      x: i * 200 - 100,
      y: 300 + Math.random() * 100,
      width: 250 + Math.random() * 150,
      height: 200 + Math.random() * 100,
      color: theme.m1
    });
  }
}

window.addEventListener('keydown', e => { 
  keys[e.code] = true;
  if (gameState === 'PLAYING') {
    if (e.code === 'KeyZ' || e.code === 'KeyJ') shoot();
  }
});
window.addEventListener('keyup', e => keys[e.code] = false);

canvas.addEventListener('mousedown', () => {
  if (gameState === 'PLAYING') shoot();
});

UI.startBtn.addEventListener('click', () => {
  initAudio();
  startGame();
});
UI.restartBtn.addEventListener('click', () => {
  initAudio();
  startGame();
});

function startGame() {
  gameState = 'PLAYING';
  game.score = 0;
  game.phase = 1;
  game.lives = 3;
  resetPhase();
  UI.startScreen.classList.add('hidden');
  UI.gameOverScreen.classList.add('hidden');
  UI.phaseTransition.classList.add('hidden');
  requestAnimationFrame(gameLoop);
  startBGM(); 
}

function resetPhase() {
  game.speed = 250 + (game.phase - 1) * 30;
  game.timeInPhase = 0;
  player.x = 200;
  player.y = GROUND_Y;
  player.vy = 0;
  player.isJumping = false;
  player.isFalling = false;
  bullets = [];
  upBullets = [];
  holes = [];
  bulldogs = [];
  enemies = [];
  savedAnimals = [];
  bombs = [];
  particles = [];
  initMountains();
  updateUI();
}

function nextPhase() {
  gameState = 'TRANSITION';
  game.phase++;
  UI.nextPhase.innerText = game.phase;
  UI.phaseTransition.classList.remove('hidden');
  setTimeout(() => {
    resetPhase();
    gameState = 'PLAYING';
    UI.phaseTransition.classList.add('hidden');
    startBGM(); 
  }, 2000);
}

function die() {
  if (gameState !== 'PLAYING') return;
  game.lives--;
  soundDie();
  createExplosion(player.x, player.y - player.height/2, '#f00', 40);
  
  if (game.lives <= 0) {
    gameState = 'GAMEOVER';
    UI.finalScore.innerText = game.score;
    setTimeout(() => {
      UI.gameOverScreen.classList.remove('hidden');
    }, 1000);
    stopBGM();
  } else {
    player.x = -100; 
    setTimeout(() => {
      if (gameState === 'PLAYING') {
        player.x = 200;
        player.y = -100; 
        player.vy = 0;
      }
    }, 1000);
  }
  updateUI();
}

function shoot() {
  const now = Date.now();
  if (player.isFalling || player.x < 0) return;
  
  const timeSinceLast = now - player.lastShootTime;
  if (timeSinceLast < 120) return; 
  
  const isSpread = timeSinceLast > 0 && timeSinceLast < 400; 
  
  player.lastShootTime = now;
  
  soundShoot();
  // Bone always goes forward
  bullets.push({ x: player.x + player.width/2 - 10, y: player.y - 12, vx: 600, rot: 0 });
  
  if (isSpread) {
    // 3-Way spread up and wide diagonals!
    upBullets.push({ x: player.x, y: player.y - player.height - 20, vy: -600, vx: 0, rot: 0 }); 
    upBullets.push({ x: player.x, y: player.y - player.height - 20, vy: -500, vx: -350, rot: 0 }); 
    upBullets.push({ x: player.x, y: player.y - player.height - 20, vy: -500, vx: 350, rot: 0 }); 
  } else {
    upBullets.push({ x: player.x, y: player.y - player.height - 20, vy: -600, vx: 0, rot: 0 });
  }
}

function updateUI() {
  UI.score.innerText = game.score;
  UI.phase.innerText = game.phase;
  UI.lives.innerText = Math.max(0, game.lives);
}

function createExplosion(x, y, color, count) {
  for(let i=0; i<count; i++) {
    particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 400,
      vy: (Math.random() - 0.5) * 400,
      life: 0.5 + Math.random() * 0.5,
      maxLife: 1.0,
      color: color,
      size: Math.random() * 6 + 3
    });
  }
}

function createStarsExplosion(x, y, count) { 
  const colors = ['#FFD700', '#FFFFFF', '#FFFF00'];
  for(let i=0; i<count; i++) {
    particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 500,
      vy: (Math.random() - 0.5) * 500,
      life: 0.5 + Math.random() * 0.5,
      maxLife: 1.0,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 4 + 2,
      isStar: true
    });
  }
}

function update(dt) {
  if (gameState !== 'PLAYING') return;
  
  game.timeInPhase += dt * 1000;
  game.bgOffset += game.speed * dt;

  if (game.timeInPhase > game.phaseDuration) {
    nextPhase();
    return;
  }

  if (!player.isFalling && player.x > 0) {
    if ((keys['ArrowLeft'] || keys['KeyA']) && player.x > 50) player.x -= player.speed * dt;
    if ((keys['ArrowRight'] || keys['KeyD']) && player.x < canvas.width/2) player.x += player.speed * dt;
  }
  
  if ((keys['ArrowUp'] || keys['Space'] || keys['KeyW']) && !player.isJumping && !player.isFalling && Math.abs(player.y - GROUND_Y) <= 2) {
    player.vy = player.jumpPower;
    player.isJumping = true;
    soundJump();
  }
  
  player.y += player.vy * dt;
  player.vy += player.gravity * dt;
  
  let overHole = false;
  for(let h of holes) {
    if (player.x > h.x && player.x < h.x + h.width) {
      overHole = true;
      break;
    }
  }
  
  if (player.y >= GROUND_Y) {
    if (overHole && !player.isJumping) {
      player.isFalling = true;
      player.y = GROUND_Y + 10; 
    } else if (!player.isFalling) {
      player.y = GROUND_Y;
      player.vy = 0;
      player.isJumping = false;
    }
  }
  if (player.y > canvas.height + 100) {
    die();
  }

  for(let m of mountains) {
    m.x -= game.bgSpeed * dt;
    if (m.x + m.width < 0) {
      m.x = canvas.width + Math.random() * 100;
      m.height = 200 + Math.random() * 100;
      m.y = 300 + Math.random() * 100;
    }
  }

  const baseHoleChance = 0.001 + (game.phase * 0.0003);
  const baseBulldogChance = 0.002 + (game.phase * 0.0005);
  const baseEnemyChance = 0.001 + (game.phase * 0.0002);

  if (Math.random() < baseHoleChance) {
    if (holes.length === 0 || holes[holes.length-1].x < canvas.width - 350) {
      holes.push({ x: canvas.width, width: 100 + Math.random() * 60 });
    }
  }
  if (Math.random() < baseBulldogChance) {
    let valid = true;
    for(let h of holes) {
      if (Math.abs(h.x - canvas.width) < h.width * 2 + 80) valid = false;
    }
    if (valid && bulldogs.length < 2) { 
      bulldogs.push({ x: canvas.width, y: GROUND_Y, width: 100, height: 40, state: 'idle', animTimer: 0 });
    }
  }
  if (Math.random() < baseEnemyChance) { 
    if (enemies.length < 1 + Math.floor(game.phase / 3)) { 
      const types = ['marmota', 'lagosta', 'camarao', 'lombriz', 'cat', 'monkey'];
      enemies.push({ 
        x: canvas.width + 50, 
        y: 60 + Math.random() * 150, 
        vx: -100 - Math.random() * 50 * (1 + game.phase * 0.1),
        timer: 0,
        type: types[Math.floor(Math.random() * types.length)] // Randomly pick one of the lyrics animals!
      });
    }
  }

  for(let i = holes.length - 1; i >= 0; i--) {
    holes[i].x -= game.speed * dt;
    if (holes[i].x + holes[i].width < 0) holes.splice(i, 1);
  }
  
  for(let i = bulldogs.length - 1; i >= 0; i--) {
    let b = bulldogs[i];
    if (b.state === 'jumping_to_eat') {
      b.y += (b.vy * dt);
      b.vy += 1200 * dt; 
      b.x -= game.speed * dt;
      if (b.y >= GROUND_Y) {
         b.y = GROUND_Y;
         b.state = 'eating';
         b.animTimer = 0;
         soundHappy();
         createExplosion(b.x, b.y - 30, '#ffb6c1', 12);
         game.score += 20;
         updateUI();
      }
    } else if (b.state === 'eating') {
      b.x -= game.speed * dt; 
      b.animTimer += dt;
      if (Math.random() < 0.05) { 
        createExplosion(b.x, b.y - 30, '#ffb6c1', 1);
      }
      if (b.x + b.width < -100) bulldogs.splice(i, 1);
    } else {
      b.x -= game.speed * dt;
      b.animTimer += dt;
      if (!player.isFalling && 
          Math.abs(player.x - b.x) < player.width/2 + b.width/2 - 10 &&
          Math.abs(player.y - player.height/2 - (b.y - b.height/2)) < player.height/2 + b.height/2 - 10) {
        die();
      }
      if (b.x + b.width < -100) bulldogs.splice(i, 1);
    }
  }

  for(let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].x += enemies[i].vx * dt;
    enemies[i].timer += dt;
    if (Math.random() < 0.001 + (game.phase * 0.0002) && enemies[i].x < canvas.width && enemies[i].x > 0) {
      bombs.push({ x: enemies[i].x, y: enemies[i].y, vy: 150 + game.phase * 20 });
    }
    if (enemies[i].x < -50) enemies.splice(i, 1);
  }

  for(let i = savedAnimals.length - 1; i >= 0; i--) {
    let sa = savedAnimals[i];
    sa.y += sa.vy * dt;
    sa.vy += 200 * dt; 
    if (sa.vy > 80) sa.vy = 80; 
    sa.x -= (game.speed * 0.2) * dt; 
    
    if (sa.y >= GROUND_Y) {
      createExplosion(sa.x, sa.y, '#ffb6c1', 5); 
      savedAnimals.splice(i, 1);
    }
  }

  for(let i = bombs.length - 1; i >= 0; i--) {
    bombs[i].y += bombs[i].vy * dt;
    bombs[i].x -= game.speed * 0.2 * dt; 
    
    if (!player.isFalling &&
        Math.abs(player.x - bombs[i].x) < player.width/2 &&
        Math.abs(player.y - player.height/2 - bombs[i].y) < player.height/2) {
      die();
    }
    
    if (bombs[i].y > GROUND_Y) {
      soundPoof();
      createExplosion(bombs[i].x, GROUND_Y, '#ffaa00', 10);
      bombs.splice(i, 1);
    }
  }

  // Hit logic for Bullets (Forward - Bones)
  for(let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].x += bullets[i].vx * dt;
    bullets[i].rot += dt * 10;
    let hit = false;
    
    for(let j = bulldogs.length - 1; j >= 0; j--) {
      let b = bulldogs[j];
      if (b.state === 'idle' && Math.abs(bullets[i].x - b.x) < b.width/2 + 20 && Math.abs(bullets[i].y - (b.y - b.height/2)) < b.height) {
        b.state = 'jumping_to_eat'; 
        b.vy = -350; // Jump higher!
        b.animTimer = 0;
        soundJump();
        hit = true;
        break;
      }
    }
    
    if (!hit) {
      for(let k = bombs.length - 1; k >= 0; k--) {
        if (Math.abs(bullets[i].x - bombs[k].x) < 25 && Math.abs(bullets[i].y - bombs[k].y) < 25) {
          soundTink();
          createStarsExplosion(bombs[k].x, bombs[k].y, 15);
          game.score += 15;
          updateUI();
          bombs.splice(k, 1);
          hit = true;
          break;
        }
      }
    }

    if (hit) {
      bullets.splice(i, 1);
      continue;
    }
    if (bullets[i].x > canvas.width) bullets.splice(i, 1);
  }

  // Hit logic for Up Bullets (Stones)
  for(let i = upBullets.length - 1; i >= 0; i--) {
    upBullets[i].y += upBullets[i].vy * dt;
    upBullets[i].x += (upBullets[i].vx || 0) * dt; 
    upBullets[i].rot += dt * 10;
    let hit = false;
    
    for(let j = enemies.length - 1; j >= 0; j--) {
      if (Math.abs(upBullets[i].x - enemies[j].x) < 40 && Math.abs(upBullets[i].y - (enemies[j].y - 20)) < 40) {
        soundPoof();
        createExplosion(enemies[j].x, enemies[j].y - 20, '#555', 20); 
        soundFreeAnimal();
        savedAnimals.push({ x: enemies[j].x, y: enemies[j].y + 10, type: enemies[j].type, vy: -50 });
        enemies.splice(j, 1);
        game.score += 50;
        updateUI();
        hit = true;
        break;
      }
    }

    if (!hit) {
      for(let k = bombs.length - 1; k >= 0; k--) {
        if (Math.abs(upBullets[i].x - bombs[k].x) < 25 && Math.abs(upBullets[i].y - bombs[k].y) < 25) {
          soundTink();
          createStarsExplosion(bombs[k].x, bombs[k].y, 15);
          game.score += 15;
          updateUI();
          bombs.splice(k, 1);
          hit = true;
          break;
        }
      }
    }

    if (hit) {
      upBullets.splice(i, 1);
      continue;
    }
    if (upBullets[i].y < 0) upBullets.splice(i, 1);
  }

  for(let i = particles.length - 1; i >= 0; i--) {
    particles[i].x += particles[i].vx * dt;
    particles[i].y += particles[i].vy * dt;
    particles[i].life -= dt;
    if (particles[i].life <= 0) particles.splice(i, 1);
  }

  player.animTimer += dt;
}

// DRAW FUNCTIONS
function drawDog(ctx, x, y, width, height, timer, isJumping, isFalling) {
  ctx.save();
  ctx.translate(x, y); 
  if (isFalling) ctx.rotate(Math.PI / 4);
  else if (isJumping) ctx.rotate(-Math.PI / 12);
  
  ctx.fillStyle = DOG_COLOR;
  ctx.beginPath();
  ctx.roundRect(-width/2, -height - 10, width, height, 15);
  ctx.fill();

  // Collar "y en vez de traje se puso un collar"
  ctx.fillStyle = '#0000CD'; // Blue collar
  ctx.fillRect(width/2 - 2, -height - 18, 5, height);

  ctx.fillStyle = '#666'; 
  ctx.beginPath();
  ctx.roundRect(-15, -height - 20, 20, 10, 3);
  ctx.fill();
  
  ctx.fillStyle = '#999';
  ctx.save();
  ctx.translate(-5, -height - 20);
  ctx.rotate(-Math.PI/4); 
  ctx.fillRect(-2, -15, 6, 15);
  ctx.restore();
  
  ctx.fillStyle = DOG_COLOR;
  ctx.beginPath();
  ctx.roundRect(width/2 - 10, -height - 30, 30, 25, 10);
  ctx.fill();

  // "Tiene sombrero de marinero"
  ctx.save();
  ctx.translate(width/2 + 5, -height - 30);
  ctx.rotate(-0.1);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 12, Math.PI, 0); // Hat dome
  ctx.fill();
  ctx.fillStyle = '#0000CD'; // Hat brim
  ctx.fillRect(-15, -2, 30, 4);
  // Little ribbon
  ctx.fillStyle = '#00008B';
  ctx.fillRect(-5, -12, 10, 2);
  ctx.restore();
  
  ctx.beginPath();
  ctx.roundRect(width/2 + 10, -height - 20, 25, 12, 6);
  ctx.fill();
  
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(width/2 + 32, -height - 15, 3, 0, Math.PI*2);
  ctx.fill();
  
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(width/2 + 12, -height - 22, 4, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(width/2 + 14, -height - 22, 2, 0, Math.PI*2);
  ctx.fill();
  
  ctx.save();
  ctx.translate(width/2, -height - 25);
  let earFlap = 0;
  if (isFalling) earFlap = -Math.PI/2 + Math.sin(timer * 30) * 0.3;
  else if (isJumping) earFlap = -Math.PI/3 + Math.sin(timer * 40) * 0.6; 
  else earFlap = -Math.PI/8 + Math.sin(timer * 20) * 0.4;
  ctx.rotate(earFlap);
  
  ctx.fillStyle = EARS_COLOR;
  ctx.beginPath();
  ctx.roundRect(-5, 0, 15, 25, 8);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(-width/2 + 5, -height - 5);
  ctx.rotate(Math.sin(timer * 15) * 0.3 - 0.5);
  ctx.fillStyle = DOG_COLOR;
  ctx.beginPath();
  ctx.roundRect(-20, -5, 25, 8, 4);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = EARS_COLOR;
  const swing = isJumping || isFalling ? 0 : Math.sin(timer * 20) * 10;
  
  ctx.fillRect(-width/2 + 10 + swing, -15, 8, 15);
  ctx.fillRect(width/2 - 20 - swing, -15, 8, 15);
  ctx.fillRect(-width/2 + 20 - swing, -15, 8, 15);
  ctx.fillRect(width/2 - 10 + swing, -15, 8, 15);
  ctx.restore();
}

function drawBone(ctx, x, y, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  
  ctx.fillStyle = '#eee';
  ctx.fillRect(-10, -3, 20, 6);
  ctx.beginPath();
  ctx.arc(-10, -4, 4, 0, Math.PI*2);
  ctx.arc(-10, 4, 4, 0, Math.PI*2);
  ctx.arc(10, -4, 4, 0, Math.PI*2);
  ctx.arc(10, 4, 4, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawBulldog(ctx, x, y, width, height, timer, state) {
  ctx.save();
  ctx.translate(x, y); 
  
  if (state === 'eating') {
     ctx.translate(0, -height/2);
     ctx.rotate(Math.PI); 
     ctx.translate(0, height/2);
  } else if (state === 'jumping_to_eat') {
     ctx.translate(0, -10);
     ctx.rotate(-0.1); 
  }
  
  ctx.fillStyle = '#e6bc7a';
  ctx.beginPath();
  ctx.roundRect(-width/2, -height, width, height, 12);
  ctx.fill();
  
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(-width/2 + 10, -height/2, width - 20, height/2, 8);
  ctx.fill();
  
  ctx.fillStyle = '#e6bc7a';
  ctx.beginPath();
  ctx.roundRect(-width/2 - 15, -height - 5, 35, 35, 10); 
  ctx.fill();
  
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(-width/2 - 20, -height/2 + 2, 25, 20, 6);
  ctx.fill();
  
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.arc(-width/2 - 10, -height/2, 5, 0, Math.PI*2);
  ctx.fill();

  if (state === 'idle' || state === 'jumping_to_eat') {
    // Boca super aberta pronta para receber o osso!
    ctx.fillStyle = '#8b0000'; 
    ctx.beginPath();
    ctx.roundRect(-width/2 - 20, -height/2 + 5, 16, 22, 6);
    ctx.fill();
    // lingua
    ctx.fillStyle = '#ff6666'; 
    ctx.beginPath();
    ctx.roundRect(-width/2 - 18, -height/2 + 15, 12, 10, 5);
    ctx.fill();
    // dentes
    ctx.fillStyle = '#fff';
    ctx.fillRect(-width/2 - 18, -height/2 + 5, 4, 6);
    ctx.fillRect(-width/2 - 8, -height/2 + 5, 4, 6);
  } else { 
    ctx.fillStyle = '#ff6666'; 
    ctx.beginPath();
    ctx.roundRect(-width/2 - 15, -height/2 + 15, 10, 10, 4);
    ctx.fill();
  }

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-width/2, -height/2 - 8, 5, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath();
  if (state === 'idle') ctx.arc(-width/2 - 2, -height/2 - 8, 2, 0, Math.PI*2); 
  else if (state === 'jumping_to_eat') ctx.arc(-width/2 - 2, -height/2 - 8, 3, 0, Math.PI*2); 
  else ctx.fillRect(-width/2 - 3, -height/2 - 8, 6, 2);
  ctx.fill();

  if (state === 'idle') {
    ctx.fillStyle = '#333';
    ctx.fillRect(-width/2 - 5, -height/2 - 15, 10, 3);
  } else if (state === 'jumping_to_eat') {
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(-width/2 - 8, -height/2 - 12);
    ctx.lineTo(-width/2, -height/2 - 18);
    ctx.lineTo(-width/2 + 6, -height/2 - 15);
    ctx.stroke();
  }
  
  ctx.fillStyle = '#c49b5e';
  ctx.beginPath();
  ctx.roundRect(-width/2 + 10, -height - 10, 8, 20, 4);
  ctx.fill();

  let swing = state === 'eating' ? Math.sin(timer * 10) * 8 : Math.sin(timer * 10) * 4;
  if(state === 'jumping_to_eat') swing = 0;
  
  ctx.fillStyle = '#e6bc7a';
  ctx.fillRect(width/2 - 20 - swing, -10, 12, 15); 
  ctx.fillStyle = '#ffffff'; 
  ctx.fillRect(width/2 - 20 - swing, 0, 12, 5); 

  ctx.fillStyle = '#e6bc7a';
  ctx.fillRect(-width/2 + 10 + swing, -10, 12, 15); 
  ctx.fillStyle = '#ffffff'; 
  ctx.fillRect(-width/2 + 10 + swing, 0, 12, 5); 
  
  ctx.restore();

  if(state === 'eating' || state === 'jumping_to_eat') {
    ctx.save();
    ctx.translate(x - width/2 - 10, y + (state === 'eating' ? 10 : -8));
    ctx.rotate(timer * 15); 
    drawBone(ctx, 0, 0, 0);
    ctx.restore();
  }
}

function drawAnimal(ctx, x, y, type, timer) {
  ctx.save();
  ctx.translate(x, y + Math.sin(timer * 5) * 15); 
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Gaviota 🕊️ raptando na musica
  ctx.font = '50px Arial';
  ctx.fillText('🕊️', 0, -25);
  
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -5);
  ctx.lineTo(0, 20);
  ctx.stroke();

  ctx.font = '30px Arial';
  if (type === 'cat') ctx.fillText('🐈', 0, 30);
  else if (type === 'marmota') ctx.fillText('🦦', 0, 30);
  else if (type === 'lagosta') ctx.fillText('🦞', 0, 30);
  else if (type === 'camarao') ctx.fillText('🦐', 0, 30); 
  else if (type === 'lombriz') ctx.fillText('🪱', 0, 30); 
  else ctx.fillText('🐒', 0, 30); 
  
  ctx.restore();
}

function drawStone(ctx, x, y, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  
  ctx.fillStyle = '#888';
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI*2);
  ctx.fill();
  
  ctx.fillStyle = '#555';
  ctx.beginPath();
  ctx.arc(-3, -3, 2, 0, Math.PI*2);
  ctx.arc(3, 4, 1.5, 0, Math.PI*2);
  ctx.fill();
  
  ctx.restore();
}

function render() {
  const theme = getTheme(game.phase);
  
  ctx.fillStyle = theme.sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (theme.starAlpha > 0) {
    ctx.fillStyle = '#fff';
    for(let s of stars) {
      let alpha = (0.5 + Math.sin(Date.now() * 0.002 + s.blinkOffset) * 0.5) * theme.starAlpha;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  for(let m of mountains) {
    ctx.fillStyle = m.color;
    ctx.beginPath();
    ctx.moveTo(m.x, GROUND_Y);
    ctx.lineTo(m.x + m.width/2, m.y);
    ctx.lineTo(m.x + m.width, GROUND_Y);
    ctx.fill();
  }

  if (theme.type === 'lunar' || theme.type === 'alien') {
    ctx.fillStyle = '#dddddd';
    ctx.beginPath();
    ctx.arc(700, 100, 40, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#aaaaaa';
    ctx.beginPath();
    ctx.arc(690, 80, 8, 0, Math.PI*2);
    ctx.arc(680, 110, 12, 0, Math.PI*2);
    ctx.arc(720, 100, 10, 0, Math.PI*2);
    ctx.fill();
  } else if (theme.type === 'forest') {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(700, 100, 40, 0, Math.PI*2);
    ctx.fill();
  }

  ctx.fillStyle = theme.g1;
  ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
  
  ctx.fillStyle = theme.g2; 
  ctx.beginPath();
  let startX = -(game.bgOffset % 40); 
  ctx.moveTo(0, GROUND_Y);
  for(let x = startX; x <= canvas.width + 40; x += 20) {
    let bump = Math.sin((x + game.bgOffset) * 0.05) * 5;
    ctx.lineTo(x, GROUND_Y + bump);
  }
  ctx.lineTo(canvas.width, GROUND_Y + 15);
  ctx.lineTo(0, GROUND_Y + 15);
  ctx.fill();

  for(let h of holes) {
    ctx.fillStyle = theme.sky;
    ctx.fillRect(h.x, GROUND_Y - 10, h.width, canvas.height - GROUND_Y + 10);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(h.x, GROUND_Y, 15, canvas.height - GROUND_Y);
    ctx.fillRect(h.x + h.width - 15, GROUND_Y, 15, canvas.height - GROUND_Y);
  }

  for(let b of bulldogs) {
    drawBulldog(ctx, b.x, b.y, b.width, b.height, b.animTimer, b.state);
  }

  for(let e of enemies) {
    drawAnimal(ctx, e.x, e.y, e.type, e.timer);
  }

  for(let b of bombs) {
    ctx.font = '35px Arial'; 
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎁', b.x, b.y); 
  }

  for(let sa of savedAnimals) {
    ctx.save();
    ctx.translate(sa.x, sa.y);
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🪂', 0, -40); 
    if (sa.type === 'cat') ctx.fillText('🐈', 0, 0); 
    else if (sa.type === 'marmota') ctx.fillText('🦦', 0, 0); 
    else if (sa.type === 'lagosta') ctx.fillText('🦞', 0, 0); 
    else if (sa.type === 'camarao') ctx.fillText('🦐', 0, 0); 
    else if (sa.type === 'lombriz') ctx.fillText('🪱', 0, 0); 
    else ctx.fillText('🐒', 0, 0); 
    ctx.restore();
  }

  for(let b of bullets) drawBone(ctx, b.x, b.y, b.rot);
  for(let b of upBullets) drawStone(ctx, b.x, b.y, b.rot);

  for(let p of particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    
    if (p.isStar) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Date.now() * 0.01);
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.lineTo(p.size/2, -p.size/2);
      ctx.lineTo(p.size, 0);
      ctx.lineTo(p.size/2, p.size/2);
      ctx.lineTo(0, p.size);
      ctx.lineTo(-p.size/2, p.size/2);
      ctx.lineTo(-p.size, 0);
      ctx.lineTo(-p.size/2, -p.size/2);
      ctx.fill();
      ctx.restore();
    } else if (p.color === '#ffb6c1' || p.color === '#ff69b4') {
       ctx.save();
       ctx.translate(p.x, p.y);
       ctx.scale(p.size/6, p.size/6);
       ctx.fillStyle = '#ff69b4';
       ctx.beginPath();
       ctx.moveTo(0, 0);
       ctx.bezierCurveTo(-5, -5, -10, -5, -10, 0);
       ctx.bezierCurveTo(-10, 5, 0, 10, 0, 15);
       ctx.bezierCurveTo(0, 10, 10, 5, 10, 0);
       ctx.bezierCurveTo(10, -5, 5, -5, 0, 0);
       ctx.fill();
       ctx.restore();
    } else {
       ctx.beginPath();
       ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
       ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  if (player.x > -50) {
    drawDog(ctx, player.x, player.y, player.width, player.height, player.animTimer, player.isJumping, player.isFalling);
  }
}

function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
  lastTime = timestamp;

  update(dt);
  render();

  requestAnimationFrame(gameLoop);
}

initMountains();
render();
