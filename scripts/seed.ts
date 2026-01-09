import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function seed() {
    console.log("Seeding database...");

    // Create default clinic if it doesn't exist
    let clinic = await prisma.clinic.findFirst();

    if (!clinic) {
        clinic = await prisma.clinic.create({
            data: {
                name: "Main Clinic",
                email: "clinic@example.com",
                phone: "+91 98765 43210",
                address: "123 Medical Street, Healthcare City",
            },
        });
        console.log("✅ Created default clinic:", clinic.id);
    } else {
        console.log("✅ Clinic already exists:", clinic.id);
    }

    // Show users count
    const userCount = await prisma.user.count();
    console.log("📊 Users in database:", userCount);

    // Show patients count
    const patientCount = await prisma.patient.count();
    console.log("📊 Patients in database:", patientCount);

    console.log("\n📝 Use this clinic ID in your code:", clinic.id);

    await prisma.$disconnect();
}

seed().catch(console.error);
