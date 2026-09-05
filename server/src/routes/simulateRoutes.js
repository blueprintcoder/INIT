const express = require('express');
const router = express.Router();
const { simulateFlashCrash } = require('../engine/marketSimulator');
const { calculateVaR, evaluateCircuitBreakers } = require('../engine/riskEngine');
const mockData = require('../engine/mockFallback');
const { getIo } = require('../sockets/socket');

router.post('/flash-crash', (req, res) => {
  const shockedHoldings = simulateFlashCrash(mockData.portfolio.holdings);
  const newMetrics = calculateVaR(shockedHoldings);
  const breaker = evaluateCircuitBreakers(newMetrics, { tier2BreakerTriggerVaR: 0.040 });

  const payload = {
    holdings: shockedHoldings,
    metrics: newMetrics,
    circuitBreaker: breaker,
    aiMemo: `EMERGENCY AUDIT: 1-Day VaR spiked to ${(newMetrics.var95 * 100).toFixed(2)}%. Tier-2 Circuit Breaker engaged. Reallocating capital to Cash/T-Bills.`
  };

  // Broadcast to Yash's React frontend
  const io = getIo();
  if (io) {
    io.emit('market-shock', payload);
  }

  res.json(payload);
});

module.exports = router;
