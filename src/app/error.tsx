"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center p-4">
                    <div className="w-full max-w-md space-y-6 text-center">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold text-destructive">
                                Something went wrong
                            </h1>
                            <p className="text-muted-foreground">
                                We apologize for the inconvenience. An unexpected error occurred.
                            </p>
                        </div>

                        {process.env.NODE_ENV === "development" && (
                            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-left">
                                <p className="font-mono text-sm text-destructive">
                                    {error.message}
                                </p>
                                {error.digest && (
                                    <p className="mt-2 font-mono text-xs text-muted-foreground">
                                        Error ID: {error.digest}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                            <Button onClick={() => reset()}>
                                Try Again
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/">Go to Dashboard</Link>
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            If this problem persists, please contact support.
                        </p>
                    </div>
                </div>
            </body>
        </html>
    )
}
