/**
 * Notion brand mark — the official icon (black-and-white 3D cube with a serif
 * "N"). Loaded from the exact brand asset the product uses, at the size given.
 */
export function NotionLogo({ size = 32, className }: { size?: number | string; className?: string }) {
  return (
    <img
      src="/brands/notion.png"
      alt=""
      width={typeof size === "number" ? size : 32}
      height={typeof size === "number" ? size : 32}
      className={className}
      style={{ width: size, height: size, objectFit: "contain", display: "block" }}
    />
  );
}