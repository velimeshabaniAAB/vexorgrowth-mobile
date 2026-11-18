-- Skedari: schema-java09.sql (pranë package.json)
-- Java 9: shërbimet e preferuara të secilit përdorues.
-- PRIMARY KEY (github_id, sherbim_id) nuk lejon kopje të të njëjtit shërbim.
CREATE TABLE IF NOT EXISTS te_preferuarat_vexor (
  github_id TEXT NOT NULL REFERENCES profilet_vexor(github_id),
  sherbim_id TEXT NOT NULL REFERENCES sherbimet(id),
  krijuar TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (github_id, sherbim_id)
);

SELECT * FROM te_preferuarat_vexor;