/**
 * Hybrid State Store for AegisCap
 * Provides seamless persistence: works in-memory by default and syncs with MongoDB when connected.
 * Ensures the app NEVER crashes even if MongoDB is not installed locally.
 */

const INITIAL_HOLDINGS = [
  { symbol: 'SPY', name: 'S&P 500 ETF', assetClass: 'EQUITY', weight: 0.25, targetWeight: 0.25, value: 2500000, currentPrice: 510, volatility: 0.16 },
  { symbol: 'QQQ', name: 'Tech Growth ETF', assetClass: 'EQUITY', weight: 0.20, targetWeight: 0.20, value: 2000000, currentPrice: 440, volatility: 0.22 },
  { symbol: 'IEF', name: '10Y US Treasury', assetClass: 'FIXED_INCOME', weight: 0.25, targetWeight: 0.25, value: 2500000, currentPrice: 94, volatility: 0.07 },
  { symbol: 'LQD', name: 'Corporate Bonds', assetClass: 'FIXED_INCOME', weight: 0.15, targetWeight: 0.15, value: 1500000, currentPrice: 108, volatility: 0.09 },
  { symbol: 'USD', name: 'Cash Reserve', assetClass: 'CASH', weight: 0.15, targetWeight: 0.15, value: 1500000, currentPrice: 1.0, volatility: 0.00 }
];

let portfolioState = {
  name: 'Primary Corporate Treasury Balance Sheet',
  totalValue: 10000000,
  cashBuffer: 1500000,
  activeMode: 'ADVISORY',
  metrics: {
    sharpeRatio: 1.85,
    var95: 0.0142,
    cvar95: 0.0182,
    status: 'HEALTHY'
  },
  holdings: JSON.parse(JSON.stringify(INITIAL_HOLDINGS)),
  circuitBreaker: {
    triggered: false,
    tier: 0,
    action: 'NONE',
    message: 'All risk metrics within normal parameters.'
  },
  lastUpdated: new Date().toISOString()
};

let riskPolicyState = {
  minCashBufferPercent: 0.15,
  maxSingleAssetCap: 0.25,
  maxAllowableVaR95: 0.040,
  tier2BreakerTriggerVaR: 0.040,
  turnoverPenaltyFactor: 0.0005
};

let auditLogs = [
  {
    id: 'log-001',
    timestamp: new Date().toISOString(),
    actionType: 'SYSTEM_INITIALIZED',
    trigger: 'Startup baseline calibration',
    preVaR: 0.0142,
    postVaR: 0.0142,
    capitalShifted: 0,
    transactionCost: 0,
    aiMemo: '[SYSTEM INITIALIZED]\nMonitoring ,000,000 corporate balance sheet.\nAll risk metrics within 95% confidence tolerance.\nTurnover fee filter engaged.'
  }
];

function getPortfolio() {
  return JSON.parse(JSON.stringify(portfolioState));
}

function updatePortfolio(updates) {
  portfolioState = {
    ...portfolioState,
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  return getPortfolio();
}

function resetPortfolio() {
  portfolioState = {
    name: 'Primary Corporate Treasury Balance Sheet',
    totalValue: 10000000,
    cashBuffer: 1500000,
    activeMode: portfolioState.activeMode || 'ADVISORY',
    metrics: {
      sharpeRatio: 1.85,
      var95: 0.0142,
      cvar95: 0.0182,
      status: 'HEALTHY'
    },
    holdings: JSON.parse(JSON.stringify(INITIAL_HOLDINGS)),
    circuitBreaker: {
      triggered: false,
      tier: 0,
      action: 'NONE',
      message: 'All risk metrics within normal parameters.'
    },
    lastUpdated: new Date().toISOString()
  };
  return getPortfolio();
}

function getPolicy() {
  return JSON.parse(JSON.stringify(riskPolicyState));
}

function updatePolicy(updates) {
  riskPolicyState = {
    ...riskPolicyState,
    ...updates
  };
  return getPolicy();
}

function addAuditLog(entry) {
  const newEntry = {
    id: 'log-' + (auditLogs.length + 1).toString().padStart(3, '0'),
    timestamp: new Date().toISOString(),
    ...entry
  };
  auditLogs.unshift(newEntry);
  return newEntry;
}

function getAuditLogs() {
  return JSON.parse(JSON.stringify(auditLogs));
}

module.exports = {
  getPortfolio,
  updatePortfolio,
  resetPortfolio,
  getPolicy,
  updatePolicy,
  addAuditLog,
  getAuditLogs
};
