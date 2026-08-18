import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { getOrderById } from "@/lib/order";
import { isValidUuid } from "@/lib/validators";
import { buildMetadata } from "@/lib/seo";
import { OrderConfirmationClient } from "@/routes/OrderConfirmationClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>;
}): Promise<Metadata> {
  const { orderId } = await params;
  return buildMetadata({
    title: "Order Confirmation",
    description: "Your order confirmation.",
    path: `/order-confirmation/${orderId}`,
    noindex: true,
  });
}

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
