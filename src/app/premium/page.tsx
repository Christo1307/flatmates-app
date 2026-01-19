"use client"

import { Button } from "@/components/ui/button"
import { createPaymentOrder, verifyPayment } from "@/actions/payments"
import { Check, Star } from "lucide-react"
import { useTransition } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Script from "next/script"

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: new (options: any) => any;
    }
}

export default function PremiumPage() {
    const [isPending, startTransition] = useTransition()
    const { data: session, update } = useSession()
    const router = useRouter()

    const isPremium = session?.user?.role === "LISTER_PREMIUM"

    const handleUpgrade = () => {
        startTransition(async () => {
            try {
                // 1. Create Order
                const order = await createPaymentOrder()

                if (order.error) {
                    alert(order.error)
                    return
                }

                if (!order.orderId) {
                    alert("Failed to create order")
                    return
                }

                // 2. Initialize Razorpay
                const options = {
                    key: order.keyId,
                    amount: order.amount,
                    currency: order.currency,
                    name: "Flatmates Premium",
                    description: "Upgrade to Pro Lister",
                    order_id: order.orderId,
                    handler: async function (response: RazorpayResponse) {
                        // 3. Verify Payment
                        const verification = await verifyPayment(
                            response.razorpay_order_id,
                            response.razorpay_payment_id,
                            response.razorpay_signature
                        )

                        if (verification.success) {
                            await update() // Update session
                            router.refresh()
                            alert("Payment Successful! You are now a Premium member.")
                        } else {
                            alert("Payment verification failed.")
                        }
                    },
                    prefill: {
                        name: session?.user?.name || "",
                        email: session?.user?.email || "",
                    },
                    theme: {
                        color: "#0F172A", // Slate-900 or use your primary color
                    },
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response: { error: { description: string } }) {
                    alert(response.error.description);
                });
                rzp1.open();

            } catch (error) {
                console.error("Payment Error:", error)
                alert("Something went wrong during payment.")
            }
        })
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
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
                            {isPending ? "Starting Payment..." : "Subscribe Now"}
                        </Button>
                    )}
                    <p className="text-xs text-center text-muted-foreground mt-3">
                        Secure payment via Razorpay.
                    </p>
                </div>
            </div>

            <div className="mt-12 text-center">
                <Button variant="link" asChild>
                    <a href="/settings/billing">View Billing History</a>
                </Button>
            </div>
        </div>
    )
}
