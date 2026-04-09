-- Migration 003: UH (Unidade Habitacional) schema

ALTER TABLE empresa
  ADD COLUMN IF NOT EXISTS dsabreviatura VARCHAR(20);

UPDATE empresa SET dsabreviatura = 'HT01' WHERE cnpj = '12345678000199';
UPDATE empresa SET dsabreviatura = 'HT02' WHERE cnpj = '98765432000155';

CREATE TABLE IF NOT EXISTS uh (
  iduh              SERIAL       PRIMARY KEY,
  idempresa         INTEGER      NOT NULL REFERENCES empresa (idempresa) ON DELETE CASCADE,
  cduh              VARCHAR(20)  NOT NULL,
  dsuh              VARCHAR(255) NOT NULL,
  iduhtipo          INTEGER      REFERENCES uhtipo (iduhtipo) ON DELETE SET NULL,
  nmandar           VARCHAR(100),
  nmedificacao      VARCHAR(100),
  qtquarto          SMALLINT     NOT NULL DEFAULT 1,
  iduhclassificacao SMALLINT     NOT NULL DEFAULT 1,
  iduhtipos_emp     INTEGER,
  isativo           SMALLINT     NOT NULL DEFAULT 1,
  isacessibilidade  SMALLINT     NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE (idempresa, cduh)
);

CREATE INDEX IF NOT EXISTS idx_uh_idempresa ON uh (idempresa);
CREATE INDEX IF NOT EXISTS idx_uh_iduhtipo  ON uh (iduhtipo);
CREATE INDEX IF NOT EXISTS idx_uh_isativo   ON uh (isativo);

-- Seed: 20 UHs empresa matriz (12345678000199)
INSERT INTO uh (idempresa, cduh, dsuh, iduhtipo, nmandar, nmedificacao, qtquarto, iduhclassificacao, isativo, isacessibilidade)
SELECT
  e.idempresa,
  seed.cduh,
  seed.dsuh,
  ut.iduhtipo,
  seed.nmandar,
  seed.nmedificacao,
  seed.qtquarto,
  seed.iduhclassificacao,
  seed.isativo,
  seed.isacessibilidade
FROM (VALUES
  ('UH001', 'Unidade 001', 'STD', 'Térreo',   'Torre A', 1, 1, 1, 1),
  ('UH002', 'Unidade 002', 'STD', 'Térreo',   'Torre A', 1, 1, 1, 0),
  ('UH003', 'Unidade 003', 'DBL', 'Térreo',   'Torre B', 2, 1, 1, 1),
  ('UH004', 'Unidade 004', 'DBL', 'Térreo',   'Torre B', 2, 1, 1, 0),
  ('UH005', 'Unidade 005', 'SUP', '1º Andar', 'Torre A', 2, 2, 1, 0),
  ('UH006', 'Unidade 006', 'SUP', '1º Andar', 'Torre A', 2, 2, 1, 0),
  ('UH007', 'Unidade 007', 'STD', '1º Andar', 'Torre B', 1, 1, 1, 0),
  ('UH008', 'Unidade 008', 'STD', '1º Andar', 'Torre B', 1, 1, 1, 0),
  ('UH009', 'Unidade 009', 'LXO', '2º Andar', 'Torre A', 3, 3, 1, 0),
  ('UH010', 'Unidade 010', 'LXO', '2º Andar', 'Torre A', 3, 3, 1, 0),
  ('UH011', 'Unidade 011', 'SUP', '2º Andar', 'Torre B', 2, 2, 1, 0),
  ('UH012', 'Unidade 012', 'SUP', '2º Andar', 'Torre B', 2, 2, 1, 0),
  ('UH013', 'Unidade 013', 'MST', '3º Andar', 'Torre A', 4, 4, 1, 0),
  ('UH014', 'Unidade 014', 'MST', '3º Andar', 'Torre A', 4, 4, 1, 0),
  ('UH015', 'Unidade 015', 'LXO', '3º Andar', 'Torre B', 3, 3, 1, 0),
  ('UH016', 'Unidade 016', 'LXO', '3º Andar', 'Torre B', 3, 3, 0, 0),
  ('UH017', 'Unidade 017', 'PRS', '4º Andar', 'Torre A', 4, 5, 1, 0),
  ('UH018', 'Unidade 018', 'MST', '4º Andar', 'Torre A', 4, 4, 1, 0),
  ('UH019', 'Unidade 019', 'CHL', 'Térreo',   'Anexo',   2, 3, 1, 0),
  ('UH020', 'Unidade 020', 'CBN', 'Térreo',   'Anexo',   2, 2, 0, 0)
) AS seed(cduh, dsuh, cduhtipo, nmandar, nmedificacao, qtquarto, iduhclassificacao, isativo, isacessibilidade)
JOIN empresa e  ON e.cnpj = '12345678000199'
LEFT JOIN uhtipo ut ON ut.cduhtipo = seed.cduhtipo AND ut.idempresa = e.idempresa
ON CONFLICT (idempresa, cduh) DO NOTHING;

-- Seed: 10 UHs empresa filial (98765432000155)
INSERT INTO uh (idempresa, cduh, dsuh, iduhtipo, nmandar, nmedificacao, qtquarto, iduhclassificacao, isativo, isacessibilidade)
SELECT
  e.idempresa,
  seed.cduh,
  seed.dsuh,
  ut.iduhtipo,
  seed.nmandar,
  seed.nmedificacao,
  seed.qtquarto,
  seed.iduhclassificacao,
  seed.isativo,
  seed.isacessibilidade
FROM (VALUES
  ('FH001', 'Filial Unidade 001', 'STD', 'Térreo',   'Bloco A', 1, 1, 1, 1),
  ('FH002', 'Filial Unidade 002', 'STD', 'Térreo',   'Bloco A', 1, 1, 1, 0),
  ('FH003', 'Filial Unidade 003', 'SUP', '1º Andar', 'Bloco A', 2, 2, 1, 0),
  ('FH004', 'Filial Unidade 004', 'SUP', '1º Andar', 'Bloco B', 2, 2, 1, 0),
  ('FH005', 'Filial Unidade 005', 'LXO', '2º Andar', 'Bloco A', 3, 3, 1, 0),
  ('FH006', 'Filial Unidade 006', 'LXO', '2º Andar', 'Bloco B', 3, 3, 1, 0),
  ('FH007', 'Filial Unidade 007', 'MST', '3º Andar', 'Bloco A', 4, 4, 1, 0),
  ('FH008', 'Filial Unidade 008', 'MST', '3º Andar', 'Bloco B', 4, 4, 1, 0),
  ('FH009', 'Filial Unidade 009', 'CBN', 'Térreo',   'Anexo',   2, 2, 1, 0),
  ('FH010', 'Filial Unidade 010', 'CBN', 'Térreo',   'Anexo',   2, 2, 0, 0)
) AS seed(cduh, dsuh, cduhtipo, nmandar, nmedificacao, qtquarto, iduhclassificacao, isativo, isacessibilidade)
JOIN empresa e  ON e.cnpj = '98765432000155'
LEFT JOIN uhtipo ut ON ut.cduhtipo = seed.cduhtipo AND ut.idempresa = e.idempresa
ON CONFLICT (idempresa, cduh) DO NOTHING;
