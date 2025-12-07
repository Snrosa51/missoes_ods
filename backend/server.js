// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const seedMissoes = require('./seed/seedMissoes');
const seedAcoes = require('./seed/seedAcoes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Rota raiz para teste rápido
app.get('/', (req, res) => {
  res.send('ODS Missões API ativo e rodando!');
});

// ===============================
// FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
// ===============================
const start = async () => {
  try {
    console.log('Testando conexão com o banco...');
    await sequelize.authenticate();
    console.log('Conexão OK.');

    console.log('Sincronizando modelos...');
    await sequelize.sync();
    console.log('Modelos sincronizados.');

    console.log('Fazendo seed das missões...');
    await seedMissoes();

    console.log('Fazendo seed das ações...');
    await seedAcoes();

    // ESSENCIAL PARA RAILWAY → NÃO USAR localhost
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.error('ERRO FATAL AO INICIAR O SERVIDOR:', err);
    process.exit(1); // marca como crashed no Railway para debug
  }
};

// Inicia a aplicação
start();
