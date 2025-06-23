import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToR2(
  key: string, 
  buffer: Buffer, 
  contentType: string = 'image/png'
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  
  // Return public URL (vi använder inte public domain än)
  return `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET_NAME}/${key}`;
}

export async function generateDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  });

  // 24 hours expiry for download links
  return await getSignedUrl(s3Client, command, { expiresIn: 86400 });
}

export async function dataUrlToR2(dataUrl: string, key: string): Promise<string> {
  // Convert data URL to buffer
  const base64Data = dataUrl.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');
  
  return await uploadToR2(key, buffer, 'image/png');
}
