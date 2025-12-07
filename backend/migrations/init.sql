CREATE DATABASE IF NOT EXISTS ods_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE ods_db;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  createdAt DATETIME,
  updatedAt DATETIME
);

-- Tabela de Missões (uma missão é ODS 3 ou ODS 4)
CREATE TABLE IF NOT EXISTS missoes (
  id VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL
);

-- Tabela de Ações obrigatoriamente ligadas a uma Missão
CREATE TABLE IF NOT EXISTS acoes (
  id VARCHAR(50) PRIMARY KEY,
  nome TEXT NOT NULL,
  missaoId VARCHAR(50) NOT NULL,   -- AGORA É OBRIGATÓRIO
  FOREIGN KEY (missaoId) REFERENCES missoes(id)
    ON DELETE CASCADE             -- APAGOU MISSÃO → APAGA AÇÕES
    ON UPDATE CASCADE
);

-- Tabela de respostas
CREATE TABLE IF NOT EXISTS respostas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  nome VARCHAR(255) NOT NULL,
  serie VARCHAR(100),
  missaoId VARCHAR(50) NOT NULL,   -- também obrigatório
  missaoNome VARCHAR(255),
  acoesJson JSON,
  pontos INT DEFAULT 0,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (missaoId) REFERENCES missoes(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
