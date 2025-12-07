// backend/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  console.log('🔗 Usando DATABASE_URL');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',      // Railway MySQL
    logging: false,
  });
} else {
  console.log('🔗 Usando variáveis locais do .env');
  const DB_HOST = process.env.DB_HOST || 'localhost';
  const DB_PORT = process.env.DB_PORT || '3306';
  const DB_USER = process.env.DB_USER || 'root';
  const DB_PASS = process.env.DB_PASSWORD || '';
  const DB_NAME = process.env.DB_NAME || 'ods_db';

  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false,
  });
}

module.exports = sequelize;

