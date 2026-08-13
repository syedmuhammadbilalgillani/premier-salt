import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import sharp from "sharp";
import { revalidateTag } from "next/cache";

import { getStorageUrl, resolveStoragePathWithRelative } from "@/lib/storage-path";

// Raster formats we transcode to WebP on upload. SVG is left untouched (it's
// already a small, resolution-independent vector format).
const CONVERTIBLE_IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".tiff",
  ".tif",
  ".avif",
  ".webp",
]);

// Max size per uploaded file (50 MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Extensions that browsers can execute as active content on this origin
const BLOCKED_EXTENSIONS = new Set([
  ".html",
  ".htm",
  ".xhtml",
  ".shtml",
  ".php",
  ".exe",
]);

// Auth is enforced by middleware.ts for /api/file-manager/*.
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const folderPath = formData.get("path") as string | null;
    const files = formData.getAll("files") as File[];
    const relativePaths = formData.getAll("relativePaths") as string[]; // For folder uploads

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 },
      );
    }

    const resolvedDir = resolveStoragePathWithRelative(folderPath || "");
    if (!resolvedDir) {
      return NextResponse.json(
        { success: false, error: "Invalid path" },
        { status: 400 },
      );
    }
    const { fullPath: targetDir, relative: normalizedPath } = resolvedDir;

    // Create directory if it doesn't exist
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true });
    }

    const uploadedFiles = [];

    // Upload each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relativePath = relativePaths[i] || file.name; // Use relative path if provided (folder upload)

      if (file.size > MAX_FILE_SIZE) {
        console.warn("Skipping oversized file", {
          fileName: file.name,
          size: file.size,
        });
        continue;
      }

      const ext = path.extname(relativePath).toLowerCase();
      if (BLOCKED_EXTENSIONS.has(ext)) {
        console.warn("Skipping file with blocked extension", { relativePath });
        continue;
      }

      // Normalize relative path, dropping any traversal segments
      const cleanRelativePath = relativePath
        .split(/[\\/]+/)
        .filter((segment) => segment && segment !== "." && segment !== "..")
        .join("/");
      if (!cleanRelativePath) continue;

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      let buffer = Buffer.from(bytes);

      // Every uploaded raster image is transcoded to WebP (quality 100) —
      // whatever format it arrives in — so the file extension on disk may
      // differ from what was uploaded. If conversion fails, fall back to
      // storing the original bytes under the original extension.
      let convertedToWebp = false;
      if (CONVERTIBLE_IMAGE_EXTENSIONS.has(ext)) {
        try {
          let pipeline = sharp(buffer).rotate();

          // For product images, apply "insta-fill" (pad to square with white background)
          if (folderPath === "products") {
            const metadata = await pipeline.metadata();
            const width = metadata.width || 0;
            const height = metadata.height || 0;
            const size = Math.max(width, height);
            if (size > 0) {
              pipeline = pipeline.resize(size, size, {
                fit: "contain",
                background: { r: 255, g: 255, b: 255, alpha: 1 },
              });
            }
          }

          buffer = await pipeline.webp({ quality: 100 }).toBuffer();
          convertedToWebp = true;
        } catch (error) {
          console.warn("Failed to convert image to WebP, storing as-is", {
            fileName: file.name,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
      const finalRelativePath = convertedToWebp
        ? cleanRelativePath.slice(0, -ext.length) + ".webp"
        : cleanRelativePath;

      // Build full file path
      const fullFilePath = path.resolve(targetDir, finalRelativePath);

      // Ensure the path is within the target directory
      if (!fullFilePath.startsWith(targetDir + path.sep)) {
        console.warn("Skipping file outside target directory", {
          relativePath,
          fullFilePath,
        });
        continue;
      }

      // Create directory structure if needed
      const fileDir = path.dirname(fullFilePath);
      if (!existsSync(fileDir)) {
        await mkdir(fileDir, { recursive: true });
      }

      // Write file
      await writeFile(fullFilePath, buffer);

      const storedPath = path
        .join(normalizedPath, finalRelativePath)
        .replace(/\\/g, "/");

      uploadedFiles.push({
        name: file.name,
        path: storedPath,
        url: getStorageUrl(storedPath),
        size: buffer.length,
      });

      console.info("File uploaded", {
        fileName: file.name,
        relativePath: cleanRelativePath,
        path: normalizedPath,
        size: buffer.length,
      });
    }

    // Revalidate the file manager page
    revalidateTag("file-manager", "max");

    return NextResponse.json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      files: uploadedFiles,
    });
  } catch (error: unknown) {
    console.error("Error uploading files", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload files",
      },
      { status: 500 },
    );
  }
}
