/**
 * MONETIZATION MANAGER PRO - Bulldog Frida Arcade
 * Suporte a: CrazyGames, GamePix, Poki e GameDistribution.
 */

const MonetizationManager = {
  // CONFIGURAÇÕES (Preencha aqui quando tiver os IDs oficiais)
  config: {
    gameDistributionID: "9049e85eb5d94bf98e16c6c932e080b2", // Official GameDistribution ID
    pokiEnabled: true,
  },

  platform: 'standalone', 
  isPausedForAd: false,
  isGameplayActive: false,

  init() {
    console.log("Initializing Monetization Manager Pro...");
    const host = window.location.hostname;

    // 1. Detect platform
    if (host.includes('crazygames') || host.includes('127.0.0.1')) {
      this.initCrazyGames();
    } else if (window.GamePix || host.includes('gamepix')) {
      this.initGamePix();
    } else if (host.includes('poki')) {
      this.initPoki();
    } else {
      // GameDistribution pode rodar em vários portais, então checamos se o SDK carregou
      this.initGameDistribution();
    }
  },

  // --- CRAZY GAMES ---
  async initCrazyGames() {
    if (window.CrazyGames && window.CrazyGames.SDK) {
      this.platform = 'crazygames';
      try {
        await window.CrazyGames.SDK.init();
        console.log("CrazyGames SDK V2 Initialized successfully.");
      } catch (e) {
        console.error("CrazyGames SDK init failed:", e);
      }
    }
  },

  // --- GAMEPIX ---
  initGamePix() {
    if (window.GamePix) {
      this.platform = 'gamepix';
      console.log("Platform: GamePix");
      window.GamePix.on.pause = () => this.pauseGame();
      window.GamePix.on.resume = () => this.resumeGame();
    }
  },

  // --- POKI ---
  initPoki() {
    if (window.PokiSDK) {
      this.platform = 'poki';
      console.log("Platform: Poki");
      window.PokiSDK.init().then(() => {
        console.log("Poki SDK Initialized");
      }).catch(() => {
        console.log("Poki SDK failed or adblock active");
      });
    }
  },

  // --- GAME DISTRIBUTION ---
  initGameDistribution() {
    // GD requer um objeto global antes de carregar o script
    window.GD_OPTIONS = {
      gameId: this.config.gameDistributionID,
      onEvent: (event) => {
        switch (event.name) {
          case "SDK_GAME_PAUSE": this.pauseGame(); break;
          case "SDK_GAME_START": this.resumeGame(); break;
          case "SDK_READY": console.log("GameDistribution SDK Ready"); break;
        }
      },
    };
    this.platform = 'gamedistribution';
    console.log("Platform: GameDistribution (Initialized)");
  },

  // --- CICLO DE VIDA (Importante para Poki) ---
  gameplayStart() {
    if (this.isGameplayActive) return;
    this.isGameplayActive = true;
    console.log("Gameplay Start Signal Sent");
    if (this.platform === 'poki' && window.PokiSDK) {
      window.PokiSDK.gameplayStart();
    }
    if (this.platform === 'crazygames' && window.CrazyGames) {
      window.CrazyGames.SDK.game.gameplayStart();
    }
  },

  gameplayStop() {
    if (!this.isGameplayActive) return;
    this.isGameplayActive = false;
    console.log("Gameplay Stop Signal Sent");
    if (this.platform === 'poki' && window.PokiSDK) {
      window.PokiSDK.gameplayStop();
    }
    if (this.platform === 'crazygames' && window.CrazyGames) {
      window.CrazyGames.SDK.game.gameplayStop();
    }
  },

  // --- ANÚNCIOS ---
  showAd(type = 'interstitial', callbacks = {}) {
    console.log(`Requesting ${type} ad on ${this.platform}`);
    
    // CRAZY GAMES
    if (this.platform === 'crazygames' && window.CrazyGames) {
      window.CrazyGames.SDK.ad.requestAd(type, {
        adStarted: () => { 
            this.gameplayStop();
            this.pauseGame(); 
            if (callbacks.beforeAd) callbacks.beforeAd(); 
        },
        adFinished: () => { 
            this.resumeGame(); 
            this.gameplayStart();
            if (callbacks.afterAd) callbacks.afterAd(); 
        },
        adError: () => { 
            this.resumeGame(); 
            this.gameplayStart();
            if (callbacks.afterAd) callbacks.afterAd(); 
        }
      });
    } 
    // GAMEPIX
    else if (this.platform === 'gamepix') {
      window.GamePix.interstitialAd().then(() => { if (callbacks.afterAd) callbacks.afterAd(); });
    }
    // POKI
    else if (this.platform === 'poki') {
      window.PokiSDK.commercialBreak().then(() => { if (callbacks.afterAd) callbacks.afterAd(); });
    }
    // GAME DISTRIBUTION
    else if (this.platform === 'gamedistribution' && window.gdsdk) {
      window.gdsdk.showAd();
    }
    else {
      if (callbacks.afterAd) callbacks.afterAd();
    }
  },

  pauseGame() {
    this.isPausedForAd = true;
    window.dispatchEvent(new CustomEvent('monetizationPause'));
  },

  resumeGame() {
    this.isPausedForAd = false;
    window.dispatchEvent(new CustomEvent('monetizationResume'));
  },

  reportScore(score) {
    if (this.platform === 'gamepix') window.GamePix.updateScore(score);
  },

  gameLoaded() {
    if (this.platform === 'poki' && window.PokiSDK) window.PokiSDK.gameLoaded();
    if (this.platform === 'crazygames' && window.CrazyGames) {
        // CrazyGames doesn't strictly require gameLoaded in V2 but it helps tracking
    }
  },

  // --- DATA MODULE (Cloud Save) ---
  setItem(key, value) {
    if (this.platform === 'crazygames' && window.CrazyGames && window.CrazyGames.SDK.data) {
      console.log(`CrazyGames: Saving ${key}`);
      window.CrazyGames.SDK.data.setItem(key, String(value));
    } else {
      localStorage.setItem(key, value);
    }
  },

  getItem(key, defaultValue = null) {
    if (this.platform === 'crazygames' && window.CrazyGames && window.CrazyGames.SDK.data) {
      const val = window.CrazyGames.SDK.data.getItem(key);
      return val !== null ? val : defaultValue;
    } else {
      const val = localStorage.getItem(key);
      return val !== null ? val : defaultValue;
    }
  }
};

window.addEventListener('DOMContentLoaded', () => MonetizationManager.init());
window.MonetizationManager = MonetizationManager;
