"use server"

import { auth } from "@/auth"
import db from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function upgradeToPremium() {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: { role: "LISTER_PREMIUM" }
        })
        revalidatePath("/premium")
        revalidatePath("/profile")
        return { success: "Upgraded to Premium" }
    } catch (e) {
        return { error: "Failed to upgrade" }
    }
}
