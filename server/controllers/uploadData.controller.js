import { generateUploadURL } from "../utils/utils.js";

export async function getUploadURL(req, res) {
  const { bucketName, objectKey, expires } = req.query;

  if (!bucketName || !objectKey || !expires) {
    return res.status(400).json({
      message: "Missing required parameters: bucketName, objectKey, or expires",
    });
  }

  try {
    const url = await generateUploadURL(bucketName, objectKey, expires);
    return res.status(200).json({
      message: "Pre-signed URL generated successfully",
      url,
    });
  } catch (error) {
    console.error("Failed to generate pre-signed URL:", error);
    return res.status(500).json({
      message: "Internal server error while generating pre-signed URL",
    });
  }
}
