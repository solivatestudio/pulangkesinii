import { UTApi } from 'uploadthing/server';
import { ZipArchive } from 'archiver';
import type { Response } from 'express';
import { Readable } from 'node:stream';

const uploadthingHosts = new Set(['utfs.io', 'ufs.sh', 'uploadthing.com']);

export const extractUploadthingKey = (fileUrl: string) => {
  if (!fileUrl) return null;
  try {
    const url = new URL(fileUrl);
    if (!uploadthingHosts.has(url.hostname)) return null;
    const key = url.pathname.split('/').filter(Boolean).at(-1);
    return key ? decodeURIComponent(key) : null;
  } catch {
    return null;
  }
};

export const deleteUploadthingFiles = async (urls: Array<string | null | undefined>) => {
  const keys = [...new Set(urls.map((url) => extractUploadthingKey(url || '')).filter((key): key is string => Boolean(key)))];
  if (!keys.length) return { deletedCount: 0 };
  if (!process.env.UPLOADTHING_TOKEN) throw new Error('UPLOADTHING_TOKEN belum diatur; pendaftaran tidak dihapus agar file bukti tidak menjadi yatim.');
  const result = await new UTApi().deleteFiles(keys);
  if (!result.success || result.deletedCount !== keys.length) throw new Error(`UploadThing hanya menghapus ${result.deletedCount} dari ${keys.length} file.`);
  return result;
};

export const getUploadthingFiles = async (limit: number, offset: number) => {
  if (!process.env.UPLOADTHING_TOKEN) throw new Error('UPLOADTHING_TOKEN belum diatur.');
  const api = new UTApi();
  const [usage, result] = await Promise.all([api.getUsageInfo(), api.listFiles({ limit, offset })]);
  return { usage, ...result };
};

export const deleteUploadthingFile = async (key: string) => {
  return deleteUploadthingFilesByKey([key]);
};

export const deleteUploadthingFilesByKey = async (keys: string[]) => {
  const uniqueKeys = [...new Set(keys)];
  if (!uniqueKeys.length || uniqueKeys.length > 100 || uniqueKeys.some((key) => !key || key.length > 512)) throw new Error('Kunci file tidak valid.');
  if (!process.env.UPLOADTHING_TOKEN) throw new Error('UPLOADTHING_TOKEN belum diatur.');
  const result = await new UTApi().deleteFiles(uniqueKeys);
  if (!result.success || result.deletedCount !== uniqueKeys.length) throw new Error(`UploadThing hanya menghapus ${result.deletedCount} dari ${uniqueKeys.length} file.`);
  return result;
};

export const streamUploadthingZip = async (keys: string[], res: Response) => {
  const uniqueKeys = [...new Set(keys)];
  if (!uniqueKeys.length || uniqueKeys.length > 25 || uniqueKeys.some((key) => !key || key.length > 512)) throw new Error('Pilih 1 sampai 25 file yang valid untuk diunduh.');
  if (!process.env.UPLOADTHING_TOKEN) throw new Error('UPLOADTHING_TOKEN belum diatur.');
  const api = new UTApi();
  res.attachment(`uploadthing-files-${new Date().toISOString().slice(0, 10)}.zip`);
  const archive = new ZipArchive({ zlib: { level: 6 } });
  archive.on('error', (error) => res.destroy(error));
  archive.pipe(res);
  const usedNames = new Set<string>();
  for (const [index, key] of uniqueKeys.entries()) {
    const fallbackName = `uploadthing-file-${index + 1}`;
    const originalName = decodeURIComponent(key.split('/').filter(Boolean).at(-1) || fallbackName).replace(/[\\/:*?"<>|]/g, '_');
    const name = usedNames.has(originalName) ? `${index + 1}-${originalName}` : originalName;
    usedNames.add(name);
    try {
      const { ufsUrl } = await api.generateSignedURL(key);
      const response = await fetch(ufsUrl);
      if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
      archive.append(Readable.fromWeb(response.body as never), { name });
    } catch (error) {
      archive.append(`Tidak dapat mengunduh ${key}: ${error instanceof Error ? error.message : 'unknown error'}`, { name: `GAGAL-${name}.txt` });
    }
  }
  await archive.finalize();
};

export const getUploadthingDownloadUrl = async (key: string) => {
  if (!key || key.length > 512) throw new Error('Kunci file tidak valid.');
  if (!process.env.UPLOADTHING_TOKEN) throw new Error('UPLOADTHING_TOKEN belum diatur.');
  return new UTApi().generateSignedURL(key);
};
