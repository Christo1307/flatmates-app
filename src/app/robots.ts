import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://roommatesindia.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/my-listings/', '/profile/', '/messages/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
