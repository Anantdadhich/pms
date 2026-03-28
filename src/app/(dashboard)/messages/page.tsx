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

    const sent = messages.filter((m) => m.status === "SENT").length
    const failed = messages.filter((m) => m.status === "FAILED").length
    const pending = messages.filter((m) => m.status === "PENDING").length

    const statCards = [
        {
            label: "Total",
            value: messages.length,
            sub: "All notifications",
            icon: MessageSquare,
            tone: "slate" as const,
        },
        {
            label: "Delivered",
            value: sent,
            sub: "Sent successfully",
            icon: CheckCircle2,
            tone: "emerald" as const,
        },
        {
            label: "Pending",
            value: pending,
            sub: "Awaiting delivery",
            icon: Clock,
            tone: "amber" as const,
        },
        {
            label: "Failed",
            value: failed,
            sub: "Needs attention",
            icon: AlertCircle,
            tone: "rose" as const,
        },
    ]

    const toneStyles = {
        slate: "bg-slate-100 text-slate-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        rose: "bg-rose-50 text-rose-600",
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-6">
            <Header
                title="Messages"
                description="Patient notifications and delivery status for your clinic."
                clinicId={user.clinicId}
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((s) => (
                    <Card
                        key={s.label}
                        className="rounded-[20px] border border-white/60 bg-white/70 shadow-[0_4px_24px_rgba(0,0,0,0.02)] backdrop-blur-2xl"
                    >
                        <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                            <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${toneStyles[s.tone]}`}
                            >
                                <s.icon className="h-5 w-5" strokeWidth={2} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">
                                    {s.label}
                                </p>
                                <p className="text-[22px] font-bold tabular-nums tracking-tight text-gray-900">
                                    {s.value}
                                </p>
                                <p className="truncate text-[12px] font-medium text-gray-500">{s.sub}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="min-h-0 flex-1 overflow-hidden rounded-[20px] border border-white/60 bg-white/70 shadow-[0_4px_24px_rgba(0,0,0,0.02)] backdrop-blur-2xl">
                <CardContent className="p-0">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                                <MessageSquare className="h-7 w-7" strokeWidth={1.75} />
                            </div>
                            <h3 className="text-[17px] font-bold text-gray-900">No messages yet</h3>
                            <p className="mt-2 max-w-md text-[14px] leading-relaxed text-gray-500">
                                When you send reminders or updates to patients, a timeline of deliveries
                                will show up here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100/50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="flex gap-4 px-4 py-5 transition-colors hover:bg-gray-50/50 sm:gap-5 sm:px-6"
                                >
                                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[15px] font-bold text-slate-600 shadow-inner">
                                        {msg.recipient.charAt(0)}
                                        {msg.status === "SENT" ? (
                                            <div className="absolute -bottom-0.5 -right-0.5 rounded-full border border-white bg-white p-0.5 shadow-sm">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                            </div>
                                        ) : msg.status === "FAILED" ? (
                                            <div className="absolute -bottom-0.5 -right-0.5 rounded-full border border-white bg-white p-0.5 shadow-sm">
                                                <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                                            </div>
                                        ) : (
                                            <div className="absolute -bottom-0.5 -right-0.5 rounded-full border border-white bg-white p-0.5 shadow-sm">
                                                <Clock className="h-3.5 w-3.5 text-amber-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                            <p className="text-[15px] font-bold leading-snug text-gray-900">
                                                {msg.recipient}
                                            </p>
                                            <time
                                                className="shrink-0 text-[12px] font-medium tabular-nums text-gray-400 sm:pl-4 sm:text-right sm:text-[13px]"
                                                dateTime={msg.time}
                                            >
                                                {format(new Date(msg.time), "MMM d, yyyy · HH:mm")}
                                            </time>
                                        </div>
                                        <p className="mt-2 text-[14px] leading-relaxed text-gray-600">
                                            {msg.message}
                                        </p>
                                        <div
                                            className={`mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                                                msg.status === "SENT"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : msg.status === "FAILED"
                                                      ? "bg-red-50 text-red-700"
                                                      : "bg-amber-50 text-amber-700"
                                            }`}
                                        >
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
    )
}
