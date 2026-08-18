import type { ReactNode } from "react";
import Image from "next/image";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs: Crumb[];
  action?: ReactNode;
  /**
   * Optional background image (e.g. "/assets/about-us-hero-pic.webp"). When
   * provided, the hero renders as a dark photo banner (like the homepage
   * hero) with light text instead of the plain sand background.
   */
  image?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  action,
  image,
}: PageHeroProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-b border-border pt-36 pb-14 md:pt-44 md:pb-16",
        image
          ? "flex min-h-[420px] items-center bg-charcoal sm:min-h-[480px] md:min-h-[560px]"
          : "bg-sand/50",
      )}
    >
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/85 via-primary/45 to-primary/5" />
        </div>
      )}
      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-8">
        <Breadcrumbs
          items={crumbs}
          className={
            image ? "text-cream/70 [&_a:hover]:text-salt-pink" : undefined
          }
        />
        <Reveal className="mt-5 flex max-w-2xl flex-col gap-4">
          <span
            className={cn("eyebrow", image && "text-salt-pink")}
          >
            {eyebrow}
          </span>
          <h1
            className={cn(
              "font-serif text-4xl leading-[1.1] sm:text-5xl",
              image ? "text-cream" : "text-primary",
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                "text-base leading-relaxed sm:text-lg",
                image ? "text-cream/75" : "text-muted-foreground",
              )}
            >
              {description}
            </p>
          )}
          {action && <div className="pt-2">{action}</div>}
        </Reveal>
      </div>
    </div>
  );
}
