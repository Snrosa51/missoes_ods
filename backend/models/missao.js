// backend/models/missao.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Missao = sequelize.define('Missao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'missoes',
  timestamps: false,
});

module.exports = Missao;
