"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Dashboard error:", error)
    }, [error])

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4 text-center">
                <h2 className="text-2xl font-bold text-destructive">
                    Unable to Load Dashboard
                </h2>
                <p className="text-muted-foreground">
                    {error.message || "An error occurred while loading the dashboard data."}
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                    <Button onClick={() => reset()}>
                        Retry
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                    >
                        Refresh Page
                    </Button>
                </div>
            </div>
        </div>
    )
}
