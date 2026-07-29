"use client";

import SafeImage from "@/components/safe-image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import {
  Archive,
  ArrowLeft,
  ArrowUpDown,
  CheckSquare,
  Download,
  FileAudio,
  FileCode,
  FileImage,
  FileText,
  FileVideo,
  Folder,
  FolderOpen,
  Grid3x3,
  List,
  RefreshCw,
  Search,
  Square,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number | null;
  modified: string;
  url: string | null;
}

interface FileManagerClientProps {
  initialData: {
    currentPath: string;
    items: FileItem[];
  };
}

type ViewMode = "grid" | "list";
type SortOption = "name" | "size" | "date" | "type";
type SortOrder = "asc" | "desc";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const iconMap: Record<string, React.ReactNode> = {
    // Images
    jpg: <FileImage className="h-5 w-5 text-green-500 dark:text-green-400" />,
    jpeg: <FileImage className="h-5 w-5 text-green-500 dark:text-green-400" />,
    png: <FileImage className="h-5 w-5 text-green-500 dark:text-green-400" />,
    gif: <FileImage className="h-5 w-5 text-green-500 dark:text-green-400" />,
    webp: <FileImage className="h-5 w-5 text-green-500 dark:text-green-400" />,
    svg: <FileImage className="h-5 w-5 text-green-500 dark:text-green-400" />,
    // Videos
    mp4: <FileVideo className="h-5 w-5 text-purple-500 dark:text-purple-400" />,
    avi: <FileVideo className="h-5 w-5 text-purple-500 dark:text-purple-400" />,
    mov: <FileVideo className="h-5 w-5 text-purple-500 dark:text-purple-400" />,
    wmv: <FileVideo className="h-5 w-5 text-purple-500 dark:text-purple-400" />,
    // Audio
    mp3: <FileAudio className="h-5 w-5 text-pink-500 dark:text-pink-400" />,
    wav: <FileAudio className="h-5 w-5 text-pink-500 dark:text-pink-400" />,
    flac: <FileAudio className="h-5 w-5 text-pink-500 dark:text-pink-400" />,
    // Archives
    zip: <Archive className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
    rar: <Archive className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
    "7z": <Archive className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
    tar: <Archive className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
    // Code
    js: <FileCode className="h-5 w-5 text-yellow-400 dark:text-yellow-300" />,
    ts: <FileCode className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
    jsx: <FileCode className="h-5 w-5 text-cyan-500 dark:text-cyan-400" />,
    tsx: <FileCode className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    py: <FileCode className="h-5 w-5 text-blue-400 dark:text-blue-300" />,
    html: <FileCode className="h-5 w-5 text-orange-500 dark:text-orange-400" />,
    css: <FileCode className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    json: <FileCode className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
  };
  return (
    iconMap[ext || ""] || <FileText className="h-5 w-5 text-muted-foreground" />
  );
}

export default function FileManagerClient({
  initialData,
}: FileManagerClientProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialData.items);
  const [currentPath, setCurrentPath] = useState(initialData.currentPath);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const refreshData = async (path?: string) => {
    setLoading(true);
    try {
      const url = path
        ? `/api/file-manager?path=${encodeURIComponent(path)}`
        : "/api/file-manager";
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setItems(result.data.items);
        setCurrentPath(result.data.currentPath);
        setSelectedItems(new Set());
      } else {
        toast.error(result.error || "Failed to load files");
      }
    } catch (error) {
      console.error("Error loading files:", error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (path: string) => {
    const newPath = path;
    router.push(`/admin/file-manager?path=${encodeURIComponent(newPath)}`);
    refreshData(newPath);
  };

  const handleGoBack = () => {
    const pathParts = currentPath.split("/").filter(Boolean);
    pathParts.pop();
    const newPath = pathParts.join("/");
    router.push(
      newPath
        ? `/admin/file-manager?path=${encodeURIComponent(newPath)}`
        : "/admin/file-manager",
    );
    refreshData(newPath);
  };

  const handleDelete = async (item: FileItem) => {
    if (
      !confirm(
        `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setDeleting(item.path);
    try {
      const response = await fetch(
        `/api/file-manager/${encodeURIComponent(item.path)}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (result.success) {
        toast.success(`"${item.name}" deleted successfully`);
        router.refresh();
        refreshData(currentPath);
      } else {
        toast.error(result.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (item: FileItem) => {
    try {
      const url = `/api/file-manager/download/${encodeURIComponent(item.path)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = item.isDirectory ? `${item.name}.zip` : item.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`"${item.name}" download started`);
    } catch (error) {
      console.error("Error downloading:", error);
      toast.error("Failed to download");
    }
  };

  const handleDownloadSelected = async () => {
    if (selectedItems.size === 0) {
      toast.error("Please select files or folders to download");
      return;
    }

    try {
      const response = await fetch("/api/file-manager/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paths: Array.from(selectedItems),
        }),
      });

      // Check if response is ok
      if (!response.ok) {
        // Try to parse error message from JSON response
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Download failed: ${response.statusText}`,
        );
      }

      // Check content type to ensure it's a zip file
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/zip")) {
        // If not a zip, it might be an error JSON response
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Server returned an invalid response",
        );
      }

      // Get the blob and create download
      const blob = await response.blob();

      // Check if blob is empty or too small (might be an error)
      if (blob.size === 0) {
        throw new Error("Downloaded file is empty");
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `files-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`Downloaded ${selectedItems.size} item(s) successfully`);
    } catch (error) {
      console.error("Error downloading:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to download files";
      toast.error(errorMessage);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size === 0) {
      toast.error("Please select files or folders to delete");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedItems.size} selected item(s)? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/file-manager/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paths: Array.from(selectedItems),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        if (result.errors && result.errors.length > 0) {
          toast.warning(
            `Some items could not be deleted: ${result.errors.join(", ")}`,
          );
        }
        router.refresh();
        refreshData(currentPath);
        setSelectedItems(new Set());
      } else {
        toast.error(result.error || "Failed to delete items");
      }
    } catch (error) {
      console.error("Error deleting items:", error);
      toast.error("Failed to delete items");
    }
  };

  const handleFileSelect = (item: FileItem) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(item.path)) {
      newSelected.delete(item.path);
    } else {
      newSelected.add(item.path);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredAndSortedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(
        new Set(filteredAndSortedItems.map((item) => item.path)),
      );
    }
  };

  const handleFileUpload = async (
    files: FileList | null,
    isFolder: boolean = false,
  ) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("path", currentPath);

      if (isFolder) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          formData.append("files", file);
          if ((file as File).webkitRelativePath) {
            formData.append("relativePaths", (file as File).webkitRelativePath);
          } else {
            formData.append("relativePaths", file.name);
          }
        }
      } else {
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }
      }

      const response = await fetch("/api/file-manager/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        router.refresh();
        refreshData(currentPath);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (folderInputRef.current) {
          folderInputRef.current.value = "";
        }
      } else {
        toast.error(result.error || "Failed to upload files");
      }
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Failed to upload files");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const hasFolderStructure = Array.from(e.dataTransfer.files).some(
        (file: File) =>
          file.webkitRelativePath && file.webkitRelativePath.includes("/"),
      );
      handleFileUpload(e.dataTransfer.files, hasFolderStructure);
    }
  };

  const isImageFile = (fileName: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    return imageExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));
  };

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort items
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "size":
          comparison = (a.size || 0) - (b.size || 0);
          break;
        case "date":
          comparison =
            new Date(a.modified).getTime() - new Date(b.modified).getTime();
          break;
        case "type":
          comparison = a.isDirectory
            ? b.isDirectory
              ? 0
              : -1
            : b.isDirectory
              ? 1
              : a.name.localeCompare(b.name);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [items, searchQuery, sortBy, sortOrder]);

  const breadcrumbs = currentPath
    ? ["", ...currentPath.split("/").filter(Boolean)]
    : [""];

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(option);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            File Manager
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refreshData(currentPath)}
            disabled={loading}
            className="h-8 w-8 p-0"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedItems.size > 0 && (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                className="h-9"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Delete</span>
                <span className="sm:hidden">({selectedItems.size})</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadSelected}
                disabled={selectedItems.size === 0}
                className="h-9"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden">({selectedItems.size})</span>
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => folderInputRef.current?.click()}
            disabled={uploading}
            className="h-9"
          >
            <Folder className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Upload Folder</span>
            <span className="sm:hidden">Folder</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="h-9"
          >
            <Upload className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Upload Files</span>
            <span className="sm:hidden">Files</span>
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files, false)}
            disabled={uploading}
          />
          <input
            ref={folderInputRef}
            type="file"
            {...({
              webkitdirectory: "",
              directory: "",
            } as React.InputHTMLAttributes<HTMLInputElement>)}
            multiple
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files, true)}
            disabled={uploading}
          />
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              Uploading files...
            </span>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {uploadProgress}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm flex-wrap">
        {currentPath && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="h-8"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {breadcrumbs.map((crumb, index) => {
            const pathUpToCrumb = breadcrumbs.slice(0, index + 1).join("/");
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && <span className="text-muted-foreground">/</span>}
                {isLast ? (
                  <span className="font-semibold text-foreground px-2 py-1 rounded bg-muted">
                    {crumb || "Storage"}
                  </span>
                ) : (
                  <button
                    onClick={() => handleNavigate(pathUpToCrumb)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline px-2 py-1 rounded hover:bg-accent transition-colors"
                  >
                    {crumb || "Storage"}
                  </button>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Search, Sort, and View Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Select All */}
          {filteredAndSortedItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="h-9"
            >
              {selectedItems.size === filteredAndSortedItems.length ? (
                <CheckSquare className="h-4 w-4 mr-2" />
              ) : (
                <Square className="h-4 w-4 mr-2" />
              )}
              <span className="hidden sm:inline">
                {selectedItems.size === filteredAndSortedItems.length
                  ? "Deselect All"
                  : "Select All"}
              </span>
            </Button>
          )}

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSort("name")}
              className={`h-9 text-xs ${
                sortBy === "name"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Name
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSort("size")}
              className={`h-9 text-xs ${
                sortBy === "size"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Size
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSort("date")}
              className={`h-9 text-xs ${
                sortBy === "date"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Date
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-md p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
              title="Grid View"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
              title="List View"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 md:p-8 text-center transition-all ${
          dragActive
            ? "border-blue-500 dark:border-blue-400 bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 shadow-lg scale-[1.02]"
            : "border-border bg-muted/50 hover:border-primary/50"
        }`}
      >
        <Upload
          className={`h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 transition-transform ${
            dragActive
              ? "text-blue-500 dark:text-blue-400 scale-110"
              : "text-muted-foreground"
          }`}
        />
        <p className="text-foreground font-medium mb-1">
          Drag and drop files here
        </p>
        <p className="text-sm text-muted-foreground">
          or click &quot;Upload Files&quot; button above
        </p>
      </div>

      {/* File List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      ) : filteredAndSortedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-muted rounded-full p-6 mb-4">
            <Folder className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {searchQuery ? "No files found" : "This folder is empty"}
          </h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {searchQuery
              ? `No files match "${searchQuery}". Try a different search term.`
              : "Upload files or create folders to get started."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {filteredAndSortedItems.map((item) => (
            <div
              key={item.path}
              className={`group border rounded-lg p-4 hover:shadow-lg transition-all duration-200 bg-card ${
                selectedItems.has(item.path)
                  ? "ring-2 ring-blue-500 dark:ring-blue-400 shadow-md"
                  : "hover:border-primary/50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Checkbox
                    checked={selectedItems.has(item.path)}
                    onCheckedChange={() => handleFileSelect(item)}
                    className="shrink-0"
                  />
                  {item.isDirectory ? (
                    <FolderOpen className="h-6 w-6 text-blue-500 dark:text-blue-400 shrink-0" />
                  ) : (
                    <div className="shrink-0">{getFileIcon(item.name)}</div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-medium truncate"
                      title={item.name}
                    >
                      {item.name}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(item)}
                    className="h-7 w-7 p-0 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-accent"
                    title="Download"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item)}
                    disabled={deleting === item.path}
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {item.isDirectory ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigate(item.path)}
                  className="w-full mt-2"
                >
                  <Folder className="h-4 w-4 mr-2" />
                  Open
                </Button>
              ) : (
                <div className="space-y-2 mt-3">
                  {item.size !== null && (
                    <p className="text-xs text-muted-foreground font-medium">
                      {formatFileSize(item.size)}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/70">
                    {formatDistanceToNow(new Date(item.modified), {
                      addSuffix: true,
                    })}
                  </p>
                  {item.url && isImageFile(item.name) && (
                    <div className="mt-2 rounded overflow-hidden border border-border">
                      <SafeImage
                        src={item.url}
                        alt={item.name}
                        className="w-full h-32 object-cover"
                        height={100}
                        width={100}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-card">
          <div className="divide-y divide-border">
            {filteredAndSortedItems.map((item) => (
              <div
                key={item.path}
                className={`group flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors ${
                  selectedItems.has(item.path) ? "bg-accent" : ""
                }`}
              >
                <Checkbox
                  checked={selectedItems.has(item.path)}
                  onCheckedChange={() => handleFileSelect(item)}
                  className="shrink-0"
                />
                <div className="shrink-0">
                  {item.isDirectory ? (
                    <FolderOpen className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  ) : (
                    getFileIcon(item.name)
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p
                      className="font-medium text-sm truncate flex-1"
                      title={item.name}
                    >
                      {item.name}
                    </p>
                    {item.size !== null && (
                      <span className="text-xs text-muted-foreground font-mono shrink-0">
                        {formatFileSize(item.size)}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground/70 shrink-0 hidden md:inline">
                      {formatDistanceToNow(new Date(item.modified), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.isDirectory ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigate(item.path)}
                      className="h-8"
                    >
                      <Folder className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(item)}
                        className="h-8 w-8 p-0 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-accent"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        disabled={deleting === item.path}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      {!loading && filteredAndSortedItems.length > 0 && (
        <div className="text-sm text-muted-foreground text-center py-2">
          Showing {filteredAndSortedItems.length} of {items.length} item
          {items.length !== 1 ? "s" : ""}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}
    </div>
  );
}
