import { createUploadthing, type FileRouter } from 'uploadthing/express';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import type { Request } from 'express';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const f = createUploadthing();

const requireAdminUpload = async ({ req }: { req: Request }) => {
  const cookie = req.headers.cookie || '';
  const authorization = req.headers.authorization || '';
  const cookieToken = cookie.match(/(?:^|;\s*)auth_token=([^;]+)/)?.[1];
  const token = cookieToken ? decodeURIComponent(cookieToken) : authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) {
    throw new Error('Unauthorized');
  }
  jwt.verify(token, secret);
  return { authorized: true };
};

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
  }).middleware(requireAdminUpload).onUploadComplete(async ({ file }) => {
    console.log('Media upload complete:', file.ufsUrl || file.url);
    return { url: file.ufsUrl || file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
