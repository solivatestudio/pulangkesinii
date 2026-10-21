import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://placeholder:placeholder@localhost:5432/placeholder';

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });

let schemaEnsured = false;
export const ensureRegistrationSchema = async () => {
  if (schemaEnsured || !process.env.DATABASE_URL) return;
  try {
    await sql`
      ALTER TABLE "registrations"
      ADD COLUMN IF NOT EXISTS "status" varchar(32) NOT NULL DEFAULT 'confirmed',
      ADD COLUMN IF NOT EXISTS "expires_at" timestamp,
      ADD COLUMN IF NOT EXISTS "idempotency_key" varchar(128) UNIQUE,
      ADD COLUMN IF NOT EXISTS "quota_deducted" boolean NOT NULL DEFAULT true,
      ADD COLUMN IF NOT EXISTS "admin_notes" text DEFAULT '',
      ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;
    `;
    schemaEnsured = true;
  } catch (err: any) {
    // Abaikan jika sudah ada atau izin DDL terbatas
    schemaEnsured = true;
  }
};

export * from './schema';

