import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={twMerge(
          "flex flex-wrap items-center gap-1.5 text-xs text-muted",
          className,
        )}
      >
        <li>
          <Link href="/" className="hover:text-terracotta">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3" />
            {item.to && i !== items.length - 1 ? (
              <Link href={item.to} className="hover:text-terracotta">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-charcoal">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
