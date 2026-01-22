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

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12 text-blue-600 bg-blue-100">
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
