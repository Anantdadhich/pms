import { getPatients } from "@/lib/actions/patients"
import { PatientsClient } from "./patients-client"

export const dynamic = "force-dynamic"

export default async function PatientsPage() {
    const clinicId = "clinic_id_placeholder"

    // getPatients(clinicId: string, query?: string)
    const patients = await getPatients(clinicId)

    return <PatientsClient initialPatients={patients} clinicId={clinicId} />
}
