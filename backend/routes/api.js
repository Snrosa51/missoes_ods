const express = require("express");
const router = express.Router();
const missaoController = require("../controllers/missaoController");

router.get("/missoes", missaoController.listarMissoes);

module.exports = router;
