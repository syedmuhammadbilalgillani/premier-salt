import { ContentPage } from "@/components/layout/ContentPage";

export default function ShippingDelivery() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Shipping & Delivery"
      description="How shop orders are delivered, and how wholesale/export shipments are handled."
      crumbs={[{ label: "Shipping & Delivery" }]}
      sections={[
        {
          eyebrow: "Retail Shop Orders",
          title: "Delivery Options",
          paragraphs: [
            "At checkout, choose Standard Delivery to have your order shipped to your address, or Store/Office Pickup to collect it yourself — Store/Office Pickup has no delivery charge.",
            "Delivery timeframes depend on your location within Pakistan and the items ordered. You'll receive updates on your order's status, and can check progress any time on the Order Tracking page using your order number and email.",
          ],
        },
        {
          eyebrow: "Wholesale & Export",
          title: "Bulk and Export Shipments",
          paragraphs: [
            "For wholesale, distributor and export orders placed through Request a Quote, our sales team coordinates shipment scheduling, documentation and logistics directly with you as part of the quotation process — timelines vary by destination, quantity and shipping method.",
          ],
        },
        {
          eyebrow: "Support",
          title: "Delivery Issues",
          paragraphs: [
            "If your order hasn't arrived within the expected timeframe, or arrives incomplete, contact our team with your order number and we'll look into it right away.",
          ],
        },
      ]}
    />
  );
}
