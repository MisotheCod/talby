import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

/**
 * Badge — Talby kit `k.badge`: 22px tall, 0 8px padding, 1px --t-border,
 * --t-r-ctl radius, --t-card background, 12px/500, gap 5px, nowrap.
 * `pay` variant = kit `k.payBadge` (24px, 0 9px 0 6px).
 * Tone variants use the fixed status colors (status colors are theme-invariant).
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[var(--t-r-ctl)] border border-[color:var(--t-border)] bg-[color:var(--t-card)] text-xs font-medium text-[color:var(--t-fg)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)] [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "h-[22px] px-2",
        pay: "h-6 pl-1.5 pr-2.5",
        primary: "h-[22px] border-transparent bg-[color:var(--t-primary)] px-2 text-[color:var(--t-primary-fg)]",
        ok: "h-[22px] border-transparent bg-[color:var(--t-ok-bg)] px-2 text-[color:var(--t-ok-fg)]",
        warn: "h-[22px] border-transparent bg-[color:var(--t-warn-bg)] px-2 text-[color:var(--t-warn-fg)]",
        bad: "h-[22px] border-transparent bg-[color:var(--t-bad-bg)] px-2 text-[color:var(--t-bad-fg)]",
        post: "h-[22px] border-transparent bg-[color:var(--t-post-bg)] px-2 text-[color:var(--t-post-fg)]",
        outline: "h-[22px] px-2",
        ghost: "h-[22px] border-transparent px-2 hover:bg-[color:var(--t-hv)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
