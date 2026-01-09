
"use client"

import { format } from "date-fns"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, ArrowLeft, Printer } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatCurrency } from "@/lib/utils"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { InvoicePDF } from "@/components/billing/invoice-pdf"

interface InvoiceDetailClientProps {
    invoice: any
    clinicId: string
}

export function InvoiceDetailClient({ invoice, clinicId }: InvoiceDetailClientProps) {
    const router = useRouter()

    const pdfInvoiceData = {
        ...invoice,
        number: invoice.invoiceNumber,
        date: invoice.createdAt,
        patientName: invoice.patient ? `${invoice.patient.firstName} ${invoice.patient.lastName}` : "Unknown",
        items: invoice.items || [],
        patient: invoice.patient || { firstName: "", lastName: "", email: "", phone: "" }
    }

    const safeFormat = (date: any, formatStr: string) => {
        try {
            if (!date) return "-"
            const d = new Date(date)
            // Check if valid date
            if (isNaN(d.getTime())) return "-"
            return format(d, formatStr)
        } catch (e) {
            return "-"
        }
    }

    return (
        <div className="flex flex-col h-full space-y-6">
            <Header
                title={`Invoice ${invoice.invoiceNumber}`}
                description={`Created on ${safeFormat(invoice.createdAt, "PPP")}`}
                action={{
                    label: "Back to Billing",
                    onClick: () => router.back(),
                    variant: "outline"
                }}
            />

            <div className="flex-1 overflow-auto p-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <Badge variant={invoice.status.toLowerCase()}>{invoice.status}</Badge>
                    </div>
                    <div className="flex gap-2">
                        <PDFDownloadLink
                            document={<InvoicePDF invoice={pdfInvoiceData} />}
                            fileName={`${invoice.invoiceNumber}.pdf`}
                        >
                            {/* @ts-ignore */}
                            {({ loading }) => (
                                <Button variant="outline" disabled={loading}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download PDF
                                </Button>
                            )}
                        </PDFDownloadLink>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Patient Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Billed To</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <p className="font-medium">{invoice.patient.firstName} {invoice.patient.lastName}</p>
                                <p className="text-sm text-muted-foreground">{invoice.patient.address || "No address"}</p>
                                <p className="text-sm text-muted-foreground">{invoice.patient.phone}</p>
                                <p className="text-sm text-muted-foreground">{invoice.patient.email}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Invoice Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Invoice Number</p>
                                <p className="font-medium">{invoice.invoiceNumber}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Date Issued</p>
                                <p className="font-medium">{safeFormat(invoice.createdAt, "dd MMM yyyy")}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Due Date</p>
                                <p className="font-medium">{safeFormat(invoice.dueDate, "dd MMM yyyy")}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Items Table */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Line Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full">
                            <thead>
                                <tr className="border-b text-sm text-muted-foreground">
                                    <th className="py-2 text-left">Description</th>
                                    <th className="py-2 text-right">Qty</th>
                                    <th className="py-2 text-right">Unit Price</th>
                                    <th className="py-2 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {invoice.items.map((item: any) => (
                                    <tr key={item.id}>
                                        <td className="py-3 text-sm">{item.description}</td>
                                        <td className="py-3 text-sm text-right">{item.quantity}</td>
                                        <td className="py-3 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                                        <td className="py-3 text-sm text-right font-medium">{formatCurrency(item.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Separator className="my-4" />

                        <div className="flex flex-col items-end space-y-2 text-sm">
                            <div className="flex justify-between w-48">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(invoice.subtotal)}</span>
                            </div>
                            {invoice.discount > 0 && (
                                <div className="flex justify-between w-48 text-success">
                                    <span>Discount</span>
                                    <span>-{formatCurrency(invoice.discount)}</span>
                                </div>
                            )}
                            {invoice.tax > 0 && (
                                <div className="flex justify-between w-48">
                                    <span>Tax</span>
                                    <span>+{formatCurrency(invoice.tax)}</span>
                                </div>
                            )}
                            <div className="flex justify-between w-48 font-bold text-lg pt-2 border-t">
                                <span>Total</span>
                                <span>{formatCurrency(invoice.total)}</span>
                            </div>
                            <div className="flex justify-between w-48 text-muted-foreground mt-2">
                                <span>Amount Paid</span>
                                <span>{formatCurrency(invoice.amountPaid)}</span>
                            </div>
                            <div className="flex justify-between w-48 font-medium text-warning">
                                <span>Balance</span>
                                <span>{formatCurrency(invoice.total - invoice.amountPaid)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payments */}
                {invoice.payments && invoice.payments.length > 0 && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Payment History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b text-sm text-muted-foreground">
                                        <th className="py-2 text-left">Date</th>
                                        <th className="py-2 text-left">Method</th>
                                        <th className="py-2 text-left">Reference</th>
                                        <th className="py-2 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {invoice.payments.map((payment: any) => (
                                        <tr key={payment.id}>
                                            <td className="py-3 text-sm">{safeFormat(payment.createdAt, "dd MMM yyyy")}</td>
                                            <td className="py-3 text-sm capitalize">{payment.method.toLowerCase().replace("_", " ")}</td>
                                            <td className="py-3 text-sm text-muted-foreground">{payment.reference || "-"}</td>
                                            <td className="py-3 text-sm text-right font-medium">{formatCurrency(payment.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
