const Missao = require('../models/missao');

module.exports = async () => {
  console.log("Rodando seed das missões (ODS 3 e ODS 4)...");

  const missoes = [
    {
      titulo: "ODS 3 – Saúde e Bem-estar",
      descricao: "Promover saúde física e mental para todos."
    },
    {
      titulo: "ODS 4 – Educação de Qualidade",
      descricao: "Garantir educação inclusiva, equitativa e de qualidade."
    }
  ];

  for (const m of missoes) {
    const existente = await Missao.findOne({ where: { titulo: m.titulo } });

    if (!existente) {
      await Missao.create(m);
    }
  }

  console.log("Seed de missões concluído.");
};
