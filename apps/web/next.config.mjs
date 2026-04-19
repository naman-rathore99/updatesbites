const nextConfig = {
  transpilePackages: ["@bites/db", "@bites/store", "@bites/validators"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
