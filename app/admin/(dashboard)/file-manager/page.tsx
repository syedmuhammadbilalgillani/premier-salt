import { unstable_cache } from "next/cache";
import { readdir, stat } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import FileManagerClient from "./file-manager-client";

const STORAGE_BASE = process.env.STORAGE_BASE_PATH
  ? process.env.STORAGE_BASE_PATH
  : path.join(process.cwd(), "public", "storage");

const getCachedFileList = unstable_cache(
  async (folderPath: string = "") => {
    // Prevent directory traversal
    const normalizedPath = folderPath
      .split(path.sep)
      .filter((segment) => segment && segment !== "..")
      .join(path.sep);

    const fullPath = path.join(STORAGE_BASE, normalizedPath);

    // Ensure the path is within storage base
    if (!fullPath.startsWith(STORAGE_BASE) || !existsSync(fullPath)) {
      return { currentPath: "", items: [] };
    }

    try {
      const stats = await stat(fullPath);
      if (!stats.isDirectory()) {
        return { currentPath: normalizedPath, items: [] };
      }

      const items = await readdir(fullPath);
      const filesAndFolders = await Promise.all(
        items.map(async (item) => {
          const itemPath = path.join(fullPath, item);
          const itemStats = await stat(itemPath);
          const relativePath = path.join(normalizedPath, item).replace(/\\/g, "/");

          return {
            name: item,
            path: relativePath,
            isDirectory: itemStats.isDirectory(),
            size: itemStats.isFile() ? itemStats.size : null,
            modified: itemStats.mtime.toISOString(),
            url: relativePath ? `/storage/${relativePath}` : null,
          };
        })
      );

      // Sort: folders first, then files
      filesAndFolders.sort((a, b) => {
        if (a.isDirectory !== b.isDirectory) {
          return a.isDirectory ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      return {
        currentPath: normalizedPath,
        items: filesAndFolders,
      };
    } catch (error) {
      return { currentPath: normalizedPath, items: [] };
    }
  },
  ["file-manager-list"],
  {
    tags: ["file-manager"],
    revalidate: 60, // Revalidate every minute
  }
);

interface PageProps {
  searchParams: Promise<{ path?: string }>;
}

export default async function FileManagerPage({ searchParams }: PageProps) {
  const { path: folderPath = "" } = await searchParams;
  const data = await getCachedFileList(folderPath);

  return <FileManagerClient initialData={data} />;
}

export const revalidate = 60;
