import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Client } from "@upstash/qstash"
import type { Patient, Appointment, Clinic } from "../../../../generated/prisma/client"


const qstashClient = new Client({
    token: process.env.QSTASH_TOKEN || ""
})

export async function GET(req: Request) {

    const authHeader = req.headers.get("authorization")
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!process.env.QSTASH_TOKEN) {
        return NextResponse.json({ error: "QSTASH_TOKEN not configured" }, { status: 500 })
    }

    try {

        const ruleDays = 15;
        const targetDateEnd = new Date()
        targetDateEnd.setDate(targetDateEnd.getDate() - ruleDays)

        const targetDateStart = new Date(targetDateEnd)
        targetDateStart.setDate(targetDateStart.getDate() - 1)

        const BATCH_SIZE = 500;
        let processedCount = 0;
        let hasMore = true;
        let lastId: string | undefined = undefined;


        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

        while (hasMore) {

            const fetchedPatients: (Patient & { clinic: Clinic, appointments: Appointment[] })[] = await prisma.patient.findMany({
                take: BATCH_SIZE,
                skip: lastId ? 1 : 0,
                ...(lastId && { cursor: { id: lastId } }),
                where: {
                    lastVisitDate: {
                        gte: targetDateStart,
                        lte: targetDateEnd
                    },
                    phone: { not: "" },
                },
                include: {
                    clinic: true,
                    appointments: {
                        where: {
                            scheduledAt: { gt: new Date() },
                            status: { notIn: ["CANCELLED", "NO_SHOW"] }
                        }
                    }
                },
                orderBy: { id: 'asc' }
            }) as any;

            if (fetchedPatients.length === 0) {
                hasMore = false;
                break;
            }

            lastId = fetchedPatients[fetchedPatients.length - 1].id


            for (const patient of fetchedPatients) {

                if (patient.appointments.length > 0) continue;

                const clinicName = patient.clinic?.name || "our clinic";
                const message = `Hi ${patient.firstName}, it's been a while since your last visit to ${clinicName}. If you need to schedule a checkup, please contact us!`


                const job = await prisma.smsJob.create({
                    data: {
                        type: "DROPOFF",
                        status: "SCHEDULED",
                        scheduledFor: new Date(),
                        patientId: patient.id,
                        qstashId: `pending_${patient.id}_${Date.now()}`
                    }
                })


                const res = await qstashClient.publishJSON({
                    url: `${baseUrl}/api/webhooks/send-sms`,
                    body: {
                        jobId: job.id,
                        phone: patient.phone,
                        message,
                        clinicId: patient.clinicId,
                        patientId: patient.id
                    }
                }).catch(console.error)


                if (res && res.messageId) {
                    await prisma.smsJob.update({
                        where: { id: job.id },
                        data: { qstashId: res.messageId }
                    })
                    processedCount++
                } else {
                    await prisma.smsJob.update({
                        where: { id: job.id },
                        data: { status: "FAILED" }
                    })
                }
            }

            if (fetchedPatients.length < BATCH_SIZE) {
                hasMore = false
            }
        }

        return NextResponse.json({
            success: true,
            dropoffsDetected: processedCount,
        })

    } catch (error) {
        console.error("Drop-off Cron Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
