// controllers/respostasController.js
const { Resposta, Missao } = require("../models");

function calcularPontos(acoes) {
  return Array.isArray(acoes) ? acoes.length * 10 : 0;
}

async function criarResposta(req, res) {
  try {
    const { nome, serie, missaoId, acoes, pontos } = req.body;

    if (!nome || !serie || !missaoId || !Array.isArray(acoes) || !acoes.length) {
      return res.status(400).json({
        error: "Dados inválidos. Envie nome, serie, missaoId e acoes."
      });
    }

    const missao = await Missao.findByPk(Number(missaoId));
    if (!missao) {
      return res.status(404).json({ error: "Missão não encontrada." });
    }

    const pontosCalculados = Number(pontos) || calcularPontos(acoes);

    const resposta = await Resposta.create({
      nome,
      serie,
      missao_id: Number(missaoId),
      acoes_json: acoes,
      pontos: pontosCalculados,
    });

    return res.json({
      ok: true,
      id: resposta.id,
      pontos: pontosCalculados,
    });
  } catch (err) {
    console.error("Erro ao registrar resposta:", err);
    return res.status(500).json({
      error: "Erro ao registrar resposta."
    });
  }
}

async function listarRanking(req, res) {
  try {
    const respostas = await Resposta.findAll({
      order: [
        ["pontos", "DESC"],
        ["id", "ASC"],
      ],
    });

    const lista = respostas.map((item, index) => ({
      posicao: index + 1,
      id: item.id,
      nome: item.nome,
      serie: item.serie,
      missao_id: item.missao_id,
      pontos: item.pontos,
    }));

    return res.json(lista);
  } catch (err) {
    console.error("Erro ao carregar ranking:", err);
    return res.status(500).json({
      error: "Erro ao carregar ranking."
    });
  }
}

module.exports = {
  criarResposta,
  listarRanking,
};