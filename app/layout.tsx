import { TooltipProvider } from "@/components/ui/tooltip";
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

const DEFAULT_TITLE = "Premier Salt | Himalayan Salt Manufacturer & Exporter";
const DEFAULT_DESCRIPTION =
  "Premier Salt Industries processes, manufactures and exports authentic Himalayan salt products from Pakistan for importers, wholesalers, retailers and private-label brands.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: absoluteUrl(DEFAULT_OG_IMAGE) }],
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
      <body suppressContentEditableWarning className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
