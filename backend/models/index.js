// backend/models/index.js
const Missao = require("./missao");
const Acao = require("./acao");

// associações
Missao.hasMany(Acao, { foreignKey: "missaoId", onDelete: "CASCADE" });
Acao.belongsTo(Missao, { foreignKey: "missaoId" });

module.exports = { Missao, Acao };
