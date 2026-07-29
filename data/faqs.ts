export interface FAQGroup {
  group: string;
  items: { question: string; answer: string }[];
}

export const faqGroups: FAQGroup[] = [
  {
    group: "Company",
    items: [
      { question: "Does Premier Salt manufacture Himalayan salt products?", answer: "Yes — we process, manufacture and export Himalayan salt products from our own facility in Pakistan." },
      { question: "Where is your processing plant?", answer: "Our processing plant is located at 7 Km Grand Trunk (GT) Road, Muridke, Pakistan." },
      { question: "Where is your office located?", answer: "Our office is at 7A Main Gulberg Road, Main Gulberg, Lahore, 54660, Pakistan." },
      { question: "Who can I contact for a general enquiry?", answer: "Reach us at info@premiersalt.pk or use the Contact page to select the right department." },
    ],
  },
  {
    group: "Products",
    items: [
      { question: "What product categories do you offer?", answer: "Edible salt, salt lamps and décor, grill plates and slabs, tiles/bricks/blocks, salt licks, spa and bath products, and industrial salt." },
      { question: "How can I request specifications?", answer: "Use the Request a Quote form or contact sales directly — we'll confirm current specifications for your product of interest." },
      { question: "Can I order products not listed in the online shop?", answer: "Yes — many products are available through our B2B catalogue even if not listed for retail. Contact sales for details." },
      { question: "Do all products come in multiple grain sizes or shapes?", answer: "Most product lines offer multiple size or shape options — see the relevant category page for details." },
    ],
  },
  {
    group: "Wholesale",
    items: [
      { question: "Do you support bulk and wholesale orders?", answer: "Yes, wholesale supply is available across our product range." },
      { question: "Is there a minimum order quantity?", answer: "MOQ varies by product — contact sales for current requirements." },
      { question: "Can I become a distributor?", answer: "Yes — see our Wholesale & Distributor page to start the conversation." },
      { question: "Do you offer volume-based pricing?", answer: "Pricing is generally quoted per enquiry based on quantity and specification." },
    ],
  },
  {
    group: "Private Label",
    items: [
      { question: "Do you support private labeling?", answer: "Yes, across edible salt, salt crafts, bath salt and animal salt licks." },
      { question: "Can I request custom packaging?", answer: "Yes — custom packaging is available for most product categories, including private-label formats." },
      { question: "Is there a private-label minimum order?", answer: "This varies by product — share your requirement through our Private Labeling page and we'll confirm." },
      { question: "Can you help design private-label packaging?", answer: "We coordinate label placement, carton configuration and barcode placement as part of the private-label process." },
    ],
  },
  {
    group: "Export",
    items: [
      { question: "Do you export bulk orders?", answer: "Yes — export is available for all product categories, subject to buyer requirements and destination regulations." },
      { question: "What information do you need for an export quote?", answer: "Product, quantity, packaging, destination, required certification, private-label needs, and target timeline." },
      { question: "Can you assist with export documentation?", answer: "Yes, our team supports documentation coordination as part of the export process." },
      { question: "Do you support container loading and shipment planning?", answer: "Yes — this is part of our export coordination service." },
    ],
  },
  {
    group: "Retail Orders",
    items: [
      { question: "Are retail orders available in Pakistan?", answer: "Yes — our online shop delivers retail-quantity products across Pakistan." },
      { question: "How do I track my order?", answer: "Use the Order Tracking page with your order number and email address." },
      { question: "What payment methods do you accept for retail orders?", answer: "Cash on Delivery and Bank Transfer are currently active; card payments will be enabled in the production backend." },
    ],
  },
  {
    group: "Shipping",
    items: [
      { question: "How is shipping calculated?", answer: "A flat rate of PKR 250 applies, with free shipping on orders of PKR 5,000 or more." },
      { question: "Do you offer store pickup?", answer: "Yes — Store/Office Pickup is available as a delivery method at checkout." },
      { question: "How long does delivery take?", answer: "Delivery timelines vary by location — see our Shipping & Delivery policy for details." },
    ],
  },
  {
    group: "Returns",
    items: [
      { question: "What is your returns policy?", answer: "See our Returns & Refunds policy page for full details on eligibility and process." },
      { question: "What if my product arrives damaged?", answer: "See our Damaged Products policy for how to report and resolve this." },
    ],
  },
  {
    group: "Product Care",
    items: [
      { question: "How should a salt lamp be stored?", answer: "Keep it away from direct water contact, wipe with a dry cloth, and consider keeping the bulb lit in humid conditions." },
      { question: "How should a salt cooking plate be heated?", answer: "Warm gradually before high heat, let it cool completely before washing, and dry it right away." },
    ],
  },
];
