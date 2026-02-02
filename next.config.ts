import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
        port: '',
        pathname: '/**', // Cho phép tất cả các đường dẫn ảnh từ host này
      },
    ],
  },
};

export default nextConfig;
