import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Lexend } from "next/font/google";
import "./globals.css";
import "./marketing.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-mono",
  subsets: ["latin"],
  display: "swap",
});

// Lexend is the brand heading font. 500 is the face the H1 uses; load it so the
// browser can swap the hero immediately and preload carries the exact weight.
const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: "500",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // iOS Safari auto-detects phone numbers, dates, email, and addresses in text
  // and wraps them in <a href="tel:/mailto:"> links BEFORE React hydrates. On a
  // money/copy-heavy homepage this rewrites the DOM out from under hydration,
  // firing #418 ("server HTML didn't match the client") on 100+ iOS users —
  // the exact pattern behind the TikTok in-app browser blowout. Disable it.
  formatDetection: {
    telephone: false,
    date: false,
    email: false,
    address: false,
  },
  title: {
    default: "Talby — Brand deals & money, in one calm place",
    template: "%s | Talby",
  },
  description:
    "Talby is the calm command center for creators — track brand deals, payments, and content without the Notion chaos.",
  openGraph: {
    type: "website",
    siteName: "Talby",
    title: "Talby — Brand deals & money, in one calm place",
    description:
      "The calm command center for creators: tracking brand deals, payments, and content without the Notion chaos.",
    url: `${SITE_URL}/`,
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "Talby — Brand deals & money, in one calm place" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talby — Brand deals & money, in one calm place",
    description:
      "The calm command center for creators: tracking brand deals, payments, and content without the Notion chaos.",
    images: [`${SITE_URL}/og.png`],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f7f9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${mono.variable} ${lexend.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
