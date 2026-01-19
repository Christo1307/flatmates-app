"use server"

import { auth } from "@/auth"
import db from "@/lib/db"
import { revalidatePath } from "next/cache"

import Razorpay from "razorpay"
import crypto from "crypto"

// Initialize Razorpay
// Note: We'll check for credentials inside the function to avoid init errors if envs are missing during build/dev
const getRazorpay = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "",
        key_secret: process.env.RAZORPAY_KEY_SECRET || "",
    })
}

export async function createPaymentOrder() {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("Razorpay credentials missing")
            return { error: "Payment configuration error" }
        }

        const razorpay = getRazorpay()

        // 1. Create a PENDING payment record
        const payment = await db.payment.create({
            data: {
                userId: session.user.id,
                amount: 49900, // ₹499.00
                currency: "INR",
                status: "PENDING",
                provider: "RAZORPAY",
            }
        })

        // 2. Create Razorpay Order
        const options = {
            amount: 49900,
            currency: "INR",
            receipt: payment.id,
            notes: {
                userId: session.user.id,
                paymentId: payment.id
            }
        };

        const order = await razorpay.orders.create(options);

        // 3. Update payment with Transaction ID (Order ID)
        await db.payment.update({
            where: { id: payment.id },
            data: { transactionId: order.id }
        })

        return {
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        }

    } catch (e) {
        console.error("Razorpay Order Error:", e)
        return { error: "Failed to process payment" }
    }
}

export async function verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
) {
    const session = await auth()
    if (!session?.user?.id) return { error: "Unauthorized" }

    try {
        const secret = process.env.RAZORPAY_KEY_SECRET
        if (!secret) return { error: "Server configuration error" }

        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(razorpayOrderId + "|" + razorpayPaymentId)
            .digest("hex");

        if (generated_signature === razorpaySignature) {
            // Payment success - Update DB
            // Finding the payment by Order ID (stored in transactionId)
            // Since transactionId is not unique in schema, using findFirst/updateMany

            // We use updateMany as it's safer if multiple exist? No, we just want to update the correct one.
            // Ideally we should have the paymentID but the client only has orderID from the flow usually.
            // But we can rely on orderID.

            await db.payment.updateMany({
                where: { transactionId: razorpayOrderId },
                data: {
                    status: "COMPLETED",
                    // Optionally perform logic if you want to store the actual payment ID
                }
            })

            await db.user.update({
                where: { id: session.user.id },
                data: { role: "LISTER_PREMIUM" }
            })

            revalidatePath("/premium")
            revalidatePath("/profile")
            return { success: true }
        } else {
            return { error: "Invalid signature" }
        }
    } catch (e) {
        console.error("Verification Error:", e)
        return { error: "Payment verification failed" }
    }
}

export async function getPaymentHistory() {
    const session = await auth()
    if (!session?.user?.id) return []

    return await db.payment.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" }
    })
}
