"use client"

import * as React from "react"
import { cn } from "cn"
import { Switch as SwitchPrimitive } from "radix-ui"

/**
 * Switch — Talby tokens: track --t-off unchecked / --t-primary checked,
 * thumb --t-card, rounded pill. Sizes sm (24x14) and default (28x16.6).
 */
function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ring)] data-[size=default]:h-4 data-[size=default]:w-7 data-[size=sm]:h-3.5 data-[size=sm]:w-6 data-checked:bg-[color:var(--t-primary)] data-unchecked:bg-[color:var(--t-off)] data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-[color:var(--t-card)] shadow-sm ring-0 transition-transform group-data-[size=default]/switch:size-3 group-data-[size=sm]/switch:size-2.5 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%+2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%+2px)] data-unchecked:translate-x-0"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
