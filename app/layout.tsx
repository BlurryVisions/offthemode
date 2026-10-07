import type { Metadata, Viewport } from "next";
import { Martian_Mono, Schibsted_Grotesk, Fragment_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/content";
import "./globals.css";

const display = Martian_Mono({ subsets: ["latin"], axes: ["wdth"], variable: "--font-display", display: "swap" });
const body = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = Fragment_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono", display: "swap" });

// Written in the words a builder searches with: the tool's name, "plan first", "AI coding tool". The share title
// leaves the site name out and og:site_name carries it, as Apple's link-preview guide (TN3156) asks. That X falls
// back to the og:* tags is unconfirmed (its docs don't load), so the card repeats them.
const shareTitle = "Make your AI coding tool plan first and build in the right order";
const shareText =
  "Left alone, your AI builds the average. Off the Mode makes Claude Code, Cursor, Codex or any AI coding tool plan first, build in order and hold an elite bar.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Off the Mode · make your AI coding tool plan first and build in the right order",
  description:
    "A free, open-source setup that makes Claude Code, Cursor, Codex or any AI coding tool plan before it builds, work in the right order and hold an elite bar. Add it with one link: an MCP server or a skills pack.",
  alternates: { canonical: "/" },
  openGraph: { title: shareTitle, description: shareText, url: "/", siteName: "Off the Mode", type: "website" },
  twitter: { card: "summary_large_image", title: shareTitle, description: shareText },
  // Google Search Console ownership of https://offthemode.vercel.app/ (a URL-prefix property). Public by design: it
  // proves control of the site and grants nothing. Removing it makes Search Console lose the verification.
  verification: { google: "czzGMyLr3iGBAv3qTDnqZehaydIP__OzpzIUoLCcFaU" },
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
