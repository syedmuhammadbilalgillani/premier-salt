export interface NavSubLink {
  label: string;
  to: string;
}

export interface NavGroup {
  label: string;
  to?: string;
  links: NavSubLink[];
}

export interface NavItem {
  label: string;
  to?: string;
  dropdown?: NavSubLink[];
  megaMenu?: NavGroup[];
}

export const mainNavigation: NavItem[] = [
  { label: "Home", to: "/" },
  {
    label: "Company",
    dropdown: [
      { label: "About Us", to: "/about" },
      { label: "Manufacturing Facility", to: "/manufacturing" },
      { label: "Quality & Certifications", to: "/quality-certifications" },
      { label: "Export Capabilities", to: "/export-capabilities" },
      { label: "Sustainability", to: "/sustainability" },
    ],
  },
  {
    label: "Products",
    to: "/products",
    megaMenu: [
      { label: "Edible & Gourmet Salts", to: "/edible-gourmet-salts", links: [] },
      {
        label: "Salt Lamps & Decorative Products",
        to: "/salt-lamps-decorative-salt-products",
        links: [
          { label: "Natural Salt Lamps", to: "/natural-salt-lamps" },
          { label: "Crafted Salt Lamps", to: "/crafted-salt-lamps" },
          { label: "Salt Basket Lamps", to: "/salt-basket-lamps" },
          { label: "USB Salt Lamps", to: "/usb-salt-lamps" },
          { label: "Night Lights", to: "/night-lights" },
          { label: "Candle Holders", to: "/candle-holders" },
          { label: "Oil Burners", to: "/oil-burners" },
          { label: "Foot Detox Salt Lamps", to: "/foot-detox-salt-lamps" },
        ],
      },
      {
        label: "Grill Plates & Slabs",
        to: "/grill-plates-slabs",
        links: [
          { label: "Cooking Plates", to: "/grill-plates-slabs/cooking-plates" },
          { label: "Serving Plates", to: "/grill-plates-slabs/serving-plates" },
        ],
      },
      {
        label: "Tiles, Bricks & Blocks",
        to: "/tiles-bricks-blocks",
        links: [
          { label: "Salt Tiles", to: "/tiles-bricks-blocks/salt-tiles" },
          { label: "Salt Bricks & Blocks", to: "/tiles-bricks-blocks/salt-bricks-blocks" },
        ],
      },
      { label: "Salt Licks & Bars", to: "/salt-licks-bars", links: [] },
      {
        label: "Spa & Bath Products",
        to: "/salt-products-for-spa-bath",
        links: [{ label: "Himalayan Salt Bars", to: "/salt-bars" }],
      },
      { label: "Industrial Salt", to: "/salt-for-industrial-uses", links: [] },
    ],
  },
  { label: "Private Label", to: "/private-labeling" },
  { label: "Shop", to: "/shop" },
  {
    label: "Resources",
    dropdown: [
      { label: "About Himalayan Salt", to: "/about-himalayan-salt" },
      { label: "Frequently Asked Questions", to: "/faq" },
      { label: "Blog", to: "/blog" },
      { label: "Downloads", to: "/downloads" },
    ],
  },
  { label: "Contact", to: "/contact" },
];

export const headerCtas: NavSubLink[] = [
  { label: "Request a Quote", to: "/request-a-quote" },
  { label: "Shop Online", to: "/shop" },
];

export const retailNavigation: NavSubLink[] = [
  { label: "Search", to: "/search" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Account", to: "/my-account" },
  { label: "Cart", to: "/cart" },
];

export const footerNavigation: NavGroup[] = [
  {
    label: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Manufacturing Facility", to: "/manufacturing" },
      { label: "Quality & Certifications", to: "/quality-certifications" },
      { label: "Export Capabilities", to: "/export-capabilities" },
      { label: "Sustainability", to: "/sustainability" },
    ],
  },
  {
    label: "Products",
    links: [
      { label: "Edible & Gourmet Salts", to: "/edible-gourmet-salts" },
      { label: "Salt Lamps & Decorative Products", to: "/salt-lamps-decorative-salt-products" },
      { label: "Grill Plates & Slabs", to: "/grill-plates-slabs" },
      { label: "Tiles, Bricks & Blocks", to: "/tiles-bricks-blocks" },
      { label: "Salt Licks & Bars", to: "/salt-licks-bars" },
      { label: "Spa & Bath Products", to: "/salt-products-for-spa-bath" },
      { label: "Industrial Salt", to: "/salt-for-industrial-uses" },
    ],
  },
  {
    label: "Shop",
    links: [
      { label: "Shop Online", to: "/shop" },
      { label: "Cart", to: "/cart" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Order Tracking", to: "/order-tracking" },
      { label: "My Account", to: "/my-account" },
    ],
  },
  {
    label: "Resources",
    links: [
      { label: "About Himalayan Salt", to: "/about-himalayan-salt" },
      { label: "FAQ", to: "/faq" },
      { label: "Blog", to: "/blog" },
      { label: "Downloads", to: "/downloads" },
    ],
  },
  {
    label: "Policies",
    links: [
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms & Conditions", to: "/terms-conditions" },
      { label: "Shipping & Delivery", to: "/shipping-delivery" },
      { label: "Returns & Refunds", to: "/returns-refunds" },
      { label: "Payment Policy", to: "/payment-policy" },
      { label: "Cookie Policy", to: "/cookie-policy" },
      { label: "Damaged Products", to: "/damaged-products" },
    ],
  },
];
