import { createReadStream, existsSync } from "fs";
import { readdir, stat } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { resolveStoragePathWithRelative } from "@/lib/storage-path";
import { Archiver, ZipArchive } from "archiver";
const archive = new ZipArchive({
  zlib: { level: 9 }, // Sets the compression level.
});

async function addToArchive(
  archive: Archiver,
  filePath: string,
  archivePath: string,
) {
  const stats = await stat(filePath);

  if (stats.isDirectory()) {
    const files = await readdir(filePath);
    for (const file of files) {
      const fileFullPath = path.join(filePath, file);
      const fileArchivePath = path.join(archivePath, file);
      await addToArchive(archive, fileFullPath, fileArchivePath);
    }
  } else {
    archive.file(filePath, { name: archivePath });
  }
}

export async function GET(
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

    const stats = await stat(fullPath);
    const fileName = path.basename(normalizedPath) || "storage";

    // If it's a file, stream it directly
    if (stats.isFile()) {
      const fileStream = createReadStream(fullPath);
      const response = new NextResponse(fileStream as any);
      response.headers.set("Content-Type", "application/octet-stream");
      response.headers.set(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(path.basename(fullPath))}"`,
      );
      return response;
    }

    // If it's a directory, create a ZIP archive
    const zipFileName = `${fileName}.zip`;

    // Create a readable stream for the archive
    const chunks: Buffer[] = [];
    archive.on("data", (chunk) => chunks.push(chunk));
    archive.on("end", () => {});

    // Add files to archive
    await addToArchive(archive, fullPath, fileName);
    await archive.finalize();

    // Wait for archive to finish and collect all chunks
    await new Promise((resolve) => archive.on("end", resolve));

    const zipBuffer = Buffer.concat(chunks);

    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(zipFileName)}"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error downloading:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to download",
      },
      { status: 500 },
    );
  }
}
