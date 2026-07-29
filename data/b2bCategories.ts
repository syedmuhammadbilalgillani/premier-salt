export interface B2BCategory {
  slug: string;
  name: string;
  filterGroup: "Food" | "Home & Décor" | "Kitchen" | "Architecture" | "Animal" | "Spa" | "Industrial";
  description: string;
  subcategories: { name: string; slug: string }[];
  productCount: number;
}

export const b2bCategories: B2BCategory[] = [
  {
    slug: "edible-gourmet-salts",
    name: "Edible & Gourmet Salts",
    filterGroup: "Food",
    description:
      "Culinary-grade Himalayan salt in dark pink, pink, light pink, white crystal and black varieties, available in multiple grain sizes for table, cooking and retail packaging.",
    subcategories: [],
    productCount: 5,
  },
  {
    slug: "salt-lamps-decorative-salt-products",
    name: "Salt Lamps & Decorative Products",
    filterGroup: "Home & Décor",
    description:
      "Natural and crafted salt lamps, basket lamps, USB lamps, night lights, candle holders, oil burners and foot-detox lamps for home décor and gifting ranges.",
    subcategories: [
      { name: "Natural Salt Lamps", slug: "natural-salt-lamps" },
      { name: "Crafted Salt Lamps", slug: "crafted-salt-lamps" },
      { name: "Salt Basket Lamps", slug: "salt-basket-lamps" },
      { name: "USB Salt Lamps", slug: "usb-salt-lamps" },
      { name: "Night Lights", slug: "night-lights" },
      { name: "Candle Holders", slug: "candle-holders" },
      { name: "Oil Burners", slug: "oil-burners" },
      { name: "Foot Detox Salt Lamps", slug: "foot-detox-salt-lamps" },
    ],
    productCount: 8,
  },
  {
    slug: "grill-plates-slabs",
    name: "Grill Plates & Slabs",
    filterGroup: "Kitchen",
    description:
      "Himalayan salt cooking and serving plates for grilling, searing and food presentation, offered in multiple shapes and dimensions with care guidance included.",
    subcategories: [
      { name: "Cooking Plates", slug: "grill-plates-slabs/cooking-plates" },
      { name: "Serving Plates", slug: "grill-plates-slabs/serving-plates" },
    ],
    productCount: 2,
  },
  {
    slug: "tiles-bricks-blocks",
    name: "Tiles, Bricks & Blocks",
    filterGroup: "Architecture",
    description:
      "Cut and finished salt tiles, bricks and blocks for feature walls, spa interiors and decorative architecture, supplied in project quantities.",
    subcategories: [
      { name: "Salt Tiles", slug: "tiles-bricks-blocks/salt-tiles" },
      { name: "Salt Bricks & Blocks", slug: "tiles-bricks-blocks/salt-bricks-blocks" },
    ],
    productCount: 2,
  },
  {
    slug: "salt-licks-bars",
    name: "Salt Licks & Bars",
    filterGroup: "Animal",
    description:
      "Natural mineral salt licks for livestock and animals, in multiple shapes and weights, with rope-hole and custom formats available on request.",
    subcategories: [],
    productCount: 1,
  },
  {
    slug: "salt-products-for-spa-bath",
    name: "Spa & Bath Products",
    filterGroup: "Spa",
    description:
      "Pink and dark-pink salt chunks, fine and coarse bath salt, and solid salt bars for spa use, with private-label bath packaging available.",
    subcategories: [{ name: "Himalayan Salt Bars", slug: "salt-bars" }],
    productCount: 5,
  },
  {
    slug: "salt-for-industrial-uses",
    name: "Industrial Salt",
    filterGroup: "Industrial",
    description:
      "Bulk salt for de-icing, textile and leather processing, industrial formulations and general manufacturing requirements, matched to buyer specifications.",
    subcategories: [],
    productCount: 1,
  },
];
