"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_LABELS } from "@/lib/orderStatus";
import type { OrderListItem, OrderStatus } from "@/lib/order";

const STATUS_VARIANT: Record<
  OrderStatus,
  "secondary" | "default" | "outline" | "destructive"
> = {
  order_received: "outline",
  confirmed: "secondary",
  processing: "secondary",
  ready_for_dispatch: "secondary",
  dispatched: "default",
  delivered: "default",
  cancelled: "destructive",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "PKR" }).format(value);
}

export function OrdersTable({ data }: { data: OrderListItem[] }) {
  const columns: DataTableColumn<OrderListItem>[] = [
    {
      id: "orderNumber",
      header: "Order Number",
      accessor: (row) => row.orderNumber,
    },
    {
      id: "customer",
      header: "Customer",
      accessor: (row) => `${row.customerFirstName} ${row.customerLastName}`,
      hideBelow: "md",
    },
    {
      id: "itemCount",
      header: "Items",
      accessor: (row) => row.itemCount,
      hideBelow: "lg",
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => formatPrice(row.total),
    },
    {
      id: "status",
      header: "Status",
      type: "status",
      accessor: (row) => row.status,
      statusVariantMap: STATUS_VARIANT,
      statusLabelMap: ORDER_STATUS_LABELS,
    },
    {
      id: "createdAt",
      header: "Placed",
      type: "date",
      accessor: (row) => row.createdAt,
      hideBelow: "sm",
    },
    {
      id: "actions",
      header: "",
      type: "actions",
      align: "right",
      cell: ({ row }) => (
        <Button asChild size="icon-sm" variant="outline">
          <Link href={`/admin/orders/${row.id}`}>
            <Eye className="size-3.5" />
            <span className="sr-only">View</span>
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      emptyText="No orders yet — orders placed through checkout will appear here."
    />
  );
}
