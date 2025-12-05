// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
const { Missao, Acao } = require('./models'); // se realmente houver index.js


const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 4000;

const models = require('./models/index.js');

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// rota raiz
app.get('/', (req, res) => res.send('ODS Missões API ativo'));

// sincroniza models e popula missoes/acoes se estiver vazio
const seedMissoes = async () => {
  const missoesData = [
    { id: 'ODS3', nome: 'ODS 3 – Saúde e Bem-estar' },
    { id: 'ODS4', nome: 'ODS 4 – Educação de Qualidade' },
  ];
  for (const m of missoesData) {
    await Missao.findOrCreate({ where: { id: m.id }, defaults: m });
  }
  // NOTE: para as ações, você pode criar a lista completa similar à versão original
};

sequelize.sync().then(async () => {
  console.log('DB sincronizado');
  await seedMissoes();
  app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
}).catch(err => {
  console.error('Erro ao sincronizar DB:', err);
});
