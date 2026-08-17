"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Button — primary uses the accent (with WCAG on-accent), others neutral. */
export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-sans",
        size === "sm" && "text-[12.5px] px-3 h-8",
        size === "md" && "text-[13.5px] px-4 h-10 rounded-xl",
        size === "lg" && "text-sm px-6 h-12",
        variant === "primary" && "btn3d",
        variant === "secondary" &&
          "bg-card text-ink border border-line2 hover:bg-card2",
        variant === "ghost" && "text-ink hover:bg-card2",
        variant === "danger" &&
          "bg-latebg text-late hover:brightness-95 border border-late/20",
        className
      )}
      {...props}
    />
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input({
  className,
  ...props
}, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full bg-card border border-line2 rounded-xl px-3.5 h-10 text-sm text-ink placeholder:text-inkfaint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition font-sans",
        className
      )}
      {...props}
    />
  );
});

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full bg-card border border-line2 rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-inkfaint focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-y min-h-[80px] font-sans",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full bg-card border border-line2 rounded-xl px-3 h-10 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 cursor-pointer font-sans",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

/** Reusable tinted pill — one source color, tinted bg + same-hue text + subtle
 *  same-hue border, all derived via color-mix from a single token. Supply a
 *  CSS var or color string as `source`, and a `size` ("md" | "sm" | "dot"). */
export function Pill({
  source = "var(--ink-soft)",
  size = "md",
  dot = true,
  className,
  style,
  children,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & {
  source?: string;
  size?: "md" | "sm" | "dot";
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "tpill inline-flex items-center gap-1.5",
        size === "sm" && "tpill-sm",
        size === "dot" && "tpill-dot",
        className
      )}
      style={{ "--pill-source": source, ...style } as React.CSSProperties}
      {...rest}
    >
      {children}
    </span>
  );
}

/** Status pill — semantic source colors (never themeable). */
export function StatusPill({
  className,
  kind = "neutral",
  size = "md",
  children,
}: {
  className?: string;
  kind?: "neutral" | "paid" | "due" | "late" | "pipeline" | "accent";
  size?: "md" | "sm";
  children: React.ReactNode;
}) {
  const sources: Record<string, string> = {
    neutral: "var(--ink-soft)",
    paid: "var(--paid)",
    due: "var(--due)",
    late: "var(--late)",
    pipeline: "var(--ink-soft)",
    accent: "var(--accent)",
  };
  return (
    <Pill
      source={sources[kind]}
      size={size}
      className={className}
    >
      {children}
    </Pill>
  );
}

/** Filter chip — accent-derived when active (live re-tint), neutral otherwise. */
export function Chip({
  className,
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold text-xs px-3.5 h-8 transition cursor-pointer font-sans",
        active
          ? "tpill"
          : "bg-card text-inksoft border border-line hover:border-line2 hover:text-ink",
        className
      )}
      style={{ ...(active ? { "--pill-source": "var(--accent)" } : {}) } as React.CSSProperties}
      {...props}
    >
      {children}
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin",
        className
      )}
      aria-hidden
    />
  );
}
