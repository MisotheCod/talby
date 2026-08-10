/**
 * Gmail brand mark — the classic multi-color envelope "M" icon. Loaded from the
 * exact brand asset at the desired height; the source is 4:3 so width is derived
 * from height while object-fit keeps it crisp.
 */
export function GmailLogo({ size = 32, className }: { size?: number | string; className?: string }) {
  return (
    <img
      src="/brands/gmail.png"
      alt=""
      height={typeof size === "number" ? size : 32}
      className={className}
      style={{ width: "auto", height: size, objectFit: "contain", display: "block" }}
    />
  );
}