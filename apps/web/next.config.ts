import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@visone/db", "@visone/rbac", "@visone/shared"],
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "**.visone.app" },
    ],
  },
};

export default nextConfig;
