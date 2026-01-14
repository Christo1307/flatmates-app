"use client"

import { useState, useRef, useEffect } from "react"
import { sendMessage } from "@/actions/message"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
    id: string
    content: string
    senderId: string
    createdAt: Date
}

interface ChatInterfaceProps {
    initialMessages: Message[]
    currentUserId: string
    otherUser: {
        id: string
        name: string | null
        image: string | null
    }
}

export function ChatInterface({ initialMessages, currentUserId, otherUser }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [input, setInput] = useState("")
    const [isSending, setIsSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    async function handleSend(e: React.FormEvent) {
        e.preventDefault()
        if (!input.trim() || isSending) return

        setIsSending(true)
        const tempId = Math.random().toString()
        const content = input

        // Optimistic update
        const newMessage: Message = {
            id: tempId,
            content: content,
            senderId: currentUserId,
            createdAt: new Date()
        }

        setMessages(prev => [...prev, newMessage])
        setInput("")

        const res = await sendMessage({ content, receiverId: otherUser.id })
        setIsSending(false)

        if (res.error) {
            // Rollback or show error (for MVP just console.error)
            console.error(res.error)
        } else {
            router.refresh()
        }
    }

    return (
        <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-background">
            <div className="p-4 border-b flex items-center gap-3 bg-muted/20">
                <Avatar>
                    <AvatarImage src={otherUser.image || undefined} />
                    <AvatarFallback>{otherUser.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold">{otherUser.name || "User"}</h3>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-lg px-4 py-2 ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                }`}>
                                <p>{msg.content}</p>
                                <span className="text-[10px] opacity-70 block text-right mt-1">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    )
                })}
                <div ref={scrollRef} />
            </div>

            <div className="p-4 border-t bg-muted/20">
                <form onSubmit={handleSend} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isSending}
                    />
                    <Button type="submit" size="icon" disabled={isSending}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}
