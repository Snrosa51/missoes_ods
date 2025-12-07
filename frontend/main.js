// frontend/main.js
const API = "mysql://root:SENHA@mysql.railway.internal:3306/railway"
// UPDATE para produção

// dados estáticos de missoes/acoes (puxe do backend se preferir)
const missoes = {
  ODS3: { nome: "ODS 3 – Saúde e Bem-estar", acoes: [
    { id: "D1", nome: "Lavar as mãos regularmente (antes das refeições e após usar o banheiro)" },
    { id: "D2", nome: "Manter unhas limpas e cortadas" },
    { id: "D3", nome: "Usar garrafa de água individual e limpa" },
    { id: "D4", nome: "Higienizar os materiais escolares periodicamente" },
    { id: "D5", nome: "Evitar compartilhar objetos de uso pessoal (escova, copos, talheres)" }
  ]},
  ODS4: { nome: "ODS 4 – Educação de Qualidade", acoes: [
    { id: "A1", nome: "Jogar o lixo no lugar certo (papel, plástico, orgânico)" },
    { id: "A2", nome: "Manter a sala de aula limpa e organizada" },
    { id: "A3", nome: "Não riscar mesas, cadeiras ou paredes" }
  ]},
  ODS12: { nome: "ODS 12 – Consumo e Produção Responsáveis", acoes: [
    { id: "B1", nome: "Separar lixo reciclável e orgânico" },
    { id: "B2", nome: "Reaproveitar papel para rascunho" }
  ]}
};

const tokenKey = 'ods_token';

// monta checkboxes
function renderAcoes() {
  const cont = document.getElementById('acoesContainer');
  cont.innerHTML = '';
  Object.entries(missoes).forEach(([mid, m]) => {
    const title = document.createElement('div');
    title.className = 'font-semibold mt-2';
    title.textContent = m.nome;
    cont.appendChild(title);
    m.acoes.forEach(a => {
      const label = document.createElement('label');
      label.className = 'block';
      label.innerHTML = `<input type="checkbox" value="${a.id}" class="mr-2">${a.nome}`;
      cont.appendChild(label);
    });
  });
}

async function enviar() {
  const nome = document.getElementById('nome').value.trim();
  const serie = document.getElementById('serie').value;
  const checkboxes = document.querySelectorAll('#acoesContainer input[type=checkbox]');
  const acoes = Array.from(checkboxes).filter(c => c.checked).map(c => c.value);

  if (!nome || !serie || acoes.length===0) {
    alert('Preencha nome, série e escolha ao menos uma ação');
    return;
  }

  // se token disponível, adiciona Authorization header
  const token = localStorage.getItem(tokenKey);

  try {
    const resp = await fetch(`${API}/api/respostas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify({ nome, serie, acoes })
    });
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.error || 'Erro');
    }
    const data = await resp.json();
    document.getElementById('msg').textContent = `Registrado! pontos: ${data.pontos}`;
  } catch (err) {
    console.error(err);
    alert('Erro: ' + err.message);
  }
}

async function carregarRanking() {
  try {
    const resp = await fetch(`${API}/api/ranking`);
    const lista = await resp.json();
    const cont = document.getElementById('rankingList');
    if (!lista || lista.length===0) {
      cont.innerHTML = '<div>Sem dados</div>';
      return;
    }
    const html = lista.slice(0,10).map((r, i) => `<div class="py-1 border-b"><b>${i+1}.</b> ${r.nome} — ${r.serie} <span class="ml-2 text-green-600">${r.pontos}</span></div>`).join('');
    cont.innerHTML = html;
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar ranking');
  }
}

// Modal / auth UI
function openModal(title, htmlContent) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('formContainer').innerHTML = htmlContent;
  document.getElementById('modal').classList.remove('hidden');
  document.getElementById('modal').classList.add('flex');
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('modal').classList.remove('flex');
}

async function doRegister() {
  const name = document.getElementById('reg_name').value;
  const email = document.getElementById('reg_email').value;
  const pass = document.getElementById('reg_pass').value;

  try {
    const resp = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, email, password: pass })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Erro');
    alert('Registrado com sucesso. Faça login.');
    closeModal();
  } catch (err) {
    alert(err.message);
  }
}

async function doLogin() {
  const email = document.getElementById('login_email').value;
  const pass = document.getElementById('login_pass').value;

  try {
    const resp = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email, password: pass })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Erro');
    localStorage.setItem(tokenKey, data.token);
    alert('Logado com sucesso');
    closeModal();
  } catch (err) {
    alert(err.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderAcoes();
  document.getElementById('btnEnviar').addEventListener('click', enviar);
  document.getElementById('btnRanking').addEventListener('click', carregarRanking);
  document.getElementById('btnOpenLogin').addEventListener('click', () => {
    openModal('Login', `<label>Email:<input id="login_email" class="w-full border p-2"/></label>
      <label>Senha:<input id="login_pass" type="password" class="w-full border p-2 mt-2"/></label>
      <div class="mt-4 flex justify-end"><button onclick="doLogin()" class="bg-green-600 text-white px-3 py-1 rounded">Entrar</button></div>`);
  });
  document.getElementById('btnOpenRegister').addEventListener('click', () => {
    openModal('Registrar', `<label>Nome:<input id="reg_name" class="w-full border p-2"/></label>
      <label>Email:<input id="reg_email" class="w-full border p-2 mt-2"/></label>
      <label>Senha:<input id="reg_pass" type="password" class="w-full border p-2 mt-2"/></label>
      <div class="mt-4 flex justify-end"><button onclick="doRegister()" class="bg-blue-600 text-white px-3 py-1 rounded">Registrar</button></div>`);
  });
  document.getElementById('btnCloseModal').addEventListener('click', closeModal);
});
