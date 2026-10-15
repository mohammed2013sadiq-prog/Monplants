const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminder.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All reminder routes require authentication
router.use(authMiddleware);

router.get('/', reminderController.getReminders);
router.post('/', reminderController.createReminder);
router.put('/:id', reminderController.updateReminder);

module.exports = router;
