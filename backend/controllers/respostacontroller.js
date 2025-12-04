// backend/controllers/respostaController.js
const { Resposta, User, Missao, Acao } = require('../models');
require('dotenv').config();

const PONTOS_POR_ACAO = parseInt(process.env.PONTOS_POR_ACAO || '10', 10);

const postResposta = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.nome || !payload.serie) return res.status(400).json({ error: 'nome e serie obrigatórios' });

    const acoes = Array.isArray(payload.acoes) ? payload.acoes : (payload.acoes ? [payload.acoes] : []);
    const pontos = acoes.length * PONTOS_POR_ACAO;

    const nova = await Resposta.create({
      userId: req.user ? req.user.id : null,
      nome: payload.nome,
      serie: payload.serie,
      missaoId: payload.missaoId || null,
      missaoNome: payload.missaoNome || null,
      acoesJson: acoes,
      pontos
    });

    res.json({ ok: true, pontos, id: nova.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro interno' });
  }
};

const getRanking = async (req, res) => {
  try {
    // Agregar por nome+serie
    const rows = await Resposta.findAll({
      attributes: [
        'nome', 'serie',
        [Resposta.sequelize.fn('SUM', Resposta.sequelize.col('pontos')), 'pontos']
      ],
      group: ['nome', 'serie'],
      order: [[Resposta.sequelize.literal('pontos'), 'DESC']],
      limit: 50
    });

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'erro interno' });
  }
};

module.exports = { postResposta, getRanking };
