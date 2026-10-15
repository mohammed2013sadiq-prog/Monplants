const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journal.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All journal routes require authentication
router.use(authMiddleware);

router.get('/', journalController.getJournal);
router.post('/', journalController.createJournalEntry);

module.exports = router;
