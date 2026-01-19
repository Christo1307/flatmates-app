import { getListings } from "@/actions/listing"
import { ListingCard } from "@/components/listings/listing-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SearchFilters } from "@/components/listings/search-filters"

import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Browse Listings",
    description: "Search for available rooms, flatmates, and shared apartments in your area."
}

export const dynamic = 'force-dynamic'

export default async function ListingsPage({ searchParams }: {
    searchParams: { location?: string; minRent?: string; maxRent?: string }
}) {
    const filters = {
        location: searchParams.location,
        minRent: searchParams.minRent ? Number(searchParams.minRent) : undefined,
        maxRent: searchParams.maxRent ? Number(searchParams.maxRent) : undefined,
    }

    const listings = await getListings(filters)

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Find a Room</h1>
                    <p className="text-muted-foreground">Browse available rooms and shared apartments.</p>
                </div>
                <Button asChild>
                    <Link href="/listings/create">Post a Room</Link>
                </Button>
            </div>

            <SearchFilters />

            {listings.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-lg">
                    <p className="text-xl text-muted-foreground mb-4">No listings found matching your criteria.</p>
                    <Button asChild variant="outline">
                        <Link href="/listings">Clear Filters</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    )
}
