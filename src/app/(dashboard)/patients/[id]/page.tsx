import { getPatientById } from "@/lib/actions/patients"
import { notFound } from "next/navigation"
import { PatientDetailClient } from "./patient-detail-client"

// Force dynamic rendering since we are fetching data
export const dynamic = "force-dynamic"

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const patient = await getPatientById(id)

    if (!patient) {
        notFound()
    }

    return <PatientDetailClient patient={patient} />
}
