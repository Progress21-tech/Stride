import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
};

export default nextConfig;
