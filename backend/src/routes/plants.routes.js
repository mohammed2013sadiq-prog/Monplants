const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plant.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// All plant routes require authentication
router.use(authMiddleware);

router.get('/', plantController.getAll);
router.get('/:id', plantController.getById);
router.post('/', plantController.create);
router.put('/:id', plantController.update);
router.delete('/:id', plantController.remove);

module.exports = router;
