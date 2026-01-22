"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, MapPin, User as UserIcon, Calendar, Wallet } from "lucide-react"
import Link from "next/link"
import { User } from "@prisma/client"
import Image from "next/image"

interface RoommateCardProps {
    roommate: User
}

export function RoommateCard({ roommate }: RoommateCardProps) {
    const lifestyleTags = roommate.lifestyle ? roommate.lifestyle.split(',').map(tag => tag.trim()) : []

    let profileImages: string[] = []
    try {
        if (roommate.images) {
            const parsed = JSON.parse(roommate.images)
            profileImages = Array.isArray(parsed) ? parsed : []
        }
    } catch { }

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow group flex flex-col h-full">
            {profileImages.length > 0 ? (
                <div className="relative h-56 w-full overflow-hidden bg-muted">
                    <div className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth">
                        {profileImages.map((img, i) => (
                            <div key={i} className="relative h-full w-[100%] flex-shrink-0 snap-center">
                                <Image
                                    src={img}
                                    alt={`${roommate.name}'s profile ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                    priority={i === 0}
                                />
                            </div>
                        ))}
                    </div>
                    {profileImages.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm z-10 flex items-center gap-1 font-medium">
                            {profileImages.length} Photos
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-56 w-full bg-muted flex flex-col items-center justify-center gap-2 border-b">
                    <UserIcon className="w-10 h-10 text-muted-foreground/20" />
                    <span className="text-xs text-muted-foreground/40 font-medium">No gallery images</span>
                </div>
            )}
            <CardHeader className="flex flex-row items-center gap-4 pb-2 pt-4 relative">
                <Avatar className="h-14 w-14 border-4 border-background -mt-10 shadow-md">
                    <AvatarImage src={roommate.image || ""} alt={roommate.name || "User"} className="object-cover" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">{roommate.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <h3 className="font-semibold text-lg">{roommate.name}</h3>
                    <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        {roommate.preferredLocation || "Location not specified"}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                        <span>{roommate.age ? `${roommate.age} years` : "Age N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate">{roommate.occupation || "Occupation N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                        <span>
                            {roommate.budgetMin || roommate.budgetMax
                                ? `₹${roommate.budgetMin || 0} - ${roommate.budgetMax || 'Any'}`
                                : "Budget N/A"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{roommate.moveInDate ? new Date(roommate.moveInDate).toLocaleDateString() : "Date N/A"}</span>
                    </div>
                </div>

                {roommate.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {roommate.bio}
                    </p>
                )}

                {lifestyleTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {lifestyleTags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {tag}
                            </Badge>
                        ))}
                        {lifestyleTags.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{lifestyleTags.length - 3} more</span>
                        )}
                    </div>
                )}
            </CardContent>
            <CardFooter className="pt-0">
                <Button asChild className="w-full">
                    <Link href={`/messages?userId=${roommate.id}`}>Message</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
