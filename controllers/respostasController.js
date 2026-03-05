// /controllers/respostasController.js

const { sequelize } = require("../models"); // ajuste se seu caminho for diferente

function calcularPontos(acoes) {
  return acoes.length * 10;
}

exports.criarResposta = async (req, res) => {
  try {

    const { nome, serie, missaoId, acoes } = req.body;

    if (!nome || !serie || !missaoId || !Array.isArray(acoes) || !acoes.length) {
      return res.status(400).json({ error: "Dados inválidos." });
    }

    const pontos = calcularPontos(acoes);

    await sequelize.query(
      `
      INSERT INTO respostas
      (nome, serie, missao_id, acoes_json, pontos)
      VALUES (?, ?, ?, ?, ?)
      `,
      {
        replacements: [
          nome,
          serie,
          Number(missaoId),
          JSON.stringify(acoes),
          pontos
        ]
      }
    );

    res.json({
      ok: true,
      pontos
    });

  } catch (err) {

    console.error("Erro ao registrar resposta:", err);

    res.status(500).json({
      error: "Erro ao registrar resposta."
    });
  }
};

exports.listarRanking = async (req, res) => {
  try {

    const [rows] = await sequelize.query(`
      SELECT
        id,
        nome,
        serie,
        missao_id,
        pontos
      FROM respostas
      ORDER BY pontos DESC
      LIMIT 50
    `);

    const ranking = rows.map((r, i) => ({
      posicao: i + 1,
      ...r
    }));

    res.json(ranking);

  } catch (err) {

    console.error("Erro ao carregar ranking:", err);

    res.status(500).json({
      error: "Erro ao carregar ranking"
    });
  }
};