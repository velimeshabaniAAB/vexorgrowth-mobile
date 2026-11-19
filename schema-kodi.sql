-- Skedari: schema-kodi.sql (pranë package.json)
-- Kodi personal i kërkesës për linkun /kerkesa/[kodi] dhe koha e pranimit.
ALTER TABLE kerkesat_vexor ADD COLUMN IF NOT EXISTS kodi TEXT UNIQUE;
ALTER TABLE kerkesat_vexor ADD COLUMN IF NOT EXISTS pranuar_me TIMESTAMPTZ;

UPDATE kerkesat_vexor
  SET kodi = substr(md5(random()::text || id::text || clock_timestamp()::text), 1, 16)
  WHERE kodi IS NULL;

SELECT id, emri, statusi, kodi FROM kerkesat_vexor ORDER BY id;