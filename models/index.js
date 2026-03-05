// backend/models/index.js
const sequelize = require("../config/db");
const Missao = require("./missao");
const Resposta = require("./resposta");


Missao.hasMany(Resposta, {
  foreignKey: { name: "missaoId", allowNull: false },
  onDelete: "CASCADE",
});
Resposta.belongsTo(Missao, {
  foreignKey: { name: "missaoId", allowNull: false },
});

module.exports = {
  sequelize,
  Missao,
  Resposta,
};
