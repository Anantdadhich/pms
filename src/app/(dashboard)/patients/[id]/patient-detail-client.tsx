"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    Phone,
    Mail,
    Calendar,
    MapPin,
    AlertCircle,
    FileText,
    Plus,
    Bell,
    Edit,
    Trash2
} from "lucide-react"
import { calculateAge, formatCurrency } from "@/lib/utils"
import { sendManualReminder, createAppointment, updateAppointment, updateAppointmentStatus, deleteAppointment } from "@/lib/actions/appointments"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { AppointmentForm } from "@/components/appointments/appointment-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TREATMENT_TYPES = [
    "General Consultation",
    "Dental Cleaning",
    "Root Canal Treatment",
    "Tooth Extraction",
    "Dental Filling",
    "Crown & Bridge",
    "Teeth Whitening",
    "Orthodontic Consultation",
    "Dental Implant",
    "Gum Treatment",
    "Wisdom Tooth Removal",
    "Dental X-Ray",
    "Emergency Treatment",
    "Follow-up Visit",
    "Other"
]

// Simple Odontogram placeholder
const TOOTH_NUMBERS = {
    upper: ["18", "17", "16", "15", "14", "13", "12", "11", "21", "22", "23", "24", "25", "26", "27", "28"],
    lower: ["48", "47", "46", "45", "44", "43", "42", "41", "31", "32", "33", "34", "35", "36", "37", "38"],
}

export function PatientDetailClient({ patient }: { patient: any }) {
    const router = useRouter()
    const [selectedTooth, setSelectedTooth] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isNewVisitOpen, setIsNewVisitOpen] = useState(false)

    // Edit appointment state
    const [editingAppointment, setEditingAppointment] = useState<any | null>(null)
    const [editForm, setEditForm] = useState({
        date: "",
        time: "",
        type: "",
        duration: 30,
        notes: "",
        status: "SCHEDULED" as any
    })

    const handleEditClick = (apt: any, e: React.MouseEvent) => {
        e.stopPropagation()
        const aptDate = new Date(apt.scheduledAt)
        setEditForm({
            date: format(aptDate, "yyyy-MM-dd"),
            time: format(aptDate, "HH:mm"),
            type: apt.type || "",
            duration: apt.duration || 30,
            notes: apt.notes || "",
            status: apt.status || "SCHEDULED"
        })
        setEditingAppointment(apt)
    }

    const handleSaveEdit = async () => {
        if (!editingAppointment) return
        setIsLoading(true)
        try {
            const [hours, mins] = editForm.time.split(":").map(Number)
            const newDate = new Date(editForm.date)
            newDate.setHours(hours, mins, 0, 0)

            await updateAppointment(editingAppointment.id, {
                scheduledAt: newDate,
                type: editForm.type,
                duration: editForm.duration,
                notes: editForm.notes
            })

            if (editForm.status !== editingAppointment.status) {
                await updateAppointmentStatus(editingAppointment.id, editForm.status)
            }

            setEditingAppointment(null)
            router.refresh()
        } catch (error) {
            console.error("Failed to update appointment", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAppointment = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm("Are you sure you want to delete this appointment? This cannot be undone.")) return
        
        setIsLoading(true)
        try {
            await deleteAppointment(id)
            router.refresh()
        } catch (error) {
            console.error("Failed to delete appointment", error)
            alert("Failed to delete appointment.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateAppointment = async (data: any) => {
        setIsLoading(true)
        try {
            await createAppointment(patient.clinicId, data)
            setIsNewVisitOpen(false)
            router.refresh()
        } catch (error) {
            console.error("Failed to create appointment", error)
            alert("Failed to create appointment.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSendReminder = async (appointmentId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm("Send SMS reminder to patient?")) return

        setIsLoading(true)
        try {
            await sendManualReminder(appointmentId)
            alert("Reminder sent successfully!")
        } catch (error) {
            console.error("Failed to send reminder", error)
            alert("Failed to send reminder.")
        } finally {
            setIsLoading(false)
        }
    }

    // Derived data from real patient object
    const visits = patient.appointments || []
    const invoices = patient.invoices || []

    // Aggregating treated teeth from all appointments
    const treatedTeeth = visits.flatMap((visit: any) =>
        visit.clinicalRecords?.filter((r: any) => r.toothNumber).map((r: any) => r.toothNumber) || []
    )

    // Calculate billing stats
    const totalBilled = invoices.reduce((sum: number, inv: any) => sum + Number(inv.total), 0)
    const totalPaid = invoices.reduce((sum: number, inv: any) => sum + Number(inv.amountPaid), 0)
    const outstanding = totalBilled - totalPaid

    return (
        <div className="flex flex-col h-full">
            <Header
                title={`${patient.firstName} ${patient.lastName}`}
                description={`Patient since ${format(new Date(patient.createdAt), "MMMM yyyy")}`}
            >
                <div className="flex gap-2">
                    <Button onClick={() => router.push(`/billing?patientId=${patient.id}`)} size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        New Invoice
                    </Button>
                </div>
            </Header>

            <div className="flex-1 overflow-auto p-6">
                <div className="mb-4">
                    <Button variant="ghost" onClick={() => router.push("/patients")} className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Patients
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Patient Info Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center mb-6">
                                <Avatar className="h-20 w-20 mb-4">
                                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                        {patient.firstName[0]}{patient.lastName[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-xl font-semibold">{patient.firstName} {patient.lastName}</h2>
                                <p className="text-muted-foreground">
                                    {patient.gender || "Unknown"}, {calculateAge(new Date(patient.dateOfBirth))} years old
                                </p>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{patient.phone}</span>
                                </div>
                                {patient.email && (
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{patient.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>DOB: {format(new Date(patient.dateOfBirth), "dd MMM yyyy")}</span>
                                </div>
                                {patient.address && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <span>{patient.address}</span>
                                    </div>
                                )}
                            </div>

                            {patient.allergies && patient.allergies.length > 0 && (
                                <>
                                    <Separator className="my-4" />
                                    <div>
                                        <div className="flex items-center gap-2 text-destructive mb-2">
                                            <AlertCircle className="h-4 w-4" />
                                            <span className="font-medium">Allergies</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {patient.allergies.map((allergy: string) => (
                                                <Badge key={allergy} variant="destructive">
                                                    {allergy}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {patient.notes && (
                                <>
                                    <Separator className="my-4" />
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">Notes</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{patient.notes}</p>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Main Content Tabs */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="overview">
                            <TabsList className="mb-4">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="billing">Billing</TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">Visit History</h3>
                                    <Button size="sm" className="gap-1" onClick={() => setIsNewVisitOpen(true)}>
                                        <Plus className="h-4 w-4" />
                                        New Visit
                                    </Button>
                                    <Dialog open={isNewVisitOpen} onOpenChange={setIsNewVisitOpen}>
                                        <DialogContent className="max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle>Schedule New Visit</DialogTitle>
                                            </DialogHeader>
                                            <AppointmentForm
                                                clinicId={patient.clinicId}
                                                patients={[{ id: patient.id, firstName: patient.firstName, lastName: patient.lastName }]}
                                                defaultValues={{ patientId: patient.id }}
                                                onSubmit={handleCreateAppointment}
                                                onCancel={() => setIsNewVisitOpen(false)}
                                                isLoading={isLoading}
                                            />
                                        </DialogContent>
                                    </Dialog>

                                    {/* Edit Appointment Dialog */}
                                    <Dialog open={!!editingAppointment} onOpenChange={(open) => !open && setEditingAppointment(null)}>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Edit Appointment</DialogTitle>
                                                <DialogDescription>
                                                    Modify the details for this scheduled visit.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-date">Date</Label>
                                                        <Input
                                                            id="edit-date"
                                                            type="date"
                                                            value={editForm.date}
                                                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-time">Time</Label>
                                                        <Input
                                                            id="edit-time"
                                                            type="time"
                                                            value={editForm.time}
                                                            onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-type">Treatment Type</Label>
                                                    <Select
                                                        value={editForm.type}
                                                        onValueChange={(value) => setEditForm({ ...editForm, type: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select treatment" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TREATMENT_TYPES.map((treatment) => (
                                                                <SelectItem key={treatment} value={treatment}>
                                                                    {treatment}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-duration">Duration (minutes)</Label>
                                                    <Input
                                                        id="edit-duration"
                                                        type="number"
                                                        value={editForm.duration}
                                                        onChange={(e) => setEditForm({ ...editForm, duration: parseInt(e.target.value) || 30 })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Status</Label>
                                                    <Select
                                                        value={editForm.status}
                                                        onValueChange={(value: any) => setEditForm({ ...editForm, status: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper" side="bottom">
                                                            <SelectItem value="SCHEDULED">🔵 Scheduled</SelectItem>
                                                            <SelectItem value="CONFIRMED">✅ Confirmed</SelectItem>
                                                            <SelectItem value="SEATED">🪑 Seated</SelectItem>
                                                            <SelectItem value="IN_PROGRESS">🏥 In Progress</SelectItem>
                                                            <SelectItem value="COMPLETED">✔️ Completed</SelectItem>
                                                            <SelectItem value="CANCELLED">❌ Cancelled</SelectItem>
                                                            <SelectItem value="NO_SHOW">⚠️ No Show</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-notes">Notes</Label>
                                                    <Input
                                                        id="edit-notes"
                                                        value={editForm.notes}
                                                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                                        placeholder="Add any notes..."
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setEditingAppointment(null)}>
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleSaveEdit} disabled={isLoading}>
                                                    {isLoading ? "Saving..." : "Save Changes"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {visits.length === 0 ? (
                                    <div className="text-center p-8 border rounded-lg bg-muted/10">
                                        <p className="text-muted-foreground">No visits recorded yet.</p>
                                    </div>
                                ) : (
                                    visits.map((visit: any) => (
                                        <Card key={visit.id}>
                                            <CardContent className="pt-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium">
                                                                {format(new Date(visit.scheduledAt), "dd MMM yyyy")}
                                                            </span>
                                                            <Badge variant={visit.status === "COMPLETED" ? "default" : "secondary"}>
                                                                {visit.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {visit.doctor ? `Dr. ${visit.doctor.firstName} ${visit.doctor.lastName}` : 'No Doctor'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
                                                            onClick={(e) => handleEditClick(visit, e)}
                                                            title="Edit Appointment"
                                                            disabled={isLoading}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-slate-400 hover:text-destructive"
                                                            onClick={(e) => handleDeleteAppointment(visit.id, e)}
                                                            title="Delete Appointment"
                                                            disabled={isLoading}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
                                                            onClick={(e) => handleSendReminder(visit.id, e)}
                                                            title="Send Reminder Now"
                                                            disabled={isLoading}
                                                        >
                                                            <Bell className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    {visit.chiefComplaint && <p><strong>Chief Complaint:</strong> {visit.chiefComplaint}</p>}
                                                    {visit.notes && <p><strong>Notes:</strong> {visit.notes}</p>}

                                                    {visit.clinicalRecords && visit.clinicalRecords.length > 0 && (
                                                        <>
                                                            <p className="mt-2 text-primary font-medium">Services & Treatments:</p>
                                                            <ul className="list-disc list-inside pl-2">
                                                                {visit.clinicalRecords.map((t: any, i: number) => (
                                                                    <li key={i}>
                                                                        {t.procedure?.name || "Treatment"} {t.toothNumber && `(Tooth ${t.toothNumber})`}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </>
                                                    )}

                                                    {visit.notifications && visit.notifications.length > 0 && (
                                                        <div className="mt-4 pt-3 border-t flex flex-wrap gap-2 items-center">
                                                            <span className="text-muted-foreground text-xs font-medium">Messages:</span>
                                                            {visit.notifications.map((notif: any) => (
                                                                <Badge key={notif.id} variant={notif.status === 'SENT' ? 'default' : notif.status === 'FAILED' ? 'destructive' : 'secondary'} className="text-[10px] uppercase">
                                                                    {notif.type}: {notif.status}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </TabsContent>

                            {/* Billing Tab */}
                            <TabsContent value="billing" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Balance Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <p className="text-2xl font-bold">{formatCurrency(totalBilled)}</p>
                                                <p className="text-sm text-muted-foreground">Total Billed</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-success">{formatCurrency(totalPaid)}</p>
                                                <p className="text-sm text-muted-foreground">Total Paid</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-warning">{formatCurrency(outstanding)}</p>
                                                <p className="text-sm text-muted-foreground">Outstanding</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <div className="rounded-lg border">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="px-4 py-3 text-left text-sm font-medium">Invoice</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                                                <th className="px-4 py-3 text-right text-sm font-medium">Total</th>
                                                <th className="px-4 py-3 text-right text-sm font-medium">Paid</th>
                                                <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {invoices.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="p-4 text-center text-muted-foreground text-sm">No invoices found</td>
                                                </tr>
                                            ) : (
                                                invoices.map((invoice: any) => (
                                                    <tr key={invoice.id} className="border-b hover:bg-muted/50">
                                                        <td className="px-4 py-3 font-mono text-sm">{invoice.invoiceNumber || invoice.id.slice(0, 8)}</td>
                                                        <td className="px-4 py-3 text-sm">{format(new Date(invoice.createdAt), "dd MMM yyyy")}</td>
                                                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(Number(invoice.total))}</td>
                                                        <td className="px-4 py-3 text-right">{formatCurrency(Number(invoice.amountPaid))}</td>
                                                        <td className="px-4 py-3 text-center">
                                                            <Badge variant={invoice.status === "PAID" ? "default" : "secondary"}>
                                                                {invoice.status}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
