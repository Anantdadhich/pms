import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

async function checkAppointments() {
    console.log('=== CHECKING APPOINTMENTS ===\n')

    try {
        // Get all appointments
        const appointments = await prisma.appointment.findMany({
            include: {
                patient: true,
                doctor: true,
            },
            orderBy: { scheduledAt: 'asc' }
        })

        console.log(`Total appointments in database: ${appointments.length}\n`)

        if (appointments.length === 0) {
            console.log('❌ NO APPOINTMENTS FOUND IN DATABASE')
            console.log('This explains why nothing shows on the schedule!')
            return
        }

        appointments.forEach((apt, index) => {
            console.log(`Appointment ${index + 1}:`)
            console.log(`  ID: ${apt.id}`)
            console.log(`  Patient: ${apt.patient.firstName} ${apt.patient.lastName}`)
            console.log(`  Doctor: ${apt.doctor.firstName} ${apt.doctor.lastName}`)
            console.log(`  Scheduled At: ${apt.scheduledAt.toISOString()}`)
            console.log(`  Local Time: ${apt.scheduledAt.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`)
            console.log(`  Time Only: ${apt.scheduledAt.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}`)
            console.log(`  Status: ${apt.status}`)
            console.log(`  Type: ${apt.type}`)
            console.log(`  Duration: ${apt.duration} minutes`)
            console.log(`  Clinic ID: ${apt.clinicId}`)
            console.log('')
        })

        console.log('✅ Appointments exist in database')
        console.log('If they don\'t show on schedule, the issue is in the frontend rendering logic')

    } catch (error) {
        console.error('❌ Error checking appointments:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkAppointments()
