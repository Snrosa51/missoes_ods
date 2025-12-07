const API = "http://localhost:8080"; // UPDATE para produção

// ... missoes estático ...

async function enviar() {
  const nome = document.getElementById('nome').value.trim();
  const serie = document.getElementById('serie').value;
  const checkboxes = document.querySelectorAll('#acoesContainer input[type=checkbox]');
  const acoes = Array.from(checkboxes).filter(c => c.checked).map(c => c.value);

  // ...

  const resp = await fetch(`${API}/api/respostas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, serie, acoes })
  });

  // ...
}

async function carregarRanking() {
  const resp = await fetch(`${API}/api/ranking`);
  const lista = await resp.json();
  // monta o ranking na tela
}
