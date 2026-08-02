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

/**
 * Server function to upload a file.
 * Saves locally to public/uploads/ and returns a URL.
 * Also attempts UploadThing if configured.
 */
export const uploadFile = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const { fileName, fileType, fileBase64 } = data as {
      fileName: string;
      fileType: string;
      fileBase64: string;
    };

    try {
      // Convert base64 to buffer
      const base64Data = fileBase64.replace(/^data:.*,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Determine extension from file type
      const ext = fileType.split("/")[1] || "bin";
      const safeName = `${randomUUID()}.${ext}`;

      // Save to public/uploads/ — always works as fallback
      await mkdir(UPLOADS_DIR, { recursive: true });
      await writeFile(join(UPLOADS_DIR, safeName), buffer);
      const localUrl = `/uploads/${safeName}`;

      // Also try UploadThing if configured
      if (UT_CONFIG) {
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

          if (res.ok) {
            const result = (await res.json()) as any;
            const utUrl =
              result.url || result.ufsUrl || result.fileUrl || localUrl;
            return { success: true, url: utUrl };
          }
        } catch {
          // UploadThing failed, fall through to local URL
        }
      }

      return { success: true, url: localUrl };
    } catch (err: any) {
      return { success: false, error: err.message || "Upload failed" };
    }
  }
);
