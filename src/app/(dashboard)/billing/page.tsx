import { getInvoices } from "@/lib/actions/invoices"
import { BillingClient } from "./billing-client"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function BillingPage() {
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
    const invoices = await getInvoices(clinicId)

    return <BillingClient initialInvoices={invoices} clinicId={clinicId} />
}
