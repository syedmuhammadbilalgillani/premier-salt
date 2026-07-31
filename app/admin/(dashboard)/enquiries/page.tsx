import { getCachedEnquiries } from "@/lib/enquiry";
import { EnquiriesTable } from "./_components/EnquiriesTable";

// Authenticated admin page — never statically prerender at build time. The
// underlying DB reads are still cached via unstable_cache/revalidateTag.
export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  const data = await getCachedEnquiries();

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Enquiries</h1>
        <p className="text-sm text-muted-foreground">
          Quote, contact and private-label requests submitted from the storefront.
        </p>
      </div>

      <EnquiriesTable data={data} />
    </div>
  );
}
