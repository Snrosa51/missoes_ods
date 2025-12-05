const { Sequelize } = require('sequelize');
require('dotenv').config();

// Railway MYSQL_* variables
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE,      // database
  process.env.MYSQLUSER,          // username
  process.env.MYSQLPASSWORD,      // password
  {
    host: process.env.MYSQLHOST,  // host (private network)
    port: process.env.MYSQLPORT,  // 3306 usually
    dialect: 'mysql',
    logging: false
  }
);

module.exports = sequelize;
