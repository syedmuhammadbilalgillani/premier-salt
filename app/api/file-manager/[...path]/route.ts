import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "fs";
import { revalidateTag } from "next/cache";
import {
  deleteStoragePathRecursive,
  resolveStoragePathWithRelative,
} from "@/lib/storage-path";

// Auth is enforced by middleware.ts for /api/file-manager/*.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path: pathSegments } = await params;
    const resolved = resolveStoragePathWithRelative(pathSegments.join("/"));
    if (!resolved) {
      return NextResponse.json(
        { success: false, error: "Invalid path" },
        { status: 400 },
      );
    }
    const { fullPath, relative: normalizedPath } = resolved;

    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { success: false, error: "File or folder not found" },
        { status: 404 },
      );
    }

    // Delete file or folder recursively
    await deleteStoragePathRecursive(fullPath);

    console.info("File or folder deleted", {
      path: normalizedPath,
      fullPath,
    });

    // Revalidate the file manager page
    revalidateTag("file-manager", "max");

    return NextResponse.json({
      success: true,
      message: "File or folder deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error deleting file or folder", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete file or folder",
      },
      { status: 500 },
    );
  }
}
