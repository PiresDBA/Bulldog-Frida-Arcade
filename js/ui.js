import * as State from './state.js';
import * as Audio from './audio.js';
import { translateUI } from './i18n.js';

const { UI, game, globalCoins, setGlobalCoins, setGameState, saveGame } = State;

export function updateCoinsDisplay() {
  if (UI.coinsDisplay) UI.coinsDisplay.innerText = globalCoins;
  localStorage.setItem('fridaArcade_coins', globalCoins);
}

let continueInterval = null;

export function showContinueScreen() {
  setGameState('CONTINUE');
  UI.continueScreen.classList.remove('hidden');
  
  if (game.continues > 0) {
    UI.continuesLeftText.parentElement.innerHTML = `<span data-i18n="continuesLeft">Continues remaining</span>: <span id="continues-left">${game.continues}</span>`;
  } else {
    UI.continuesLeftText.parentElement.innerHTML = `<span style="color:#f1c40f; cursor:pointer;">🎥 Watch Ad to Continue!</span>`;
  }
  translateUI();
  
  Audio.stopBGM();
  
  let count = 10;
  UI.continueTimerText.innerText = count;
  
  if (continueInterval) clearInterval(continueInterval);
  continueInterval = setInterval(() => {
    count--;
    UI.continueTimerText.innerText = count;
    if (count <= 0) {
      rejectContinue(() => {
          triggerGameOver();
      });
    }
  }, 1000);
}

export function acceptContinue(resetPhaseCallback) {
  if (continueInterval) clearInterval(continueInterval);
  UI.continueScreen.classList.add('hidden');
  
  const finishContinue = () => {
    game.lives = 5;
    if (resetPhaseCallback) resetPhaseCallback();
    setGameState('PLAYING');
    Audio.startBGM();
    saveGame();
  };

  if (game.continues > 0) {
    game.continues--;
    finishContinue();
  } else {
    // Ad SDK placeholder
    console.log("Showing rewarded ad...");
    setTimeout(() => {
        finishContinue();
    }, 2000);
  }
}

export function rejectContinue(triggerGameOverCallback) {
  if (continueInterval) clearInterval(continueInterval);
  UI.continueScreen.classList.add('hidden');
  if (triggerGameOverCallback) triggerGameOverCallback();
}

export function triggerGameOver() {
  setGameState('GAMEOVER');
  UI.finalScore.innerText = game.score;
  UI.recordInputContainer.style.display = 'block'; 
  renderHighScores();
  Audio.stopBGM();
  saveGame();
  
  setTimeout(() => {
    UI.gameOverScreen.classList.remove('hidden');
  }, 1000);
}

export function updateHighScores(newScore, playerName) {
    let scores = JSON.parse(localStorage.getItem('fridaArcade_high_scores')) || [];
    const pName = playerName ? playerName.trim().substring(0, 10) : "ANÔNIMO";
    scores.push({ name: pName, score: newScore, date: new Date().toLocaleDateString('pt-BR') });
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 5); 
    localStorage.setItem('fridaArcade_high_scores', JSON.stringify(scores));
}

export function renderHighScores() {
    const scores = JSON.parse(localStorage.getItem('fridaArcade_high_scores')) || [];
    if (UI.highScoresList) {
        UI.highScoresList.innerHTML = scores.map((s, i) => `
            <div style="display: flex; justify-content: space-between; border-bottom: 1px dotted rgba(255,255,255,0.3); padding: 5px 0;">
                <span style="font-weight:bold; color:#ffcc00">${i + 1}º ${s.name || '---'}</span>
                <span>${s.score} pts</span>
            </div>
        `).join('') || '<p style="text-align:center; opacity:0.5;">Nenhum recorde ainda!</p>';
    }
}

export function updateHeroImages(kind) {
    const dogImg = document.getElementById('menu-dog-img');
    const vicImg = document.getElementById('victory-dog-img');
    const phaseImg = document.getElementById('phase-dog-img');
    let src = './luna-icon.png';
    if(kind === 'frida') src = './frida-icon.png';
    else if(kind === 'cinder') src = './cinder-icon.png';
    else if(kind === 'iris') src = './iris-icon.png';
    else if(kind === 'baby') src = './barbie-icon.png';
    
    if(dogImg) dogImg.src = src;
    if(vicImg) vicImg.src = src;
    if(phaseImg) phaseImg.src = src;
}

export function updateUI() {
  if (UI.score) UI.score.innerText = game.score;
  if (UI.phase) UI.phase.innerText = game.phase;
  if (UI.lives) {
    UI.lives.innerHTML = '';
    for (let i = 0; i < game.lives; i++) {
      UI.lives.innerHTML += '❤️';
    }
  }
  updateCoinsDisplay();
}
