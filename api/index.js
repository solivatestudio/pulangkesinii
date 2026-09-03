var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt2 from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import * as dotenv3 from "dotenv";
import { eq, desc, asc, sql as sql2, and, lt } from "drizzle-orm";
import { createRouteHandler } from "uploadthing/express";

// server/uploadthing.ts
import { createUploadthing } from "uploadthing/express";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
var f = createUploadthing();
var requireAdminUpload = async ({ req }) => {
  const cookie = req.headers.cookie || "";
  const authorization = req.headers.authorization || "";
  const cookieToken = cookie.match(/(?:^|;\s*)auth_token=([^;]+)/)?.[1];
  const token = cookieToken ? decodeURIComponent(cookieToken) : authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) {
    throw new Error("Unauthorized");
  }
  jwt.verify(token, secret);
  return { authorized: true };
};
var uploadRouter = {
  proofUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1
    }
  }).onUploadComplete(async ({ file }) => {
    console.log("Proof upload complete:", file.ufsUrl || file.url);
    return { url: file.ufsUrl || file.url };
  }),
  mediaUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1
    }
  }).middleware(requireAdminUpload).onUploadComplete(async ({ file }) => {
    console.log("Media upload complete:", file.ufsUrl || file.url);
    return { url: file.ufsUrl || file.url };
  })
};

// server/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv2 from "dotenv";

// server/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  activities: () => activities,
  faqs: () => faqs,
  galleryPhotos: () => galleryPhotos,
  registrations: () => registrations,
  sessions: () => sessions,
  siteSettings: () => siteSettings,
  users: () => users
});
import { pgTable, varchar, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
var users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  email: varchar("email", { length: 128 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  role: varchar("role", { length: 32 }).notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var sessions = pgTable("sessions", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var activities = pgTable("activities", {
  id: varchar("id", { length: 64 }).primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 64 }).notNull().default("Volunteer"),
  status: varchar("status", { length: 32 }).notNull().default("open"),
  coverImage: text("cover_image").notNull(),
  gallery: jsonb("gallery").$type().default([]),
  locationName: text("location_name").notNull(),
  city: varchar("city", { length: 64 }).notNull(),
  address: text("address").notNull().default(""),
  mapUrl: text("map_url").default(""),
  startDate: varchar("start_date", { length: 64 }).notNull(),
  endDate: varchar("end_date", { length: 64 }).notNull(),
  registrationDeadline: varchar("registration_deadline", { length: 64 }).notNull(),
  price: integer("price").notNull().default(0),
  priceLabel: varchar("price_label", { length: 64 }).notNull().default("Gratis"),
  quota: integer("quota").notNull().default(50),
  quotaFilled: integer("quota_filled").notNull().default(0),
  batchNumber: integer("batch_number").notNull().default(1),
  benefits: jsonb("benefits").$type().default([]),
  requirements: jsonb("requirements").$type().default([]),
  itemsToBring: jsonb("items_to_bring").$type().default([]),
  rundown: jsonb("rundown").$type().default([]),
  contactPerson: jsonb("contact_person").$type(),
  featured: boolean("featured").default(false),
  urgentClosing: boolean("urgent_closing").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});
var registrations = pgTable("registrations", {
  id: varchar("id", { length: 64 }).primaryKey(),
  registrationCode: varchar("registration_code", { length: 64 }).notNull().unique(),
  activityId: varchar("activity_id", { length: 64 }).references(() => activities.id, { onDelete: "set null" }),
  activityTitle: text("activity_title").notNull(),
  fullName: varchar("full_name", { length: 128 }).notNull(),
  birthDate: varchar("birth_date", { length: 64 }).notNull(),
  domicile: varchar("domicile", { length: 128 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 64 }).notNull(),
  followedChannel: varchar("followed_channel", { length: 128 }).default(""),
  activityChoice: text("activity_choice").notNull(),
  paymentMethod: varchar("payment_method", { length: 64 }).notNull(),
  reason: text("reason").default(""),
  contributionProofUrl: text("contribution_proof_url").default(""),
  tagFriendsProofUrl: text("tag_friends_proof_url").default(""),
  repostStoryProofUrl: text("repost_story_proof_url").default(""),
  status: varchar("status", { length: 32 }).notNull().default("menunggu_verifikasi"),
  adminNotes: text("admin_notes").default(""),
  customAnswers: jsonb("custom_answers").$type().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var galleryPhotos = pgTable("gallery_photos", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: varchar("title", { length: 128 }).notNull(),
  batchTag: varchar("batch_tag", { length: 64 }).default(""),
  category: varchar("category", { length: 64 }).default("Volunteer"),
  imageUrl: text("image_url").notNull(),
  caption: text("caption").default(""),
  location: varchar("location", { length: 128 }).default(""),
  date: varchar("date", { length: 64 }).default(""),
  tileClass: varchar("tile_class", { length: 32 }).default(""),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var faqs = pgTable("faqs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 64 }).default("kegiatan"),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 64 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// server/db/index.ts
dotenv2.config({ path: ".env.local" });
dotenv2.config({ path: ".env" });
var connectionString = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";
var sql = neon(connectionString);
var db = drizzle(sql, { schema: schema_exports });

// server/index.ts
dotenv3.config({ path: ".env.local" });
dotenv3.config({ path: ".env" });
var app = express();
var PORT = process.env.PORT || 5e3;
var JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET wajib diisi dengan nilai acak minimal 32 karakter");
}
var allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin: (origin, callback) => callback(null, !origin || process.env.NODE_ENV !== "production" || allowedOrigins.includes(origin)),
  credentials: true
}));
app.use("/api/auth/login", rateLimit({ windowMs: 15 * 6e4, limit: 10, standardHeaders: true, legacyHeaders: false }));
app.use("/api/registrations", rateLimit({ windowMs: 15 * 6e4, limit: 30, standardHeaders: true, legacyHeaders: false }));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use((req, res, next) => {
  if (req.url && !req.url.startsWith("/api")) {
    req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
  }
  next();
});
if (process.env.UPLOADTHING_TOKEN) {
  app.use(
    "/api/uploadthing",
    createRouteHandler({
      router: uploadRouter,
      config: {
        token: process.env.UPLOADTHING_TOKEN
      }
    })
  );
}
app.get("/api/health", (req, res) => {
  return res.json({
    status: "ok",
    message: "Pulangkesinii Serverless Backend is running on Vercel",
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasUploadthingToken: Boolean(process.env.UPLOADTHING_TOKEN),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
var requireAuth = (req, res, next) => {
  const bearer = req.headers.authorization;
  const token = req.cookies?.auth_token || (bearer?.startsWith("Bearer ") ? bearer.slice(7) : void 0);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Harap login terlebih dahulu" });
  }
  try {
    const decoded = jwt2.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Sesi login tidak valid atau kadaluarsa" });
  }
};
var validateBody = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Data tidak valid", details: parsed.error.issues });
  req.body = parsed.data;
  next();
};
var activityBody = z.object({
  id: z.string().max(64).optional(),
  slug: z.string().max(128).optional(),
  title: z.string().trim().min(1).max(300),
  shortDescription: z.string().max(1e3),
  description: z.string().max(2e4),
  category: z.string().max(64),
  status: z.enum(["open", "closing_soon", "full", "completed"]),
  coverImage: z.string().min(1).max(2e3),
  gallery: z.array(z.string().max(2e3)).optional(),
  locationName: z.string().max(300),
  city: z.enum(["Jakarta", "Bekasi", "Depok", "Tangerang", "Bogor", "Bandung", "Jogja", "Solo", "Malang", "Surabaya"]),
  address: z.string().max(1e3).optional(),
  mapUrl: z.string().max(2e3).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  registrationDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  price: z.coerce.number().int().min(0),
  priceLabel: z.string().max(64),
  quota: z.coerce.number().int().min(1),
  quotaFilled: z.coerce.number().int().min(0),
  batchNumber: z.coerce.number().int().min(1),
  benefits: z.array(z.string().max(500)).optional(),
  requirements: z.array(z.string().max(500)).optional(),
  itemsToBring: z.array(z.string().max(500)).optional(),
  rundown: z.array(z.object({ time: z.string().max(64), activity: z.string().max(500) })).optional(),
  contactPerson: z.object({ name: z.string(), role: z.string(), whatsapp: z.string() }).nullable().optional(),
  featured: z.boolean().optional(),
  urgentClosing: z.boolean().optional()
}).strict();
var faqBody = z.object({ id: z.string().max(64).optional(), question: z.string().min(1).max(1e3), answer: z.string().min(1).max(1e4), category: z.string().max(64).optional(), orderIndex: z.coerce.number().int().optional() }).strict();
var galleryBody = z.object({ id: z.string().max(64).optional(), title: z.string().min(1).max(128), batchTag: z.string().max(64).optional(), category: z.string().max(64).optional(), imageUrl: z.string().url(), caption: z.string().max(5e3).optional(), location: z.string().max(128).optional(), date: z.string().max(64).optional(), tileClass: z.string().max(32).optional(), orderIndex: z.coerce.number().int().optional() }).strict();
app.post("/api/auth/login", async (req, res) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        error: "DATABASE_URL belum diatur di Vercel Dashboard (Settings > Environment Variables)."
      });
    }
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username dan password wajib diisi" });
    }
    const found = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const user = found[0];
    if (!user) {
      return res.status(401).json({ error: "Username atau password salah" });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Username atau password salah" });
    }
    const token = jwt2.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1e3
    });
    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Gagal melakukan login: " + err.message });
  }
});
app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie("auth_token");
  return res.json({ success: true, message: "Berhasil logout" });
});
app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const found = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);
    const user = found[0];
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });
    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
var changePasswordBody = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(12).max(200).regex(/[a-z]/, "Password harus memiliki huruf kecil").regex(/[A-Z]/, "Password harus memiliki huruf besar").regex(/[0-9]/, "Password harus memiliki angka")
}).strict().refine((data) => data.currentPassword !== data.newPassword, {
  message: "Password baru harus berbeda dari password lama",
  path: ["newPassword"]
});
app.put("/api/auth/password", requireAuth, validateBody(changePasswordBody), async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const found = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);
    const user = found[0];
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });
    const valid = await bcrypt.compare(req.body.currentPassword, user.passwordHash);
    if (!valid) return res.status(400).json({ error: "Password saat ini salah" });
    const passwordHash = await bcrypt.hash(req.body.newPassword, 12);
    await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));
    res.clearCookie("auth_token", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
    return res.json({ success: true, message: "Password berhasil diubah. Silakan login kembali." });
  } catch {
    return res.status(500).json({ error: "Gagal mengubah password" });
  }
});
app.get("/api/activities", async (_req, res) => {
  try {
    const list = await db.select().from(activities).orderBy(desc(activities.createdAt));
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: "Gagal memuat kegiatan: " + err.message });
  }
});
app.get("/api/activities/:id", async (req, res) => {
  try {
    const found = await db.select().from(activities).where(eq(activities.id, req.params.id)).limit(1);
    if (found.length === 0) return res.status(404).json({ error: "Kegiatan tidak ditemukan" });
    return res.json(found[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.post("/api/activities", requireAuth, validateBody(activityBody), async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || `act-${Date.now()}`;
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const newActivity = {
      ...data,
      id,
      slug,
      price: Number(data.price || 0),
      quota: Number(data.quota || 50),
      quotaFilled: Number(data.quotaFilled || 0),
      batchNumber: Number(data.batchNumber || 1),
      benefits: Array.isArray(data.benefits) ? data.benefits : [],
      requirements: Array.isArray(data.requirements) ? data.requirements : [],
      itemsToBring: Array.isArray(data.itemsToBring) ? data.itemsToBring : [],
      rundown: Array.isArray(data.rundown) ? data.rundown : [],
      gallery: Array.isArray(data.gallery) ? data.gallery : [],
      contactPerson: data.contactPerson || { name: "Admin", role: "Event Coordinator", whatsapp: "6285779321681" },
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    await db.insert(activities).values(newActivity);
    return res.status(201).json(newActivity);
  } catch (err) {
    console.error("Create activity error:", err);
    return res.status(500).json({ error: "Gagal menambah kegiatan: " + err.message });
  }
});
app.put("/api/activities/:id", requireAuth, validateBody(activityBody), async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updateData = {
      ...data,
      price: Number(data.price || 0),
      quota: Number(data.quota || 50),
      quotaFilled: Number(data.quotaFilled || 0),
      batchNumber: Number(data.batchNumber || 1),
      benefits: Array.isArray(data.benefits) ? data.benefits : [],
      requirements: Array.isArray(data.requirements) ? data.requirements : [],
      itemsToBring: Array.isArray(data.itemsToBring) ? data.itemsToBring : [],
      rundown: Array.isArray(data.rundown) ? data.rundown : [],
      gallery: Array.isArray(data.gallery) ? data.gallery : [],
      contactPerson: data.contactPerson,
      updatedAt: /* @__PURE__ */ new Date()
    };
    await db.update(activities).set(updateData).where(eq(activities.id, id));
    return res.json({ success: true, message: "Kegiatan berhasil diperbarui" });
  } catch (err) {
    return res.status(500).json({ error: "Gagal update kegiatan: " + err.message });
  }
});
app.delete("/api/activities/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(activities).where(eq(activities.id, req.params.id));
    return res.json({ success: true, message: "Kegiatan berhasil dihapus" });
  } catch (err) {
    return res.status(500).json({ error: "Gagal menghapus kegiatan: " + err.message });
  }
});
var registrationSchema = z.object({
  activityId: z.string().max(64).nullable().optional(),
  activityTitle: z.string().max(300).optional(),
  activityChoice: z.string().max(300).default(""),
  fullName: z.string().trim().max(128).default(""),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal("")).default(""),
  domicile: z.string().trim().max(128).default(""),
  whatsapp: z.string().trim().regex(/^\+?[0-9][0-9\s-]{7,20}$/).or(z.literal("")).default(""),
  followedChannel: z.string().max(128).default(""),
  paymentMethod: z.string().max(64).default(""),
  reason: z.string().trim().max(5e3).default(""),
  contributionProofUrl: z.string().url().or(z.literal("")).default(""),
  tagFriendsProofUrl: z.string().url().or(z.literal("")).default(""),
  repostStoryProofUrl: z.string().url().or(z.literal("")).default(""),
  customAnswers: z.record(z.string(), z.string().max(5e3)).default({}),
  // Kept for compatibility with previously cached public-form bundles.
  submittedAt: z.string().datetime().optional()
}).strict();
app.post("/api/registrations", async (req, res) => {
  try {
    const data = registrationSchema.parse(req.body);
    const configRow = await db.select().from(siteSettings).where(eq(siteSettings.key, "registration_form_config")).limit(1);
    const formConfig = configRow[0]?.value || {};
    const configuredFields = Array.isArray(formConfig.fields) ? formConfig.fields : [];
    const configured = (id2, legacyEnabled, legacyRequired) => {
      const field = configuredFields.find((item) => item?.id === id2);
      return { enabled: field?.enabled ?? legacyEnabled ?? true, required: field?.required ?? legacyRequired ?? true };
    };
    const contribution = configured("contributionProof", formConfig.enableContributionProof, formConfig.contributionProofRequired);
    const tagFriends = configured("tagFriendsProof", formConfig.enableTagFriends, formConfig.tagFriendsRequired);
    const repostStory = configured("repostStoryProof", formConfig.enableRepostStory, formConfig.repostStoryRequired);
    const coreValues = { fullName: data.fullName, birthDate: data.birthDate, domicile: data.domicile, whatsapp: data.whatsapp, followedChannel: data.followedChannel, activityChoice: data.activityChoice, paymentMethod: data.paymentMethod, reason: data.reason };
    const defaultRequiredCore = ["fullName", "birthDate", "domicile", "whatsapp", "followedChannel", "activityChoice", "paymentMethod", "reason"];
    const missingCore = defaultRequiredCore.some((id2) => {
      const field = configuredFields.find((item) => item?.id === id2);
      return (field?.enabled ?? true) && (field?.required ?? true) && !coreValues[id2]?.trim();
    });
    if (missingCore) return res.status(400).json({ error: "Field wajib belum lengkap" });
    const missingProof = contribution.enabled && contribution.required && !data.contributionProofUrl || tagFriends.enabled && tagFriends.required && !data.tagFriendsProofUrl || repostStory.enabled && repostStory.required && !data.repostStoryProofUrl;
    if (missingProof) return res.status(400).json({ error: "Bukti wajib belum lengkap" });
    const requiredCustomFields = Array.isArray(formConfig.customFields) ? formConfig.customFields.filter((field) => field?.required) : [];
    if (requiredCustomFields.some((field) => !data.customAnswers[field.label]?.trim())) {
      return res.status(400).json({ error: "Pertanyaan wajib belum lengkap" });
    }
    const suffix = crypto.randomBytes(5).toString("hex").toUpperCase();
    const regCode = `PLG-${(/* @__PURE__ */ new Date()).getFullYear()}-${suffix}`;
    const id = crypto.randomUUID();
    const newReg = {
      id,
      registrationCode: regCode,
      activityId: data.activityId || null,
      activityTitle: data.activityTitle || data.activityChoice || "Kegiatan Pulangkesinii",
      fullName: data.fullName,
      birthDate: data.birthDate || "",
      domicile: data.domicile || "",
      whatsapp: data.whatsapp,
      followedChannel: data.followedChannel || "",
      activityChoice: data.activityChoice || data.activityTitle || "",
      paymentMethod: data.paymentMethod || "Belum dipilih",
      reason: data.reason || "",
      contributionProofUrl: data.contributionProofUrl || "",
      tagFriendsProofUrl: data.tagFriendsProofUrl || "",
      repostStoryProofUrl: data.repostStoryProofUrl || "",
      status: "menunggu_verifikasi",
      adminNotes: "",
      customAnswers: data.customAnswers,
      createdAt: /* @__PURE__ */ new Date()
    };
    if (data.activityId) {
      const updated = await db.update(activities).set({ quotaFilled: sql2`${activities.quotaFilled} + 1` }).where(and(eq(activities.id, data.activityId), lt(activities.quotaFilled, activities.quota))).returning({ id: activities.id });
      if (!updated.length) return res.status(409).json({ error: "Kegiatan tidak tersedia atau kuota sudah penuh" });
    }
    try {
      await db.insert(registrations).values(newReg);
    } catch (error) {
      if (data.activityId) await db.update(activities).set({ quotaFilled: sql2`greatest(${activities.quotaFilled} - 1, 0)` }).where(eq(activities.id, data.activityId));
      throw error;
    }
    return res.status(201).json({
      success: true,
      message: "Pendaftaran berhasil dicatat",
      data: newReg
    });
  } catch (err) {
    console.error("Registration error:", err);
    if (err instanceof z.ZodError) return res.status(400).json({ error: "Data pendaftaran tidak valid", details: err.issues });
    return res.status(500).json({ error: "Gagal mengirim pendaftaran" });
  }
});
app.get("/api/registrations", requireAuth, async (_req, res) => {
  try {
    const list = await db.select().from(registrations).orderBy(desc(registrations.createdAt));
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: "Gagal memuat pendaftaran: " + err.message });
  }
});
app.patch("/api/registrations/:id/status", requireAuth, validateBody(z.object({ status: z.enum(["menunggu_verifikasi", "terkonfirmasi", "ditolak"]).optional(), adminNotes: z.string().max(5e3).optional() }).strict()), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    await db.update(registrations).set({
      ...status ? { status } : {},
      ...adminNotes !== void 0 ? { adminNotes } : {}
    }).where(eq(registrations.id, id));
    return res.json({ success: true, message: "Status pendaftar berhasil diperbarui" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.delete("/api/registrations/:id", requireAuth, async (req, res) => {
  try {
    const found = await db.select({ activityId: registrations.activityId }).from(registrations).where(eq(registrations.id, req.params.id)).limit(1);
    await db.delete(registrations).where(eq(registrations.id, req.params.id));
    if (found[0]?.activityId) await db.update(activities).set({ quotaFilled: sql2`greatest(${activities.quotaFilled} - 1, 0)` }).where(eq(activities.id, found[0].activityId));
    return res.json({ success: true, message: "Data pendaftar berhasil dihapus" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/gallery", async (_req, res) => {
  try {
    const list = await db.select().from(galleryPhotos).orderBy(asc(galleryPhotos.orderIndex), desc(galleryPhotos.createdAt));
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: "Gagal memuat galeri: " + err.message });
  }
});
app.post("/api/gallery", requireAuth, validateBody(galleryBody), async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || `gal-${Date.now()}`;
    const newPhoto = {
      ...data,
      id,
      orderIndex: Number(data.orderIndex || 0),
      createdAt: /* @__PURE__ */ new Date()
    };
    await db.insert(galleryPhotos).values(newPhoto);
    return res.status(201).json(newPhoto);
  } catch (err) {
    return res.status(500).json({ error: "Gagal menambah foto: " + err.message });
  }
});
app.put("/api/gallery/:id", requireAuth, validateBody(galleryBody.omit({ id: true })), async (req, res) => {
  try {
    const { id: _ignored, createdAt: _createdAt, ...data } = req.body;
    await db.update(galleryPhotos).set({ ...data, orderIndex: Number(data.orderIndex || 0) }).where(eq(galleryPhotos.id, req.params.id));
    return res.json({ success: true, message: "Foto berhasil diperbarui" });
  } catch {
    return res.status(500).json({ error: "Gagal memperbarui foto" });
  }
});
app.delete("/api/gallery/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(galleryPhotos).where(eq(galleryPhotos.id, req.params.id));
    return res.json({ success: true, message: "Foto berhasil dihapus" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/faqs", async (_req, res) => {
  try {
    const list = await db.select().from(faqs).orderBy(asc(faqs.orderIndex));
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: "Gagal memuat FAQ: " + err.message });
  }
});
app.post("/api/faqs", requireAuth, validateBody(faqBody), async (req, res) => {
  try {
    const data = req.body;
    const id = data.id || `faq-${Date.now()}`;
    const newFaq = {
      ...data,
      id,
      orderIndex: Number(data.orderIndex || 0),
      createdAt: /* @__PURE__ */ new Date()
    };
    await db.insert(faqs).values(newFaq);
    return res.status(201).json(newFaq);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.put("/api/faqs/:id", requireAuth, validateBody(faqBody.partial()), async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(faqs).set(req.body).where(eq(faqs.id, id));
    return res.json({ success: true, message: "FAQ berhasil diperbarui" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.delete("/api/faqs/:id", requireAuth, async (req, res) => {
  try {
    await db.delete(faqs).where(eq(faqs.id, req.params.id));
    return res.json({ success: true, message: "FAQ berhasil dihapus" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.get("/api/settings", async (_req, res) => {
  try {
    const list = await db.select().from(siteSettings);
    const settingsMap = {};
    for (const item of list) {
      settingsMap[item.key] = item.value;
    }
    return res.json(settingsMap);
  } catch (err) {
    return res.status(500).json({ error: "Gagal memuat pengaturan: " + err.message });
  }
});
app.get("/api/settings/:key", async (req, res) => {
  try {
    const found = await db.select().from(siteSettings).where(eq(siteSettings.key, req.params.key)).limit(1);
    return found[0] ? res.json(found[0]) : res.json({ key: req.params.key, value: null });
  } catch {
    return res.status(500).json({ error: "Gagal memuat pengaturan" });
  }
});
app.put("/api/settings/:key", requireAuth, validateBody(z.object({ value: z.unknown() }).strict()), async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
    if (existing.length > 0) {
      await db.update(siteSettings).set({ value, updatedAt: /* @__PURE__ */ new Date() }).where(eq(siteSettings.key, key));
    } else {
      await db.insert(siteSettings).values({ key, value, updatedAt: /* @__PURE__ */ new Date() });
    }
    return res.json({ success: true, message: `Pengaturan '${key}' berhasil disimpan` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
app.delete("/api/settings/:key", requireAuth, async (req, res) => {
  try {
    await db.delete(siteSettings).where(eq(siteSettings.key, req.params.key));
    return res.json({ success: true, message: "Pengaturan berhasil dihapus" });
  } catch {
    return res.status(500).json({ error: "Gagal menghapus pengaturan" });
  }
});
if (!process.env.VERCEL && process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`\u{1F680} Pulangkesinii API Server running on port ${PORT}`);
  });
}
var index_default = app;
export {
  index_default as default
};
