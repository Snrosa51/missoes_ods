// backend/seed/seedMissoes.js

const Missao = require('../models/missao');

module.exports = async () => {
  console.log("Rodando seed das missões...");

  // Lista completa das missões ODS
  const missoes = [
    { titulo: "ODS 1 - Erradicação da Pobreza", descricao: "Atividades para reduzir a pobreza extrema." },
    { titulo: "ODS 2 - Fome Zero e Agricultura Sustentável", descricao: "Ações para segurança alimentar." },
    { titulo: "ODS 3 - Saúde e Bem-Estar", descricao: "Missões para promover saúde física e mental." },
    { titulo: "ODS 4 - Educação de Qualidade", descricao: "Tarefas para incentivar educação inclusiva." },
    { titulo: "ODS 5 - Igualdade de Gênero", descricao: "Ações que promovem equidade e combate à discriminação." },
    { titulo: "ODS 6 - Água Potável e Saneamento", descricao: "Missões sobre preservação da água." },
    { titulo: "ODS 7 - Energia Limpa e Acessível", descricao: "Tarefas sobre uso eficiente de energia." },
    { titulo: "ODS 8 - Trabalho Decente e Crescimento Econômico", descricao: "Atividades voltadas para sustentabilidade econômica." },
    { titulo: "ODS 9 - Inovação e Infraestrutura", descricao: "Projetos de criatividade e desenvolvimento tecnológico." },
    { titulo: "ODS 10 - Redução das Desigualdades", descricao: "Ações para inclusão e igualdade social." },
    { titulo: "ODS 11 - Cidades e Comunidades Sustentáveis", descricao: "Missões sobre melhoria urbana." },
    { titulo: "ODS 12 - Consumo e Produção Responsáveis", descricao: "Atividades sobre sustentabilidade ambiental." },
    { titulo: "ODS 13 - Ação Contra a Mudança Global do Clima", descricao: "Tarefas relacionadas a preservação do clima." },
    { titulo: "ODS 14 - Vida na Água", descricao: "Ações ligadas à proteção dos mares e rios." },
    { titulo: "ODS 15 - Vida Terrestre", descricao: "Tarefas sobre preservação de florestas e fauna." },
    { titulo: "ODS 16 - Paz, Justiça e Instituições Eficazes", descricao: "Atividades sobre convivência e cidadania." },
    { titulo: "ODS 17 - Parcerias e Meios de Implementação", descricao: "Ações de cooperação e trabalho conjunto." }
  ];

  // Evita duplicações — Railway reinicia containers
  for (const m of missoes) {
    const existe = await Missao.findOne({ where: { titulo: m.titulo } });
    if (!existe) {
      await Missao.create(m);
    }
  }

  console.log("Seed finalizado com sucesso.");
};
