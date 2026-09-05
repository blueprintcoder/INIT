module.exports = {
  portfolio: {
    totalValue: 10000000,
    cashBuffer: 1500000,
    activeMode: 'ADVISORY',
    metrics: {
      sharpeRatio: 1.85,
      var95: 0.024,
      cvar95: 0.038,
      status: 'HEALTHY'
    },
    holdings: [
      { symbol: 'SPY', name: 'S&P 500 ETF', weight: 0.25, targetWeight: 0.25, value: 2500000, currentPrice: 510, volatility: 0.16 },
      { symbol: 'QQQ', name: 'Tech Growth', weight: 0.20, targetWeight: 0.20, value: 2000000, currentPrice: 440, volatility: 0.22 },
      { symbol: 'IEF', name: '10Y US Treasury', weight: 0.25, targetWeight: 0.25, value: 2500000, currentPrice: 94, volatility: 0.07 },
      { symbol: 'LQD', name: 'Corporate Bonds', weight: 0.15, targetWeight: 0.15, value: 1500000, currentPrice: 108, volatility: 0.09 },
      { symbol: 'USD', name: 'Cash Reserve', weight: 0.15, targetWeight: 0.15, value: 1500000, currentPrice: 1.0, volatility: 0.00 }
    ],
    circuitBreaker: {
      triggered: false,
      tier: 0,
      message: 'All risk metrics within normal parameters.'
    }
  }
};
