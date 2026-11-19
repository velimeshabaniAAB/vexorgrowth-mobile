-- Skedari: schema-takimet.sql (pranë package.json)
-- Takimi i kërkesës së pranuar: data, ora dhe linku i Zoom.
ALTER TABLE kerkesat_vexor ADD COLUMN IF NOT EXISTS data_takimit DATE;
ALTER TABLE kerkesat_vexor ADD COLUMN IF NOT EXISTS ora_takimit TEXT;
ALTER TABLE kerkesat_vexor ADD COLUMN IF NOT EXISTS zoom_link TEXT;

SELECT id, emri, statusi, data_takimit, ora_takimit, zoom_link FROM kerkesat_vexor ORDER BY id;