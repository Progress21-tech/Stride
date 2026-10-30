import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_MARKETING_URL ?? 'https://sylpace.example';
  return ['/','/privacy','/terms','/contact'].map((path) => ({ url: new URL(path, base).toString(), lastModified: new Date() }));
}
