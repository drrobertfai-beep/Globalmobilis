import { createServerFn } from "@tanstack/react-start";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

// Decode the UploadThing token
const TOKEN = process.env.UPLOADTHING_TOKEN || "";
let UT_CONFIG: { apiKey: string; appId: string; regions: string[] } | null = null;
try {
  if (TOKEN) {
    UT_CONFIG = JSON.parse(Buffer.from(TOKEN, "base64").toString());
  }
} catch {}

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || "";

/**
 * Upload file to Vercel Blob (REST API, no SDK needed).
 */
async function uploadToVercelBlob(
  buffer: Buffer,
  fileName: string,
  fileType: string,
): Promise<string | null> {
  if (!BLOB_TOKEN) return null;

  const ext = fileType.split("/")[1] || "bin";
  const pathname = `${randomUUID()}.${ext}`;

  const res = await fetch(
    `https://blob.vercel-storage.com/${pathname}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${BLOB_TOKEN}`,
        "x-api-version": "1",
        "Content-Type": fileType,
        "Content-Length": String(buffer.length),
      },
      body: buffer,
    }
  );

  if (!res.ok) return null;

  const result = (await res.json()) as any;
  return result.url || null;
}

/**
 * Upload file to UploadThing (legacy API).
 */
async function uploadToUploadThing(
  buffer: Buffer,
  fileName: string,
  fileType: string,
): Promise<string | null> {
  if (!UT_CONFIG) return null;

  try {
    const region = UT_CONFIG.regions[0] || "sea1";
    const formData = new FormData();
    formData.append("file", new Blob([buffer], { type: fileType }), fileName);

    const res = await fetch(
      `https://${region}.upload.uploadthing.com/api/upload`,
      {
        method: "POST",
        headers: { "x-uploadthing-api-key": UT_CONFIG.apiKey },
        body: formData,
      }
    );

    if (!res.ok) return null;

    const result = (await res.json()) as any;
    return result.url || result.ufsUrl || result.fileUrl || null;
  } catch {
    return null;
  }
}

/**
 * Server function to upload a file.
 * Tries: Vercel Blob → UploadThing → local filesystem fallback.
 */
export const uploadFile = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const { fileName, fileType, fileBase64 } = data as {
      fileName: string;
      fileType: string;
      fileBase64: string;
    };

    try {
      const base64Data = fileBase64.replace(/^data:.*,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // 1. Try Vercel Blob (best for production)
      const blobUrl = await uploadToVercelBlob(buffer, fileName, fileType);
      if (blobUrl) {
        return { success: true, url: blobUrl };
      }

      // 2. Try UploadThing
      const utUrl = await uploadToUploadThing(buffer, fileName, fileType);
      if (utUrl) {
        return { success: true, url: utUrl };
      }

      // 3. Local filesystem fallback
      const ext = fileType.split("/")[1] || "bin";
      const safeName = `${randomUUID()}.${ext}`;
      await mkdir(UPLOADS_DIR, { recursive: true });
      await writeFile(join(UPLOADS_DIR, safeName), buffer);

      return { success: true, url: `/uploads/${safeName}` };
    } catch (err: any) {
      return { success: false, error: err.message || "Upload failed" };
    }
  }
);
