"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { ENQUIRY_STATUS_LABELS, ENQUIRY_TYPE_LABELS } from "@/lib/enquiryStatus";
import type { EnquiryListItem, EnquiryStatus, EnquiryType } from "@/lib/enquiry";

const STATUS_VARIANT: Record<EnquiryStatus, "secondary" | "default" | "outline"> = {
  new: "default",
  contacted: "secondary",
  closed: "outline",
};

const TYPE_VARIANT: Record<EnquiryType, "secondary" | "default" | "outline"> = {
  quote_request: "default",
  contact: "outline",
  private_label: "secondary",
};

export function EnquiriesTable({ data }: { data: EnquiryListItem[] }) {
  const columns: DataTableColumn<EnquiryListItem>[] = [
    {
      id: "reference",
      header: "Reference",
      accessor: (row) => row.reference,
    },
    {
      id: "type",
      header: "Type",
      type: "status",
      accessor: (row) => row.type,
      statusVariantMap: TYPE_VARIANT,
      statusLabelMap: ENQUIRY_TYPE_LABELS,
    },
    {
      id: "name",
      header: "Name",
      accessor: (row) => row.fullName,
      hideBelow: "md",
    },
    {
      id: "email",
      header: "Email",
      accessor: (row) => row.email,
      hideBelow: "lg",
    },
    {
      id: "status",
      header: "Status",
      type: "status",
      accessor: (row) => row.status,
      statusVariantMap: STATUS_VARIANT,
      statusLabelMap: ENQUIRY_STATUS_LABELS,
    },
    {
      id: "createdAt",
      header: "Received",
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
          <Link href={`/admin/enquiries/${row.id}`}>
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
      emptyText="No enquiries yet — quote, contact and private-label submissions will appear here."
    />
  );
}
