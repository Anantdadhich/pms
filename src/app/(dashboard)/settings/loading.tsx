import { Loader2 } from "lucide-react"

export default function SettingsLoading() {
    return (
        <div className="flex h-full items-center justify-center p-6">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading settings...</p>
            </div>
        </div>
    )
}
