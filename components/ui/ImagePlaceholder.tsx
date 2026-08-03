import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  label: string;
  width: number;
  height: number;
  className?: string;
  /** Use on dark/tinted backgrounds to flip the placeholder's own tone. */
  tone?: "light" | "dark";
}

export function ImagePlaceholder({
  label,
  width,
  height,
  className,
  tone = "light",
}: ImagePlaceholderProps) {
  const ratio = `${width} / ${height}`;
  return (
    <div
      role="img"
      aria-label={`${label} placeholder image, recommended size ${width} by ${height} pixels`}
      style={{ aspectRatio: ratio }}
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 rounded-md border px-6 text-center",
        tone === "light"
          ? "border-border bg-salt-pink-light/40 text-primary"
          : "border-white/15 bg-white/5 text-cream",
        className,
      )}
    >
      <ImageIcon className="h-7 w-7 opacity-60" strokeWidth={1.5} />
      <span className="font-sans text-sm font-medium leading-snug opacity-80">
        {label}
      </span>
      <span className="font-sans text-xs uppercase tracking-wide opacity-50">
        {width} × {height}
      </span>
    </div>
  );
}
