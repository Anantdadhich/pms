import { getAllTreatments } from "@/lib/actions/treatments"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { TreatmentsClient } from "./treatments-client"

export const dynamic = "force-dynamic"

export default async function TreatmentsPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect("/sign-in")
    }

    if (!user.clinicId) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center rounded-[20px] border border-white/60 bg-white/70 px-6 py-16 text-center text-[15px] text-gray-600 shadow-[0_4px_24px_rgba(0,0,0,0.02)] backdrop-blur-2xl">
                <p>No clinic is associated with your account. Contact support to finish setup.</p>
            </div>
        )
    }

    // Pass casted type if needed, but getTreatments returns array compatible with Treatment interface mostly
    const treatments = await getAllTreatments(user.clinicId)

    return <TreatmentsClient initialTreatments={treatments as any} clinicId={user.clinicId} />
}
