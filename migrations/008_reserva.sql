-- Migration 008: Reserva

CREATE TABLE IF NOT EXISTS reserva (
  idreserva   SERIAL      PRIMARY KEY,
  idempresa   INTEGER     NOT NULL REFERENCES empresa (idempresa) ON DELETE CASCADE,
  idhospede   INTEGER     NOT NULL REFERENCES hospede (idhospede) ON DELETE CASCADE,
  iduh        INTEGER     NOT NULL REFERENCES uh (iduh) ON DELETE CASCADE,
  dataentrada DATE        NOT NULL,
  datasaida   DATE        NOT NULL,
  status      VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
  isativo     SMALLINT    NOT NULL DEFAULT 1,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_reserva_status CHECK (status IN ('PENDENTE', 'CONFIRMADA', 'CANCELADA')),
  CONSTRAINT chk_reserva_datas  CHECK (datasaida > dataentrada)
);

CREATE INDEX IF NOT EXISTS idx_reserva_idempresa ON reserva (idempresa);
CREATE INDEX IF NOT EXISTS idx_reserva_idhospede ON reserva (idhospede);
CREATE INDEX IF NOT EXISTS idx_reserva_iduh      ON reserva (iduh);
CREATE INDEX IF NOT EXISTS idx_reserva_status    ON reserva (status);

INSERT INTO reserva (idempresa, idhospede, iduh, dataentrada, datasaida, status)
SELECT
  e.idempresa,
  h.idhospede,
  u.iduh,
  seed.dataentrada::DATE,
  seed.datasaida::DATE,
  seed.status
FROM (
  VALUES
    ('12345678000199', '111.222.333-44', 'UH001', '2026-04-20', '2026-04-25', 'CONFIRMADA'),
    ('12345678000199', '222.333.444-55', 'UH003', '2026-04-22', '2026-04-27', 'CONFIRMADA'),
    ('12345678000199', '333.444.555-66', 'UH005', '2026-04-23', '2026-04-28', 'PENDENTE'),
    ('12345678000199', '444.555.666-77', 'UH007', '2026-04-25', '2026-04-30', 'PENDENTE'),
    ('12345678000199', '555.666.777-88', 'UH009', '2026-04-18', '2026-04-22', 'CANCELADA')
) AS seed(cnpj, documento, cduh, dataentrada, datasaida, status)
JOIN empresa e ON e.cnpj = seed.cnpj
JOIN hospede h ON h.idempresa = e.idempresa AND h.documento = seed.documento
JOIN uh u      ON u.idempresa = e.idempresa AND u.cduh = seed.cduh;
