"use server"

import { auth } from "@/auth"
import db from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function checkAdmin() {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return false
    }
    return true
}

export async function getAllListingsForAdmin() {
    const isAdmin = await checkAdmin()
    if (!isAdmin) return []

    return await db.listing.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } }
    })
}

export async function updateListingStatus(listingId: string, status: string) {
    const isAdmin = await checkAdmin()
    if (!isAdmin) return { error: "Unauthorized" }

    try {
        await db.listing.update({
            where: { id: listingId },
            data: { status }
        })
        revalidatePath("/admin")
        revalidatePath("/listings")
        return { success: "Status updated" }
    } catch (e) {
        return { error: "Failed to update status" }
    }
}

export async function deleteListingAdmin(listingId: string) {
    const isAdmin = await checkAdmin()
    if (!isAdmin) return { error: "Unauthorized" }

    try {
        await db.listing.delete({
            where: { id: listingId }
        })
        revalidatePath("/admin")
        revalidatePath("/listings")
        return { success: "Deleted" }
    } catch (e) {
        return { error: "Failed to delete" }
    }
}
