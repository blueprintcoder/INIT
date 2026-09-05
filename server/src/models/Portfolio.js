const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  assetClass: { type: String, enum: ['EQUITY', 'FIXED_INCOME', 'COMMODITY', 'CASH'], required: true },
  weight: { type: Number, required: true },
  targetWeight: { type: Number, required: true },
  value: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  volatility: { type: Number, default: 0.15 }
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
  holdings: [HoldingSchema],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
