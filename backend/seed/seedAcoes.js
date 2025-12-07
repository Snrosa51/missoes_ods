// backend/seed/seedAcoes.js
const Missao = require('../models/missao');
const Acao   = require('../models/acao');

module.exports = async () => {
  console.log("Rodando seed das ações...");

  const acoesPorODS = {
    "ODS 3 – Saúde e Bem-estar": [
      "Organizar campanha de vacinação",
      "Promover atividades físicas na escola",
    ],
    "ODS 4 – Educação de Qualidade": [
      "Criar grupo de reforço escolar",
      "Organizar feira de ciências",
    ],
  };

  for (const tituloMissao of Object.keys(acoesPorODS)) {
    const missao = await Missao.findOne({ where: { titulo: tituloMissao } });
    if (!missao) continue;

    for (const descricao of acoesPorODS[tituloMissao]) {
      const existe = await Acao.findOne({
        where: { descricao, missaoId: missao.id },
      });

      if (!existe) {
        await Acao.create({
          descricao,
          missaoId: missao.id,
        });
      }
    }
  }

  console.log("Seed de Ações concluído.");
};

