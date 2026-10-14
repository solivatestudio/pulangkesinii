import heic2any from 'heic2any';

export interface ImageOptimizationOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
}

const DEFAULT_MAX_SIZE_MB = 4;
const DEFAULT_MAX_DIMENSION = 1920;
const DEFAULT_QUALITY = 0.82;

/**
 * Checks if a file is an image based on mime type or file extension.
 */
export const isImageFile = (file: File): boolean => {
  if (file.type && file.type.startsWith('image/')) return true;
  return /\.(jpe?g|png|webp|heic|heif|gif)$/i.test(file.name);
};

/**
 * Checks if a file is in HEIC / HEIF format.
 */
export const isHeicFile = (file: File): boolean => {
  return (
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    /\.(heic|heif)$/i.test(file.name)
  );
};

/**
 * Converts any supported image (PNG, JPEG, HEIC, WebP) up to 4MB into an optimized WebP File.
 */
export async function optimizeImageToWebp(
  file: File,
  options?: ImageOptimizationOptions
): Promise<File> {
  const maxSizeMB = options?.maxSizeMB ?? DEFAULT_MAX_SIZE_MB;
  const maxDimension = options?.maxWidthOrHeight ?? DEFAULT_MAX_DIMENSION;
  const quality = options?.quality ?? DEFAULT_QUALITY;

  // 1. Validasi Tipe File
  if (!isImageFile(file)) {
    throw new Error(`Format file "${file.name}" tidak didukung. Harap gunakan format JPG, PNG, HEIC, atau WebP.`);
  }

  // 2. Validasi Ukuran File Mentah (Max 4MB default)
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`Ukuran file "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal ${maxSizeMB} MB.`);
  }

  // 3. Konversi HEIC jika diperlukan
  let sourceBlob: Blob = file;
  if (isHeicFile(file)) {
    try {
      const conversionResult = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });
      sourceBlob = Array.isArray(conversionResult) ? conversionResult[0] : conversionResult;
    } catch (err: unknown) {
      console.error('HEIC conversion error:', err);
      throw new Error(`Gagal memproses file HEIC "${file.name}". Pastikan file gambar tidak rusak.`);
    }
  }

  // 4. Muat gambar ke HTMLImageElement untuk resize & konversi WebP via Canvas
  const objectUrl = URL.createObjectURL(sourceBlob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Gagal memuat gambar "${file.name}" untuk diproses.`));
      img.src = objectUrl;
    });

    let { width, height } = image;

    // Resize proporsional jika resolusi melebihi maxDimension (1920px)
    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Tidak dapat menginisialisasi canvas grafis untuk optimasi gambar.');
    }

    // Gambar ke canvas
    ctx.drawImage(image, 0, 0, width, height);

    // 5. Ekspor ke Blob format image/webp
    const webpBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/webp', quality);
    });

    if (!webpBlob) {
      // Fallback jika browser sangat tua dan tidak support canvas webp
      return file;
    }

    // Nama file baru dengan ekstensi .webp
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const newFileName = `${baseName}.webp`;

    return new File([webpBlob], newFileName, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Optimizes an array of files into WebP format.
 */
export async function optimizeImages(
  files: File[],
  options?: ImageOptimizationOptions
): Promise<File[]> {
  return Promise.all(files.map((f) => optimizeImageToWebp(f, options)));
}
