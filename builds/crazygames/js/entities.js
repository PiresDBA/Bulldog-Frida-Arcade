import * as State from './state.js';
import * as Audio from './audio.js';
import * as Rendering from './rendering.js';
import * as UI from './ui.js';
import * as Player from './player.js';

const { 
    game, player, boss, enemies, bulldogs, holes, bombs, bullets, upBullets, particles, savedAnimals, 
    ufos, helicopters, GROUND_Y, canvas, globalCoins, setGlobalCoins, setBoss, setGameState
} = State;

export function updateHoles(dt) {
    for(let i = holes.length - 1; i >= 0; i--) {
        holes[i].x -= game.speed * dt;
        if (holes[i].x + holes[i].width < -150) holes.splice(i, 1);
    }
}

export function updateBulldogs(dt) {
    for(let i = bulldogs.length - 1; i >= 0; i--) {
        let b = bulldogs[i];
        if (b.state === 'jumping_to_eat') {
            b.y += (b.vy * dt);
            b.vy += 1500 * dt;
            b.x -= game.speed * dt;
            if (b.y >= GROUND_Y) {
                b.y = GROUND_Y;
                b.state = b.kind === 'iris' ? 'sitting' : 'eating';
                b.animTimer = 0;
                b.sitTimer = 1.5;
                Audio.soundHappy();
                Rendering.createExplosion(b.x, b.y - 30, '#ffb6c1', 60);
                game.score += 20; setGlobalCoins(globalCoins + 20); UI.updateCoinsDisplay();
                UI.updateUI();
            }
        } else if (b.state === 'eating' || b.state === 'sitting') {
            b.x -= game.speed * dt;
            b.animTimer += dt;
            if (b.state === 'sitting') {
                b.sitTimer -= dt;
                if (b.sitTimer <= 0) bulldogs.splice(i, 1);
            } else {
                if (Math.random() < 0.05) Rendering.createExplosion(b.x, b.y - 30, '#ffb6c1', 2);
                if (b.x + b.width < -100) bulldogs.splice(i, 1);
            }
        } else {
            b.x -= game.speed * dt;
            b.animTimer += dt;
            if (!player.isFalling && (!player.invincibleTimer || player.invincibleTimer <= 0) &&
                Math.abs(player.x - b.x) < player.width/2 + b.width/2 - 10 &&
                Math.abs(player.y - player.height/2 - (b.y - b.height/2)) < player.height/2 + b.height/2 - 10) {
                if (player.vy > 0) {
                    b.state = b.kind === 'iris' ? 'sitting' : 'eating';
                    b.animTimer = 0; b.sitTimer = 1.5;
                    Audio.soundHappy(); Rendering.createExplosion(b.x, b.y - 30, '#ffb6c1', 20);
                    game.score += 20; setGlobalCoins(globalCoins + 20); UI.updateCoinsDisplay();
                    player.vy = player.jumpPower * 0.8; UI.updateUI();
                } else {
                    Player.die();
                }
            }
            if (b.x + b.width < -100) bulldogs.splice(i, 1);
        }
    }
}

export function updateEnemies(dt) {
    for(let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].x += enemies[i].vx * dt;
        enemies[i].timer += dt;
        if (Math.random() < 0.002 + (game.phase * 0.0003) && enemies[i].x < (canvas ? canvas.width : 800) && enemies[i].x > 0) {
            bombs.push({ x: enemies[i].x, y: enemies[i].y, vy: 200 + game.phase * 20 });
        }
        if (enemies[i].x < -50) enemies.splice(i, 1);
    }
}

export function updateBombs(dt) {
    for(let i = bombs.length - 1; i >= 0; i--) {
        bombs[i].y += bombs[i].vy * dt;
        bombs[i].x -= game.speed * 0.2 * dt;
        if (!player.isFalling && Math.abs(player.x - bombs[i].x) < player.width/2 &&
            Math.abs(player.y - player.height/2 - bombs[i].y) < player.height/2) {
            Player.die();
        }
        if (bombs[i].y > GROUND_Y) {
            Audio.soundBombImpact(); Audio.soundPoof();
            Rendering.createExplosion(bombs[i].x, GROUND_Y, '#ffaa00', 10);
            bombs.splice(i, 1);
        }
    }
}

export function updateBullets(dt, activeBoss) {
    for(let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].x += bullets[i].vx * dt;
        bullets[i].rot += dt * 10;
        let hit = false;
        for(let j = bulldogs.length - 1; j >= 0; j--) {
            let b = bulldogs[j];
            if (b.state === 'idle' && Math.abs(bullets[i].x - b.x) < b.width/2 + 20 && Math.abs(bullets[i].y - (b.y - b.height/2)) < b.height + 20) {
                if (b.kind === 'cinder' && bullets[i].type === 'bone') continue;
                b.state = 'jumping_to_eat'; b.vy = -400; b.animTimer = 0;
                if (b.kind === 'iris') { b.sitTimer = 1.5; Audio.soundWhinny(); Rendering.createExplosion(b.x, b.y - 30, '#ffb6c1', 80); }
                else Rendering.createExplosion(b.x, b.y - 30, '#ffb6c1', 20);
                hit = true; break;
            }
        }
        if (!hit) {
            for(let k = bombs.length - 1; k >= 0; k--) {
                if (Math.abs(bullets[i].x - bombs[k].x) < 35 && Math.abs(bullets[i].y - bombs[k].y) < 35) {
                    Audio.soundTink(); Rendering.createStarsExplosion(bombs[k].x, bombs[k].y, 25);
                    game.score += 15; setGlobalCoins(globalCoins + 15); UI.updateCoinsDisplay(); UI.updateUI();
                    bombs.splice(k, 1); hit = true; break;
                }
            }
        }
        if (hit) { bullets.splice(i, 1); continue; }
        if (activeBoss && Math.abs(bullets[i].x - activeBoss.x) < 80 && Math.abs(bullets[i].y - activeBoss.y) < 80) {
            activeBoss.hp--; Audio.soundTink(); Rendering.createExplosion(bullets[i].x, bullets[i].y, '#ffea00', 10);
            bullets.splice(i, 1); continue;
        }
        if (bullets[i].x > (canvas ? canvas.width : 800)) bullets.splice(i, 1);
    }
}

export function updateUpBullets(dt, activeBoss) {
    for(let i = upBullets.length - 1; i >= 0; i--) {
        upBullets[i].y += upBullets[i].vy * dt;
        upBullets[i].x += (upBullets[i].vx || 0) * dt;
        upBullets[i].rot += dt * 10;
        let hit = false;
        if (activeBoss && Math.abs(upBullets[i].x - activeBoss.x) < 80 && Math.abs(upBullets[i].y - activeBoss.y) < 80) {
            activeBoss.hp--; Audio.soundTink(); Rendering.createExplosion(upBullets[i].x, upBullets[i].y, '#ffea00', 10);
            upBullets.splice(i, 1); continue;
        }
        for(let j = enemies.length - 1; j >= 0; j--) {
            if (Math.abs(upBullets[i].x - enemies[j].x) < 50 && Math.abs(upBullets[i].y - (enemies[j].y - 20)) < 50) {
                Audio.soundPoof(); Rendering.createExplosion(enemies[j].x, enemies[j].y - 20, '#fff', 30); Audio.soundFreeAnimal();
                savedAnimals.push({ x: enemies[j].x, y: enemies[j].y + 10, type: enemies[j].type, vy: -50 });
                enemies.splice(j, 1); game.score += 50; setGlobalCoins(globalCoins + 50); UI.updateCoinsDisplay();
                UI.updateUI(); hit = true; break;
            }
        }
        if (!hit) {
            for(let k = bombs.length - 1; k >= 0; k--) {
                if (Math.abs(upBullets[i].x - bombs[k].x) < 35 && Math.abs(upBullets[i].y - bombs[k].y) < 35) {
                    Audio.soundTink(); Rendering.createStarsExplosion(bombs[k].x, bombs[k].y, 25);
                    game.score += 15; setGlobalCoins(globalCoins + 15); UI.updateCoinsDisplay(); UI.updateUI();
                    bombs.splice(k, 1); hit = true; break;
                }
            }
        }
        if (hit) { upBullets.splice(i, 1); continue; }
        if (upBullets[i].y < -100) upBullets.splice(i, 1);
    }
}

export function updateSavedAnimals(dt) {
    for(let i = savedAnimals.length - 1; i >= 0; i--) {
        let sa = savedAnimals[i];
        sa.y += sa.vy * dt;
        sa.vy += 200 * dt; 
        if (sa.vy > 80) sa.vy = 80; 
        sa.x -= (game.speed * 0.2) * dt; 
        if (sa.y >= GROUND_Y) {
            Rendering.createExplosion(sa.x, sa.y, '#ffb6c1', 8); 
            savedAnimals.splice(i, 1);
        }
    }
}

export function updateParticles(dt) {
    for(let i = particles.length - 1; i >= 0; i--) {
        particles[i].x += particles[i].vx * dt;
        particles[i].y += particles[i].vy * dt;
        particles[i].life -= dt;
        if (particles[i].life <= 0) particles.splice(i, 1);
    }
}

export function updateUfos(dt, activePlayer) {
    let ufoActive = false;
    for(let i = ufos.length - 1; i >= 0; i--) {
        let u = ufos[i];
        u.x += u.vx * dt;
        u.timer += dt;
        u.y += Math.sin(u.timer * 5) * 1.5;
        ufoActive = true;
        for(let j = bullets.length - 1; j >= 0; j--) {
            if (Math.abs(bullets[j].x - u.x) < 40 && Math.abs(bullets[j].y - u.y) < 40) {
                u.hp--; bullets.splice(j, 1); Audio.soundTink(); Rendering.createExplosion(u.x, u.y, '#fff', 5);
            }
        }
        for(let j = upBullets.length - 1; j >= 0; j--) {
            if (Math.abs(upBullets[j].x - u.x) < 40 && Math.abs(upBullets[j].y - u.y) < 40) {
                u.hp--; upBullets.splice(j, 1); Audio.soundTink(); Rendering.createExplosion(u.x, u.y, '#fff', 5);
            }
        }
        if (u.hp <= 0) {
            Rendering.createExplosion(u.x, u.y, '#55ff55', 60);
            Audio.soundPowerUp(); activePlayer.doubleShotTimer = 7000;
            ufos.splice(i, 1); ufoActive = false; Audio.stopUfoSound();
        } else if (u.x < -100) {
            ufos.splice(i, 1); ufoActive = false; Audio.stopUfoSound();
        }
    }
    if (!ufoActive) Audio.stopUfoSound();
}

export function updateHelicopters(dt, activePlayer) {
    for(let i = helicopters.length - 1; i >= 0; i--) {
        let h = helicopters[i];
        h.x += h.vx * dt;
        h.timer += dt;
        h.y = 80 + Math.sin(h.timer * 4) * 20;
        for(let j = bullets.length - 1; j >= 0; j--) {
            if (Math.abs(bullets[j].x - h.x) < 45 && Math.abs(bullets[j].y - h.y) < 45) {
                h.hp--; bullets.splice(j, 1); Audio.soundTink(); Rendering.createExplosion(h.x, h.y, '#fff', 5);
            }
        }
        for(let k = upBullets.length - 1; k >= 0; k--) {
            if (Math.abs(upBullets[k].x - h.x) < 45 && Math.abs(upBullets[k].y - h.y) < 45) {
                h.hp--; upBullets.splice(k, 1); Audio.soundTink(); Rendering.createExplosion(h.x, h.y, '#fff', 5);
            }
        }
        if (h.hp <= 0) {
            Rendering.createExplosion(h.x, h.y, '#ffea00', 60); Audio.soundMarioWin(); Audio.speak('tripleShot');
            activePlayer.tripleShotTimer = 12000; helicopters.splice(i, 1); Audio.updateHeliSound(helicopters.length);
        } else if (h.x < -150) {
            helicopters.splice(i, 1); Audio.updateHeliSound(helicopters.length);
        }
    }
}

export function updateBoss(dt, currentBoss, activePlayer) {
    if (!currentBoss) return;
    currentBoss.timer += dt;
    if (currentBoss.state === 'entering') {
        currentBoss.x -= 200 * dt;
        if (currentBoss.x < (canvas ? canvas.width : 800) / 2) currentBoss.state = 'fighting';
    } else if (currentBoss.state === 'fighting') {
        if (!currentBoss.dead) {
            if (currentBoss.type === 'bigdog') {
                currentBoss.y = Math.min(currentBoss.y + 200 * dt, GROUND_Y - 40);
                currentBoss.x = (canvas ? canvas.width : 800) / 2 + Math.sin(currentBoss.timer * 2.0) * ((canvas ? canvas.width : 800) / 2 - 20);
            } else if (currentBoss.type === 'seagull') {
                if (!currentBoss.mode) currentBoss.mode = 'FLYING';
                if (!currentBoss.modeTimer) currentBoss.modeTimer = 0;
                currentBoss.modeTimer += dt;
                if (currentBoss.mode === 'FLYING') {
                    currentBoss.x = (canvas ? canvas.width : 800) / 2 + Math.sin(currentBoss.timer * 1.5) * ((canvas ? canvas.width : 800) / 2 - 50);
                    currentBoss.y = 150 + Math.sin(currentBoss.timer * 3.5) * 80;
                    if (currentBoss.modeTimer > 6) { currentBoss.mode = 'DIVING'; currentBoss.modeTimer = 0; }
                } else {
                    const targetY = GROUND_Y - 50; const targetX = activePlayer.x + 100;
                    currentBoss.x += (targetX - currentBoss.x) * dt * 2;
                    currentBoss.y += (targetY - currentBoss.y) * dt * 3;
                    if (currentBoss.modeTimer > 3) { currentBoss.mode = 'FLYING'; currentBoss.modeTimer = 0; }
                }
            } else {
                currentBoss.x = (canvas ? canvas.width : 800) / 2 + Math.sin(currentBoss.timer * 1.5) * ((canvas ? canvas.width : 800) / 2 - 50);
                currentBoss.y = 150 + Math.sin(currentBoss.timer * 3.5) * 80;
            }
            if (!activePlayer.isFalling && !activePlayer.invincible && currentBoss.y > 200 &&
                Math.abs(activePlayer.x - currentBoss.x) < 50 && Math.abs((activePlayer.y - activePlayer.height/2) - currentBoss.y) < 50) {
                Player.die();
            }
            if (Math.random() < 0.05 + (game.phase * 0.015)) {
                bombs.push({ x: currentBoss.x, y: currentBoss.y + 40, vy: 400 });
            }
        }
        if (currentBoss.hp <= 0 && !currentBoss.dead) {
            currentBoss.dead = true; Audio.stopBgNoise();
            game.score += 500; setGlobalCoins(globalCoins + 500); UI.updateCoinsDisplay(); UI.updateUI();
            let expCount = 0;
            let expInt = setInterval(() => {
                Rendering.createExplosion(currentBoss.x + (Math.random()-0.5)*150, currentBoss.y + (Math.random()-0.5)*150, '#ffaa00', 80);
                Rendering.createExplosion(currentBoss.x + (Math.random()-0.5)*150, currentBoss.y + (Math.random()-0.5)*150, '#ff0000', 80);
                Audio.soundPoof(); expCount++;
                if(expCount > 10) {
                    clearInterval(expInt); setBoss(null); setGameState('PHASE_COMPLETE');
                    UI.phaseCompleteScreen.classList.remove('hidden');
                }
            }, 150);
        }
    }
}
