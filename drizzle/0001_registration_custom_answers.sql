ALTER TABLE "registrations"
ADD COLUMN IF NOT EXISTS "custom_answers" jsonb DEFAULT '{}'::jsonb;
