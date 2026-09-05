/**
 * Yash's Market Shock Simulator
 * Simulates flash crashes, interest rate hikes, and custom macro shocks
 */

function simulateFlashCrash(holdings) {
  if (!holdings || holdings.length === 0) return [];

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
      shockFactor = 0.96; // Corporate bonds drop 4%
      volMultiplier = 2.2;
    } else if (h.symbol === 'USD') {
      shockFactor = 1.00; // Cash remains stable
      volMultiplier = 0.0;
    } else {
      shockFactor = 0.92;
      volMultiplier = 2.5;
    }

    const currentPrice = h.currentPrice || 100;
    const value = h.value || 2000000;
    const volatility = h.volatility || 0.15;

    const newPrice = currentPrice * shockFactor;
    const newValue = value * shockFactor;
    return {
      ...h,
      currentPrice: parseFloat(newPrice.toFixed(2)),
      value: Math.round(newValue),
      volatility: parseFloat((volatility * volMultiplier).toFixed(2))
    };
  });
}

/**
 * Simulates Federal Reserve rate hikes (e.g. 75 bps or 100 bps)
 */
function simulateRateHike(holdings, bps = 75) {
  if (!holdings || holdings.length === 0) return [];
  const rateDelta = bps / 10000; // e.g. 75 bps = 0.0075

  return holdings.map(h => {
    const duration = h.durationYears || (h.assetClass === 'FIXED_INCOME' ? 5.0 : 1.0);
    // Price impact approximation: deltaP = -Duration * deltaY
    const priceChangePct = -duration * rateDelta;
    const shockFactor = 1.0 + priceChangePct;

    const currentPrice = h.currentPrice || 100;
    const value = h.value || 2000000;
    const volatility = h.volatility || 0.15;

    return {
      ...h,
      currentPrice: parseFloat((currentPrice * shockFactor).toFixed(2)),
      value: Math.round(value * shockFactor),
      volatility: parseFloat((volatility * (1 + rateDelta * 10)).toFixed(2))
    };
  });
}

/**
 * Custom Macro Shock Simulator (for GenAI what-if queries)
 */
function simulateMacroShock(holdings, params = {}) {
  if (!holdings || holdings.length === 0) return [];
  const { equityShock = 0, rateShockBps = 0, oilShock = 0 } = params;

  return holdings.map(h => {
    let shockFactor = 1.0;
    let volMult = 1.0;

    if (h.assetClass === 'EQUITY') {
      shockFactor += equityShock; // e.g., -0.10 for 10% drop
      if (oilShock > 0) shockFactor -= oilShock * 0.2; // Oil shock drags equities
      volMult += Math.abs(equityShock) * 5;
    } else if (h.assetClass === 'FIXED_INCOME') {
      const duration = h.durationYears || 4.0;
      const rateImpact = -duration * (rateShockBps / 10000);
      shockFactor += rateImpact;
      volMult += (rateShockBps / 100) * 0.5;
    }

    shockFactor = Math.max(0.5, shockFactor); // Floor at 50% loss max

    const currentPrice = h.currentPrice || 100;
    const value = h.value || 2000000;
    const volatility = h.volatility || 0.15;

    return {
      ...h,
      currentPrice: parseFloat((currentPrice * shockFactor).toFixed(2)),
      value: Math.round(value * shockFactor),
      volatility: parseFloat((volatility * volMult).toFixed(2))
    };
  });
}

module.exports = {
  simulateFlashCrash,
  simulateRateHike,
  simulateMacroShock
};
