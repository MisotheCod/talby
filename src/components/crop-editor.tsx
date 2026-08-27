"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { IconMinus, IconPlus } from "@/components/icons";

export type CropEditorHandle = { apply: () => void };

/**
 * CropEditor — circular profile-photo crop with drag-to-reposition (mouse +
 * touch via unified pointer events) and a neutral zoom slider. The area outside
 * the circle is dimmed with a scrim and bounded by a bright ring, so what the
 * user sees (the bright circle) is exactly the circular image that gets saved.
 *
 * The parent drives commit via the imperative `apply()` handle, which renders a
 * canvas that matches the visible circle (transparent outside it) and returns
 * it through `onApply(dataUrl, blob)`.
 *
 * Geometry (CSS px, origin at the frame's top-left):
 *   base = max(size/naturalW, size/naturalH)   // cover at zoom 1
 *   scale = base * zoom
 *   translate = centering offset at zoom 1 + user drag
 */
export const CropEditor = forwardRef<CropEditorHandle, {
  src: string;
  size?: number;
  onApply: (dataUrl: string, blob: Blob) => void;
}>(({ src, size = 320, onApply }, ref) => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ x: 0, y: 0 });
  const panRef = useRef<{ sx: number; sy: number; ox: number; oy: number; id: number } | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const im = new Image();
    im.onload = () => { setImg(im); imgRef.current = im; };
    im.src = src;
    return () => { im.onload = null; };
  }, [src]);

  const geom = img ? Math.max(size / img.naturalWidth, size / img.naturalHeight) : 0;
  const scale = geom * zoom;
  const tx = (img ? (size - img.naturalWidth * geom) / 2 : 0) + drag.x;
  const ty = (img ? (size - img.naturalHeight * geom) / 2 : 0) + drag.y;

  useImperativeHandle(ref, () => ({
    apply() {
      const im = imgRef.current;
      if (!im || !onApply) return;
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      // Clip to the circle so the saved image matches the crop frame exactly
      // (transparent outside the circle, like the visible mask).
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.scale(dpr, dpr);
      ctx.translate(tx, ty);
      ctx.scale(scale, scale);
      ctx.drawImage(im, 0, 0, im.naturalWidth, im.naturalHeight);
      const out = document.createElement("canvas");
      out.width = size; out.height = size;
      const o2 = out.getContext("2d");
      if (!o2) return;
      o2.drawImage(canvas, 0, 0, size, size);
      out.toBlob((blob) => { if (blob) onApply(out.toDataURL("image/png"), blob); }, "image/png");
    },
  }), [img, tx, ty, scale, size, onApply]);

  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    panRef.current = { sx: e.clientX, sy: e.clientY, ox: dragRef.current.x, oy: dragRef.current.y, id: e.pointerId };
  };
  const onMove = (e: React.PointerEvent) => {
    const p = panRef.current;
    if (!p || p.id !== e.pointerId) return;
    dragRef.current = { x: p.ox + (e.clientX - p.sx), y: p.oy + (e.clientY - p.sy) };
    setDrag(dragRef.current);
  };
  const onUp = (e: React.PointerEvent) => {
    if (panRef.current?.id === e.pointerId) panRef.current = null;
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        className="relative overflow-hidden rounded-full bg-card2 select-none"
        style={{ width: size, height: size, touchAction: "none", cursor: img ? "grab" : "default" }}
      >
        {img && (
          <img src={src} alt="" draggable={false} className="absolute left-0 top-0 max-w-none pointer-events-none rounded-full"
            style={{ width: img.naturalWidth * scale, height: img.naturalHeight * scale, transform: `translate(${tx}px, ${ty}px)` }} />
        )}
        {/* Circular crop mask: scrim dims everything outside the circle, a bright
            ring marks the exact boundary of what will be saved. */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{ boxShadow: "inset 0 0 0 2px var(--accent)", backgroundColor: "transparent" }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle, transparent calc(50% - 1px), rgba(11,13,18,0.55) 50%, rgba(11,13,18,0.55) calc(50% + 1px), rgba(11,13,18,0.62) 100%)",
          }}
        />
      </div>

      <div className="flex items-center gap-2 mt-4 w-full max-w-[280px]">
        <IconMinus size={16} className="text-inkfaint shrink-0" />
        <input type="range" min={1} max={5} step={0.01} value={zoom} aria-label="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))} className="zoom flex-1" />
        <IconPlus size={16} className="text-inkfaint shrink-0" />
      </div>
      <p className="text-[11px] text-inkfaint mt-1.5">Drag to position, use the slider to zoom.</p>
    </div>
  );
});
CropEditor.displayName = "CropEditor";