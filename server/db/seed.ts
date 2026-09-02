import { db, users, activities, galleryPhotos, faqs, siteSettings } from './index';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { ACTIVITIES_DATA, FAQ_DATA } from '../../src/data/mockData';

async function seed() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Admin User
  const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin')).limit(1);
  if (existingAdmin.length === 0) {
    const passwordHash = await bcrypt.hash('password123', 10);
    await db.insert(users).values({
      id: 'usr-admin-01',
      username: 'admin',
      email: 'admin@pulangkesinii.org',
      passwordHash,
      name: 'Admin Pulangkesinii',
      role: 'admin',
    });
    console.log(' Created default admin user: admin / password123');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // 2. Seed Activities
  const existingActivities = await db.select().from(activities).limit(1);
  if (existingActivities.length === 0) {
    console.log(`Seeding ${ACTIVITIES_DATA.length} initial activities...`);
    for (const act of ACTIVITIES_DATA) {
      await db.insert(activities).values({
        id: act.id,
        slug: act.slug,
        title: act.title,
        shortDescription: act.shortDescription,
        description: act.description,
        category: act.category,
        status: act.status,
        coverImage: act.coverImage,
        gallery: act.gallery,
        locationName: act.locationName,
        city: act.city,
        address: act.address || '',
        mapUrl: act.mapUrl || '',
        startDate: act.startDate,
        endDate: act.endDate,
        registrationDeadline: act.registrationDeadline,
        price: act.price,
        priceLabel: act.priceLabel,
        quota: act.quota,
        quotaFilled: act.quotaFilled,
        batchNumber: act.batchNumber,
        benefits: act.benefits,
        requirements: act.requirements,
        itemsToBring: act.itemsToBring,
        rundown: act.rundown,
        contactPerson: act.contactPerson,
        featured: act.featured || false,
        urgentClosing: act.urgentClosing || false,
      });
    }
    console.log(' Seeded activities successfully');
  } else {
    console.log('ℹ️ Activities already exist');
  }

  // 3. Seed Gallery Photos
  const existingGallery = await db.select().from(galleryPhotos).limit(1);
  if (existingGallery.length === 0) {
    console.log('Seeding initial 15 gallery photos...');
    for (let i = 1; i <= 15; i++) {
      const pad = String(i).padStart(2, '0');
      const tileClass = i === 4 ? 'featured' : i === 9 || i === 12 ? 'wide' : i === 14 ? 'tall' : '';
      await db.insert(galleryPhotos).values({
        id: `gal-${pad}`,
        title: `Momen Dokumentasi #${i}`,
        batchTag: `Batch ${30 + (i % 9)}`,
        category: i % 3 === 0 ? 'Voluntrip' : i % 2 === 0 ? 'Fun Activity' : 'Volunteer',
        imageUrl: `/images/web/activity-${pad}.webp`,
        caption: `Potret kehangatan dan kebersamaan volunteer Pulangkesinii.`,
        location: i % 2 === 0 ? 'Jakarta' : 'Bandung',
        date: 'Agustus 2026',
        tileClass,
        orderIndex: i,
      });
    }
    console.log(' Seeded gallery photos successfully');
  } else {
    console.log('ℹ️ Gallery photos already exist');
  }

  // 4. Seed FAQs
  const existingFaqs = await db.select().from(faqs).limit(1);
  if (existingFaqs.length === 0) {
    console.log(`Seeding ${FAQ_DATA.length} initial FAQs...`);
    for (let i = 0; i < FAQ_DATA.length; i++) {
      const f = FAQ_DATA[i];
      await db.insert(faqs).values({
        id: f.id,
        question: f.question,
        answer: f.answer,
        category: f.category,
        orderIndex: i + 1,
      });
    }
    console.log(' Seeded FAQs successfully');
  } else {
    console.log('ℹ️ FAQs already exist');
  }

  // 5. Seed Site Settings (Payment accounts & contact)
  const existingSettings = await db.select().from(siteSettings).where(eq(siteSettings.key, 'payment_accounts')).limit(1);
  if (existingSettings.length === 0) {
    await db.insert(siteSettings).values({
      key: 'payment_accounts',
      value: {
        bca: { bank: 'BCA', accountNumber: '1234567890', accountName: 'Pulangkesinii Komunitas' },
        mandiri: { bank: 'Mandiri', accountNumber: '9876543210', accountName: 'Pulangkesinii Komunitas' },
        seabank: { bank: 'SeaBank', accountNumber: '9012345678', accountName: 'Pulangkesinii Komunitas' },
        gopay: { bank: 'GoPay / OVO', accountNumber: '085779321681', accountName: 'Pulangkesinii' },
        qrisImageUrl: '/assets/decor-1.png',
      },
    });
    console.log(' Seeded payment accounts setting');
  }

  const existingContact = await db.select().from(siteSettings).where(eq(siteSettings.key, 'contact_info')).limit(1);
  if (existingContact.length === 0) {
    await db.insert(siteSettings).values({
      key: 'contact_info',
      value: {
        whatsappNumber: '6285779321681',
        whatsappFormatted: '+62 857-7932-1681',
        email: 'pulangkesinii@gmail.com',
        instagram: '@pulangkesinii',
        tiktok: '@Pulangkesinii_',
        basecamp: 'Jakarta Timur',
      },
    });
    console.log(' Seeded contact info setting');
  }

  console.log('🎉 Seeding completed successfully!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
