/**
 * Yash's Risk & Circuit Breaker Engine
 * Evaluates 1-Day Parametric VaR (95%), CVaR, and 3-Tier Circuit Breakers
 */

function calculateVaR(holdings) {
  if (!holdings || holdings.length === 0) {
    return { var95: 0.024, cvar95: 0.038, status: 'HEALTHY' };
  }

  // Parametric portfolio standard deviation approximation
  let weightedVol = 0;
  holdings.forEach(h => {
    const vol = h.volatility !== undefined ? h.volatility : 0.15;
    weightedVol += (h.weight || 0) * vol;
  });

  // 1-Day VaR (95% confidence -> 1.645 * daily vol)
  const dailyVol = weightedVol / Math.sqrt(252);
  const var95 = 1.645 * dailyVol;
  const cvar95 = var95 * 1.28; // Tail expectation approximation

  const var95Formatted = parseFloat(var95.toFixed(4));
  const cvar95Formatted = parseFloat(cvar95.toFixed(4));

  let status = 'HEALTHY';
  if (var95Formatted >= 0.040) {
    status = 'CRITICAL';
  } else if (var95Formatted >= 0.035) {
    status = 'WARNING';
  }

  return {
    var95: var95Formatted,
    cvar95: cvar95Formatted,
    status
  };
}

function evaluateCircuitBreakers(metrics, policy = {}) {
  const triggerLimit = policy.tier2BreakerTriggerVaR || policy.maxAllowableVaR95 || 0.040;
  const currentVaR = metrics ? (metrics.var95 || 0) : 0;

  if (currentVaR >= 0.055) {
    return {
      triggered: true,
      tier: 3,
      action: 'EMERGENCY_LOCKDOWN',
      message: `Tier 3 Severe Emergency Breaker: Extreme VaR (${(currentVaR * 100).toFixed(2)}%) detected. Freezing new disbursements & entering overnight repo.`
    };
  }

  if (currentVaR >= triggerLimit) {
    return {
      triggered: true,
      tier: 2,
      action: 'DE_RISK_TO_CASH',
      message: `Tier 2 Circuit Breaker Active: VaR (${(currentVaR * 100).toFixed(2)}%) breached 4.0% policy limit. De-risking $1,000,000 into T-Bills/Cash.`
    };
  }

  if (currentVaR >= 0.035) {
    return {
      triggered: false,
      tier: 1,
      action: 'SOFT_REBALANCE_WARNING',
      message: `Tier 1 Warning: VaR (${(currentVaR * 100).toFixed(2)}%) approaching limit. Restricting long-duration corporate bond purchases.`
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
