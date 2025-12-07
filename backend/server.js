// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const seedMissoes = require('./seed/seedMissoes');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.send('ODS Missões API ativo');
});

// Função de inicialização (IMPORTANTE PARA RAILWAY)
const start = async () => {
  try {
    console.log('Testando conexão com o banco...');
    await sequelize.authenticate();
    console.log('Conexão OK. Sincronizando modelos...');
    await sequelize.sync();
    console.log('DB sincronizado. Fazendo seed das missões...');

    if (seedMissoes) {
      await seedMissoes();
    }

    // 🔥 CORREÇÃO CRÍTICA PARA RAILWAY — NUNCA USAR localhost!
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.error('ERRO FATAL AO INICIAR O SERVIDOR:', err);
    process.exit(1);
  }
};

start();
