const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  assetClass: { type: String, enum: ['EQUITY', 'FIXED_INCOME', 'COMMODITY', 'CASH'], required: true },
  weight: { type: Number, required: true },
  targetWeight: { type: Number, required: true },
  value: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  volatility: { type: Number, default: 0.15 },
  accountingClass: { type: String, enum: ['HTM', 'AFS', 'HFT'], default: 'AFS' },
  durationYears: { type: Number, default: 1.0 },
  riskWeight: { type: Number, default: 0.20 },
  hqlaLevel: { type: String, enum: ['L1', 'L2A', 'L2B', 'NON_HQLA'], default: 'L1' },
  dailyVolume: { type: Number, default: 50000000 },
  bidAskSpreadBps: { type: Number, default: 5 }
});

const PortfolioSchema = new mongoose.Schema({
  name: { type: String, default: 'Corporate Treasury Balance Sheet' },
  totalValue: { type: Number, required: true, default: 10000000 },
  cashBuffer: { type: Number, required: true, default: 1500000 },
  activeMode: { type: String, enum: ['ADVISORY', 'AUTONOMOUS'], default: 'ADVISORY' },
  metrics: {
    sharpeRatio: { type: Number, default: 1.85 },
    var95: { type: Number, default: 0.024 },
    cvar95: { type: Number, default: 0.038 },
    status: { type: String, default: 'HEALTHY' }
  },
  circuitBreaker: {
    triggered: { type: Boolean, default: false },
    tier: { type: Number, default: 0 },
    message: { type: String, default: 'All risk metrics within normal parameters.' }
  },
  holdings: [HoldingSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
