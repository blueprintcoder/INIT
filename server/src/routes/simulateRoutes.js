const express = require('express');
const router = express.Router();
const controller = require('../controllers/simulateController');

router.post('/flash-crash', controller.flashCrash);
router.post('/custom-shock', controller.customShock);

module.exports = router;
