import { auth } from "@/auth"
import { getListing } from "@/actions/listing"
import { ListingForm } from "@/components/listings/listing-form"
import { redirect, notFound } from "next/navigation"

export default async function EditListingPage({ params }: { params: { id: string } }) {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const listing = await getListing(params.id)

    if (!listing) {
        notFound()
    }

    if (listing.userId !== session.user.id) {
        redirect("/listings")
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-2xl mx-auto mb-6">
                <h1 className="text-2xl font-bold">Edit Listing</h1>
            </div>
            {/* 
         Note: We need to update ListingForm to accept initial data and handle 'update' mode.
         For MVP speed, I will modify ListingForm to accept optional 'listing' prop.
      */}
            <ListingForm listing={listing} />
        </div>
    )
}
