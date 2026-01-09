import { getPatients } from "@/lib/actions/patients"
import { PatientsClient } from "./patients-client"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function PatientsPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/sign-in")
    }

    if (!user.clinicId) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>No clinic associated with your account.</p>
            </div>
        )
    }

    const clinicId = user.clinicId
    const patients = await getPatients(clinicId)

    return <PatientsClient initialPatients={patients} clinicId={clinicId} />
}
