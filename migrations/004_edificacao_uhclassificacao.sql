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
