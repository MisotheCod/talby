import * as React from "react"
import { cn } from "cn"

/**
 * Input — Talby kit `k.input`: 36px tall, full width, no border, radius
 * --t-r-ctl, background --t-fill, --t-fg text, 14px, focus ring 2px --ring
 * (.ti). Matches kit.js/board inputs exactly.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "ti h-9 w-full min-w-0 rounded-[var(--t-r-ctl)] border-0 bg-[color:var(--t-fill)] px-3.5 py-0 text-sm text-[color:var(--t-fg)] outline-none transition-[box-shadow,background-color] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[color:var(--t-muted-fg)] focus:shadow-[0_0_0_2px_var(--ring)] focus-visible:shadow-[0_0_0_2px_var(--ring)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:shadow-[0_0_0_2px_var(--t-bad-fg)] md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
