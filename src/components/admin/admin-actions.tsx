"use client"

import { updateListingStatus, deleteListingAdmin } from "@/actions/admin"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"
import { Trash2, ShieldCheck, ShieldAlert } from "lucide-react"

export function AdminActions({ listingId, status }: { listingId: string, status: string }) {
    const [isPending, startTransition] = useTransition()

    const handleStatus = (newStatus: string) => {
        startTransition(async () => {
            await updateListingStatus(listingId, newStatus)
        })
    }

    const handleDelete = () => {
        if (!confirm("Are you sure?")) return
        startTransition(async () => {
            await deleteListingAdmin(listingId)
        })
    }

    return (
        <div className="flex justify-end gap-2">
            {status !== "REJECTED" && (
                <Button
                    size="sm"
                    variant="destructive"
                    title="Reject"
                    disabled={isPending}
                    onClick={() => handleStatus("REJECTED")}
                >
                    <ShieldAlert className="w-4 h-4" />
                </Button>
            )}
            {status === "REJECTED" && (
                <Button
                    size="sm"
                    variant="outline"
                    title="Approve"
                    disabled={isPending}
                    onClick={() => handleStatus("ACTIVE")}
                >
                    <ShieldCheck className="w-4 h-4" />
                </Button>
            )}
            <Button
                size="sm"
                variant="ghost"
                title="Delete"
                disabled={isPending}
                onClick={handleDelete}
            >
                <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
        </div>
    )
}
