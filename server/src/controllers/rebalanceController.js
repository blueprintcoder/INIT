const store = require('../store/stateStore');
const { optimizeAllocation } = require('../engine/optimizer');
const { getIo } = require('../sockets/socket');

exports.optimize = (req, res) => {
  try {
    const portfolio = store.getPortfolio();
    const policy = store.getPolicy();
    const result = optimizeAllocation(portfolio.holdings, policy);
    res.json({
      portfolio,
      optimization: result
    });
  } catch (err) {
    res.status(500).json({ error: 'Optimization failed', details: err.message });
  }
};

exports.execute = (req, res) => {
  try {
    const portfolio = store.getPortfolio();
    const policy = store.getPolicy();
    const result = optimizeAllocation(portfolio.holdings, policy);

    // Update holdings with suggested weights
    const newHoldings = result.suggestedHoldings.map(h => ({
      ...h,
      weight: h.suggestedWeight || h.weight,
      value: Math.round(portfolio.totalValue * (h.suggestedWeight || h.weight))
    }));

    const updatedPortfolio = store.updatePortfolio({
      holdings: newHoldings,
      circuitBreaker: {
        triggered: false,
        tier: 0,
        action: 'NONE',
        message: 'Portfolio successfully rebalanced to optimal weights.'
      }
    });

    const auditEntry = store.addAuditLog({
      actionType: 'OPTIMAL_REBALANCE',
      trigger: 'Manual or scheduled target convergence',
      preVaR: portfolio.metrics.var95,
      postVaR: portfolio.metrics.var95,
      capitalShifted: Math.round(portfolio.totalValue * (result.turnoverPercent / 100)),
      transactionCost: result.estTransactionCost,
      aiMemo: `Rebalanced portfolio holdings to policy targets. Turnover: ${result.turnoverPercent}%. Estimated transaction cost: $${result.estTransactionCost}.`
    });

    const io = getIo();
    if (io) {
      io.emit('portfolio-updated', updatedPortfolio);
    }

    res.json({
      success: true,
      portfolio: updatedPortfolio,
      auditLog: auditEntry
    });
  } catch (err) {
    res.status(500).json({ error: 'Rebalance execution failed', details: err.message });
  }
};
