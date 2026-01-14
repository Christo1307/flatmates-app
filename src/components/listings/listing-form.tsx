"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createListing, updateListing } from "@/actions/listing"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Listing } from "@prisma/client"

const ListingFormSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    rent: z.coerce.number().min(1, "Rent is required"),
    deposit: z.coerce.number().optional(),
    location: z.string().min(3, "Location is required"),
    amenities: z.string().optional(),
    availableFrom: z.string().optional(),
    imageUrls: z.string().optional(),
})

interface ListingFormProps {
    listing?: Listing
}

export function ListingForm({ listing }: ListingFormProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    // Format images and amenities for form
    let defaultImages = ""
    try {
        if (listing?.images) {
            defaultImages = (JSON.parse(listing.images) as string[]).join(", ")
        }
    } catch (e) { }

    const form = useForm({
        resolver: zodResolver(ListingFormSchema),
        defaultValues: {
            title: listing?.title || "",
            description: listing?.description || "",
            rent: listing?.rent || undefined,
            deposit: listing?.deposit || undefined,
            location: listing?.location || "",
            amenities: listing?.amenities || "",
            availableFrom: listing?.availableFrom ? new Date(listing.availableFrom).toISOString().split('T')[0] : "",
            imageUrls: defaultImages,
        },
    })

    function onSubmit(values: z.infer<typeof ListingFormSchema>) {
        startTransition(async () => {
            if (listing) {
                const res = await updateListing(listing.id, values)
                if (res.success) {
                    router.push("/my-listings")
                    router.refresh()
                }
            } else {
                const res = await createListing(values)
                if (res.success) {
                    router.push("/listings")
                    router.refresh()
                }
            }
        })
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{listing ? "Edit Listing" : "Post a New Room"}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Spacious room in Indiranagar" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location / Area</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Koramangala 4th Block" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="rent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Monthly Rent (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} value={(field.value as number) ?? ''} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="deposit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deposit (₹)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} value={(field.value as number) ?? ''} disabled={isPending} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the room, flatmates, and house rules..."
                                            className="min-h-[100px]"
                                            {...field}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amenities"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amenities</FormLabel>
                                    <FormControl>
                                        <Input placeholder="WiFi, AC, Washing Machine (comma separated)" {...field} value={field.value || ''} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="availableFrom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Available From</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} value={field.value || ''} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrls"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URLs</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Paste image URLs separated by commas" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormDescription>For MVP, please host images elsewhere and paste links here.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {listing ? (isPending ? "Updating..." : "Update Listing") : (isPending ? "Posting..." : "Create Listing")}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
