"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updateProfile } from "@/actions/profile"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck } from "lucide-react"
import { useTransition } from "react"
import { User } from "@prisma/client"
import { useRouter } from "next/navigation"

const ProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    bio: z.string().optional(),
    age: z.coerce.number().min(18, "Must be at least 18").optional(),
    occupation: z.string().optional(),
    budgetMin: z.coerce.number().optional(),
    budgetMax: z.coerce.number().optional(),
    lifestyle: z.string().optional(),
    moveInDate: z.string().optional(),
    isPublic: z.boolean().optional(),
    preferredLocation: z.string().optional(),
    hideGender: z.boolean().optional(),
})



interface ProfileFormProps {
    user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    // Parse settings if available
    let settings: Record<string, unknown> = {}
    try {
        settings = user.settings ? JSON.parse(user.settings) : {}
    } catch { }

    const form = useForm({
        resolver: zodResolver(ProfileSchema),
        defaultValues: {
            name: user.name || "",
            bio: user.bio || "",
            age: user.age || undefined,
            occupation: user.occupation || "",
            budgetMin: user.budgetMin || undefined,
            budgetMax: user.budgetMax || undefined,
            lifestyle: user.lifestyle || "",
            moveInDate: user.moveInDate ? new Date(user.moveInDate).toISOString().split('T')[0] : "",
            isPublic: user.isPublic || false,
            preferredLocation: user.preferredLocation || "",
            hideGender: (settings.hideGender as boolean) || false,
        },
    })

    function onSubmit(values: z.infer<typeof ProfileSchema>) {
        startTransition(async () => {
            const res = await updateProfile(values)
            if (res.success) {
                router.refresh()
            }
        })
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        Edit Profile
                        {user.role === "LISTER_PREMIUM" && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 gap-1">
                                <ShieldCheck className="w-3 h-3" /> Premium
                            </Badge>
                        )}
                    </CardTitle>
                </div>
                <CardDescription>Update your personal information and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Age</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} value={(field.value as number | undefined) ?? ''} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="occupation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Occupation</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us about yourself..." className="resize-none" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="budgetMin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Min Budget (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} value={(field.value as number | undefined) ?? ''} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="budgetMax"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max Budget (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} value={(field.value as number | undefined) ?? ''} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="lifestyle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Lifestyle Tags</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Early bird, Non-smoker, Pet friendly" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormDescription>Comma separated (e.g. Vegan, Night Owl)</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="moveInDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Move-in Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-medium">Roommate Search Settings</h3>
                            <FormField
                                control={form.control}
                                name="isPublic"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">List Profile Publicly</FormLabel>
                                            <FormDescription>
                                                Make your profile visible to others looking for roommates.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="preferredLocation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preferred Search Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Bangalore, Indiranagar" {...field} disabled={isPending} />
                                        </FormControl>
                                        <FormDescription>Where are you looking for a flat sharing?</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg font-medium">Privacy Settings</h3>
                            <FormField
                                control={form.control}
                                name="hideGender"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Hide Gender</FormLabel>
                                            <FormDescription>
                                                Hide your gender from public listings.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
