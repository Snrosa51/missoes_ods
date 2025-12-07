// backend/config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

// 🔥 Garantir que DATABASE_URL existe
if (!process.env.DATABASE_URL) {
  console.error("❌ ERRO: DATABASE_URL não está definida!");
  process.exit(1);
}

console.log("🔍 DATABASE_URL carregada:", process.env.DATABASE_URL);

// Conexão única para Railway
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
