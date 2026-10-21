import crypto from 'node:crypto';
import { eq, and, lt, lte, sql } from 'drizzle-orm';
import { db, activities, registrations } from './db';
import { deleteUploadthingFiles } from './storage';

export const RESERVATION_TIMEOUT_MINUTES = Number(process.env.RESERVATION_TIMEOUT_MINUTES || 15);
export const RESERVATION_TIMEOUT_MS = RESERVATION_TIMEOUT_MINUTES * 60 * 1000;

export interface ReservePayload {
  idempotencyKey?: string;
  activityId?: string | null;
  activityTitle?: string;
  activityChoice?: string;
  fullName: string;
  email?: string;
  birthDate?: string;
  domicile?: string;
  whatsapp: string;
  followedChannel?: string;
  paymentMethod?: string;
  reason?: string;
  customAnswers?: Record<string, string>;
}

export interface CompletePayload {
  contributionProofUrl?: string;
  tagFriendsProofUrl?: string;
  repostStoryProofUrl?: string;
  proofStatus?: 'complete' | 'proof_later';
  customAnswers?: Record<string, string>;
  reason?: string;
  paymentMethod?: string;
}

export class ReservationError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'ReservationError';
    this.statusCode = statusCode;
  }
}

/**
 * Membersihkan reservasi yang sudah kedaluwarsa dan melepaskan kuota kembali ke kegiatan.
 */
export async function cleanExpiredReservations(database = db) {
  const now = new Date();
  const expiredList = await database
    .select()
    .from(registrations)
    .where(
      and(
        eq(registrations.status, 'pending_proof'),
        lte(registrations.expiresAt, now),
        eq(registrations.quotaDeducted, true)
      )
    );

  let releasedCount = 0;
  for (const reg of expiredList) {
    if (reg.activityId) {
      await database
        .update(activities)
        .set({ quotaFilled: sql`greatest(${activities.quotaFilled} - 1, 0)` })
        .where(eq(activities.id, reg.activityId));
    }

    await database
      .update(registrations)
      .set({
        status: 'expired',
        quotaDeducted: false,
        updatedAt: new Date(),
      })
      .where(eq(registrations.id, reg.id));

    // Bersihkan file sementara jika sempat terunggah
    if (reg.contributionProofUrl || reg.tagFriendsProofUrl || reg.repostStoryProofUrl) {
      try {
        await deleteUploadthingFiles([
          reg.contributionProofUrl,
          reg.tagFriendsProofUrl,
          reg.repostStoryProofUrl,
        ]);
      } catch (err) {
        console.warn(`Gagal membersihkan file reservasi expired ${reg.id}:`, (err as Error).message);
      }
    }

    releasedCount++;
  }

  return releasedCount;
}

/**
 * Reservasi kuota pendaftaran secara atomik sebelum upload dimulai.
 */
export async function reserveQuota(data: ReservePayload, database = db) {
  // 1. Bersihkan reservasi kadaluarsa sebelum memeriksa slot
  await cleanExpiredReservations(database);

  // 2. Cek idempotency key jika disediakan
  if (data.idempotencyKey) {
    const existing = await database
      .select()
      .from(registrations)
      .where(eq(registrations.idempotencyKey, data.idempotencyKey))
      .limit(1);

    if (existing[0]) {
      const reg = existing[0];
      const now = new Date();
      if (reg.status === 'confirmed' || reg.status === 'pending_proof_submission') {
        return {
          registration: reg,
          alreadyConfirmed: true,
          status: reg.status,
        };
      }
      if (reg.status === 'pending_proof' && reg.expiresAt && reg.expiresAt > now) {
        return {
          registration: reg,
          alreadyReserved: true,
          status: 'pending_proof',
        };
      }
    }
  }

  // 3. Validasi activity jika pendaftaran terkait kegiatan
  let activityTitle = data.activityTitle || data.activityChoice || 'Kegiatan Pulangkesinii';
  if (data.activityId) {
    const act = await database
      .select()
      .from(activities)
      .where(eq(activities.id, data.activityId))
      .limit(1);

    if (!act[0]) {
      throw new ReservationError('Kegiatan tidak ditemukan atau ID tidak valid.', 404);
    }

    if (act[0].status === 'completed' || act[0].status === 'full') {
      throw new ReservationError('Kegiatan sudah ditutup atau tidak lagi menerima pendaftaran.', 409);
    }

    if (act[0].quotaFilled >= act[0].quota) {
      throw new ReservationError('Maaf, kuota kegiatan ini sudah penuh sehingga pendaftaran belum berhasil. Anda belum mendapatkan slot.', 409);
    }

    activityTitle = act[0].title;

    // Reservasi slot kuota secara atomik di database
    const updated = await database
      .update(activities)
      .set({ quotaFilled: sql`${activities.quotaFilled} + 1` })
      .where(
        and(
          eq(activities.id, data.activityId),
          sql`${activities.status} NOT IN ('full', 'completed')`,
          lt(activities.quotaFilled, activities.quota)
        )
      )
      .returning({ id: activities.id, quota: activities.quota, quotaFilled: activities.quotaFilled });

    if (!updated.length) {
      throw new ReservationError('Maaf, kuota kegiatan ini baru saja penuh sehingga pendaftaran belum berhasil. Anda belum mendapatkan slot.', 409);
    }
  }

  // 4. Catat reservasi pendaftaran dengan status 'pending_proof'
  const id = crypto.randomUUID();
  const suffix = crypto.randomBytes(5).toString('hex').toUpperCase();
  const registrationCode = `PLG-${new Date().getFullYear()}-${suffix}`;
  const expiresAt = new Date(Date.now() + RESERVATION_TIMEOUT_MS);

  const newReg = {
    id,
    registrationCode,
    activityId: data.activityId || null,
    activityTitle,
    fullName: data.fullName,
    email: data.email || '',
    birthDate: data.birthDate || '',
    domicile: data.domicile || '',
    whatsapp: data.whatsapp,
    followedChannel: data.followedChannel || '',
    activityChoice: data.activityChoice || activityTitle,
    paymentMethod: data.paymentMethod || 'Belum dipilih',
    reason: data.reason || '',
    contributionProofUrl: '',
    tagFriendsProofUrl: '',
    repostStoryProofUrl: '',
    customAnswers: data.customAnswers || {},
    status: 'pending_proof',
    expiresAt,
    idempotencyKey: data.idempotencyKey || null,
    quotaDeducted: Boolean(data.activityId),
    adminNotes: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    await database.insert(registrations).values(newReg);
  } catch (err) {
    // Rollback kuota jika gagal menyimpan record
    if (data.activityId) {
      await database
        .update(activities)
        .set({ quotaFilled: sql`greatest(${activities.quotaFilled} - 1, 0)` })
        .where(eq(activities.id, data.activityId));
    }
    throw err;
  }

  return {
    registration: newReg,
    alreadyReserved: false,
    alreadyConfirmed: false,
    status: 'pending_proof',
  };
}

/**
 * Menyelesaikan pendaftaran setelah bukti diunggah (atau memilih opsi bukti menyusul).
 */
export async function completeRegistration(id: string, payload: CompletePayload, database = db) {
  const found = await database
    .select()
    .from(registrations)
    .where(eq(registrations.id, id))
    .limit(1);

  if (!found[0]) {
    throw new ReservationError('Data reservasi pendaftaran tidak ditemukan.', 404);
  }

  const reg = found[0];

  // Idempotent: jika sudah confirmed
  if (reg.status === 'confirmed' || reg.status === 'pending_proof_submission') {
    return {
      registration: reg,
      alreadyCompleted: true,
      status: reg.status,
    };
  }

  // Periksa apakah reservasi sudah kedaluwarsa
  const now = new Date();
  if (reg.status === 'expired' || (reg.status === 'pending_proof' && reg.expiresAt && reg.expiresAt < now)) {
    // Pastikan kuota dilepaskan jika belum
    if (reg.quotaDeducted && reg.activityId) {
      await database
        .update(activities)
        .set({ quotaFilled: sql`greatest(${activities.quotaFilled} - 1, 0)` })
        .where(eq(activities.id, reg.activityId));
    }

    await database
      .update(registrations)
      .set({ status: 'expired', quotaDeducted: false, updatedAt: new Date() })
      .where(eq(registrations.id, id));

    throw new ReservationError('Batas waktu reservasi (15 menit) telah berakhir. Kuota telah dilepaskan kembali.', 410);
  }

  // Tentukan status akhir
  const isProofLater = payload.proofStatus === 'proof_later';
  const targetStatus = isProofLater ? 'pending_proof_submission' : 'confirmed';
  const adminNotes = isProofLater ? 'Pendaftaran tersimpan dengan opsi bukti menyusul (kendala upload).' : (reg.adminNotes || '');

  const updateData = {
    contributionProofUrl: payload.contributionProofUrl || reg.contributionProofUrl || '',
    tagFriendsProofUrl: payload.tagFriendsProofUrl || reg.tagFriendsProofUrl || '',
    repostStoryProofUrl: payload.repostStoryProofUrl || reg.repostStoryProofUrl || '',
    status: targetStatus,
    expiresAt: null, // Hapus masa kedaluwarsa setelah pendaftaran selesai
    adminNotes,
    customAnswers: payload.customAnswers || reg.customAnswers || {},
    reason: payload.reason !== undefined ? payload.reason : reg.reason,
    paymentMethod: payload.paymentMethod || reg.paymentMethod,
    updatedAt: new Date(),
  };

  await database
    .update(registrations)
    .set(updateData)
    .where(eq(registrations.id, id));

  return {
    registration: { ...reg, ...updateData },
    alreadyCompleted: false,
    status: targetStatus,
  };
}

/**
 * Batalkan pendaftaran / reservasi secara aman dan kurangi kuota HANYA SEKALI.
 */
export async function cancelRegistration(id: string, database = db) {
  const found = await database
    .select()
    .from(registrations)
    .where(eq(registrations.id, id))
    .limit(1);

  if (!found[0]) {
    throw new ReservationError('Pendaftaran tidak ditemukan.', 404);
  }

  const reg = found[0];

  // Hanya kurangi kuota jika quotaDeducted bernilai true
  if (reg.quotaDeducted && reg.activityId) {
    await database
      .update(activities)
      .set({ quotaFilled: sql`greatest(${activities.quotaFilled} - 1, 0)` })
      .where(eq(activities.id, reg.activityId));
  }

  await database
    .update(registrations)
    .set({
      status: 'cancelled',
      quotaDeducted: false,
      updatedAt: new Date(),
    })
    .where(eq(registrations.id, id));

  return { success: true, message: 'Pendaftaran berhasil dibatalkan.' };
}

/**
 * Hapus pendaftaran secara permanen, bersihkan file, dan pastikan kuota dikembalikan hanya sekali.
 */
export async function deleteRegistration(id: string, database = db) {
  const found = await database
    .select()
    .from(registrations)
    .where(eq(registrations.id, id))
    .limit(1);

  if (!found[0]) {
    throw new ReservationError('Pendaftaran tidak ditemukan.', 404);
  }

  const reg = found[0];

  // Hapus file bukti terkait di storage
  try {
    await deleteUploadthingFiles([
      reg.contributionProofUrl,
      reg.tagFriendsProofUrl,
      reg.repostStoryProofUrl,
    ]);
  } catch (err) {
    console.warn(`Hapus file storage untuk pendaftaran ${id} gagal:`, (err as Error).message);
  }

  // Kembalikan kuota hanya jika sebelumnya belum dilepaskan
  if (reg.quotaDeducted && reg.activityId) {
    await database
      .update(activities)
      .set({ quotaFilled: sql`greatest(${activities.quotaFilled} - 1, 0)` })
      .where(eq(activities.id, reg.activityId));
  }

  await database.delete(registrations).where(eq(registrations.id, id));

  return { success: true, message: 'Data pendaftar berhasil dihapus.' };
}
