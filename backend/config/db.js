// backend/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// 🔥 1. Ambiente Railway → usa DATABASE_URL
if (process.env.DATABASE_URL) {
  console.log("Conectando via DATABASE_URL...", process.env.DATABASE_URL);

  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql",
    logging: false
  });

} else {
  // 🔥 2. Ambiente local → usa variáveis locais do .env
  console.log("Conectando ao banco local...");

  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: false
    }
  );
}

module.exports = sequelize;
