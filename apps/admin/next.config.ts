import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@spike-ai/ui', '@spike-ai/types'],
};

export default nextConfig;
