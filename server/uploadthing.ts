import { createUploadthing, type FileRouter } from 'uploadthing/express';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const f = createUploadthing();

export const uploadRouter = {
  proofUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ file }) => {
    console.log('Proof upload complete:', file.ufsUrl || file.url);
    return { url: file.ufsUrl || file.url };
  }),

  mediaUploader: f({
    image: {
      maxFileSize: '8MB',
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ file }) => {
    console.log('Media upload complete:', file.ufsUrl || file.url);
    return { url: file.ufsUrl || file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
