import { auth } from "@/auth"
import { getProfile } from "@/actions/profile"
import { ProfileForm } from "@/components/profile/profile-form"
import { redirect } from "next/navigation"

export default async function ProfileEditPage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    const user = await getProfile()

    if (!user) {
        redirect("/login") // Should not happen if session exists unless db sync issue
    }

    return (
        <div className="container mx-auto py-10 flex justify-center">
            <ProfileForm user={user} />
        </div>
    )
}
