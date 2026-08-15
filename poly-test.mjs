import fs from "fs";

// Polyfill the DOM geometry globals pdfjs needs under Node 18+/Vercel runtime.
if (typeof globalThis.DOMMatrix === "undefined") {
  // Minimal identity-affine DOMMatrix sufficient for pdfjs text rendering math.
  class DOMMatrixPoly {
    constructor(init) {
      if (Array.isArray(init) && init.length === 6) {
        this.a = init[0]; this.b = init[1]; this.c = init[2]; this.d = init[3];
        this.e = init[4]; this.f = init[5];
      } else if (init && init.a !== undefined) {
        this.a = init.a; this.b = init.b || 0; this.c = init.c || 0;
        this.d = init.d || 1; this.e = init.e || 0; this.f = init.f || 0;
      } else {
        this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
      }
      this.m11=this.a; this.m12=this.b; this.m21=this.c; this.m22=this.d; this.m41=this.e; this.m42=this.f;
      this.m13=0; this.m14=0; this.m23=0; this.m24=0; this.m31=0; this.m32=0; this.m33=1; this.m34=0; this.m43=0; this.m44=1;
    }
    static fromMatrix(m){ return new DOMMatrixPoly(m); }
    static fromFloat32Array(){ return new DOMMatrixPoly(); }
    static fromFloat64Array(){ return new DOMMatrixPoly(); }
    multiply(m){ return new DOMMatrixPoly([this.a*m.a+this.c*m.b, this.b*m.a+this.d*m.b, this.a*m.c+this.c*m.d, this.b*m.c+this.d*m.d, this.a*m.e+this.c*m.f+this.e, this.b*m.e+this.d*m.f+this.f]); }
    translate(tx,ty){ return new DOMMatrixPoly([this.a, this.b, this.c, this.d, this.e+(this.a*tx+this.c*ty), this.f+(this.b*tx+this.d*ty)]); }
    scale(sx,sy=1){ return new DOMMatrixPoly([this.a*sx, this.b*sx, this.c*sy, this.d*sy, this.e, this.f]); }
    inverse(){ const d=this.a*this.d-this.b*this.c; if(d===0) return new DOMMatrixPoly(); const a=this.d/d,b=-this.b/d,c=-this.c/d,dd=this.a/d; return new DOMMatrixPoly([a,b,c,dd,-(a*this.e+c*this.f),-(b*this.e+dd*this.f)]); }
    toString(){ return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`; }
  }
  globalThis.DOMMatrix = DOMMatrixPoly;
}
if (typeof globalThis.DOMPoint === "undefined") {
  class DOMPointPoly { constructor(x=0,y=0){ this.x=x; this.y=y; } }
  globalThis.DOMPoint = DOMPointPoly;
}
if (typeof globalThis.Path2D === "undefined") {
  class Path2D {}
  globalThis.Path2D = Path2D;
}

const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
pdfjs.GlobalWorkerOptions.workerSrc = "pdfjs-dist/legacy/build/pdf.worker.mjs";
const data = new Uint8Array(fs.readFileSync("/Users/miso/talby/real-contract.pdf"));
try {
  const doc = await pdfjs.getDocument({ data, disableWorker: true, useSystemFonts: true, isEvalSupported: false }).promise;
  let t = "";
  for (let i = 1; i <= Math.min(doc.numPages, 30); i++) {
    const pg = await doc.getPage(i);
    const c = await pg.getTextContent();
    for (const it of c.items) if ("str" in it && it.str) t += it.str + " ";
  }
  console.log("WITH POLYFILL, EXTRACT:", JSON.stringify(t.trim().slice(0, 120)));
} catch (e) {
  console.error("STILL FAIL:", e.message);
}