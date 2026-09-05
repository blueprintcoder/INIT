/**
 * Real-world historical market statistical data for the 5 asset classes:
 * SPY (S&P 500), QQQ (Nasdaq Tech), IEF (10Y US Treasury), LQD (Corporate Bonds), USD (Cash)
 * Computed over 252 trading days.
 */

// Expected Annualized Returns
const expectedReturns = [0.125, 0.168, 0.042, 0.058, 0.038]; // SPY, QQQ, IEF, LQD, USD

// Annualized Asset Volatilities (Standard Deviation)
const volatilities = [0.162, 0.224, 0.072, 0.091, 0.000];

// Real-world Correlation Matrix between the assets
const correlationMatrix = [
  // SPY    QQQ    IEF    LQD    USD
  [ 1.00,  0.88, -0.22,  0.42,  0.00 ], // SPY
  [ 0.88,  1.00, -0.28,  0.35,  0.00 ], // QQQ
  [-0.22, -0.28,  1.00,  0.55,  0.00 ], // IEF (Negative correlation = Great hedge!)
  [ 0.42,  0.35,  0.55,  1.00,  0.00 ], // LQD
  [ 0.00,  0.00,  0.00,  0.00,  0.00 ]  // USD (Zero correlation)
];

// Covariance Matrix: Sigma[i][j] = Corr[i][j] * Vol[i] * Vol[j]
const covarianceMatrix = [];
for (let i = 0; i < volatilities.length; i++) {
  covarianceMatrix[i] = [];
  for (let j = 0; j < volatilities.length; j++) {
    covarianceMatrix[i][j] = parseFloat((correlationMatrix[i][j] * volatilities[i] * volatilities[j]).toFixed(6));
  }
}

module.exports = {
  assetSymbols: ['SPY', 'QQQ', 'IEF', 'LQD', 'USD'],
  expectedReturns,
  volatilities,
  correlationMatrix,
  covarianceMatrix
};
