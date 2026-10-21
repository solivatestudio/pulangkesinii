import type { Response } from 'express';
import { UTApi } from 'uploadthing/server';
import { eq } from 'drizzle-orm';
import { db, siteSettings } from './db';

const HISTORY_KEY = 'uploadthing_storage_history';
const LATEST_KEY = 'uploadthing_storage_latest';
const DAY = 24 * 60 * 60 * 1000;

export type StorageSnapshot = {
  capturedAt: string;
  usedBytes: number;
  limitBytes: number;
  fileCount: number;
  weeklyGrowthBytes: number | null;
  projectedNextActivityBytes: number;
  alerts: string[];
};

const positiveEnvNumber = (name: string, fallback: number) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

export const runStorageMonitoring = async (): Promise<StorageSnapshot> => {
  if (!process.env.UPLOADTHING_TOKEN) throw new Error('UPLOADTHING_TOKEN belum diatur.');
  const [historyRow, usage] = await Promise.all([
    db.select().from(siteSettings).where(eq(siteSettings.key, HISTORY_KEY)).limit(1),
    new UTApi().getUsageInfo(),
  ]);
  const history = Array.isArray(historyRow[0]?.value) ? historyRow[0].value as StorageSnapshot[] : [];
  const now = new Date();
  const previous = [...history].reverse().find((snapshot) => now.getTime() - Date.parse(snapshot.capturedAt) >= 6 * DAY);
  const weeklyGrowthBytes = previous ? Math.max(0, usage.appTotalBytes - previous.usedBytes) : null;
  const projectedNextActivityBytes = Math.max(positiveEnvNumber('MONITOR_NEXT_ACTIVITY_STORAGE_BYTES', 12 * 1024 * 1024), weeklyGrowthBytes ?? 0);
  const warningRatio = positiveEnvNumber('MONITOR_WARNING_RATIO', 0.8);
  const remaining = Math.max(0, usage.limitBytes - usage.appTotalBytes);
  const alerts: string[] = [];
  if (usage.appTotalBytes / usage.limitBytes >= warningRatio) alerts.push(`Storage UploadThing sudah memakai ${Math.round((usage.appTotalBytes / usage.limitBytes) * 100)}% kapasitas.`);
  if (remaining < projectedNextActivityBytes) alerts.push(`Sisa storage tidak cukup untuk estimasi kegiatan berikutnya (${remaining} byte tersisa, perlu sekitar ${projectedNextActivityBytes} byte).`);
  const snapshot: StorageSnapshot = { capturedAt: now.toISOString(), usedBytes: usage.appTotalBytes, limitBytes: usage.limitBytes, fileCount: usage.filesUploaded, weeklyGrowthBytes, projectedNextActivityBytes, alerts };
  const nextHistory = [...history, snapshot].filter((item) => now.getTime() - Date.parse(item.capturedAt) < 35 * DAY).slice(-40);
  await db.insert(siteSettings).values({ key: HISTORY_KEY, value: nextHistory, updatedAt: now }).onConflictDoUpdate({ target: siteSettings.key, set: { value: nextHistory, updatedAt: now } });
  await db.insert(siteSettings).values({ key: LATEST_KEY, value: snapshot, updatedAt: now }).onConflictDoUpdate({ target: siteSettings.key, set: { value: snapshot, updatedAt: now } });
  if (alerts.length && process.env.MONITOR_ALERT_WEBHOOK_URL) {
    const response = await fetch(process.env.MONITOR_ALERT_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: `⚠️ Pulangkesinii UploadThing alert\n${alerts.join('\n')}`, storage: snapshot }) });
    if (!response.ok) console.error(`Storage alert webhook failed: HTTP ${response.status}`);
  }
  return snapshot;
};

export const getLatestStorageMonitoring = async () => {
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, LATEST_KEY)).limit(1);
  return result[0]?.value ?? null;
};

export const requireCronSecret = (authorization: string | undefined) => Boolean(process.env.CRON_SECRET && authorization === `Bearer ${process.env.CRON_SECRET}`);
export const jsonMonitoringError = (res: Response, error: unknown) => res.status(500).json({ error: error instanceof Error ? error.message : 'Gagal menjalankan pemantauan storage.' });
