import type { Metadata, Viewport } from "next";
import { Martian_Mono, Schibsted_Grotesk, Fragment_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/content";
import "./globals.css";

const display = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-display", display: "swap" });
const body = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = Fragment_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Off the Mode",
  description:
    "A prompt-engineering setup that makes Claude, Cursor or any AI coding tool plan first, build in the right order, and hold an elite bar. Add it with one link.",
  openGraph: {
    title: "Off the Mode",
    description: "Left alone, your AI builds the average. Off the Mode makes it plan first, build in order, and hold an elite bar.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EDEFEA" },
    { media: "(prefers-color-scheme: dark)", color: "#0E2242" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
