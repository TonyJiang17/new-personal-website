import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Our lint pipeline is enforced via `npm run lint` in CI/workflow,
    // but for local/Vercel builds we don't want ESLint to block builds.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
