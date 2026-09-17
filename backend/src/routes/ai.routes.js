const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// AI endpoints (can be accessed publicly or protected)
router.post('/identify', aiController.identify);
router.post('/chat', aiController.chat);

module.exports = router;
