import axios from "axios";

export async function fetchPresignedUrl(objectKey) {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/getPresignedURL`, {
      params: {
        bucketName: "job-seekers-data",
        objectKey,
        expires: 3600,
      },
    });

    return response.data.url;
  } catch (error) {
    console.error("Error fetching pre-signed URL:", error);
    throw error;
  }
}

export async function uploadToS3(url, file, contentType) {
  try {
    const response = await axios.put(url, file, {
      headers: {
        "Content-Type": contentType,
      },
    });
    console.log("File uploaded successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to upload file:", error);
    return error.response;
  }
}

