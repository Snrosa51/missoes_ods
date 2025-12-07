// controllers/missaoController.js

const { Missao, Acao } = require('../models');

module.exports = {
  
  // GET /api/missoes
  getMissoes: async (req, res) => {
    try {
      const missoes = await Missao.findAll({
        include: [
          {
            model: Acao,
            attributes: ['id', 'descricao']
          }
        ],
        order: [
          ['id', 'ASC']
        ]
      });

      res.json(missoes);

    } catch (err) {
      console.error("Erro ao buscar missões:", err);
      res.status(500).json({ error: "Erro ao buscar missões" });
    }
  },

  // GET /api/missao/:id
  getMissaoById: async (req, res) => {
    try {
      const missao = await Missao.findByPk(req.params.id, {
        include: [{ model: Acao }]
      });

      if (!missao) {
        return res.status(404).json({ error: "Missão não encontrada" });
      }

      res.json(missao);

    } catch (err) {
      console.error("Erro ao buscar missão:", err);
      res.status(500).json({ error: "Erro ao buscar missão" });
    }
  },

  // POST /api/missao
  criarMissao: async (req, res) => {
    try {
      const { titulo, descricao } = req.body;

      const nova = await Missao.create({ titulo, descricao });

      res.status(201).json(nova);

    } catch (err) {
      console.error("Erro ao criar missão:", err);
      res.status(500).json({ error: "Erro ao criar missão" });
    }
  }
};
