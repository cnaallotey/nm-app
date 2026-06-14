-- Raw DDL that Prisma's schema language can't express.
-- Run ONCE after `prisma migrate dev` has created the base tables:
--   psql "$DATABASE_URL" -f prisma/sql/extras.sql
-- (The plain @@index() entries in schema.prisma are handled by Prisma itself.)

-- ── Full-text search on Task (title + description) ───────────────
ALTER TABLE "Task"
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_tasks_search ON "Task" USING GIN(search_vector);

-- ── Rating recalculation trigger ────────────────────────────────
CREATE OR REPLACE FUNCTION update_profile_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "Profile"
  SET
    "averageRating" = COALESCE((
      SELECT ROUND(AVG(rating)::numeric, 2)
      FROM "Review"
      WHERE "revieweeId" = NEW."revieweeId"
    ), 0),
    "reviewCount" = (
      SELECT COUNT(*)
      FROM "Review"
      WHERE "revieweeId" = NEW."revieweeId"
    )
  WHERE id = NEW."revieweeId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_review_insert ON "Review";
CREATE TRIGGER after_review_insert
AFTER INSERT ON "Review"
FOR EACH ROW EXECUTE FUNCTION update_profile_rating();
