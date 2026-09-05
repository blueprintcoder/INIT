const express = require('express');
const router = express.Router();
const mockData = require('../engine/mockFallback');

router.get('/', (req, res) => {
  // Returns current portfolio state
  res.json(mockData.portfolio);
});

module.exports = router;
