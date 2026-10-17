import { cn } from "cn"

/**
 * Skeleton — Talby kit `sk(w, h, r)`: --t-fill block, radius --t-r-sm,
 * pulse animation (a-pulse). Pass width/height/radius via className.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("a-pulse block shrink-0 rounded-[var(--t-r-sm)] bg-[color:var(--t-fill)]", className)}
      {...props}
    />
  )
}

export { Skeleton }
