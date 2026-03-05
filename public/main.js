// public/main.js

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
    if (!resp.ok) throw new Error(`Erro ao carregar missões: ${resp.status}`);

    const dados = await resp.json();
    missoesCache = Array.isArray(dados) ? dados : [];

    if (missoesCache.length === 0) {
      selMissao.innerHTML = `<option value="">Nenhuma missão disponível</option>`;
      return;
    }

    // value = id (melhor), texto = nome
    selMissao.innerHTML = `<option value="">Selecione uma missão...</option>`;
    missoesCache.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = String(m.id);
      opt.textContent = `${m.codigo || ""} ${m.nome || ""}`.trim();
      selMissao.appendChild(opt);
    });

    statusRegistroDiv.className = "status ok";
    statusRegistroDiv.textContent = "Missões carregadas com sucesso.";
  } catch (err) {
    console.error("Erro ao carregar missoes:", err);
    selMissao.innerHTML = `<option value="">Erro ao carregar missões</option>`;
    statusRegistroDiv.className = "status erro";
    statusRegistroDiv.textContent = "Erro ao carregar missões. Veja o console.";
  }
}

// 2) Renderizar ações ao mudar a missão
function atualizarAcoesDaMissao() {
  const missaoIdSelecionado = selMissao.value;
  listaAcoesDiv.innerHTML = "";
  missaoDetalhesDiv.textContent = "";

  if (!missaoIdSelecionado) return;

  const missao = missoesCache.find((m) => String(m.id) === String(missaoIdSelecionado));
  if (!missao) return;

  // Detalhes (modo JSON: temos codigo/nome)
  missaoDetalhesDiv.innerHTML = `
    <strong>Missão:</strong> ${missao.nome || ""} 
    ${missao.codigo ? `<span class="ods-badge">${missao.codigo}</span>` : ""}
  `;

  // Ações vêm de acoes_json
  const acoes = Array.isArray(missao.acoes_json) ? missao.acoes_json : [];
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

    // value = ID da ação (D1, E3...)
    cb.value = a.id;

    label.appendChild(cb);
    label.appendChild(document.createTextNode(a.nome || a.id));
    listaAcoesDiv.appendChild(label);
  });
}

// 3) Registrar resposta do aluno
async function registrarAcao() {
  const nome = document.getElementById("nome").value.trim();
  const serie = document.getElementById("serie").value.trim();
  const missaoId = selMissao.value;

  const checkboxes = listaAcoesDiv.querySelectorAll("input[type='checkbox']:checked");

  // enviar como array de objetos {id} (igual ao seu print em respostas.acoes_json)
  const acoes = Array.from(checkboxes).map((cb) => ({ id: cb.value }));

  statusRegistroDiv.className = "status";

  if (!nome || !serie || !missaoId || acoes.length === 0) {
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
        missaoId: Number(missaoId),
        acoes,
      }),
    });

    if (!resp.ok) {
      const erro = await resp.json().catch(() => ({}));
      throw new Error(erro.error || "Falha ao registrar resposta.");
    }

    const json = await resp.json();

    statusRegistroDiv.className = "status ok";
    statusRegistroDiv.textContent = `Resposta registrada! Você ganhou ${json.pontos ?? "?"} pontos.`;

    carregarRanking();
  } catch (err) {
    console.error("Erro ao registrar resposta:", err);
    statusRegistroDiv.className = "status erro";
    statusRegistroDiv.textContent =
      "Erro ao registrar resposta. Veja o console para detalhes.";
  }
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
  try{
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


// 5) Listeners
selMissao.addEventListener("change", atualizarAcoesDaMissao);
btnRecarregarMissoes.addEventListener("click", carregarMissoes);
btnRegistrar.addEventListener("click", registrarAcao);
btnMostrarRanking.addEventListener("click", carregarRanking);

// 6) Inicialização automática ao abrir o dashboard
carregarMissoes();
carregarRanking();
