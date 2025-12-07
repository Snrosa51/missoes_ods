// backend/controllers/missoes.js
const { Missao, Acao } = require("../models");

async function listarMissoes(req, res) {
  try {
    const missoes = await Missao.findAll({
      include: [{ model: Acao, as: "Acaos" }],
      order: [
        ["odsNumero", "ASC"],
        ["id", "ASC"],
      ],
    });

    res.json(missoes);
  } catch (err) {
    console.error("Erro ao listar missões:", err);
    res.status(500).json({ error: "Erro ao listar missões" });
  }
}

module.exports = { listarMissoes };

