import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

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
            return
        }

        appointments.forEach((apt: any, index: number) => {
            console.log(`Appointment ${index + 1}:`)
            console.log(`  ID: ${apt.id}`)
            console.log(`  Patient: ${apt.patient.firstName} ${apt.patient.lastName}`)
            console.log(`  Doctor: ${apt.doctor.firstName} ${apt.doctor.lastName}`)
            console.log(`  Scheduled At: ${apt.scheduledAt.toISOString()}`)
            console.log(`  Status: ${apt.status}`)
            console.log(`  Type: ${apt.type}`)
            console.log(`  Duration: ${apt.duration} minutes`)
            console.log('')
        })

        console.log('✅ Appointments exist in database')

    } catch (error) {
        console.error('❌ Error checking appointments:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkAppointments()
