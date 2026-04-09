-- Migration 004: Edificacao and UH Classificacao

CREATE TABLE IF NOT EXISTS edificacao (
  idedificacao SERIAL       PRIMARY KEY,
  idempresa    INTEGER      NOT NULL REFERENCES empresa (idempresa) ON DELETE CASCADE,
  cdedificacao VARCHAR(50)  NOT NULL,
  nmedificacao VARCHAR(255) NOT NULL,
  isativo      SMALLINT     NOT NULL DEFAULT 1,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE (idempresa, cdedificacao)
);

CREATE INDEX IF NOT EXISTS idx_edificacao_idempresa ON edificacao (idempresa);
CREATE INDEX IF NOT EXISTS idx_edificacao_isativo   ON edificacao (isativo);

CREATE TABLE IF NOT EXISTS uhclassificacao (
  iduhclassificacao SERIAL       PRIMARY KEY,
  idempresa         INTEGER      NOT NULL REFERENCES empresa (idempresa) ON DELETE CASCADE,
  dsidentificador   VARCHAR(50)  NOT NULL,
  nmclassificacao   VARCHAR(255) NOT NULL,
  isativo           SMALLINT     NOT NULL DEFAULT 1,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE (idempresa, dsidentificador)
);

CREATE INDEX IF NOT EXISTS idx_uhclassificacao_idempresa ON uhclassificacao (idempresa);
CREATE INDEX IF NOT EXISTS idx_uhclassificacao_isativo   ON uhclassificacao (isativo);

INSERT INTO edificacao (idempresa, cdedificacao, nmedificacao, isativo)
SELECT e.idempresa, seed.cdedificacao, seed.nmedificacao, seed.isativo
FROM (
  VALUES
    ('12345678000199', 'PRIN', 'Edificação Principal', 1),
    ('12345678000199', 'ANEX', 'Anexo Leste',          1),
    ('12345678000199', 'CHAL', 'Bloco de Chalés',      1),
    ('12345678000199', 'SPA',  'SPA e Lazer',          1),
    ('98765432000155', 'PRIN', 'Torre Principal',      1),
    ('98765432000155', 'RES',  'Residencial Oeste',    0)
) AS seed(cnpj, cdedificacao, nmedificacao, isativo)
JOIN empresa e ON e.cnpj = seed.cnpj
ON CONFLICT (idempresa, cdedificacao) DO NOTHING;

INSERT INTO uhclassificacao (idempresa, dsidentificador, nmclassificacao, isativo)
SELECT e.idempresa, seed.dsidentificador, seed.nmclassificacao, seed.isativo
FROM (
  VALUES
    ('12345678000199', 'STD', 'Standard',     1),
    ('12345678000199', 'SUP', 'Superior',     1),
    ('12345678000199', 'LXO', 'Luxo',         1),
    ('12345678000199', 'MST', 'Master',       1),
    ('12345678000199', 'PRS', 'Presidential', 0),
    ('98765432000155', 'STD', 'Standard',     1),
    ('98765432000155', 'SUP', 'Superior',     1)
) AS seed(cnpj, dsidentificador, nmclassificacao, isativo)
JOIN empresa e ON e.cnpj = seed.cnpj
ON CONFLICT (idempresa, dsidentificador) DO NOTHING;
