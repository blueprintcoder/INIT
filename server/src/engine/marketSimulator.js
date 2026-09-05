/**
 * Yash's Market Shock Simulator
 * Simulates flash crashes and rate hikes for live hackathon demos
 */

function simulateFlashCrash(holdings) {
  return holdings.map(h => {
    let shockFactor = 1.0;
    let volMultiplier = 1.0;

    if (h.symbol === 'QQQ') {
      shockFactor = 0.86; // Tech drops 14%
      volMultiplier = 4.5; // Volatility explodes during flash crash
    } else if (h.symbol === 'SPY') {
      shockFactor = 0.90; // S&P drops 10%
      volMultiplier = 3.8;
    } else if (h.symbol === 'IEF') {
      shockFactor = 1.02; // Treasuries rise 2% (Flight to safety)
      volMultiplier = 1.2;
    } else if (h.symbol === 'LQD') {
      shockFactor = 0.96;
      volMultiplier = 2.0;
    } else if (h.symbol === 'USD') {
      shockFactor = 1.00; // Cash remains stable
      volMultiplier = 0.0;
    }

    const newPrice = h.currentPrice * shockFactor;
    const newValue = h.value * shockFactor;
    return {
      ...h,
      currentPrice: parseFloat(newPrice.toFixed(2)),
      value: Math.round(newValue),
      volatility: parseFloat((h.volatility * volMultiplier).toFixed(2))
    };
  });
}

module.exports = {
  simulateFlashCrash
};
