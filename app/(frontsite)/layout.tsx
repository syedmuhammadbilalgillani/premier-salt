import { Suspense } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppFloatingButton } from "@/components/ui/WhatsAppFloatingButton";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

export default function FrontsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <SiteHeader />
      {children}
      <SiteFooter />
      <WhatsAppFloatingButton />
    </>
  );
}
