import { auth } from "@/auth"
import { ListingForm } from "@/components/listings/listing-form"
import { redirect } from "next/navigation"

import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Post a Room",
    description: "List your room or apartment and find great flatmates quickly."
}

export default async function CreateListingPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <ListingForm />
        </div>
    )
}
