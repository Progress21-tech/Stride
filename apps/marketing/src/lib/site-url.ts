const configuredSiteUrl = process.env.NEXT_PUBLIC_MARKETING_URL?.trim() || 'https://sylpace.example';

export const siteUrl = new URL(
  /^https?:\/\//i.test(configuredSiteUrl)
    ? configuredSiteUrl
    : `https://${configuredSiteUrl.replace(/^\/+/, '')}`,
);
