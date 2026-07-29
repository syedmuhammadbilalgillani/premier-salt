import { resolveStoragePathWithRelative } from "@/lib/storage-path";
import { Archiver, ArchiverError, ZipArchive } from "archiver";
import { existsSync } from "fs";
import { readdir, stat } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const archive = new ZipArchive({
  zlib: { level: 9 },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paths } = body; // Array of paths to download
    console.info("Downloading files", { paths });

    if (!Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { success: false, error: "No paths provided" },
        { status: 400 },
      );
    }

    // const archive = archiver("zip", { zlib: { level: 9 } });

    const chunks: Buffer[] = [];

    // Set up event listeners BEFORE adding files
    const archivePromise = new Promise<void>((resolve, reject) => {
      archive.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      archive.on("end", () => {
        console.info("Archive finalized successfully");
        resolve();
      });

      archive.on("error", (err: ArchiverError) => {
        console.error("Archive error", { error: err });
        reject(err);
      });
    });

    // Add each file/folder to the archive
    for (const filePath of paths) {
      const resolved = resolveStoragePathWithRelative(String(filePath));
      if (!resolved || !existsSync(resolved.fullPath)) {
        console.warn("Skipping invalid path", { filePath });
        continue; // Skip invalid paths
      }
      const { fullPath, relative: normalizedPath } = resolved;

      const archiveName = path.basename(normalizedPath) || "file";

      try {
        await addToArchive(archive, fullPath, archiveName);
      } catch (error) {
        console.error("Error adding to archive", { error, fullPath });
        // Continue with other files even if one fails
      }
    }

    // Finalize the archive
    await archive.finalize();

    // Wait for archive to finish
    await archivePromise;

    const zipBuffer = Buffer.concat(chunks);
    const zipFileName = `files-${Date.now()}.zip`;

    console.info("Download complete", {
      zipFileName,
      size: zipBuffer.length,
      fileCount: paths.length,
    });
    console.info("Download complete", {
      zipFileName,
      size: zipBuffer.length,
      fileCount: paths.length,
    });
    console.debug(zipBuffer, "zip buffer");
    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          zipFileName,
        )}"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    console.error("Error downloading files", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to download files",
      },
      { status: 500 },
    );
  }
}
