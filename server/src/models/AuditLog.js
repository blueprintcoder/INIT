const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  actionType: { 
    type: String, 
    enum: ['DRIFT_REBALANCE', 'TIER2_DERISK', 'TIER3_LOCKDOWN', 'MANUAL_OVERRIDE'], 
    required: true 
  },
  trigger: { type: String, required: true },
  preVaR: { type: Number },
  postVaR: { type: Number },
  capitalShifted: { type: Number },
  transactionCost: { type: Number },
  aiMemo: { type: String, required: true }
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
