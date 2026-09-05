export const initialPortfolio = {
  totalValue: 10000000,
  cash: 1500000,
  activeMode: "AUTONOMOUS",

  holdings: [
    {
      symbol: "SPY",
      name: "S&P 500 ETF",
      current: 25,
      target: 30,
      color: "#222222",
    },
    {
      symbol: "QQQ",
      name: "Nasdaq 100 ETF",
      current: 20,
      target: 15,
      color: "#666666",
    },
    {
      symbol: "IEF",
      name: "7-10 Year Treasury ETF",
      current: 25,
      target: 25,
      color: "#888888",
    },
    {
      symbol: "LQD",
      name: "Investment Grade Bonds",
      current: 15,
      target: 20,
      color: "#aaaaaa",
    },
    {
      symbol: "USD",
      name: "Cash and Equivalents",
      current: 15,
      target: 10,
      color: "#cccccc",
    },
  ],

  metrics: {
    sharpe: 1.85,
    var95: 0.024,
    cvar95: 0.038,
    pnl: 34200,
    volatility: 8.4,
    status: "HEALTHY",
  },

  circuitBreaker: {
    triggered: false,
    tier: 0,
    message:
      "Portfolio is operating within all configured risk limits.",
  },
};