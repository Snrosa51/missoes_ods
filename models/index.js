// models/index.js
const sequelize = require("../config/db");
const Missao = require("./missao");
const Resposta = require("./resposta");

Missao.hasMany(Resposta, {
  foreignKey: "missao_id",
  sourceKey: "id",
  onDelete: "CASCADE",
});

Resposta.belongsTo(Missao, {
  foreignKey: "missao_id",
  targetKey: "id",
});

module.exports = {
  sequelize,
  Missao,
  Resposta,
};