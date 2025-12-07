// backend/models/acao.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Acao = sequelize.define("Acao", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Acao;

