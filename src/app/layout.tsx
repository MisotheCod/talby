import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./fonts.css";
import "./interactions.css";
import "./marketing.css";
import { ThemeProvider } from "@/components/theme-provider";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: {
    default: "Talby — Brand deals & money, in one calm place",
    template: "%s | Talby",
  },
  description:
    "Talby is the calm command center for creators — track brand deals, payments, and content without the Notion chaos.",
  openGraph: {
    type: "website", siteName: "Talby",
    title: "Talby — Brand deals & money, in one calm place",
    description: "The calm command center for creators: tracking brand deals, payments, and content without the Notion chaos.",
    url: `${SITE_URL}/`, images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "Talby" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talby — Brand deals & money, in one calm place",
    description: "The calm command center for creators: tracking brand deals, payments, and content without the Notion chaos.",
    images: [`${SITE_URL}/og.png`],
  },
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Talby", statusBarStyle: "default" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export const viewport: Viewport = {
  themeColor: "#f6f7f9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// No-flash: sets data-theme/data-mode/.dark from localStorage after migrateLook
// before first paint. Runs inline (not deferred) so there's no wrong-theme flash.
const NO_FLASH = `(function(){try{
var K='talby.look';var r=JSON.parse(localStorage.getItem(K)||'null')||{};
var ok=function(s){return s==='sand'||s==='mac'||s==='stationery'||s==='editorial'};
var th=r.theme==='midnight'?(ok(r.prev)?r.prev:'studio'):(ok(r.theme)?r.theme:'studio');
var m=r.theme==='midnight'?'dark':(r.mode==='dark'||r.mode==='light'||r.mode==='system'?r.mode:(r.auto?'system':'light'));
var d=m==='dark'||(m==='system'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);
var el=document.documentElement;el.setAttribute('data-theme',th);el.setAttribute('data-mode',m);el.classList.toggle('dark',!!d);
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH }} />
        <script dangerouslySetInnerHTML={{ __html: "window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__talbyBip=e;});" }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}