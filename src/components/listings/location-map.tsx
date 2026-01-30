'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Circle, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default markers in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

type LocationMapProps = {
    location: string
}

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, 13);
    return null;
}

export function LocationMap({ location }: LocationMapProps) {
    // Default to Center of India if no location found initially
    const [position, setPosition] = useState<[number, number] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!location) {
            setLoading(false)
            return
        }

        const fetchCoordinates = async () => {
            try {
                // Use OpenStreetMap Nominatim API
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
                )
                const data = await response.json()

                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat)
                    const lon = parseFloat(data[0].lon)
                    setPosition([lat, lon])
                } else {
                    setError(true)
                }
            } catch (err) {
                console.error("Failed to geocode location", err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchCoordinates()
    }, [location])

    if (loading) {
        return <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center text-muted-foreground">Loading map...</div>
    }

    if (error || !position) {
        return <div className="h-[300px] w-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground">Location map not available</div>
    }

    return (
        <div className="h-[300px] w-full rounded-lg overflow-hidden relative z-0">
            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Circle
                    center={position}
                    pathOptions={{ fillColor: 'blue', color: 'blue', opacity: 0.5 }}
                    radius={800} // 800 meters radius to show approximate area
                />
                <ChangeView center={position} />
            </MapContainer>
        </div>
    )
}
