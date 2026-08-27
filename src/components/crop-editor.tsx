"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { IconMinus, IconPlus } from "@/components/icons";

export type CropEditorHandle = { apply: () => void };

/**
 * CropEditor — square profile-photo crop with drag-to-reposition (mouse + touch
 * via unified pointer events) and a zoom slider. Renders the frame + zoom UI.
 * The parent drives commit via the imperative `apply()` handle, which renders
 * a canvas exactly matching what the square frame shows and returns it through
 * `onApply(dataUrl, blob)`.
 *
 * Geometry (CSS px, origin at frame top-left):
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
        className="relative overflow-hidden rounded-xl border border-line2 bg-card2 select-none"
        style={{ width: size, height: size, touchAction: "none", cursor: img ? "grab" : "default" }}
      >
        {img && (
          <img src={src} alt="" draggable={false} className="absolute left-0 top-0 max-w-none pointer-events-none"
            style={{ width: img.naturalWidth * scale, height: img.naturalHeight * scale, transform: `translate(${tx}px, ${ty}px)` }} />
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 w-full max-w-[280px]">
        <IconMinus size={16} className="text-inkfaint shrink-0" />
        <input type="range" min={1} max={5} step={0.01} value={zoom} aria-label="Zoom"
          onChange={(e) => setZoom(Number(e.target.value))} className="hue flex-1" />
        <IconPlus size={16} className="text-inkfaint shrink-0" />
      </div>
      <p className="text-[11px] text-inkfaint mt-1.5">Drag to position, use the slider to zoom.</p>
    </div>
  );
});
CropEditor.displayName = "CropEditor";