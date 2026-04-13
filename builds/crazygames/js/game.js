import * as State from './state.js';
import * as Rendering from './rendering.js';
import * as UI from './ui.js';
import * as Audio from './audio.js';
import * as Player from './player.js';
import * as Entities from './entities.js';
import { getTheme } from './theme.js';

const { 
    game, player, GROUND_Y, keys, 
    resetPools, saveGame, canvas
} = State;

export function startGame() {
    State.setGameState('PLAYING');
    game.score = 0;
    game.phase = 1;
    game.lives = 5;
    game.continues = 5;
    game.difficulty = document.querySelector('.diff-btn.selected')?.dataset.val || 'medium';
    player.kind = document.querySelector('.hero-btn.selected')?.dataset.val || 'luna';
    updateHeroImages(player.kind); 
    
    if (player.kind === 'cinder') { player.width = 60; player.height = 35; }
    else if (player.kind === 'frida') { player.width = 110; player.height = 50; }
    else if (player.kind === 'baby') { player.width = 90; player.height = 60; }
    else { player.width = 80; player.height = 30; }
    
    resetPhase();
    State.UI.startScreen.classList.add('hidden');
    State.UI.gameOverScreen.classList.add('hidden');
    State.UI.playerNameInput.value = '';
    if(State.UI.phaseTransition) State.UI.phaseTransition.classList.add('hidden');
    
    Audio.startBGM();
}

export function resetPhase() {
    let diffMult = 1;
    if(game.difficulty === 'easy') diffMult = 0.7;
    if(game.difficulty === 'hard') diffMult = 1.3;
    
    game.speed = (250 + (game.phase - 1) * 30) * diffMult;
    game.timeInPhase = 0;
    player.x = 200;
    player.y = GROUND_Y;
    player.vy = 0;
    player.isJumping = false;
    player.isFalling = false;
    player.scale = 1; 
    player.rotation = 0;
    player.jumpCount = 0;
    player.dead = false;
    player.invincible = false;
    player.invincibleTimer = 0;
    
    resetPools();
    initMountains();
    UI.updateUI();
}

export function nextPhase() {
    game.phase++;
    resetPhase();
    State.setGameState('PLAYING');
    Audio.startBGM();
    saveGame();
}

export function initMountains() {
    State.mountains.length = 0;
    const theme = getTheme(game.phase);
    for(let i=0; i<10; i++) {
        State.mountains.push({
            x: i * 200 - 100,
            y: 300 + Math.random() * 100,
            width: 250 + Math.random() * 150,
            height: 200 + Math.random() * 100,
            color: theme.m1
        });
    }
}

export function updateHeroImages(kind) {
    UI.updateHeroImages(kind);
}

export function mainUpdate(dt) {
    if (State.gameState !== 'PLAYING') return;

    game.timeInPhase += dt * 1000;
    game.bgOffset += game.speed * dt;

    // Boss Spawning
    if (game.timeInPhase > game.phaseDuration && !State.boss) {
        spawnBoss();
    }

    const theme = getTheme(game.phase);
    updateDecorations(dt, theme);
    
    let overHole = false;
    for(let h of State.holes) {
        if (player.x > h.x - 10 && player.x < h.x + h.width + 10) {
            overHole = true;
            break;
        }
    }
    
    Player.updatePlayer(dt, keys, overHole);
    updateMountains(dt);
    
    // Spawning Logic
    spawnHoles(dt);
    spawnBulldogs(dt);
    spawnEnemies(dt);
    
    Entities.updateHoles(dt);
    Entities.updateBulldogs(dt);
    Entities.updateEnemies(dt);
    Entities.updateSavedAnimals(dt);
    Entities.updateBoss(dt, State.boss, player);
    Entities.updateBombs(dt);
    Entities.updateBullets(dt, State.boss);
    Entities.updateUpBullets(dt, State.boss);
    Entities.updateParticles(dt);
    Entities.updateUfos(dt, player);
    Entities.updateHelicopters(dt, player);
}

function spawnBoss() {
    let bType = 'seagull';
    const bPhase = game.phase % 10;
    if (bPhase === 1) bType = 'seagull';
    else if (bPhase === 2) bType = 'bigdog';
    else if (bPhase === 3) bType = 'broom';
    else if (bPhase === 4) bType = 'fireworks';
    else if (bPhase === 5) bType = 'hose';
    else if (bPhase === 6) bType = 'wind';
    else if (bPhase === 7) bType = 'storm';
    else if (bPhase === 8) bType = 'vacuum';
    else if (bPhase === 9) bType = 'car';
    else bType = 'motorcycle';

    const w = canvas ? canvas.width : 800;
    State.setBoss({
        x: w + 100, y: 150, 
        hp: 15 + game.phase * 5, maxHp: 15 + game.phase * 5, 
        timer: 0, state: 'entering', type: bType
    });
    State.holes.length = 0;
    Audio.playBgNoise(bType);
}

function updateDecorations(dt, theme) {
    if (Math.random() < 0.01) {
        if (State.decorations.length < 12) {
            let icon = '☁️';
            if (theme.type === 'lunar') icon = '☄️';
            else if (theme.type === 'alien') icon = '🛸';
            else if (theme.type === 'mars') icon = '🛰️';
            else if (theme.type === 'sea') icon = '⛵';
            else if (theme.type === 'city') icon = '🚗';
            else if (theme.type === 'jungle') icon = '🌿';
            else if (theme.type === 'ice') icon = '❄️';
            
            const w = canvas ? canvas.width : 800;
            State.decorations.push({
                x: w + 100,
                y: Math.random() < 0.5 && (theme.type === 'sea' || theme.type === 'city') ? GROUND_Y - 30 - Math.random() * 40 : 30 + Math.random() * 200,
                speed: 10 + Math.random() * 40,
                icon: icon,
                size: 40 + Math.random() * 40
            });
        }
    }
    for(let i = State.decorations.length - 1; i >= 0; i--) {
        let d = State.decorations[i];
        d.x -= (game.bgSpeed + d.speed) * dt;
        if (d.x < -100) State.decorations.splice(i, 1);
    }
}

function updateMountains(dt) {
    const w = canvas ? canvas.width : 800;
    for(let m of State.mountains) {
        m.x -= game.bgSpeed * dt;
        if (m.x + m.width < 0) {
            m.x = w + Math.random() * 100;
            m.height = 200 + Math.random() * 100;
            m.y = 300 + Math.random() * 100;
        }
    }
}

function spawnHoles(dt) {
    let spawnMult = (game.difficulty === 'easy') ? 0.5 : (game.difficulty === 'hard' ? 1.5 : 1);
    const baseHoleChance = (State.boss || game.timeInPhase > game.phaseDuration - 2000) ? 0 : (0.003 + (game.phase * 0.0006)) * spawnMult;
    const w = canvas ? canvas.width : 800;
    if (Math.random() < baseHoleChance) {
        if (State.holes.length === 0 || State.holes[State.holes.length-1].x < w - 350) {
            State.holes.push({ x: w, width: 150 + Math.random() * 80 }); 
        }
    }
}

function spawnBulldogs(dt) {
    let spawnMult = (game.difficulty === 'easy') ? 0.5 : (game.difficulty === 'hard' ? 1.5 : 1);
    const baseBulldogChance = State.boss ? 0 : (0.002 + (game.phase * 0.0005)) * spawnMult;
    const w = canvas ? canvas.width : 800;
    if (Math.random() < baseBulldogChance) {
        let valid = true;
        for(let h of State.holes) {
            if (Math.abs(h.x - w) < h.width * 2 + 100) valid = false;
        }
        if (valid && State.bulldogs.length < 2) { 
            let kinds = ['cinder', 'frida', 'iris', 'iris', 'iris', 'white_baby', 'brown_baby', 'panda_baby'];
            if (player.kind !== 'luna') kinds.push('luna');
            if (player.kind === 'cinder') kinds = kinds.filter(k => k !== 'cinder');
            else if (player.kind === 'frida') kinds = kinds.filter(k => k !== 'frida');
            else if (player.kind === 'iris') kinds = kinds.filter(k => k !== 'iris');
            else if (player.kind === 'baby') kinds = kinds.filter(k => !k.includes('baby'));
            
            const t = kinds[Math.floor(Math.random() * kinds.length)];
            let bw = 80, bh = 50; 
            if (t === 'cinder') { bw = 60; bh = 35; }
            else if (t === 'frida') { bw = 110; bh = 55; }
            else if (t === 'luna') { bw = 80; bh = 40; }
            else if (t === 'iris') { bw = 90; bh = 60; }
            else if (t.includes('baby')) { bw = 90; bh = 60; }
            
            State.bulldogs.push({ x: w, y: GROUND_Y, width: bw, height: bh, state: 'idle', animTimer: 0, kind: t }); 
            if (t === 'cinder') Audio.soundMeow(); 
            else if (t === 'iris') Audio.soundWhinny(); 
            else if (t.includes('baby')) Audio.soundBear(); 
            else if (t === 'luna') Audio.soundDachshundBark();
            else Audio.soundDogBark();
        }
    }
}

function spawnEnemies(dt) {
    let spawnMult = (game.difficulty === 'easy') ? 0.5 : (game.difficulty === 'hard' ? 1.5 : 1);
    const maxEnemies = State.boss ? 0 : Math.max(1, Math.ceil((1 + game.phase) * spawnMult)); 
    const baseEnemyChance = State.boss ? 0 : (0.003 + (game.phase * 0.001)) * spawnMult; 
    const w = canvas ? canvas.width : 800;
    if (Math.random() < baseEnemyChance) { 
        if (State.enemies.length < maxEnemies) { 
            const types = ['🐈','🐒','🕊️','🐅','🐎','🐂','🐄','🐖','🐏','🐑','🐐','🐪','🦌','🐇','🐿️'];
            const badTypes = ['🐦‍⬛'];
            State.enemies.push({ 
                x: w + 50, 
                y: 40 + Math.random() * 180, 
                vx: -150 - Math.random() * 80 * (1 + game.phase * 0.1), 
                timer: 0,
                type: types[Math.floor(Math.random() * types.length)],
                badType: badTypes[Math.floor(Math.random() * badTypes.length)]
            });
            Audio.soundCrow();
        }
    }
}

export function mainRender(theme) {
    Rendering.renderGame(theme, State); 
}
