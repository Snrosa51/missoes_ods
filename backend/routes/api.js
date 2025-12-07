const express = require('express');
const router = express.Router();

const missaoController = require('../controllers/missaoController');

router.get('/missoes', missaoController.getMissoes);
router.get('/missoes/:id', missaoController.getMissaoById);

module.exports = router;
