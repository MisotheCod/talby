import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

/**
 * Button — restyled to the Talby kit (kit.js / YOMI 2.5, 2.7).
 * Base (kit `b`): inline-flex, centered, gap 6, height 32, padding 0 14px,
 * 14px/500, line-height 1, border-radius --t-r-ctl, whitespace-nowrap,
 * press scale .97 (.tb:active). Variants map 1:1 to the kit:
 *   default  = btnP  (t.primary / t.primaryFg + t.btnSh, hover opacity .88)
 *   secondary= btnS  (t.fill / t.fg, hover t.fillHover)
 *   outline  = btnO  (1px t.border, t.card, hover t.hoverCard / borderStrong)
 *   ghost    = btnG  (transparent, t.fg, hover --hv)
 *   destructive = btnD (t.destrBg, white)
 * Sizes: default 32 / xs 24 / sm 28 / lg 38 block / icon 32 / icon-xs 24 /
 * icon-sm 28 / icon-lg 32.
 */
const buttonVariants = cva(
  "tb inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap border border-transparent font-medium leading-none outline-none select-none transition-[background-color,color,border-color,box-shadow,opacity,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)] active:scale-[.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[color:var(--t-primary)] text-[color:var(--t-primary-fg)] shadow-[var(--t-btn-sh)] hover:opacity-88",
        secondary:
          "bg-[color:var(--t-fill)] text-[color:var(--t-fg)] hover:bg-[color:var(--t-fill-hover)]",
        outline:
          "border-[color:var(--t-border)] bg-[color:var(--t-card)] text-[color:var(--t-fg)] hover:border-[color:var(--t-border-strong)] hover:bg-[color:var(--t-hover-card)]",
        ghost:
          "bg-transparent text-[color:var(--t-fg)] hover:bg-[color:var(--hv)]",
        destructive:
          "bg-[color:var(--destructive)] text-white hover:opacity-90",
        link: "text-[color:var(--t-brand-accent)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 rounded-[var(--t-r-ctl)] px-3.5 text-sm",
        xs: "h-6 gap-1 rounded-[var(--t-r-ctl)] px-2 text-[11px]",
        sm: "h-7 rounded-[var(--t-r-ctl)] px-3 text-[13px]",
        lg: "h-[38px] w-full rounded-[var(--t-r-ctl)] px-3.5 text-sm",
        icon: "size-8 rounded-[var(--t-r-ctl)]",
        "icon-xs": "size-6 rounded-[var(--t-r-ctl)]",
        "icon-sm": "size-7 rounded-[var(--t-r-ctl)]",
        "icon-lg": "size-8 rounded-[var(--t-r-ctl)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
