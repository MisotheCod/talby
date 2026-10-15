import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * Alert — Talby inline banners / empty + error blocks. Default = tile look
 * (--t-card / --t-border, radius --t-r-tile). destructive = --t-bad-bg /
 * --t-bad-fg. The shared empty/error block (kit `blk`) is StateBlock below.
 */
const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-[var(--t-r-tile)] border px-3 py-2.5 text-left text-[13px] has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 [&>svg]:row-span-2 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default:
          "border-[color:var(--t-border)] bg-[color:var(--t-card)] text-[color:var(--t-fg)]",
        destructive:
          "border-[color:var(--t-bad-fg)]/30 bg-[color:var(--t-bad-bg)] text-[color:var(--t-bad-fg)] *:data-[slot=alert-description]:text-[color:var(--t-bad-fg)]/85 *:[svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-[color:var(--t-fg)]",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-[13px] leading-relaxed text-[color:var(--t-muted-fg)] [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-[color:var(--t-fg)] [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2.5 right-3", className)}
      {...props}
    />
  )
}

/**
 * StateBlock — the shared empty / error block (kit `blk`). A centered icon
 * tile + title + optional sub + optional CTA. `kind` picks the tile colours:
 * "empty" = --t-tile / --t-fg, "error" = --t-bad-bg / --t-bad-fg.
 */
function StateBlock({
  kind = "empty",
  icon,
  title,
  sub,
  cta,
  onCta,
  className,
}: {
  kind?: "empty" | "error";
  icon?: React.ReactNode;
  title: string;
  sub?: string;
  cta?: string;
  onCta?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("a-fade flex flex-col items-center gap-2 px-4 py-9 text-center", className)}>
      {icon && (
        <span
          className={cn(
            "grid size-10 place-items-center rounded-full",
            kind === "error"
              ? "bg-[color:var(--t-bad-bg)] text-[color:var(--t-bad-fg)]"
              : "bg-[color:var(--t-tile)] text-[color:var(--t-fg)]"
          )}
        >
          {icon}
        </span>
      )}
      <p className="text-sm font-medium text-[color:var(--t-fg)]">{title}</p>
      {sub && <p className="text-[13px] text-[color:var(--t-muted-fg)]">{sub}</p>}
      {cta && onCta && (
        <button
          type="button"
          onClick={onCta}
          className="tb mt-1 inline-flex h-8 cursor-pointer items-center justify-center rounded-[var(--t-r-ctl)] bg-[color:var(--t-fill)] px-3.5 text-sm font-medium text-[color:var(--t-fg)] hover:bg-[color:var(--t-fill-hover)]"
        >
          {cta}
        </button>
      )}
    </div>
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction, StateBlock }
