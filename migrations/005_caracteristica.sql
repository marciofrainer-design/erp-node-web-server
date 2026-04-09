-- Migration 005: Caracteristica

CREATE TABLE IF NOT EXISTS caracteristica (
  idcaracteristica     SERIAL       PRIMARY KEY,
  idempresa            INTEGER      NOT NULL REFERENCES empresa (idempresa) ON DELETE CASCADE,
  dscaracteristica     VARCHAR(255) NOT NULL,
  dsabreviatura        VARCHAR(50)  NOT NULL,
  fltipo               SMALLINT     NOT NULL DEFAULT 1,
  idcaracteristica_emp INTEGER,
  flsituacao           SMALLINT     NOT NULL DEFAULT 1,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE (idempresa, dsabreviatura)
);

CREATE INDEX IF NOT EXISTS idx_caracteristica_idempresa ON caracteristica (idempresa);
CREATE INDEX IF NOT EXISTS idx_caracteristica_flsituacao ON caracteristica (flsituacao);
CREATE INDEX IF NOT EXISTS idx_caracteristica_fltipo     ON caracteristica (fltipo);

INSERT INTO caracteristica (idempresa, dscaracteristica, dsabreviatura, fltipo, idcaracteristica_emp, flsituacao)
SELECT e.idempresa, seed.dscaracteristica, seed.dsabreviatura, seed.fltipo, seed.idcaracteristica_emp, seed.flsituacao
FROM (
  VALUES
    ('12345678000199', 'Ar-condicionado',        'AR_COND',  1, 1,  1),
    ('12345678000199', 'Wi-Fi',                  'WIFI',     1, 2,  1),
    ('12345678000199', 'Frigobar',               'FRIGOBAR', 1, 3,  1),
    ('12345678000199', 'Cofre',                  'COFRE',    1, 4,  1),
    ('12345678000199', 'Banheira',               'BANHEIR',  2, 5,  1),
    ('12345678000199', 'Varanda',                'VARANDA',  2, 6,  1),
    ('12345678000199', 'Vista para o mar',       'VISTA_M',  3, 7,  1),
    ('12345678000199', 'Vista para a piscina',   'VISTA_P',  3, 8,  1),
    ('12345678000199', 'Jacuzzi',                'JACUZZI',  2, 9,  0),
    ('98765432000155', 'Ar-condicionado',        'AR_COND',  1, 1,  1),
    ('98765432000155', 'Wi-Fi',                  'WIFI',     1, 2,  1),
    ('98765432000155', 'Frigobar',               'FRIGOBAR', 1, 3,  1)
) AS seed(cnpj, dscaracteristica, dsabreviatura, fltipo, idcaracteristica_emp, flsituacao)
JOIN empresa e ON e.cnpj = seed.cnpj
ON CONFLICT (idempresa, dsabreviatura) DO NOTHING;
