"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import type { getCachedProductList } from "@/lib/product";

export type ProductRow = Awaited<ReturnType<typeof getCachedProductList>>[number];

const STATUS_VARIANT: Record<ProductRow["status"], "secondary" | "default" | "outline"> = {
  draft: "outline",
  active: "default",
  archived: "secondary",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "PKR" }).format(value);
}

export function ProductsTable({ data }: { data: ProductRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(product: ProductRow) {
    if (!window.confirm(`Delete "${product.title}"? This can't be undone.`)) return;

    setDeletingId(product.id);
    try {
      const response = await fetch(`/api/product/${product.id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(data.error || "Could not delete the product.");
        return;
      }

      toast.success("Product deleted.");
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  const columns: DataTableColumn<ProductRow>[] = [
    {
      id: "imageUrl",
      header: "Image",
      type: "image",
      accessor: (row) => row.imageUrl,
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
      id: "price",
      header: "Price",
      hideBelow: "sm",
      cell: ({ row }) => {
        if (row.hasVariants && row.variantStats) {
          const { minPrice, maxPrice } = row.variantStats;
          return minPrice === maxPrice
            ? formatPrice(minPrice)
            : `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`;
        }
        return row.basePrice ? formatPrice(Number(row.basePrice)) : "Quote only";
      },
    },
    {
      id: "stock",
      header: "Stock",
      hideBelow: "lg",
      cell: ({ row }) =>
        row.hasVariants && row.variantStats ? row.variantStats.totalStock : row.stockQuantity,
    },
    {
      id: "status",
      header: "Status",
      type: "status",
      accessor: (row) => row.status,
      statusVariantMap: STATUS_VARIANT,
    },
    {
      id: "actions",
      header: "",
      type: "actions",
      align: "right",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button asChild size="icon-sm" variant="outline">
            <Link href={`/admin/products/${row.id}/edit`}>
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
      emptyText="No products yet — create your first one."
    />
  );
}
