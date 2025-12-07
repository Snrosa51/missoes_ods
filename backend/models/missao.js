// backend/models/missao.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Missao = sequelize.define("Missao", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  odsNumero: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Missao;

