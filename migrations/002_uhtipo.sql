-- Migration 002: UH Tipo schema

CREATE TABLE IF NOT EXISTS uhtipo_grupo (
  iduhtipogrupo SERIAL       PRIMARY KEY,
  nmtipogrupo   VARCHAR(100) NOT NULL,
  idempresa     INTEGER      NOT NULL REFERENCES empresa (idempresa) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_uhtipo_grupo_idempresa ON uhtipo_grupo (idempresa);

CREATE TABLE IF NOT EXISTS uhtipo (
  iduhtipo        SERIAL       PRIMARY KEY,
  idempresa       INTEGER      NOT NULL REFERENCES empresa (idempresa) ON DELETE CASCADE,
  cduhtipo        VARCHAR(20)  NOT NULL,
  nmuhtipo        VARCHAR(100) NOT NULL,
  dsuhtipo        VARCHAR(255),
  iduhtipogrupo   INTEGER      REFERENCES uhtipo_grupo (iduhtipogrupo) ON DELETE SET NULL,
  idpai           INTEGER      REFERENCES uhtipo (iduhtipo) ON DELETE SET NULL,
  qtleito         SMALLINT     NOT NULL DEFAULT 1,
  fltipocobranca  SMALLINT     NOT NULL DEFAULT 1,
  flsituacao      SMALLINT     NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE (idempresa, cduhtipo)
);

CREATE INDEX IF NOT EXISTS idx_uhtipo_idempresa    ON uhtipo (idempresa);
CREATE INDEX IF NOT EXISTS idx_uhtipo_iduhtipogrupo ON uhtipo (iduhtipogrupo);
CREATE INDEX IF NOT EXISTS idx_uhtipo_flsituacao   ON uhtipo (flsituacao);

-- Seed: grupos (empresa matriz)
INSERT INTO uhtipo_grupo (nmtipogrupo, idempresa)
SELECT seed.nmtipogrupo, e.idempresa
FROM (VALUES
  ('Apartamentos', '12345678000199'),
  ('Suítes',       '12345678000199'),
  ('Chalés',       '12345678000199'),
  ('Cabanas',      '12345678000199')
) AS seed(nmtipogrupo, cnpj)
JOIN empresa e ON e.cnpj = seed.cnpj;

-- Seed: grupos (empresa filial)
INSERT INTO uhtipo_grupo (nmtipogrupo, idempresa)
SELECT seed.nmtipogrupo, e.idempresa
FROM (VALUES
  ('Apartamentos', '98765432000155'),
  ('Suítes',       '98765432000155'),
  ('Cabanas',      '98765432000155')
) AS seed(nmtipogrupo, cnpj)
JOIN empresa e ON e.cnpj = seed.cnpj;

-- Seed: tipos de UH (empresa matriz)
INSERT INTO uhtipo (idempresa, cduhtipo, nmuhtipo, dsuhtipo, iduhtipogrupo, qtleito, fltipocobranca, flsituacao)
SELECT
  e.idempresa,
  seed.cduhtipo,
  seed.nmuhtipo,
  seed.dsuhtipo,
  g.iduhtipogrupo,
  seed.qtleito,
  seed.fltipocobranca,
  seed.flsituacao
FROM (VALUES
  ('STD', 'Standard',     'Quarto padrão com cama de casal',          'Apartamentos', 2, 1, 1),
  ('SUP', 'Superior',     'Quarto superior com vista privilegiada',    'Apartamentos', 2, 1, 1),
  ('DBL', 'Duplo',        'Quarto duplo com duas camas de solteiro',   'Apartamentos', 2, 1, 1),
  ('LXO', 'Luxo',         'Quarto luxo com amenidades premium',        'Suítes',       3, 1, 1),
  ('MST', 'Master',       'Suíte master com sala de estar',            'Suítes',       4, 1, 1),
  ('PRS', 'Presidential', 'Suíte presidencial com jacuzzi e varanda',  'Suítes',       4, 2, 1),
  ('CHL', 'Chalé',        'Chalé independente com varanda e jardim',   'Chalés',       2, 1, 1),
  ('CBN', 'Cabana',       'Cabana rústica com decoração temática',     'Cabanas',      2, 1, 0)
) AS seed(cduhtipo, nmuhtipo, dsuhtipo, nmtipogrupo, qtleito, fltipocobranca, flsituacao)
JOIN empresa      e ON e.cnpj = '12345678000199'
JOIN uhtipo_grupo g ON g.nmtipogrupo = seed.nmtipogrupo AND g.idempresa = e.idempresa
ON CONFLICT (idempresa, cduhtipo) DO NOTHING;

-- Seed: tipos de UH (empresa filial)
INSERT INTO uhtipo (idempresa, cduhtipo, nmuhtipo, dsuhtipo, iduhtipogrupo, qtleito, fltipocobranca, flsituacao)
SELECT
  e.idempresa,
  seed.cduhtipo,
  seed.nmuhtipo,
  seed.dsuhtipo,
  g.iduhtipogrupo,
  seed.qtleito,
  seed.fltipocobranca,
  seed.flsituacao
FROM (VALUES
  ('STD', 'Standard',  'Quarto padrão',                   'Apartamentos', 2, 1, 1),
  ('SUP', 'Superior',  'Quarto superior com vista',        'Apartamentos', 2, 1, 1),
  ('LXO', 'Luxo',      'Quarto luxo com amenidades',       'Suítes',       3, 1, 1),
  ('MST', 'Master',    'Suíte master',                     'Suítes',       4, 1, 1),
  ('CBN', 'Cabana',    'Cabana rústica com jardim privado', 'Cabanas',      2, 1, 1)
) AS seed(cduhtipo, nmuhtipo, dsuhtipo, nmtipogrupo, qtleito, fltipocobranca, flsituacao)
JOIN empresa      e ON e.cnpj = '98765432000155'
JOIN uhtipo_grupo g ON g.nmtipogrupo = seed.nmtipogrupo AND g.idempresa = e.idempresa
ON CONFLICT (idempresa, cduhtipo) DO NOTHING;
