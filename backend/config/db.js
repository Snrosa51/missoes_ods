// backend/config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Railway → URL completa
  const dbUrl = new URL(process.env.DATABASE_URL);

  sequelize = new Sequelize(
    dbUrl.pathname.substring(1),   // nome do DB
    dbUrl.username,                // usuário
    dbUrl.password,                // senha
    {
      host: dbUrl.hostname,
      port: dbUrl.port || 3306,
      dialect: "mysql",
      logging: false,
      dialectOptions: {
        ssl: false
      }
    }
  );

  console.log("Conectando ao MySQL via DATABASE_URL (Railway)");
} else {
  // Ambiente local
  sequelize = new Sequelize(
    process.env.DB_NAME || "ods_db",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: false,
    }
  );

  console.log("Conectando ao MySQL local (.env)");
}

module.exports = sequelize;
