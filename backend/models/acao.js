// backend/models/acao.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Acao = sequelize.define('Acao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  missaoId: {
    type: DataTypes.,
    allowNull: false,  // obrigatória
  },
}, {
  tableName: 'acoes',
  timestamps: false,
});

module.exports = Acao;
