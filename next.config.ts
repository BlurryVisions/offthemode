import type { NextConfig } from "next";

const config: NextConfig = {
  // /method is a prebuilt static page (public/method/index.html).
  async rewrites() {
    return [{ source: "/method", destination: "/method/index.html" }];
  },
};

export default config;
