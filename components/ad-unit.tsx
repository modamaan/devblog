"use client"

import { useEffect, useRef } from "react"

interface AdUnitProps {
  /** Your AdSense ad slot ID (from adsense.google.com → Ad units) */
  slot: string
  /** Ad format: "auto" | "rectangle" | "vertical" | "horizontal" */
  format?: "auto" | "rectangle" | "vertical" | "horizontal"
  /** Additional Tailwind / CSS classes for the wrapper */
  className?: string
  /** Whether the ad should fill the parent width */
  fullWidth?: boolean
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export function AdUnit({
  slot,
  format = "auto",
  className = "",
  fullWidth = true,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    // Avoid double-push in StrictMode / HMR
    if (pushed.current) return
    if (!adRef.current) return
    // AdSense sets this attribute once it has filled the slot — bail if already done
    if (adRef.current.getAttribute("data-adsbygoogle-status") !== null) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // AdSense not yet loaded — silently ignore
    }
  }, [])

  // In development, render a labelled placeholder so layout is visible
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        className={`flex items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 text-xs text-neutral-400 ${className}`}
        style={{ minHeight: 90 }}
        aria-hidden="true"
      >
        AdSense · slot {slot}
      </div>
    )
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidth ? "true" : "false"}
      />
    </div>
  )
}
