const sequelize = require("../config/db");
const Missao = require("./missao");
const Acao = require("./acao");

Missao.hasMany(Acao, { foreignKey: "missaoId", onDelete: "CASCADE" });
Acao.belongsTo(Missao, { foreignKey: "missaoId" });

module.exports = { sequelize, Missao, Acao };
