"use client"

import { Button } from "@/components/ui/button"

export default function SentryTestPage() {
    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-2xl font-bold">Sentry Test Page</h1>
            <p className="text-muted-foreground text-center max-w-md">
                Click the button below to trigger a frontend error.
                Verify it appears in your Sentry dashboard after setting a DSN.
            </p>
            <Button
                variant="destructive"
                onClick={() => {
                    throw new Error("Sentry Frontend Test Error");
                }}
            >
                Trigger Error
            </Button>
        </div>
    )
}
