import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// File router for review photos and videos
export const ourFileRouter = {
  reviewImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl || file.url };
    }),
  reviewVideo: f({ video: { maxFileSize: "32MB", maxFileCount: 1 } })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl || file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;