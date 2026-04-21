import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/terms'],
      disallow: ['/api/', '/dashboard', '/graph-editor', '/settings'],
    },
    sitemap: 'https://commitify.site/sitemap.xml',
  };
}
