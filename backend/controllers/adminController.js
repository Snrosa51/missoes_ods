const sequelize = require("../config/db");

module.exports.dropInvalidTables = async (req, res) => {
  try {
    console.log("🔨 Solicitado DROP TABLE das tabelas inválidas...");

    const sql = `
      DROP TABLE IF EXISTS Acaos;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS Missaos;
    `;

    await sequelize.query(sql);

    console.log("✅ Tabelas inválidas removidas com sucesso.");

    return res.send("✅ Tabelas antigas removidas do banco MySQL!");
  } catch (err) {
    console.error("❌ ERRO ao remover tabelas:", err);
    return res.status(500).send("Erro ao executar DROP TABLE.");
  }
};
