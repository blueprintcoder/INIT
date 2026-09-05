const express = require('express');
const router = express.Router();
const controller = require('../controllers/rebalanceController');

router.post('/optimize', controller.optimize);
router.post('/execute', controller.execute);

module.exports = router;
