import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { revalidateTag } from "next/cache";

import { getStorageUrl, resolveStoragePathWithRelative } from "@/lib/storage-path";

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

      // Build full file path
      const fullFilePath = path.resolve(targetDir, cleanRelativePath);

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

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Write file
      await writeFile(fullFilePath, buffer);

      const storedPath = path
        .join(normalizedPath, cleanRelativePath)
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
