import { Sidebar } from "@/components/layout/sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebarlayout"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider className="bg-gradient-to-br from-amber-50/60 via-rose-50/40 to-cyan-50/60 min-h-screen selection:bg-cyan-100 selection:text-cyan-900">
            <Sidebar />
            <SidebarInset className="bg-transparent">
                <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
