# Alinhamento de rotas/API + seeds para Railway MySQL

## 1) Checklist de deploy (Railway)

### Pré-requisitos
- Projeto Railway com:
  - serviço do **backend** (Node.js);
  - plugin/serviço de **MySQL**.
- Código do backend conectado ao repositório.

### Variáveis de ambiente (serviço backend)
- Obrigatórias:
  - `DATABASE_URL` (connection string do MySQL no Railway)
  - `PORT` (Railway injeta automaticamente; pode manter sem valor manual)
- Opcionais (recomendado para proteção):
  - `ADMIN_SEED_TOKEN`

### Build/Start
- Build command (se precisar definir):
  - `npm --prefix backend install`
- Start command:
  - `npm --prefix backend start`

### Exposição pública
- Garanta que o serviço backend tenha domínio público gerado no Railway.
- Exemplo de URL pública (substitua no checklist abaixo):
  - `https://seu-app.up.railway.app`

---

## 2) Checklist de smoke test (copiar e colar)

> Defina sua URL pública antes de testar.

```bash
export APP_URL="https://seu-app.up.railway.app"
```

### 2.1 Healthcheck raiz
```bash
curl -i "$APP_URL/"
```
Esperado: `200 OK` e texto `API Missões ODS ativa`.

### 2.2 Ping da API
```bash
curl -i "$APP_URL/api/ping"
```
Esperado: `200 OK` e JSON com `ok: true`.

### 2.3 Rodar seed (sem token)
Use este comando se **NÃO** configurou `ADMIN_SEED_TOKEN`:
```bash
curl -i -X POST "$APP_URL/api/admin/seed"
```
Esperado: `200 OK` e JSON com mensagem de sucesso.

### 2.4 Rodar seed (com token)
Use este comando se configurou `ADMIN_SEED_TOKEN`:
```bash
export SEED_TOKEN="SEU_TOKEN_AQUI"
curl -i -X POST "$APP_URL/api/admin/seed" \
  -H "x-seed-token: $SEED_TOKEN"
```
Esperado: `200 OK`.

Teste negativo (segurança):
```bash
curl -i -X POST "$APP_URL/api/admin/seed"
```
Esperado: `401 Unauthorized` quando token for obrigatório.

### 2.5 Validar retorno das missões + ações
```bash
curl -i "$APP_URL/api/missoes"
```
Esperado: `200 OK` e lista com missões ODS 3/4 e array `Acaos`.

### 2.6 (Opcional) Limpar tabelas legadas
```bash
curl -i "$APP_URL/api/admin/drop-tables"
```
Esperado: `200 OK` com confirmação de remoção de tabelas antigas.

---

## 3) Rotas relevantes
- `GET /` → healthcheck simples.
- `GET /api/ping` → status JSON.
- `GET /api/missoes` → retorna missões com ações (`Acaos`).
- `POST /api/admin/seed` → executa seeds JS.
  - Se `ADMIN_SEED_TOKEN` estiver definido, enviar header `x-seed-token`.
- `GET /api/admin/drop-tables` → remove tabelas legadas (`Acaos`, `users`, `Missaos`).

## 4) Seed SQL direto no MySQL (alternativa)
Se preferir alimentar banco diretamente no Railway sem chamar API, use:
- `backend/seed/railway_mysql_seed.sql`

Esse script:
- cria `missoes` e `acoes` se não existirem;
- mantém idempotência dos inserts;
- garante vínculo `acoes.missaoId -> missoes.id`.
