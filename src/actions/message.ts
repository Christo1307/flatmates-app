"use server"

import { auth } from "@/auth"
import db from "@/lib/db"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const MessageSchema = z.object({
    content: z.string().min(1, "Message cannot be empty"),
    receiverId: z.string(),
})

export async function sendMessage(formData: z.input<typeof MessageSchema>) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    const validated = MessageSchema.safeParse(formData)
    if (!validated.success) return { error: "Invalid message" }

    const { content, receiverId } = validated.data

    if (receiverId === session.user.id) return { error: "Cannot message yourself" }

    try {
        await db.message.create({
            data: {
                content,
                senderId: session.user.id,
                receiverId
            }
        })
    } catch {
        return { error: "Failed to send message" }
    }

    revalidatePath(`/messages/${receiverId}`)
    revalidatePath("/messages")
    return { success: "Sent" }
}

export async function getConversations() {
    const session = await auth()
    if (!session?.user?.id) return []

    // Get all messages where user is sender OR receiver
    // Then group by the "other" person
    const messages = await db.message.findMany({
        where: {
            OR: [
                { senderId: session.user.id },
                { receiverId: session.user.id }
            ]
        },
        orderBy: { createdAt: 'desc' },
        include: {
            sender: { select: { id: true, name: true, image: true } },
            receiver: { select: { id: true, name: true, image: true } }
        }
    })

    const conversations = new Map()

    for (const msg of messages) {
        const otherUser = msg.senderId === session.user.id ? msg.receiver : msg.sender
        if (!conversations.has(otherUser.id)) {
            conversations.set(otherUser.id, {
                user: otherUser,
                lastMessage: msg.content,
                timestamp: msg.createdAt
            })
        }
    }

    return Array.from(conversations.values())
}

export async function getMessages(otherUserId: string) {
    const session = await auth()
    if (!session?.user?.id) return []

    return await db.message.findMany({
        where: {
            OR: [
                { senderId: session.user.id, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: session.user.id }
            ]
        },
        orderBy: { createdAt: 'asc' },
        include: {
            sender: { select: { id: true, name: true, image: true } }
        }
    })
}
