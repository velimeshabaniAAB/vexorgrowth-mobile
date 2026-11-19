-- Skedari: schema-detyrat.sql (pranë package.json)
-- Detyrat e operatorit për kalendarin te paneli.
CREATE TABLE IF NOT EXISTS detyrat_vexor (
  id SERIAL PRIMARY KEY,
  github_id TEXT NOT NULL REFERENCES profilet_vexor(github_id),
  titulli TEXT NOT NULL CHECK (length(titulli) BETWEEN 1 AND 200),
  afati DATE,
  kryer BOOLEAN NOT NULL DEFAULT false,
  krijuar TIMESTAMPTZ NOT NULL DEFAULT now()
);

SELECT * FROM detyrat_vexor ORDER BY id;