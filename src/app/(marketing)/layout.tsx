"use client";

import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { Stethoscope, Menu, X, Twitter, Linkedin, Github, ShieldCheck } from "lucide-react";

const NAV_LINKS = [
    { label: "What we offer", id: "features" },
    { label: "How it helps", id: "capabilities" },
    { label: "Questions", id: "faq" },
] as const


const BrandLogo = () => (
    <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
            <Stethoscope size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-[18px] tracking-tight text-gray-900">CareSync</span>
    </Link>
);

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900">
            {/* Header - Sticky with glassmorphism */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
                <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-4 flex items-center justify-between">

                    <BrandLogo />

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.id}
                                href={`#${link.id}`}
                                className="text-[14px] font-medium text-gray-600 transition-colors hover:text-gray-900"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Auth Buttons (Clerk Integration) */}
                    <div className="hidden md:flex items-center gap-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <button className="text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors">
                                    Log in
                                </button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <button className="bg-black text-white text-[14px] font-medium px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors shadow-sm">
                                    Start Free Trial
                                </button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <Link href="/dashboard" className="bg-blue-50 text-blue-600 text-[14px] font-medium px-5 py-2.5 rounded-xl hover:bg-blue-100 transition-colors shadow-sm">
                                Open Dashboard
                            </Link>
                        </SignedIn>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-2">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.id}
                                href={`#${link.id}`}
                                className="border-b border-gray-50 py-2 text-[15px] font-medium text-gray-600"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-3 mt-2">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="w-full text-center text-[15px] font-medium text-gray-700 py-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                        Log in
                                    </button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="w-full text-center bg-black text-white text-[15px] font-medium py-2.5 rounded-xl hover:bg-gray-800 transition-colors">
                                        Start Free Trial
                                    </button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <Link href="/dashboard" className="w-full text-center bg-blue-50 text-blue-600 text-[15px] font-medium py-2.5 rounded-xl hover:bg-blue-100 transition-colors">
                                    Open Dashboard
                                </Link>
                            </SignedIn>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer - Comprehensive SaaS Layout */}
            <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8 mt-20">
                <div className="max-w-[1400px] mx-auto px-6 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">

                        {/* Brand Column */}
                        <div className="lg:col-span-2 flex flex-col items-start gap-6">
                            <BrandLogo />
                            <p className="text-[14px] text-gray-500 leading-relaxed max-w-sm">
                                The modern practice management system built to streamline scheduling, automate reminders, and elevate the patient experience for forward-thinking clinics.
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                                <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:border-blue-500 transition-colors">
                                    <Twitter size={16} />
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-700 hover:border-blue-700 transition-colors">
                                    <Linkedin size={16} />
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-900 transition-colors">
                                    <Github size={16} />
                                </a>
                            </div>
                        </div>

                        {/* Product Links */}
                        <div className="flex flex-col gap-4">
                            <span className="font-semibold text-gray-900 text-[13px] uppercase tracking-wider">Product</span>
                            <Link href="#" className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors">Features</Link>
                            <Link href="#" className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors">Integrations</Link>
                            <Link href="#" className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
                            <Link href="#" className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors">Changelog</Link>
                        </div>

                        {/* Company Links */}
                        <div className="flex flex-col gap-4">
                            <span className="font-semibold text-gray-900 text-[13px] uppercase tracking-wider">Company</span>
                            <Link href="#" className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors">About Us</Link>
                            <Link href="#" className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors">Careers</Link>
                            <Link href="#" className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors">Blog</Link>
                            <Link href="#" className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors">Contact</Link>
                        </div>

                        {/* Legal & Trust Links */}
                        <div className="flex flex-col gap-4">
                            <span className="font-semibold text-gray-900 text-[13px] uppercase tracking-wider">Legal</span>
                            <Link href="#" className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link>
                            <Link href="#" className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</Link>
                            <div className="mt-2 flex items-center gap-2 text-[13px] font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full inline-flex w-max">
                                <ShieldCheck size={14} />
                                HIPAA Compliant
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                        <span className="text-[13px] text-gray-400">
                            © {new Date().getFullYear()} CareSync PMS. All rights reserved.
                        </span>
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-2 text-[13px] text-gray-400">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                All systems operational
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}