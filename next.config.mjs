/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
          ignoreBuildErrors: true,
    },
    eslint: {
          ignoreDuringBuilds: true,
    },
    images: {
          formats: ['image/avif', 'image/webp'],
          remotePatterns: [
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'cdn.winobeauty.kr' },
                ],
    },
    experimental: {
          optimizePackageImports: ['lucide-react'],
    },
};

export default nextConfig;
