const { Missao, Acao } = require('../models');

module.exports = {
  async getMissoes(req, res) {
    try {
      const missoes = await Missao.findAll({
        include: { model: Acao }
      });
      res.json(missoes);
    } catch (err) {
      console.error('Erro ao carregar missões:', err);
      res.status(500).json({ error: 'Erro ao carregar missões' });
    }
  },

  async getMissaoById(req, res) {
    try {
      const missao = await Missao.findByPk(req.params.id, {
        include: { model: Acao }
      });

      if (!missao) {
        return res.status(404).json({ error: "Missão não encontrada" });
      }

      res.json(missao);
    } catch (err) {
      console.error('Erro ao carregar missão:', err);
      res.status(500).json({ error: 'Erro ao carregar missão' });
    }
  }
};
