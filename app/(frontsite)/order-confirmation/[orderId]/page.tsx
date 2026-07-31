import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { getOrderById } from "@/lib/order";
import { isValidUuid } from "@/lib/validators";
import { OrderConfirmationClient } from "@/routes/OrderConfirmationClient";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  if (!isValidUuid(orderId)) {
    notFound();
  }

  const order = await getOrderById(orderId);
  if (!order) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow="Order Confirmed"
        title="Thank You for Your Order"
        crumbs={[{ label: "Order Confirmation" }]}
      />
      <OrderConfirmationClient order={order} />
    </>
  );
}
