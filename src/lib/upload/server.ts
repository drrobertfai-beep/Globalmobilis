import { createServerFn } from "@tanstack/react-start";

// Decode the UploadThing token
const TOKEN = process.env.UPLOADTHING_TOKEN || "";
let UT_CONFIG: { apiKey: string; appId: string; regions: string[] } | null = null;
try {
  if (TOKEN) {
    UT_CONFIG = JSON.parse(Buffer.from(TOKEN, "base64").toString());
  }
} catch {}

/**
 * Server function to upload a file to UploadThing.
 * The client sends the file as base64, we upload to UploadThing and return the URL.
 */
export const uploadFile = createServerFn({ method: "POST" }).handler(
  async (data: unknown) => {
    const { fileName, fileType, fileBase64 } = data as {
      fileName: string;
      fileType: string;
      fileBase64: string;
    };

    if (!UT_CONFIG) {
      return { success: false, error: "UploadThing not configured" };
    }

    try {
      // Convert base64 to buffer
      const base64Data = fileBase64.replace(/^data:.*,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Upload to UploadThing
      const region = UT_CONFIG.regions[0] || "sea1";
      const formData = new FormData();
      const blob = new Blob([buffer], { type: fileType });
      formData.append("file", blob, fileName);

      const res = await fetch(`https://${region}.upload.uploadthing.com/api/upload`, {
        method: "POST",
        headers: { "x-uploadthing-api-key": UT_CONFIG.apiKey },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        return { success: false, error: `Upload failed: ${errText}` };
      }

      const result = await res.json();
      return { success: true, url: result.url || result.ufsUrl || result.fileUrl || "" };
    } catch (err: any) {
      return { success: false, error: err.message || "Upload failed" };
    }
  },
);