import { auth } from "@/auth"
import { ListingForm } from "@/components/listings/listing-form"
import { redirect } from "next/navigation"

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
