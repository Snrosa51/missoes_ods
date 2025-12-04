// backend/models/resposta.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class Resposta extends Model {}

Resposta.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  serie: { type: DataTypes.STRING, allowNull: true },
  missaoId: { type: DataTypes.STRING, allowNull: true },
  missaoNome: { type: DataTypes.STRING, allowNull: true },
  acoesJson: { type: DataTypes.JSON, allowNull: true },
  pontos: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  sequelize,
  modelName: 'Resposta',
  tableName: 'respostas'
});

module.exports = Resposta;
