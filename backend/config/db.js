// backend/config/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

// Conexão única usando DATABASE_URL do Railway
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
