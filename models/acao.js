// backend/models/acao.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const { FOREIGNKEYS } = require("sequelize/lib/query-types");

const Acao = sequelize.define(
  "Acao",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    acoes_json: {
      type: DataTypes.INTEGER,
      FOREIGNKEYS: missions(id),
      allowNull: false,
    },
  },
  {
    tableName: "acoes",
    timestamps: true,
  }
);

module.exports = Acao;
