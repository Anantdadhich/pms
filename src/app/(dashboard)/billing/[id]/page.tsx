
import { getInvoiceById } from "@/lib/actions/invoices"
import { getCurrentUser } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { InvoiceDetailClient } from "./invoice-detail-client"

export const dynamic = "force-dynamic"

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser()
    const { id } = await params

    if (!user) {
        redirect("/sign-in")
    }

    if (!user.clinicId) {
        return <div>No clinic associated</div>
    }

    const invoice = await getInvoiceById(id)

    if (!invoice || invoice.clinicId !== user.clinicId) {
        return notFound()
    }

    return <InvoiceDetailClient invoice={invoice} clinicId={user.clinicId} />
}
