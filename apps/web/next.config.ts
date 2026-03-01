import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@spike-ai/ui', '@spike-ai/types'],
  experimental: {
    optimizePackageImports: ['lucide-react', '@spike-ai/ui'],
  },
};

export default nextConfig;
