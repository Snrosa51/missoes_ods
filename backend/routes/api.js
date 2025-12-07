// backend/routes/api.js
const express = require("express");
const router = express.Router();

const { listarMissoes } = require("../controllers/missoes");

// GET /api/missoes → lista missões + ações
router.get("/missoes", listarMissoes);

// rota de teste
router.get("/ping", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

module.exports = router;
