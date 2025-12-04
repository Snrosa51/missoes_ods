// backend/models/index.js
const sequelize = require('../config/db');
const User = require('./user');
const Resposta = require('./resposta');
const Missao = require('./missao');
const Acao = require('./acao');

// associações (simples)
User.hasMany(Resposta, { foreignKey: 'userId' });
Resposta.belongsTo(User, { foreignKey: 'userId' });

Missao.hasMany(Acao, { foreignKey: 'missaoId' });
Acao.belongsTo(Missao, { foreignKey: 'missaoId' });

module.exports = {
  sequelize,
  User,
  Resposta,
  Missao,
  Acao
};
