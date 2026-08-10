import Link from "next/link";
import { TalbyLogo } from "@/components/marketing/talby-logo";

/**
 * Talby brand lockup (mark + wordmark) used on every non-app surface.
 * Matches the marketing homepage exactly: the abstract #1f7ae0 mark with
 * the "Talby" wordmark, never a "T in a box".
 */
export function TalbyBrand({ href = "/", size = 24 }: { href?: string; size?: number }) {
  return (
    <Link href={href} className="flex items-center gap-2 no-underline">
      <TalbyLogo width={size} height={Math.round((size * 23) / 24)} />
      <span className="font-semibold text-lg tracking-tight" style={{ letterSpacing: "-0.03em" }}>Talby</span>
    </Link>
  );
}