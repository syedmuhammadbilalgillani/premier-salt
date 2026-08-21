import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/components/seo/JsonLd";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";
import type { Metadata } from "next";
import { Roboto, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceMono = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const DEFAULT_TITLE = "Premier Salt | Himalayan Salt Manufacturer & Global Bulk Exporter";
const DEFAULT_DESCRIPTION =
  "Premier Salt Industries is Pakistan's premier manufacturer and bulk exporter of 100% authentic Himalayan rock salt from Khewra. ISO 9001, HACCP, ISO 22000, Halal & FDA certified supplier of food-grade edible salt, salt lamps, animal licks, and private-label packaging to 60+ countries.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "Himalayan Salt Manufacturer Pakistan",
    "Himalayan Pink Salt Bulk Exporter",
    "Khewra Salt Mines Manufacturer",
    "Edible Himalayan Salt Wholesale",
    "Private Label Salt Lamps Supplier",
    "Animal Lick Salt Blocks Exporter",
    "FDA Registered Salt Exporter Pakistan",
    "ISO 22000 Certified Salt Plant",
    "Gourmet Pink Salt Supplier",
    "Industrial Salt & Bath Salt Wholesale",
  ],
  authors: [{ name: "Premier Salt Industries" }],
  creator: "Premier Salt Industries",
  publisher: "Premier Salt Industries",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        width: 1200,
        height: 630,
        alt: "Premier Salt Industries - Himalayan Salt Manufacturer & Exporter",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const rootSchemas = [getOrganizationSchema(), getWebSiteSchema()];

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        spaceMono.variable,
        "font-sans",
        sourceSans3.variable,
      )}
      suppressHydrationWarning
      suppressContentEditableWarning
    >
      <head>
        <JsonLd data={rootSchemas} />
      </head>
      <body suppressContentEditableWarning className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

