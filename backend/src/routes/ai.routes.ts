const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

router.get('/status', aiController.getStatus);
router.post('/identify', aiController.identify);
router.post('/chat', aiController.chat);

module.exports = router;
