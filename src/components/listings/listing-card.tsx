import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Listing } from "@prisma/client"
import { MapPin, User, Calendar, Star, ShieldCheck } from "lucide-react"
import Image from "next/image"

interface ListingCardProps {
    listing: Listing & {
        user: {
            name: string | null,
            image: string | null,
            role: string
        },
        isFeatured: boolean
    }
}

export function ListingCard({ listing }: ListingCardProps) {
    let images: string[] = []
    try {
        if (listing.images) {
            const parsed = JSON.parse(listing.images)
            images = Array.isArray(parsed) ? parsed : []
        }
    } catch (e) {
        images = []
    }
    const firstImage = images.length > 0 ? images[0] : null

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
            <div className="relative h-48 w-full bg-muted rounded-t-lg overflow-hidden">
                {firstImage ? (
                    <Image
                        src={firstImage}
                        alt={listing.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                    {listing.isFeatured && (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white gap-1">
                            <Star className="w-3 h-3 fill-white" /> Featured
                        </Badge>
                    )}
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
                        <span className="flex items-center gap-1">
                            {listing.user?.name || "User"}
                            {listing.user?.role === "LISTER_PREMIUM" && (
                                <ShieldCheck className="w-3 h-3 text-blue-500 fill-blue-50" />
                            )}
                        </span>
                    </div>
                    {listing.availableFrom && (
                        <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>From {(() => {
                                const d = new Date(listing.availableFrom!);
                                return isNaN(d.getTime()) ? "Immediate" : d.toLocaleDateString();
                            })()}</span>
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
