const Missao = require('../models/missao');
const Acao = require('../models/acao');

module.exports = async () => {
  console.log("Rodando seed das ações (ODS 3 e 4)...");

  const acoesPorODS = {
    "ODS 3 – Saúde e Bem-estar": [
      "Organizar campanha de vacinação",
      "Criar grupo de caminhada na escola",
      "Promover ações de saúde mental"
    ],
    "ODS 4 – Educação de Qualidade": [
      "Criar grupo de leitura",
      "Desenvolver tutoria entre alunos",
      "Organizar feira do conhecimento"
    ]
  };

  for (const tituloMissao of Object.keys(acoesPorODS)) {
    const missao = await Missao.findOne({ where: { titulo: tituloMissao } });

    if (!missao) continue;

    for (const desc of acoesPorODS[tituloMissao]) {
      const existe = await Acao.findOne({ where: { descricao: desc, missaoId: missao.id } });

      if (!existe) {
        await Acao.create({
          descricao: desc,
          missaoId: missao.id
        });
      }
    }
  }

  console.log("Seed de ações concluído.");
};

