import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function getCurrentUser() {
    const { userId } = await auth()

    if (!userId) {
        return null
    }

    // Try to find local user
    let user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: { clinic: true },
    })

    // If no local user, create one with a clinic
    if (!user) {
        const clerkUser = await currentUser()
        if (!clerkUser) {
            return null
        }

        // Create a clinic for this user
        const clinic = await prisma.clinic.create({
            data: {
                name: `${clerkUser.firstName || 'My'}'s Clinic`,
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
            },
        })

        // Create the user
        user = await prisma.user.create({
            data: {
                clerkId: userId,
                email: clerkUser.emailAddresses[0]?.emailAddress || '',
                firstName: clerkUser.firstName || 'User',
                lastName: clerkUser.lastName || '',
                avatarUrl: clerkUser.imageUrl,
                clinicId: clinic.id,
            },
            include: { clinic: true },
        })
    }

    return user
}

export async function requireAuth() {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    return user
}

export async function requireClinic() {
    const user = await requireAuth()

    if (!user.clinicId) {
        throw new Error('No clinic associated with user')
    }

    return { user, clinicId: user.clinicId }
}
