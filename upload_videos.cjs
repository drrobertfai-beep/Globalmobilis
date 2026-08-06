const { put } = require("@vercel/blob");
const { readFileSync } = require("fs");

async function main() {
  const video1 = readFileSync("/home/team/shared/site/public/videos/v1.mp4");
  const video2 = readFileSync("/home/team/shared/site/public/videos/v2.mp4");

  console.log("Uploading video 1 (39MB)...");
  const { url: url1 } = await put("Global mobilis new videos/clean_v1.mp4", video1, {
    access: "public",
    token: process.env.VERCEL_TOKEN,
    storeId: "store_NyZ3d0uNiIWOjLDF",
  });
  console.log("Video 1:", url1);

  console.log("Uploading video 2 (45MB)...");
  const { url: url2 } = await put("Global mobilis new videos/clean_v2.mp4", video2, {
    access: "public",
    token: process.env.VERCEL_TOKEN,
    storeId: "store_NyZ3d0uNiIWOjLDF",
  });
  console.log("Video 2:", url2);
}

main().catch(console.error);
