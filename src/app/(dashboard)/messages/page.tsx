import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { getAllMessages } from "@/lib/actions/dashboard"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { MessageSquare, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function MessagesPage() {
    const user = await getCurrentUser()
    if (!user || !user.clinicId) redirect("/sign-in")

    const messages = await getAllMessages(user.clinicId)

    return (
        <div className="flex flex-col h-full">
            <Header
                title="All Messages"
                description="View your recent patient notifications and system messages."
                clinicId={user.clinicId}
            />

            <div className="flex-1 space-y-6 px-6 pb-6">
                <Card className="bg-white/70 backdrop-blur-2xl border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-[20px] overflow-hidden">
                    <CardContent className="p-0">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                                <MessageSquare className="mb-4 h-12 w-12 opacity-20" />
                                <h3 className="text-lg font-bold text-gray-900 mb-1">No messages yet</h3>
                                <p className="text-[14px]">When you send notifications to patients, they will appear here.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100/50">
                                {messages.map((msg) => (
                                    <div key={msg.id} className="p-6 flex items-start gap-5 hover:bg-white/50 transition-colors">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-inner relative text-lg font-bold">
                                            {msg.recipient.charAt(0)}
                                            {msg.status === "SENT" ? (
                                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                                </div>
                                            ) : msg.status === "FAILED" ? (
                                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                                                    <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                                                </div>
                                            ) : (
                                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                                                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <p className="text-[16px] font-bold text-gray-900 truncate">
                                                    {msg.recipient}
                                                </p>
                                                <span className="text-[13px] text-gray-400 font-medium whitespace-nowrap pl-4">
                                                    {format(new Date(msg.time), "MMM dd, yyyy - HH:mm")}
                                                </span>
                                            </div>
                                            <p className="text-[14px] text-gray-600 leading-relaxed">
                                                {msg.message}
                                            </p>
                                            <div className={`mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider
                                                ${msg.status === "SENT" ? "bg-emerald-50 text-emerald-700" : 
                                                  msg.status === "FAILED" ? "bg-red-50 text-red-700" : 
                                                  "bg-amber-50 text-amber-700"}
                                            `}>
                                                {msg.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
