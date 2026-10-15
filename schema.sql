-- Skedari: schema.sql (pranë package.json)
-- Vexor Growth: shërbimet dhe kërkesat e kreatorëve. Ekzekutohet në Neon SQL Editor.
CREATE TABLE IF NOT EXISTS sherbimet (
  id TEXT PRIMARY KEY,
  emri TEXT NOT NULL,
  kategoria TEXT NOT NULL,
  afati TEXT NOT NULL,
  menyra TEXT NOT NULL,
  pershkrimi TEXT NOT NULL,
  perfshin TEXT[] NOT NULL,
  per_ke TEXT NOT NULL
);

INSERT INTO sherbimet (id, emri, kategoria, afati, menyra, pershkrimi, perfshin, per_ke)
VALUES
  ('1', 'Auditim i monetizimit', 'Analizë', '2 ditë', 'Online, me linkun e profilit',
   'Analizojmë profilin dhe audiencën tënde për të gjetur cilin produkt digjital mund të shesësh dhe sa mund të fitosh prej tij.',
   ARRAY['Analizë e audiencës dhe e komenteve', 'Ide për 3 produkte digjitale',
         'Vlerësim i potencialit të fitimit', 'Plan me hapat e parë'],
   'Kreatorë që kanë audiencë aktive, por nuk e dinë nga ta fillojnë.'),
  ('2', 'Ebook me kreatorin', 'Produkt digjital', '7 ditë', 'Takim në Zoom',
   'Ti mbetesh eksperti; ne e kthejmë njohurinë tënde në një ebook gati për shitje, me emrin dhe brendin tënd.',
   ARRAY['Struktura dhe kapitujt', 'Shkrimi dhe redaktimi',
         'Fletë pune dhe materiale bonus', 'Kopertina dhe faqja e shitjes'],
   'Kreatorë që marrin vazhdimisht të njëjtat pyetje nga ndjekësit.'),
  ('3', 'Lansimi i produktit', 'Marketing', '10 ditë', 'Takim në Zoom',
   'E çojmë produktin tënd te audienca fazë pas faze, që shitjet e para të vijnë që në javën e lansimit.',
   ARRAY['Lista e pritjes', 'Faqja e shitjes dhe emailat',
         'Skripte për video dhe story', 'Raport pas lansimit'],
   'Kreatorë që kanë një produkt gati dhe duan shitjet e para.')
ON CONFLICT (id) DO NOTHING;

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

SELECT * FROM sherbimet ORDER BY id;