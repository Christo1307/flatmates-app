import { RegisterForm } from "@/components/auth/register-form"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create an account on Roommates India to find flatmates and listings."
}

export default function SignupPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <RegisterForm />
        </div>
    )
}
