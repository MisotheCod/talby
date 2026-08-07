import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const instrument = Instrument_Sans({
  variable: "--font-sans-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans-body",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Talby — Brand deals & money, in one calm place",
    description:
      "The calm command center for creators: tracking brand deals, payments, and content without the Notion chaos.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f6f4",
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
      data-accent="coral"
      className={`${instrument.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
