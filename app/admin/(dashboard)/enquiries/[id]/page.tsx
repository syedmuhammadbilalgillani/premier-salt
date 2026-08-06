import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getCachedEnquiry } from "@/lib/enquiry";
import { ENQUIRY_TYPE_LABELS } from "@/lib/enquiryStatus";
import { isValidUuid } from "@/lib/validators";
import { EnquiryStatusForm } from "./_components/EnquiryStatusForm";

// Authenticated admin page — never statically prerender at build time.
export const dynamic = "force-dynamic";

export default async function EnquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isValidUuid(id)) {
    notFound();
  }

  const enquiry = await getCachedEnquiry(id);
  if (!enquiry) {
    notFound();
  }

  const details = Object.entries(enquiry.details ?? {});

  return (
    <div className="px-6 py-8">
      <div className="mb-6 flex flex-col gap-1">
        <Link
          href="/admin/enquiries"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Enquiries
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">{enquiry.reference}</h1>
          <span className="text-sm text-muted-foreground">
            {ENQUIRY_TYPE_LABELS[enquiry.type]} · Received{" "}
            {new Date(enquiry.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="mb-8 rounded-lg border p-4">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          Status
        </h2>
        <EnquiryStatusForm
          enquiryId={enquiry.id}
          currentStatus={enquiry.status}
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 text-sm font-medium text-muted-foreground">
            Contact
          </h2>
          <p className="text-sm">{enquiry.fullName}</p>
          {enquiry.companyName && (
            <p className="text-sm text-muted-foreground">
              {enquiry.companyName}
            </p>
          )}
          <p className="text-sm text-muted-foreground">{enquiry.email}</p>
          {enquiry.phone && (
            <p className="text-sm text-muted-foreground">{enquiry.phone}</p>
          )}
          {enquiry.country && (
            <p className="text-sm text-muted-foreground">{enquiry.country}</p>
          )}
        </div>

        {details.length > 0 && (
          <div className="rounded-lg border p-4">
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">
              Details
            </h2>
            <dl className="flex flex-col gap-1.5">
              {details.map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 text-sm">
                  <dt className="text-muted-foreground">{key}</dt>
                  <dd className="text-right">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>

      {(enquiry.subject || enquiry.message) && (
        <div className="rounded-lg border p-4">
          {enquiry.subject && (
            <h2 className="mb-2 text-sm font-medium text-muted-foreground">
              {enquiry.subject}
            </h2>
          )}
          {enquiry.message && (
            <p className="text-sm whitespace-pre-wrap">{enquiry.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
