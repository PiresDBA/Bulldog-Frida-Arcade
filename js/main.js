console.log("Main: Entry point executing...");
import * as State from './state.js';
import * as Game from './game.js';
import * as Input from './input.js';
import * as UI from './ui.js';
import { translateUI } from './i18n.js';
import { getTheme } from './theme.js';

let lastTime = 0;

function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    try {
        Game.mainUpdate(dt);
        const theme = getTheme(State.game.phase);
        Game.mainRender(theme);
    } catch (err) {
        console.error("Loop Error:", err);
        if (State.UI.score) State.UI.score.innerText = 'LOOP_ERR: ' + err.message;
    }

    requestAnimationFrame(loop);
}

// In modules, we can run code directly. 
// We use a small timeout to ensure the DOM is fully parsed and fonts/assets are available.
setTimeout(() => {
    console.log("Main: Initializing game...");
    
    // 1. Initialize State/Pools
    State.initStars();
    Game.initMountains();
    
    // 2. Initialize UI & i18n
    translateUI();
    UI.renderHighScores();
    UI.updateUI();
    
    // 3. Initialize Input
    Input.initInput();
    
    // 4. Load Game (Optional: depends if you want persistent saves)
    State.loadGame();
    UI.updateUI();
    
    // 5. Start Loop
    requestAnimationFrame(loop);
}, 100);
