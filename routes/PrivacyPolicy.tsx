import { ContentPage } from "@/components/layout/ContentPage";
import { company } from "@/data/company";

export default function PrivacyPolicy() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="How Premier Salt Industries collects, uses and protects the information you share with us."
      crumbs={[{ label: "Privacy Policy" }]}
      ctaTitle="Questions about your data?"
      ctaText="Reach out to our team and we'll be glad to help."
      ctaTo="/contact"
      ctaLabel="Contact Us"
      sections={[
        {
          eyebrow: "Overview",
          title: "Information We Collect",
          paragraphs: [
            `${company.name} ("Premier Salt", "we", "us") collects information you provide directly — such as your name, email, phone number, company details and delivery address — when you request a quote, place an order, subscribe to our newsletter, or contact us through the website.`,
            "We also collect basic technical information automatically, such as pages visited and general device/browser information, to help us understand how the site is used and to keep it running reliably.",
          ],
        },
        {
          eyebrow: "Usage",
          title: "How We Use Your Information",
          paragraphs: [
            "We use the information you provide to respond to enquiries and quote requests, process and fulfil shop orders, communicate about your order status, and — where you've opted in — send newsletter updates about our products.",
            "We do not sell your personal information to third parties.",
          ],
          bullets: [
            "Responding to quote requests and enquiries",
            "Processing and shipping shop orders",
            "Order status and support communication",
            "Newsletter updates (only if you subscribe)",
          ],
        },
        {
          eyebrow: "Sharing",
          title: "Sharing With Third Parties",
          paragraphs: [
            "We share order information with shipping/courier partners only as needed to deliver your order, and may share information where required by law. We do not share your data with third parties for their own marketing purposes.",
          ],
        },
        {
          eyebrow: "Your Rights",
          title: "Accessing or Updating Your Information",
          paragraphs: [
            `You can update your account details at any time from My Account, or contact us at ${company.emails.info} to request access to, correction of, or deletion of your personal information.`,
          ],
        },
      ]}
    />
  );
}
