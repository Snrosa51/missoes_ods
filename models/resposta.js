// backend/models/resposta.js
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
    pontos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    missaoTitulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    acoesJson: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    tableName: "respostas",
    timestamps: true,
  }
);

module.exports = Resposta;

