/**
 * Notion brand mark (official 3D-cube favicon): light top face, white front
 * face with the black "N", black right face. Matches Notion's app icon.
 */
export function NotionLogo({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true">
      {/* top face (light) */}
      <path d="M9 12.5 24 5l15 7.5L24 20 9 12.5Z" fill="#E9E9E9" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
      {/* right face (black) */}
      <path d="M39 12.5 24 20v23l15-7.5v-23Z" fill="#111" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
      {/* left/front face (white) with the N */}
      <path d="M24 20 9 12.5v23L24 43v-23Z" fill="#fff" stroke="#111" strokeWidth="1.2" strokeLinejoin="round" />
      {/* N */}
      <path d="M15.4 29.2v-9l8 7v-7h2.2v13.3h-2.2v-7l-8 7v9H13v-13.3h2.4Z" fill="#111" />
    </svg>
  );
}