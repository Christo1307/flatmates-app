import { auth } from "@/auth"
import { getAllListingsForAdmin } from "@/actions/admin"
import { redirect } from "next/navigation"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { AdminActions } from "@/components/admin/admin-actions"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const session = await auth()

    if (session?.user?.role !== "ADMIN") {
        redirect("/")
    }

    const listings = await getAllListingsForAdmin()

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {listings.map((listing) => (
                            <TableRow key={listing.id}>
                                <TableCell className="font-medium max-w-[200px] truncate" title={listing.title}>
                                    {listing.title}
                                </TableCell>
                                <TableCell>{listing.user.name} <br /> <span className="text-xs text-muted-foreground">{listing.user.email}</span></TableCell>
                                <TableCell>
                                    <Badge variant={listing.status === 'ACTIVE' ? 'default' : 'secondary'}>
                                        {listing.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{new Date(listing.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <AdminActions listingId={listing.id} status={listing.status} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
