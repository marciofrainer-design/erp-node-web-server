-- Migration 007: Hospede

CREATE TABLE IF NOT EXISTS hospede (
  idhospede  SERIAL        PRIMARY KEY,
  idempresa  INTEGER       NOT NULL REFERENCES empresa (idempresa) ON DELETE CASCADE,
  nome       VARCHAR(255)  NOT NULL,
  documento  VARCHAR(50)   NOT NULL,
  telefone   VARCHAR(30),
  email      VARCHAR(255),
  isativo    SMALLINT      NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
  UNIQUE (idempresa, documento)
);

CREATE INDEX IF NOT EXISTS idx_hospede_idempresa ON hospede (idempresa);
CREATE INDEX IF NOT EXISTS idx_hospede_isativo   ON hospede (isativo);

INSERT INTO hospede (idempresa, nome, documento, telefone, email, isativo)
SELECT e.idempresa, seed.nome, seed.documento, seed.telefone, seed.email, seed.isativo
FROM (
  VALUES
    ('12345678000199', 'Ana Paula Ferreira',   '111.222.333-44', '(11) 91234-5678', 'ana.ferreira@email.com',  1),
    ('12345678000199', 'Carlos Eduardo Lima',  '222.333.444-55', '(21) 98765-4321', 'carlos.lima@email.com',   1),
    ('12345678000199', 'Fernanda Oliveira',    '333.444.555-66', '(31) 97654-3210', 'fernanda.oli@email.com',  1),
    ('12345678000199', 'Roberto Mendes',       '444.555.666-77', '(41) 96543-2109', 'roberto.m@email.com',     1),
    ('12345678000199', 'Juliana Costa Silva',  '555.666.777-88', '(51) 95432-1098', 'juliana.cs@email.com',    1),
    ('98765432000155', 'Paulo Henrique Souza', '666.777.888-99', '(61) 94321-0987', 'paulo.souza@email.com',   1),
    ('98765432000155', 'Mariana Alves Rocha',  '777.888.999-00', '(71) 93210-9876', 'mariana.ar@email.com',    1)
) AS seed(cnpj, nome, documento, telefone, email, isativo)
JOIN empresa e ON e.cnpj = seed.cnpj
ON CONFLICT (idempresa, documento) DO NOTHING;
