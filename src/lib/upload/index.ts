/**
 * UploadThing configuration and upload helpers.
 * Uses direct UFS upload API for simplicity.
 */

// Decode the UploadThing token to get config
const TOKEN = process.env.UPLOADTHING_TOKEN || "";
let _config: { apiKey: string; appId: string; regions: string[] } | null = null;
try {
  if (TOKEN) {
    _config = JSON.parse(Buffer.from(TOKEN, "base64").toString());
  }
} catch {}

export const utConfig = _config;

// UploadThing upload URL for the configured region
function getUploadUrl() {
  const region = utConfig?.regions?.[0] || "sea1";
  return `https://${region}.upload.uploadthing.com`;
}

/**
 * Server-side function to upload a file to UploadThing.
 * Call from a TanStack Start server function.
 */
export async function uploadFileToUT(fileBuffer: ArrayBuffer, fileName: string, fileType: string) {
  if (!utConfig) {
    throw new Error("UploadThing not configured (missing UPLOADTHING_TOKEN)");
  }

  const blob = new Blob([fileBuffer], { type: fileType });
  const formData = new FormData();
  formData.append("file", blob, fileName);

  const res = await fetch(`${getUploadUrl()}/api/upload`, {
    method: "POST",
    headers: {
      "x-uploadthing-api-key": utConfig.apiKey,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed: ${res.status} - ${err}`);
  }

  const data = await res.json();
  return data;
}