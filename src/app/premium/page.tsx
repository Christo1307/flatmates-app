"use client"

import { Button } from "@/components/ui/button"
import { upgradeToPremium } from "@/actions/payments"
import { Check, Star } from "lucide-react"
import { useTransition } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function PremiumPage() {
    const [isPending, startTransition] = useTransition()
    const { data: session, update } = useSession()
    const router = useRouter()

    const isPremium = session?.user?.role === "LISTER_PREMIUM"

    const handleUpgrade = () => {
        startTransition(async () => {
            const res = await upgradeToPremium()
            if (res.success) {
                await update() // Update session
                router.refresh()
            }
        })
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
                <p className="text-muted-foreground text-lg">
                    Get verified, boost your listings, and find a flatmate faster.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="border rounded-xl p-8 bg-card shadow-sm flex flex-col">
                    <h3 className="text-2xl font-semibold mb-2">Basic</h3>
                    <div className="text-3xl font-bold mb-6">Free</div>
                    <ul className="space-y-3 mb-8 flex-grow">
                        <li className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            Post 1 Room Listing
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            Basic Search Filters
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            Chat with 5 Users/Day
                        </li>
                    </ul>
                    <Button variant="outline" disabled>Current Plan</Button>
                </div>

                {/* Premium Plan */}
                <div className="border-2 border-primary rounded-xl p-8 bg-card shadow-lg relative flex flex-col">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-bl-xl rounded-tr-xl">
                        POPULAR
                    </div>
                    <h3 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                        Pro Lister <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    </h3>
                    <div className="text-3xl font-bold mb-6">₹499 <span className="text-lg font-normal text-muted-foreground">/ month</span></div>
                    <ul className="space-y-3 mb-8 flex-grow">
                        <li className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            **Unlimited** Room Listings
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            **Featured** Listings (Top of Search)
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            **Verified** Badge
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            Unlimited Chatting
                        </li>
                    </ul>

                    {isPremium ? (
                        <Button className="w-full" variant="secondary" disabled>
                            Active Plan
                        </Button>
                    ) : (
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleUpgrade}
                            disabled={isPending}
                        >
                            {isPending ? "Upgrading..." : "Subscribe Now"}
                        </Button>
                    )}
                    <p className="text-xs text-center text-muted-foreground mt-3">
                        Mock payment flow for MVP. No actual charge.
                    </p>
                </div>
            </div>
        </div>
    )
}
