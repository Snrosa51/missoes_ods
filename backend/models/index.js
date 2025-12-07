// backend/models/index.js
const sequelize = require("../config/db");
const Missao = require("./missao");
const Acao = require("./acao");
const Resposta = require("./resposta");

// Missão 1:N Ações
Missao.hasMany(Acao, {
  as: "Acaos", // para bater com m.Acaos no dashboard
  foreignKey: { name: "missaoId", allowNull: false },
  onDelete: "CASCADE",
});
Acao.belongsTo(Missao, {
  as: "Missao",
  foreignKey: { name: "missaoId", allowNull: false },
});

// Missão 1:N Respostas (se quiser relacionar)
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
  Acao,
  Resposta,
};
