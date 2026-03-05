// backend/routes/api.js
const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const seedController = require("../controllers/seedController");
const { listarMissoes } = require("../controllers/missoes");

// Health
router.get("/ping", (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

// Missões
router.get("/missoes", listarMissoes);


// para debug e acompanhar nos logs do Railway
router.post("/admin/seed", (req,res,next)=>{
  console.log("ROTA SEED CHAMADA");
  next();
}, seedController.executarSeeds);

// Admin (melhor POST para ações destrutivas)
router.post("/admin/drop-tables", adminController.dropInvalidTables);
router.post("/admin/seed", seedController.executarSeeds);

module.exports = router;  