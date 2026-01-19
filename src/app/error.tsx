'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Unhandled Error:', error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
                An error occurred while rendering this page. This might be due to a technical issue or temporary data problem.
            </p>
            {process.env.NODE_ENV === 'development' && (
                <pre className="bg-muted p-4 rounded text-xs text-left mb-6 max-w-full overflow-auto">
                    {error.message}
                    {error.stack}
                </pre>
            )}
            <div className="flex gap-4">
                <Button onClick={() => reset()}>Try again</Button>
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                    Go to Home
                </Button>
            </div>
        </div>
    )
}
