import { getRoommates } from "@/actions/profile"
import { RoommateCard } from "@/components/roommates/roommate-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Find Roommates",
    description: "Connect with people looking to share a flat and become friends."
}

export const dynamic = 'force-dynamic'

export default async function RoommatesPage({ searchParams }: {
    searchParams: Promise<{ location?: string; minBudget?: string; maxBudget?: string }>
}) {
    const sp = await searchParams
    const filters = {
        location: sp.location,
        minBudget: sp.minBudget ? Number(sp.minBudget) : undefined,
        maxBudget: sp.maxBudget ? Number(sp.maxBudget) : undefined,
    }

    const roommates = await getRoommates(filters)

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 text-center md:text-left">
                <div>
                    <h1 className="text-3xl font-bold">Find Roommates</h1>
                    <p className="text-muted-foreground">Connect with potential flatmates and future friends.</p>
                </div>
                <Button asChild variant="outline">
                    <Link href="/profile/edit">List Yourself</Link>
                </Button>
            </div>

            {/* Simple Filter UI for Roommates */}
            <div className="bg-muted/20 p-4 rounded-lg mb-8 border">
                <form className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="text-xs font-medium mb-1 block">Location</label>
                        <input
                            name="location"
                            defaultValue={filters.location}
                            placeholder="Search by city or area..."
                            className="w-full h-10 px-3 rounded-md border bg-background"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit">Search</Button>
                        <Button variant="ghost" asChild>
                            <Link href="/roommates">Reset</Link>
                        </Button>
                    </div>
                </form>
            </div>

            {roommates.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-lg">
                    <p className="text-xl text-muted-foreground mb-4">No roommates found matching your criteria.</p>
                    <Button asChild variant="outline">
                        <Link href="/roommates">Clear Filters</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {roommates.map((user) => (
                        <RoommateCard key={user.id} roommate={user} />
                    ))}
                </div>
            )}
        </div>
    )
}
