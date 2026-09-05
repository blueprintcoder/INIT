const mongoose = require('mongoose');

const RiskPolicySchema = new mongoose.Schema({
  minCashBufferPercent: { type: Number, default: 0.15 }, // 15% mandatory cash
  maxSingleAssetCap: { type: Number, default: 0.25 },    // max 25% in any asset
  maxAllowableVaR95: { type: Number, default: 0.040 },   // 4% max 1-day risk
  turnoverPenaltyFactor: { type: Number, default: 0.001 }, // fee penalty
  tier2BreakerTriggerVaR: { type: Number, default: 0.050 }, // 5% triggers auto de-risking
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RiskPolicy', RiskPolicySchema);
