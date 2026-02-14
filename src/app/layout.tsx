import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/providers/query-provider"
import { PatientProvider } from "@/providers/patient-context"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "DentalPMS | Smart Practice Management for Modern Clinics",
    template: "%s | DentalPMS",
  },
  description: "Streamline your dental clinic with our all-in-one Practice Management System. Manage patient records, appointments, billing, and treatment plans efficiently.",
  keywords: [
    "Dental PMS",
    "Dental Practice Management",
    "Clinic Software",
    "Dentist Patient Management",
    "Dental Scheduling Software",
    "Electronic Health Records",
    "Dentistry Automation",
  ],
  authors: [{ name: "DentalPMS Team" }],
  creator: "DentalPMS",
  applicationName: "DentalPMS",

  icons: {
    icon: "/pmslogo.png",
    shortcut: "/pmslogo.png",
    apple: "/pmslogo.png",
  },

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <QueryProvider>
            <PatientProvider>
              {children}
            </PatientProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}