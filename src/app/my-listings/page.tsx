import { auth } from "@/auth"
import db from "@/lib/db"
import { ListingCard } from "@/components/listings/listing-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function MyListingsPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const listings = await db.listing.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, image: true, role: true } } }
    })

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Listings</h1>
                <Button asChild>
                    <Link href="/listings/create">Post New Room</Link>
                </Button>
            </div>

            {listings.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-lg">
                    <p className="text-xl text-muted-foreground mb-4">You haven&apos;t posted any listings yet.</p>
                    <Button asChild>
                        <Link href="/listings/create">Get Started</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <div key={listing.id} className="relative group">
                            <ListingCard listing={listing} />
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button asChild size="sm" variant="secondary">
                                    <Link href={`/listings/${listing.id}/edit`}>Edit</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
