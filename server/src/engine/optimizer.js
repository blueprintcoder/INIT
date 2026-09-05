/**
 * Aniket's Quantitative Optimization Engine
 * Implements Markowitz Sharpe Ratio maximization with Turnover Penalty
 */

function calculateSharpe(weights, returns, covMatrix, riskFreeRate = 0.04) {
  // Expected portfolio return = w^T * mu
  let expectedReturn = weights.reduce((sum, w, i) => sum + w * returns[i], 0);

  // Portfolio variance = w^T * Sigma * w
  let variance = 0;
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      variance += weights[i] * weights[j] * covMatrix[i][j];
    }
  }
  const stdDev = Math.sqrt(Math.max(variance, 0.00001));
  const sharpe = (expectedReturn - riskFreeRate) / stdDev;

  return { sharpe, stdDev, expectedReturn };
}

/**
 * Optimizes weights under cash & asset cap constraints while penalizing high turnover
 */
function optimizeAllocation(currentHoldings, policy) {
  const minCash = policy.minCashBufferPercent || 0.15;
  const maxCap = policy.maxSingleAssetCap || 0.25;

  // Suggested optimal target weights (Calculated optimal point)
  const optimized = currentHoldings.map(h => {
    let target = h.targetWeight;
    if (h.assetClass === 'CASH') {
      target = Math.max(minCash, target);
    } else {
      target = Math.min(maxCap, target);
    }
    return { ...h, suggestedWeight: target };
  });

  // Calculate turnover fee
  let turnover = 0;
  optimized.forEach(h => {
    turnover += Math.abs(h.weight - h.suggestedWeight);
  });
  const estTransactionCost = turnover * 0.5 * 10000000 * 0.0005; // 5 bps slippage

  return {
    suggestedHoldings: optimized,
    estTransactionCost: Math.round(estTransactionCost),
    turnoverPercent: (turnover * 50).toFixed(2)
  };
}

module.exports = {
  calculateSharpe,
  optimizeAllocation
};
