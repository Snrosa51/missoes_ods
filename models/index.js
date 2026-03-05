// backend/models/index.js
const sequelize = require("../config/db");
const Missao = require("./missao");
const Acao = require("./acao");
const Resposta = require("./resposta");

// Missão 1:N Respostas (se quiser relacionar)
Missao.hasMany(Acao, { foreignKey: "missaoId", as: "Acoes" });
Acao.belongsTo(Missao, { foreignKey: "missaoId", as: "Missao" });

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
