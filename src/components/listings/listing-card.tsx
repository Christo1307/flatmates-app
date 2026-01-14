import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Listing } from "@prisma/client"
import { MapPin, User, Calendar } from "lucide-react"

interface ListingCardProps {
    listing: Listing & { user: { name: string | null, image: string | null } }
}

export function ListingCard({ listing }: ListingCardProps) {
    const images = listing.images ? JSON.parse(listing.images) : []
    const firstImage = images.length > 0 ? images[0] : null

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full bg-muted rounded-t-lg overflow-hidden">
                {firstImage ? (
                    <img src={firstImage} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="font-semibold">₹{listing.rent}/mo</Badge>
                </div>
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{listing.location}</span>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {listing.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{listing.user.name || "User"}</span>
                    </div>
                    {listing.availableFrom && (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>From {new Date(listing.availableFrom).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/listings/${listing.id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
