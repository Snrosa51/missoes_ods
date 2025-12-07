require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./config/db");

// Rotas da API
const apiRoutes = require("./routes/api");

// Seeds (agora manuais)
const seedMissoes = require("./seed/seedMissoes");
const seedAcoes = require("./seed/seedAcoes");

app.use(cors());
app.use(express.json());

// Rotas principais
app.use("/api", apiRoutes);

// Porta dinâmica do Railway
const PORT = process.env.PORT || 8080;

async function start() {
  try {
    console.log("🔗 Usando DATABASE_URL");
    console.log("🔗 Testando conexão...");

    await sequelize.authenticate();
    console.log("✅ Banco conectado.");

    console.log("🔄 Sincronizando modelos...");
    await sequelize.sync(); // sem force, sem alter
    console.log("✅ Modelos sincronizados.");

    // 🚫 SEM SEEDS AUTOMÁTICOS AQUI!

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });

  } catch (error) {
    console.error("❌ ERRO FATAL:", error);
    process.exit(1);
  }
}

// Iniciar servidor
start();

/* 
=========================================================
🟦 ENDPOINT MANUAL PARA RODAR SEEDS
=========================================================
*/
app.post("/admin/seed", async (req, res) => {
  try {
    console.log("🌱 Executando SEED manual...");

    await seedMissoes();
    await seedAcoes();

    res.json({ ok: true, mensagem: "Seeds executados com sucesso." });

  } catch (err) {
    console.error("❌ ERRO AO RODAR SEED:", err);
    res.status(500).json({ erro: "Falha ao rodar seeds." });
  }
});
