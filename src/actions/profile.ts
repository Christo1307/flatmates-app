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
        if (data.bio !== undefined) updateData.bio = data.bio
        if (data.age !== undefined) updateData.age = data.age
        if (data.occupation !== undefined) updateData.occupation = data.occupation
        if (data.budgetMin !== undefined) updateData.budgetMin = data.budgetMin
        if (data.budgetMax !== undefined) updateData.budgetMax = data.budgetMax
        if (data.lifestyle !== undefined) updateData.lifestyle = data.lifestyle
        if (data.moveInDate !== undefined) updateData.moveInDate = data.moveInDate

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
