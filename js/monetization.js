/**
 * MONETIZATION MANAGER PRO - Bulldog Frida Arcade
 * Suporte a: CrazyGames, GamePix, Poki e GameDistribution.
 */

const MonetizationManager = {
  // CONFIGURAÇÕES (Preencha aqui quando tiver os IDs oficiais)
  config: {
    gameDistributionID: "657101db-a06a-409f-a840-e40649a0b943", // PLACEHOLDER: Coloque seu ID aqui
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
  initCrazyGames() {
    if (window.CrazyGames && window.CrazyGames.SDK) {
      this.platform = 'crazygames';
      console.log("Platform: CrazyGames");
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
    if (this.platform === 'poki' && window.PokiSDK) {
      window.PokiSDK.gameplayStart();
    }
  },

  gameplayStop() {
    if (!this.isGameplayActive) return;
    this.isGameplayActive = false;
    if (this.platform === 'poki' && window.PokiSDK) {
      window.PokiSDK.gameplayStop();
    }
  },

  // --- ANÚNCIOS ---
  showAd(type = 'interstitial', callbacks = {}) {
    console.log(`Requesting ${type} ad on ${this.platform}`);
    
    // CRAZY GAMES
    if (this.platform === 'crazygames' && window.CrazyGames) {
      window.CrazyGames.SDK.ad.requestAd(type, {
        adStarted: () => { this.pauseGame(); if (callbacks.beforeAd) callbacks.beforeAd(); },
        adFinished: () => { this.resumeGame(); if (callbacks.afterAd) callbacks.afterAd(); },
        adError: () => { this.resumeGame(); if (callbacks.afterAd) callbacks.afterAd(); }
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
  }
};

window.addEventListener('DOMContentLoaded', () => MonetizationManager.init());
window.MonetizationManager = MonetizationManager;
