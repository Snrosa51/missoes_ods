// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");
const apiRoutes = require("../routes/api");

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// Healthcheck raiz
app.get("/", (req, res) => {
  res.send("API Missões ODS ativa");
});

// Rotas da API
app.use("./api", require("./routes/api"));


// 🔧 Rota manual para rodar seeds
app.get("./seed", async (req, res) => {
  try {
    console.log("🌱 Executando seeds via ./seed ...");
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

async function start() {
  try {
    console.log("🔗 Testando conexão com o banco...");
    await sequelize.authenticate();
    console.log("✅ Banco conectado.");

    console.log("🔄 Sincronizando modelos (sem alterar tabelas)...");
    await sequelize.sync(); // nada de force/alter aqui
    console.log("✅ Modelos sincronizados.");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor ouvindo na porta ${PORT}`);
    });

    server.on("error", (err) => {
      console.error("Erro ao iniciar servidor:", err);
    });
  } catch (err) {
    console.error("❌ ERRO FATAL AO INICIAR O SERVIDOR:", err);
    process.exit(1);
  }
}

start();
