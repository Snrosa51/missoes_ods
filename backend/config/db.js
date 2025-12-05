const { Sequelize } = require('sequelize');
require('dotenv').config();

// Se existir DATABASE_URL (Railway), usa ela.
// Caso contrário, usa as variáveis locais do .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
      }
    );

module.exports = sequelize;
