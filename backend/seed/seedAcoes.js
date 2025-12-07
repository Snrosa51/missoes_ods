const Acao = require("../models/acao");
const Missao = require("../models/missao");

module.exports = async () => {
  console.log("Rodando seed das ações...");

  const seeds = [
    {
      missao: "ODS 3 – Saúde e Bem-estar",
      acoes: [
        "Praticar atividade física regularmente",
        "Beber água todos os dias",
        "Dormir pelo menos 8 horas"
      ]
    },
    {
      missao: "ODS 4 – Educação de Qualidade",
      acoes: [
        "Ler 30 minutos por dia",
        "Ajudar um colega nas tarefas",
        "Participar ativamente nas aulas"
      ]
    }
  ];

  for (const grupo of seeds) {
    const missao = await Missao.findOne({ where: { titulo: grupo.missao } });
    if (!missao) continue;

    for (const texto of grupo.acoes) {
      const existe = await Acao.findOne({
        where: { descricao: texto, missaoId: missao.id }
      });

      if (!existe) {
        await Acao.create({ descricao: texto, missaoId: missao.id });
      }
    }
  }

  console.log("Seed de Ações concluído.");
};
