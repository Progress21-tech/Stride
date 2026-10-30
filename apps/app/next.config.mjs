import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

/** @type {import('next').NextConfig} */
const nextConfig = { poweredByHeader: false };
export default nextConfig;
