import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-8 mx-auto">
          Roommates India
        </h1>
      </div>

      <div className="flex flex-col gap-4 text-center">
        <p className="text-lg text-muted-foreground mb-8">
          Find your perfect verified flatmate in metro cities.
        </p>

        <div className="flex gap-4 justify-center">
          {session ? (
            <>
              <Button asChild size="lg">
                <Link href="/profile/edit">My Profile</Link>
              </Button>
              <form
                action={async () => {
                  "use server"
                  const { signOut } = await import("@/auth")
                  await signOut()
                }}
              >
                <Button type="submit" variant="outline" size="lg">Sign Out</Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
