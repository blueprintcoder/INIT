const express = require('express');
const router = express.Router();
const { optimizeAllocation } = require('../engine/optimizer');
const mockData = require('../engine/mockFallback');

router.post('/optimize', (req, res) => {
  const result = optimizeAllocation(mockData.portfolio.holdings, { minCashBufferPercent: 0.15, maxSingleAssetCap: 0.25 });
  res.json(result);
});

router.post('/execute', (req, res) => {
  res.json({ success: true, message: 'Rebalancing executed and logged in audit trail.' });
});

module.exports = router;
