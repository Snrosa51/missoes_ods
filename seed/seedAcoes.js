// backend/seed/seedAcoes.js
const { Missao, Acao } = require("../models");

module.exports = async function seedAcoes() {
  console.log("🌱 Rodando seed das ações...");

  const mapa = {
    "ODS 3 – Saúde e Bem-estar": [
      "Beber água ao invés de refrigerante",
      "Dormir ao menos 8 horas",
      "Praticar 30 minutos de atividade física",
    ],
    "ODS 4 – Educação de Qualidade": [
      "Ler 10 páginas de um livro",
      "Ajudar um colega com a lição",
      "Organizar o material escolar",
    ],
  };

  for (const [tituloMissao, listaAcoes] of Object.entries(mapa)) {
    const missao = await Missao.findOne({ where: { titulo: tituloMissao } });
    if (!missao) {
      console.warn(`⚠ Missão não encontrada: ${tituloMissao}`);
      continue;
    }

    for (const descricao of listaAcoes) {
      await Acao.findOrCreate({
        where: { descricao, missaoId: missao.id },
        defaults: { descricao, missaoId: missao.id },
      });
    }
  }

  console.log("✅ Seed de Ações concluído.");
};
