import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PatientIntakeClient } from "./patient-intake-client"

export const dynamic = "force-dynamic"

export default async function PatientIntakeSettingsPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/sign-in")
    }

    if (!user.clinicId) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center rounded-[20px] border border-white/60 bg-white/70 px-6 py-14 text-center text-[15px] text-gray-600 shadow-[0_4px_24px_rgba(0,0,0,0.02)] backdrop-blur-2xl">
                <p>No clinic is linked to your account yet. Contact support to finish setup.</p>
            </div>
        )
    }

    return <PatientIntakeClient clinicId={user.clinicId} />
}
