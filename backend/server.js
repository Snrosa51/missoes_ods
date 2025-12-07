// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, Missao, Acao } = require('./models');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// rota raiz
app.get('/', (req, res) => res.send('ODS Missões API ativo'));

// popula missoes se estiver vazio
const seedMissoes = async () => {
  const missoesData = [
    { id: 'ODS3', nome: 'ODS 3 – Saúde e Bem-estar' },
    { id: 'ODS4', nome: 'ODS 4 – Educação de Qualidade' },
    { id: 'ODS12', nome: 'ODS 12 – Consumo e Produção Responsáveis' }
  ];
  for (const m of missoesData) {
    await Missao.findOrCreate({ where: { id: m.id }, defaults: m });
  }
};

const start = async () => {
  try {
    console.log('Testando conexão com o banco...');
    await sequelize.authenticate();
    console.log('Conexão OK. Sincronizando modelos...');
    await sequelize.sync();
    console.log('DB sincronizado. Fazendo seed das missões...');
    await seedMissoes();
    app.listen(PORT, () =>
      console.log(`Servidor rodando em http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('ERRO FATAL AO INICIAR O SERVIDOR:', err);
    process.exit(1); // Railway marca como crashed, com log claro
  }
};

start();
