import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repoName = "community-board";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  ...(isGitHubPages
    ? { basePath: `/${repoName}`, assetPrefix: `/${repoName}` }
    : {}),
};

export default nextConfig;
