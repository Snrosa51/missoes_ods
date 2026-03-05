// /routes/api.js
const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const seedController = require("../controllers/seedController");
const { listarMissoes } = require("../controllers/missoes");
const respostasController = require("../controllers/respostasController");

// Health
router.get("/ping", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Missões
router.get("/missoes", listarMissoes);

// Dashboard
router.post("/respostas", respostasController.criarResposta);
router.get("/ranking", respostasController.listarRanking);

// Admin
router.post("/admin/drop-tables", adminController.dropInvalidTables);

router.post(
  "/admin/seed",
  (req, res, next) => {
    console.log("ROTA SEED CHAMADA");
    next();
  },
  seedController.executarSeeds
);

module.exports = router;