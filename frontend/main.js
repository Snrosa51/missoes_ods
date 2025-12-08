// frontend/main.js

// Detecta se está em localhost ou em produção
const API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080/api"
    : "https://missoesods-production.up.railway.app/api"; // troque o domínio se o seu Railway tiver outro nome

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

// 1) Carregar missões do backend
async function carregarMissoes() {
  try {
    selMissao.innerHTML = `<option value="">Carregando missões...</option>`;
    listaAcoesDiv.innerHTML = "";
    missaoDetalhesDiv.textContent = "";

    const resp = await fetch(`${API_BASE}/missoes`);
    if (!resp.ok) {
      throw new Error("Falha ao buscar /missoes: HTTP " + resp.status);
    }

    const dados = await resp.json();
    missoesCache = dados;

    if (!Array.isArray(missoesCache) || missoesCache.length === 0) {
      selMissao.innerHTML = `<option value="">Nenhuma missão disponível</option>`;
      return;
    }

    // Preenche o select
    selMissao.innerHTML = `<option value="">Selecione uma missão...</option>`;
    missoesCache.forEach((m, idx) => {
      const opt = document.createElement("option");
      opt.value = m.titulo;
      opt.textContent = m.titulo;
      selMissao.appendChild(opt);
    });

    statusRegistroDiv.textContent = "";
    statusRegistroDiv.className = "status ok";
    statusRegistroDiv.textContent = "Missoes carregadas com sucesso.";
  } catch (err) {
    console.error("Erro ao carregar missoes:", err);
    selMissao.innerHTML = `<option value="">Erro ao carregar missões</option>`;
    statusRegistroDiv.className = "status erro";
    statusRegistroDiv.textContent = "Erro ao carregar missões. Veja o console.";
  }
}

// 2) Renderizar ações ao mudar a missão
function atualizarAcoesDaMissao() {
  const tituloSelecionado = selMissao.value;
  listaAcoesDiv.innerHTML = "";
  missaoDetalhesDiv.textContent = "";

  if (!tituloSelecionado) {
    return;
  }

  const missao = missoesCache.find((m) => m.titulo === tituloSelecionado);
  if (!missao) {
    return;
  }

  // Mostra detalhes da missão
  missaoDetalhesDiv.innerHTML = `
    <strong>Descrição:</strong> ${missao.descricao || ""} 
    <span class="ods-badge">ODS ${missao.odsNumero || "?"}</span>
  `;

  // Renderiza checkboxes
  const acoes = missao.Acaos || [];
  if (!acoes.length) {
    listaAcoesDiv.innerHTML = "<em>Não há ações cadastradas para esta missão.</em>";
    return;
  }

  acoes.forEach((a, idx) => {
    const idCheckbox = `acao_${idx}`;
    const label = document.createElement("label");
    label.htmlFor = idCheckbox;

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = idCheckbox;
    cb.value = a.descricao;

    label.appendChild(cb);
    label.appendChild(document.createTextNode(a.descricao));
    listaAcoesDiv.appendChild(label);
  });
}

// 3) Registrar resposta do aluno
async function registrarAcao() {
  const nome = document.getElementById("nome").value.trim();
  const serie = document.getElementById("serie").value.trim();
  const missaoTitulo = selMissao.value;

  const checkboxes = listaAcoesDiv.querySelectorAll("input[type='checkbox']:checked");
  const acoes = Array.from(checkboxes).map((cb) => cb.value);

  statusRegistroDiv.className = "status";

  if (!nome || !serie || !missaoTitulo || acoes.length === 0) {
    statusRegistroDiv.className = "status erro";
    statusRegistroDiv.textContent =
      "Preencha nome, série, escolha uma missão e ao menos uma ação.";
    return;
  }

  try {
    const resp = await fetch(`${API_BASE}/respostas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        serie,
        missaoTitulo,
        acoes,
      }),
    });

    if (!resp.ok) {
      const erro = await resp.json().catch(() => ({}));
      throw new Error(erro.error || "Falha ao registrar resposta.");
    }

    const json = await resp.json();

    statusRegistroDiv.className = "status ok";
    statusRegistroDiv.textContent = `Resposta registrada! Você ganhou ${json.pontos} pontos.`;

    // Depois de registrar, recarrega ranking
    carregarRanking();
  } catch (err) {
    console.error("Erro ao registrar resposta:", err);
    statusRegistroDiv.className = "status erro";
    statusRegistroDiv.textContent =
      "Erro ao registrar resposta. Veja o console para detalhes.";
  }
}

// 4) Carregar ranking
async function carregarRanking() {
  try {
    rankingConteudoDiv.textContent = "Carregando ranking...";

    const resp = await fetch(`${API_BASE}/ranking`);
    if (!resp.ok) {
      throw new Error("Falha ao buscar /ranking: HTTP " + resp.status);
    }

    const lista = await resp.json();

    if (!Array.isArray(lista) || lista.length === 0) {
      rankingConteudoDiv.innerHTML = "<em>Nenhuma resposta registrada ainda.</em>";
      return;
    }

    let html = `
      <table>
        <thead>
          <tr>
            <th>Posição</th>
            <th>Nome</th>
            <th>Série</th>
            <th>Missão</th>
            <th>Pontos</th>
          </tr>
        </thead>
        <tbody>
    `;

    lista.forEach((item, index) => {
      const pos = item.posicao || index + 1;
      html += `
        <tr>
          <td>${pos}</td>
          <td>${item.nome}</td>
          <td>${item.serie}</td>
          <td>${item.missaoTitulo}</td>
          <td>${item.pontos}</td>
        </tr>
      `;
    });

    html += "</tbody></table>";
    rankingConteudoDiv.innerHTML = html;
  } catch (err) {
    console.error("Erro ao carregar ranking:", err);
    rankingConteudoDiv.innerHTML =
      "<span style='color:#c62828'>Erro ao carregar ranking. Veja o console.</span>";
  }
}

// 5) Listeners
selMissao.addEventListener("change", atualizarAcoesDaMissao);
btnRecarregarMissoes.addEventListener("click", carregarMissoes);
btnRegistrar.addEventListener("click", registrarAcao);
btnMostrarRanking.addEventListener("click", carregarRanking);

// 6) Inicialização automática ao abrir o dashboard
carregarMissoes();
carregarRanking();
