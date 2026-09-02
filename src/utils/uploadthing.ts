import { generateUploadButton, generateUploadDropzone } from '@uploadthing/react';
import { genUploader } from 'uploadthing/client';
import type { OurFileRouter } from '../../server/uploadthing';

export const UploadButton = generateUploadButton<OurFileRouter>({
  url: '/api/uploadthing',
});

export const UploadDropzone = generateUploadDropzone<OurFileRouter>({
  url: '/api/uploadthing',
});

export const { uploadFiles } = genUploader<OurFileRouter>({
  url: '/api/uploadthing',
  package: '@uploadthing/react',
});
