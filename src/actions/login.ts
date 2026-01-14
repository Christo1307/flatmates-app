"use server"

import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function login(formData: FormData) {
    try {
        await signIn("credentials", formData)
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials."
                default:
                    return "Something went wrong."
            }
        }
        throw error // Redirect throws an error, so we must rethrow it
    }
}
