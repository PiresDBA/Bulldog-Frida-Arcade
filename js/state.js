/**
 * state.js
 * Centralizes all global variables and constants for the game.
 * PURE STATE MODULE - NO IMPORTS to avoid circular dependencies.
 */

export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas ? canvas.getContext('2d') : null;

export let globalCoins = parseInt(localStorage.getItem('fridaArcade_coins') || '2000');
export let unlockedHeroes = JSON.parse(localStorage.getItem('fridaArcade_unlocked') || '["luna", "frida"]');

export const HERO_PRICES = {
  cinder: 500,
  iris: 1000,
  baby: 1500
};

export const GROUND_Y = 500;
export const DOG_COLOR = '#B2663E';
export const EARS_COLOR = '#5C2E0A';

// UI Elements (Initialized as null, filled by DOM or main.js)
export const UI = {
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
  phaseCompleteScreen: document.getElementById('phase-complete-screen'),
  continueBtn: document.getElementById('continue-btn'),
  continueScreen: document.getElementById('continue-screen'),
  btnYesContinue: document.getElementById('btn-yes-continue'),
  btnNoContinue: document.getElementById('btn-no-continue'),
  continuesLeftText: document.getElementById('continues-left'),
  continueTimerText: document.getElementById('continue-timer'),
  difficultySelect: document.getElementById('difficulty-select'),
  highScoresList: document.getElementById('high-scores-list'),
  playerNameInput: document.getElementById('player-name'),
  saveScoreBtn: document.getElementById('save-score-btn'),
  recordInputContainer: document.getElementById('record-input-container'),
  coinsDisplay: document.getElementById('coins')
};

// Global Game State
export let _t = 0;
export let lastTime = 0;
export let gameState = 'START';
export const keys = {};

export const game = {
  score: 0,
  phase: 1,
  lives: 5,
  continues: 5,
  speed: 250, 
  bgSpeed: 50, 
  bgOffset: 0,
  timeInPhase: 0,
  phaseDuration: 45000,
  difficulty: 'medium'
};

export const player = {
  x: 200,
  y: GROUND_Y,
  width: 80,
  height: 30, 
  vx: 0,
  vy: 0,
  speed: 300,
  jumpPower: -550,
  jumpCount: 0,
  maxJumps: 3,
  gravity: 1600,
  isJumping: false,
  isFalling: false,
  animTimer: 0,
  lastShootTime: 0,
  outfit: 'sailor',
  kind: 'luna',
  tripleShotTimer: 0,
  doubleShotTimer: 0,
  dead: false,
  invincible: false,
  invincibleTimer: 0,
  scale: 1,
  rotation: 0
};

// Entity Pools
export let helicopters = [];
export let planes = [];
export let bullets = [];
export let upBullets = [];
export let holes = [];
export let bulldogs = [];
export let enemies = [];
export let savedAnimals = [];
export let bombs = [];
export let particles = [];
export let stars = [];
export let mountains = [];
export let decorations = [];
export let ufos = [];

// Boss State
export let boss = null;
export let nextAmmo = 'bone';
export let beakOpen = false;

// Setters
export function setGameState(val) { gameState = val; }
export function setBoss(val) { boss = val; }
export function setNextAmmo(val) { nextAmmo = val; }
export function setBeakOpen(val) { beakOpen = val; }
export function setGlobalCoins(val) { globalCoins = val; localStorage.setItem('fridaArcade_coins', val); }

export function resetPools() {
  helicopters.length = 0;
  planes.length = 0;
  bullets.length = 0;
  upBullets.length = 0;
  holes.length = 0;
  bulldogs.length = 0;
  enemies.length = 0;
  savedAnimals.length = 0;
  bombs.length = 0;
  particles.length = 0;
  decorations.length = 0;
  ufos.length = 0;
}

export function initStars() {
  stars.length = 0;
  const w = canvas ? canvas.width : 800;
  for(let i=0; i<100; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * 400,
      size: Math.random() * 2 + 1,
      blinkOffset: Math.random() * Math.PI * 2
    });
  }
}

export function saveGame() {
  const data = {
    score: game.score,
    phase: game.phase,
    lives: game.lives,
    continues: game.continues,
    outfit: player.outfit
  };
  localStorage.setItem('fridaArcade_save', JSON.stringify(data));
}

export function loadGame() {
  const saved = localStorage.getItem('fridaArcade_save');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      game.score = data.score || 0;
      game.phase = data.phase || 1;
      game.lives = data.lives || 5;
      game.continues = data.continues || 5;
      player.outfit = data.outfit || 'sailor';
    } catch(e) { console.error("Erro ao carregar:", e); }
  }
}
