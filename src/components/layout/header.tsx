"use client"

import { Bell, Search, Plus, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlobalSearch } from "./global-search"

interface HeaderProps {
    title: string
    description?: string
    children?: React.ReactNode
    clinicId?: string
    action?: {
        label: string
        onClick: () => void
        icon?: LucideIcon
        variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    }
}

export function Header({ title, description, children, action, clinicId }: HeaderProps) {
    const Icon = action?.icon || Plus

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            <div>
                <h1 className="text-xl font-semibold text-foreground">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>

            <div className="flex items-center gap-4">
                {/* Global Search */}
                {clinicId && <GlobalSearch clinicId={clinicId} />}

                {children}

                {/* Primary action */}
                {action && (
                    <Button onClick={action.onClick} variant={action.variant || "default"} className="gap-2">
                        <Icon className="h-4 w-4" />
                        {action.label}
                    </Button>
                )}
            </div>
        </header>
    )
}
