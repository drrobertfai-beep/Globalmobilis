import { createServerFn } from "@tanstack/react-start";

/**
 * Server function for file upload simulation.
 * For now, stores file URLs (since we don't have actual file storage).
 * In production, this would upload to S3/Cloudinary and return the URL.
 */
export const uploadFile = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const { fileData, fileName, fileType } = data as {
      fileData: string;
      fileName: string;
      fileType: "photo" | "video";
    };

    if (!fileData) {
      return { success: false, url: null, error: "No file data provided" };
    }

    // Validate file type
    if (fileType === "photo" && !fileData.startsWith("data:image/")) {
      return { success: false, url: null, error: "Invalid image format. Please upload a JPEG, PNG, or WebP image." };
    }
    if (fileType === "video" && !fileData.startsWith("data:video/")) {
      return { success: false, url: null, error: "Invalid video format. Please upload an MP4 or WebM video." };
    }

    try {
      // For now, return a placeholder URL
      // In production, this would upload to cloud storage
      const timestamp = Date.now();
      const extension = fileName.split(".").pop() || (fileType === "photo" ? "jpg" : "mp4");
      const url = `/uploads/${fileType}s/${timestamp}_${fileName}`;
      
      return { success: true, url, error: null };
    } catch (err: any) {
      console.error("Upload error:", err);
      return { success: false, url: null, error: err.message || "Upload failed" };
    }
  },
);