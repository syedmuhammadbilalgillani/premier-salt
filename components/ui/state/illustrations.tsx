import { cn } from "@/lib/utils";

/**
 * Shared visual language for these four illustrations: a faceted salt
 * crystal drawn in thin outline (stroke-based, currentColor), so every
 * illustration reads as part of the same family and recolors correctly
 * wherever it's dropped — storefront or admin, since both now share the
 * same token set (see app/globals.css).
 */
type IllustrationProps = {
  className?: string;
};

const crystalFacets = (
  <>
    <path d="M40 8 L64 24 L56 60 L24 60 L16 24 Z" />
    <path d="M40 8 L40 24" />
    <path d="M40 24 L24 60" />
    <path d="M40 24 L56 60" />
    <path d="M16 24 L64 24" />
  </>
);

export function NotFoundIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Page not found"
    >
      <g transform="translate(46 30)" opacity={0.9}>
        {crystalFacets}
      </g>
      <circle cx="30" cy="130" r="2" opacity={0.5} />
      <circle cx="128" cy="112" r="2.5" opacity={0.4} />
      <circle cx="112" cy="34" r="2" opacity={0.5} />
      {/* Magnifying glass, overlapping the crystal's lower-right facet */}
      <g transform="translate(78 82)">
        <circle cx="24" cy="24" r="22" />
        <line x1="40" y1="40" x2="58" y2="58" strokeWidth={2} />
      </g>
      <text
        x="80"
        y="128"
        textAnchor="middle"
        fontSize="34"
        fontWeight="600"
        stroke="none"
        fill="currentColor"
        opacity={0.16}
        fontFamily="var(--font-sans)"
      >
        404
      </text>
    </svg>
  );
}

export function ErrorIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Something went wrong"
    >
      <g transform="translate(48 46)" opacity={0.9}>
        {crystalFacets}
        {/* Crack running through the crystal */}
        <path d="M30 20 L22 34 L34 40 L20 56" strokeWidth={2} />
      </g>
      <circle cx="26" cy="42" r="2" opacity={0.5} />
      <circle cx="132" cy="120" r="2.5" opacity={0.4} />
      <circle cx="120" cy="30" r="2" opacity={0.45} />
      {/* Warning badge, bottom-right of the crystal */}
      <g transform="translate(96 100)">
        <circle
          cx="20"
          cy="20"
          r="20"
          className="fill-background"
          stroke="currentColor"
        />
        <line x1="20" y1="12" x2="20" y2="22" strokeWidth={2} />
        <circle cx="20" cy="28" r="1.4" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

export function EmptyIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Nothing here yet"
    >
      {/* Open crate */}
      <path d="M28 70 L80 54 L132 70 L132 68 L114 108 L46 108 L28 68 Z" opacity={0.9} />
      <path d="M28 70 L80 86 L132 70" opacity={0.9} />
      <path d="M80 54 L80 86" opacity={0.9} />
      {/* A couple of loose grains, nothing left inside */}
      <circle cx="80" cy="40" r="2.5" opacity={0.45} />
      <circle cx="96" cy="32" r="1.6" opacity={0.35} />
      <circle cx="64" cy="30" r="1.6" opacity={0.35} />
    </svg>
  );
}

export function LoadingIllustration({ className }: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Loading"
    >
      <g transform="translate(46 46)" opacity={0.35}>
        {crystalFacets}
      </g>
      {/* Orbiting grains — animate-spin already respects the site's global
          prefers-reduced-motion rule in app/globals.css. */}
      <g className="origin-[80px_80px] animate-spin [animation-duration:2.4s]">
        <circle cx="80" cy="22" r="4" fill="currentColor" stroke="none" />
        <circle cx="80" cy="22" r="4" fill="currentColor" stroke="none" opacity={0.55} transform="rotate(120 80 80)" />
        <circle cx="80" cy="22" r="4" fill="currentColor" stroke="none" opacity={0.3} transform="rotate(240 80 80)" />
      </g>
    </svg>
  );
}
