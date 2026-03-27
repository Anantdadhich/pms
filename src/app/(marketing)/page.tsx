"use client";

import { useState } from 'react';
import {
    Users, Calendar, MessageSquare, LineChart,
    Stethoscope, ShieldCheck, Activity, Phone, ChevronRight, LayoutDashboard
} from 'lucide-react';


const PMS_FEATURES = [
    {
        title: 'Stop Missed Appointments',
        desc: 'We automatically send friendly text messages to remind patients to show up on time.',
        iconColor: 'orange',
        icon: MessageSquare,
    },
    {
        title: 'Easy Tooth Charts',
        desc: 'Click and draw on visual charts. Taking clinical notes is now as easy as using a coloring book.',
        iconColor: 'blue',
        icon: Stethoscope,
    },
    {
        title: 'Track Your Money',
        desc: 'See exactly how much you earned today and who still needs to pay, right on your screen.',
        iconColor: 'cyan',
        icon: LineChart,
    },
];

const STATS = [
    {
        value: '99.9%',
        label: 'Always Online',
        icon: Activity,
    },
    {
        value: '100%',
        label: 'Private & Safe',
        icon: ShieldCheck,
    },
    {
        value: '95%',
        label: 'Fewer Missed Visits',
        icon: Users,
    },
];

const FAQ_DATA = [
    {
        q: "Is patient information completely safe?",
        a: "Yes! We lock up your patients' information like a digital vault. Only you and your trusted staff can see it. It is completely safe and follows all healthcare privacy rules."
    },
    {
        q: "How do the automatic reminders work?",
        a: "It works like a magic robot receptionist. When a patient books a visit, CareSync waits patiently and sends them a friendly text message exactly one day before they need to show up."
    },
    {
        q: "What if a patient hasn't visited in a long time?",
        a: "CareSync notices when someone is overdue for a check-up! It will automatically send them a warm message saying 'We miss you!' with a link to book their next visit."
    }
];


const FeaturePill = ({ title, desc, iconColor, icon: Icon }: any) => {
    const colorMap: any = {
        orange: 'bg-orange-50 text-orange-500',
        blue: 'bg-blue-50 text-blue-500',
        cyan: 'bg-cyan-50 text-cyan-500',
    };

    return (
        <div className="flex items-start gap-4 bg-white rounded-[20px] px-7 py-5 shadow-md border border-gray-100/50 max-w-[340px] hover:-translate-y-1 transition-transform cursor-pointer">
            <div className={`w-11 h-11 ${colorMap[iconColor]} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon size={20} strokeWidth={2.5} />
            </div>
            <div className="text-left">
                <h4 className="text-[15px] font-medium mb-1">{title}</h4>
                <p className="text-[13px] text-gray-500 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
};

const AccordionItem = ({ q, a }: any) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            onClick={() => setIsOpen(!isOpen)}
            className="border border-gray-100 rounded-[20px] p-6 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
            <div className="flex justify-between items-center">
                <h4 className="font-medium text-[16px] text-gray-900 pr-4">{q}</h4>
                <div className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center transition-transform duration-200 ${isOpen ? 'rotate-90 bg-gray-100' : ''}`}>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-900" />
                </div>
            </div>
            {isOpen && (
                <div className="mt-4 text-[14px] text-gray-500 leading-relaxed border-t border-gray-50 pt-4 animate-in fade-in slide-in-from-top-2">
                    {a}
                </div>
            )}
        </div>
    );
};


const HeroSection = () => (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50/50 via-rose-50/30 to-cyan-50/50 pt-16 pb-24">
        <div className="relative max-w-[1400px] mx-auto px-8 text-center">

            {/* Badge */}
            <div className="flex items-center justify-center gap-2.5 mb-8">
                <div className="bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-gray-200/50 shadow-sm flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    </span>
                    <span className="text-[14px] text-gray-700 font-medium">Say hello to CareSync</span>
                </div>
            </div>

            <h1 className="text-[56px] leading-[1.1] font-normal mb-8 tracking-tight text-gray-900">
                Happy Patients.<br />Full Schedules. Zero Stress.
            </h1>

            <p className="max-w-[600px] mx-auto text-[17px] text-gray-500 mb-10 leading-relaxed">
                The super-simple software that runs your clinic for you. It books appointments, reminds patients to show up, and helps your practice grow—all on autopilot.
            </p>

            <div className="flex items-center justify-center gap-4 mb-16">
                <button className="bg-black text-white text-[15px] px-8 py-3.5 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-black/10">
                    Try it for Free
                </button>
                <button className="bg-white border border-gray-200 text-gray-700 text-[15px] px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                    See How it Works
                </button>
            </div>

            {/* Dashboard Mockup */}
            <div className="max-w-[900px] mx-auto bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl p-4 md:p-8 relative border border-white">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 overflow-hidden flex flex-col h-[500px] shadow-inner text-left">
                    {/* Window Header */}
                    <div className="h-12 border-b border-gray-100 flex items-center px-4 justify-between bg-white/80">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                        <div className="h-5 w-48 bg-gray-100 rounded-md"></div>
                        <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-medium flex items-center justify-center text-[11px]">DR</div>
                    </div>

                    {/* Window Body */}
                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar */}
                        <div className="w-16 md:w-56 border-r border-gray-100 bg-white p-4 space-y-2">
                            <div className="h-10 bg-blue-50 rounded-xl flex items-center justify-center md:justify-start md:px-4 text-blue-600">
                                <LayoutDashboard className="w-5 h-5 md:mr-3" />
                                <div className="hidden md:block text-[14px] font-medium">My Clinic</div>
                            </div>
                            {[
                                { icon: Calendar, label: "Calendar" },
                                { icon: Users, label: "Patients" },
                                { icon: MessageSquare, label: "Messages" }
                            ].map((item, i) => (
                                <div key={i} className="h-10 hover:bg-gray-50 rounded-xl flex items-center justify-center md:justify-start md:px-4 text-gray-500 cursor-pointer transition-colors">
                                    <item.icon className="w-5 h-5 md:mr-3" />
                                    <div className="hidden md:block text-[14px] font-medium">{item.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto bg-gray-50/30">
                            <div>
                                <h2 className="text-[22px] font-medium mb-1 text-gray-900">Good morning, Dr. Smith!</h2>
                                <p className="text-[14px] text-gray-500">Here is what your day looks like.</p>
                            </div>

                            {/* Stat Cards inside Mockup */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4"><Users className="w-5 h-5 text-blue-500" /></div>
                                    <div className="text-[28px] font-medium text-gray-900 leading-none mb-1">42</div>
                                    <div className="text-[13px] text-gray-500">Smiles Today</div>
                                </div>
                                <div className="bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4"><Calendar className="w-5 h-5 text-orange-500" /></div>
                                    <div className="text-[28px] font-medium text-gray-900 leading-none mb-1">12</div>
                                    <div className="text-[13px] text-gray-500">Coming Up</div>
                                </div>
                                <div className="bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-4"><LineChart className="w-5 h-5 text-green-500" /></div>
                                    <div className="text-[28px] font-medium text-gray-900 leading-none mb-1">$2.4k</div>
                                    <div className="text-[13px] text-gray-500">Earned Today</div>
                                </div>
                            </div>

                            {/* Schedule List inside Mockup */}
                            <div className="flex-1 bg-white border border-gray-100 rounded-[20px] p-5 shadow-sm">
                                <div className="h-4 w-32 bg-gray-200 rounded-md mb-6"></div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="h-14 border border-gray-50 rounded-xl bg-gray-50/50 flex items-center px-4">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mr-4"></div>
                                            <div className="flex-1">
                                                <div className="h-2.5 w-24 bg-gray-300 rounded-full mb-2"></div>
                                                <div className="h-2 w-16 bg-gray-200 rounded-full"></div>
                                            </div>
                                            <div className="w-16 h-6 rounded-md bg-white border border-gray-200"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-6 mt-16 max-w-5xl mx-auto px-8 relative z-10">
                {PMS_FEATURES.map((pill, idx) => (
                    <FeaturePill key={idx} {...pill} />
                ))}
            </div>
        </div>
    </section>
);

const FeaturesSection = () => (
    <section className="bg-white py-32">
        <div className="max-w-[1400px] mx-auto px-8">
            <div className="text-center mb-5">
                <span className="inline-block bg-gray-100 px-5 py-2 rounded-full text-[14px] text-gray-600 font-medium">How We Help</span>
            </div>
            <h2 className="text-[48px] leading-tight font-normal text-center mb-24 tracking-tight">
                Make every day run smoothly
            </h2>

            <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                {/* Left Column - Features */}
                <div className="space-y-4">
                    <div className="flex items-start gap-5 p-6 rounded-[24px] hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100/50 cursor-pointer">
                        <div className="w-12 h-12 bg-gray-900 rounded-[16px] flex items-center justify-center flex-shrink-0 shadow-sm">
                            <ShieldCheck className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-[17px] font-medium mb-1.5">Private Logins for Everyone</h3>
                            <p className="text-[14px] text-gray-500 leading-relaxed">Give your receptionist access to the calendar, and keep patient health notes strictly for the doctors. Everything stays perfectly private.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-5 p-6 rounded-[24px] bg-blue-50/50 border border-blue-100/50 transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-blue-500 rounded-[16px] flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Phone className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-[17px] font-medium mb-1.5">One Simple Inbox</h3>
                            <p className="text-[14px] text-gray-600 leading-relaxed">See all text messages and emails from a patient in one single place, just like reading a chat on your mobile phone.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-5 p-6 rounded-[24px] hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100/50 cursor-pointer">
                        <div className="w-12 h-12 bg-amber-100 rounded-[16px] flex items-center justify-center flex-shrink-0">
                            <Activity className="text-amber-600" size={24} />
                        </div>
                        <div>
                            <h3 className="text-[17px] font-medium mb-1.5">Your Invisible Helper</h3>
                            <p className="text-[14px] text-gray-500 leading-relaxed">CareSync does the boring chores—like sending reminders and updating schedules—so your team can smile and focus on the patients in front of them.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Visual Graphic */}
                <div className="bg-gray-50/80 rounded-[32px] p-10 relative min-h-[480px] border border-gray-100/50">
                    <div className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-[20px] flex items-center justify-center shadow-lg">
                        <MessageSquare className="text-white" size={28} />
                    </div>

                    <div className="mt-24 space-y-4">
                        <div className="bg-white rounded-[20px] p-5 flex items-center gap-4 shadow-sm border border-gray-100/50 relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-200 to-rose-300 flex-shrink-0"></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-medium mb-0.5">Sarah Jenkins</p>
                                <p className="text-[13px] text-gray-500">"Yes, I'll be there at 2:00 PM!"</p>
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <ShieldCheck size={12} className="text-white" />
                            </div>
                        </div>

                        <div className="bg-white rounded-[20px] p-5 flex items-center gap-4 shadow-sm border border-gray-100/50 relative ml-8">
                            <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-inner">
                                <Stethoscope size={20} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[15px] font-medium mb-0.5">CareSync Assistant</p>
                                <p className="text-[13px] text-blue-600">Reminder sent automatically.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[20px] p-5 flex items-center gap-4 shadow-sm border border-gray-100/50 opacity-50">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
                            <div className="flex-1">
                                <p className="text-[15px] font-medium">David Miller</p>
                                <p className="text-[13px] text-gray-500">Will text him tomorrow...</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-10 right-10 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-xl">
                        <ShieldCheck size={28} className="text-white" />
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const StatsSection = () => (
    <section className="relative py-32 overflow-hidden bg-gradient-to-br from-blue-100/60 via-amber-50/40 to-cyan-100/60">
        <div className="relative max-w-[1400px] mx-auto px-8 text-center">
            <div className="mb-6">
                <span className="inline-block bg-white/90 px-5 py-2 rounded-full text-[14px] text-gray-700 font-medium shadow-sm">Trust</span>
            </div>

            <h2 className="text-[48px] leading-tight font-normal mb-24 tracking-tight">
                Built for healthcare.<br />Designed for you.
            </h2>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {STATS.map((stat, idx) => (
                    <div key={idx} className="bg-white/30 backdrop-blur-xl rounded-[32px] p-10 border border-white/50 shadow-lg hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-16 h-16 mx-auto mb-6 bg-white/50 rounded-[20px] flex items-center justify-center shadow-inner">
                            <stat.icon size={28} className="text-gray-800" strokeWidth={2.5} />
                        </div>
                        <div className="text-[56px] leading-none font-medium mb-3 text-gray-900">{stat.value}</div>
                        <div className="text-[15px] font-medium text-gray-700">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const FaqSection = () => (
    <section className="w-full py-32 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-[1000px] mx-auto px-8 flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
                <div className="mb-6">
                    <span className="inline-block bg-white px-5 py-2 rounded-full text-[14px] text-gray-600 font-medium border border-gray-200/50">Questions?</span>
                </div>
                <h3 className="text-[36px] font-normal text-gray-900 mb-6 leading-tight tracking-tight">Got Questions?<br />We have answers.</h3>
                <p className="text-[15px] text-gray-500 mb-8 leading-relaxed">Find clear, simple answers about how CareSync can help run your clinic.</p>
                <button className="bg-black text-white text-[14px] px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
                    Talk to a Human
                </button>
            </div>

            <div className="md:w-2/3 space-y-4 pt-4">
                {FAQ_DATA.map((faq, idx) => (
                    <AccordionItem key={idx} q={faq.q} a={faq.a} />
                ))}
            </div>
        </div>
    </section>
);

export default function App() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100">
            <main>
                <HeroSection />
                <FeaturesSection />
                <StatsSection />
                <FaqSection />
            </main>
        </div>
    );
}