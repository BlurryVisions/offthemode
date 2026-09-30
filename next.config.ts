import type { NextConfig } from "next";

// Security headers from the P7 guide, minus its script policy: the pages rely on small inline scripts, so the
// Content-Security-Policy only blocks framing, plugins, <base> and cross-site form posts. HSTS comes from Vercel.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), hid=(), bluetooth=(), midi=(), " +
      "accelerometer=(), gyroscope=(), magnetometer=(), display-capture=(), browsing-topics=()",
  },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'none'; form-action 'self'" },
  { key: "X-Frame-Options", value: "DENY" },
];

const config: NextConfig = {
  // /method is a prebuilt static page (public/method/index.html).
  async rewrites() {
    return [{ source: "/method", destination: "/method/index.html" }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default config;
