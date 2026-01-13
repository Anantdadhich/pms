import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SettingsClient } from "./settings-client"
import prisma from "@/lib/prisma"

export default async function SettingsPage() {
    const user = await getCurrentUser()

    if (!user || !user.clinicId) {
        redirect("/sign-in")
    }

    // Get clinic data (settings table might not exist yet)
    const clinic = await prisma.clinic.findUnique({
        where: { id: user.clinicId }
    })

    if (!clinic) {
        throw new Error("Clinic not found")
    }

    // Try to get settings, but don't fail if table doesn't exist
    let settings = null
    try {
        settings = await prisma.clinicSettings.findUnique({
            where: { clinicId: user.clinicId }
        })
    } catch (error) {
        console.log("ClinicSettings table not yet created")
    }

    const initialSettings = {
        name: clinic.name,
        email: clinic.email || "",
        phone: clinic.phone || "",
        address: clinic.address || "",
        timezone: settings?.timezone || "Asia/Kolkata",
        currency: settings?.currency || "INR",
        defaultAppointmentDuration: settings?.defaultAppointmentDuration || 30,
        invoicePrefix: settings?.invoicePrefix || "INV",
    }

    return <SettingsClient clinicId={user.clinicId} initialSettings={initialSettings} />
}
