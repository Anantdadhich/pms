"use client"

import { Bell, Search, Plus, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlobalSearch } from "./global-search"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebarlayout"

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
    const { state, isMobile } = useSidebar()

    return (
        <header className="flex flex-col md:flex-row md:h-[72px] md:items-center justify-between px-6 py-4 md:py-0 mb-8 rounded-[24px] bg-white/60 backdrop-blur-2xl border border-white shadow-[0_8px_32px_rgba(0,0,0,0.03)] mx-1 mt-2 gap-4 md:gap-0">
            <div className="flex items-center gap-4">
                {(state === "collapsed" || isMobile) && (
                    <SidebarTrigger className="h-10 w-10 text-gray-500 hover:text-gray-900 bg-white/80 hover:bg-white shadow-sm border border-gray-200/50 rounded-xl transition-all" />
                )}
                <div>
                    <h1 className="text-[20px] md:text-[24px] font-bold tracking-tight text-gray-900 leading-tight">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-[13px] text-gray-500 font-medium mt-0.5">{description}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Global Search */}
                {clinicId && <GlobalSearch clinicId={clinicId} />}

                {children}

                {/* Primary action */}
                {action && (
                    <Button 
                        onClick={action.onClick} 
                        variant={action.variant || "default"} 
                        className="gap-2 rounded-xl h-10 px-6 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-md transition-all hover:shadow-lg border border-gray-800/50"
                    >
                        <Icon className="h-4 w-4" strokeWidth={2.5} />
                        <span className="font-semibold text-[13px] tracking-wide">{action.label}</span>
                    </Button>
                )}
            </div>
        </header>
    )
}
