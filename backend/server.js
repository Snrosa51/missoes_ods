// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sequelize, Resposta } = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const PONTOS_POR_ACAO = Number(process.env.PONTOS_POR_ACAO || 10);

// Rota raiz – teste rápido
app.get('/', (req, res) => {
  res.send('API ODS Missões ativa');
});

/**
 * POST /api/respostas
 * body: { nome, serie, acoes: ["D1","D2",...] }
 * calcula pontos e grava no banco
 */
app.post('/api/respostas', async (req, res) => {
  try {
    const { nome, serie, acoes } = req.body;

    if (!nome || !serie || !Array.isArray(acoes) || acoes.length === 0) {
      return res.status(400).json({ error: 'nome, serie e acoes são obrigatórios.' });
    }

    const pontos = acoes.length * PONTOS_POR_ACAO;

    const resposta = await Resposta.create({
      nome,
      serie,
      acoesJson: acoes,
      pontos,
    });

    return res.json({
      id: resposta.id,
      nome: resposta.nome,
      serie: resposta.serie,
      pontos: resposta.pontos,
    });
  } catch (err) {
    console.error('Erro em POST /api/respostas', err);
    res.status(500).json({ error: 'Erro ao registrar resposta.' });
  }
});

/**
 * GET /api/ranking
 * devolve lista ordenada por pontos desc, depois por createdAt asc
 */
app.get('/api/ranking', async (req, res) => {
  try {
    const lista = await Resposta.findAll({
      order: [
        ['pontos', 'DESC'],
        ['createdAt', 'ASC'],
      ],
      limit: 100,
    });

    const plain = lista.map((r) => ({
      id: r.id,
      nome: r.nome,
      serie: r.serie,
      pontos: r.pontos,
    }));

    res.json(plain);
  } catch (err) {
    console.error('Erro em GET /api/ranking', err);
    res.status(500).json({ error: 'Erro ao carregar ranking.' });
  }
});

const start = async () => {
  try {
    console.log('🔗 Testando conexão com o banco...');
    await sequelize.authenticate();
    console.log('✅ Banco conectado.');

    console.log('🔄 Sincronizando tabela respostas...');
    await sequelize.sync(); // sem force, sem alter
    console.log('✅ Tabelas OK.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor ouvindo na porta ${PORT}`);
    });
  } catch (err) {
    console.error('❌ ERRO FATAL AO INICIAR O SERVIDOR:', err);
    process.exit(1);
  }
};

start();

