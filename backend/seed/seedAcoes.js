// backend/seed/seedAcoes.js

const Missao = require('../models/missao');
const Acao = require('../models/acao');

module.exports = async () => {
  console.log("Rodando seed das ações...");

  // Lista de ações por ODS
  const acoesPorODS = {
    1: [
      "Criar campanha de arrecadação de roupas",
      "Organizar doação de alimentos"
    ],
    2: [
      "Montar horta comunitária",
      "Promover oficina de compostagem"
    ],
    3: [
      "Realizar caminhada de saúde",
      "Campanha de combate ao sedentarismo"
    ],
    4: [
      "Organizar roda de leitura",
      "Oficina de reforço escolar"
    ],
    5: [
      "Evento de conscientização sobre igualdade",
      "Produzir cartazes educativos"
    ],
    6: [
      "Campanha de economia de água",
      "Mutirão de limpeza de rios"
    ],
    7: [
      "Palestra sobre energia solar",
      "Criar cartazes de consumo consciente"
    ],
    8: [
      "Feira de profissões",
      "Oficina de empreendedorismo"
    ],
    9: [
      "Oficina de robótica",
      "Projeto de construção de protótipos"
    ],
    10: [
      "Debate sobre inclusão social",
      "Campanha anti preconceito"
    ],
    11: [
      "Mutirão de plantio de árvores",
      "Mapeamento de áreas públicas"
    ],
    12: [
      "Campanha de reciclagem",
      "Desafio de lixo zero na escola"
    ],
    13: [
      "Projeto de economia de energia",
      "Campanha contra queimadas"
    ],
    14: [
      "Limpeza de praias ou rios",
      "Campanha sobre descarte de plástico"
    ],
    15: [
      "Cuidado com hortas escolares",
      "Ações sobre preservação da fauna"
    ],
    16: [
      "Mediação de conflitos entre estudantes",
      "Palestra sobre cidadania"
    ],
    17: [
      "Trabalho em grupos mistos",
      "Criação de parcerias entre turmas"
    ],
  };

  // Busca todas as missões
  const missoes = await Missao.findAll();

  // Para cada missão, gerar ações
  for (const missao of missoes) {
    const listaAcoes = acoesPorODS[missao.id];

    if (!listaAcoes) continue;

    for (const textoAcao of listaAcoes) {
      const existe = await Acao.findOne({
        where: { descricao: textoAcao, missaoId: missao.id }
      });

      if (!existe) {
        await Acao.create({
          descricao: textoAcao,
          missaoId: missao.id
        });
      }
    }
  }

  console.log("Seed de ações finalizado com sucesso.");
};
