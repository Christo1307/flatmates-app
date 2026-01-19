import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import { Navbar } from "@/components/layout/navbar"
import { auth } from "@/auth"
import { GoogleAnalytics } from '@next/third-parties/google'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Roommates India | Find Your Perfect Flatmate",
    template: "%s | Roommates India"
  },
  description: "The trusted platform for finding rooms, flatmates, and shared apartments in India. Verified listings, secure chat, and premium features.",
  keywords: ["roommates", "flatmates", "india", "rooms for rent", "shared apartments", "flatmates india"],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <SessionProvider session={session}>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </SessionProvider>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
