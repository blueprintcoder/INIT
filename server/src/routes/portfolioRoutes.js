const express = require('express');
const router = express.Router();
const controller = require('../controllers/portfolioController');

router.get('/', controller.getPortfolio);
router.post('/sync-live', controller.syncLive);
router.post('/reset', controller.resetPortfolio);
router.post('/toggle-mode', controller.toggleMode);
router.get('/policy', controller.getPolicy);
router.post('/policy', controller.updatePolicy);

module.exports = router;
