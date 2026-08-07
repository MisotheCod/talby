"use client";

import { cn } from "@/lib/utils";

/** Button — primary uses .accent-fill (recolors with theme), others neutral. */
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
        "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
        size === "sm" && "text-sm px-3 h-8",
        size === "md" && "text-sm px-4 h-10",
        size === "lg" && "text-base px-6 h-12",
        variant === "primary" && "accent-fill shadow-sm",
        variant === "secondary" &&
          "bg-surface border border-border text-foreground hover:bg-subtle",
        variant === "ghost" && "text-foreground hover:bg-subtle",
        variant === "danger" &&
          "bg-bad/10 text-bad hover:bg-bad/20 border border-bad/20",
        className
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full bg-surface border border-border rounded-lg px-3.5 h-10 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full bg-surface border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition resize-y min-h-[80px]",
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
        "w-full bg-surface border border-border rounded-lg px-3 h-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

/** Badge / pill — neutral by default; accent-soft for emphasis. */
export function Badge({
  className,
  tone = "neutral",
  children,
}: {
  className?: string;
  tone?: "neutral" | "accent" | "ok" | "warn" | "bad" | "info";
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-subtle text-foreground",
    accent: "accent-soft",
    ok: "bg-ok/10 text-ok",
    warn: "bg-warn/10 text-warn",
    bad: "bg-bad/10 text-bad",
    info: "bg-info/10 text-info",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
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
