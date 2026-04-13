import * as State from './state.js';
import * as Game from './game.js';
import * as Player from './player.js';
import * as UI from './ui.js';
import { translateUI } from './i18n.js';

console.log("Input: Module loaded");

const { keys, gameState, setGameState } = State;

export function initInput() {
    window.addEventListener('keydown', (e) => {
        keys[e.code] = true;
        if (State.gameState === 'PLAYING') {
            if (e.code === 'ArrowUp' || e.code === 'Space') Player.jump();
            if (e.code === 'KeyZ' || e.code === 'KeyJ') Player.shoot();
        }
    });

    window.addEventListener('keyup', (e) => {
        keys[e.code] = false;
    });

    // Language Buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            import('./i18n.js').then(m => m.setLanguage(lang, Game.updateHeroImages));
        });
    });

    // UI Buttons
    if (State.UI.startBtn) State.UI.startBtn.addEventListener('click', Game.startGame);
    if (State.UI.restartBtn) State.UI.restartBtn.addEventListener('click', () => location.reload());
    
    if (State.UI.btnYesContinue) State.UI.btnYesContinue.addEventListener('click', () => {
        UI.acceptContinue(Game.resetPhase);
    });
    
    if (State.UI.btnNoContinue) State.UI.btnNoContinue.addEventListener('click', () => {
        UI.rejectContinue(UI.triggerGameOver);
    });

    if (State.UI.saveScoreBtn) State.UI.saveScoreBtn.addEventListener('click', () => {
        const name = State.UI.playerNameInput.value;
        UI.updateHighScores(State.game.score, name);
        State.UI.recordInputContainer.style.display = 'none';
        UI.renderHighScores();
    });

    // Character Selection
    document.querySelectorAll('.hero-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.hero-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            Game.updateHeroImages(btn.dataset.val);
        });
    });

    // Difficulty Selection
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });
}
