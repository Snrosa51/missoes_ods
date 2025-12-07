// backend/models/index.js
const sequelize = require('../config/db');
const Resposta = require('./resposta');

module.exports = {
  sequelize,
  Resposta,
};


