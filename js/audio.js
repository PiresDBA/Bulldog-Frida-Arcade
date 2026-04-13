/**
 * audio.js
 * Manages all game audio, including BGM, SFX, and synthesized speech.
 */

import { game, gameState } from './state.js';
import { currentLang, i18n } from './i18n.js';

const AudioContext = window.AudioContext || window.webkitAudioContext;
export let audioCtx = null;

// Audio Assets
export const bearAudioPool = [
  new Audio('bear1.mp3'),
  new Audio('bear2.mp3'),
  new Audio('bear3.mp3')
];
export const crowAudio = new Audio('crow.mp3');
export const heliAudio = new Audio('helicoptero.mp3');
heliAudio.loop = true;
heliAudio.volume = 0.5;

export const seagullAudio = new Audio('seagull.mp3'); // Localized!
seagullAudio.volume = 0.6;

export const lunaLateAudio = new Audio('luna-latindo.mp3');
lunaLateAudio.volume = 0.6;

export const realMeow = new Audio('cat-meow.mp3'); // Localized!
export const realBark = new Audio('dog-bark-2.mp3'); // Localized!

let bgmAudio = null;
let currentBgmFile = '';
let ufoOsc = null;
let ufoLfo = null;
let currentBgNoise = null;
let thunderInterval = null;
let currentEngineOscs = [];

export function startUfoSound() {
  if(!audioCtx) return;
  stopUfoSound();
  ufoOsc = audioCtx.createOscillator();
  ufoLfo = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  ufoOsc.type = 'sine';
  ufoOsc.frequency.value = 600;
  ufoLfo.type = 'sine';
  ufoLfo.frequency.value = 8; 
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 200; 
  ufoLfo.connect(lfoGain);
  lfoGain.connect(ufoOsc.frequency);
  gain.gain.value = 0.1;
  ufoOsc.connect(gain);
  gain.connect(audioCtx.destination);
  ufoOsc.start();
  ufoLfo.start();
}

export function stopUfoSound() {
  if (ufoOsc) {
    try { ufoOsc.stop(); ufoLfo.stop(); } catch(e){}
    ufoOsc = null;
    ufoLfo = null;
  }
}

export function updateHeliSound(helicoptersCount) {
  if (helicoptersCount > 0) {
    if (heliAudio.paused) {
      heliAudio.play().catch(e => console.log("Heli audio blocked:", e));
    }
  } else {
    if (!heliAudio.paused) {
      heliAudio.pause();
      heliAudio.currentTime = 0;
    }
  }
}

export function playBgNoise(type) {
  if(!audioCtx) return;
  stopBgNoise();
  let soundType = type;
  if (type === 'seagull') soundType = 'none';
  if (type === 'hose') soundType = 'wind';
  if (type === 'broom') soundType = 'vacuum';
  if (type === 'fireworks') soundType = 'storm';
  if (type === 'bigdog') soundType = 'car';

  if (soundType === 'wind') {
    const src = audioCtx.createBufferSource();
    src.buffer = makePinkNoise(4); src.loop = true;
    const lp = audioCtx.createBiquadFilter(); lp.type = 'bandpass'; lp.frequency.value = 700;
    const gain = audioCtx.createGain(); gain.gain.value = 0.5;
    const lfo = audioCtx.createOscillator(); lfo.frequency.value = 0.3;
    const lfoGain = audioCtx.createGain(); lfoGain.gain.value = 250;
    lfo.connect(lfoGain); lfoGain.connect(lp.frequency);
    src.connect(lp); lp.connect(gain); gain.connect(audioCtx.destination);
    src.start(); lfo.start();
    currentBgNoise = src;
    currentEngineOscs.push(lfo);
  } else if (soundType === 'storm') {
    const rain = audioCtx.createBufferSource();
    rain.buffer = makePinkNoise(4); rain.loop = true;
    const rainGain = audioCtx.createGain(); rainGain.gain.value = 0.4;
    rain.connect(rainGain); rainGain.connect(audioCtx.destination);
    rain.start();
    currentBgNoise = rain;
  }
}

export function stopBgNoise() {
  try { if(currentBgNoise) { currentBgNoise.stop(); currentBgNoise = null; } } catch(e){}
  if(thunderInterval) { clearInterval(thunderInterval); thunderInterval = null; }
  currentEngineOscs.forEach(o => { try { o.stop(); } catch(e){} });
  currentEngineOscs = [];
}

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function startBGM() {
  const targetFile = game.phase >= 11 ? 'bgm.mp3' : 'cartoon_bgm.mp3';
  
  if (!bgmAudio) {
    bgmAudio = new Audio(targetFile);
    bgmAudio.loop = true;
    bgmAudio.volume = 0.5;
    currentBgmFile = targetFile;
  } else if (currentBgmFile !== targetFile) {
    bgmAudio.src = targetFile;
    bgmAudio.load();
    currentBgmFile = targetFile;
  }
  
  bgmAudio.play().catch(e => console.log('BGM autoplay prevented:', e));
}

export function stopBGM() {
  if (bgmAudio) bgmAudio.pause();
}

/**
 * Synthesized Speech (Localized & Offline-ready via Web Speech API)
 */
export function speak(key) {
  const dict = i18n[currentLang];
  const text = dict[key] || key;
  
  // Use Web Speech API instead of Google Translate for 100% offline support
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    if (currentLang === 'pt') utterance.lang = 'pt-BR';
    else if (currentLang === 'es') utterance.lang = 'es-ES';
    else if (currentLang === 'zh') utterance.lang = 'zh-CN';
    else utterance.lang = 'en-US';
    
    utterance.volume = 1.0;
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  } else {
    // Fallback if no SpeechSynthesis
    console.warn("SpeechSynthesis not supported.");
  }
}

// Basic Tone Generator
export function playTone(freq, type, duration, vol=0.1) {
  if(!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// Procedural Sound Effects
export function soundJump() {
  if(!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
}

export function soundShoot() {
  if(!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine'; 
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

export function soundDie() {
  if(!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 1.0);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.0);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 1.0);
}

export function soundTink() { 
  playTone(880, 'sine', 0.1, 0.1); 
  setTimeout(() => playTone(1050, 'sine', 0.1, 0.1), 50);
  setTimeout(() => playTone(1200, 'sine', 0.1, 0.1), 100);
  setTimeout(() => playTone(1350, 'sine', 0.1, 0.1), 150);
}

export function soundHappy() {
  playTone(523.25, 'sine', 0.1, 0.1); 
  setTimeout(() => playTone(659.25, 'sine', 0.1, 0.1), 100); 
  setTimeout(() => playTone(783.99, 'sine', 0.2, 0.1), 200); 
}

export function soundFreeAnimal() {
  playTone(659.25, 'sine', 0.1, 0.1); 
  setTimeout(() => playTone(880.00, 'sine', 0.2, 0.1), 100); 
}

export function soundDogBark() {
  realBark.currentTime = 0;
  realBark.play().catch(e => {
    if(!audioCtx) return;
    const playBark = (t, freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq/2, t + 0.15);
      gain.gain.setValueAtTime(0.3, t); 
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.start(t); osc.stop(t + 0.15);
    };
    playBark(audioCtx.currentTime, 250);
    playBark(audioCtx.currentTime + 0.15, 300);
  });
}

export function soundMeow() {
  realMeow.currentTime = 0;
  realMeow.play().catch(e => {
    if(!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square'; 
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.6);
  });
}

// Environmental Sounds
export function makePinkNoise(duration) {
  if(!audioCtx) return null;
  const sr = audioCtx.sampleRate;
  const buf = audioCtx.createBuffer(1, sr * duration, sr);
  const d = buf.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886*b0 + w*0.0555179; b1 = 0.99332*b1 + w*0.0750759;
    b2 = 0.96900*b2 + w*0.1538520; b3 = 0.86650*b3 + w*0.3104856;
    b4 = 0.55000*b4 + w*0.5329522; b5 = -0.7616*b5 - w*0.0168980;
    d[i] = (b0+b1+b2+b3+b4+b5+b6 + w*0.5362) * 0.11;
    b6 = w * 0.115926;
  }
  return buf;
}

