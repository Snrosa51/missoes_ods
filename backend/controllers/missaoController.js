const { Missao, Acao } = require("../models");

exports.listarMissoes = async (req, res) => {
  try {
    const missoes = await Missao.findAll({
      include: [{ model: Acao }]
    });

    res.json(missoes);
  } catch (err) {
    console.error("Erro ao listar missões:", err);
    res.status(500).json({ erro: "Erro ao listar missões" });
  }
};
