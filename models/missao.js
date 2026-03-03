// backend/models/missao.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Missao = sequelize.define(
  "missao",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    odsNumero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "missions",
    timestamps: true,
  }
);

module.exports = Missao;
