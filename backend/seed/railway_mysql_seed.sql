-- Script SQL idempotente para Railway MySQL
-- Objetivo: criar estrutura mínima e popular ODS 3 e ODS 4.

CREATE TABLE IF NOT EXISTS missoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL UNIQUE,
  descricao TEXT NOT NULL,
  odsNumero INT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS acoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  descricao TEXT NOT NULL,
  missaoId INT NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_acoes_missao FOREIGN KEY (missaoId) REFERENCES missoes(id) ON DELETE CASCADE
);

INSERT INTO missoes (titulo, descricao, odsNumero)
VALUES
  ('ODS 3 – Saúde e Bem-estar', 'Ações para cuidar da saúde física e mental.', 3),
  ('ODS 4 – Educação de Qualidade', 'Ações ligadas a estudo, leitura e ajuda aos colegas.', 4)
ON DUPLICATE KEY UPDATE
  descricao = VALUES(descricao),
  odsNumero = VALUES(odsNumero);

INSERT INTO acoes (descricao, missaoId)
SELECT 'Beber água ao invés de refrigerante', m.id
FROM missoes m
WHERE m.titulo = 'ODS 3 – Saúde e Bem-estar'
  AND NOT EXISTS (
    SELECT 1 FROM acoes a WHERE a.descricao = 'Beber água ao invés de refrigerante' AND a.missaoId = m.id
  );

INSERT INTO acoes (descricao, missaoId)
SELECT 'Dormir ao menos 8 horas', m.id
FROM missoes m
WHERE m.titulo = 'ODS 3 – Saúde e Bem-estar'
  AND NOT EXISTS (
    SELECT 1 FROM acoes a WHERE a.descricao = 'Dormir ao menos 8 horas' AND a.missaoId = m.id
  );

INSERT INTO acoes (descricao, missaoId)
SELECT 'Praticar 30 minutos de atividade física', m.id
FROM missoes m
WHERE m.titulo = 'ODS 3 – Saúde e Bem-estar'
  AND NOT EXISTS (
    SELECT 1 FROM acoes a WHERE a.descricao = 'Praticar 30 minutos de atividade física' AND a.missaoId = m.id
  );

INSERT INTO acoes (descricao, missaoId)
SELECT 'Ler 10 páginas de um livro', m.id
FROM missoes m
WHERE m.titulo = 'ODS 4 – Educação de Qualidade'
  AND NOT EXISTS (
    SELECT 1 FROM acoes a WHERE a.descricao = 'Ler 10 páginas de um livro' AND a.missaoId = m.id
  );

INSERT INTO acoes (descricao, missaoId)
SELECT 'Ajudar um colega com a lição', m.id
FROM missoes m
WHERE m.titulo = 'ODS 4 – Educação de Qualidade'
  AND NOT EXISTS (
    SELECT 1 FROM acoes a WHERE a.descricao = 'Ajudar um colega com a lição' AND a.missaoId = m.id
  );

INSERT INTO acoes (descricao, missaoId)
SELECT 'Organizar o material escolar', m.id
FROM missoes m
WHERE m.titulo = 'ODS 4 – Educação de Qualidade'
  AND NOT EXISTS (
    SELECT 1 FROM acoes a WHERE a.descricao = 'Organizar o material escolar' AND a.missaoId = m.id
  );
