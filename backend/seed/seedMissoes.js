// backend/seed/seedMissoes.js
const Missao = require('../models/missao');

module.exports = async () => {
  console.log("Rodando seed das missões (ODS 3 e ODS 4)...");

  const missoes = [
    {
      titulo: "ODS 3 – Saúde e Bem-estar",
      descricao: "Promover saúde e bem-estar para todos.",
    },
    {
      titulo: "ODS 4 – Educação de Qualidade",
      descricao: "Garantir educação de qualidade, inclusiva e equitativa.",
    },
  ];

  for (const m of missoes) {
    const existe = await Missao.findOne({ where: { titulo: m.titulo } });
    if (!existe) {
      await Missao.create(m);
    }
  }

  console.log("Seed de Missões concluído.");
};
