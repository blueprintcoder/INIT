const store = require('../store/stateStore');
const { getLiveMarketPrices } = require('../services/marketData');

exports.getPortfolio = (req, res) => {
  try {
    const portfolio = store.getPortfolio();
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch portfolio', details: err.message });
  }
};

exports.syncLive = async (req, res) => {
  try {
    const livePrices = await getLiveMarketPrices();
    const current = store.getPortfolio();

    const updatedHoldings = current.holdings.map(h => {
      const price = livePrices[h.symbol] || h.currentPrice;
      return {
        ...h,
        currentPrice: price
      };
    });

    const updated = store.updatePortfolio({ holdings: updatedHoldings });
    res.json({
      success: true,
      message: 'Portfolio prices synced with live Yahoo Finance data',
      livePrices,
      portfolio: updated
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync live prices', details: err.message });
  }
};

exports.resetPortfolio = (req, res) => {
  try {
    const portfolio = store.resetPortfolio();
    res.json({ success: true, message: 'Portfolio restored to healthy baseline ($10M)', portfolio });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset portfolio', details: err.message });
  }
};

exports.toggleMode = (req, res) => {
  try {
    const current = store.getPortfolio();
    const newMode = current.activeMode === 'ADVISORY' ? 'AUTONOMOUS' : 'ADVISORY';
    const updated = store.updatePortfolio({ activeMode: newMode });
    res.json({ success: true, activeMode: newMode, portfolio: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle mode', details: err.message });
  }
};

exports.getPolicy = (req, res) => {
  try {
    const policy = store.getPolicy();
    res.json(policy);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch policy', details: err.message });
  }
};

exports.updatePolicy = (req, res) => {
  try {
    const updated = store.updatePolicy(req.body);
    res.json({ success: true, policy: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update policy', details: err.message });
  }
};
