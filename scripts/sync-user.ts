import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function syncUser() {
    // You need to provide your Clerk user ID here
    // You can find it in the Clerk dashboard under Users
    const clerkUserId = process.argv[2];
    const userEmail = process.argv[3];
    const firstName = process.argv[4] || "User";
    const lastName = process.argv[5] || "";

    if (!clerkUserId || !userEmail) {
        console.log("Usage: npx tsx scripts/sync-user.ts <clerkUserId> <email> [firstName] [lastName]");
        console.log("Example: npx tsx scripts/sync-user.ts user_2abc123 john@example.com John Doe");
        process.exit(1);
    }

    console.log("Syncing user to database...");

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { clerkId: clerkUserId },
    });

    if (existingUser) {
        console.log("✅ User already exists:", existingUser.email);
        console.log("   Clinic ID:", existingUser.clinicId);
        await prisma.$disconnect();
        return;
    }

    // Create or find a clinic for this user
    let clinic = await prisma.clinic.findFirst();

    if (!clinic) {
        clinic = await prisma.clinic.create({
            data: {
                name: `${firstName}'s Clinic`,
                email: userEmail,
            },
        });
        console.log("✅ Created new clinic:", clinic.id);
    } else {
        console.log("✅ Using existing clinic:", clinic.id);
    }

    // Create the user
    const user = await prisma.user.create({
        data: {
            clerkId: clerkUserId,
            email: userEmail,
            firstName: firstName,
            lastName: lastName,
            role: "ADMIN",
            clinicId: clinic.id,
        },
    });

    console.log("✅ Created user:", user.email);
    console.log("   User ID:", user.id);
    console.log("   Clinic ID:", user.clinicId);

    await prisma.$disconnect();
}

syncUser().catch(console.error);
