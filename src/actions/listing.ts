"use server"

import { auth } from "@/auth"
import db from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const ListingSchema = z.object({
    title: z.string().min(5, "Title needed (min 5 chars)"),
    description: z.string().min(20, "Description needed (min 20 chars)"),
    rent: z.coerce.number().min(0, "Rent must be positive"),
    deposit: z.coerce.number().min(0).optional(),
    location: z.string().min(3, "Location required"),
    amenities: z.string().optional(), // We'll receive a string (JSON or comma sep)
    availableFrom: z.string().optional().transform(str => str ? new Date(str) : undefined),
    imageUrls: z.string().optional(), // Expecting comma separated or JSON, we will store as JSON array
})

export async function createListing(formData: z.input<typeof ListingSchema>) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const validated = ListingSchema.safeParse(formData)
    if (!validated.success) return { error: "Invalid fields" }

    const { title, description, rent, deposit, location, amenities, availableFrom, imageUrls } = validated.data

    // Process images -> JSON array
    let imagesJson = "[]"
    if (imageUrls) {
        const urls = imageUrls.split(',').map(s => s.trim()).filter(Boolean)
        imagesJson = JSON.stringify(urls)
    }

    try {
        await db.listing.create({
            data: {
                title,
                description,
                rent,
                deposit,
                location,
                amenities,
                availableFrom,
                images: imagesJson,
                userId: session.user.id
            }
        })
    } catch (e) {
        return { error: "Failed to create listing" }
    }

    revalidatePath("/listings")
    return { success: "Listing Created" }
}

export async function getListings(filters?: {
    location?: string
    minRent?: number
    maxRent?: number
}) {
    const where: any = { status: "ACTIVE" }

    if (filters?.location) {
        where.location = { contains: filters.location }
    }

    if (filters?.minRent !== undefined || filters?.maxRent !== undefined) {
        where.rent = {}
        if (filters.minRent !== undefined) where.rent.gte = filters.minRent
        if (filters.maxRent !== undefined) where.rent.lte = filters.maxRent
    }

    // Explicitly ensure we only show ACTIVE listings unless otherwise specified (admin function is separate)
    where.status = "ACTIVE"

    return await db.listing.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, image: true } } }
    })
}

export async function getListing(id: string) {
    return await db.listing.findUnique({
        where: { id },
        include: { user: { select: { name: true, image: true, email: true } } }
    })
}

export async function deleteListing(id: string) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const listing = await db.listing.findUnique({ where: { id } })
    if (!listing) return { error: "Not found" }

    if (listing.userId !== session.user.id) return { error: "Unauthorized" }

    await db.listing.delete({ where: { id } })
    revalidatePath("/listings")
    return { success: "Deleted" }
}

export async function updateListing(id: string, formData: z.input<typeof ListingSchema>) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const listing = await db.listing.findUnique({ where: { id } })
    if (!listing) return { error: "Not found" }

    if (listing.userId !== session.user.id) return { error: "Unauthorized" }

    const validated = ListingSchema.safeParse(formData)
    if (!validated.success) return { error: "Invalid fields" }

    const { title, description, rent, deposit, location, amenities, availableFrom, imageUrls } = validated.data

    // Process images
    let imagesJson = listing.images || "[]"
    if (imageUrls !== undefined) {
        const urls = imageUrls.split(',').map(s => s.trim()).filter(Boolean)
        imagesJson = JSON.stringify(urls)
    }

    await db.listing.update({
        where: { id },
        data: {
            title,
            description,
            rent,
            deposit,
            location,
            amenities,
            availableFrom,
            images: imagesJson,
        }
    })

    revalidatePath("/listings")
    revalidatePath(`/listings/${id}`)
    return { success: "Updated" }
}
