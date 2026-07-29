export interface ShopProduct {
  slug: string;
  name: string;
  sku: string;
  category: "Edible Salts" | "Salt Lamps" | "Kitchen & Serving" | "Spa & Bath" | "Gifts" | "Animal Salt Products";
  shortDescription: string;
  description: string;
  price: number;
  previousPrice?: number;
  stock: number;
  featured?: boolean;
  weight: string;
  careInstructions: string;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const raw: Omit<ShopProduct, "slug" | "description" | "careInstructions">[] = [
  { name: "Himalayan Pink Salt Fine Grain 500g", sku: "PS-ED-FINE-500", category: "Edible Salts", shortDescription: "Everyday fine-grain pink salt for the kitchen table.", price: 250, stock: 40, featured: true, weight: "500 g" },
  { name: "Himalayan Pink Salt Fine Grain 1kg", sku: "PS-ED-FINE-1000", category: "Edible Salts", shortDescription: "Family-size fine-grain pink salt.", price: 450, stock: 35, featured: true, weight: "1 kg" },
  { name: "Himalayan Pink Salt Coarse Grain 500g", sku: "PS-ED-COARSE-500", category: "Edible Salts", shortDescription: "Coarse crystals suited to grinders and finishing.", price: 275, stock: 30, weight: "500 g" },
  { name: "Dark Pink Himalayan Salt 500g", sku: "PS-ED-DARK-500", category: "Edible Salts", shortDescription: "Deep-toned salt with a distinctive mineral character.", price: 295, stock: 24, weight: "500 g" },
  { name: "White Crystal Himalayan Salt 500g", sku: "PS-ED-WHITE-500", category: "Edible Salts", shortDescription: "Bright, clean-tasting white crystal salt.", price: 325, stock: 18, weight: "500 g" },
  { name: "Himalayan Black Salt 500g", sku: "PS-ED-BLACK-500", category: "Edible Salts", shortDescription: "Traditional black salt for South Asian cooking.", price: 300, stock: 28, weight: "500 g" },
  { name: "Himalayan Pink Salt Grinder 200g", sku: "PS-ED-GRINDER-200", category: "Edible Salts", shortDescription: "Refillable grinder for fresh salt at the table.", price: 475, stock: 25, featured: true, weight: "200 g" },
  { name: "Natural Himalayan Salt Lamp — Small", sku: "PS-LAMP-NAT-S", category: "Salt Lamps", shortDescription: "Naturally shaped rock lamp on a wooden base.", price: 2750, stock: 12, featured: true, weight: "2–3 kg" },
  { name: "Natural Himalayan Salt Lamp — Medium", sku: "PS-LAMP-NAT-M", category: "Salt Lamps", shortDescription: "A larger natural-form lamp for living spaces.", price: 3750, stock: 8, weight: "4–5 kg" },
  { name: "Mini USB Himalayan Salt Lamp", sku: "PS-LAMP-USB", category: "Salt Lamps", shortDescription: "Compact desk lamp powered over USB.", price: 1450, stock: 16, featured: true, weight: "0.5–0.8 kg" },
  { name: "Himalayan Salt Night Light", sku: "PS-LAMP-NIGHT", category: "Salt Lamps", shortDescription: "Soft ambient lighting for bedrooms and hallways.", price: 1250, stock: 14, weight: "0.4–0.6 kg" },
  { name: "Himalayan Salt Candle Holder", sku: "PS-DEC-CANDLE", category: "Gifts", shortDescription: "Carved salt tea-light holder for gifting.", price: 850, stock: 22, weight: "0.5 kg" },
  { name: "Himalayan Salt Oil Burner", sku: "PS-DEC-OIL", category: "Gifts", shortDescription: "Decorative salt oil burner for home fragrance.", price: 1650, stock: 11, weight: "0.8 kg" },
  { name: "Himalayan Salt Cooking Plate", sku: "PS-KIT-COOKING", category: "Kitchen & Serving", shortDescription: "Solid salt slab for grilling and searing.", price: 4500, stock: 6, featured: true, weight: "1.8–2.2 kg" },
  { name: "Himalayan Salt Serving Plate", sku: "PS-KIT-SERVING", category: "Kitchen & Serving", shortDescription: "Salt slab for chilled or room-temperature presentation.", price: 2800, stock: 9, weight: "1.2–1.5 kg" },
  { name: "Himalayan Pink Bath Salt 500g", sku: "PS-SPA-BATH-500", category: "Spa & Bath", shortDescription: "Fine bath salt for a relaxing soak.", price: 650, stock: 20, featured: true, weight: "500 g" },
  { name: "Himalayan Salt Bar", sku: "PS-SPA-BAR", category: "Spa & Bath", shortDescription: "Solid salt bar for spa and bath use.", price: 450, stock: 27, weight: "300 g" },
  { name: "Natural Animal Salt Lick 2kg", sku: "PS-ANIMAL-LICK-2", category: "Animal Salt Products", shortDescription: "Natural mineral salt lick for livestock.", price: 850, stock: 15, weight: "2 kg" },
];

export const shopProducts: ShopProduct[] = raw.map((p) => ({
  ...p,
  slug: slugify(p.name),
  description: `${p.shortDescription} Processed and packed by Premier Salt Industries from authentic Himalayan salt, sourced and prepared for consistent quality.`,
  careInstructions:
    p.category === "Salt Lamps"
      ? "Keep away from direct water contact. Wipe with a dry cloth. A light bulb inside helps reduce moisture absorption in humid conditions."
      : p.category === "Kitchen & Serving"
        ? "Warm gradually before high heat, allow to cool fully before washing, and dry immediately. Hand wash only, no soap."
        : p.category === "Spa & Bath"
          ? "Store in a dry container away from moisture. For external use in bath water or as directed."
          : "Store in a cool, dry place away from direct moisture.",
}));

export const shopCategories = [
  "Edible Salts",
  "Salt Lamps",
  "Kitchen & Serving",
  "Spa & Bath",
  "Gifts",
  "Animal Salt Products",
] as const;
