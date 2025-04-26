// js/script.js

// Riskli bölgelerdeki tahmini nüfus (İstanbul: 1 500 000 riskli konut × 3.17 kişi/konut)
const RISK_POP = 1_500_000 * 3.17; // ≈ 4 755 000

/**
 * Mw büyüklüğe göre salınan enerjiyi (Joule) hesaplar.
 * Formül: log10(E) = 4.8 + 1.5 · M
 */
function computeEnergy(mag) {
  return Math.pow(10, 4.8 + 1.5 * mag);
}

/** Joule → ton TNT dönüşümü (1 ton TNT = 4.2×10⁹ J) */
function computeTNT(e) {
  return e / 4.2e9;
}

/** Yaklaşık MMI değeri (tam sayıya yuvarlanmış) */
function computeMMI(mag) {
  const num = Math.round(1.7 * mag - 1.6);
  const map = {
    1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
    6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX',
    10: 'X', 11: 'XI', 12: 'XII'
  };
  return map[Math.min(Math.max(num, 1), 12)];
}

/** USGS PAGER fatalite oranları (vulnerability) */
function getFatalityRate(mmi) {
  switch (mmi) {
    case 'III':   return 0.00001;  // 0.001%
    case 'V':     return 0.00010;  // 0.01%
    case 'VI':    // VI–VII
    case 'VII':   return 0.00050;  // 0.05%
    case 'VIII':  return 0.00100;  // 0.1%
    case 'IX':    // IX–X
    case 'X':     return 0.02000;  // 2.0%
    case 'XI':   // XI–XII
    case 'XII':   return 0.15000;  // 15.0%
    default:      return 0;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.querySelector('#data-table tbody');
  for (let mag = 3.0; mag <= 8.0; mag = Math.round((mag + 0.1) * 10) / 10) {
    const E       = computeEnergy(mag);
    const TNT     = computeTNT(E);
    const mmi     = computeMMI(mag);
    const p       = getFatalityRate(mmi);
    const casualties = Math.round(RISK_POP * p);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${mag.toFixed(1)}</td>
      <td>${E.toLocaleString()}</td>
      <td>${TNT.toFixed(2)}</td>
      <td>${mmi}</td>
      <td>${casualties.toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  }
});
