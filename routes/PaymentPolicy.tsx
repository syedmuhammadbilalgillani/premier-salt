import { ContentPage } from "@/components/layout/ContentPage";

export default function PaymentPolicy() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Payment Policy"
      description="Accepted payment methods for retail shop orders and wholesale enquiries."
      crumbs={[{ label: "Payment Policy" }]}
      sections={[
        {
          eyebrow: "Retail Shop",
          title: "Accepted Payment Methods",
          paragraphs: [
            "For orders placed through our online shop, you can pay by Cash on Delivery, Bank Transfer, or Card Payment at checkout.",
          ],
          bullets: [
            "Cash on Delivery — pay when your order arrives",
            "Bank Transfer — pay directly to our account, confirmed before dispatch",
            "Card Payment — pay securely online at checkout",
          ],
        },
        {
          eyebrow: "Wholesale & Export",
          title: "Bulk Order Terms",
          paragraphs: [
            "Payment terms for wholesale, distributor and export orders — including deposits, letters of credit and bank transfer details — are agreed with our sales team as part of the quotation, based on order size and destination.",
          ],
        },
        {
          eyebrow: "Security",
          title: "Payment Security",
          paragraphs: [
            "Card payments are processed through our secure payment gateway — we do not store your full card details on our servers.",
          ],
        },
      ]}
    />
  );
}
