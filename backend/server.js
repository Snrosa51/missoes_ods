// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");

const seedMissoes = require("./seed/seedMissoes");
const seedAcoes   = require("./seed/seedAcoes");
const apiRoutes   = require("./routes/api");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 8080;

async function start() {
  try {
    console.log("🔗 Testando conexão com o banco...");
    await sequelize.authenticate();
    console.log("✅ Banco conectado.");

    console.log("⚠ APAGANDO E RECRIANDO TODAS AS TABELAS (force:true)...");
    await sequelize.sync({ force: true });
    console.log("✅ Tabelas recriadas do zero.");

    console.log("🌱 Seed de Missões...");
    await seedMissoes();

    console.log("🌱 Seed de Ações...");
    await seedAcoes();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.error("❌ ERRO FATAL AO INICIAR O SERVIDOR:", err);
    process.exit(1);
  }
}

start();
