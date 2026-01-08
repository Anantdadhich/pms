
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

type UserRole = 'SUPERADMIN' | 'ADMIN' | 'DOCTOR' | 'STAFF'

async function main() {
    const email = process.argv[2]
    const role = process.argv[3] as UserRole

    if (!email) {
        console.error('Please provide an email address')
        process.exit(1)
    }

    const validRoles: UserRole[] = ['SUPERADMIN', 'ADMIN', 'DOCTOR', 'STAFF']
    if (role && !validRoles.includes(role)) {
        console.error(`Invalid role. Must be one of: ${validRoles.join(', ')}`)
        process.exit(1)
    }

    const targetRole = role || 'ADMIN'

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            console.error(`User with email ${email} not found`)
            process.exit(1)
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { role: targetRole },
        })

        console.log(`Successfully updated user ${email} to role ${targetRole}`)
        console.log('New user details:', updatedUser)
    } catch (error) {
        console.error('Error updating user:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
