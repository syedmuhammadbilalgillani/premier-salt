import { NextRequest, NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

import { getStorageUrl, resolveStoragePathWithRelative } from "@/lib/storage-path";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const folderPath = searchParams.get("path") || "";

    const resolved = resolveStoragePathWithRelative(folderPath);
    if (!resolved) {
      return NextResponse.json(
        { success: false, error: "Invalid path" },
        { status: 400 },
      );
    }
    const { fullPath, relative: normalizedPath } = resolved;

    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { success: false, error: "Path not found" },
        { status: 404 },
      );
    }

    const stats = await stat(fullPath);
    if (!stats.isDirectory()) {
      return NextResponse.json(
        { success: false, error: "Path is not a directory" },
        { status: 400 },
      );
    }

    const items = await readdir(fullPath);
    const filesAndFolders = await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(fullPath, item);
        const itemStats = await stat(itemPath);
        const relativePath = path
          .join(normalizedPath, item)
          .replace(/\\/g, "/");

        return {
          name: item,
          path: relativePath,
          isDirectory: itemStats.isDirectory(),
          size: itemStats.isFile() ? itemStats.size : null,
          modified: itemStats.mtime.toISOString(),
          url: relativePath ? getStorageUrl(relativePath) : null,
        };
      }),
    );

    // Sort: folders first, then files, both alphabetically
    filesAndFolders.sort((a, b) => {
      if (a.isDirectory !== b.isDirectory) {
        return a.isDirectory ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

    console.info("File manager listing", {
      path: normalizedPath,
      count: filesAndFolders.length,
    });

    return NextResponse.json({
      success: true,
      data: {
        currentPath: normalizedPath,
        items: filesAndFolders,
      },
    });
  } catch (error: unknown) {
    console.error("Error listing files", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to list files",
      },
      { status: 500 },
    );
  }
}
