const store = require('../store/stateStore');
const { parseWhatIfScenario, generateAuditMemo } = require('../services/genai');

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

exports.getAuditLogs = (req, res) => {
  try {
    const logs = store.getAuditLogs();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audit logs', details: err.message });
  }
};
