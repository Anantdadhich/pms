import { getInvoices } from "@/lib/actions/invoices"
import { BillingClient } from "./billing-client"

export const dynamic = "force-dynamic"

export default async function BillingPage() {
    const clinicId = "clinic_id_placeholder"
    const invoices = await getInvoices(clinicId)

    return <BillingClient initialInvoices={invoices} clinicId={clinicId} />
}
