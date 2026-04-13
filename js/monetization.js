/**
 * MONETIZATION MANAGER - Bulldog Frida Arcade
 * Encapsula a lógica de múltiplas plataformas (CrazyGames, GamePix, etc)
 * de forma que o jogo principal não precise saber detalhes de cada SDK.
 */

const MonetizationManager = {
  platform: 'standalone', // crazygames, gamepix, standalone
  sdk: null,
  isPausedForAd: false,

  init() {
    console.log("Initializing Monetization Manager...");
    
    // 1. Detect platform
    const host = window.location.hostname;
    if (host.includes('crazygames') || host.includes('127.0.0.1')) {
      this.initCrazyGames();
    } else if (window.GamePix || host.includes('gamepix')) {
      this.initGamePix();
    } else {
      console.log("Standalone mode (Itch.io/GitHub Pages)");
    }
  },

  // --- CRAZY GAMES ---
  initCrazyGames() {
    if (window.CrazyGames && window.CrazyGames.SDK) {
      this.platform = 'crazygames';
      this.sdk = window.CrazyGames.SDK;
      console.log("CrazyGames SDK Detected.");
      
      // Adblocker detection (opcional)
      this.sdk.ad.hasAdblock().then((hasAdblock) => {
        if (hasAdblock) console.warn("CrazyGames: Adblock detected.");
      });
    }
  },

  // --- GAMEPIX ---
  initGamePix() {
    if (window.GamePix) {
      this.platform = 'gamepix';
      console.log("GamePix SDK Detected.");
      
      // Callbacks obrigatórios do GamePix
      window.GamePix.on.pause = () => {
        console.log("GamePix requesting pause");
        this.pauseGame();
      };
      window.GamePix.on.resume = () => {
        console.log("GamePix requesting resume");
        this.resumeGame();
      };
    }
  },

  // --- AD TRIGGER ---
  showAd(type = 'interstitial', callbacks = {}) {
    console.log(`Requesting ${type} ad...`);
    
    if (this.platform === 'crazygames' && this.sdk) {
      this.sdk.ad.requestAd(type, {
        adStarted: () => {
          this.pauseGame();
          if (callbacks.beforeAd) callbacks.beforeAd();
        },
        adFinished: () => {
          this.resumeGame();
          if (callbacks.afterAd) callbacks.afterAd();
        },
        adError: (error) => {
          console.error("CrazyGames Ad Error:", error);
          this.resumeGame();
          if (callbacks.afterAd) callbacks.afterAd();
        }
      });
    } 
    else if (this.platform === 'gamepix') {
       // GamePix handles the pause/resume internally via callbacks registered in init()
       window.GamePix.interstitialAd().then(() => {
          if (callbacks.afterAd) callbacks.afterAd();
       });
    }
    else {
      console.log("No Ad SDK active for this platform.");
      if (callbacks.afterAd) callbacks.afterAd();
    }
  },

  // --- GAME STATE BRIDGE ---
  pauseGame() {
    this.isPausedForAd = true;
    // Dispatch custom event that main.js will listen to
    window.dispatchEvent(new CustomEvent('monetizationPause'));
  },

  resumeGame() {
    this.isPausedForAd = false;
    window.dispatchEvent(new CustomEvent('monetizationResume'));
  },

  reportScore(score) {
    if (this.platform === 'gamepix') {
      window.GamePix.updateScore(score);
    }
    // CrazyGames doesn't have a direct score update for v2 interstitial
  },

  gameLoaded() {
    if (this.platform === 'gamepix') {
      window.GamePix.game.gameLoaded();
    }
  }
};

// Auto-init
window.addEventListener('DOMContentLoaded', () => MonetizationManager.init());
window.MonetizationManager = MonetizationManager;
