import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', disallow: process.env.MARKETING_INDEXING_ENABLED === 'true' ? [] : '/' } };
}
