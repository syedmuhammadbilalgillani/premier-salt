"use client";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import type { NewsletterSubscriber } from "@/lib/newsletter";

export function NewsletterTable({ data }: { data: NewsletterSubscriber[] }) {
  const columns: DataTableColumn<NewsletterSubscriber>[] = [
    {
      id: "email",
      header: "Email",
      accessor: (row) => row.email,
    },
    {
      id: "subscribedAt",
      header: "Subscribed",
      type: "date",
      accessor: (row) => row.subscribedAt,
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      emptyText="No subscribers yet — newsletter signups will appear here."
    />
  );
}
