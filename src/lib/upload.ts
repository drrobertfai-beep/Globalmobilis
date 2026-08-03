import { createServerFn } from "@tanstack/react-start";

/** Coerce a FormData value to string (or undefined). */
function str(v: FormDataEntryValue | null): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}
/**
 * Extract string fields from a server-fn payload, tolerant of every shape the
 * framework can deliver: a raw FormData, `{ data: FormData, context, method }`,
 * `{ data: { ...fields } }`, or a bare `{ ...fields }` object. (POST args are
 * sent as FormData because this server build can't parse the seroval JSON
 * envelope the client's createServerFn serialization produces.)
 */
function getStrField(data: unknown, key: string): string | undefined {
  if (data instanceof FormData) return str(data.get(key));
  const obj = (data ?? {}) as Record<string, unknown>;
  const inner = obj.data;
  if (inner instanceof FormData) return str(inner.get(key));
  const src = (inner && typeof inner === "object" ? inner : obj) as Record<string, unknown>;
  return typeof src[key] === "string" ? (src[key] as string) : undefined;
}

/**
 * Server function for file upload simulation.
 * For now, stores file URLs (since we don't have actual file storage).
 * In production, this would upload to S3/Cloudinary and return the URL.
 */
export const uploadFile = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const fileData = getStrField(data, "fileData") ?? "";
    const fileName = getStrField(data, "fileName") ?? "";
    const fileType = getStrField(data, "fileType") as "photo" | "video" | undefined;

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