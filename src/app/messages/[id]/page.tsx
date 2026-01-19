import { auth } from "@/auth"
import { getMessages } from "@/actions/message"
import db from "@/lib/db"
import { ChatInterface } from "@/components/chat/chat-interface"
import { redirect, notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    const otherUserId = id
    if (otherUserId === session.user.id) redirect("/messages") // Cannot chat with self

    const otherUser = await db.user.findUnique({
        where: { id: otherUserId },
        select: { id: true, name: true, image: true }
    })

    if (!otherUser) {
        console.error("Chat User Not Found:", otherUserId)
        notFound()
    }

    const messages = await getMessages(otherUserId)

    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            <ChatInterface
                initialMessages={messages}
                currentUserId={session.user.id}
                otherUser={otherUser}
            />
        </div>
    )
}
