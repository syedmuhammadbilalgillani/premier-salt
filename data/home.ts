/**
 * Editable copy for the Home page. Change text here — no code changes needed.
 * Only facts already used elsewhere on the site are stated (Khewra, Muridke
 * plant, Karachi Port, 60+ countries, the six certificates). Add numbers
 * (years, capacity, clients) to `stats` when you want them shown.
 */

export const homeContent = {
  hero: {
    eyebrow: "Himalayan salt from Khewra, Pakistan",
    title: "Himalayan Salt Manufacturer and Exporter from Pakistan",
    text: "We source, clean, pack and ship Himalayan salt from our own plant in Muridke. Buy a jar for your kitchen, or order by the container for your shop or brand.",
    primaryCta: { label: "Shop for Home", href: "/shop" },
    secondaryCta: { label: "Bulk & Business Orders", href: "/request-a-quote" },
  },

  // Add or remove items freely. Keep each value short.
  stats: [
    { value: "60+", label: "countries we ship to" },
    { value: "6", label: "quality & safety certificates" },
    { value: "Muridke", label: "our own processing plant" },
    { value: "Khewra", label: "where our salt comes from" },
  ],

  who: {
    eyebrow: "Who we are",
    title: "A Pakistani salt company, run from the plant floor",
    paragraphs: [
      "Premier Salt Industries cleans, grades, packs and exports Himalayan salt from Pakistan. Our plant is on GT Road, Muridke, and our office is in Lahore.",
      "We sell to people who want a jar of pink salt at home, and to shops, brands, wholesalers and importers who need it in bulk. Our job is simple: send what we promised, on time, and answer your messages quickly.",
    ],
    signature: "Asad Zahoor, Chief Executive Officer",
    image: "/assets/homepage-about-section.webp",
    imageAlt: "Premier Salt Industries team and Himalayan salt products",
    link: { label: "Read our story", href: "/about" },
  },

  // Order here is the order shown on the Home page.
  products: {
    eyebrow: "What we make",
    title: "Himalayan Salt Products",
    text: "Six main product ranges. Open one to see sizes, packing and how to order.",
    slugs: [
      "edible-gourmet-salts",
      "salt-lamps-decorative-salt-products",
      "grill-plates-slabs",
      "tiles-bricks-blocks",
      "salt-licks-bars",
      "salt-products-for-spa-bath",
    ],
  },

  origin: {
    eyebrow: "Where it comes from",
    title: "Why Himalayan salt comes from Pakistan",
    paragraphs: [
      "Real Himalayan pink salt is mined in the Salt Range of Punjab, Pakistan, near Khewra. It formed from an ancient sea that dried up millions of years ago.",
      "The pink and white colour comes from natural minerals in the rock, not from colouring. We source our rock salt from this region and bring it to our plant in Muridke to be cleaned and packed.",
    ],
    image: "/assets/Raw_material_intake_area.webp",
    imageAlt: "Raw Himalayan rock salt arriving at the Premier Salt plant in Muridke",
    link: { label: "Learn about Himalayan salt", href: "/about-himalayan-salt" },
  },

  process: {
    eyebrow: "Inside our plant",
    title: "How the salt gets from rock to your pack",
    text: "Every order goes through the same steps at our plant in Muridke.",
    steps: [
      {
        title: "Rock salt arrives",
        text: "Raw salt from the Khewra region is received and sorted before it enters the plant.",
        image: "/assets/Raw_material_intake_area.webp",
        alt: "Raw material intake area",
      },
      {
        title: "Cleaned and processed",
        text: "The salt is washed and cleaned so dust and dirt are removed.",
        image: "/assets/Cleaning_and_processing_station.webp",
        alt: "Cleaning and processing station",
      },
      {
        title: "Crushed to size",
        text: "It is crushed and sorted into the grain size you ordered, from fine to coarse.",
        image: "/assets/Crushing_and_sizing_line.webp",
        alt: "Crushing and sizing line",
      },
      {
        title: "Packed and checked",
        text: "Salt is packed in the bag, jar or box you choose, then checked before dispatch.",
        image: "/assets/Packaging_line.webp",
        alt: "Packaging line",
      },
    ],
    link: { label: "See the full factory", href: "/manufacturing" },
  },

  privateLabel: {
    eyebrow: "Your own brand",
    title: "Want to sell Himalayan salt under your own name?",
    text: "We can pack our salt with your label, your logo and your pack design. You do not need your own factory.",
    points: [
      "Edible salt, bath salt, salt lamps and animal salt licks",
      "Your choice of pack size and style",
      "Your logo and label on every pack",
      "We handle packing, you handle selling",
    ],
    image: "/assets/private-label.webp",
    imageAlt: "Himalayan salt packs with a private label",
    cta: { label: "See private label options", href: "/private-labeling" },
  },

  buyers: {
    eyebrow: "Who buys from us",
    title: "Made for shops, brands and importers",
    items: [
      {
        title: "Shops and wholesalers",
        text: "Regular supply for stores, chains and distributors.",
        href: "/wholesale-distributor",
      },
      {
        title: "Brands with their own label",
        text: "Your name and pack, our salt.",
        href: "/private-labeling",
      },
      {
        title: "Importers abroad",
        text: "Container loads shipped from Karachi Port with the papers you need.",
        href: "/export-capabilities",
      },
      {
        title: "Everyone else",
        text: "Restaurants, hotels, spas and gift sellers. Tell us what you need.",
        href: "/request-a-quote",
      },
    ],
  },

  certificates: {
    eyebrow: "Quality and safety",
    title: "Our certificates",
    text: "These are the certificates we hold.",
    link: { label: "See all certificates", href: "/quality-certifications" },
  },

  faqs: [
    {
      question: "Where is Premier Salt located and where does the salt come from?",
      answer:
        "Our processing plant is on GT Road, Muridke, Punjab, Pakistan, and our office is in Lahore. The rock salt comes from the Himalayan Salt Range near Khewra.",
    },
    {
      question: "What do you make and export?",
      answer:
        "Edible Himalayan pink, white and black salt, salt lamps and candle holders, cooking and serving slabs, salt tiles and bricks, animal lick salt, bath salt and industrial salt.",
    },
    {
      question: "Can I buy a small amount, or only in bulk?",
      answer:
        "Both. For small orders use our online shop. For large quantities, send a quote request and we will reply with a price.",
    },
    {
      question: "Can you pack under my own brand?",
      answer:
        "Yes. We offer private label packing with your logo, label and pack size. Bulk bags such as 25 kg and 50 kg are also available.",
    },
    {
      question: "Which countries do you ship to, and how?",
      answer:
        "We ship containers to 60+ countries from Karachi Port, on FOB, CIF and CFR terms, with the export documents prepared.",
    },
    {
      question: "What certificates do you hold?",
      answer:
        "ISO 9001:2015, HACCP, ISO 22000, Halal certification, SMAP membership, and U.S. FDA compliance support.",
    },
  ],

  finalCta: {
    title: "Ready to order Himalayan salt?",
    text: "Buy online for your home, or tell us what you need in bulk and we will reply with a price.",
    primary: { label: "Shop Online", href: "/shop" },
    secondary: { label: "Get a Bulk Price", href: "/request-a-quote" },
  },
} as const;
