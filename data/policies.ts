export interface Policy {
  slug: string;
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
}

export const policies: Policy[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    updated: "2026-01-15",
    sections: [
      { heading: "Information We Collect", body: "We collect information you provide directly, such as your name, email, phone number and address, when you submit a form, place an order, or contact us." },
      { heading: "How We Use Your Information", body: "We use your information to respond to enquiries, process retail orders, and provide export or wholesale support. We do not sell your personal information to third parties." },
      { heading: "Local Storage in This Prototype", body: "In this prototype, account, cart, wishlist and order data are stored only in your browser's local storage and are not transmitted to a server." },
      { heading: "Contact", body: "For privacy questions, contact info@premiersalt.pk or write to us at 7A Main Gulberg Road, Main Gulberg, Lahore, 54660, Pakistan." },
    ],
  },
  {
    slug: "terms-conditions",
    title: "Terms & Conditions",
    updated: "2026-01-15",
    sections: [
      { heading: "Use of This Site", body: "By using this site, you agree to provide accurate information when submitting forms, orders or enquiries." },
      { heading: "Retail Orders", body: "Retail orders placed through our online shop are subject to product availability and the payment and delivery terms shown at checkout." },
      { heading: "B2B Enquiries", body: "Wholesale, export and private-label pricing is provided on request and confirmed in writing before production begins." },
      { heading: "Limitation", body: "Product images on this site are placeholders in this prototype version and do not represent final packaging or product appearance." },
    ],
  },
  {
    slug: "shipping-delivery",
    title: "Shipping & Delivery",
    updated: "2026-01-15",
    sections: [
      { heading: "Retail Delivery", body: "We currently deliver retail orders across Pakistan." },
      { heading: "Shipping Rates", body: "A flat shipping rate of PKR 250 applies to retail orders. Orders of PKR 5,000 or more qualify for free shipping." },
      { heading: "Delivery Methods", body: "You can choose Standard Delivery or Store/Office Pickup at checkout." },
      { heading: "Export Shipments", body: "Export shipment timelines are coordinated individually based on destination and order requirements — contact our export sales team for details." },
    ],
  },
  {
    slug: "returns-refunds",
    title: "Returns & Refunds",
    updated: "2026-01-15",
    sections: [
      { heading: "Eligibility", body: "Retail products may be eligible for return if reported within a reasonable period of delivery and in their original condition." },
      { heading: "How to Request a Return", body: "Contact our Retail Order department through the Contact page with your order number and reason for return." },
      { heading: "Refunds", body: "Approved refunds are processed to the original payment method, or as store credit where applicable." },
      { heading: "Non-Returnable Items", body: "Certain items may not be eligible for return once opened, for hygiene reasons — this will be noted on the relevant product page." },
    ],
  },
  {
    slug: "payment-policy",
    title: "Payment Policy",
    updated: "2026-01-15",
    sections: [
      { heading: "Accepted Payment Methods", body: "We currently accept Cash on Delivery and Bank Transfer for retail orders." },
      { heading: "Card Payments", body: "Card payment integration will be enabled in the production backend. It is not active in this prototype, and no real card details are collected." },
      { heading: "Bank Transfer", body: "Bank transfer details are shared after checkout — orders are processed once payment is confirmed." },
      { heading: "B2B Payment Terms", body: "Payment terms for wholesale and export orders are agreed individually and confirmed in the quotation." },
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    updated: "2026-01-15",
    sections: [
      { heading: "What We Use", body: "This site uses browser local storage to remember your cart, wishlist and account details within this prototype. We do not use tracking cookies for advertising." },
      { heading: "Managing Your Data", body: "You can clear your locally stored data at any time by clearing your browser's site data for this domain." },
      { heading: "Third-Party Services", body: "This prototype does not integrate third-party analytics or advertising services." },
    ],
  },
  {
    slug: "damaged-products",
    title: "Damaged Products Policy",
    updated: "2026-01-15",
    sections: [
      { heading: "Reporting Damage", body: "If a product arrives damaged, contact our Product Support department within a reasonable period of delivery, including your order number." },
      { heading: "Resolution", body: "Depending on the situation, we will offer a replacement, refund, or store credit for confirmed damaged items." },
      { heading: "Packaging Feedback", body: "We use damage reports to improve our packaging over time — your feedback is genuinely useful to us." },
    ],
  },
];

export function getPolicy(slug: string) {
  return policies.find((p) => p.slug === slug);
}
