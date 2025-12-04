// backend/models/missao.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Missao extends Model {}

Missao.init({
  id: { type: DataTypes.STRING, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false }
}, {
  sequelize,
  modelName: 'Missao',
  tableName: 'missoes',
  timestamps: false
});

module.exports = Missao;
