ALTER TABLE "activities"
ADD COLUMN IF NOT EXISTS "whatsapp_group_url" text DEFAULT '';
