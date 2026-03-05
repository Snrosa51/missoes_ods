// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const { sequelize } = require("./models");
const apiRoutes = require("./routes/api");

const app = express();
const PORT = process.env.PORT || 8080;
  
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API Missões ODS ativa"));
app.get("/missions", (req, res) => res.redirect("/api/missoes"));

// Base da API
app.use("/api", apiRoutes);

// (Opcional) seed via rota simples
app.post("/seed", async (req, res) => {
  try {
    const seedController = require("./controllers/seedController");
    return seedController.executarSeeds(req, res);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Erro ao executar seeds.");
  }
});

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Porta ${PORT}`));
  } catch (err) {
    console.error("❌ ERRO FATAL:", err);
    process.exit(1);
  }
}

start();