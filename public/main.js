// public/main.js

const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080/api"
    : `${window.location.origin}/api`;

let missoesCache = [];

// Elementos da página
const selMissao = document.getElementById("missaoSelect");
const listaAcoesDiv = document.getElementById("listaAcoes");
const missaoDetalhesDiv = document.getElementById("missaoDetalhes");
const statusRegistroDiv = document.getElementById("statusRegistro");
const rankingConteudoDiv = document.getElementById("rankingConteudo");

const btnRecarregarMissoes = document.getElementById("btnRecarregarMissoes");
const btnRegistrar = document.getElementById("btnRegistrar");
const btnMostrarRanking = document.getElementById("btnMostrarRanking");

// Campos do formulário
const inputNome = document.getElementById("nome");
const inputSerie = document.getElementById("serie");

// Utilitários
function escapeHtml(valor) {
  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getMissaoById(id) {
  return missoesCache.find((m) => String(m.id) === String(id));
}

function calcularPontosFrontend(acoesSelecionadas) {
  // Regra simples: 10 pontos por ação marcada
  return Array.isArray(acoesSelecionadas) ? acoesSelecionadas.length * 10 : 0;
}

function limparAcoes() {
  listaAcoesDiv.innerHTML = "";
}

function setStatus(tipo, mensagem) {
  statusRegistroDiv.className = `status ${tipo}`.trim();
  statusRegistroDiv.textContent = mensagem;
}

// 1) Carregar missões do backend
async function carregarMissoes() {
  try {
    selMissao.innerHTML = `<option value="">Carregando missões...</option>`;
    limparAcoes();
    missaoDetalhesDiv.textContent = "";

    const resp = await fetch(`${API_BASE}/missoes`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!resp.ok) {
      throw new Error(`Erro ao carregar missões: HTTP ${resp.status}`);
    }

    const dados = await resp.json();
    missoesCache = Array.isArray(dados) ? dados : [];

    if (!missoesCache.length) {
      selMissao.innerHTML = `<option value="">Nenhuma missão disponível</option>`;
      setStatus("erro", "Nenhuma missão encontrada.");
      return;
    }

    selMissao.innerHTML = `<option value="">Selecione uma missão...</option>`;

    missoesCache.forEach((missao) => {
      const opt = document.createElement("option");
      opt.value = String(missao.id);
      opt.textContent = `${missao.codigo || ""} ${missao.nome || ""}`.trim();
      selMissao.appendChild(opt);
    });

    setStatus("ok", "Missões carregadas com sucesso.");
  } catch (err) {
    console.error("Erro ao carregar missões:", err);
    selMissao.innerHTML = `<option value="">Erro ao carregar missões</option>`;
    setStatus("erro", "Erro ao carregar missões. Veja o console.");
  }
}

// 2) Atualizar ações da missão selecionada
function atualizarAcoesDaMissao() {
  const missaoIdSelecionado = selMissao.value;
  limparAcoes();
  missaoDetalhesDiv.textContent = "";

  if (!missaoIdSelecionado) return;

  const missao = getMissaoById(missaoIdSelecionado);
  if (!missao) return;

  missaoDetalhesDiv.innerHTML = `
    <strong>Missão:</strong> ${escapeHtml(missao.nome || "")}
    ${missao.codigo ? `<span class="ods-badge">${escapeHtml(missao.codigo)}</span>` : ""}
  `;

  const acoes = Array.isArray(missao.acoes_json) ? missao.acoes_json : [];

  if (!acoes.length) {
    listaAcoesDiv.innerHTML = "<em>Não há ações cadastradas para esta missão.</em>";
    return;
  }

  acoes.forEach((acao, idx) => {
    const idCheckbox = `acao_${idx}_${acao.id || idx}`;

    const wrapper = document.createElement("label");
    wrapper.htmlFor = idCheckbox;
    wrapper.style.display = "block";
    wrapper.style.marginBottom = "8px";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = idCheckbox;
    cb.value = acao.id || "";
    cb.dataset.nome = acao.nome || "";

    wrapper.appendChild(cb);
    wrapper.appendChild(
      document.createTextNode(` ${acao.nome || acao.id || "Ação sem nome"}`)
    );

    listaAcoesDiv.appendChild(wrapper);
  });
}

// 3) Registrar ação
async function registrarAcao() {
  const nome = inputNome?.value?.trim() || "";
  const serie = inputSerie?.value?.trim() || "";
  const missaoId = selMissao.value;

  const checkboxesMarcados = listaAcoesDiv.querySelectorAll(
    "input[type='checkbox']:checked"
  );

  const acoes = Array.from(checkboxesMarcados).map((cb) => ({
    id: cb.value,
    nome: cb.dataset.nome || "",
  }));

  if (!nome || !serie || !missaoId || !acoes.length) {
    setStatus(
      "erro",
      "Preencha nome, série/turma, escolha uma missão e marque ao menos uma ação."
    );
    return;
  }

  const pontosPrevistos = calcularPontosFrontend(acoes);

  try {
    setStatus("ok", "Registrando ação...");

    const payload = {
      nome,
      serie,
      missaoId: Number(missaoId),
      acoes,
      pontos: pontosPrevistos,
    };

    const resp = await fetch(`${API_BASE}/respostas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      let detalhe = "";
      try {
        detalhe = await resp.text();
      } catch {
        detalhe = "";
      }
      throw new Error(`HTTP ${resp.status}${detalhe ? ` - ${detalhe}` : ""}`);
    }

    let json = {};
    try {
      json = await resp.json();
    } catch {
      json = {};
    }

    const pontosRecebidos =
      Number(json.pontos) || Number(json.pontosGanhos) || pontosPrevistos;

    setStatus(
      "ok",
      `Resposta registrada com sucesso! Você ganhou ${pontosRecebidos} pontos.`
    );

    // Limpa somente as ações marcadas
    checkboxesMarcados.forEach((cb) => {
      cb.checked = false;
    });

    // Atualiza ranking após registrar
    await carregarRanking();
  } catch (err) {
    console.error("Erro ao registrar resposta:", err);
    setStatus("erro", `Erro ao registrar resposta: ${err.message}`);
  }
}

// 4) Carregar ranking
async function carregarRanking() {
  try {
    rankingConteudoDiv.innerHTML = "Carregando ranking...";

    const resp = await fetch(`${API_BASE}/ranking`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!resp.ok) {
      let detalhe = "";
      try {
        detalhe = await resp.text();
      } catch {
        detalhe = "";
      }
      throw new Error(`HTTP ${resp.status}${detalhe ? ` - ${detalhe}` : ""}`);
    }

    const lista = await resp.json();

    if (!Array.isArray(lista) || !lista.length) {
      rankingConteudoDiv.innerHTML =
        "<em>Nenhum registro encontrado para o ranking.</em>";
      return;
    }

    let html = `
      <table>
        <thead>
          <tr>
            <th>Posição</th>
            <th>Nome</th>
            <th>Série / Turma</th>
            <th>Pontos</th>
            <th>Registros</th>
            <th>Missões</th>
          </tr>
        </thead>
        <tbody>
    `;

    lista.forEach((item, index) => {
      const posicao = item.posicao || index + 1;
      const nome = item.nome || "-";
      const serie = item.serie || "-";
      const pontos = Number(item.pontos || 0);
      const registros = Number(item.registros || 0);
      const totalMissoes = Number(item.totalMissoes || 0);

      html += `
        <tr>
          <td>${escapeHtml(posicao)}</td>
          <td>${escapeHtml(nome)}</td>
          <td>${escapeHtml(serie)}</td>
          <td><strong>${escapeHtml(pontos)}</strong></td>
          <td>${escapeHtml(registros)}</td>
          <td>${escapeHtml(totalMissoes)}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    rankingConteudoDiv.innerHTML = html;
  } catch (err) {
    console.error("Erro ao carregar ranking:", err);
    rankingConteudoDiv.innerHTML = `
      <span style="color:#c62828">
        Erro ao carregar ranking: ${escapeHtml(err.message)}
      </span>
    `;
  }
}
// 5) Eventos
if (selMissao) selMissao.addEventListener("change", atualizarAcoesDaMissao);
if (btnRecarregarMissoes) btnRecarregarMissoes.addEventListener("click", carregarMissoes);
if (btnRegistrar) btnRegistrar.addEventListener("click", registrarAcao);
if (btnMostrarRanking) btnMostrarRanking.addEventListener("click", carregarRanking);

// 6) Inicialização
(async function init() {
  await carregarMissoes();
})();