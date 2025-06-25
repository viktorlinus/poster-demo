import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/generera',
          '/success',
          '/privacy', 
          '/villkor',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/admin/login',
          '/admin/dashboard', 
          '/admin/dev',
          '/api/',
          '/api/*',
          '/_next/',
          '/new-home/',
        ],
      },
    ],
    sitemap: 'https://petmemories.se/sitemap.xml',
  }
}