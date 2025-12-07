require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const apiRoutes = require("./routes/api");
const seedMissoes = require("./seed/seedMissoes");
const seedAcoes = require("./seed/seedAcoes");

const app = express();
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 8080;

// Detectar ambiente Railway
const isProduction = process.env.RAILWAY_ENVIRONMENT !== undefined;

async function start() {
  try {
    console.log("🔗 Testando conexão com o banco...");
    await sequelize.authenticate();
    console.log("✅ Banco conectado.");

    if (!isProduction) {
      // 🚨 SOMENTE LOCAL — RECRIA TUDO
      console.log("⚠ APAGANDO E RECRIANDO TODAS AS TABELAS (force:true)...");
      await sequelize.sync({ alter: true });
      console.log("✅ Tabelas recriadas do zero.");

      console.log("🌱 Seed de Missões...");
      await seedMissoes();

      console.log("🌱 Seed de Ações...");
      await seedAcoes();
    } else {
      // 🚀 PRODUÇÃO (RAILWAY) — MANTÉM AS TABELAS
      console.log("🔄 Sincronizando modelos sem alterar tabelas...");
      await sequelize.sync();
      console.log("✅ Modelos sincronizados (sem force).");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.error("❌ ERRO FATAL AO INICIAR O SERVIDOR:", err);
    process.exit(1);
  }
}

start();
