// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const apiRoutes = require('./routes/api');

const seedMissoes = require('./seed/seedMissoes');
const seedAcoes = require('./seed/seedAcoes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api', apiRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.send('API ODS 3 e 4 está funcionando.');
});

const start = async () => {
  try {
    console.log('🔄 Testando conexão com o banco...');
    await sequelize.authenticate();
    console.log('✅ Banco conectado com sucesso.');

    console.log('🔄 Sincronizando modelos...');
    await sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados.');

    console.log('🌱 Executando seed de Missões...');
    await seedMissoes();

    console.log('🌱 Executando seed de Ações...');
    await seedAcoes();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.error('❌ ERRO FATAL AO INICIAR O SERVIDOR:', err);
    process.exit(1);
  }
};

start();
