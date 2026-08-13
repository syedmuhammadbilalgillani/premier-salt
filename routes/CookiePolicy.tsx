import { ContentPage } from "@/components/layout/ContentPage";

export default function CookiePolicy() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Cookie Policy"
      description="How Premier Salt Industries uses cookies and similar local storage on this website."
      crumbs={[{ label: "Cookie Policy" }]}
      sections={[
        {
          eyebrow: "What We Use",
          title: "Essential Storage Only",
          paragraphs: [
            "This website keeps things like your cart and wishlist in your browser's local storage, so they're there when you come back — this data stays on your device and isn't shared with us until you actually place an order.",
            "Our admin dashboard uses a session cookie to keep staff securely signed in — this only applies to the admin login area, not the public storefront.",
          ],
        },
        {
          eyebrow: "Tracking",
          title: "No Third-Party Advertising Cookies",
          paragraphs: [
            "We don't currently use third-party analytics or advertising cookies to track you across this site or other websites.",
          ],
        },
        {
          eyebrow: "Control",
          title: "Managing Local Storage",
          paragraphs: [
            "You can clear your cart, wishlist and other locally-stored data at any time by clearing your browser's site data for premiersalt.pk.",
          ],
        },
      ]}
    />
  );
}
