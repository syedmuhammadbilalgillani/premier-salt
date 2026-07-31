import { getCachedOrders } from "@/lib/order";
import { OrdersTable } from "./_components/OrdersTable";

// Authenticated admin page — never statically prerender at build time. The
// underlying DB reads are still cached via unstable_cache/revalidateTag.
export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const data = await getCachedOrders();

  return (
    <div className="px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Orders placed through the storefront checkout.
        </p>
      </div>

      <OrdersTable data={data} />
    </div>
  );
}
