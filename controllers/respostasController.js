const { Resposta, Missao } = require("../models");
const { Op } = require("sequelize");

const PONTOS_POR_ACAO = 10;

function normalizarTexto(valor) {
  return String(valor || "").trim().toLowerCase();
}

function hojeIntervalo() {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);

  const fim = new Date();
  fim.setHours(23, 59, 59, 999);

  return { inicio, fim };
}

function extrairIdsAcoes(acoes) {
  if (!Array.isArray(acoes)) return [];
  return acoes
    .map((a) => normalizarTexto(a?.id))
    .filter(Boolean);
}

async function criarResposta(req, res) {
  try {
    const { nome, serie, missaoId, acoes } = req.body;

    if (!nome || !serie || !missaoId || !Array.isArray(acoes) || !acoes.length) {
      return res.status(400).json({
        error: "Dados inválidos. Envie nome, serie, missaoId e acoes.",
      });
    }

    const nomeNormalizado = normalizarTexto(nome);
    const serieNormalizada = normalizarTexto(serie);
    const missaoIdNumero = Number(missaoId);

    if (!Number.isInteger(missaoIdNumero) || missaoIdNumero <= 0) {
      return res.status(400).json({
        error: "Missão inválida.",
      });
    }

    const missao = await Missao.findByPk(missaoIdNumero);
    if (!missao) {
      return res.status(404).json({ error: "Missão não encontrada." });
    }

    const idsAcoesRecebidas = extrairIdsAcoes(acoes);

    if (!idsAcoesRecebidas.length) {
      return res.status(400).json({
        error: "Nenhuma ação válida enviada.",
      });
    }

    const { inicio, fim } = hojeIntervalo();

    const respostasDoDia = await Resposta.findAll({
      where: {
        missao_id: missaoIdNumero,
        created_at: {
          [Op.between]: [inicio, fim],
        },
      },
      order: [["id", "ASC"]],
    });

    const respostasMesmoAlunoHoje = respostasDoDia.filter((r) => {
      return (
        normalizarTexto(r.nome) === nomeNormalizado &&
        normalizarTexto(r.serie) === serieNormalizada
      );
    });

    const acoesJaRegistradasHoje = new Set();

    for (const resposta of respostasMesmoAlunoHoje) {
      let acoesJson = resposta.acoes_json;

      if (typeof acoesJson === "string") {
        try {
          acoesJson = JSON.parse(acoesJson);
        } catch {
          acoesJson = [];
        }
      }

      if (!Array.isArray(acoesJson)) acoesJson = [];

      for (const acao of acoesJson) {
        const id = normalizarTexto(acao?.id);
        if (id) acoesJaRegistradasHoje.add(id);
      }
    }

    const acoesNovas = acoes.filter((acao) => {
      const id = normalizarTexto(acao?.id);
      return id && !acoesJaRegistradasHoje.has(id);
    });

    if (!acoesNovas.length) {
      return res.status(200).json({
        ok: true,
        pontos: 0,
        acoesConsideradas: 0,
        message:
          "As ações enviadas já foram registradas hoje para esta missão. Nenhum ponto foi somado.",
      });
    }

    const pontosCalculados = acoesNovas.length * PONTOS_POR_ACAO;

    const resposta = await Resposta.create({
      nome: String(nome).trim(),
      serie: String(serie).trim(),
      missao_id: missaoIdNumero,
      acoes_json: acoesNovas,
      pontos: pontosCalculados,
    });

    return res.status(201).json({
      ok: true,
      id: resposta.id,
      pontos: pontosCalculados,
      acoesConsideradas: acoesNovas.length,
      message: "Resposta registrada com sucesso.",
    });
  } catch (err) {
    console.error("Erro ao registrar resposta:", err);
    return res.status(500).json({
      error: "Erro ao registrar resposta.",
      detalhe: err.message,
    });
  }
}

async function listarRanking(req, res) {
  try {
    const respostas = await Resposta.findAll({
      order: [["id", "ASC"]],
    });

    // =========================================================
    // RANKING MENSAL (deixe comentado até a hora de ativar)
    //
    // const agora = new Date();
    // const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1, 0, 0, 0, 0);
    // const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59, 999);
    //
    // const respostas = await Resposta.findAll({
    //   where: {
    //     created_at: {
    //       [Op.between]: [inicioMes, fimMes],
    //     },
    //   },
    //   order: [["id", "ASC"]],
    // });
    // =========================================================

    const mapaRanking = new Map();

    for (const item of respostas) {
      const chave = `${normalizarTexto(item.nome)}|${normalizarTexto(item.serie)}`;

      if (!mapaRanking.has(chave)) {
        mapaRanking.set(chave, {
          nome: String(item.nome || "").trim(),
          serie: String(item.serie || "").trim(),
          pontos: 0,
          registros: 0,
          missoes: new Set(),
        });
      }

      const aluno = mapaRanking.get(chave);
      aluno.pontos += Number(item.pontos || 0);
      aluno.registros += 1;

      if (item.missao_id != null) {
        aluno.missoes.add(item.missao_id);
      }
    }

    const ranking = Array.from(mapaRanking.values())
      .map((aluno) => ({
        nome: aluno.nome,
        serie: aluno.serie,
        pontos: aluno.pontos,
        registros: aluno.registros,
        totalMissoes: aluno.missoes.size,
      }))
      .sort((a, b) => {
        if (b.pontos !== a.pontos) return b.pontos - a.pontos;
        if (b.registros !== a.registros) return b.registros - a.registros;
        return a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" });
      })
      .map((aluno, index) => ({
        posicao: index + 1,
        ...aluno,
      }));

    return res.json(ranking);
  } catch (err) {
    console.error("Erro ao carregar ranking:", err);
    return res.status(500).json({
      error: "Erro ao carregar ranking.",
      detalhe: err.message,
    });
  }
}

module.exports = {
  criarResposta,
  listarRanking,
};