const express = require('express');
const router = express.Router();
const speciesController = require('../controllers/species.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', speciesController.getAll);
router.get('/:id', speciesController.getById);
router.post('/', authMiddleware, speciesController.create);
router.put('/:id', authMiddleware, speciesController.update);
router.delete('/:id', authMiddleware, speciesController.remove);

module.exports = router;
