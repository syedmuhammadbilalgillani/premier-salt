"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { track } from "@/lib/track";

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    track("view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}
