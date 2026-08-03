"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import type { getCachedBlogPosts } from "@/lib/blog";

type BlogPost = Awaited<ReturnType<typeof getCachedBlogPosts>>[number];

const STATUS_VARIANT: Record<BlogPost["status"], "secondary" | "outline"> = {
  draft: "outline",
  published: "secondary",
};

const STATUS_LABEL: Record<BlogPost["status"], string> = {
  draft: "Draft",
  published: "Published",
};

export function BlogPostsTable({ data }: { data: BlogPost[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(post: BlogPost) {
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) {
      return;
    }

    setDeletingId(post.id);
    try {
      const response = await fetch(`/api/blog/${post.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Could not delete the blog post.");
        return;
      }

      toast.success("Blog post deleted.");
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  const columns: DataTableColumn<BlogPost>[] = [
    {
      id: "coverImage",
      header: "Image",
      type: "image",
      accessor: (row) => row.coverImage,
      width: 72,
    },
    {
      id: "title",
      header: "Title",
      accessor: (row) => row.title,
    },
    {
      id: "categoryTitle",
      header: "Category",
      accessor: (row) => row.categoryTitle,
      hideBelow: "md",
    },
    {
      id: "status",
      header: "Status",
      type: "status",
      accessor: (row) => row.status,
      statusVariantMap: STATUS_VARIANT,
      statusLabelMap: STATUS_LABEL,
    },
    {
      id: "publishedAt",
      header: "Published",
      type: "date",
      accessor: (row) => row.publishedAt,
      hideBelow: "sm",
    },
    {
      id: "actions",
      header: "",
      type: "actions",
      align: "right",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button asChild size="icon-sm" variant="outline">
            <Link href={`/admin/blog/${row.id}/edit`}>
              <Pencil className="size-3.5" />
              <span className="sr-only">Edit</span>
            </Link>
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            className="text-destructive hover:text-destructive"
            disabled={deletingId === row.id}
            onClick={() => handleDelete(row)}
          >
            <Trash2 className="size-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      emptyText="No blog posts yet — create your first one."
    />
  );
}
