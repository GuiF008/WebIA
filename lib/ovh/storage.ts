import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import type { StorageUploadFile } from '@/types/ovh';

const s3 = new S3Client({
  region: process.env.OVH_STORAGE_REGION!,
  endpoint: process.env.OVH_STORAGE_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.OVH_S3_ACCESS_KEY!,
    secretAccessKey: process.env.OVH_S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.OVH_STORAGE_BUCKET!;

export async function uploadSite(
  projectId: string,
  files: StorageUploadFile[]
): Promise<string> {
  await Promise.all(
    files.map((file) =>
      s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: `sites/${projectId}/${file.key}`,
          Body: Buffer.from(file.content, 'utf-8'),
          ContentType: file.contentType,
          ACL: 'public-read',
          CacheControl:
            file.key === 'index.html' ? 'no-cache' : 'public, max-age=86400',
        })
      )
    )
  );

  return `${process.env.OVH_STORAGE_ENDPOINT}/${BUCKET_NAME}/sites/${projectId}/index.html`;
}
