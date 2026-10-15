import * as React from "react"
import { cn } from "cn"

/**
 * Textarea — Talby kit `k.area`: full width, 12px 14px padding, no border,
 * radius --t-r-tile, --t-fill background, 14px/1.5, resize vertical.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "ti flex min-h-16 w-full resize-y rounded-[var(--t-r-tile)] border-0 bg-[color:var(--t-fill)] px-3.5 py-3 text-sm leading-normal text-[color:var(--t-fg)] outline-none placeholder:text-[color:var(--t-muted-fg)] focus:shadow-[0_0_0_2px_var(--ring)] focus-visible:shadow-[0_0_0_2px_var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:shadow-[0_0_0_2px_var(--t-bad-fg)]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
