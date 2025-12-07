// server.js — versão final

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// 📌 Carrega Sequelize e modelos
const sequelize = require("./config/db");
const { Missao, Acao } = require("./models");

// 📌 Middlewares
app.use(cors());
app.use(express.json());

// 📌 Rotas da API
const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

// ------------------------------------------------------------------
// 🔧 ROTA MANUAL PARA EXECUTAR SEEDS (LOCAL OU RAILWAY)
// ------------------------------------------------------------------
app.get("/admin/seed", async (req, res) => {
  try {
    console.log("🌱 Executando seeds via /admin/seed ...");

    const seedMissoes = require("./seed/seedMissoes");
    const seedAcoes = require("./seed/seedAcoes");

    await seedMissoes();
    await seedAcoes();

    res.send("✅ Seeds executados com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao executar seeds:", err);
    res.status(500).send("Erro ao executar seeds.");
  }
});

// ------------------------------------------------------------------
// 🚀 INICIALIZAÇÃO DO SERVIDOR
// ------------------------------------------------------------------

const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    console.log("🔗 Usando DATABASE_URL");
    console.log("🔗 Carregando configurações do banco...");

    // Tenta conectar
    console.log("🔄 Testando conexão com o banco...");
    await sequelize.authenticate();
    console.log("✅ Banco conectado.");

    // Não altera e não apaga tabelas — seguro para produção
    console.log("🔄 Sincronizando modelos sem alterar tabelas...");
    await sequelize.sync({ alter: false });
    console.log("✅ Modelos sincronizados.");

    // Inicia servidor
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.error("❌ ERRO FATAL AO INICIAR O SERVIDOR:", err);
    process.exit(1);
  }
};

start();
