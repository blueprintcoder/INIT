const express = require('express');
const router = express.Router();
const controller = require('../controllers/aiController');

router.post('/what-if', controller.whatIf);
router.get('/audit-logs', controller.getAuditLogs);

module.exports = router;
