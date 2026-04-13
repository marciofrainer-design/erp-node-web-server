-- Migration 006: UH x Caracteristica

CREATE TABLE IF NOT EXISTS uhcaracteristica (
  iduh             INTEGER  NOT NULL REFERENCES uh (iduh)             ON DELETE CASCADE,
  idcaracteristica INTEGER  NOT NULL REFERENCES caracteristica (idcaracteristica) ON DELETE CASCADE,
  isprincipal      SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY (iduh, idcaracteristica)
);

CREATE INDEX IF NOT EXISTS idx_uhcaracteristica_iduh             ON uhcaracteristica (iduh);
CREATE INDEX IF NOT EXISTS idx_uhcaracteristica_idcaracteristica ON uhcaracteristica (idcaracteristica);

-- Seed: vínculos UH x Caracteristica (empresa matriz 12345678000199)
INSERT INTO uhcaracteristica (iduh, idcaracteristica, isprincipal)
SELECT u.iduh, c.idcaracteristica, seed.isprincipal
FROM (VALUES
  -- UH001 e UH002: STD / Térreo / Torre A
  ('12345678000199', 'UH001', 'AR_COND',  1),
  ('12345678000199', 'UH001', 'WIFI',     0),
  ('12345678000199', 'UH002', 'AR_COND',  1),
  ('12345678000199', 'UH002', 'WIFI',     0),
  -- UH003 e UH004: DBL / Térreo / Torre B
  ('12345678000199', 'UH003', 'AR_COND',  1),
  ('12345678000199', 'UH003', 'WIFI',     0),
  ('12345678000199', 'UH003', 'FRIGOBAR', 0),
  ('12345678000199', 'UH004', 'AR_COND',  1),
  ('12345678000199', 'UH004', 'WIFI',     0),
  ('12345678000199', 'UH004', 'FRIGOBAR', 0),
  -- UH005 e UH006: SUP / 1º Andar / Torre A
  ('12345678000199', 'UH005', 'AR_COND',  1),
  ('12345678000199', 'UH005', 'WIFI',     0),
  ('12345678000199', 'UH005', 'FRIGOBAR', 0),
  ('12345678000199', 'UH005', 'COFRE',    0),
  ('12345678000199', 'UH006', 'AR_COND',  1),
  ('12345678000199', 'UH006', 'WIFI',     0),
  ('12345678000199', 'UH006', 'FRIGOBAR', 0),
  ('12345678000199', 'UH006', 'COFRE',    0),
  -- UH007 e UH008: STD / 1º Andar / Torre B
  ('12345678000199', 'UH007', 'AR_COND',  1),
  ('12345678000199', 'UH007', 'WIFI',     0),
  ('12345678000199', 'UH008', 'AR_COND',  1),
  ('12345678000199', 'UH008', 'WIFI',     0),
  -- UH009 e UH010: LXO / 2º Andar / Torre A
  ('12345678000199', 'UH009', 'AR_COND',  1),
  ('12345678000199', 'UH009', 'WIFI',     0),
  ('12345678000199', 'UH009', 'FRIGOBAR', 0),
  ('12345678000199', 'UH009', 'COFRE',    0),
  ('12345678000199', 'UH009', 'BANHEIR',  0),
  ('12345678000199', 'UH009', 'VARANDA',  0),
  ('12345678000199', 'UH009', 'VISTA_M',  0),
  ('12345678000199', 'UH010', 'AR_COND',  1),
  ('12345678000199', 'UH010', 'WIFI',     0),
  ('12345678000199', 'UH010', 'FRIGOBAR', 0),
  ('12345678000199', 'UH010', 'COFRE',    0),
  ('12345678000199', 'UH010', 'BANHEIR',  0),
  ('12345678000199', 'UH010', 'VARANDA',  0),
  ('12345678000199', 'UH010', 'VISTA_M',  0),
  -- UH011 e UH012: SUP / 2º Andar / Torre B
  ('12345678000199', 'UH011', 'AR_COND',  1),
  ('12345678000199', 'UH011', 'WIFI',     0),
  ('12345678000199', 'UH011', 'FRIGOBAR', 0),
  ('12345678000199', 'UH011', 'COFRE',    0),
  ('12345678000199', 'UH012', 'AR_COND',  1),
  ('12345678000199', 'UH012', 'WIFI',     0),
  ('12345678000199', 'UH012', 'FRIGOBAR', 0),
  ('12345678000199', 'UH012', 'COFRE',    0),
  -- UH013 e UH014: MST / 3º Andar / Torre A
  ('12345678000199', 'UH013', 'AR_COND',  1),
  ('12345678000199', 'UH013', 'WIFI',     0),
  ('12345678000199', 'UH013', 'FRIGOBAR', 0),
  ('12345678000199', 'UH013', 'COFRE',    0),
  ('12345678000199', 'UH013', 'BANHEIR',  0),
  ('12345678000199', 'UH013', 'VARANDA',  0),
  ('12345678000199', 'UH013', 'VISTA_P',  0),
  ('12345678000199', 'UH014', 'AR_COND',  1),
  ('12345678000199', 'UH014', 'WIFI',     0),
  ('12345678000199', 'UH014', 'FRIGOBAR', 0),
  ('12345678000199', 'UH014', 'COFRE',    0),
  ('12345678000199', 'UH014', 'BANHEIR',  0),
  ('12345678000199', 'UH014', 'VARANDA',  0),
  ('12345678000199', 'UH014', 'VISTA_P',  0),
  -- UH015 e UH016: LXO / 3º Andar / Torre B
  ('12345678000199', 'UH015', 'AR_COND',  1),
  ('12345678000199', 'UH015', 'WIFI',     0),
  ('12345678000199', 'UH015', 'FRIGOBAR', 0),
  ('12345678000199', 'UH015', 'COFRE',    0),
  ('12345678000199', 'UH015', 'BANHEIR',  0),
  ('12345678000199', 'UH015', 'VARANDA',  0),
  ('12345678000199', 'UH015', 'VISTA_M',  0),
  ('12345678000199', 'UH016', 'AR_COND',  1),
  ('12345678000199', 'UH016', 'WIFI',     0),
  ('12345678000199', 'UH016', 'FRIGOBAR', 0),
  ('12345678000199', 'UH016', 'COFRE',    0),
  ('12345678000199', 'UH016', 'BANHEIR',  0),
  ('12345678000199', 'UH016', 'VARANDA',  0),
  ('12345678000199', 'UH016', 'VISTA_M',  0),
  -- UH017: PRS / 4º Andar / Torre A (presidential suite — all amenities)
  ('12345678000199', 'UH017', 'AR_COND',  1),
  ('12345678000199', 'UH017', 'WIFI',     0),
  ('12345678000199', 'UH017', 'FRIGOBAR', 0),
  ('12345678000199', 'UH017', 'COFRE',    0),
  ('12345678000199', 'UH017', 'BANHEIR',  0),
  ('12345678000199', 'UH017', 'VARANDA',  0),
  ('12345678000199', 'UH017', 'VISTA_M',  0),
  ('12345678000199', 'UH017', 'VISTA_P',  0),
  -- UH018: MST / 4º Andar / Torre A
  ('12345678000199', 'UH018', 'AR_COND',  1),
  ('12345678000199', 'UH018', 'WIFI',     0),
  ('12345678000199', 'UH018', 'FRIGOBAR', 0),
  ('12345678000199', 'UH018', 'COFRE',    0),
  ('12345678000199', 'UH018', 'BANHEIR',  0),
  ('12345678000199', 'UH018', 'VARANDA',  0),
  ('12345678000199', 'UH018', 'VISTA_P',  0),
  -- UH019: CHL / Térreo / Anexo
  ('12345678000199', 'UH019', 'AR_COND',  1),
  ('12345678000199', 'UH019', 'WIFI',     0),
  ('12345678000199', 'UH019', 'FRIGOBAR', 0),
  ('12345678000199', 'UH019', 'VARANDA',  0),
  -- UH020: CBN / Térreo / Anexo
  ('12345678000199', 'UH020', 'AR_COND',  1),
  ('12345678000199', 'UH020', 'WIFI',     0)
) AS seed(cnpj, cduh, dsabreviatura, isprincipal)
JOIN empresa e      ON e.cnpj = seed.cnpj
JOIN uh u           ON u.cduh = seed.cduh          AND u.idempresa = e.idempresa
JOIN caracteristica c ON c.dsabreviatura = seed.dsabreviatura AND c.idempresa = e.idempresa
ON CONFLICT (iduh, idcaracteristica) DO NOTHING;

-- Seed: vínculos UH x Caracteristica (empresa filial 98765432000155)
INSERT INTO uhcaracteristica (iduh, idcaracteristica, isprincipal)
SELECT u.iduh, c.idcaracteristica, seed.isprincipal
FROM (VALUES
  ('98765432000155', 'F001', 'AR_COND',  1),
  ('98765432000155', 'F001', 'WIFI',     0),
  ('98765432000155', 'F002', 'AR_COND',  1),
  ('98765432000155', 'F002', 'WIFI',     0),
  ('98765432000155', 'F002', 'FRIGOBAR', 0),
  ('98765432000155', 'F003', 'AR_COND',  1),
  ('98765432000155', 'F003', 'WIFI',     0),
  ('98765432000155', 'F003', 'FRIGOBAR', 0)
) AS seed(cnpj, cduh, dsabreviatura, isprincipal)
JOIN empresa e        ON e.cnpj = seed.cnpj
JOIN uh u             ON u.cduh = seed.cduh          AND u.idempresa = e.idempresa
JOIN caracteristica c ON c.dsabreviatura = seed.dsabreviatura AND c.idempresa = e.idempresa
ON CONFLICT (iduh, idcaracteristica) DO NOTHING;
