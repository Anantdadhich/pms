"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser, useClerk } from "@clerk/nextjs"
import {
    LayoutDashboard,
    Calendar,
    Users,
    Receipt,
    Settings,
    Stethoscope,
    LogOut,
    PanelLeftClose,
    MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Sidebar as SidebarBase,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
    useSidebar,
    SidebarRail,
} from "@/components/ui/sidebarlayout"

const navigationItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Schedule",
        href: "/schedule",
        icon: Calendar,
    },
    {
        title: "Patients",
        href: "/patients",
        icon: Users,
    },
    {
        title: "Messages",
        href: "/messages",
        icon: MessageSquare,
    },
    {
        title: "Billing",
        href: "/billing",
        icon: Receipt,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
]

interface SidebarProps {
    className?: string
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const { isMobile, state } = useSidebar()
    const { user, isLoaded } = useUser()
    const { signOut } = useClerk()

    const handleSignOut = () => {
        signOut({ redirectUrl: '/sign-in' })
    }

    return (
        <SidebarBase
            collapsible="icon"
            className={cn(
                // Unapologetically premium glassmorphism sidebar
                "!bg-white/70 backdrop-blur-2xl border-r border-white/60 text-gray-900 shadow-[4px_0_32px_rgba(0,0,0,0.02)]", 
                className
            )}
        >
            {/* Header / Logo */}
            <div className="flex h-[88px] items-center justify-between px-6 pt-4 mb-2">
                <div className="flex items-center gap-3.5">
                    {/* Floating, glowing logo */}
                    <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#0F172A] to-slate-800 text-white shadow-[0_8px_16px_rgba(15,23,42,0.15)] ring-1 ring-white/10 group-data-[collapsible=icon]:mx-auto">
                        <Stethoscope className="h-[22px] w-[22px] text-cyan-400" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden whitespace-nowrap overflow-hidden">
                        <span className="text-[19px] font-bold tracking-tight text-[#0F172A] leading-none mb-1">
                            DentalPMS
                        </span>
                        <span className="text-[12px] text-gray-500 font-medium tracking-wide">
                            Clinic Management
                        </span>
                    </div>
                </div>

                {!isMobile && (
                    <SidebarTrigger className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-white/80 rounded-xl transition-all border border-gray-200/50 shadow-sm group-data-[collapsible=icon]:hidden bg-white/50" />
                )}
            </div>

            <SidebarContent className="px-3">
                <div className="px-4 mb-3 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] group-data-[collapsible=icon]:hidden">
                    Menu
                </div>
                <SidebarMenu className="gap-1.5">
                    {navigationItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/" && pathname?.startsWith(item.href))

                        return (
                            <SidebarMenuItem key={item.href} className="px-1 group/item">
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={item.title}
                                    className={cn(
                                        "h-[46px] rounded-[14px] transition-all duration-300 px-4 !bg-transparent outline-none",
                                        isActive
                                            ? "bg-white/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-white/60 text-gray-900 font-semibold"
                                            : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                                    )}
                                >
                                    <Link href={item.href} className="flex items-center gap-3.5 w-full">
                                        <div className={cn(
                                            "flex items-center justify-center transition-transform duration-300",
                                            isActive ? "scale-110" : "group-hover/item:scale-110"
                                        )}>
                                            <item.icon 
                                                className={cn(
                                                    "h-[20px] w-[20px] transition-colors",
                                                    isActive ? "text-cyan-600" : "text-gray-400 group-hover/item:text-gray-600"
                                                )} 
                                                strokeWidth={isActive ? 2.5 : 2} 
                                            />
                                        </div>
                                        <span className={cn(
                                            "text-[14.5px] tracking-wide",
                                            isActive ? "text-gray-900 font-bold" : "text-gray-500 font-medium"
                                        )}>{item.title}</span>
                                        {isActive && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                                        )}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4 bg-transparent border-t border-white/40">
                <div className="flex items-center gap-3 rounded-[16px] p-2 bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all hover:bg-white/60 group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:shadow-none">
                    <Avatar className="h-[38px] w-[38px] shrink-0 border-2 border-white shadow-sm bg-white">
                        <AvatarImage src={user?.imageUrl} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 text-[12px] font-bold">
                            {isLoaded && user ?
                                `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` :
                                '..'
                            }
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-1 flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
                        <span className="truncate text-[13.5px] font-bold text-gray-900 leading-none mb-1">
                            {isLoaded && user ? `${user.firstName} ${user.lastName}` : '...'}
                        </span>
                        <span className="truncate text-[11px] text-gray-500 font-medium tracking-wide">
                            {user?.primaryEmailAddress?.emailAddress || '...' }
                        </span>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0 rounded-xl text-gray-400 hover:bg-white hover:text-rose-600 hover:shadow-sm transition-all group-data-[collapsible=icon]:hidden border border-transparent hover:border-white/80"
                        onClick={handleSignOut}
                    >
                        <LogOut className="h-[16px] w-[16px]" strokeWidth={2.5} />
                    </Button>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </SidebarBase>
    )
}