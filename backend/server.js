// ================================
// 📌 Importações principais
// ================================
const express = require("express");
require("dotenv").config();
const { sequelize } = require("./models"); // Importa o sequelize já configurado
const path = require("path");

const apiRoutes = require("./routes/api");

// ================================
// 📌 Inicialização do app Express
// ================================
const app = express();
app.use(express.json());

// ================================
// 📌 Porta correta (Railway + Local)
// ================================
const PORT = process.env.PORT || 4000;

// ================================
// 📌 Testar conexão com o banco
// ================================
async function conectarBanco() {
  console.log("🔗 Carregando configurações do banco...");

  try {
    await sequelize.authenticate();
    console.log("✅ Banco conectado.");
  } catch (err) {
    console.error("❌ ERRO ao conectar banco:", err);
    process.exit(1);
  }
}

// ================================
// 📌 Sincronizar modelos (SEM alterar tabelas)
// ================================
async function sincronizarModelos() {
  try {
    console.log("🔄 Sincronizando modelos sem alterar tabelas...");
    await sequelize.sync(); // SEM force
    console.log("✅ Modelos sincronizados.");
  } catch (err) {
    console.error("❌ ERRO ao sincronizar modelos:", err);
    process.exit(1);
  }
}

// ================================
// 📌 Rotas principais
// ================================
app.use("/api", apiRoutes);

// ================================
// 📌 Rota MANUAL para rodar seeds
// ================================
app.get("/admin/seed", async (req, res) => {
  try {
    console.log("🌱 Executando seeds manualmente...");

    const seedMissoes = require("./seed/seedMissoes");
    const seedAcoes = require("./seed/seedAcoes");

    await seedMissoes();
    await seedAcoes();

    res.send("✅ Seeds executados com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao rodar seeds manualmente:", err);
    res.status(500).send("Erro ao executar seeds.");
  }
});

// ================================
// 📌 Iniciar servidor
// ================================
async function start() {
  await conectarBanco();
  await sincronizarModelos();

  // Evitar erro EADDRINUSE
  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });

  // Captura erros do servidor (como EADDRINUSE)
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Porta ${PORT} já está em uso!`);
      console.error("👉 Solução: matar processo antigo usando:");
      console.error("   netstat -ano | findstr :4000");
      console.error("   taskkill /PID NUMERO /F");
    } else {
      console.error("❌ Erro no servidor:", err);
    }
  });
}

start();
