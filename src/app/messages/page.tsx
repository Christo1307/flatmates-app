import { getConversations } from "@/actions/message"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
    const session = await auth()
    if (!session?.user) redirect("/login")

    const conversations = await getConversations()

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Messages</h1>

            {conversations.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-lg">
                    <p className="text-xl text-muted-foreground">No messages yet.</p>
                    <p className="text-muted-foreground mt-2">Start a conversation by contacting a user from a listing.</p>
                </div>
            ) : (
                <div className="grid gap-4 max-w-2xl mx-auto">
                    {conversations.map((conv) => (
                        <Link href={`/messages/${conv.user.id}`} key={conv.user.id}>
                            <Card className="hover:bg-accent transition-colors cursor-pointer">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={conv.user?.image || undefined} />
                                        <AvatarFallback>{conv.user?.name?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-grow overflow-hidden">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-semibold truncate">{conv.user?.name || "User"}</h3>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                {new Date(conv.timestamp).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {conv.lastMessage}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
