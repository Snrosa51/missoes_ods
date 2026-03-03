// backend/routes/api.js
const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const seedController = require("../controllers/seedController");
const { listarMissoes } = require("../controllers/missoes");

router.get("/admin/drop-tables", adminController.dropInvalidTables);
router.post("/admin/seed", seedController.executarSeeds);

// GET /api/missoes → lista missões + ações
router.get("/missoes", listarMissoes);

// rota de teste
router.get("/ping", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

module.exports = router;
