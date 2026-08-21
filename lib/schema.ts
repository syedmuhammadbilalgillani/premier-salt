import { company } from "@/data/company";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";
import type { ShopProduct } from "@/lib/product";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Manufacturer", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: "Premier Salt Industries",
    legalName: "Premier Salt Industries (Private) Limited",
    url: SITE_URL,
    logo: absoluteUrl("/premiersalt-logo.webp"),
    image: absoluteUrl("/assets/Factory-Tour-Hero-Pic.webp"),
    description:
      "Premier Salt Industries is Pakistan's premier manufacturer, processor and global bulk exporter of 100% authentic Himalayan rock salt products mined from the Khewra salt range. Supplying food-grade edible salt, salt lamps, animal lick salt, and wellness products to 60+ countries.",
    email: company.emails.sales,
    telephone: company.phone,
    foundingDate: "2012",
    address: {
      "@type": "PostalAddress",
      streetAddress: "GT Road, Muridke",
      addressLocality: "Muridke / Lahore",
      addressRegion: "Punjab",
      postalCode: "39010",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "31.8020",
      longitude: "74.2562",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "08:30",
      closes: "17:30",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Worldwide",
    },
    knowsAbout: [
      "Himalayan Pink Salt",
      "Edible Salt Processing & Export",
      "Himalayan Rock Salt Lamps Manufacturing",
      "Animal Lick Salt Blocks",
      "Private Label Packaging",
      "Bulk Containerized Sea Freight Export",
      "FDA Compliant Food Grade Salt",
      "ISO 9001, HACCP, ISO 22000 & Halal Certified Salt Processing",
    ],
    hasCredential: company.certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.name,
      credentialCategory: "Quality & Safety Certification",
      recognizedBy: {
        "@type": "Organization",
        name: c.subtitle,
      },
    })),
    sameAs: [
      "https://www.linkedin.com/company/premier-salt",
      "https://www.facebook.com/premiersaltpk",
      "https://www.instagram.com/premiersaltpk",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: company.phone,
        contactType: "sales & export",
        email: company.emails.sales,
        areaServed: "Worldwide",
        availableLanguage: ["English", "Urdu"],
      },
      {
        "@type": "ContactPoint",
        telephone: company.phone,
        contactType: "customer support",
        email: company.emails.info,
        areaServed: "Worldwide",
        availableLanguage: ["English", "Urdu"],
      },
    ],
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  const itemList = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: item.name,
      ...(item.url ? { item: absoluteUrl(item.url) } : {}),
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itemList,
  };
}

export function getProductSchema(product: ShopProduct) {
  const images = product.images.map((img) => absoluteUrl(img.url));
  const primaryImage = images[0] ?? absoluteUrl("/premiersalt-logo.webp");

  const minPrice =
    product.hasVariants && product.variants.length > 0
      ? Math.min(...product.variants.map((v) => v.price))
      : (product.basePrice ?? 0);

  const maxPrice =
    product.hasVariants && product.variants.length > 0
      ? Math.max(...product.variants.map((v) => v.price))
      : (product.basePrice ?? 0);

  const inStock = product.hasVariants
    ? product.variants.some((v) => v.stockQuantity > 0)
    : (product.stockQuantity ?? 0) > 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/shop/product/${product.slug}#product`,
    name: product.title,
    image: images.length > 0 ? images : [primaryImage],
    description:
      product.description ||
      `${product.title} - Authentic Himalayan rock salt product manufactured and supplied by Premier Salt Industries.`,
    sku: product.sku || product.slug,
    brand: {
      "@type": "Brand",
      name: "Premier Salt",
    },
    manufacturer: {
      "@id": `${SITE_URL}/#organization`,
    },
    countryOfOrigin: {
      "@type": "Country",
      name: "Pakistan",
    },
    category: product.categoryTitle,
    offers: {
      "@type":
        product.hasVariants && minPrice !== maxPrice
          ? "AggregateOffer"
          : "Offer",
      url: `${SITE_URL}/shop/product/${product.slug}`,
      priceCurrency: "PKR",
      ...(product.hasVariants && minPrice !== maxPrice
        ? {
            lowPrice: minPrice,
            highPrice: maxPrice,
            offerCount: product.variants.length,
          }
        : {
            price: minPrice,
          }),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQPageSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export interface ArticleSchemaOptions {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}

export function getArticleSchema(options: ArticleSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: options.title,
    description: options.description,
    image: options.image
      ? absoluteUrl(options.image)
      : absoluteUrl("/premiersalt-logo.webp"),
    url: absoluteUrl(options.url),
    datePublished: options.datePublished || new Date().toISOString(),
    dateModified:
      options.dateModified || options.datePublished || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: options.authorName || "Premier Salt Editorial Team",
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(options.url),
    },
  };
}
