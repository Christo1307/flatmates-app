import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getListings } from "@/actions/listing"
import { ListingCard } from "@/components/listings/listing-card"
import { Search, MapPin, ShieldCheck, Sparkles } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const session = await auth()
  const listings = await getListings({})

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-primary/5 via-background to-background overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-300 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 animate-bounce">
            <Sparkles className="w-3 h-3" />
            <span>India's Most Trusted Flatmate Finder</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Find your perfect <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Verified Flatmate</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of verified students and professionals in metro cities. Secure, simple, and personal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20">
              <Link href="/listings">Browse All Rooms</Link>
            </Button>
            {!session && (
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base bg-background/50 backdrop-blur-sm">
                <Link href="/signup">Join the Community</Link>
              </Button>
            )}
            {session && (
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base bg-background/50 backdrop-blur-sm">
                <Link href="/listings/create">Post your Room</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Featured Section / Search Bar Concept */}
      <section className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div className="text-left">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Available Listings</h2>
            <p className="text-muted-foreground">Fresh rooms and flatmates updated daily.</p>
          </div>
          <Button asChild variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5">
            <Link href="/listings">View all 100+ listings →</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.slice(0, 6).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/20">
            <p className="text-xl text-muted-foreground mb-4">No listings available right now.</p>
            <Button asChild>
              <Link href="/listings/create">Be the first to post!</Link>
            </Button>
          </div>
        )}

        {listings.length > 6 && (
          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="rounded-full px-12">
              <Link href="/listings">Explore More Rooms</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Trust Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Profiles</h3>
              <p className="text-muted-foreground">Every user is manually verified to ensure high-quality, safe matches.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Prime Locations</h3>
              <p className="text-muted-foreground">Find rooms in Indiranagar, Koramangala, Powai, Gachibowli, and more.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Chat</h3>
              <p className="text-muted-foreground">Connect directly with owners and flatmates via our built-in secure chat.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
