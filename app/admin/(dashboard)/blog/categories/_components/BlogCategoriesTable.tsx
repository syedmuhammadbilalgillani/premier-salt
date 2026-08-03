"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import type { getCachedBlogCategories } from "@/lib/blog";

type BlogCategory = Awaited<ReturnType<typeof getCachedBlogCategories>>[number];

export function BlogCategoriesTable({ data }: { data: BlogCategory[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(category: BlogCategory) {
    if (!window.confirm(`Delete "${category.title}"? This can't be undone.`)) {
      return;
    }

    setDeletingId(category.id);
    try {
      const response = await fetch(`/api/blog/categories/${category.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Could not delete the blog category.");
        return;
      }

      toast.success("Blog category deleted.");
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  const columns: DataTableColumn<BlogCategory>[] = [
    {
      id: "title",
      header: "Title",
      accessor: (row) => row.title,
    },
    {
      id: "slug",
      header: "Slug",
      accessor: (row) => row.slug,
      hideBelow: "md",
    },
    {
      id: "createdAt",
      header: "Created",
      type: "date",
      accessor: (row) => row.createdAt,
      hideBelow: "md",
    },
    {
      id: "actions",
      header: "",
      type: "actions",
      align: "right",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button asChild size="icon-sm" variant="outline">
            <Link href={`/admin/blog/categories/${row.id}/edit`}>
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
      emptyText="No blog categories yet — create your first one."
    />
  );
}
