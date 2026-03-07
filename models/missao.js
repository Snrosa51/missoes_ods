// models/missao.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Missao = sequelize.define(
  "Missao",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    codigo: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    acoes_json: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "missions",
    timestamps: false,
  }
);

module.exports = Missao;