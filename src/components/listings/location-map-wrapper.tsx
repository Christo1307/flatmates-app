'use client'

import dynamic from 'next/dynamic'

const LocationMap = dynamic(() => import('./location-map').then(mod => mod.LocationMap), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg" />
})

export function LocationMapWrapper({ location }: { location: string }) {
    return <LocationMap location={location} />
}
