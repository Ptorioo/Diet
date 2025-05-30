import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'content.jerrymk.uk',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Required for Geist font if not using Turbopack or if issues arise
    // fontLoaders: [
    //   { loader: '@next/font/google', options: { subsets: ['latin'] } },
    // ],
  },
};

export default nextConfig;
