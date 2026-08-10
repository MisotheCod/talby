/**
 * Gmail brand mark (official 4-color envelope "M").
 * Same geometry as Gmail's mark, filled with Google's four brand colors
 * (red top-left, yellow top-right, blue bottom-left, green bottom-right).
 */
export function GmailLogo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <clipPath id="gmail-m">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
        </clipPath>
      </defs>
      <g clipPath="url(#gmail-m)">
        {/* Red: top-left quadrant (left peak of the M) */}
        <rect x="0" y="0" width="12" height="12" fill="#EA4335" />
        {/* Yellow: top-right quadrant (right peak of the M) */}
        <rect x="12" y="0" width="12" height="12" fill="#FBBC04" />
        {/* Blue: bottom-left leg */}
        <rect x="0" y="12" width="12" height="12" fill="#4285F4" />
        {/* Green: bottom-right leg */}
        <rect x="12" y="12" width="12" height="12" fill="#34A853" />
      </g>
    </svg>
  );
}