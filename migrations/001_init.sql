-- Migration 001: Initial schema
-- ERP database tables

CREATE TABLE IF NOT EXISTS empresa (
  idempresa SERIAL       PRIMARY KEY,
  nmfantasia VARCHAR(255) NOT NULL,
  cnpj      VARCHAR(18)  NOT NULL UNIQUE,
  isativo   SMALLINT     NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_empresa_isativo ON empresa (isativo);

CREATE TABLE IF NOT EXISTS usuario_acesso (
  idusuario SERIAL        PRIMARY KEY,
  login     VARCHAR(100)  NOT NULL UNIQUE,
  nmusuario VARCHAR(255)  NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  isativo   SMALLINT      NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usuario_acesso_login ON usuario_acesso (login);
CREATE INDEX IF NOT EXISTS idx_usuario_acesso_isativo ON usuario_acesso (isativo);

CREATE TABLE IF NOT EXISTS andar (
  idandar   SERIAL       PRIMARY KEY,
  idempresa INTEGER      NOT NULL REFERENCES empresa (idempresa) ON DELETE CASCADE,
  cdandar   VARCHAR(50)  NOT NULL,
  nmandar   VARCHAR(255) NOT NULL,
  isativo   SMALLINT     NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (idempresa, cdandar)
);

CREATE INDEX IF NOT EXISTS idx_andar_idempresa ON andar (idempresa);
CREATE INDEX IF NOT EXISTS idx_andar_isativo   ON andar (isativo);

INSERT INTO empresa (nmfantasia, cnpj, isativo)
VALUES
  ('Empresa Matriz', '12345678000199', 1),
  ('Empresa Filial', '98765432000155', 1)
ON CONFLICT (cnpj) DO NOTHING;

INSERT INTO usuario_acesso (login, nmusuario, senha_hash, isativo)
VALUES
  ('admin', 'Administrador', '$2b$10$yBwKKmb2Q7aJwWN7CjXW9uxv.DGtkBazA7.Fd2wMADt09KDMxA1Xa', 1)
ON CONFLICT (login) DO NOTHING;

INSERT INTO andar (idempresa, cdandar, nmandar, isativo)
SELECT e.idempresa, seed.cdandar, seed.nmandar, seed.isativo
FROM (
  VALUES
    ('12345678000199', 'TER', 'Terreo', 1),
    ('12345678000199', 'ADM', 'Administrativo', 1),
    ('98765432000155', 'EST', 'Estoque', 1)
) AS seed(cnpj, cdandar, nmandar, isativo)
JOIN empresa e ON e.cnpj = seed.cnpj
ON CONFLICT (idempresa, cdandar) DO NOTHING;

