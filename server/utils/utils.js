import { S3Client,PutObjectCommand  } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});


export async function generateUploadURL(bucketName, objectKey, expires) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
  });

  try {
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expires,
    });
    return signedUrl;
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw new Error("Cannot generate pre-signed URL");
  }
}
