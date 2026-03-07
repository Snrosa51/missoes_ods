// models/resposta.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Resposta = sequelize.define(
  "Resposta",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    serie: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    missao_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    acoes_json: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    pontos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "respostas",
    timestamps: false,
  }
);

module.exports = Resposta;