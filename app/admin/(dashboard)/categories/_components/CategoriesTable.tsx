"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { getCachedCategories } from "@/lib/category";

type Category = Awaited<ReturnType<typeof getCachedCategories>>[number] & {
  parentTitle: string | null;
};

export function CategoriesTable({ data }: { data: Category[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (row) =>
        row.title.toLowerCase().includes(query) ||
        row.slug.toLowerCase().includes(query) ||
        row.parentTitle?.toLowerCase().includes(query),
    );
  }, [data, search]);

  async function handleDelete(category: Category) {
    if (!window.confirm(`Delete "${category.title}"? This can't be undone.`)) {
      return;
    }

    setDeletingId(category.id);
    try {
      const response = await fetch(`/api/category/${category.id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Could not delete the category.");
        return;
      }

      toast.success("Category deleted.");
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  const columns: DataTableColumn<Category>[] = [
    {
      id: "image_url",
      header: "Image",
      type: "image",
      accessor: (row) => row.image_url,
      width: 72,
    },
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
      id: "parentTitle",
      header: "Parent",
      accessor: (row) => row.parentTitle,
      hideBelow: "lg",
    },

    {
      id: "spec",
      header: "Specs",
      hideBelow: "lg",
      cell: ({ row }) => {
        const count = row.spec ? Object.keys(row.spec).length : 0;
        return count ? (
          <Badge variant="secondary">
            {count} field{count === 1 ? "" : "s"}
          </Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
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
            <Link href={`/admin/categories/${row.id}/edit`}>
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search categories..."
          className="w-64"
        />
        {search.trim() && (
          <span className="text-sm text-muted-foreground">
            {filteredData.length} of {data.length} categories
          </span>
        )}
      </div>

      <DataTable
        data={filteredData}
        columns={columns}
        getRowId={(row) => row.id}
        emptyText="No categories yet — create your first one."
      />
    </div>
  );
}
