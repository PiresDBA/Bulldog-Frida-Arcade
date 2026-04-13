/**
 * i18n.js
 * Handles internationalization and UI translation.
 */

import { UI, player } from './state.js';

export const i18n = {
  pt: {
    score: "PONTOS", phase: "FASE", selectHero: "SELECIONE SEU HERÓI", ctrlShoot: "Atirar",
    ctrlJump: "Pular", ctrlMove: "Mover", gameMode: "MODO DE JOGO", easy: "Fácil",
    medium: "Médio", hard: "Difícil", startBtn: "Topa Começar? Vamos Nessa!",
    victoryText: "Parabéns! Nós vencemos o chefão da fase com sucesso! Você é demais!",
    continueBtn: "Continuar Aventura", continueQ: "CONTINUAR?", yes: "SIM", no: "NÃO",
    continuesLeft: "Continues restantes", finalScore: "Score Final",
    namePlaceholder: "Seu Nome (10 letras)", saveScore: "Salvar Recorde!",
    topRecords: "🏆 OS MELHORES RECORDES", tryAgain: "Tentar Novamente",
    introLuna: "Oi! Sou a Luna Salsicha! Aperte o botão da aventura para resgatarmos meus amiguinhos!",
    introFrida: "Oi! Sou a Frida Gorducha! Aperte o botão da aventura para resgatarmos meus amiguinhos!",
    introCinder: "Oi! Sou a Cinder Gatinha! Aperte o botão da aventura para resgatarmos meus amiguinhos!",
    introBaby: "Oi! Sou a Baby Ursinha! Sou rosa e adoro aventuras!",
    introIris: "Oi! Sou a Íris Unicórnio! Vamos espalhar cores e resgatar todos!",
    phaseReadyLuna: "Vamos lá! A Luna está pronta!",
    phaseReadyFrida: "Vamos lá! A Frida está pronta!",
    phaseReadyCinder: "Vamos lá! A Cinder está pronta!",
    phaseReadyBaby: "Vamos lá! A Baby está pronta!",
    phaseReadyIris: "Vamos lá! A Íris está pronta!",
    unlockMsg: "Desbloquear por {cost} moedas?",
    notEnoughCoins: "Moedas insuficientes!",
    locked: "🔒",
    tripleShot: "Tiro Triplo!",
    touchToStart: "TOQUE NA IMAGEM PARA COMEÇAR"
  },
  en: {
    score: "SCORE", phase: "PHASE", selectHero: "SELECT HERO", ctrlShoot: "Shoot",
    ctrlJump: "Jump", ctrlMove: "Move", gameMode: "GAME MODE", easy: "Easy",
    medium: "Normal", hard: "Hard", startBtn: "Ready? Let's Go!",
    victoryText: "Congratulations! We defeated the boss! You rock!",
    continueBtn: "Continue Adventure", continueQ: "CONTINUE?", yes: "YES", no: "NO",
    continuesLeft: "Continues left", finalScore: "Final Score",
    namePlaceholder: "Your Name", saveScore: "Save Score!",
    topRecords: "🏆 TOP SCORES", tryAgain: "Try Again",
    introLuna: "Hi! I'm Luna Sausage! Press the adventure button to rescue my friends!",
    introFrida: "Hi! I'm Chubby Frida! Press the adventure button to rescue my friends!",
    introCinder: "Hi! I'm Cinder Kitty! Press the adventure button to rescue my friends!",
    introBaby: "Hi! I'm Baby Bear! I'm pink and love adventures!",
    introIris: "Hi! I'm Iris Unicorn! Let's spread colors and rescue everyone!",
    phaseReadyLuna: "Let's go! Luna is ready!",
    phaseReadyFrida: "Let's go! Frida is ready!",
    phaseReadyCinder: "Let's go! Cinder is ready!",
    phaseReadyBaby: "Let's go! Baby is ready!",
    phaseReadyIris: "Let's go! Iris is ready!",
    unlockMsg: "Unlock for {cost} coins?",
    notEnoughCoins: "Not enough coins!",
    locked: "🔒",
    tripleShot: "Triple Shot!",
    touchToStart: "TOUCH IMAGE TO START"
  },
  es: {
    score: "PUNTOS", phase: "FASE", selectHero: "ELIGE TU HÉROE", ctrlShoot: "Disparar",
    ctrlJump: "Saltar", ctrlMove: "Mover", gameMode: "MODO DE JUEGO", easy: "Fácil",
    medium: "Medio", hard: "Difícil", startBtn: "¿Empezamos? ¡Vamos!",
    victoryText: "¡Felicidades! ¡Vencimos al jefe final con éxito! ¡Eres genial!",
    continueBtn: "Continuar Aventura", continueQ: "¿CONTINUAR?", yes: "SÍ", no: "NO",
    continuesLeft: "Continues restantes", finalScore: "Puntaje Final",
    namePlaceholder: "Tu Nombre", saveScore: "¡Guardar!",
    topRecords: "🏆 LOS MEJORES RÉCORDS", tryAgain: "Intentar de nuevo",
    introLuna: "¡Hola! ¡Soy Luna Salchicha! ¡Presiona el botão de aventura para rescatar a mis amiguitos!",
    introFrida: "¡Hola! ¡Soy Frida Gordita! ¡Presiona el botão de aventura para rescatar a mis amiguitos!",
    introCinder: "¡Hola! ¡Soy Cinder Gatita! ¡Presiona el botão de aventura para rescatar a mis amiguitos!",
    introBaby: "¡Hola! ¡Soy Baby Osita! ¡Soy rosa y divertida!",
    introIris: "¡Hola! ¡Soy Íris Unicornio! ¡Vamos a rescatar a todos!",
    phaseReadyLuna: "¡Vamos! ¡Luna está lista!",
    phaseReadyFrida: "¡Vamos! ¡Frida está lista!",
    phaseReadyCinder: "¡Vamos! ¡Cinder está lista!",
    phaseReadyBaby: "¡Vamos! ¡Baby está lista!",
    phaseReadyIris: "¡Vamos! ¡Íris está lista!",
    unlockMsg: "¿Desbloquear por {cost} monedas?",
    notEnoughCoins: "¡Monedas insuficientes!",
    locked: "🔒",
    tripleShot: "¡Tiro Triple!",
    touchToStart: "TOCA LA IMAGEN PARA EMPEZAR"
  },
  zh: {
    score: "得分", phase: "阶段", selectHero: "英雄选择", ctrlShoot: "射击",
    ctrlJump: "跳跃", ctrlMove: "移动", gameMode: "游戏模式", easy: "简单",
    medium: "中等", hard: "困难", startBtn: "准备好吗？开战吧！",
    victoryText: "恭喜！我们成功击败了最终的首领！你太棒了！",
    continueBtn: "继续冒险", continueQ: "继续吗？", yes: "是", no: "否",
    continuesLeft: "剩余继续次数", finalScore: "最终得分",
    namePlaceholder: "您的名字", saveScore: "保存记录！",
    topRecords: "🏆 最高记录", tryAgain: "再试一次",
    introLuna: "你好！我是香肠狗露娜！请按冒险按钮解救我的小伙伴！",
    introFrida: "你好！我是胖嘟嘟的弗里达！请按冒险按钮解救我的小伙伴！",
    introCinder: "你好！我是小猫灰姑娘！请按冒险按钮解救我的小伙伴！",
    introBaby: "你好！我是香肠狗露娜！请按冒险按钮解救我的小伙伴！",
    introIris: "你好！我是艾丽丝独角兽！让我们出发去解救大家吧！",
    phaseReadyLuna: "走吧！露娜准备好了！",
    phaseReadyFrida: "走吧！弗里达准备好了！",
    phaseReadyCinder: "走吧！灰姑娘准备好了！",
    phaseReadyBaby: "走吧！Baby准备好了！",
    phaseReadyIris: "走吧！艾丽丝准备好了！",
    unlockMsg: "用 {cost} 金币解锁吗？",
    notEnoughCoins: "金币不足！",
    locked: "🔒",
    tripleShot: "三连发！",
    touchToStart: "点击图片开始游戏"
  }
};

export let currentLang = localStorage.getItem('fridaArcade_lang') || navigator.language.substring(0, 2) || 'en';
if (!i18n[currentLang]) currentLang = 'en';

export function translateUI(updateHeroImages) {
  const dict = i18n[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.innerText = dict[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) el.placeholder = dict[key];
  });
  localStorage.setItem('fridaArcade_lang', currentLang);
  if (updateHeroImages) updateHeroImages(player.kind);
}

export function setLanguage(lang, updateHeroImages) {
  currentLang = lang;
  translateUI(updateHeroImages);
}
