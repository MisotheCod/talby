"use client"

import { useEffect, useState } from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

/**
 * Toaster — Talby toasts (kit: card, 1px --t-border, --t-r-card, --t-sh-pop,
 * padding 14 14 14 16, title 500). Position: bottom-right on desktop, top on
 * phone (spec: toasts are top on phone). Reads the resolved Talby dark flag
 * from <html class="dark"> rather than next-themes.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const [dark, setDark] = useState(false)
  const [mob, setMob] = useState(false)

  useEffect(() => {
    const htmlEl = document.documentElement
    const read = () => setDark(htmlEl.classList.contains("dark"))
    read()
    const mq = window.matchMedia("(max-width: 767px)")
    const readMob = () => setMob(mq.matches)
    readMob()
    const obs = new MutationObserver(read)
    obs.observe(htmlEl, { attributes: true, attributeFilter: ["class"] })
    mq.addEventListener("change", readMob)
    return () => { obs.disconnect(); mq.removeEventListener("change", readMob) }
  }, [])

  return (
    <Sonner
      theme={dark ? "dark" : "light"}
      position={mob ? "top-center" : "bottom-right"}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--t-card)",
          "--normal-text": "var(--t-fg)",
          "--normal-border": "var(--t-border)",
          "--border-radius": "var(--t-r-card)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "!rounded-[var(--t-r-card)] !border !border-[color:var(--t-border)] !bg-[color:var(--t-card)] !text-[color:var(--t-fg)] !shadow-[var(--t-sh-pop)] !px-4 !py-3.5",
          title: "!text-sm !font-medium",
          description: "!text-[13px] !text-[color:var(--t-muted-fg)]",
          actionButton: "!rounded-[var(--t-r-ctl)] !bg-[color:var(--t-fill)] !text-[color:var(--t-fg)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
