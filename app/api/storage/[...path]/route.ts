import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import logger from "@/lib/logger";
import { resolveStoragePathWithRelative } from "@/lib/storage-path";

// MIME type mapping. HTML/JS are intentionally absent — anything not listed
// is served as a download to prevent stored XSS on this origin.
const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".css": "text/css",
  ".json": "application/json",
};

// Types that may contain scripts; never render inline on direct navigation.
// (Content-Disposition is ignored for <img> subresource loads, so SVGs
// still work as images.)
const FORCE_DOWNLOAD_TYPES = new Set(["image/svg+xml"]);

/**
 * Serve storage files
 * GET /api/storage/[...path]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const filePath = pathSegments.join("/");

    const resolved = resolveStoragePathWithRelative(filePath);
    if (!resolved) {
      logger.warn("Attempted access outside storage base", {
        requestedPath: filePath,
      });
      return NextResponse.json(
        { success: false, error: "Invalid path" },
        { status: 400 }
      );
    }
    const { fullPath, relative: normalizedPath } = resolved;

    // Check if file exists
    if (!existsSync(fullPath)) {
      logger.warn("File not found in storage", {
        requestedPath: filePath,
        fullPath,
      });
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = await readFile(fullPath);

    // Determine content type
    const ext = path.extname(fullPath).toLowerCase();
    const contentType =
      MIME_TYPES[ext] || "application/octet-stream";

    // Set cache headers for images (1 year cache for images)
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("X-Content-Type-Options", "nosniff");

    if (
      contentType === "application/octet-stream" ||
      FORCE_DOWNLOAD_TYPES.has(contentType)
    ) {
      headers.set(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(path.basename(fullPath))}"`
      );
    }

    if (contentType.startsWith("image/")) {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    } else {
      headers.set("Cache-Control", "public, max-age=3600");
    }

    logger.debug("Serving storage file", {
      path: normalizedPath,
      contentType,
      size: fileBuffer.length,
    });

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    logger.error("Error serving storage file", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to serve file",
      },
      { status: 500 }
    );
  }
}

