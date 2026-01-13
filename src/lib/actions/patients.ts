"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import type { PatientFormValues } from "@/lib/validations/patient"

// Serialization Helpers
const serializeDecimal = (val: any) => (val !== null && val !== undefined ? Number(val) : null)

const serializeInvoice = (invoice: any) => ({
    ...invoice,
    subtotal: serializeDecimal(invoice.subtotal) || 0,
    discount: serializeDecimal(invoice.discount) || 0,
    tax: serializeDecimal(invoice.tax) || 0,
    total: serializeDecimal(invoice.total) || 0,
    amountPaid: serializeDecimal(invoice.amountPaid) || 0,
})

const serializeProcedure = (proc: any) => ({
    ...proc,
    standardCost: serializeDecimal(proc.standardCost) || 0,
})

const serializeClinicalRecord = (rec: any) => ({
    ...rec,
    costOverride: serializeDecimal(rec.costOverride),
    procedure: rec.procedure ? serializeProcedure(rec.procedure) : undefined,
})

const serializeAppointment = (apt: any) => ({
    ...apt,
    clinicalRecords: apt.clinicalRecords?.map(serializeClinicalRecord),
})

const serializePatient = (patient: any) => {
    if (!patient) return null
    return {
        ...patient,
        appointments: patient.appointments?.map(serializeAppointment),
        invoices: patient.invoices?.map(serializeInvoice),
    }
}

export async function getPatients(clinicId: string, query?: string) {
    // Build search conditions
    const whereConditions: any = { clinicId }

    if (query) {
        // Split query into words for better name matching
        const queryWords = query.trim().split(/\s+/)

        if (queryWords.length === 1) {
            // Single word: search firstName, lastName, or phone
            whereConditions.OR = [
                { firstName: { contains: query, mode: "insensitive" } },
                { lastName: { contains: query, mode: "insensitive" } },
                { phone: { contains: query } },
            ]
        } else if (queryWords.length === 2) {
            // Two words: likely "FirstName LastName"
            whereConditions.OR = [
                // Match "First Last"
                {
                    AND: [
                        { firstName: { contains: queryWords[0], mode: "insensitive" } },
                        { lastName: { contains: queryWords[1], mode: "insensitive" } },
                    ]
                },
                // Match "Last First" (reversed)
                {
                    AND: [
                        { firstName: { contains: queryWords[1], mode: "insensitive" } },
                        { lastName: { contains: queryWords[0], mode: "insensitive" } },
                    ]
                },
                // Also search each word individually
                { firstName: { contains: query, mode: "insensitive" } },
                { lastName: { contains: query, mode: "insensitive" } },
                { phone: { contains: query } },
            ]
        } else {
            // More than 2 words: search the full query in each field
            whereConditions.OR = [
                { firstName: { contains: query, mode: "insensitive" } },
                { lastName: { contains: query, mode: "insensitive" } },
                { phone: { contains: query } },
            ]
        }
    }

    const patients = await prisma.patient.findMany({
        where: whereConditions,
        orderBy: { createdAt: "desc" },
        take: 50,
    })
    return patients
}

export async function getPatientById(id: string) {
    const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
            appointments: {
                orderBy: { scheduledAt: "desc" },
                take: 10,
                include: {
                    doctor: true,
                    clinicalRecords: {
                        include: {
                            procedure: true,
                        },
                    },
                },
            },
            invoices: {
                orderBy: { createdAt: "desc" },
                take: 5,
            },
        },
    })
    return serializePatient(patient)
}

export async function createPatient(clinicId: string, data: PatientFormValues) {
    const patient = await prisma.patient.create({
        data: {
            ...data,
            dateOfBirth: new Date(data.dateOfBirth),
            clinicId,
            email: data.email || null,
        },
    })

    revalidatePath("/patients")
    revalidatePath("/") // Dashboard
    return patient
}

export async function updatePatient(id: string, data: Partial<PatientFormValues>) {
    const patient = await prisma.patient.update({
        where: { id },
        data: {
            ...data,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
            email: data.email || null,
        },
    })

    revalidatePath("/patients")
    revalidatePath(`/patients/${id}`)
    revalidatePath("/") // Dashboard
    return patient
}

export async function deletePatient(id: string) {
    await prisma.patient.delete({
        where: { id },
    })

    revalidatePath("/patients")
    revalidatePath("/") // Dashboard
}

export async function updateLastVisitDate(patientId: string) {
    await prisma.patient.update({
        where: { id: patientId },
        data: { lastVisitDate: new Date() },
    })
}

/**
 * Import patients from CSV data
 * Handles bulk creation with duplicate detection based on phone number
 */
export async function importPatients(clinicId: string, patients: any[]) {
    const user = await getCurrentUser()
    if (!user) {
        throw new Error("Unauthorized")
    }

    try {
        // Validate and map data
        const validPatients = patients.map(p => {
            if (!p.firstName || !p.lastName || !p.phone) {
                return null
            }

            let dob = new Date()
            if (p.dateOfBirth) {
                dob = new Date(p.dateOfBirth)
                if (isNaN(dob.getTime())) dob = new Date()
            }

            // Normalize phone number (remove spaces, dashes, etc.)
            const normalizedPhone = String(p.phone).replace(/[\s\-\(\)]/g, '')

            return {
                firstName: String(p.firstName).trim(),
                lastName: String(p.lastName).trim(),
                phone: normalizedPhone,
                email: p.email ? String(p.email).trim() : null,
                dateOfBirth: dob,
                gender: p.gender ? String(p.gender) : null,
                address: p.address ? String(p.address) : null,
                clinicId: clinicId,
            }
        }).filter(Boolean) as any[]

        if (validPatients.length === 0) {
            return { success: false, count: 0, skipped: 0, error: "No valid records found" }
        }

        // Get all phone numbers from the import
        const importPhones = validPatients.map(p => p.phone)

        // Check for existing patients with same phone numbers in this clinic
        const existingPatients = await prisma.patient.findMany({
            where: {
                clinicId,
                phone: { in: importPhones }
            },
            select: { phone: true }
        })

        const existingPhones = new Set(existingPatients.map(p => p.phone))

        // Filter out duplicates
        const newPatients = validPatients.filter(p => !existingPhones.has(p.phone))
        const skippedCount = validPatients.length - newPatients.length

        if (newPatients.length === 0) {
            return {
                success: true,
                count: 0,
                skipped: skippedCount,
                error: `All ${skippedCount} patients already exist in the system (matched by phone number).`
            }
        }

        const result = await prisma.patient.createMany({
            data: newPatients,
            skipDuplicates: true
        })

        revalidatePath("/patients")
        revalidatePath("/")

        return {
            success: true,
            count: result.count,
            skipped: skippedCount
        }
    } catch (error) {
        console.error("Import failed:", error)
        return { success: false, count: 0, skipped: 0, error: "Database error during import" }
    }
}

export async function exportPatients(clinicId: string, startDate?: Date, endDate?: Date) {
    const where: any = { clinicId }

    if (startDate && endDate) {
        // Adjust endDate to end of day
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)

        where.createdAt = {
            gte: startDate,
            lte: end
        }
    }

    const patients = await prisma.patient.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            dateOfBirth: true,
            gender: true,
            lastVisitDate: true,
            createdAt: true
        }
    })

    return patients
}
