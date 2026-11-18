-- Skedari: schema-java05.sql (pranë package.json)
-- Java 5: profilet, rolet dhe pronari i shërbimit.
-- Ekzekutohet pas schema.sql të Javës 4.

-- Tabela e kërkesave (nëse mungon)
CREATE TABLE IF NOT EXISTS kerkesat_vexor (
  id SERIAL PRIMARY KEY,
  sherbim_id TEXT NOT NULL REFERENCES sherbimet(id),
  emri TEXT NOT NULL,
  emaili TEXT NOT NULL,
  linku TEXT,
  mesazhi TEXT,
  statusi TEXT NOT NULL DEFAULT 'ne_pritje'
    CHECK (statusi IN ('ne_pritje', 'pranuar', 'refuzuar')),
  krijuar TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profilet dhe rolet (veçmas nga profilet e RideShare)
CREATE TABLE IF NOT EXISTS profilet_vexor (
  github_id TEXT PRIMARY KEY,
  emri TEXT NOT NULL,
  roli TEXT NOT NULL DEFAULT 'kreator' CHECK (roli IN ('kreator', 'operator'))
);

-- Pronari i secilit shërbim
ALTER TABLE sherbimet ADD COLUMN IF NOT EXISTS operator_id TEXT REFERENCES profilet_vexor(github_id);

-- Operatori fiktiv i shërbimit 1 (për provën e refuzimit)
INSERT INTO profilet_vexor (github_id, emri, roli)
VALUES ('DEMO-OPERATOR-2', 'Operatori tjetër (demo)', 'operator')
ON CONFLICT (github_id) DO NOTHING;

UPDATE sherbimet SET operator_id = 'DEMO-OPERATOR-2'
WHERE id = '1' AND operator_id IS NULL;

-- Kërkesa provë
INSERT INTO kerkesat_vexor (sherbim_id, emri, emaili, mesazhi)
SELECT '1', 'Kreator Demo 1', 'demo1@example.com', 'Kërkesë provë për auditimin.'
WHERE NOT EXISTS (SELECT 1 FROM kerkesat_vexor WHERE emaili = 'demo1@example.com');

INSERT INTO kerkesat_vexor (sherbim_id, emri, emaili, mesazhi)
SELECT '2', 'Kreator Demo 2', 'demo2@example.com', 'Kërkesë provë për ebook.'
WHERE NOT EXISTS (SELECT 1 FROM kerkesat_vexor WHERE emaili = 'demo2@example.com');

-- Hapi 4: pas hyrjes së parë, zëvendëso SHENO_ID_TENDE me ID-në GitHub
-- UPDATE profilet_vexor SET roli = 'operator' WHERE github_id = 'SHENO_ID_TENDE';
-- UPDATE sherbimet SET operator_id = 'SHENO_ID_TENDE' WHERE id = '2';

SELECT id, emri, operator_id FROM sherbimet ORDER BY id;