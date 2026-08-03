import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  EmptyIllustration,
  ErrorIllustration,
  LoadingIllustration,
  NotFoundIllustration,
} from "./illustrations";

type StateScreenSize = "page" | "section" | "inline";

const SIZE_CLASSES: Record<StateScreenSize, { wrapper: string; art: string; title: string }> = {
  page: {
    wrapper: "min-h-[70vh] gap-6 px-6 py-16",
    art: "h-40 w-40",
    title: "text-3xl",
  },
  section: {
    wrapper: "gap-5 px-6 py-16",
    art: "h-32 w-32",
    title: "text-2xl",
  },
  inline: {
    wrapper: "gap-3 px-4 py-10",
    art: "h-20 w-20",
    title: "text-base",
  },
};

export interface StateScreenProps {
  illustration: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  size?: StateScreenSize;
  className?: string;
  /** Tints the illustration — e.g. text-destructive for the error state. */
  toneClassName?: string;
}

/**
 * Shared layout for all "nothing to show" screens (404, error, loading,
 * empty). Each specific state below wires this up with its own
 * illustration/copy/defaults — use this directly only for a one-off variant
 * that doesn't warrant its own named component.
 */
export function StateScreen({
  illustration,
  eyebrow,
  title,
  description,
  action,
  size = "page",
  className,
  toneClassName,
}: StateScreenProps) {
  const sizing = SIZE_CLASSES[size];
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-md flex-col items-center justify-center text-center",
        sizing.wrapper,
        className,
      )}
    >
      <div className={cn(sizing.art, "text-primary", toneClassName)}>{illustration}</div>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className={cn("font-serif text-primary", sizing.title)}>{title}</h2>
      {description && (
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-1 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}

export interface NamedStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  size?: StateScreenSize;
  className?: string;
}

export function NotFoundState({
  title = "Page Not Found",
  description = "The page you're looking for may have moved or no longer exists.",
  action,
  size,
  className,
}: NamedStateProps) {
  return (
    <StateScreen
      illustration={<NotFoundIllustration />}
      eyebrow="404"
      title={title}
      description={description}
      action={action}
      size={size}
      className={className}
    />
  );
}

export function ErrorState({
  title = "Something Went Wrong",
  description = "An unexpected error occurred. Please try again, and contact us if the problem continues.",
  action,
  size,
  className,
}: NamedStateProps) {
  return (
    <StateScreen
      illustration={<ErrorIllustration />}
      eyebrow="Error"
      title={title}
      description={description}
      action={action}
      size={size}
      className={className}
      toneClassName="text-destructive"
    />
  );
}

export function EmptyState({
  title = "Nothing Here Yet",
  description,
  action,
  size = "section",
  className,
}: NamedStateProps) {
  return (
    <StateScreen
      illustration={<EmptyIllustration />}
      title={title}
      description={description}
      action={action}
      size={size}
      className={className}
      toneClassName="text-muted-foreground"
    />
  );
}

export function LoadingState({
  title = "Loading…",
  description,
  action,
  size = "page",
  className,
}: NamedStateProps) {
  return (
    <StateScreen
      illustration={<LoadingIllustration />}
      title={title}
      description={description}
      action={action}
      size={size}
      className={className}
    />
  );
}
