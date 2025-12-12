import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9003';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/portfolio/*/edit'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
