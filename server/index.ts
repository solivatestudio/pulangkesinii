import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import * as dotenv from 'dotenv';
import { eq, desc, asc, sql, and, lt } from 'drizzle-orm';
import { createRouteHandler } from 'uploadthing/express';
import { uploadRouter } from './uploadthing';
import { db, users, activities, registrations, galleryPhotos, faqs, siteSettings } from './db';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET wajib diisi dengan nilai acak minimal 32 karakter');
}

// Middlewares
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, callback) => callback(null, !origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)),
  credentials: true
}));
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60_000, limit: 10, standardHeaders: true, legacyHeaders: false }));
app.use('/api/registrations', rateLimit({ windowMs: 15 * 60_000, limit: 30, standardHeaders: true, legacyHeaders: false }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Normalisasi URL untuk Vercel Serverless Function
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});

// UploadThing route handler (aktifkan jika token tersedia)
if (process.env.UPLOADTHING_TOKEN) {
  app.use(
    '/api/uploadthing',
    createRouteHandler({
      router: uploadRouter,
      config: {
        token: process.env.UPLOADTHING_TOKEN,
      },
    })
  );
}

app.get('/api/health', (req: Request, res: Response) => {
  return res.json({
    status: 'ok',
    message: 'Pulangkesinii Serverless Backend is running on Vercel',
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    hasUploadthingToken: Boolean(process.env.UPLOADTHING_TOKEN),
    timestamp: new Date().toISOString(),
  });
});

// Auth Middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;
  const token = req.cookies?.auth_token || (bearer?.startsWith('Bearer ') ? bearer.slice(7) : undefined);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Harap login terlebih dahulu' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Sesi login tidak valid atau kadaluarsa' });
  }
};

const validateBody = (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Data tidak valid', details: parsed.error.issues });
  req.body = parsed.data;
  next();
};

const activityBody = z.object({
  id: z.string().max(64).optional(), slug: z.string().max(128).optional(), title: z.string().trim().min(1).max(300),
  shortDescription: z.string().max(1000), description: z.string().max(20000), category: z.string().max(64), status: z.enum(['open', 'closing_soon', 'full', 'completed']),
  coverImage: z.string().min(1).max(2000), gallery: z.array(z.string().max(2000)).optional(), locationName: z.string().max(300), city: z.enum(['Jakarta', 'Bekasi', 'Depok', 'Tangerang', 'Bogor', 'Bandung', 'Jogja', 'Solo', 'Malang', 'Surabaya']), address: z.string().max(1000).optional(), mapUrl: z.string().max(2000).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), registrationDeadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), price: z.coerce.number().int().min(0), priceLabel: z.string().max(64), quota: z.coerce.number().int().min(1), quotaFilled: z.coerce.number().int().min(0), batchNumber: z.coerce.number().int().min(1),
  benefits: z.array(z.string().max(500)).optional(), requirements: z.array(z.string().max(500)).optional(), itemsToBring: z.array(z.string().max(500)).optional(), rundown: z.array(z.object({ time: z.string().max(64), activity: z.string().max(500) })).optional(), contactPerson: z.object({ name: z.string(), role: z.string(), whatsapp: z.string() }).nullable().optional(), featured: z.boolean().optional(), urgentClosing: z.boolean().optional(),
}).strict();
const faqBody = z.object({ id: z.string().max(64).optional(), question: z.string().min(1).max(1000), answer: z.string().min(1).max(10000), category: z.string().max(64).optional(), orderIndex: z.coerce.number().int().optional() }).strict();
const galleryBody = z.object({ id: z.string().max(64).optional(), title: z.string().min(1).max(128), batchTag: z.string().max(64).optional(), category: z.string().max(64).optional(), imageUrl: z.string().url(), caption: z.string().max(5000).optional(), location: z.string().max(128).optional(), date: z.string().max(64).optional(), tileClass: z.string().max(32).optional(), orderIndex: z.coerce.number().int().optional() }).strict();

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(500).json({
        error: 'DATABASE_URL belum diatur di Vercel Dashboard (Settings > Environment Variables).'
      });
    }

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    const found = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const user = found[0];

    if (!user) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Gagal melakukan login: ' + err.message });
  }
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('auth_token');
  return res.json({ success: true, message: 'Berhasil logout' });
});

app.get('/api/auth/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const found = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);
    const user = found[0];
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });

    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

const changePasswordBody = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(12).max(200)
    .regex(/[a-z]/, 'Password harus memiliki huruf kecil')
    .regex(/[A-Z]/, 'Password harus memiliki huruf besar')
    .regex(/[0-9]/, 'Password harus memiliki angka'),
}).strict().refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Password baru harus berbeda dari password lama', path: ['newPassword'],
});

app.put('/api/auth/password', requireAuth, validateBody(changePasswordBody), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const found = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);
    const user = found[0];
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    const valid = await bcrypt.compare(req.body.currentPassword, user.passwordHash);
    if (!valid) return res.status(400).json({ error: 'Password saat ini salah' });
    const passwordHash = await bcrypt.hash(req.body.newPassword, 12);
    await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));
    res.clearCookie('auth_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    return res.json({ success: true, message: 'Password berhasil diubah. Silakan login kembali.' });
  } catch {
    return res.status(500).json({ error: 'Gagal mengubah password' });
  }
});

// ==================== ACTIVITIES ROUTES ====================
app.get('/api/activities', async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(activities).orderBy(desc(activities.createdAt));
    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: 'Gagal memuat kegiatan: ' + err.message });
  }
});

app.get('/api/activities/:id', async (req: Request, res: Response) => {
  try {
    const found = await db.select().from(activities).where(eq(activities.id, req.params.id)).limit(1);
    if (found.length === 0) return res.status(404).json({ error: 'Kegiatan tidak ditemukan' });
    return res.json(found[0]);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/activities', requireAuth, validateBody(activityBody), async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = data.id || `act-${Date.now()}`;
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

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
      contactPerson: data.contactPerson || { name: 'Admin', role: 'Event Coordinator', whatsapp: '6285779321681' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(activities).values(newActivity);
    return res.status(201).json(newActivity);
  } catch (err: any) {
    console.error('Create activity error:', err);
    return res.status(500).json({ error: 'Gagal menambah kegiatan: ' + err.message });
  }
});

app.put('/api/activities/:id', requireAuth, validateBody(activityBody), async (req: Request, res: Response) => {
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
      updatedAt: new Date(),
    };

    await db.update(activities).set(updateData).where(eq(activities.id, id));
    return res.json({ success: true, message: 'Kegiatan berhasil diperbarui' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Gagal update kegiatan: ' + err.message });
  }
});

app.delete('/api/activities/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await db.delete(activities).where(eq(activities.id, req.params.id));
    return res.json({ success: true, message: 'Kegiatan berhasil dihapus' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Gagal menghapus kegiatan: ' + err.message });
  }
});

// ==================== REGISTRATIONS ROUTES ====================
const registrationSchema = z.object({
  activityId: z.string().max(64).nullable().optional(),
  activityTitle: z.string().max(300).optional(),
  activityChoice: z.string().max(300).default(''),
  fullName: z.string().trim().max(128).default(''),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal('')).default(''),
  domicile: z.string().trim().max(128).default(''),
  whatsapp: z.string().trim().regex(/^\+?[0-9][0-9\s-]{7,20}$/).or(z.literal('')).default(''),
  followedChannel: z.string().max(128).default(''),
  paymentMethod: z.string().max(64).default(''),
  reason: z.string().trim().max(5000).default(''),
  contributionProofUrl: z.string().url().or(z.literal('')).default(''),
  tagFriendsProofUrl: z.string().url().or(z.literal('')).default(''),
  repostStoryProofUrl: z.string().url().or(z.literal('')).default(''),
  customAnswers: z.record(z.string(), z.string().max(5000)).default({}),
}).strict();

app.post('/api/registrations', async (req: Request, res: Response) => {
  try {
    const data = registrationSchema.parse(req.body);
    const configRow = await db.select().from(siteSettings).where(eq(siteSettings.key, 'registration_form_config')).limit(1);
    const formConfig = (configRow[0]?.value || {}) as Record<string, any>;
    const configuredFields = Array.isArray(formConfig.fields) ? formConfig.fields : [];
    const configured = (id: string, legacyEnabled: unknown, legacyRequired: unknown) => {
      const field = configuredFields.find((item: any) => item?.id === id);
      return { enabled: field?.enabled ?? legacyEnabled ?? true, required: field?.required ?? legacyRequired ?? true };
    };
    const contribution = configured('contributionProof', formConfig.enableContributionProof, formConfig.contributionProofRequired);
    const tagFriends = configured('tagFriendsProof', formConfig.enableTagFriends, formConfig.tagFriendsRequired);
    const repostStory = configured('repostStoryProof', formConfig.enableRepostStory, formConfig.repostStoryRequired);
    const coreValues: Record<string, string> = { fullName: data.fullName, birthDate: data.birthDate, domicile: data.domicile, whatsapp: data.whatsapp, followedChannel: data.followedChannel, activityChoice: data.activityChoice, paymentMethod: data.paymentMethod, reason: data.reason };
    const defaultRequiredCore = ['fullName', 'birthDate', 'domicile', 'whatsapp', 'followedChannel', 'activityChoice', 'paymentMethod', 'reason'];
    const missingCore = defaultRequiredCore.some((id) => {
      const field = configuredFields.find((item: any) => item?.id === id);
      return (field?.enabled ?? true) && (field?.required ?? true) && !coreValues[id]?.trim();
    });
    if (missingCore) return res.status(400).json({ error: 'Field wajib belum lengkap' });
    const missingProof =
      (contribution.enabled && contribution.required && !data.contributionProofUrl) ||
      (tagFriends.enabled && tagFriends.required && !data.tagFriendsProofUrl) ||
      (repostStory.enabled && repostStory.required && !data.repostStoryProofUrl);
    if (missingProof) return res.status(400).json({ error: 'Bukti wajib belum lengkap' });
    const requiredCustomFields = Array.isArray(formConfig.customFields) ? formConfig.customFields.filter((field: any) => field?.required) : [];
    if (requiredCustomFields.some((field: any) => !data.customAnswers[field.label]?.trim())) {
      return res.status(400).json({ error: 'Pertanyaan wajib belum lengkap' });
    }
    const suffix = crypto.randomBytes(5).toString('hex').toUpperCase();
    const regCode = `PLG-${new Date().getFullYear()}-${suffix}`;
    const id = crypto.randomUUID();

    const newReg = {
      id,
      registrationCode: regCode,
      activityId: data.activityId || null,
      activityTitle: data.activityTitle || data.activityChoice || 'Kegiatan Pulangkesinii',
      fullName: data.fullName,
      birthDate: data.birthDate || '',
      domicile: data.domicile || '',
      whatsapp: data.whatsapp,
      followedChannel: data.followedChannel || '',
      activityChoice: data.activityChoice || data.activityTitle || '',
      paymentMethod: data.paymentMethod || 'Belum dipilih',
      reason: data.reason || '',
      contributionProofUrl: data.contributionProofUrl || '',
      tagFriendsProofUrl: data.tagFriendsProofUrl || '',
      repostStoryProofUrl: data.repostStoryProofUrl || '',
      status: 'menunggu_verifikasi',
      adminNotes: '',
      customAnswers: data.customAnswers,
      createdAt: new Date(),
    };

    if (data.activityId) {
      const updated = await db.update(activities)
        .set({ quotaFilled: sql`${activities.quotaFilled} + 1` })
        .where(and(eq(activities.id, data.activityId), lt(activities.quotaFilled, activities.quota)))
        .returning({ id: activities.id });
      if (!updated.length) return res.status(409).json({ error: 'Kegiatan tidak tersedia atau kuota sudah penuh' });
    }
    try {
      await db.insert(registrations).values(newReg);
    } catch (error) {
      if (data.activityId) await db.update(activities).set({ quotaFilled: sql`greatest(${activities.quotaFilled} - 1, 0)` }).where(eq(activities.id, data.activityId));
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil dicatat',
      data: newReg,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    if (err instanceof z.ZodError) return res.status(400).json({ error: 'Data pendaftaran tidak valid', details: err.issues });
    return res.status(500).json({ error: 'Gagal mengirim pendaftaran' });
  }
});

app.get('/api/registrations', requireAuth, async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(registrations).orderBy(desc(registrations.createdAt));
    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: 'Gagal memuat pendaftaran: ' + err.message });
  }
});

app.patch('/api/registrations/:id/status', requireAuth, validateBody(z.object({ status: z.enum(['menunggu_verifikasi', 'terkonfirmasi', 'ditolak']).optional(), adminNotes: z.string().max(5000).optional() }).strict()), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    await db.update(registrations)
      .set({
        ...(status ? { status } : {}),
        ...(adminNotes !== undefined ? { adminNotes } : {}),
      })
      .where(eq(registrations.id, id));

    return res.json({ success: true, message: 'Status pendaftar berhasil diperbarui' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/registrations/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const found = await db.select({ activityId: registrations.activityId }).from(registrations).where(eq(registrations.id, req.params.id)).limit(1);
    await db.delete(registrations).where(eq(registrations.id, req.params.id));
    if (found[0]?.activityId) await db.update(activities).set({ quotaFilled: sql`greatest(${activities.quotaFilled} - 1, 0)` }).where(eq(activities.id, found[0].activityId));
    return res.json({ success: true, message: 'Data pendaftar berhasil dihapus' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==================== GALLERY ROUTES ====================
app.get('/api/gallery', async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(galleryPhotos).orderBy(asc(galleryPhotos.orderIndex), desc(galleryPhotos.createdAt));
    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: 'Gagal memuat galeri: ' + err.message });
  }
});

app.post('/api/gallery', requireAuth, validateBody(galleryBody), async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = data.id || `gal-${Date.now()}`;
    const newPhoto = {
      ...data,
      id,
      orderIndex: Number(data.orderIndex || 0),
      createdAt: new Date(),
    };
    await db.insert(galleryPhotos).values(newPhoto);
    return res.status(201).json(newPhoto);
  } catch (err: any) {
    return res.status(500).json({ error: 'Gagal menambah foto: ' + err.message });
  }
});

app.put('/api/gallery/:id', requireAuth, validateBody(galleryBody.omit({ id: true })), async (req: Request, res: Response) => {
  try {
    const { id: _ignored, createdAt: _createdAt, ...data } = req.body;
    await db.update(galleryPhotos).set({ ...data, orderIndex: Number(data.orderIndex || 0) }).where(eq(galleryPhotos.id, req.params.id));
    return res.json({ success: true, message: 'Foto berhasil diperbarui' });
  } catch {
    return res.status(500).json({ error: 'Gagal memperbarui foto' });
  }
});

app.delete('/api/gallery/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await db.delete(galleryPhotos).where(eq(galleryPhotos.id, req.params.id));
    return res.json({ success: true, message: 'Foto berhasil dihapus' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==================== FAQ ROUTES ====================
app.get('/api/faqs', async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(faqs).orderBy(asc(faqs.orderIndex));
    return res.json(list);
  } catch (err: any) {
    return res.status(500).json({ error: 'Gagal memuat FAQ: ' + err.message });
  }
});

app.post('/api/faqs', requireAuth, validateBody(faqBody), async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const id = data.id || `faq-${Date.now()}`;
    const newFaq = {
      ...data,
      id,
      orderIndex: Number(data.orderIndex || 0),
      createdAt: new Date(),
    };
    await db.insert(faqs).values(newFaq);
    return res.status(201).json(newFaq);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.put('/api/faqs/:id', requireAuth, validateBody(faqBody.partial()), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.update(faqs).set(req.body).where(eq(faqs.id, id));
    return res.json({ success: true, message: 'FAQ berhasil diperbarui' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/faqs/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    await db.delete(faqs).where(eq(faqs.id, req.params.id));
    return res.json({ success: true, message: 'FAQ berhasil dihapus' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ==================== SITE SETTINGS ROUTES ====================
app.get('/api/settings', async (_req: Request, res: Response) => {
  try {
    const list = await db.select().from(siteSettings);
    const settingsMap: Record<string, any> = {};
    for (const item of list) {
      settingsMap[item.key] = item.value;
    }
    return res.json(settingsMap);
  } catch (err: any) {
    return res.status(500).json({ error: 'Gagal memuat pengaturan: ' + err.message });
  }
});

app.get('/api/settings/:key', async (req: Request, res: Response) => {
  try {
    const found = await db.select().from(siteSettings).where(eq(siteSettings.key, req.params.key)).limit(1);
    return found[0] ? res.json(found[0]) : res.json({ key: req.params.key, value: null });
  } catch {
    return res.status(500).json({ error: 'Gagal memuat pengaturan' });
  }
});

app.put('/api/settings/:key', requireAuth, validateBody(z.object({ value: z.unknown() }).strict()), async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const existing = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
    if (existing.length > 0) {
      await db.update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, key));
    } else {
      await db.insert(siteSettings).values({ key, value, updatedAt: new Date() });
    }

    return res.json({ success: true, message: `Pengaturan '${key}' berhasil disimpan` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.delete('/api/settings/:key', requireAuth, async (req: Request, res: Response) => {
  try {
    await db.delete(siteSettings).where(eq(siteSettings.key, req.params.key));
    return res.json({ success: true, message: 'Pengaturan berhasil dihapus' });
  } catch {
    return res.status(500).json({ error: 'Gagal menghapus pengaturan' });
  }
});

if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Pulangkesinii API Server running on port ${PORT}`);
  });
}

export default app;
