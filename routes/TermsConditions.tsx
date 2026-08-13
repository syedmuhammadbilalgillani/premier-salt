import { ContentPage } from "@/components/layout/ContentPage";
import { company } from "@/data/company";

export default function TermsConditions() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Terms & Conditions"
      description="The terms that apply when you use this website or place an order with us."
      crumbs={[{ label: "Terms & Conditions" }]}
      sections={[
        {
          eyebrow: "General",
          title: "Using This Website",
          paragraphs: [
            `This website is operated by ${company.name}. By browsing this site, requesting a quote, subscribing to our newsletter or placing an order through our shop, you agree to these terms.`,
          ],
        },
        {
          eyebrow: "Orders",
          title: "Shop Orders & Pricing",
          paragraphs: [
            "Prices shown in the online shop are in PKR and confirmed at checkout. We reserve the right to correct pricing or availability errors before an order is dispatched, and will contact you if this affects your order.",
            "Wholesale, distributor and export pricing is quoted separately per enquiry through Request a Quote, and isn't governed by shop pricing.",
          ],
        },
        {
          eyebrow: "Products",
          title: "Product Information",
          paragraphs: [
            "As natural products, Himalayan salt items vary in colour, veining and exact size — product photos are representative, not an exact match for every unit.",
          ],
        },
        {
          eyebrow: "Policies",
          title: "Related Policies",
          paragraphs: [
            "Payment, shipping, returns and privacy are covered in our separate Payment Policy, Shipping & Delivery, Returns & Refunds and Privacy Policy pages, which form part of these terms.",
          ],
        },
        {
          eyebrow: "Contact",
          title: "Questions About These Terms",
          paragraphs: [
            `Reach us at ${company.emails.info} or through the Contact page with any questions.`,
          ],
        },
      ]}
    />
  );
}
