import { LoginForm } from "@/components/auth/login-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your Roommates India account to manage listings and messages."
}

export default function LoginPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <LoginForm />
        </div>
    )
}
