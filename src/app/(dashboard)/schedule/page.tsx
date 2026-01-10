import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ScheduleClient } from "./schedule-client"
import { getAppointments } from "@/lib/actions/appointments"

export const dynamic = "force-dynamic"

export default async function SchedulePage() {
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

    // Fetch all appointments server-side
    const appointments = await getAppointments(user.clinicId)

    return <ScheduleClient clinicId={user.clinicId} initialAppointments={appointments} />
}
