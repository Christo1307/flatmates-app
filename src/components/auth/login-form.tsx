"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { login } from "@/actions/login"  // We need to adjust login action to handle object input or use standard formData
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useTransition } from "react"
import Link from "next/link"

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
})

export function LoginForm() {
    const [error, setError] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // We need to modify the login action to accept JSON/Object if we use RHF onSubmit not direct formData
    // Or we create a FormData object.
    // Let's modify login action to simple params or rewrite here.
    // Since login action expects FormData (from previous step), let's wrap it or change it.
    // Actually, sending FormData is fine.

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("")
        startTransition(async () => {
            const formData = new FormData()
            formData.append("email", values.email)
            formData.append("password", values.password)

            try {
                const result = await login(formData)
                if (result) setError(result)
            } catch (e) {
                setError("Something went wrong")
            }
        })
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your email below to login to your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="m@example.com" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="******" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {error && (
                            <div className="text-sm text-red-500 font-medium">{error}</div>
                        )}
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
                <div className="text-sm text-muted-foreground text-center w-full">
                    Don't have an account? <Link href="/signup" className="underline text-primary">Sign up</Link>
                </div>
            </CardFooter>
        </Card>
    )
}
