// backend/models/acao.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Acao extends Model {}

Acao.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  nome: { type: DataTypes.TEXT, allowNull: false },
  missaoId: { type: DataTypes.STRING, allowNull: false }
}, {
  sequelize,
  modelName: 'Acao',
  tableName: 'acoes',
  timestamps: false
});

module.exports = Acao;
