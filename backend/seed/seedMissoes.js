// backend/seed/seedMissoes.js
const { Missao } = require('../models/missao');

module.exports = async () => {
  console.log("Rodando seed das missões...");

  await Missao.bulkCreate([
    { titulo: "Missão 1", descricao: "Descrição da missão 1" },
    { titulo: "Missão 2", descricao: "Descrição da missão 2" }
  ]);

  console.log("Seed finalizado.");
};
