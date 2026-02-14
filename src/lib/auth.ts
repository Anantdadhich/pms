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
    // Wrapped in try/catch to handle race conditions on first login
    if (!user) {
        const clerkUser = await currentUser()
        if (!clerkUser) {
            return null
        }

        try {
            // Use a transaction to create clinic + user atomically
            user = await prisma.$transaction(async (tx) => {
                const clinic = await tx.clinic.create({
                    data: {
                        name: `${clerkUser.firstName || 'My'}'s Clinic`,
                        email: clerkUser.emailAddresses[0]?.emailAddress || '',
                    },
                })

                return await tx.user.create({
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
            })
        } catch (error: any) {
            // Handle race condition: another request already created this user
            if (error?.code === 'P2002') {
                // Unique constraint violation — user was created by a parallel request
                user = await prisma.user.findUnique({
                    where: { clerkId: userId },
                    include: { clinic: true },
                })
            } else {
                throw error
            }
        }
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
