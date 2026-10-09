ALTER TABLE "activities"
ADD COLUMN IF NOT EXISTS "activity_time" varchar(64) NOT NULL DEFAULT '';
