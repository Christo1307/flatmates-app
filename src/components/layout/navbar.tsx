"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { User, LogOut, LayoutDashboard, Crown, MessageSquare } from "lucide-react"

export function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="border-b bg-background sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
                    Roommates India
                </Link>

                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            {session?.user?.role === "ADMIN" && (
                                <Button variant="ghost" asChild>
                                    <Link href="/admin">
                                        <LayoutDashboard className="w-4 h-4 mr-2" /> Admin
                                    </Link>
                                </Button>
                            )}

                            {session?.user?.role !== "LISTER_PREMIUM" && session?.user?.role !== "ADMIN" && (
                                <Button variant="default" size="sm" className="hidden sm:flex bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white border-0" asChild>
                                    <Link href="/premium">
                                        <Crown className="w-4 h-4 mr-2 fill-current" /> Upgrade
                                    </Link>
                                </Button>
                            )}

                            <Button variant="ghost" size="icon" asChild title="Messages">
                                <Link href="/messages">
                                    <MessageSquare className="w-5 h-5" />
                                </Link>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={session.user.image || undefined} alt={session.user.name || ""} />
                                            <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {session.user.email}
                                            </p>
                                            {session?.user?.role === "LISTER_PREMIUM" && (
                                                <p className="text-xs font-semibold text-yellow-600 mt-1 flex items-center gap-1">
                                                    <Crown className="w-3 h-3 fill-current" /> Premium Member
                                                </p>
                                            )}
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile/edit">
                                            <User className="mr-2 h-4 w-4" /> Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/my-listings">
                                            <LayoutDashboard className="mr-2 h-4 w-4" /> My Listings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/premium">
                                            <Crown className="mr-2 h-4 w-4" /> Premium Plans
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => signOut()}>
                                        <LogOut className="mr-2 h-4 w-4" /> Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="ghost" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
