import { getListing } from "@/actions/listing"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Check, ArrowLeft, ShieldCheck, Star } from "lucide-react"
import { auth } from "@/auth"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
export const dynamic = 'force-dynamic'

import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params
    const listing = await getListing(id)
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

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const listing = await getListing(id)

    if (!listing) {
        notFound()
    }

    const session = await auth()
    const isOwner = session?.user?.id === listing.userId

    let images: string[] = []
    try {
        if (listing.images) {
            const parsed = JSON.parse(listing.images)
            images = Array.isArray(parsed) ? parsed : []
        }
    } catch (e) {
        images = []
    }

    const amenities = listing.amenities ? listing.amenities.split(',').map(s => s.trim()).filter(Boolean) : []

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
                            <div className="relative w-full h-80">
                                <Image
                                    src={images[0]}
                                    alt={listing.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {images.length > 1 && (
                                <div className="grid grid-cols-3 gap-2">
                                    {images.slice(1).map((img: string, i: number) => (
                                        <div key={i} className="relative h-24 w-full">
                                            <Image
                                                src={img}
                                                alt={`Gallery ${i}`}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-64 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                            No Images Provided
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                                {listing.isFeatured && (
                                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white gap-1">
                                        <Star className="w-3 h-3 fill-white" /> Featured
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center text-muted-foreground gap-2">
                                <MapPin className="w-5 h-5" />
                                <span className="text-lg">{listing.location}</span>
                            </div>
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
                                    <span>Available from <strong>{(() => {
                                        const d = new Date(listing.availableFrom);
                                        return isNaN(d.getTime()) ? "Immediate" : d.toLocaleDateString();
                                    })()}</strong></span>
                                </div>
                            )}

                            <div className="pt-4 border-t">
                                <p className="text-sm font-medium mb-2">Listed by</p>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-10 w-10 relative rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                                        {listing.user?.image ? (
                                            <Image
                                                src={listing.user.image}
                                                alt={listing.user.name || "User"}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            (listing.user?.name || "U").charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium">{listing.user?.name || "Flatmate"}</p>
                                            {listing.user?.role === "LISTER_PREMIUM" && (
                                                <ShieldCheck className="w-4 h-4 text-blue-500 fill-blue-50" />
                                            )}
                                        </div>
                                        {listing.user?.role === "LISTER_PREMIUM" ? (
                                            <p className="text-xs text-blue-600 font-medium">Verified Provider</p>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">Standard User</p>
                                        )}
                                    </div>
                                </div>
                                {isOwner ? (
                                    <Button variant="outline" className="w-full" size="lg" disabled>
                                        Your Listing
                                    </Button>
                                ) : (
                                    <Button asChild className="w-full" size="lg" disabled={!listing.userId}>
                                        {listing.userId ? (
                                            <Link href={`/messages/${listing.userId}`}>Contact User</Link>
                                        ) : (
                                            "Contact Details Not Available"
                                        )}
                                    </Button>
                                )}
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
