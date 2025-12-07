const Missao = require("../models/missao");

module.exports = async () => {
  console.log("Rodando seed das missões (ODS 3 e ODS 4)...");

  const seeds = [
    {
      titulo: "ODS 3 – Saúde e Bem-estar",
      descricao: "Assegurar uma vida saudável e promover o bem-estar para todos.",
      odsNumero: 3
    },
    {
      titulo: "ODS 4 – Educação de Qualidade",
      descricao: "Assegurar educação inclusiva, equitativa e de qualidade.",
      odsNumero: 4
    }
  ];

  for (const s of seeds) {
    const existe = await Missao.findOne({ where: { titulo: s.titulo } });
    if (!existe) await Missao.create(s);
  }

  console.log("Seed de Missões concluído.");
};
