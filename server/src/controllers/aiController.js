const store = require('../store/stateStore');
const { parseWhatIfScenario, parseNaturalPolicy } = require('../services/genai');

exports.whatIf = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const portfolio = store.getPortfolio();
    const result = await parseWhatIfScenario(query, portfolio.totalValue);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'What-If simulation failed', details: err.message });
  }
};

exports.parsePolicy = async (req, res) => {
  try {
    const { policyText } = req.body;
    if (!policyText) {
      return res.status(400).json({ error: 'policyText is required' });
    }

    const parsed = await parseNaturalPolicy(policyText);
    const updatedPolicy = store.updatePolicy({
      minCashBufferPercent: parsed.minCashBufferPercent,
      maxSingleAssetCap: parsed.maxSingleAssetCap,
      maxAllowableVaR95: parsed.maxAllowableVaR95
    });

    res.json({
      success: true,
      message: 'Policy guardrails successfully parsed and applied',
      parsed,
      policy: updatedPolicy
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to parse natural policy', details: err.message });
  }
};

exports.getAuditLogs = (req, res) => {
  try {
    const logs = store.getAuditLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs', details: err.message });
  }
};
