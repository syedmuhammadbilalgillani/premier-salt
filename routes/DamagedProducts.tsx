import { ContentPage } from "@/components/layout/ContentPage";

export default function DamagedProducts() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Damaged Products"
      description="What to do if an item arrives damaged, and how we resolve it."
      crumbs={[{ label: "Damaged Products" }]}
      ctaTitle="Received a damaged item?"
      ctaText="Get in touch with your order number and photos — we'll sort it out."
      ctaTo="/contact"
      ctaLabel="Contact Us"
      sections={[
        {
          eyebrow: "Reporting",
          title: "How to Report Damage",
          paragraphs: [
            "Salt tiles, lamps and other natural-stone items can occasionally be affected in transit. If your order arrives damaged, contact us within 7 days of delivery with your order number and clear photos of the item and its packaging.",
          ],
        },
        {
          eyebrow: "Resolution",
          title: "Replacement or Refund",
          paragraphs: [
            "Once we've reviewed the report, we'll arrange a replacement where available, or a refund to your original payment method — whichever suits you best.",
          ],
        },
        {
          eyebrow: "Prevention",
          title: "How Items Are Packed",
          paragraphs: [
            "We pack natural salt products with protective materials suited to their weight and fragility, and continue to review our packaging as we get feedback from buyers.",
          ],
        },
      ]}
    />
  );
}
