
import { auth } from "@/auth"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { nextUrl } = req

    // Define paths that require authentication
    const protectedPaths = [
        "/dashboard",
        "/profile",
        "/messages",
        "/my-listings",
        "/listings/create",
        "/premium"
    ]

    const isProtected = protectedPaths.some(path => nextUrl.pathname.startsWith(path))

    if (isProtected) {
        if (isLoggedIn) return
        const loginUrl = new URL('/login', nextUrl)
        loginUrl.searchParams.set('callbackUrl', nextUrl.pathname)
        return Response.redirect(loginUrl)
    }
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
