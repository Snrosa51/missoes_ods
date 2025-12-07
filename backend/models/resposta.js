// backend/models/resposta.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Resposta = sequelize.define('Resposta', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serie: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // guardamos as ações escolhidas como array de ids: ["D1", "D2", ...]
  acoesJson: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  pontos: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'respostas',
});

module.exports = Resposta;

