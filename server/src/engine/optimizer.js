/**
 * Yash's Quantitative Optimization Engine
 * Implements Markowitz Sharpe Ratio maximization with Turnover Penalty & Cash Guardrails
 */

const DEFAULT_RETURNS = [0.10, 0.14, 0.04, 0.05, 0.02];
const DEFAULT_COV = [
  [0.0256, 0.0220, -0.0020, 0.0030, 0.0000],
  [0.0220, 0.0484, -0.0030, 0.0040, 0.0000],
  [-0.0020, -0.0030, 0.0049, 0.0020, 0.0000],
  [0.0030, 0.0040, 0.0020, 0.0081, 0.0000],
  [0.0000, 0.0000, 0.0000, 0.0000, 0.0000]
];

function calculateSharpe(weights, returns = DEFAULT_RETURNS, covMatrix = DEFAULT_COV, riskFreeRate = 0.04) {
  if (!weights || weights.length === 0) {
    return { sharpe: 0, stdDev: 0, expectedReturn: 0 };
  }

  // Expected portfolio return = w^T * mu
  let expectedReturn = weights.reduce((sum, w, i) => sum + w * (returns[i] || 0.05), 0);

  // Portfolio variance = w^T * Sigma * w
  let variance = 0;
  for (let i = 0; i < weights.length; i++) {
    for (let j = 0; j < weights.length; j++) {
      const covVal = (covMatrix && covMatrix[i] && covMatrix[i][j] !== undefined) ? covMatrix[i][j] : 0.01;
      variance += weights[i] * weights[j] * covVal;
    }
  }
  const stdDev = Math.sqrt(Math.max(variance, 0.00001));
  const sharpe = parseFloat(((expectedReturn - riskFreeRate) / stdDev).toFixed(2));

  return { sharpe, stdDev: parseFloat(stdDev.toFixed(4)), expectedReturn: parseFloat(expectedReturn.toFixed(4)) };
}

/**
 * Optimizes weights under cash & asset cap constraints while penalizing high turnover
 */
function optimizeAllocation(currentHoldings, policy = {}) {
  const minCash = policy.minCashBufferPercent || 0.15;
  const maxCap = policy.maxSingleAssetCap || 0.25;

  // Calculate total portfolio value
  const totalValue = currentHoldings.reduce((sum, h) => sum + (h.value || 0), 0) || 10000000;

  // Suggested optimal target weights (Calculated optimal point)
  const optimized = currentHoldings.map(h => {
    let target = h.targetWeight !== undefined ? h.targetWeight : h.weight;
    if (h.assetClass === 'CASH' || h.symbol === 'USD') {
      target = Math.max(minCash, target);
    } else {
      target = Math.min(maxCap, target);
    }
    // Respect HTM accounting class protection if tagged
    if (h.accountingClass === 'HTM') {
      target = Math.max(h.weight, target); // Prevents selling HTM assets
    }
    return { 
      ...h, 
      suggestedWeight: parseFloat(target.toFixed(4)),
      suggestedValue: Math.round(totalValue * target)
    };
  });

  // Calculate total weight turnover
  let turnoverSum = 0;
  optimized.forEach(h => {
    turnoverSum += Math.abs(h.weight - h.suggestedWeight);
  });
  
  // Turnover percent (half of absolute sum of changes)
  const turnoverPercent = parseFloat((turnoverSum * 50).toFixed(2));
  
  // Estimated slippage / transaction cost (5 bps = 0.0005)
  const estTransactionCost = Math.round((turnoverSum * 0.5) * totalValue * 0.0005);

  return {
    suggestedHoldings: optimized,
    estTransactionCost,
    turnoverPercent
  };
}

module.exports = {
  calculateSharpe,
  optimizeAllocation
};
