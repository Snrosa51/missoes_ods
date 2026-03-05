// backend/controllers/missoes.js
const { Missao } = require("../models");

async function listarMissoes(req, res) {
  try {
    const missoes = await Missao.findAll({
      order: [["id", "ASC"]],
    });

    res.json(missoes);
  } catch (err) {
    console.error("Erro ao listar missões:", err);
    res.status(500).json({ error: "Erro ao listar missões" });
  }
}

module.exports = { listarMissoes };

