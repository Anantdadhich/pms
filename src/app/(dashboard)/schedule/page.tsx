import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ScheduleClient } from "./schedule-client"

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

    return <ScheduleClient clinicId={user.clinicId} />
}
