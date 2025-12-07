// routes/api.js

const express = require('express');
const router = express.Router();

const missaoController = require('../controllers/missaoController');

// Rotas de Missões
router.get('/missoes', missaoController.getMissoes);
router.get('/missao/:id', missaoController.getMissaoById);
router.post('/missao', missaoController.criarMissao);

module.exports = router;
