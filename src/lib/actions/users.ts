"use server"

import prisma from "@/lib/prisma"
type UserRole = 'SUPERADMIN' | 'ADMIN' | 'DOCTOR' | 'STAFF'

export async function getDoctors(clinicId: string) {
    const doctors = await prisma.user.findMany({
        where: {
            clinicId,
            role: 'DOCTOR',
            isActive: true,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
        },
        orderBy: { firstName: 'asc' },
    })

    return doctors
}

export async function getUsers(clinicId: string, role?: UserRole) {
    const users = await prisma.user.findMany({
        where: {
            clinicId,
            ...(role && { role }),
            isActive: true,
        },
        orderBy: { firstName: 'asc' },
    })

    return users
}
