import { ContentPage } from "@/components/layout/ContentPage";

export default function ReturnsRefunds() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Returns & Refunds"
      description="Our policy for returns, exchanges and refunds on shop orders."
      crumbs={[{ label: "Returns & Refunds" }]}
      sections={[
        {
          eyebrow: "Eligibility",
          title: "What Can Be Returned",
          paragraphs: [
            "If an item arrives damaged, defective, or different from what you ordered, contact us within 7 days of delivery with your order number and photos of the item — see our Damaged Products page for the full process.",
            "Because our products are natural salt items, we're unable to accept returns for change-of-mind once an order has been opened or used, unless the item itself is faulty.",
          ],
        },
        {
          eyebrow: "Process",
          title: "How Refunds Work",
          paragraphs: [
            "Once a return is approved, refunds are issued to the original payment method for card and bank transfer payments, or arranged directly with you for Cash on Delivery orders. Refunds are typically processed within a few business days of approval.",
          ],
        },
        {
          eyebrow: "Wholesale",
          title: "Bulk & Export Orders",
          paragraphs: [
            "Returns and quality claims on wholesale, distributor and export orders are handled directly with your sales contact as part of the order agreement.",
          ],
        },
      ]}
    />
  );
}
