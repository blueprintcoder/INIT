/**
 * Aniket's Risk & Circuit Breaker Engine
 * Evaluates 1-Day Parametric VaR (95%), CVaR, and Circuit Breakers
 */

function calculateVaR(holdings) {
  // Parametric portfolio standard deviation approximation
  let weightedVol = 0;
  holdings.forEach(h => {
    weightedVol += h.weight * (h.volatility || 0.15);
  });

  // 1-Day VaR (95% confidence -> 1.645 * daily vol)
  const dailyVol = weightedVol / Math.sqrt(252);
  const var95 = 1.645 * dailyVol;
  const cvar95 = var95 * 1.28; // Tail expectation approximation

  return {
    var95: parseFloat(var95.toFixed(4)),
    cvar95: parseFloat(cvar95.toFixed(4)),
    status: var95 > 0.05 ? 'CRITICAL' : var95 > 0.038 ? 'WARNING' : 'HEALTHY'
  };
}

function evaluateCircuitBreakers(metrics, policy) {
  if (metrics.var95 >= policy.tier2BreakerTriggerVaR) {
    return {
      triggered: true,
      tier: 2,
      action: 'DE_RISK_TO_CASH',
      message: `Tier 2 Circuit Breaker Active: VaR (${(metrics.var95 * 100).toFixed(2)}%) breached policy limit.`
    };
  }
  return {
    triggered: false,
    tier: 0,
    action: 'NONE',
    message: 'All risk metrics within normal parameters.'
  };
}

module.exports = {
  calculateVaR,
  evaluateCircuitBreakers
};
