import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import app from './index';
import { activities, db, faqs, galleryPhotos, registrations, siteSettings } from './db';

const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const ids = {
  activity: `test-act-${suffix}`,
  registration: '',
  faq: `test-faq-${suffix}`,
  gallery: `test-gallery-${suffix}`,
  setting: `test_setting_${suffix}`.slice(0, 64),
};
let auth = '';

beforeAll(() => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET diperlukan untuk integration test');
  auth = `Bearer ${jwt.sign({ id: 'integration-test', username: 'integration-test', role: 'admin' }, secret, { expiresIn: '5m' })}`;
});

afterAll(async () => {
  if (ids.registration) await db.delete(registrations).where(eq(registrations.id, ids.registration));
  await db.delete(activities).where(eq(activities.id, ids.activity));
  await db.delete(faqs).where(eq(faqs.id, ids.faq));
  await db.delete(galleryPhotos).where(eq(galleryPhotos.id, ids.gallery));
  await db.delete(siteSettings).where(eq(siteSettings.key, ids.setting));
});

describe.sequential('API CRUD integration', () => {
  it('menolak mutasi tanpa autentikasi', async () => {
    expect((await request(app).post('/api/faqs').send({})).status).toBe(401);
  });

  it('melindungi dan memvalidasi endpoint ganti password', async () => {
    expect((await request(app).put('/api/auth/password').send({ currentPassword: 'old', newPassword: 'NewPassword123' })).status).toBe(401);
    expect((await request(app).put('/api/auth/password').set('Authorization', auth).send({ currentPassword: 'old', newPassword: 'short' })).status).toBe(400);
  });

  it('CRUD activities', async () => {
    const payload = { id: ids.activity, slug: ids.activity, title: 'Integration Test', shortDescription: 'Test', description: 'Test', category: 'Volunteer', status: 'open', coverImage: 'https://example.com/image.jpg', locationName: 'Test', city: 'Jakarta', address: '', startDate: '2026-09-10', endDate: '2026-09-10', registrationDeadline: '2026-09-09', price: 0, priceLabel: 'Gratis', quota: 2, quotaFilled: 0, batchNumber: 1 };
    expect((await request(app).post('/api/activities').set('Authorization', auth).send(payload)).status).toBe(201);
    expect((await request(app).get(`/api/activities/${ids.activity}`)).body.title).toBe('Integration Test');
    expect((await request(app).put(`/api/activities/${ids.activity}`).set('Authorization', auth).send({ ...payload, title: 'Updated' })).status).toBe(200);
    expect((await request(app).get(`/api/activities/${ids.activity}`)).body.title).toBe('Updated');
  });

  it('create/read/update/delete registration dan menjaga kuota', async () => {
    const config = await db.select().from(siteSettings).where(eq(siteSettings.key, 'registration_form_config')).limit(1);
    const customFields = ((config[0]?.value as { customFields?: Array<{ label: string }> })?.customFields || []);
    const customAnswers = Object.fromEntries(customFields.map((field) => [field.label, 'Integration answer']));
    const created = await request(app).post('/api/registrations').send({ activityId: ids.activity, activityTitle: 'Updated', activityChoice: 'Updated', fullName: 'Integration User', birthDate: '2000-01-01', domicile: 'Jakarta', whatsapp: '081234567890', followedChannel: 'Ya', paymentMethod: 'Mandiri', reason: 'Integration test', contributionProofUrl: 'https://example.com/proof.jpg', tagFriendsProofUrl: 'https://example.com/tag.jpg', repostStoryProofUrl: 'https://example.com/story.jpg', customAnswers, submittedAt: new Date().toISOString() });
    expect(created.status).toBe(201);
    ids.registration = created.body.data.id;
    const list = await request(app).get('/api/registrations').set('Authorization', auth);
    expect(list.body.some((item: { id: string }) => item.id === ids.registration)).toBe(true);
    expect((await request(app).patch(`/api/registrations/${ids.registration}/status`).set('Authorization', auth).send({ status: 'terkonfirmasi' })).status).toBe(200);
    expect((await request(app).delete(`/api/registrations/${ids.registration}`).set('Authorization', auth)).status).toBe(200);
    ids.registration = '';
    expect((await request(app).get(`/api/activities/${ids.activity}`)).body.quotaFilled).toBe(0);
  });

  it('CRUD FAQ', async () => {
    expect((await request(app).post('/api/faqs').set('Authorization', auth).send({ id: ids.faq, question: 'Test?', answer: 'Ya', category: 'kegiatan' })).status).toBe(201);
    expect((await request(app).put(`/api/faqs/${ids.faq}`).set('Authorization', auth).send({ answer: 'Updated' })).status).toBe(200);
    expect((await request(app).get('/api/faqs')).body.some((item: { id: string; answer: string }) => item.id === ids.faq && item.answer === 'Updated')).toBe(true);
    expect((await request(app).delete(`/api/faqs/${ids.faq}`).set('Authorization', auth)).status).toBe(200);
  });

  it('CRUD gallery', async () => {
    expect((await request(app).post('/api/gallery').set('Authorization', auth).send({ id: ids.gallery, title: 'Test', imageUrl: 'https://example.com/image.jpg' })).status).toBe(201);
    expect((await request(app).get('/api/gallery')).body.some((item: { id: string }) => item.id === ids.gallery)).toBe(true);
    expect((await request(app).put(`/api/gallery/${ids.gallery}`).set('Authorization', auth).send({ title: 'Updated', imageUrl: 'https://example.com/updated.jpg' })).status).toBe(200);
    expect((await request(app).delete(`/api/gallery/${ids.gallery}`).set('Authorization', auth)).status).toBe(200);
  });

  it('create/read/update setting', async () => {
    expect((await request(app).put(`/api/settings/${ids.setting}`).set('Authorization', auth).send({ value: { enabled: true } })).status).toBe(200);
    expect((await request(app).get(`/api/settings/${ids.setting}`)).body.value.enabled).toBe(true);
    expect((await request(app).put(`/api/settings/${ids.setting}`).set('Authorization', auth).send({ value: { enabled: false } })).status).toBe(200);
    expect((await request(app).get(`/api/settings/${ids.setting}`)).body.value.enabled).toBe(false);
    expect((await request(app).delete(`/api/settings/${ids.setting}`).set('Authorization', auth)).status).toBe(200);
  });

  it('delete activity', async () => {
    expect((await request(app).delete(`/api/activities/${ids.activity}`).set('Authorization', auth)).status).toBe(200);
    expect((await request(app).get(`/api/activities/${ids.activity}`)).status).toBe(404);
  });
});
