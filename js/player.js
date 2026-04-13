import * as State from './state.js';
import * as Audio from './audio.js';
import * as Rendering from './rendering.js';
import * as UI from './ui.js';

const { player, game, canvas, GROUND_Y, setGameState } = State;

export function jump() {
  if (player.jumpCount < player.maxJumps && !player.isFalling) {
    player.vy = player.jumpPower;   
    player.isJumping = true;        
    player.jumpCount++;             
    Audio.soundJump();                    
    Rendering.createExplosion(player.x, player.y + player.height/2, '#fff', 8); 
  }
}

export function shoot() {
  const now = Date.now();
  if (now - player.lastShootTime < 150) return; 
  player.lastShootTime = now;

  let ammo = 'bone';
  if (player.kind === 'cinder') ammo = 'fish';
  else if (player.kind === 'iris') ammo = 'star';
  else if (player.kind === 'baby') ammo = 'berry';

  Audio.soundShoot();

  if (player.tripleShotTimer > 0) {
    State.bullets.push({ x: player.x + 20, y: player.y - 15, vx: 600, vy: 0, rot: 0, type: ammo });
    State.upBullets.push({ x: player.x, y: player.y - 40, vx: 0, vy: -600, rot: 0, type: ammo });
    State.bullets.push({ x: player.x + 20, y: player.y - 15, vx: 500, vy: -300, rot: 0, type: ammo });
  } else if (player.doubleShotTimer > 0) {
    State.bullets.push({ x: player.x + 20, y: player.y - 15, vx: 600, vy: 0, rot: 0, type: ammo });
    State.upBullets.push({ x: player.x, y: player.y - 40, vx: 0, vy: -600, rot: 0, type: ammo });
  } else {
    State.bullets.push({ x: player.x + 20, y: player.y - 15, vx: 600, vy: 0, rot: 0, type: ammo });
  }
}

export function die(fatal = false) {
  if (player.invincible && !fatal) return; 
  
  game.lives--;
  UI.updateUI();
  
  if (game.lives <= 0 || fatal) {
    Audio.soundDie();
    player.dead = true;
    Rendering.createExplosion(player.x, player.y, '#f00', 50);
    setTimeout(() => {
      UI.showContinueScreen();
    }, 1000);
  } else {
    Audio.soundHurt();
    player.invincible = true;
    player.invincibleTimer = 2.0; 
    Rendering.createExplosion(player.x, player.y, '#f00', 20);
  }
}

export function updatePlayer(dt, keys, overHole) {
  if (!player.isFalling && player.x > 0) {
    if ((keys['ArrowLeft'] || keys['KeyA']) && player.x > 50) player.x -= player.speed * dt;
    if ((keys['ArrowRight'] || keys['KeyD']) && player.x < (canvas ? canvas.width : 800)/2) player.x += player.speed * dt;
  }
  
  player.y += player.vy * dt;
  player.vy += player.gravity * dt;
  
  if (player.y >= GROUND_Y && !player.isFalling) {
    if (overHole && !player.isJumping && (!player.invincibleTimer || player.invincibleTimer <= 0)) {
      player.isFalling = true;
    } else {
      player.y = GROUND_Y;
      player.vy = 0;
      player.isJumping = false;
      player.jumpCount = 0; 
    }
  }

  if (player.isFalling) {
    player.scale = Math.max(0, (player.scale || 1) - dt * 1.5);
    player.rotation = (player.rotation || 0) + dt * 15;
    player.y += 150 * dt; 
  }
  
  if (player.y > (canvas ? canvas.height : 600) + 100) {
    die(true);
  }

  if (player.invincible) {
    player.invincibleTimer -= dt;
    if (player.invincibleTimer <= 0) {
      player.invincible = false;
    }
  }

  player.animTimer += dt;
}
