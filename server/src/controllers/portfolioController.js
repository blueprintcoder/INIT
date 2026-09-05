const store = require('../store/stateStore');
const { getLiveMarketPrices } = require('../services/marketData');
const { calculateVaR } = require('../engine/riskEngine');
const { calculateSharpe } = require('../engine/optimizer');

function normalizePortfolio(portfolio) {
  if (!portfolio) return portfolio;
  const cashVal = portfolio.cashBuffer !== undefined ? portfolio.cashBuffer : (portfolio.cash || 1500000);
  const sharpeVal = portfolio.metrics?.sharpeRatio !== undefined ? portfolio.metrics.sharpeRatio : (portfolio.metrics?.sharpe || 1.85);

  const normalizedHoldings = (portfolio.holdings || []).map(h => {
    const w = h.weight !== undefined ? h.weight : 0.20;
    const tw = h.targetWeight !== undefined ? h.targetWeight : w;
    return {
      ...h,
      weight: w,
      targetWeight: tw,
      current: Math.round(w * 100),
      target: Math.round(tw * 100)
    };
  });

  return {
    ...portfolio,
    cash: cashVal,
    cashBuffer: cashVal,
    metrics: {
      ...portfolio.metrics,
      sharpe: sharpeVal,
      sharpeRatio: sharpeVal,
      pnl: portfolio.metrics?.pnl !== undefined ? portfolio.metrics.pnl : 34200,
      var95: portfolio.metrics?.var95 !== undefined ? portfolio.metrics.var95 : 0.0240,
      cvar95: portfolio.metrics?.cvar95 !== undefined ? portfolio.metrics.cvar95 : 0.0380,
      status: portfolio.metrics?.status || 'HEALTHY'
    },
    holdings: normalizedHoldings
  };
}

exports.normalizePortfolio = normalizePortfolio;

exports.getPortfolio = (req, res) => {
  try {
    const portfolio = store.getPortfolio();
    res.json(normalizePortfolio(portfolio));
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
    const normalized = normalizePortfolio(updated);
    res.json({
      success: true,
      message: 'Portfolio prices synced with live Yahoo Finance data',
      livePrices,
      portfolio: normalized
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync live prices', details: err.message });
  }
};

exports.resetPortfolio = (req, res) => {
  try {
    const portfolio = store.resetPortfolio();
    const normalized = normalizePortfolio(portfolio);
    res.json({ success: true, message: 'Portfolio restored to healthy baseline ($10M)', portfolio: normalized });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset portfolio', details: err.message });
  }
};

exports.configurePortfolio = (req, res) => {
  try {
    const { name, totalValue, cashBufferPercent, holdings, policy } = req.body;
    
    const current = store.getPortfolio();
    const newTotal = totalValue || current.totalValue;
    const minCashPct = (cashBufferPercent !== undefined ? cashBufferPercent : (policy?.minCashBufferPercent || 0.15));
    const newCashBuffer = Math.round(newTotal * minCashPct);

    let updatedHoldings = current.holdings;
    if (holdings && Array.isArray(holdings)) {
      updatedHoldings = holdings.map(h => {
        const weight = h.weight !== undefined ? h.weight : (h.targetWeight || 0.20);
        const targetWeight = h.targetWeight !== undefined ? h.targetWeight : weight;
        return {
          ...h,
          weight,
          targetWeight,
          value: Math.round(newTotal * weight),
          currentPrice: h.currentPrice || 100,
          volatility: h.volatility || 0.15
        };
      });
    } else {
      updatedHoldings = current.holdings.map(h => ({
        ...h,
        value: Math.round(newTotal * h.weight)
      }));
    }

    const metrics = calculateVaR(updatedHoldings);
    const weights = updatedHoldings.map(h => h.weight);
    const sharpeResult = calculateSharpe(weights);
    metrics.sharpeRatio = sharpeResult.sharpe;

    const configured = store.configurePortfolio({
      name: name || 'Configured Balance Sheet',
      totalValue: newTotal,
      cashBuffer: newCashBuffer,
      holdings: updatedHoldings,
      metrics,
      circuitBreaker: {
        triggered: false,
        tier: 0,
        action: 'NONE',
        message: 'All risk metrics calibrated to custom profile.'
      },
      policy: policy || { minCashBufferPercent: minCashPct }
    });

    const normalized = normalizePortfolio(configured);

    const { getIo } = require('../sockets/socket');
    const io = getIo();
    if (io) {
      io.emit('portfolio-updated', normalized);
    }

    res.json({
      success: true,
      message: 'Portfolio successfully updated to custom profile',
      portfolio: normalized
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to configure portfolio', details: err.message });
  }
};

exports.toggleMode = (req, res) => {
  try {
    const current = store.getPortfolio();
    const newMode = current.activeMode === 'ADVISORY' ? 'AUTONOMOUS' : 'ADVISORY';
    const updated = store.updatePortfolio({ activeMode: newMode });
    res.json({ success: true, activeMode: newMode, portfolio: normalizePortfolio(updated) });
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
