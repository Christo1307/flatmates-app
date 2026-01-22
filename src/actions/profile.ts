"use server"

import { auth } from "@/auth"
import db from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const ProfileSchema = z.object({
    name: z.string().min(1).optional(),
    bio: z.string().optional(),
    age: z.coerce.number().min(18).optional(),
    occupation: z.string().optional(),
    budgetMin: z.coerce.number().optional(),
    budgetMax: z.coerce.number().optional(),
    lifestyle: z.string().optional(),
    // moveInDate handled as Date or string? Form usually sends string.
    moveInDate: z.string().optional().transform(str => str ? new Date(str) : undefined),
    isPublic: z.boolean().optional(),
    preferredLocation: z.string().optional(),
    images: z.string().optional(),
    image: z.string().optional(),
    hideGender: z.boolean().optional(),
})

import { Prisma } from "@prisma/client"

export async function updateProfile(formData: z.input<typeof ProfileSchema>) {
    const session = await auth()

    if (!session?.user?.id) {
        return { error: "Not authenticated" }
    }

    const validatedFields = ProfileSchema.safeParse(formData)

    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    try {
        const data = validatedFields.data
        // Filter out undefined
        const updateData: Prisma.UserUpdateInput = {}
        if (data.name !== undefined) updateData.name = data.name
        if (data.image !== undefined) updateData.image = data.image
        if (data.bio !== undefined) updateData.bio = data.bio
        if (data.age !== undefined) updateData.age = data.age
        if (data.occupation !== undefined) updateData.occupation = data.occupation
        if (data.budgetMin !== undefined) updateData.budgetMin = data.budgetMin
        if (data.budgetMax !== undefined) updateData.budgetMax = data.budgetMax
        if (data.lifestyle !== undefined) updateData.lifestyle = data.lifestyle
        if (data.moveInDate !== undefined) updateData.moveInDate = data.moveInDate
        if (data.isPublic !== undefined) updateData.isPublic = data.isPublic
        if (data.preferredLocation !== undefined) updateData.preferredLocation = data.preferredLocation

        if (data.images !== undefined) {
            const urls = data.images.split(',').map(s => s.trim()).filter(Boolean)
            updateData.images = JSON.stringify(urls)
        }

        // Handle settings
        // Handle settings
        if (data.hideGender !== undefined) {
            const currentUser = await db.user.findUnique({
                where: { id: session.user.id },
                select: { settings: true }
            })

            let currentSettings: Record<string, unknown> = {}
            if (currentUser?.settings) {
                try {
                    currentSettings = JSON.parse(currentUser.settings)
                } catch { }
            }

            currentSettings.hideGender = data.hideGender
            updateData.settings = JSON.stringify(currentSettings)
        }

        await db.user.update({
            where: { id: session.user.id },
            data: updateData,
        })

        revalidatePath("/profile")
        return { success: "Profile updated" }
    } catch {
        return { error: "Something went wrong" }
    }
}

export async function getProfile() {
    const session = await auth()
    if (!session?.user?.id) return null
    return await db.user.findUnique({
        where: { id: session.user.id }
    })
}

export async function getRoommates(filters?: {
    location?: string
    minBudget?: number
    maxBudget?: number
}) {
    const where: Prisma.UserWhereInput = {
        isPublic: true,
        // Don't show the logged in user to themselves if they are logged in
    }

    const session = await auth()
    if (session?.user?.id) {
        where.id = { not: session.user.id }
    }

    if (filters?.location) {
        where.OR = [
            { preferredLocation: { contains: filters.location, mode: 'insensitive' } },
            { lifestyle: { contains: filters.location, mode: 'insensitive' } } // Sometimes people put location or context in lifestyle tags
        ]
    }

    if (filters?.minBudget !== undefined || filters?.maxBudget !== undefined) {
        // This logic is slightly complex as budget is stored as min/max on user
        // We show users whose budget range overlaps with the filter or matches roughly
        if (filters.minBudget !== undefined) {
            where.budgetMax = { gte: filters.minBudget }
        }
        if (filters.maxBudget !== undefined) {
            where.budgetMin = { lte: filters.maxBudget }
        }
    }

    return await db.user.findMany({
        where,
        orderBy: {
            createdAt: 'desc'
        }
    })
}
