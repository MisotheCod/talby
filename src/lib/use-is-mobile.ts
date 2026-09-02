"use client";

import { useEffect, useState } from "react";

// True below the `max-width: 639px` breakpoint. Re-evaluates on resize so
// pages can branch their layout for the stacked mobile view.
export function useIsMobile(breakpoint = 639) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);
  return mobile;
}