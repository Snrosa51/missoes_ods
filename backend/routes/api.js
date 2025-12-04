// backend/routes/api.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { postResposta, getRanking } = require('../controllers/respostacontroller');
const { getProfile } = require('../controllers/usercontroller');

router.post('/respostas', authMiddleware, postResposta); // exige token (se quiser permitir anônimo, remova authMiddleware)
router.get('/ranking', getRanking);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
