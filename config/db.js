// backend/config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

if (process.env.DATABASE_URL) {
  console.log("🔗 Usando DATABASE_URL");
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "mysql12",
    logging: false,
  });
} else {
  console.log("🔗 Usando variáveis locais do .env (DB_*)");
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "mysql12",
      logging: false,
    }
  );
}

module.exports = sequelize;
