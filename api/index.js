var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as dotenv3 from "dotenv";
import { eq, desc, asc } from "drizzle-orm";
import { createRouteHandler } from "uploadthing/express";

// server/uploadthing.ts
import { createUploadthing } from "uploadthing/express";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });
var f = createUploadthing();
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
  }).onUploadComplete(async ({ file }) => {
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
var JWT_SECRET = process.env.JWT_SECRET || "pulangkesinii_jwt_secret_key_2026_super_secure";
app.use(cors({
  origin: true,
  credentials: true
}));
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
  const token = req.cookies?.auth_token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Harap login terlebih dahulu" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Sesi login tidak valid atau kadaluarsa" });
  }
};
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
    const token = jwt.sign(
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
      },
      token
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
app.post("/api/activities", requireAuth, async (req, res) => {
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
app.put("/api/activities/:id", requireAuth, async (req, res) => {
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
app.post("/api/registrations", async (req, res) => {
  try {
    const data = req.body;
    const randomSuffix = Math.floor(1e3 + Math.random() * 9e3);
    const regCode = `PLG-${(/* @__PURE__ */ new Date()).getFullYear()}-${randomSuffix}`;
    const id = `reg-${Date.now()}`;
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
      createdAt: /* @__PURE__ */ new Date()
    };
    await db.insert(registrations).values(newReg);
    if (data.activityId) {
      const act = await db.select().from(activities).where(eq(activities.id, data.activityId)).limit(1);
      if (act.length > 0) {
        await db.update(activities).set({ quotaFilled: (act[0].quotaFilled || 0) + 1 }).where(eq(activities.id, data.activityId));
      }
    }
    return res.status(201).json({
      success: true,
      message: "Pendaftaran berhasil dicatat",
      data: newReg
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Gagal mengirim pendaftaran: " + err.message });
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
app.patch("/api/registrations/:id/status", requireAuth, async (req, res) => {
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
    await db.delete(registrations).where(eq(registrations.id, req.params.id));
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
app.post("/api/gallery", requireAuth, async (req, res) => {
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
app.post("/api/faqs", requireAuth, async (req, res) => {
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
app.put("/api/faqs/:id", requireAuth, async (req, res) => {
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
app.put("/api/settings/:key", requireAuth, async (req, res) => {
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
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\u{1F680} Pulangkesinii API Server running on port ${PORT}`);
  });
}
var index_default = app;
export {
  index_default as default
};
