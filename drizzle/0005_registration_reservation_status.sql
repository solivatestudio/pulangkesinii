ALTER TABLE "registrations"
ADD COLUMN IF NOT EXISTS "status" varchar(32) NOT NULL DEFAULT 'confirmed',
ADD COLUMN IF NOT EXISTS "expires_at" timestamp,
ADD COLUMN IF NOT EXISTS "idempotency_key" varchar(128) UNIQUE,
ADD COLUMN IF NOT EXISTS "quota_deducted" boolean NOT NULL DEFAULT true,
ADD COLUMN IF NOT EXISTS "admin_notes" text DEFAULT '',
ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;
