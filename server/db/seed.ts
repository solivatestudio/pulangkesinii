import { db, users, activities, galleryPhotos, faqs, siteSettings } from './index';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function syncExactPublicData() {
  console.log('🌱 Menyamakan data database dengan tampilan publik asli...');

  // 1. Admin User
  const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin')).limit(1);
  if (existingAdmin.length === 0) {
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;
    if (!initialPassword || initialPassword.length < 12) {
      throw new Error('ADMIN_INITIAL_PASSWORD minimal 12 karakter wajib diatur sebelum membuat admin');
    }
    const passwordHash = await bcrypt.hash(initialPassword, 12);
    await db.insert(users).values({
      id: 'usr-admin-01',
      username: 'admin',
      email: 'admin@pulangkesinii.org',
      passwordHash,
      name: 'Admin Pulangkesinii',
      role: 'admin',
    });
    console.log('✅ Akun default admin siap: admin');
  }

  // 2. Activities: Reset & samakan 100% dengan 3 card original di App.tsx
  console.log('Menyinkronkan 3 card kegiatan original...');
  await db.delete(activities);
  
  const originalCatalogue = [
    {
      id: 'act-01',
      slug: 'volunteer-jakarta',
      title: '[Judul Kegiatan]',
      category: 'Volunteer',
      city: 'Jakarta',
      color: 'cyan',
      coverImage: '/images/web/activity-04.webp',
      startDate: '[Tanggal Pelaksanaan]',
      endDate: '[Tanggal Selesai]',
      registrationDeadline: '[Batas Registrasi]',
      priceLabel: '[Biaya/Gratis]',
      price: 0,
      locationName: '[Lokasi]',
      address: 'Jakarta',
      shortDescription: 'Slot terbatas tanpa seleksi',
      description: 'Deskripsi lengkap, rundown kegiatan, dan benefit akan ditampilkan setelah data resmi tersedia.',
      status: 'open',
      quota: 100,
      quotaFilled: 0,
      benefits: [],
      requirements: ['Terbuka untuk umum', 'Kuota terbatas tanpa seleksi', 'Mematuhi tata tertib kegiatan'],
      itemsToBring: [],
      rundown: [],
      featured: true,
      urgentClosing: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'act-02',
      slug: 'voluntrip-bandung',
      title: '[Judul Kegiatan]',
      category: 'Voluntrip',
      city: 'Bandung',
      color: 'blue',
      coverImage: '/images/web/activity-09.webp',
      startDate: '[Tanggal Pelaksanaan]',
      endDate: '[Tanggal Selesai]',
      registrationDeadline: '[Batas Registrasi]',
      priceLabel: '[Biaya/Gratis]',
      price: 0,
      locationName: '[Lokasi]',
      address: 'Bandung',
      shortDescription: 'Slot terbatas tanpa seleksi',
      description: 'Deskripsi lengkap, rundown kegiatan, dan benefit akan ditampilkan setelah data resmi tersedia.',
      status: 'open',
      quota: 50,
      quotaFilled: 0,
      benefits: [],
      requirements: ['Terbuka untuk umum', 'Kuota terbatas tanpa seleksi', 'Mematuhi tata tertib kegiatan'],
      itemsToBring: [],
      rundown: [],
      featured: true,
      urgentClosing: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'act-03',
      slug: 'workshop-jogja',
      title: '[Judul Kegiatan]',
      category: 'Workshop',
      city: 'Jogja',
      color: 'coral',
      coverImage: '/images/web/activity-14.webp',
      startDate: '[Tanggal Pelaksanaan]',
      endDate: '[Tanggal Selesai]',
      registrationDeadline: '[Batas Registrasi]',
      priceLabel: '[Biaya/Gratis]',
      price: 0,
      locationName: '[Lokasi]',
      address: 'Jogja',
      shortDescription: 'Slot terbatas tanpa seleksi',
      description: 'Deskripsi lengkap, rundown kegiatan, dan benefit akan ditampilkan setelah data resmi tersedia.',
      status: 'open',
      quota: 50,
      quotaFilled: 0,
      benefits: [],
      requirements: ['Terbuka untuk umum', 'Kuota terbatas tanpa seleksi', 'Mematuhi tata tertib kegiatan'],
      itemsToBring: [],
      rundown: [],
      featured: false,
      urgentClosing: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const act of originalCatalogue) {
    await db.insert(activities).values(act);
  }
  console.log('✅ 3 card original berhasil disinkronkan ke database');

  // 3. FAQ: Samakan 100% dengan 5 pertanyaan asli di App.tsx
  console.log('Menyinkronkan 5 FAQ original...');
  await db.delete(faqs);
  const originalFaqs = [
    'Siapa saja yang boleh ikut kegiatan Pulangkesinii?',
    'Bagaimana cara mendaftar kegiatan?',
    'Apakah kegiatan berbayar atau gratis?',
    'Apakah peserta mendapatkan sertifikat?',
    'Bagaimana cara menjadi partner atau berkolaborasi?',
  ];

  for (let i = 0; i < originalFaqs.length; i++) {
    await db.insert(faqs).values({
      id: `faq-0${i + 1}`,
      question: originalFaqs[i],
      answer: 'Jawaban kebijakan resmi masih menunggu verifikasi. Hubungi tim Pulangkesinii untuk informasi terbaru dan paling tepat.',
      category: 'umum',
      orderIndex: i + 1,
      createdAt: new Date(),
    });
  }
  console.log('✅ 5 FAQ original berhasil disinkronkan');

  // 4. Gallery: Samakan 15 foto
  const existingGallery = await db.select().from(galleryPhotos).limit(1);
  if (existingGallery.length === 0) {
    for (let i = 1; i <= 15; i++) {
      const pad = String(i).padStart(2, '0');
      await db.insert(galleryPhotos).values({
        id: `gal-${pad}`,
        title: `Momen Kebaikan ${i}`,
        imageUrl: `/images/web/activity-${pad}.webp`,
        caption: `Dokumentasi kegiatan Pulangkesinii ${i}`,
        tileClass: i === 4 ? 'featured' : i === 9 || i === 12 ? 'wide' : i === 14 ? 'tall' : '',
        orderIndex: i,
        createdAt: new Date(),
      });
    }
    console.log('✅ 15 Foto galeri original berhasil disinkronkan');
  }

  // 5. Site Settings
  const existingSettings = await db.select().from(siteSettings).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(siteSettings).values({
      key: 'contact_info',
      value: {
        whatsappNumber: '6285779321681',
        email: 'pulangkesinii@gmail.com',
        instagram: '@pulangkesinii',
        tiktok: '@Pulangkesinii_',
        linkedin: 'Pulangkesinii',
        basecamp: 'Jakarta Timur',
      },
      updatedAt: new Date(),
    });
  }

  console.log('🎉 Selesai! Data database sekarang 100% sama persis dengan tampilan web publik.');
  process.exit(0);
}

syncExactPublicData().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
