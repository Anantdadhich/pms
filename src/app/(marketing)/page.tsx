"use client"

import { useState } from "react"
import {
    Users,
    Calendar,
    MessageSquare,
    Receipt,
    Stethoscope,
    ShieldCheck,
    ChevronRight,
    LayoutDashboard,
    Settings,
    QrCode,
    ListOrdered,
} from "lucide-react"

const PMS_FEATURES = [
    {
        title: "Your day on one screen",
        desc: "See appointments, patient activity, and key numbers from a simple dashboard built for busy clinics.",
        iconColor: "blue" as const,
        icon: LayoutDashboard,
    },
    {
        title: "Patients check themselves in",
        desc: "New patients scan a QR code at reception and fill in their details on their own phone—less clipboards and typing for your staff.",
        iconColor: "cyan" as const,
        icon: QrCode,
    },
    {
        title: "Billing that matches your day",
        desc: "Create and track invoices in the same system you use for visits, so you always know who has paid and who hasn’t.",
        iconColor: "orange" as const,
        icon: Receipt,
    },
]

const STATS = [
    {
        value: "One",
        label: "Home for your schedule, patients, and bills",
        icon: Calendar,
    },
    {
        value: "Private",
        label: "Team sign-in; patient information stays with your practice",
        icon: ShieldCheck,
    },
    {
        value: "Simple",
        label: "Clear screens your front desk and clinicians can learn quickly",
        icon: Users,
    },
]

const FAQ_DATA = [
    {
        q: "Do I need IT skills to use CareSync?",
        a: "No. If you can use a calendar and a spreadsheet, you can use CareSync. Setup is mostly filling in your clinic details, services, and optional QR code for new patients.",
    },
    {
        q: "What exactly is included?",
        a: "Dashboard overview, scheduling, patient records, a log of messages you send patients, billing and invoices, and settings for your clinic profile, treatment list with prices, and the patient self-registration link or QR code.",
    },
    {
        q: "How does the QR code for new patients work?",
        a: "You print or display a code from your settings. When someone scans it with their phone, they open a form to enter their information. Your team then sees them like any other patient in your list.",
    },
]

const FeaturePill = ({
    title,
    desc,
    iconColor,
    icon: Icon,
}: {
    title: string
    desc: string
    iconColor: "orange" | "blue" | "cyan"
    icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>
}) => {
    const colorMap = {
        orange: "bg-orange-50 text-orange-500",
        blue: "bg-blue-50 text-blue-500",
        cyan: "bg-cyan-50 text-cyan-500",
    }

    return (
        <div className="flex max-w-[340px] cursor-pointer items-start gap-4 rounded-[20px] border border-gray-100/50 bg-white px-7 py-5 shadow-md transition-transform hover:-translate-y-1">
            <div
                className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${colorMap[iconColor]}`}
            >
                <Icon size={20} strokeWidth={2.5} />
            </div>
            <div className="text-left">
                <h4 className="mb-1 text-[15px] font-medium">{title}</h4>
                <p className="text-[13px] leading-relaxed text-gray-500">{desc}</p>
            </div>
        </div>
    )
}

const AccordionItem = ({ q, a }: { q: string; a: string }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setIsOpen(!isOpen)
                }
            }}
            className="group cursor-pointer rounded-[20px] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
        >
            <div className="flex items-center justify-between">
                <h4 className="pr-4 text-[16px] font-medium text-gray-900">{q}</h4>
                <div
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-50 transition-transform duration-200 ${isOpen ? "rotate-90 bg-gray-100" : ""}`}
                >
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-900" />
                </div>
            </div>
            {isOpen && (
                <div className="animate-in fade-in slide-in-from-top-2 mt-4 border-t border-gray-50 pt-4 text-[14px] leading-relaxed text-gray-500">
                    {a}
                </div>
            )}
        </div>
    )
}

const HeroSection = () => (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50/50 via-rose-50/30 to-cyan-50/50 pt-16 pb-24">
        <div className="relative mx-auto max-w-[1400px] px-8 text-center">
            <div className="mb-8 flex items-center justify-center gap-2.5">
                <div className="flex items-center gap-2 rounded-full border border-gray-200/50 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm">
                    <span className="relative flex h-2 w-2 rounded-full bg-blue-500">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                    </span>
                    <span className="text-[14px] font-medium text-gray-700">CareSync · practice software</span>
                </div>
            </div>

            <h1 className="mb-8 text-[56px] font-normal leading-[1.1] tracking-tight text-gray-900">
                Run the front desk
                <br />
                without the pile-up.
            </h1>

            <p className="mx-auto mb-10 max-w-[600px] text-[17px] leading-relaxed text-gray-500">
                CareSync brings together scheduling, patient records, billing, and a simple way for new patients to
                register—so your team spends less time on paperwork and more time with people.
            </p>

            <div className="mb-16 flex flex-wrap items-center justify-center gap-4">
                <button className="rounded-xl bg-black px-8 py-3.5 text-[15px] text-white shadow-lg shadow-black/10 transition-colors hover:bg-gray-800">
                    Start free trial
                </button>
                <button className="rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-[15px] text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
                    View product tour
                </button>
            </div>

            {/* Dashboard mockup */}
            <div className="relative mx-auto max-w-[900px] rounded-[32px] border border-white bg-white/90 p-4 shadow-2xl backdrop-blur-xl md:p-8">
                <div className="flex h-[500px] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50 text-left shadow-inner">
                    <div className="flex h-12 items-center justify-between border-b border-gray-100 bg-white/80 px-4">
                        <div className="flex gap-2">
                            <div className="h-3 w-3 rounded-full bg-rose-400" />
                            <div className="h-3 w-3 rounded-full bg-amber-400" />
                            <div className="h-3 w-3 rounded-full bg-green-400" />
                        </div>
                        <div className="h-5 w-48 rounded-md bg-gray-100" />
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-[11px] font-medium text-blue-600">
                            DR
                        </div>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        <div className="w-16 space-y-2 border-r border-gray-100 bg-white p-3 md:w-56 md:p-4">
                            <div className="flex h-10 items-center justify-center rounded-xl bg-slate-900 text-cyan-300 md:justify-start md:px-4">
                                <LayoutDashboard className="h-5 w-5 md:mr-3" />
                                <span className="hidden text-[14px] font-medium md:inline">Dashboard</span>
                            </div>
                            {[
                                { icon: Calendar, label: "Schedule" },
                                { icon: Users, label: "Patients" },
                                { icon: MessageSquare, label: "Messages" },
                                { icon: Receipt, label: "Billing" },
                                { icon: Settings, label: "Settings" },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex h-10 cursor-pointer items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-50 md:justify-start md:px-4"
                                >
                                    <item.icon className="h-5 w-5 md:mr-3" />
                                    <span className="hidden text-[14px] font-medium md:inline">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-1 flex-col gap-6 overflow-y-auto bg-gray-50/30 p-6">
                            <div>
                                <h2 className="mb-1 text-[22px] font-medium text-gray-900">Good morning, Dr. Patel</h2>
                                <p className="text-[14px] text-gray-500">Here is what your practice looks like today.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                        <Users className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div className="mb-1 text-[28px] font-medium leading-none text-gray-900">38</div>
                                    <div className="text-[13px] text-gray-500">Active patients</div>
                                </div>
                                <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                                        <Calendar className="h-5 w-5 text-orange-500" />
                                    </div>
                                    <div className="mb-1 text-[28px] font-medium leading-none text-gray-900">14</div>
                                    <div className="text-[13px] text-gray-500">Visits this week</div>
                                </div>
                                <div className="rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                                        <QrCode className="h-5 w-5 text-cyan-600" />
                                    </div>
                                    <div className="mb-1 text-[28px] font-medium leading-none text-gray-900">QR</div>
                                    <div className="text-[13px] text-gray-500">Self check-in</div>
                                </div>
                            </div>

                            <div className="flex-1 rounded-[20px] border border-gray-100 bg-white p-5 shadow-sm">
                                <div className="mb-6 h-4 w-40 rounded-md bg-gray-200" />
                                <div className="space-y-3">
                                    {[1, 2, 3].map((_, i) => (
                                        <div
                                            key={i}
                                            className="flex h-14 items-center rounded-xl border border-gray-50 bg-gray-50/50 px-4"
                                        >
                                            <div className="mr-4 h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200" />
                                            <div className="flex-1">
                                                <div className="mb-2 h-2.5 w-24 rounded-full bg-gray-300" />
                                                <div className="h-2 w-16 rounded-full bg-gray-200" />
                                            </div>
                                            <div className="h-6 w-16 rounded-md border border-gray-200 bg-white" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                id="features"
                className="relative z-10 mx-auto mt-16 flex max-w-5xl flex-wrap justify-center gap-6 px-8 scroll-mt-28"
            >
                {PMS_FEATURES.map((pill, idx) => (
                    <FeaturePill key={idx} {...pill} />
                ))}
            </div>
        </div>
    </section>
)

const FeaturesSection = () => (
    <section id="capabilities" className="scroll-mt-28 bg-white py-32">
        <div className="mx-auto max-w-[1400px] px-8">
            <div className="mb-5 text-center">
                <span className="inline-block rounded-full bg-gray-100 px-5 py-2 text-[14px] font-medium text-gray-600">
                    Built for real clinics
                </span>
            </div>
            <h2 className="mb-24 text-center text-[48px] font-normal tracking-tight md:mb-20">
                Everything in one calm workspace
            </h2>

            <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
                <div className="space-y-4">
                    <div className="flex cursor-pointer items-start gap-5 rounded-[24px] border border-transparent p-6 transition-colors hover:border-gray-100/50 hover:bg-gray-50">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-gray-900 shadow-sm">
                            <Calendar className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="mb-1.5 text-[17px] font-medium">Schedule that everyone can read</h3>
                            <p className="text-[14px] leading-relaxed text-gray-500">
                                Book visits, see who is coming in, and keep the day organized without double-booking
                                chaos.
                            </p>
                        </div>
                    </div>

                    <div className="flex cursor-pointer items-start gap-5 rounded-[24px] border border-blue-100/50 bg-blue-50/50 p-6 transition-colors">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-blue-500 shadow-sm">
                            <Users className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="mb-1.5 text-[17px] font-medium">Patient files where you expect them</h3>
                            <p className="text-[14px] leading-relaxed text-gray-600">
                                Look up someone in seconds, add new patients by hand, or let them register with your QR
                                code at the desk.
                            </p>
                        </div>
                    </div>

                    <div className="flex cursor-pointer items-start gap-5 rounded-[24px] border border-transparent p-6 transition-colors hover:border-gray-100/50 hover:bg-gray-50">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-amber-100">
                            <ListOrdered className="text-amber-700" size={24} />
                        </div>
                        <div>
                            <h3 className="mb-1.5 text-[17px] font-medium">Treatment list with your prices</h3>
                            <p className="text-[14px] leading-relaxed text-gray-500">
                                Keep procedures and usual fees in Settings so billing and conversations with patients stay
                                consistent.
                            </p>
                        </div>
                    </div>

                    <div className="flex cursor-pointer items-start gap-5 rounded-[24px] border border-transparent p-6 transition-colors hover:border-gray-100/50 hover:bg-gray-50">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-emerald-100">
                            <Receipt className="text-emerald-700" size={24} />
                        </div>
                        <div>
                            <h3 className="mb-1.5 text-[17px] font-medium">Invoices alongside visits</h3>
                            <p className="text-[14px] leading-relaxed text-gray-500">
                                Track what you have charged and what is still open, without jumping to another system.
                            </p>
                        </div>
                    </div>

                    <div className="flex cursor-pointer items-start gap-5 rounded-[24px] border border-transparent p-6 transition-colors hover:border-gray-100/50 hover:bg-gray-50">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-violet-100">
                            <MessageSquare className="text-violet-700" size={24} />
                        </div>
                        <div>
                            <h3 className="mb-1.5 text-[17px] font-medium">Message log for your clinic</h3>
                            <p className="text-[14px] leading-relaxed text-gray-500">
                                See reminders and texts you have sent, and whether they went through—helpful when a
                                patient says they never got a message.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative min-h-[480px] rounded-[32px] border border-gray-100/50 bg-gray-50/80 p-10">
                    <div className="absolute right-10 top-10 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg">
                        <QrCode className="text-white" size={28} />
                    </div>

                    <div className="mt-24 space-y-4">
                        <div className="relative flex items-center gap-4 rounded-[20px] border border-gray-100/50 bg-white p-5 shadow-sm">
                            <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-rose-200 to-rose-300" />
                            <div className="min-w-0 flex-1">
                                <p className="mb-0.5 text-[15px] font-medium">New patient</p>
                                <p className="text-[13px] text-gray-500">Filled the form from the QR at reception.</p>
                            </div>
                        </div>

                        <div className="relative ml-0 flex items-center gap-4 rounded-[20px] border border-gray-100/50 bg-white p-5 shadow-sm md:ml-8">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-gradient-to-br from-cyan-400 to-blue-500 shadow-inner">
                                <Stethoscope size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="mb-0.5 text-[15px] font-medium">Your team</p>
                                <p className="text-[13px] text-blue-600">Charts the visit in Schedule and Patients.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 rounded-[20px] border border-gray-100/50 bg-white/80 p-5 opacity-60 shadow-sm">
                            <div className="h-12 w-12 shrink-0 rounded-full bg-gray-200" />
                            <div className="flex-1">
                                <p className="text-[15px] font-medium">End of day</p>
                                <p className="text-[13px] text-gray-500">Billing updates with today’s visits.</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 right-10 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 shadow-xl">
                        <ShieldCheck size={28} className="text-white" />
                    </div>
                </div>
            </div>
        </div>
    </section>
)

const StatsSection = () => (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-100/60 via-amber-50/40 to-cyan-100/60 py-32">
        <div className="relative mx-auto max-w-[1400px] px-8 text-center">
            <div className="mb-6">
                <span className="inline-block rounded-full bg-white/90 px-5 py-2 text-[14px] font-medium text-gray-700 shadow-sm">
                    Why practices pick CareSync
                </span>
            </div>

            <h2 className="mb-24 text-[48px] font-normal tracking-tight">
                Less juggling.
                <br />
                More face-to-face care.
            </h2>

            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
                {STATS.map((stat, idx) => (
                    <div
                        key={idx}
                        className="rounded-[32px] border border-white/50 bg-white/30 p-10 shadow-lg backdrop-blur-xl transition-transform duration-300 hover:-translate-y-2"
                    >
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-white/50 shadow-inner">
                            <stat.icon size={28} className="text-gray-800" strokeWidth={2.5} />
                        </div>
                        <div className="mb-3 text-[40px] font-medium leading-none tracking-tight text-gray-900">
                            {stat.value}
                        </div>
                        <div className="text-[15px] font-medium leading-snug text-gray-700">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    </section>
)

const FaqSection = () => (
    <section id="faq" className="w-full scroll-mt-28 border-t border-gray-100 bg-gray-50/50 py-32">
        <div className="mx-auto flex max-w-[1000px] flex-col gap-16 px-8 md:flex-row">
            <div className="md:w-1/3">
                <div className="mb-6">
                    <span className="inline-block rounded-full border border-gray-200/50 bg-white px-5 py-2 text-[14px] font-medium text-gray-600">
                        Common questions
                    </span>
                </div>
                <h3 className="mb-6 text-[36px] font-normal leading-tight tracking-tight text-gray-900">
                    Plain answers,
                    <br />
                    no jargon.
                </h3>
                <p className="mb-8 text-[15px] leading-relaxed text-gray-500">
                    If you are comparing systems for your clinic, start here—we describe what CareSync actually does
                    today.
                </p>
                <button className="rounded-xl bg-black px-6 py-3 text-[14px] text-white shadow-sm transition-colors hover:bg-gray-800">
                    Talk to us
                </button>
            </div>

            <div className="space-y-4 pt-4 md:w-2/3">
                {FAQ_DATA.map((faq, idx) => (
                    <AccordionItem key={idx} q={faq.q} a={faq.a} />
                ))}
            </div>
        </div>
    </section>
)

export default function MarketingPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
            <main>
                <HeroSection />
                <FeaturesSection />
                <StatsSection />
                <FaqSection />
            </main>
        </div>
    )
}
