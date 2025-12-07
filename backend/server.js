require("dotenv").config();
const express = require("express");
const cors = require("cors");
const  sequelize  = require("./config/db");
const apiRoutes = require("./routes/api");
const { Missao, Acao } = require("./models");
// Seeds
const seedMissoes = require("./seed/seedMissoes");
const seedAcoes = require("./seed/seedAcoes");

const app = express();
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/api", apiRoutes);

// Porta para local e Railway
const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    console.log("🔗 Carregando configurações do banco...");

    // Testa a conexão
    console.log("🔄 Testando conexão com o banco...");
    await sequelize.authenticate();
    console.log("✅ Banco conectado.");

    // Sincronização SEM destruir tabelas
    console.log("🔄 Sincronizando modelos sem alterar tabelas...");
    await sequelize.sync({ alter: false });
    console.log("✅ Modelos sincronizados.");

    // Executa os seeds
    console.log("🌱 Seed de Missões...");
    await seedMissoes();

    console.log("🌱 Seed de Ações...");
    await seedAcoes();

    // Start do servidor
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.error("❌ ERRO FATAL AO INICIAR O SERVIDOR:", err);
    process.exit(1);
  }
};

start();
