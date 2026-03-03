// backend/seed/seedMissoes.js
const { Missao } = require("../models");

module.exports = async function seedMissoes() {
  console.log("🌱 Rodando seed das missões (ODS 3 e ODS 4)...");

  const dados = [
    {
      titulo: "ODS 3 – Saúde e Bem-estar",
      descricao: "Ações para cuidar da saúde física e mental.",
      odsNumero: 3,
    },
    {
      titulo: "ODS 4 – Educação de Qualidade",
      descricao: "Ações ligadas a estudo, leitura e ajuda aos colegas.",
      odsNumero: 4,
    },
  ];

  for (const m of dados) {
    const [registro, created] = await Missao.findOrCreate({
      where: { titulo: m.titulo },
      defaults: m,
    });

    console.log(
      `   • Missão "${registro.titulo}" ${created ? "criada" : "já existia"}`
    );
  }

  console.log("✅ Seed de Missões concluído.");
};
