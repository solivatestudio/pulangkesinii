import { pgTable, varchar, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  username: varchar('username', { length: 64 }).notNull().unique(),
  email: varchar('email', { length: 128 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 128 }).notNull(),
  role: varchar('role', { length: 32 }).notNull().default('admin'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 64 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const activities = pgTable('activities', {
  id: varchar('id', { length: 64 }).primaryKey(),
  slug: varchar('slug', { length: 128 }).notNull().unique(),
  title: text('title').notNull(),
  shortDescription: text('short_description').notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 64 }).notNull().default('Volunteer'),
  status: varchar('status', { length: 32 }).notNull().default('open'),
  coverImage: text('cover_image').notNull(),
  gallery: jsonb('gallery').$type<string[]>().default([]),
  locationName: text('location_name').notNull(),
  city: varchar('city', { length: 64 }).notNull(),
  address: text('address').notNull().default(''),
  mapUrl: text('map_url').default(''),
  startDate: varchar('start_date', { length: 64 }).notNull(),
  endDate: varchar('end_date', { length: 64 }).notNull(),
  registrationDeadline: varchar('registration_deadline', { length: 64 }).notNull(),
  price: integer('price').notNull().default(0),
  priceLabel: varchar('price_label', { length: 64 }).notNull().default('Gratis'),
  quota: integer('quota').notNull().default(50),
  quotaFilled: integer('quota_filled').notNull().default(0),
  batchNumber: integer('batch_number').notNull().default(1),
  benefits: jsonb('benefits').$type<string[]>().default([]),
  requirements: jsonb('requirements').$type<string[]>().default([]),
  itemsToBring: jsonb('items_to_bring').$type<string[]>().default([]),
  rundown: jsonb('rundown').$type<{ time: string; activity: string }[]>().default([]),
  contactPerson: jsonb('contact_person').$type<{ name: string; role: string; whatsapp: string }>(),
  featured: boolean('featured').default(false),
  urgentClosing: boolean('urgent_closing').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const registrations = pgTable('registrations', {
  id: varchar('id', { length: 64 }).primaryKey(),
  registrationCode: varchar('registration_code', { length: 64 }).notNull().unique(),
  activityId: varchar('activity_id', { length: 64 }).references(() => activities.id, { onDelete: 'set null' }),
  activityTitle: text('activity_title').notNull(),
  fullName: varchar('full_name', { length: 128 }).notNull(),
  birthDate: varchar('birth_date', { length: 64 }).notNull(),
  domicile: varchar('domicile', { length: 128 }).notNull(),
  whatsapp: varchar('whatsapp', { length: 64 }).notNull(),
  followedChannel: varchar('followed_channel', { length: 128 }).default(''),
  activityChoice: text('activity_choice').notNull(),
  paymentMethod: varchar('payment_method', { length: 64 }).notNull(),
  reason: text('reason').default(''),
  contributionProofUrl: text('contribution_proof_url').default(''),
  tagFriendsProofUrl: text('tag_friends_proof_url').default(''),
  repostStoryProofUrl: text('repost_story_proof_url').default(''),
  status: varchar('status', { length: 32 }).notNull().default('menunggu_verifikasi'),
  adminNotes: text('admin_notes').default(''),
  customAnswers: jsonb('custom_answers').$type<Record<string, string>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const galleryPhotos = pgTable('gallery_photos', {
  id: varchar('id', { length: 64 }).primaryKey(),
  title: varchar('title', { length: 128 }).notNull(),
  batchTag: varchar('batch_tag', { length: 64 }).default(''),
  category: varchar('category', { length: 64 }).default('Volunteer'),
  imageUrl: text('image_url').notNull(),
  caption: text('caption').default(''),
  location: varchar('location', { length: 128 }).default(''),
  date: varchar('date', { length: 64 }).default(''),
  tileClass: varchar('tile_class', { length: 32 }).default(''),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const faqs = pgTable('faqs', {
  id: varchar('id', { length: 64 }).primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: varchar('category', { length: 64 }).default('kegiatan'),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const siteSettings = pgTable('site_settings', {
  key: varchar('key', { length: 64 }).primaryKey(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
