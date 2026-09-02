import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { eq, desc, asc } from 'drizzle-orm';
import { createRouteHandler } from 'uploadthing/express';
import { uploadRouter } from './uploadthing';
import { db, users, activities, registrations, galleryPhotos, faqs, siteSettings } from './db';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'pulangkesinii_jwt_secret_key_2026_super_secure';

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// UploadThing route handler
app.use(
  '/api/uploadthing',
  createRouteHandler({
    router: uploadRouter,
    config: {
      token: process.env.UPLOADTHING_TOKEN,
    },
  })
);

// Auth Middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.auth_token || req.headers.authorization?.replace('Bearer ', '');
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

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
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
      token,
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

app.post('/api/activities', requireAuth, async (req: Request, res: Response) => {
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

app.put('/api/activities/:id', requireAuth, async (req: Request, res: Response) => {
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
app.post('/api/registrations', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regCode = `PLG-${new Date().getFullYear()}-${randomSuffix}`;
    const id = `reg-${Date.now()}`;

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
      createdAt: new Date(),
    };

    await db.insert(registrations).values(newReg);

    // Increment quotaFilled if activityId matches
    if (data.activityId) {
      const act = await db.select().from(activities).where(eq(activities.id, data.activityId)).limit(1);
      if (act.length > 0) {
        await db.update(activities)
          .set({ quotaFilled: (act[0].quotaFilled || 0) + 1 })
          .where(eq(activities.id, data.activityId));
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil dicatat',
      data: newReg,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Gagal mengirim pendaftaran: ' + err.message });
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

app.patch('/api/registrations/:id/status', requireAuth, async (req: Request, res: Response) => {
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
    await db.delete(registrations).where(eq(registrations.id, req.params.id));
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

app.post('/api/gallery', requireAuth, async (req: Request, res: Response) => {
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

app.post('/api/faqs', requireAuth, async (req: Request, res: Response) => {
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

app.put('/api/faqs/:id', requireAuth, async (req: Request, res: Response) => {
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

app.put('/api/settings/:key', requireAuth, async (req: Request, res: Response) => {
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

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Pulangkesinii API Server running on port ${PORT}`);
  });
}

export default app;
