// backend/models/index.js
const sequelize = require('../config/db');

const Missao = require('./missao');
const Acao   = require('./acao');

// Uma Missão tem várias Ações
Missao.hasMany(Acao, {
  foreignKey: 'missaoId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Uma Ação pertence a uma Missão
Acao.belongsTo(Missao, {
  foreignKey: 'missaoId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = {
  sequelize,
  Missao,
  Acao,
};
