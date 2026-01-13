"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateClinicSettings(clinicId: string, data: {
    name: string
    email?: string
    phone?: string
    address?: string
    timezone: string
    currency: string
    defaultAppointmentDuration: number
    invoicePrefix?: string
}) {
    // Update clinic basic info
    await prisma.clinic.update({
        where: { id: clinicId },
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
        }
    })

    // Try to upsert clinic settings, but don't fail if table doesn't exist
    try {
        await prisma.clinicSettings.upsert({
            where: { clinicId },
            create: {
                clinicId,
                timezone: data.timezone,
                currency: data.currency,
                defaultAppointmentDuration: data.defaultAppointmentDuration,
                invoicePrefix: data.invoicePrefix || "INV",
            },
            update: {
                timezone: data.timezone,
                currency: data.currency,
                defaultAppointmentDuration: data.defaultAppointmentDuration,
                invoicePrefix: data.invoicePrefix || "INV",
            }
        })
    } catch (error) {
        console.log("ClinicSettings table not yet created, skipping settings update")
    }

    revalidatePath("/settings")
    revalidatePath("/")

    return { success: true }
}
