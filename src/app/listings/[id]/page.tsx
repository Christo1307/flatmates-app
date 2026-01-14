import { getListing } from "@/actions/listing"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Check, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
export const dynamic = 'force-dynamic'

import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const listing = await getListing(params.id)
    if (!listing) {
        return {
            title: "Listing Not Found",
        }
    }
    return {
        title: listing.title,
        description: `${listing.title} in ${listing.location} - Rent: ₹${listing.rent}. Find this and more on Roommates India.`,
    }
}

export default async function ListingPage({ params }: { params: { id: string } }) {
    const listing = await getListing(params.id)

    if (!listing) {
        notFound()
    }

    const images = listing.images ? JSON.parse(listing.images) : []
    const amenities = listing.amenities ? listing.amenities.split(',').map(s => s.trim()) : []

    return (
        <div className="container mx-auto py-8 px-4">
            <Button asChild variant="ghost" className="mb-6 pl-0">
                <Link href="/listings" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to listings
                </Link>
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Images */}
                    {images.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2 rounded-xl overflow-hidden shadow-sm">
                            <img src={images[0]} alt={listing.title} className="w-full h-80 object-cover" />
                            {images.length > 1 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {images.slice(1).map((img: string, i: number) => (
                                        <img key={i} src={img} alt="" className="h-24 w-full object-cover rounded-md" />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-64 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                            No Images Provided
                        </div>
                    )}

                    <div>
                        <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                        <div className="flex items-center text-muted-foreground gap-2">
                            <MapPin className="w-5 h-5" />
                            <span className="text-lg">{listing.location}</span>
                        </div>
                    </div>

                    <div className="prose max-w-none dark:prose-invert">
                        <h3 className="text-xl font-semibold mb-2">About this place</h3>
                        <p className="whitespace-pre-line text-muted-foreground">{listing.description}</p>
                    </div>

                    {amenities.length > 0 && (
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                {amenities.map((item: string) => (
                                    <Badge key={item} variant="secondary" className="px-3 py-1 flex items-center gap-1">
                                        <Check className="w-3 h-3" /> {item}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="md:col-span-1">
                    <Card className="sticky top-8">
                        <CardContent className="p-6 space-y-6">
                            <div>
                                <span className="text-3xl font-bold">₹{listing.rent}</span>
                                <span className="text-muted-foreground"> / month</span>
                                {listing.deposit && (
                                    <p className="text-sm text-muted-foreground mt-1">Deposit: ₹{listing.deposit}</p>
                                )}
                            </div>

                            {listing.availableFrom && (
                                <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg text-sm">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>Available from <strong>{new Date(listing.availableFrom).toLocaleDateString()}</strong></span>
                                </div>
                            )}

                            <div className="pt-4 border-t">
                                <p className="text-sm font-medium mb-2">Listed by</p>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                                        {listing.user.image ? (
                                            <img src={listing.user.image} alt={listing.user.name || "User"} />
                                        ) : (
                                            (listing.user.name || "U").charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium">{listing.user.name || "Flatmate"}</p>
                                        <p className="text-xs text-muted-foreground">Verified User</p>
                                    </div>
                                </div>
                                <Button asChild className="w-full" size="lg">
                                    <Link href={`/messages/${listing.userId}`}>Contact User</Link>
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-2">
                                    Secure your room on Roommates India
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
