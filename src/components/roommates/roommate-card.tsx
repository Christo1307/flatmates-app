"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Briefcase, MapPin, User as UserIcon, Calendar, Wallet } from "lucide-react"
import Link from "next/link"
import { User } from "@prisma/client"

interface RoommateCardProps {
    roommate: User
}

export function RoommateCard({ roommate }: RoommateCardProps) {
    const lifestyleTags = roommate.lifestyle ? roommate.lifestyle.split(',').map(tag => tag.trim()) : []

    let profileImages: string[] = []
    try {
        profileImages = roommate.images ? JSON.parse(roommate.images) : []
    } catch { }

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
            {profileImages.length > 0 ? (
                <div className="relative h-48 w-full overflow-hidden">
                    <div className="flex h-full w-full overflow-x-auto snap-x snap-mandatory no-scrollbar">
                        {profileImages.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`${roommate.name}'s profile ${i + 1}`}
                                className="h-full w-full object-cover flex-shrink-0 snap-center"
                            />
                        ))}
                    </div>
                    {profileImages.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                            1 / {profileImages.length}
                        </div>
                    )}
                </div>
            ) : (
                <div className="h-48 w-full bg-muted flex items-center justify-center">
                    <UserIcon className="w-12 h-12 text-muted-foreground/30" />
                </div>
            )}
            <CardHeader className="flex flex-row items-center gap-4 pb-2 pt-4">
                <Avatar className="h-10 w-10 text-blue-600 bg-blue-100 border-2 border-background -mt-12 shadow-sm">
                    <AvatarImage src={roommate.image || ""} alt={roommate.name || "User"} />
                    <AvatarFallback>{roommate.name?.charAt(0) || "U"}</AvatarFallback>
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
