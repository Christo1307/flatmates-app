import { MetadataRoute } from 'next'
import db from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://roommatesindia.com'

    // Static routes
    const routes = [
        '',
        '/login',
        '/signup',
        '/listings',
        '/premium',
        '/admin',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic listings
    let listings: { id: string, updatedAt: Date, isFeatured: boolean }[] = []
    try {
        listings = await db.listing.findMany({
            select: { id: true, updatedAt: true, isFeatured: true },
            where: { status: "ACTIVE" },
            orderBy: [
                { isFeatured: 'desc' },
                { updatedAt: 'desc' }
            ],
            take: 5000,
        })
    } catch (error) {
        console.error("Sitemap generation error:", error)
    }

    const listingRoutes = listings.map((listing) => ({
        url: `${baseUrl}/listings/${listing.id}`,
        lastModified: listing.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: listing.isFeatured ? 0.8 : 0.6,
    }))

    return [...routes, ...listingRoutes]
}
