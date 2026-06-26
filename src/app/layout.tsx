import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Preloader } from "@/components/ui/Preloader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/sections/Footer";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.owner} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "creative developer",
    "frontend developer",
    "WebGL",
    "Three.js",
    "interaction design",
    "motion design",
    "portfolio",
  ],
  authors: [{ name: site.owner }],
  creator: site.owner,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    title: `${site.owner} — ${site.role}`,
    description: site.description,
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.owner} — ${site.role}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#06070d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Preloader />
        <CustomCursor />
        <ScrollProgress />
        <SmoothScroll>
          <Navbar />
          <main id="home">{children}</main>
          <Footer />
        </SmoothScroll>
        <GrainOverlay />
      </body>
    </html>
  );
}
