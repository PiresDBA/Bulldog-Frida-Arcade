export function getTheme(phase) {
  const p = (phase - 1) % 10;
  if (p === 0) return { sky: '#4DA6FF', g1: '#5D4037', g2: '#3CB371', m1: '#2E8B57', type: 'forest', starAlpha: 0 };
  if (p === 1) return { sky: '#FF8C00', g1: '#A0522D', g2: '#D2691E', m1: '#8B4513', type: 'mountain', starAlpha: 0.2 };
  if (p === 2) return { sky: '#191970', g1: '#444444', g2: '#777777', m1: '#555555', type: 'lunar', starAlpha: 1 };
  if (p === 3) return { sky: '#800080', g1: '#408080', g2: '#90EE90', m1: '#483D8B', type: 'alien', starAlpha: 0.8 };
  if (p === 4) return { sky: '#ff6600', g1: '#993300', g2: '#cc3300', m1: '#661100', type: 'mars', starAlpha: 0.4 };
  if (p === 5) return { sky: '#ffe666', g1: '#cca300', g2: '#ffcc00', m1: '#b38f00', type: 'venus', starAlpha: 0.1 };
  if (p === 6) return { sky: '#87CEEB', g1: '#006994', g2: '#00BFFF', m1: '#1CA3EC', type: 'sea', starAlpha: 0 };
  if (p === 7) return { sky: '#708090', g1: '#333333', g2: '#4d4d4d', m1: '#2f4f4f', type: 'city', starAlpha: 0.1 };
  if (p === 8) return { sky: '#003300', g1: '#001a00', g2: '#004d00', m1: '#002600', type: 'jungle', starAlpha: 0 };
  if (p === 9) return { sky: '#e0ffff', g1: '#b0e0e6', g2: '#ffffff', m1: '#87cefa', type: 'ice', starAlpha: 0.3 };
  return { sky: '#4DA6FF', g1: '#5D4037', g2: '#3CB371', m1: '#2E8B57', type: 'forest', starAlpha: 0 };
}
