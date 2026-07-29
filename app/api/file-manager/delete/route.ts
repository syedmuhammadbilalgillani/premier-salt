import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";

import { revalidateTag } from "next/cache";
import {
  deleteStoragePathRecursive,
  resolveStoragePathWithRelative,
} from "@/lib/storage-path";

// Auth is enforced by middleware.ts for /api/file-manager/*.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paths } = body; // Array of paths to delete

    if (!Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { success: false, error: "No paths provided" },
        { status: 400 },
      );
    }

    const deletedItems: string[] = [];
    const errors: string[] = [];

    // Delete each file/folder
    for (const filePath of paths) {
      try {
        const resolved = resolveStoragePathWithRelative(String(filePath));
        if (!resolved || !existsSync(resolved.fullPath)) {
          errors.push(`${filePath} - Not found`);
          continue;
        }
        const { fullPath, relative: normalizedPath } = resolved;

        // Delete file or folder recursively
        await deleteStoragePathRecursive(fullPath);
        deletedItems.push(normalizedPath);

        console.info("File or folder deleted", {
          path: normalizedPath,
          fullPath,
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Error deleting item", { path: filePath, error: message });
        errors.push(`${filePath} - ${message}`);
      }
    }

    // Revalidate the file manager page
    revalidateTag("file-manager", "max");

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedItems.length} item(s)`,
      deleted: deletedItems,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: unknown) {
    console.error("Error deleting files", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete files",
      },
      { status: 500 },
    );
  }
}
