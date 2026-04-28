-- Migration 009: Checkin / Checkout

CREATE TABLE IF NOT EXISTS checkin_checkout (
  idcheckin    SERIAL      PRIMARY KEY,
  idreserva    INTEGER     NOT NULL REFERENCES reserva (idreserva) ON DELETE CASCADE,
  datacheckin  TIMESTAMPTZ,
  datacheckout TIMESTAMPTZ,
  status       VARCHAR(20) NOT NULL DEFAULT 'PENDENTE',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_checkin_status CHECK (status IN ('PENDENTE', 'CHECKED_IN', 'CHECKED_OUT'))
);

CREATE INDEX IF NOT EXISTS idx_checkin_idreserva ON checkin_checkout (idreserva);
CREATE INDEX IF NOT EXISTS idx_checkin_status    ON checkin_checkout (status);

-- Seed: checkins para reservas confirmadas
INSERT INTO checkin_checkout (idreserva, datacheckin, datacheckout, status)
SELECT
  r.idreserva,
  seed.datacheckin::TIMESTAMPTZ,
  seed.datacheckout::TIMESTAMPTZ,
  seed.status
FROM (
  VALUES
    ('12345678000199', '111.222.333-44', 'UH001', '2026-04-20 14:00:00+00', NULL,                        'CHECKED_IN'),
    ('12345678000199', '222.333.444-55', 'UH003', '2026-04-22 15:30:00+00', NULL,                        'CHECKED_IN'),
    ('12345678000199', '555.666.777-88', 'UH009', '2026-04-18 12:00:00+00', '2026-04-22 11:00:00+00',    'CHECKED_OUT')
) AS seed(cnpj, documento, cduh, datacheckin, datacheckout, status)
JOIN empresa e ON e.cnpj = seed.cnpj
JOIN hospede h ON h.idempresa = e.idempresa AND h.documento = seed.documento
JOIN uh u      ON u.idempresa = e.idempresa AND u.cduh = seed.cduh
JOIN reserva r ON r.idhospede = h.idhospede AND r.iduh = u.iduh;
