/**
 * Minimal DOM geometry polyfills so `pdfjs-dist` (v6+) can run under the Vercel
 * Node.js runtime. pdfjs 6.x calls `new DOMMatrix(...)`, `DOMPoint`, and `Path2D`
 * while rendering text, but those globals don't exist in Node — without them it
 * throws `ReferenceError: DOMMatrix is not defined` and every PDF extraction fails.
 *
 * These are text-extraction-only shims (identity/affine transforms); good enough
 * for `getTextContent()`. Not suitable for on-screen canvas rendering.
 */
export function polyfillPdfjsDom() {
  if (typeof globalThis.DOMMatrix === "undefined") {
    class DOMMatrixPoly {
      a: number; b: number; c: number; d: number; e: number; f: number;
      m11: number; m12: number; m13 = 0; m14 = 0;
      m21: number; m22: number; m23 = 0; m24 = 0;
      m31 = 0; m32 = 0; m33 = 1; m34 = 0;
      m41: number; m42: number; m43 = 0; m44 = 1;

      constructor(init?: unknown) {
        if (Array.isArray(init) && init.length === 6) {
          [this.a, this.b, this.c, this.d, this.e, this.f] = init as number[];
        } else if (init && (init as { a?: number }).a !== undefined) {
          const o = init as { a?: number; b?: number; c?: number; d?: number; e?: number; f?: number };
          this.a = o.a ?? 1; this.b = o.b ?? 0; this.c = o.c ?? 0; this.d = o.d ?? 1; this.e = o.e ?? 0; this.f = o.f ?? 0;
        } else {
          this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
        }
        this.m11 = this.a; this.m12 = this.b; this.m21 = this.c; this.m22 = this.d; this.m41 = this.e; this.m42 = this.f;
      }

      static fromMatrix(m: unknown) { return new DOMMatrixPoly(m); }
      static fromFloat32Array() { return new DOMMatrixPoly(); }
      static fromFloat64Array() { return new DOMMatrixPoly(); }

      multiply(m: DOMMatrixPoly) {
        return new DOMMatrixPoly([
          this.a * m.a + this.c * m.b, this.b * m.a + this.d * m.b,
          this.a * m.c + this.c * m.d, this.b * m.c + this.d * m.d,
          this.a * m.e + this.c * m.f + this.e, this.b * m.e + this.d * m.f + this.f,
        ]);
      }
      translate(tx: number, ty: number) {
        return new DOMMatrixPoly([this.a, this.b, this.c, this.d, this.e + (this.a * tx + this.c * ty), this.f + (this.b * tx + this.d * ty)]);
      }
      scale(sx: number, sy = 1) {
        return new DOMMatrixPoly([this.a * sx, this.b * sx, this.c * sy, this.d * sy, this.e, this.f]);
      }
      inverse() {
        const det = this.a * this.d - this.b * this.c;
        if (det === 0) return new DOMMatrixPoly();
        const a = this.d / det, b = -this.b / det, c = -this.c / det, d = this.a / det;
        return new DOMMatrixPoly([a, b, c, d, -(a * this.e + c * this.f), -(b * this.e + d * this.f)]);
      }
      toString() { return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`; }
    }
    (globalThis as Record<string, unknown>).DOMMatrix = DOMMatrixPoly;
  }
  if (typeof globalThis.DOMPoint === "undefined") {
    class DOMPointPoly {
      x: number; y: number; z = 0; w = 1;
      constructor(x = 0, y = 0) { this.x = x; this.y = y; }
      static fromPoint(p: { x?: number; y?: number }) { return new DOMPointPoly(p?.x ?? 0, p?.y ?? 0); }
    }
    (globalThis as Record<string, unknown>).DOMPoint = DOMPointPoly;
  }
  if (typeof globalThis.Path2D === "undefined") {
    (globalThis as Record<string, unknown>).Path2D = class Path2D {};
  }
}