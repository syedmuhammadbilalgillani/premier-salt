import { getCachedSubscribers } from "@/lib/newsletter";
import { NewsletterTable } from "./_components/NewsletterTable";

// Authenticated admin page — never statically prerender at build time.
export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const data = await getCachedSubscribers();

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Newsletter</h1>
        <p className="text-sm text-muted-foreground">
          Email subscribers collected from the storefront footer.
        </p>
      </div>

      <NewsletterTable data={data} />
    </div>
  );
}
