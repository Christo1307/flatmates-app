"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

export function SearchFilters() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set('location', term)
        } else {
            params.delete('location')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    const handleMinRent = useDebouncedCallback((amount: string) => {
        const params = new URLSearchParams(searchParams)
        if (amount) {
            params.set('minRent', amount)
        } else {
            params.delete('minRent')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    const handleMaxRent = useDebouncedCallback((amount: string) => {
        const params = new URLSearchParams(searchParams)
        if (amount) {
            params.set('maxRent', amount)
        } else {
            params.delete('maxRent')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)


    return (
        <div className="bg-card p-4 rounded-lg shadow-sm border mb-8 flex flex-col md:flex-row gap-4 items-end md:items-center">
            <div className="flex-grow w-full md:w-auto">
                <label className="text-sm font-medium mb-1 block">Location</label>
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by area..."
                        className="pl-9"
                        onChange={(e) => handleSearch(e.target.value)}
                        defaultValue={searchParams.get('location')?.toString()}
                    />
                </div>
            </div>

            <div className="w-full md:w-32">
                <label className="text-sm font-medium mb-1 block">Min Rent</label>
                <Input
                    type="number"
                    placeholder="Min"
                    onChange={(e) => handleMinRent(e.target.value)}
                    defaultValue={searchParams.get('minRent')?.toString()}
                />
            </div>

            <div className="w-full md:w-32">
                <label className="text-sm font-medium mb-1 block">Max Rent</label>
                <Input
                    type="number"
                    placeholder="Max"
                    onChange={(e) => handleMaxRent(e.target.value)}
                    defaultValue={searchParams.get('maxRent')?.toString()}
                />
            </div>
        </div>
    )
}
