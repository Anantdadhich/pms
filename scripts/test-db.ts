
import { Pool, neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '../src/generated/prisma/client'
import ws from 'ws'
import dotenv from 'dotenv'

dotenv.config()

neonConfig.webSocketConstructor = ws

async function testConnection() {
    console.log("Testing Prisma Client + Neon Adapter...")
    const url = process.env.DATABASE_URL

    if (!url) {
        console.error("❌ DATABASE_URL is missing")
        return
    }

    try {
        const pool = new Pool({ connectionString: url })
        const adapter = new PrismaNeon(pool as any)
        const prisma = new PrismaClient({ adapter })

        console.log("✅ Prisma Client initialized. Connecting...")
        await prisma.$connect()
        console.log("✅ Prisma connected successfully.")

        try {
            const count = await prisma.user.count()
            console.log("✅ User count query success:", count)
        } catch (e) {
            console.log("⚠️ Could not count users (maybe table missing?), but connection worked.")
        }

        await prisma.$disconnect()
        await pool.end()
    } catch (error) {
        console.error("❌ Prisma Connection failed:", error)
        console.error(error)
    }
}

testConnection()
