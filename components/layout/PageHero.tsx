import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  crumbs: Crumb[];
  action?: ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  action,
}: PageHeroProps) {
  return (
    <div className="border-b border-border bg-sand/50 pt-36 pb-14 md:pt-44 md:pb-16">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <Breadcrumbs items={crumbs} />
        <Reveal className="mt-5 flex max-w-2xl flex-col gap-4">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="font-serif text-4xl leading-[1.1] text-primary sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
          {action && <div className="pt-2">{action}</div>}
        </Reveal>
      </div>
    </div>
  );
}
