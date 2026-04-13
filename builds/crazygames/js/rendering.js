/**
 * rendering.js
 * Contains all drawing logic for the game.
 */

import { ctx, GROUND_Y, particles } from './state.js';

export function createExplosion(x, y, color, count) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: x, y: y,
      vx: (Math.random() - 0.5) * 400,
      vy: (Math.random() - 0.5) * 400,
      life: 0.5 + Math.random() * 0.5,
      color: color,
      size: 2 + Math.random() * 5
    });
  }
}

export function createStarsExplosion(x, y, count) {
    const colors = ['#fff', '#ffea00', '#00eaff', '#ff00ff'];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 600,
        vy: (Math.random() - 0.5) * 600,
        life: 0.8 + Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 4,
        isStar: true
      });
    }
}

export function drawCat(x, y, width, height, timer, state, isHero = false) {
  const drawY = y + 20; 

  ctx.save();
  ctx.translate(x, drawY);
  
  if (state === 'eating') {
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 5;
    ctx.fillStyle = '#9aa1a2';
    ctx.beginPath(); ctx.ellipse(-10, -15, 25, 15, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(-5, -10, 15, 10, 0, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#5e6163'; ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-20, -28); ctx.lineTo(-15, -15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-10, -29); ctx.lineTo(-5, -15); ctx.stroke();
    ctx.fillStyle = '#9aa1a2';
    ctx.beginPath(); ctx.ellipse(-25, -12, 14, 11, -0.3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(-30, -9, 8, 6, -0.3, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(-26, -11, 4, Math.PI, 0); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff'; 
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Zzz', -15, -35 + Math.sin(timer*3)*5);
    ctx.restore();
    return;
  }

  if (state === 'jumping_to_eat') {
     ctx.translate(0, -10);
     ctx.rotate(-0.15); 
  }
  
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  
  const swing = (state === 'jumping_to_eat') ? 0 : Math.sin(timer * 25) * 6;
  const bounce = (state === 'jumping_to_eat') ? 0 : Math.abs(Math.sin(timer * 25)) * -2;
  
  ctx.translate(0, bounce); 

  // Fluffy Tail
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#5e6163'; 
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(12, -15);
  ctx.quadraticCurveTo(25, -25 + Math.sin(timer * 5)*10, 32, -10);
  ctx.stroke();
  
  // Back Legs
  ctx.shadowBlur = 0; 
  ctx.fillStyle = '#7a8082';
  ctx.beginPath(); ctx.roundRect(-8 - swing, -10, 6, 10, 3); ctx.fill();
  ctx.beginPath(); ctx.roundRect(12 + swing, -10, 6, 10, 3); ctx.fill();
  
  // Main Grey Bean Body
  ctx.fillStyle = '#9aa1a2';
  ctx.beginPath(); ctx.ellipse(5, -18, 22, 14, 0, 0, Math.PI*2); ctx.fill();

  // White Chest/Belly
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(0, -14, 18, 10, 0.2, 0, Math.PI*2); ctx.fill();
  
  // Front Legs
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.roundRect(-5 + swing, -10, 6, 10, 3); ctx.fill();
  ctx.beginPath(); ctx.roundRect(15 - swing, -10, 6, 10, 3); ctx.fill();

  // Back Stripes
  ctx.strokeStyle = '#5e6163'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(0, -31); ctx.lineTo(2, -22); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10, -30); ctx.lineTo(12, -22); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20, -25); ctx.lineTo(20, -18); ctx.stroke();

  // Big Round Head
  ctx.fillStyle = '#9aa1a2';
  ctx.beginPath(); ctx.ellipse(-15, -25, 17, 14, 0, 0, Math.PI*2); ctx.fill();

  // White Face Mask
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.ellipse(-16, -21, 14, 9, 0, 0, Math.PI*2); ctx.fill();

  // Ears
  ctx.fillStyle = '#9aa1a2';
  ctx.beginPath(); ctx.moveTo(-26, -33); ctx.lineTo(-18, -44); ctx.lineTo(-12, -35); ctx.fill();
  ctx.fillStyle = '#ffc0cb'; 
  ctx.beginPath(); ctx.moveTo(-23, -34); ctx.lineTo(-18, -41); ctx.lineTo(-14, -36); ctx.fill();
  ctx.fillStyle = '#9aa1a2';
  ctx.beginPath(); ctx.moveTo(-10, -35); ctx.lineTo(-2, -43); ctx.lineTo(-2, -30); ctx.fill();
  ctx.fillStyle = '#ffc0cb';
  ctx.beginPath(); ctx.moveTo(-8, -34); ctx.lineTo(-3, -40); ctx.lineTo(-3, -32); ctx.fill();

  // Eyes
  if (Math.sin(timer * 4) > 0.95) {
     ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
     ctx.beginPath(); ctx.moveTo(-26, -24); ctx.lineTo(-20, -24); ctx.stroke();
     ctx.beginPath(); ctx.moveTo(-14, -24); ctx.lineTo(-8, -24); ctx.stroke();
  } else {
     ctx.fillStyle = '#333';
     ctx.beginPath(); ctx.ellipse(-23, -25, 3, 5, 0, 0, Math.PI*2); ctx.fill();
     ctx.beginPath(); ctx.ellipse(-11, -25, 3, 5, 0, 0, Math.PI*2); ctx.fill();
     ctx.fillStyle = '#fff';
     ctx.beginPath(); ctx.arc(-23.5, -26.5, 1.2, 0, Math.PI*2); ctx.fill();
     ctx.beginPath(); ctx.arc(-11.5, -26.5, 1.2, 0, Math.PI*2); ctx.fill();
     ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.lineCap = 'round';
     ctx.beginPath(); ctx.moveTo(-10, -28); ctx.lineTo(-4, -34); ctx.stroke();
     ctx.beginPath(); ctx.moveTo(-8, -27); ctx.lineTo(-2, -30); ctx.stroke();
  }

  // Nose & Mouth
  ctx.fillStyle = '#ffb6c1';
  ctx.beginPath(); ctx.arc(-17, -21, 2.5, 0, Math.PI*2); ctx.fill(); 
  ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(-17, -19); ctx.quadraticCurveTo(-20, -16, -22, -19); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-17, -19); ctx.quadraticCurveTo(-14, -16, -12, -19); ctx.stroke();

  // Whiskers
  ctx.strokeStyle = '#999'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-30, -20); ctx.lineTo(-38, -22); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-30, -18); ctx.lineTo(-38, -17); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-4, -20); ctx.lineTo(4, -22); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-4, -18); ctx.lineTo(4, -17); ctx.stroke();

  ctx.restore();
}

export function drawLunaMenu(menuImg, x, y, size, timer) {
  if (menuImg.complete && menuImg.naturalWidth > 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size/100, size/100);
    ctx.drawImage(menuImg, -80, -80, 160, 160);
    ctx.restore();
    return;
  }
}

export function drawMenuDogs(timer, playerKind, unlockedHeroes, i18n, currentLang, heroNameMap) {
  const heroes = ['luna', 'frida', 'cinder', 'baby', 'iris'];
  heroes.forEach((h, i) => {
    const el = document.querySelector(`.hero-bubble[data-hero="${h}"] canvas`);
    if (el) {
      const c = el.getContext('2d');
      c.clearRect(0, 0, el.width, el.height);
      drawAnimatedAnimal(c, el.width/2, el.height/2 + 10, 40, 25, timer + i, false, false, h, 'running', true);
    }
  });
}

export function drawAnimatedAnimal(ctxArg, x, y, width, height, timer, isJumping, isFalling, type = 'luna', state = 'running', isHero = false, playerInfo = {}) {
  const localCtx = ctxArg || ctx;
  if (playerInfo.dead && type === playerInfo.kind) return; 
  
  let bodyColor1, bodyColor2, earColor;
  let isIris = (type === 'iris');
  let isBaby = (type === 'baby');
  
  if (type === 'luna') {
    bodyColor1 = '#B2663E'; bodyColor2 = '#5C2E0A'; earColor = '#5C2E0A';
  } else if (isIris) {
    bodyColor1 = '#fff5fd'; bodyColor2 = '#ffd1f0'; earColor = '#ff66ff';
  } else if (isBaby) {
    bodyColor1 = '#ffccff'; bodyColor2 = '#ff99ff'; earColor = '#ff66ff';
  } else {
    bodyColor1 = '#ffccff'; bodyColor2 = '#ff99ff'; earColor = '#ff66ff';
  }

  const iScale = (isIris && !state) ? 0.5 : 1.0;
  const bW = width;
  const bH = height;

  const drawY = y + 20; 
  localCtx.save();
  
  if (playerInfo.invincible && playerInfo.kind === type) { 
    localCtx.globalAlpha = (Math.floor(Date.now() / 150) % 2 === 0) ? 0.3 : 0.8;
  }
  
  localCtx.translate(x, drawY); 
  localCtx.scale(playerInfo.scale || 1, playerInfo.scale || 1);
  if (isFalling) localCtx.rotate(playerInfo.rotation || 0);
  else if (isJumping) localCtx.rotate(-Math.PI / 12);
  else if ((state === 'sitting' || state === 'eating') && type === 'iris') {
      localCtx.translate(0, -bH/2);
      localCtx.rotate(Math.PI);
      localCtx.translate(0, bH/2);
  }
  
  localCtx.shadowColor = 'rgba(0,0,0,0.3)';
  localCtx.shadowBlur = 10;
  localCtx.shadowOffsetY = 8;
  
  const bodyGrad = localCtx.createLinearGradient(0, -bH - 10, 0, 0);
  bodyGrad.addColorStop(0, bodyColor1);
  bodyGrad.addColorStop(1, bodyColor2);

  localCtx.fillStyle = bodyGrad;
  localCtx.beginPath();
  if (isIris) {
    localCtx.roundRect(-bW/2, -bH - 10, bW, bH, 18);
    localCtx.fill();
    localCtx.beginPath();
    localCtx.moveTo(bW/2 - 20, -bH - 5);
    localCtx.lineTo(bW/2 - 10, -bH - 45); 
    localCtx.lineTo(bW/2 + 5, -bH - 45);
    localCtx.lineTo(bW/2 + 2, -bH - 5);
    localCtx.fill();

    const mColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
    for(let i=0; i<mColors.length; i++) {
        localCtx.fillStyle = mColors[i];
        localCtx.beginPath();
        localCtx.moveTo(bW/2 - 12 - i*3, -bH - 15 - i*4); 
        localCtx.lineTo(bW/2 - 30 - i*3, -bH - 30 - i*4); 
        localCtx.lineTo(bW/2 - 15 - i*3, -bH - 5 - i*4);
        localCtx.fill();
    }
    
    localCtx.save();
    localCtx.translate(bW/2 + 2, -bH - 50); 
    localCtx.fillStyle = bodyGrad;
    localCtx.beginPath();
    localCtx.ellipse(0, 0, 18, 16, 0, 0, Math.PI*2); localCtx.fill();
    localCtx.beginPath();
    localCtx.ellipse(15, 8, 20, 12, 0.1, 0, Math.PI*2); localCtx.fill();
    localCtx.fillStyle = '#ffd700';
    localCtx.beginPath();
    localCtx.moveTo(0, -14); localCtx.lineTo(5, -55); localCtx.lineTo(10, -12); localCtx.fill();
    localCtx.strokeStyle = '#b8860b'; localCtx.lineWidth = 1.5;
    for(let j=1; j<4; j++) {
        localCtx.beginPath(); localCtx.moveTo(2, -15 - j*10); localCtx.lineTo(8, -20 - j*10); localCtx.stroke();
    }
    localCtx.fillStyle = '#fff'; localCtx.beginPath(); localCtx.ellipse(8, -4, 8, 10, 0.1, 0, Math.PI*2); localCtx.fill();
    localCtx.fillStyle = '#000'; localCtx.beginPath(); localCtx.arc(10, -4, 5, 0, Math.PI*2); localCtx.fill();
    localCtx.fillStyle = '#fff'; localCtx.beginPath(); localCtx.arc(12, -6, 2, 0, Math.PI*2); localCtx.fill();
    localCtx.strokeStyle = '#000'; localCtx.lineWidth = 1.5; localCtx.lineCap = 'round';
    localCtx.beginPath(); localCtx.moveTo(15, -12); localCtx.lineTo(22, -18); localCtx.stroke();
    localCtx.beginPath(); localCtx.moveTo(17, -8); localCtx.lineTo(24, -12); localCtx.stroke();
    localCtx.beginPath(); localCtx.moveTo(18, -4); localCtx.lineTo(25, -5); localCtx.stroke();
    localCtx.restore();
  } else {
    localCtx.roundRect(-width/2, -height - 10, width, height, height/2);
    localCtx.fill();
    const headGrad = localCtx.createRadialGradient(width/2 + 5, -height - 17, 0, width/2 + 5, -height - 17, 30);
    headGrad.addColorStop(0, bodyColor1);
    headGrad.addColorStop(1, bodyColor2);
    localCtx.fillStyle = headGrad;
    localCtx.beginPath(); localCtx.roundRect(width/2 - 10, -height - 30, 30, 25, 12); localCtx.fill();
    localCtx.beginPath(); localCtx.roundRect(width/2 + 10, -height - 20, 25, 15, 8); localCtx.fill();
    localCtx.fillStyle = '#000'; localCtx.beginPath(); localCtx.arc(width/2 + 33, -height - 14, 4, 0, Math.PI*2); localCtx.fill();
    let eyeX = width/2 + 12;
    let eyeY = -height - 22;
    if (Math.sin(timer * 4) > 0.96) {
       localCtx.fillStyle = '#000'; localCtx.fillRect(eyeX - 4, eyeY - 1, 8, 2);
    } else {
      localCtx.fillStyle = '#fff'; localCtx.beginPath(); localCtx.ellipse(eyeX, eyeY, 5, 8, 0, 0, Math.PI*2); localCtx.fill();
      localCtx.fillStyle = '#000'; localCtx.beginPath(); localCtx.arc(eyeX + 2, eyeY - 2, 3.5, 0, Math.PI*2); localCtx.fill();
      localCtx.strokeStyle = '#000'; localCtx.lineWidth = 1.2; localCtx.lineCap = 'round';
      localCtx.beginPath(); localCtx.moveTo(eyeX + 3, eyeY - 6); localCtx.lineTo(eyeX + 8, eyeY - 10); localCtx.stroke();
      localCtx.beginPath(); localCtx.moveTo(eyeX + 5, eyeY - 3); localCtx.lineTo(eyeX + 10, eyeY - 6); localCtx.stroke();
    }
    localCtx.save();
    localCtx.translate(width/2, -height - 25);
    localCtx.rotate(-Math.PI/8 + Math.sin(timer * 20) * 0.4);
    localCtx.fillStyle = earColor;
    localCtx.beginPath(); localCtx.ellipse(-2, 12, 6, 15, 0, 0, Math.PI*2); localCtx.fill();
    localCtx.restore();
  }
  localCtx.shadowBlur = 0; localCtx.shadowOffsetY = 0;
  localCtx.save();
  if (isIris) {
      localCtx.translate(-bW/2 + 5, -bH - 5); 
      localCtx.rotate(Math.sin(timer * 15) * 0.3 - 0.5); 
      const rColors = ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#9400d3'];
      for(let i=0; i<rColors.length; i++) {
          localCtx.fillStyle = rColors[i];
          localCtx.beginPath(); localCtx.ellipse(-15 - i*2, -5 - i*2, 25, 8, 0.4, 0, Math.PI*2); localCtx.fill();
      }
  } else {
      localCtx.translate(-width/2 + 5, -height - 5);
      localCtx.rotate(Math.sin(timer * 15) * 0.3 - 1.2); 
      localCtx.fillStyle = bodyGrad;
      localCtx.beginPath(); localCtx.roundRect(-20, -5, 25, 8, 4); localCtx.fill();
  }
  localCtx.restore();
  localCtx.fillStyle = isIris ? bodyColor2 : earColor; 
  let pSwing = isJumping || isFalling ? 0 : Math.sin(timer * 20) * 12;
  if (state === 'sitting') pSwing = 0;
  const legH = isIris ? 35 : 15;
  const legW = 8;
  const charW = isIris ? bW : width;
  localCtx.beginPath();
  if (state === 'sitting' && isIris) {
      localCtx.roundRect(-charW/2 + 5, -12, 18, 10, 5);
      localCtx.roundRect(charW/2 - 23, -12, 18, 10, 5);
  } else {
      localCtx.roundRect(-charW/2 + 10 + pSwing, -legH, legW, legH, 4);
      localCtx.roundRect(charW/2 - 20 - pSwing, -legH, legW, legH, 4);
      localCtx.roundRect(-charW/2 + 22 - pSwing, -legH, legW, legH, 4);
      localCtx.roundRect(charW/2 - 12 + pSwing, -legH, legW, legH, 4);
  }
  localCtx.fill();
  if (playerInfo.kind === type || state !== 'idle') {
    localCtx.save();
    localCtx.translate(-charW/2 + 5, -height - 5);
    localCtx.fillStyle = '#6d4c41'; localCtx.beginPath(); localCtx.roundRect(-8, -12, 16, 18, 5); localCtx.fill();
    localCtx.fillStyle = '#8d6e63'; localCtx.beginPath(); localCtx.roundRect(-4, -8, 8, 10, 3); localCtx.fill();
    localCtx.restore();
  }
  if (playerInfo.kind === type && playerInfo.tripleShotTimer > 0) {
    localCtx.save();
    localCtx.translate(isIris ? 10 : 0, -height - 15);
    localCtx.fillStyle = '#444'; localCtx.beginPath(); localCtx.roundRect(-10, -5, 20, 10, 3); localCtx.fill();
    localCtx.fillStyle = '#ff00ff'; localCtx.beginPath(); localCtx.roundRect(-6, -18, 12, 15, 4); localCtx.fill();
    localCtx.strokeStyle = '#fff'; localCtx.lineWidth = 1; localCtx.stroke();
    localCtx.fillStyle = '#222'; localCtx.beginPath(); localCtx.roundRect(4, -14, 12, 6, 2); localCtx.fill();
    localCtx.restore();
  }
  if (playerInfo.outfit === 'suit' && playerInfo.kind === type) {
    localCtx.fillStyle = '#000';
    localCtx.beginPath(); localCtx.moveTo(-charW/2, -height - 5); localCtx.lineTo(0, -5); localCtx.lineTo(charW/2, -height - 5);
    localCtx.lineTo(charW/2, 0); localCtx.lineTo(-charW/2, 0); localCtx.fill();
    localCtx.fillStyle = '#fff';
    localCtx.beginPath(); localCtx.moveTo(-10, -height - 2); localCtx.lineTo(0, -10); localCtx.lineTo(10, -height - 2); localCtx.fill();
    localCtx.fillStyle = '#f00';
    localCtx.beginPath(); localCtx.moveTo(-5, -height + 2); localCtx.lineTo(5, -height + 10); localCtx.lineTo(-5, -height + 10); localCtx.lineTo(5, -height + 2); localCtx.fill();
  }
  if (state === 'sitting') {
      const heartTimer = (Date.now() / 1000) * 8;
      localCtx.fillStyle = '#ff69b4'; localCtx.font = '20px Arial';
      localCtx.fillText('❤️', 30, -legH - 30 + Math.sin(heartTimer)*10);
  }
  localCtx.restore();
}
export function drawFood(x, y, rot, type) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.shadowColor = 'rgba(255,100,0,0.8)';
  ctx.shadowBlur = 10;
  
  if (type === 'food_0') {
    ctx.fillStyle = '#8B4513';
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#A0522D';
    ctx.beginPath(); ctx.arc(-2, -2, 2, 0, Math.PI*2); ctx.fill();
  } else if (type === 'food_1') {
    ctx.fillStyle = '#CD853F'; ctx.fillRect(-5, -5, 10, 10);
    ctx.fillStyle = '#8B4513'; ctx.fillRect(-2, -2, 4, 4);
  } else if (type === 'food_2') {
    ctx.fillStyle = '#F5DEB3'; 
    ctx.fillRect(-4, -2, 8, 4);
    ctx.beginPath(); ctx.arc(-4, -2, 3, 0, Math.PI*2); ctx.arc(-4, 2, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(4, -2, 3, 0, Math.PI*2); ctx.arc(4, 2, 3, 0, Math.PI*2); ctx.fill();
  } else {
    ctx.fillStyle = '#D2691E';
    ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI*2); ctx.fill(); 
    ctx.beginPath(); ctx.ellipse(-4, -3, 2, 4, -0.5, 0, Math.PI*2); ctx.fill(); 
    ctx.beginPath(); ctx.ellipse(4, -3, 2, 4, 0.5, 0, Math.PI*2); ctx.fill(); 
  }
  ctx.restore();
}

export function drawBulldog(x, y, width, height, timer, state, isHero) {
  const drawY = y + 20;
  ctx.save();
  ctx.translate(x, drawY); 
  
  if (state === 'eating') {
     ctx.translate(0, -height/2);
     ctx.rotate(Math.PI); 
     ctx.translate(0, height/2);
  } else if (state === 'jumping_to_eat') {
     ctx.translate(0, -20);
     ctx.rotate(-0.15); 
  }
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetY = 8;
  const bBody = ctx.createLinearGradient(0, -height, 0, 0);
  bBody.addColorStop(0, '#ffdf99');
  bBody.addColorStop(1, '#a6722d');
  ctx.save();
  ctx.translate(width/2 - 5, -height/2);
  const tailWag = Math.sin(timer * (state === 'jumping_to_eat' ? 30 : 15)) * (state === 'jumping_to_eat' ? 0.8 : 0.4);
  ctx.rotate(tailWag - 0.3);
  ctx.fillStyle = '#a6722d';
  ctx.beginPath(); ctx.roundRect(0, -4, 18, 8, 4); ctx.fill();
  ctx.restore();
  let swing = state === 'eating' ? Math.sin(timer * 10) * 8 : Math.sin(timer * 10) * 5;
  if (state === 'jumping_to_eat') swing = Math.sin(timer * 25) * 3;
  ctx.fillStyle = '#8a5c1a';
  ctx.beginPath(); ctx.roundRect(width/2 - 25 - swing, -12, 12, 18, 4); ctx.fill();
  ctx.beginPath(); ctx.roundRect(width/2 - 10 + swing, -12, 12, 18, 4); ctx.fill();
  ctx.fillStyle = '#fff'; 
  ctx.beginPath(); ctx.roundRect(width/2 - 25 - swing, 0, 12, 6, 2); ctx.fill();
  ctx.beginPath(); ctx.roundRect(width/2 - 10 + swing, 0, 12, 6, 2); ctx.fill();
  ctx.fillStyle = bBody;
  ctx.beginPath(); ctx.roundRect(-width/2, -height, width, height, height/2); ctx.fill();
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(0, -height/2 + 5, width/2 - 15, height/2 - 5, 0, 0, Math.PI*2); ctx.fill();
  if (state !== 'idle' || isHero) {
      ctx.save();
      ctx.translate(-width/2 + 10, -height - 5);
      ctx.fillStyle = '#6d4c41'; ctx.beginPath(); ctx.roundRect(-8, -12, 16, 18, 5); ctx.fill();
      ctx.fillStyle = '#8d6e63'; ctx.beginPath(); ctx.roundRect(-4, -8, 8, 10, 3); ctx.fill();
      ctx.restore();
  }
  ctx.fillStyle = bBody;
  ctx.beginPath(); ctx.roundRect(-width/2 + 5 + swing, -12, 12, 18, 4); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-width/2 + 20 - swing, -12, 12, 18, 4); ctx.fill();
  ctx.fillStyle = '#fff'; 
  ctx.beginPath(); ctx.roundRect(-width/2 + 5 + swing, 0, 12, 6, 2); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-width/2 + 20 - swing, 0, 12, 6, 2); ctx.fill();
  const bHead = ctx.createRadialGradient(-width/2 + 5, -height/2 + 5, 0, -width/2 + 5, -height/2 + 5, 45);
  bHead.addColorStop(0, '#ffdf99');
  bHead.addColorStop(1, '#a6722d');
  ctx.fillStyle = bHead;
  ctx.beginPath(); ctx.arc(-width/2, -height/2, 25, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(-width/2 - 10, -height/2 + 8, 18, 12, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(-width/2 - 15, -height/2 + 2, 6, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(-width/2 - 17, -height/2, 2, 0, Math.PI*2); ctx.fill();
  if (state === 'idle' || state === 'jumping_to_eat') {
    ctx.fillStyle = '#4a0000'; 
    ctx.beginPath(); ctx.arc(-width/2 - 12, -height/2 + 14, 10, 0, Math.PI); ctx.fill();
    ctx.fillStyle = '#ff9999'; 
    ctx.beginPath(); ctx.ellipse(-width/2 - 12, -height/2 + 16, 6, 3 + Math.sin(timer*5)*1.5, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(-width/2 - 19, -height/2 + 10, 3, 4);
    ctx.fillRect(-width/2 - 7, -height/2 + 10, 3, 4);
  } else { 
    ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(-width/2 - 12, -height/2 + 15, 6, 0, Math.PI); ctx.stroke();
  }
  if (Math.sin(timer * 4) > 0.95) {
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-width/2 - 10, -height/2 - 8); ctx.lineTo(-width/2 - 2, -height/2 - 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-width/2 + 2, -height/2 - 10); ctx.lineTo(-width/2 + 10, -height/2 - 10); ctx.stroke();
  } else {
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(-width/2 - 5, -height/2 - 8, 5, 7, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(-width/2 - 6, -height/2 - 8, 3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(-width/2 - 7, -height/2 - 10, 1.2, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(-width/2 + 5, -height/2 - 10, 5, 7, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#333';
    ctx.beginPath(); ctx.arc(-width/2 + 4, -height/2 - 10, 3, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(-width/2 + 3, -height/2 - 12, 1.2, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#000'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-width/2 - 8, -height/2 - 14); ctx.lineTo(-width/2 - 14, -height/2 - 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-width/2 - 6, -height/2 - 15); ctx.lineTo(-width/2 - 10, -height/2 - 22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-width/2 + 7, -height/2 - 16); ctx.lineTo(-width/2 + 12, -height/2 - 22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-width/2 + 9, -height/2 - 17); ctx.lineTo(-width/2 + 15, -height/2 - 24); ctx.stroke();
  }
  ctx.save();
  ctx.translate(-width/2 + 15, -height/2 - 10);
  let earFlap = -0.5 + Math.sin(timer * 3) * 0.1;
  if (state === 'jumping_to_eat') earFlap = -Math.PI/3 + Math.sin(timer * 40) * 0.6;
  ctx.rotate(earFlap);
  ctx.fillStyle = '#8a5c1a';
  ctx.beginPath(); ctx.ellipse(0, 12, 8, 15, -0.5, 0, Math.PI*2); ctx.fill();
  ctx.restore();
  ctx.restore();
  if (state === 'eating') {
    ctx.save();
    ctx.translate(x - width/2 - 10, drawY + 10);
    ctx.rotate(timer * 15); 
    drawBone(0, 0, 0);
    ctx.restore();
  }
}

export function drawBear(x, y, kind, timer, state, isHero = false) {
  ctx.save();
  let baseColor1 = '#8B4513'; 
  let baseColor2 = '#A0522D';
  let bellyColor = '#cda177';
  if (kind === 'white_baby') {
      baseColor1 = '#f5f5f5'; baseColor2 = '#ffffff'; bellyColor = '#e0e0e0';
  } else if (kind === 'panda_baby') {
      baseColor1 = '#111111'; baseColor2 = '#222222'; bellyColor = '#ffffff';
  } else if (kind === 'pink' || kind === 'baby' || kind === 'baby_bear') {
      baseColor1 = '#ff80bf'; baseColor2 = '#ff4d94'; bellyColor = '#ffb3d9';
  }
  ctx.translate(x, y);
  if (state === 'eating' || state === 'jumping_to_eat') {
     ctx.rotate(Math.PI);
     ctx.translate(0, 10);
     ctx.fillStyle = baseColor1;
     ctx.beginPath(); ctx.ellipse(0, 0, 25, 30, 0, 0, Math.PI*2); ctx.fill();
     ctx.fillStyle = bellyColor;
     ctx.beginPath(); ctx.ellipse(0, -5, 18, 22, 0, 0, Math.PI*2); ctx.fill();
     const wag = Math.sin(timer * 20) * 8;
     ctx.fillStyle = baseColor2;
     ctx.beginPath(); ctx.ellipse(-15, -25 + wag, 8, 12, -0.5, 0, Math.PI*2); ctx.fill(); 
     ctx.beginPath(); ctx.ellipse(15, -25 - wag, 8, 12, 0.5, 0, Math.PI*2); ctx.fill(); 
     ctx.beginPath(); ctx.ellipse(-20, 10 + wag, 8, 12, -0.8, 0, Math.PI*2); ctx.fill(); 
     ctx.beginPath(); ctx.ellipse(20, 10 - wag, 8, 12, 0.8, 0, Math.PI*2); ctx.fill(); 
     ctx.fillStyle = (kind === 'panda_baby') ? '#fff' : baseColor1;
     ctx.beginPath(); ctx.ellipse(0, 25, 20, 15, 0, 0, Math.PI*2); ctx.fill();
     ctx.fillStyle = baseColor1;
     ctx.beginPath(); ctx.arc(-15, 35, 7, 0, Math.PI*2); ctx.fill();
     ctx.beginPath(); ctx.arc(15, 35, 7, 0, Math.PI*2); ctx.fill();
     ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
     ctx.beginPath(); ctx.arc(-8, 22, 4, 0, Math.PI); ctx.stroke();
     ctx.beginPath(); ctx.arc(8, 22, 4, 0, Math.PI); ctx.stroke();
  } else {
     const walk1 = Math.sin(timer * 10) * 6;
     const walk2 = Math.cos(timer * 10) * 6;
     ctx.save();
     ctx.translate(25, -15);
     ctx.rotate(Math.sin(timer * 15) * 0.4);
     ctx.fillStyle = baseColor2;
     ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill();
     ctx.restore();
     ctx.fillStyle = baseColor2;
     ctx.beginPath(); ctx.ellipse(-15 + walk1, 5, 8, 15, 0, 0, Math.PI*2); ctx.fill(); 
     ctx.beginPath(); ctx.ellipse(15 + walk2, 5, 8, 15, 0, 0, Math.PI*2); ctx.fill(); 
     ctx.beginPath(); ctx.ellipse(-5 - walk1, 8, 7, 12, 0, 0, Math.PI*2); ctx.fill(); 
     ctx.beginPath(); ctx.ellipse(5 - walk2, 8, 7, 12, 0, 0, Math.PI*2); ctx.fill(); 
     ctx.fillStyle = baseColor1;
     ctx.beginPath(); ctx.ellipse(0, -20, 30, 25, 0, 0, Math.PI*2); ctx.fill();
     ctx.fillStyle = bellyColor;
     ctx.beginPath(); ctx.ellipse(-5, -15, 20, 18, 0, 0, Math.PI*2); ctx.fill();
     ctx.translate(-25, -35); 
     ctx.fillStyle = (kind === 'panda_baby') ? '#fff' : baseColor1;
     ctx.beginPath(); ctx.ellipse(0, 0, 18, 16, 0, 0, Math.PI*2); ctx.fill();
     ctx.save();
     let earAngle = Math.sin(timer * 3) * 0.1;
     if (state === 'jumping_to_eat') earAngle = Math.sin(timer * 30) * 0.4;
     ctx.fillStyle = baseColor2;
     if(kind === 'panda_baby') ctx.fillStyle = '#111';
     ctx.save(); ctx.translate(14, -12); ctx.rotate(earAngle);
     ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI*2); ctx.fill();
     ctx.restore();
     ctx.save(); ctx.translate(-14, -12); ctx.rotate(-earAngle);
     ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI*2); ctx.fill();
     ctx.restore();
     ctx.restore();
     if (kind === 'panda_baby') {
         ctx.fillStyle = '#111';
         ctx.beginPath(); ctx.ellipse(-5, -2, 6, 8, -0.3, 0, Math.PI*2); ctx.fill();
         ctx.beginPath(); ctx.ellipse(8, -2, 6, 8, 0.3, 0, Math.PI*2); ctx.fill();
     }
     if (Math.sin(timer * 4) > 0.96) {
       ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
       ctx.beginPath(); ctx.moveTo(-8, -2); ctx.lineTo(-2, -2); ctx.stroke();
       ctx.beginPath(); ctx.moveTo(5, -2); ctx.lineTo(11, -2); ctx.stroke();
     } else {
       ctx.fillStyle = '#fff';
       ctx.beginPath(); ctx.ellipse(-5, -2, 6, 8, 0, 0, Math.PI*2); ctx.fill();
       ctx.beginPath(); ctx.ellipse(8, -2, 6, 8, 0, 0, Math.PI*2); ctx.fill();
       ctx.fillStyle = '#000';
       ctx.beginPath(); ctx.arc(-4.5, -1, 3.5, 0, Math.PI*2); ctx.fill();
       ctx.beginPath(); ctx.arc(7.5, -1, 3.5, 0, Math.PI*2); ctx.fill();
       ctx.fillStyle = '#fff';
       ctx.beginPath(); ctx.arc(-3, -3, 1.5, 0, Math.PI*2); ctx.fill();
       ctx.beginPath(); ctx.arc(6, -3, 1.5, 0, Math.PI*2); ctx.fill();
       ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5; localCtx.lineCap = 'round';
       ctx.beginPath(); localCtx.moveTo(-10, -6); localCtx.lineTo(-16, -12); localCtx.stroke();
       ctx.beginPath(); localCtx.moveTo(-8, -8); localCtx.lineTo(-12, -14); localCtx.stroke();
       ctx.beginPath(); localCtx.moveTo(-6, -9); localCtx.lineTo(-8, -15); localCtx.stroke();
       ctx.beginPath(); localCtx.moveTo(12, -6); localCtx.lineTo(18, -12); localCtx.stroke();
       ctx.beginPath(); localCtx.moveTo(10, -8); localCtx.lineTo(14, -14); localCtx.stroke();
       ctx.beginPath(); localCtx.moveTo(8, -9); localCtx.lineTo(10, -15); localCtx.stroke();
     }
     ctx.fillStyle = bellyColor;
     ctx.beginPath(); ctx.ellipse(-10, 8, 10, 6, -0.2, 0, Math.PI*2); ctx.fill();
     ctx.fillStyle = '#000';
     ctx.beginPath(); ctx.arc(-14, 6, 3, 0, Math.PI*2); ctx.fill();
     if (isHero) {
       ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
       ctx.beginPath(); ctx.arc(-12, 10, 4, 0, Math.PI); ctx.stroke();
     }
  }
  ctx.restore();
}

export function drawHilda(t) {
  ctx.save(); 
  ctx.translate(0, 15);
  const walk1 = Math.sin(t * 15) * 8;
  const walk2 = Math.cos(t * 15) * 8;
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.ellipse(-20 + walk1, 15, 6, 12, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(10 + walk2, 15, 6, 12, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 0, 35, 20, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#111';
  ctx.beginPath(); ctx.ellipse(-10 - walk1, 15, 6, 12, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(20 - walk2, 15, 6, 12, 0, 0, Math.PI*2); ctx.fill();
  ctx.save(); ctx.translate(30, -5); ctx.rotate(walk1 * 0.05 + 0.5);
  ctx.beginPath(); ctx.ellipse(15, 0, 18, 4, 0, 0, Math.PI*2); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.ellipse(-30, -15, 18, 18, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(-20, -10, 8, 15, -0.5, 0, Math.PI*2); ctx.fill(); 
  ctx.fillStyle = '#333'; ctx.beginPath(); ctx.ellipse(-45, -5, 15, 10, -0.2, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(-55, -8, 4, 0, Math.PI*2); ctx.fill(); 
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.moveTo(-50, 2); ctx.lineTo(-45, 12); ctx.lineTo(-40, 0); ctx.fill();
  drawAngryEyes(-30, -20);
  ctx.restore();
}

export function drawUrubu(flap) {
  ctx.save();
  ctx.translate(0, -35);
  ctx.fillStyle = '#333b47';
  ctx.beginPath();
  ctx.ellipse(0, 0, 22, 28, 0.2, 0, Math.PI*2);
  ctx.fill();
  ctx.save();
  ctx.translate(-15, -5);
  ctx.rotate(-flap - 0.3);
  ctx.fillStyle = '#1c2026';
  ctx.beginPath(); ctx.ellipse(-5, 15, 12, 35, 0.4, 0, Math.PI*2); ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(15, -5);
  ctx.rotate(flap + 0.3);
  ctx.fillStyle = '#1c2026';
  ctx.beginPath(); ctx.ellipse(5, 15, 12, 35, -0.4, 0, Math.PI*2); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#f0f0f0';
  ctx.beginPath();
  ctx.arc(0, -20, 16, 0, Math.PI*2);
  ctx.arc(-12, -15, 14, 0, Math.PI*2);
  ctx.arc(12, -15, 14, 0, Math.PI*2);
  ctx.arc(0, -10, 14, 0, Math.PI*2);
  ctx.fill();
  ctx.save();
  ctx.strokeStyle = '#ffaec9'; 
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.quadraticCurveTo(-15, -35, -10, -50); 
  ctx.stroke();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#d6859e';
  ctx.beginPath(); ctx.moveTo(-6, -26); ctx.lineTo(0, -24); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-10, -33); ctx.lineTo(-4, -30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-12, -43); ctx.lineTo(-6, -41); ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.translate(-14, -54);
  ctx.fillStyle = '#ffaec9';
  ctx.beginPath(); ctx.ellipse(0, 0, 14, 12, -0.2, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ff8800';
  ctx.beginPath();
  ctx.moveTo(8, -2);
  ctx.quadraticCurveTo(25, -10, 20, 15); 
  ctx.quadraticCurveTo(5, 10, 2, 2); 
  ctx.fill();
  ctx.fillStyle = '#cc5500';
  ctx.beginPath();
  ctx.moveTo(5, 3);
  ctx.quadraticCurveTo(15, 12, 12, 8);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(4, -8, 7, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(6, -8, 2, 0, Math.PI*2); ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#222';
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-5, -14); ctx.lineTo(12, -10); ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-5, -12); ctx.lineTo(-8, -20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-2, -12); ctx.lineTo(0, -22); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(2, -12); ctx.lineTo(6, -18); ctx.stroke();
  ctx.restore(); 
  ctx.fillStyle = '#ffcc00';
  ctx.beginPath(); ctx.ellipse(-6, 25, 6, 4, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, 25, 4, 6, -0.5, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(6, 25, 6, 4, 0, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}
export function drawBone(x, y, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.roundRect(-15, -5, 30, 10, 5);
  ctx.fill();
  ctx.beginPath(); ctx.arc(-15, -5, 6, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(-15, 5, 6, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(15, -5, 6, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(15, 5, 6, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

export function drawAngryEyes(x, y) {
  ctx.fillStyle = '#f00'; ctx.beginPath(); ctx.ellipse(x - 12, y, 6, 4, 0.3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 12, y, 6, 4, -0.3, 0, Math.PI*2); ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = '#000'; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 20, y - 5); ctx.lineTo(x - 6, y + 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 20, y - 5); ctx.lineTo(x + 6, y + 2); ctx.stroke();
  ctx.fillStyle = '#fc0'; ctx.beginPath(); ctx.arc(x - 11, y, 2, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(x + 11, y, 2, 0, Math.PI*2); ctx.fill();
}

export function drawWind(t) {
  ctx.save(); const d = Math.sin(t*8)*15; ctx.fillStyle = 'rgba(200,200,200,0.8)';
  for(let i=0;i<5;i++){ ctx.beginPath(); ctx.ellipse(d*(1-i*0.1)+Math.sin(t*20+i)*5, -i*15, 50-i*10, 10, 0, 0, Math.PI*2); ctx.fill(); }
  drawAngryEyes(d*0.5, -60); ctx.restore();
}

export function drawStorm(t) {
  ctx.save(); ctx.translate(0, Math.sin(t*4)*8 - 40); const s = 1+Math.sin(t*12)*0.05; ctx.scale(s,s);
  ctx.fillStyle='#444'; ctx.beginPath(); ctx.arc(0,0,35,0,Math.PI*2); ctx.arc(-25,10,25,0,Math.PI*2); ctx.arc(25,10,25,0,Math.PI*2); ctx.arc(-40,30,15,0,Math.PI*2); ctx.arc(40,30,20,0,Math.PI*2); ctx.fill();
  if(Math.random()>0.8){ ctx.fillStyle='#ff0'; ctx.beginPath(); ctx.moveTo(10,20); ctx.lineTo(-10,60); ctx.lineTo(5,60); ctx.lineTo(-15,100); ctx.lineTo(25,50); ctx.fill(); }
  drawAngryEyes(0, 15); ctx.restore();
}

export function drawVacuum(t) {
  ctx.save(); ctx.translate(Math.sin(t*40)*2, 0);
  ctx.fillStyle='#c00'; ctx.beginPath(); ctx.roundRect(-30,-60,60,50,10); ctx.fill();
  ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(-35,-10,15,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(35,-10,15,0,Math.PI*2); ctx.fill();
  ctx.translate(0,-60); ctx.rotate(Math.sin(t*8)*0.5); ctx.fillStyle='#555'; ctx.fillRect(-8,-40,16,40);
  ctx.fillStyle='#222'; ctx.beginPath(); ctx.moveTo(-20,-50); ctx.lineTo(20,-50); ctx.lineTo(10,-40); ctx.lineTo(-10,-40); ctx.fill();
  drawAngryEyes(0, 25); ctx.restore();
}

export function drawCar(t) {
  ctx.save(); ctx.fillStyle='#222'; ctx.fillRect(-45,-15,20,15); ctx.fillRect(25,-15,20,15); ctx.translate(0,-Math.abs(Math.sin(t*15))*5);
  ctx.fillStyle='#05f'; ctx.beginPath(); ctx.roundRect(-50,-35,100,30,8); ctx.fill(); ctx.beginPath(); ctx.roundRect(-30,-60,60,30,10); ctx.fill();
  ctx.fillStyle='#8cf'; ctx.fillRect(-25,-55,50,20);
  ctx.fillStyle='#ff0'; ctx.beginPath(); ctx.arc(-35,-20,8,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(35,-20,8,0,Math.PI*2); ctx.fill();
  drawAngryEyes(0, -45); ctx.restore();
}

export function drawMoto(t) {
  ctx.save(); ctx.rotate(Math.sin(t*5)*0.2);
  ctx.fillStyle='#111'; ctx.fillRect(-15,-20,30,40);
  ctx.fillStyle='#f60'; ctx.beginPath(); ctx.moveTo(0,-70); ctx.lineTo(-25,-20); ctx.lineTo(25,-20); ctx.fill();
  ctx.strokeStyle='#888'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(-35,-50); ctx.lineTo(35,-50); ctx.stroke();
  ctx.fillStyle='#000'; ctx.fillRect(-45,-55,15,10); ctx.fillRect(30,-55,15,10);
  drawAngryEyes(0, -40); ctx.restore();
}

export function drawBroom(t) {
  ctx.save(); ctx.translate(0,-80); ctx.rotate(Math.sin(t*8)*0.4);
  ctx.fillStyle='#8B4513'; ctx.fillRect(-5,0,10,60); ctx.translate(0,60); ctx.rotate(Math.sin(t*20)*0.1);
  ctx.fillStyle='#fc0'; ctx.beginPath(); ctx.moveTo(-15,0); ctx.lineTo(15,0); ctx.lineTo(30,40); ctx.lineTo(-30,40); ctx.fill();
  ctx.strokeStyle='#cda522'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(-20,15); ctx.lineTo(20,15); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-25,25); ctx.lineTo(25,25); ctx.stroke();
  drawAngryEyes(0, 10); ctx.restore();
}

export function drawFireworks(t) {
  ctx.save(); ctx.translate(0,-40); const s=(Math.random()-0.5)*4; ctx.translate(s,s);
  ctx.fillStyle='#e00'; ctx.fillRect(-15,-20,30,50); ctx.fillStyle='#fff'; ctx.fillRect(-15,0,30,10);
  ctx.fillStyle='#f90'; ctx.beginPath(); ctx.moveTo(-15,-20); ctx.lineTo(15,-20); ctx.lineTo(0,-50); ctx.fill();
  ctx.strokeStyle='#aaa'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,30); ctx.quadraticCurveTo(10,40,20,50); ctx.stroke();
  drawAngryEyes(0, -5); ctx.restore();
}

export function drawHose(t) {
  ctx.save(); ctx.translate(0,-80); const wx=Math.sin(t*10)*15;
  ctx.strokeStyle='#093'; ctx.lineWidth=14; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(0,150); ctx.quadraticCurveTo(wx*2,70,wx,0); ctx.stroke();
  ctx.translate(wx,0); ctx.rotate(Math.cos(t*8)*0.5);
  ctx.fillStyle='#ca0'; ctx.fillRect(-10,-20,20,20); ctx.fillStyle='#777'; ctx.fillRect(-14,-5,28,5);
  ctx.fillStyle='rgba(0,150,255,0.7)'; for(let i=0;i<6;i++) { ctx.beginPath(); ctx.ellipse((Math.random()-0.5)*20, -20-((t*200+i*20)%50), 3, 6, 0, 0, Math.PI*2); ctx.fill(); }
  drawAngryEyes(0, -10); ctx.restore();
}

export function drawSeagull(flap, isDiving, angle = 0, beakOpen = false) {
  ctx.save();
  ctx.translate(0, -30);
  if (isDiving) {
      ctx.scale(-1, 1); 
      ctx.rotate(angle);
  }
  ctx.save();
  ctx.translate(-20, -5);
  ctx.rotate(-flap);
  ctx.fillStyle = '#e8e8e8';
  ctx.beginPath(); ctx.ellipse(-15, 0, 25, 10, -0.2, 0, Math.PI*2); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(0, 0, 35, 25, 0.1, 0, Math.PI*2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 20;
  ctx.beginPath(); ctx.moveTo(20, -10); ctx.lineTo(40, -40); ctx.stroke();
  ctx.save();
  ctx.translate(-5, 5);
  ctx.rotate(flap);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(-20, 0, 30, 12, 0.1, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#d0d0d0'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(-10, 2); ctx.lineTo(-30, 4); ctx.stroke();
  ctx.restore();
  ctx.translate(40, -40);
  ctx.fillStyle = '#cc1111';
  ctx.beginPath(); ctx.ellipse(0, 10, 14, 8, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-10, 10); ctx.lineTo(-20, 25); ctx.lineTo(-5, 15); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-5, 8, 1.5, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(2, 12, 2, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(8, 8, 1.5, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(-14, 20, 1.5, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.ellipse(5, -5, 22, 22, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, -25); ctx.lineTo(-5, -40); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(8, -26); ctx.lineTo(10, -42); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(15, -20); ctx.lineTo(25, -35); ctx.stroke();
  ctx.fillStyle = '#e87b1c';
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(25, 0); 
  ctx.quadraticCurveTo(60, 5, 70, 15); 
  ctx.quadraticCurveTo(40, 15, 20, 10);
  ctx.fill();
  ctx.strokeStyle = '#ba6216'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(25, 5); ctx.lineTo(60, 12); ctx.stroke();
  ctx.restore();
  if (beakOpen) {
      ctx.save();
      ctx.translate(25, 10);
      ctx.rotate(0.3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(30, 10, 45, 15);
      ctx.quadraticCurveTo(20, 15, 0, 5);
      ctx.fill();
      ctx.restore();
  }
  ctx.fillStyle = '#ff99aa';
  ctx.beginPath(); ctx.ellipse(10, 10, 7, 5, 0, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#cc1111';
  ctx.lineWidth = 4;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-5, -12); 
  ctx.quadraticCurveTo(0, 5, 12, -2); 
  ctx.quadraticCurveTo(5, -15, -5, -12); 
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(18, -2); 
  ctx.quadraticCurveTo(25, 8, 35, -5); 
  ctx.quadraticCurveTo(30, -18, 18, -2); 
  ctx.stroke();
  ctx.beginPath(); ctx.moveTo(12, -2); ctx.lineTo(18, -2); ctx.stroke(); 
  ctx.fillStyle = '#55aaff'; 
  ctx.beginPath(); ctx.arc(8, -4, 2.5, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(22, -4, 2.5, 0, Math.PI*2); ctx.fill();
  ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(2, -6); ctx.lineTo(10, -4); ctx.stroke(); 
  ctx.beginPath(); ctx.moveTo(18, -4); ctx.lineTo(28, -6); ctx.stroke(); 
  ctx.beginPath(); ctx.moveTo(2, -6); ctx.lineTo(-2, -12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(6, -5); ctx.lineTo(4, -10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(28, -6); ctx.lineTo(32, -12); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(23, -4); ctx.lineTo(26, -10); ctx.stroke();
  ctx.restore();
}

export function drawAnimal(x, y, type, timer, badType) {
  ctx.save();
  ctx.translate(x, y + Math.sin(timer * 5) * 15); 
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 10;
  if (badType === '🐦‍⬛') {
     const flap = Math.sin(timer * 20) * 0.4; 
     drawUrubu(flap);
  } else {
     if (badType !== '🦅') {
       const flap = Math.sin(timer * 40) * 0.3;
       ctx.rotate(flap);
     } else {
       const glide = Math.sin(timer * 10) * 0.1;
       ctx.rotate(glide);
     }
     ctx.font = '60px Arial'; 
     ctx.fillText(badType, 0, -25);
  }
  ctx.shadowBlur = 0;
  ctx.restore();
  ctx.save();
  ctx.translate(x, y + Math.sin(timer * 5) * 15); 
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -5);
  ctx.lineTo(0, 30);
  ctx.stroke();
  const panicWobble = Math.sin(timer * 20) * 0.15;
  ctx.rotate(panicWobble);
  ctx.font = '40px Arial';
  ctx.fillText(type, 0, 40); 
  ctx.restore();
}

export function drawStone(x, y, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.shadowColor = 'rgba(0,255,255,0.8)';
  ctx.shadowBlur = 20;
  const stGrad = ctx.createRadialGradient(0,0,0,0,0,10);
  stGrad.addColorStop(0, '#fff');
  stGrad.addColorStop(0.5, '#7df9ff');
  stGrad.addColorStop(1, '#00bfff');
  ctx.fillStyle = stGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI*2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-2, -2, 3, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();
}

export function renderGame(theme, State) {
  const { canvas, ctx, game, player, stars, mountains, decorations, holes, bulldogs, enemies, bombs, bullets, upBullets, particles, savedAnimals, ufos, helicopters, boss, GROUND_Y } = State;
  if (!ctx) { console.error("Rendering: No CTX!"); return; }

  // 1. SKY
  ctx.fillStyle = theme.sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. STARS
  if (theme.starAlpha > 0) {
    ctx.globalAlpha = theme.starAlpha;
    for (let s of stars) {
      const blink = Math.sin(Date.now() * 0.002 + s.blinkOffset) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${blink})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  // 3. MOUNTAINS
  for (let m of mountains) {
    ctx.fillStyle = m.color || theme.m1;
    ctx.beginPath();
    ctx.moveTo(m.x, m.y + m.height);
    ctx.lineTo(m.x + m.width / 2, m.y);
    ctx.lineTo(m.x + m.width, m.y + m.height);
    ctx.fill();
  }

  // 4. GROUND
  const g1 = theme.g1, g2 = theme.g2;
  ctx.fillStyle = g1;
  ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
  
  // Grass/Bump effect
  ctx.fillStyle = g2;
  let startX = -(game.bgOffset % 40) - 600;
  ctx.beginPath();
  ctx.moveTo(startX, GROUND_Y);
  for(let x = startX; x <= canvas.width + 640; x += 20) {
    let bump = Math.sin((x + game.bgOffset) * 0.05) * 8;
    ctx.lineTo(x, GROUND_Y + bump);
  }
  ctx.lineTo(canvas.width + 640, GROUND_Y + 100);
  ctx.lineTo(startX, GROUND_Y + 100);
  ctx.fill();

  // 5. DECORATIONS (Clouds, Ufos, etc.)
  for (let d of decorations) {
    ctx.font = `${d.size}px Arial`;
    ctx.fillText(d.icon, d.x, d.y);
  }

  // 6. HOLES
  ctx.fillStyle = '#000';
  for (let h of holes) {
    ctx.beginPath();
    ctx.ellipse(h.x + h.width / 2, GROUND_Y + 5, h.width / 2, 15, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 7. BULLDOGS
  for (let b of bulldogs) {
    drawAnimatedAnimal(ctx, b.x, b.y, b.width, b.height, b.animTimer, false, false, b.kind, b.state, false, {});
  }

  // 8. ENEMIES (Animals to Rescue)
  for (let e of enemies) {
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(e.type, 0, 0);
    ctx.font = '30px Arial';
    ctx.fillText(e.badType || '🐦‍⬛', -30 + Math.sin(e.timer*10)*5, -20);
    ctx.restore();
  }

  // 9. BOSS
  if (boss) {
    ctx.save();
    ctx.translate(boss.x, boss.y);
    if (boss.type === 'bigdog') drawHilda(boss.timer);
    else if (boss.type === 'seagull') drawSeagull(Math.sin(boss.timer * 10), boss.state === 'fighting', 0, false);
    else if (boss.type === 'broom') drawBroom(boss.timer);
    else if (boss.type === 'fireworks') drawFireworks(boss.timer);
    else if (boss.type === 'hose') drawHose(boss.timer);
    else if (boss.type === 'wind') drawWind(boss.timer);
    else if (boss.type === 'storm') drawStorm(boss.timer);
    else if (boss.type === 'vacuum') drawVacuum(boss.timer);
    else if (boss.type === 'car') drawCar(boss.timer);
    else drawMoto(boss.timer);

    // HP Bar
    const bw = 100;
    ctx.fillStyle = '#444'; ctx.fillRect(-bw/2, -120, bw, 8);
    ctx.fillStyle = '#f00'; ctx.fillRect(-bw/2, -120, bw * (boss.hp / boss.maxHp), 8);
    ctx.restore();
  }

  // 10. SAVED ANIMALS
  for (let sa of savedAnimals) {
    ctx.save();
    ctx.translate(sa.x, sa.y);
    ctx.font = '30px Arial';
    ctx.fillText(sa.type, 0, 0);
    ctx.restore();
  }

  // 11. BULLETS & BOMBS
  for (let b of bullets) drawFood(b.x, b.y, b.rot, b.type);
  for (let b of upBullets) drawFood(b.x, b.y, b.rot, b.type);
  for (let b of bombs) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.font = '30px Arial';
    ctx.fillText('💣', 0, 0);
    ctx.restore();
  }

  // 12. PARTICLES
  for (let p of particles) {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    if (p.isStar) {
        ctx.font = `${p.size * 3}px Arial`;
        ctx.fillText('⭐', p.x, p.y);
    } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
  }
  ctx.globalAlpha = 1.0;

  // 13. PLAYER
  drawAnimatedAnimal(ctx, player.x, player.y, player.width, player.height, player.animTimer, player.isJumping, player.isFalling, player.kind, 'running', true, player);

  // 14. POWER-UP OVERLAY
  if (player.tripleShotTimer > 0 || player.doubleShotTimer > 0) {
    let remaining = player.tripleShotTimer > 0 ? player.tripleShotTimer : player.doubleShotTimer;
    let secs = Math.ceil(remaining / 1000);
    ctx.fillStyle = (secs <= 2 && Math.floor(Date.now() / 150) % 2 === 0) ? '#f00' : '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    let icon = player.tripleShotTimer > 0 ? '🚀 ' : '🔫 ';
    ctx.fillText(icon + secs + 's', player.x, player.y - player.height - 60);
  }
}
