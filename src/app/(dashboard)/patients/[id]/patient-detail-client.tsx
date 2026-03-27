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
                    <Card className="bg-white/60 backdrop-blur-2xl border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-[24px] overflow-hidden">
                        <CardContent className="pt-8 px-6 pb-6">
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-inner font-bold text-[32px] mb-5">
                                    {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight leading-tight mb-1">
                                    {patient.firstName} {patient.lastName}
                                </h2>
                                <p className="text-[14px] font-medium text-gray-400">
                                    {patient.gender || "Unknown"}, {calculateAge(new Date(patient.dateOfBirth))} years old
                                </p>
                            </div>

                            <div className="bg-white/50 rounded-[16px] border border-gray-100 p-5 space-y-4 mb-6">
                                <div className="flex items-center gap-3.5 text-[14px]">
                                    <div className="flex bg-cyan-50 h-8 w-8 items-center justify-center rounded-lg shrink-0">
                                        <Phone className="h-4 w-4 text-cyan-600" />
                                    </div>
                                    <span className="font-semibold text-gray-700">{patient.phone}</span>
                                </div>
                                {patient.email && (
                                    <div className="flex items-center gap-3.5 text-[14px]">
                                        <div className="flex bg-cyan-50 h-8 w-8 items-center justify-center rounded-lg shrink-0">
                                            <Mail className="h-4 w-4 text-cyan-600" />
                                        </div>
                                        <span className="font-semibold text-gray-700 truncate">{patient.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3.5 text-[14px]">
                                    <div className="flex bg-amber-50 h-8 w-8 items-center justify-center rounded-lg shrink-0">
                                        <Calendar className="h-4 w-4 text-amber-600" />
                                    </div>
                                    <span className="font-semibold text-gray-700">{format(new Date(patient.dateOfBirth), "dd MMM yyyy")}</span>
                                </div>
                                {patient.address && (
                                    <div className="flex items-start gap-3.5 text-[14px]">
                                        <div className="flex bg-purple-50 h-8 w-8 items-center justify-center rounded-lg shrink-0 mt-0.5">
                                            <MapPin className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <span className="font-semibold text-gray-700 leading-snug">{patient.address}</span>
                                    </div>
                                )}
                            </div>

                            {patient.allergies && patient.allergies.length > 0 && (
                                <div className="bg-red-50/50 rounded-[16px] border border-red-100 p-5">
                                    <div className="flex items-center gap-2 text-red-600 mb-3">
                                        <AlertCircle className="h-4 w-4" />
                                        <span className="font-bold text-[13px] uppercase tracking-wider">Allergies</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {patient.allergies.map((allergy: string) => (
                                            <Badge key={allergy} className="bg-white text-red-600 border-red-200 hover:bg-red-50 font-semibold px-2.5 py-0.5">
                                                {allergy}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
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
                            <TabsList className="mb-6 bg-white/50 backdrop-blur-md border border-gray-100/50 p-1.5 rounded-2xl h-auto flex w-fit">
                                <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-cyan-700 font-semibold text-gray-500 transition-all">Overview</TabsTrigger>
                                <TabsTrigger value="billing" className="rounded-xl px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-cyan-700 font-semibold text-gray-500 transition-all">Billing</TabsTrigger>
                            </TabsList>

                            {/* Overview Tab */}
                            <TabsContent value="overview" className="space-y-6">
                                <div className="flex items-center justify-between bg-white/40 backdrop-blur-xl border border-white/60 shadow-sm rounded-[20px] p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-cyan-100/50 p-2.5 rounded-xl">
                                            <Calendar className="h-5 w-5 text-cyan-600" />
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-900">Visit History</h3>
                                    </div>
                                    <Button className="rounded-xl px-5 h-10 font-bold bg-gray-900 hover:bg-gray-800 text-white shadow-md transition-all gap-2" onClick={() => setIsNewVisitOpen(true)}>
                                        <Plus className="h-4 w-4" />
                                        New Visit
                                    </Button>
                                    
                                    <Dialog open={isNewVisitOpen} onOpenChange={setIsNewVisitOpen}>
                                        <DialogContent className="max-w-2xl bg-white/80 backdrop-blur-3xl border-white/60 shadow-2xl rounded-[24px] p-0 overflow-hidden">
                                            <div className="p-6 border-b border-gray-100/50 bg-white/40">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl font-bold text-gray-900">Schedule New Visit</DialogTitle>
                                                </DialogHeader>
                                            </div>
                                            <div className="p-6">
                                                <AppointmentForm
                                                    clinicId={patient.clinicId}
                                                    patients={[{ id: patient.id, firstName: patient.firstName, lastName: patient.lastName }]}
                                                    defaultValues={{ patientId: patient.id }}
                                                    onSubmit={handleCreateAppointment}
                                                    onCancel={() => setIsNewVisitOpen(false)}
                                                    isLoading={isLoading}
                                                />
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Edit Appointment Dialog */}
                                    <Dialog open={!!editingAppointment} onOpenChange={(open) => !open && setEditingAppointment(null)}>
                                        <DialogContent className="bg-white/80 backdrop-blur-3xl border-white/60 shadow-2xl rounded-[24px] p-0 overflow-hidden">
                                            <div className="p-6 border-b border-gray-100/50 bg-white/40">
                                                <DialogHeader>
                                                    <DialogTitle className="text-xl font-bold text-gray-900">Edit Appointment</DialogTitle>
                                                    <DialogDescription className="text-gray-500 font-medium">
                                                        Modify the details for this scheduled visit.
                                                    </DialogDescription>
                                                </DialogHeader>
                                            </div>
                                            <div className="space-y-5 p-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-date" className="text-gray-700 font-semibold text-[13px]">Date</Label>
                                                        <Input
                                                            id="edit-date"
                                                            type="date"
                                                            value={editForm.date}
                                                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                                            className="h-11 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="edit-time" className="text-gray-700 font-semibold text-[13px]">Time</Label>
                                                        <Input
                                                            id="edit-time"
                                                            type="time"
                                                            value={editForm.time}
                                                            onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                                                            className="h-11 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-type" className="text-gray-700 font-semibold text-[13px]">Treatment Type</Label>
                                                    <Select
                                                        value={editForm.type}
                                                        onValueChange={(value) => setEditForm({ ...editForm, type: value })}
                                                    >
                                                        <SelectTrigger className="h-11 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4">
                                                            <SelectValue placeholder="Select treatment" />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl border border-gray-100 bg-white shadow-xl">
                                                            {TREATMENT_TYPES.map((treatment) => (
                                                                <SelectItem key={treatment} value={treatment} className="rounded-lg hover:bg-cyan-50 cursor-pointer">
                                                                    {treatment}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-duration" className="text-gray-700 font-semibold text-[13px]">Duration (minutes)</Label>
                                                    <Input
                                                        id="edit-duration"
                                                        type="number"
                                                        value={editForm.duration}
                                                        onChange={(e) => setEditForm({ ...editForm, duration: parseInt(e.target.value) || 30 })}
                                                        className="h-11 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-gray-700 font-semibold text-[13px]">Status</Label>
                                                    <Select
                                                        value={editForm.status}
                                                        onValueChange={(value: any) => setEditForm({ ...editForm, status: value })}
                                                    >
                                                        <SelectTrigger className="h-11 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper" side="bottom" className="rounded-xl border border-gray-100 bg-white shadow-xl">
                                                            <SelectItem value="SCHEDULED" className="rounded-lg hover:bg-cyan-50 cursor-pointer">🔵 Scheduled</SelectItem>
                                                            <SelectItem value="CONFIRMED" className="rounded-lg hover:bg-cyan-50 cursor-pointer">✅ Confirmed</SelectItem>
                                                            <SelectItem value="SEATED" className="rounded-lg hover:bg-cyan-50 cursor-pointer">🪑 Seated</SelectItem>
                                                            <SelectItem value="IN_PROGRESS" className="rounded-lg hover:bg-cyan-50 cursor-pointer">🏥 In Progress</SelectItem>
                                                            <SelectItem value="COMPLETED" className="rounded-lg hover:bg-cyan-50 cursor-pointer">✔️ Completed</SelectItem>
                                                            <SelectItem value="CANCELLED" className="rounded-lg hover:bg-cyan-50 cursor-pointer">❌ Cancelled</SelectItem>
                                                            <SelectItem value="NO_SHOW" className="rounded-lg hover:bg-cyan-50 cursor-pointer">⚠️ No Show</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-notes" className="text-gray-700 font-semibold text-[13px]">Notes</Label>
                                                    <Input
                                                        id="edit-notes"
                                                        value={editForm.notes}
                                                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                                                        placeholder="Add any notes..."
                                                        className="h-11 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4"
                                                    />
                                                </div>
                                            </div>
                                            <div className="p-6 bg-gray-50/50 border-t border-gray-100/50 flex justify-end gap-3 rounded-b-[24px]">
                                                <Button variant="outline" onClick={() => setEditingAppointment(null)} className="rounded-xl px-5 h-11 font-bold border-gray-200/60 bg-white shadow-sm hover:bg-gray-50">
                                                    Cancel
                                                </Button>
                                                <Button onClick={handleSaveEdit} disabled={isLoading} className="rounded-xl px-6 h-11 font-bold bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-md">
                                                    {isLoading ? "Saving..." : "Save Changes"}
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {visits.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[24px]">
                                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                            <Calendar className="h-8 w-8 text-cyan-200" />
                                        </div>
                                        <p className="text-gray-500 font-medium">No visits recorded yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {visits.map((visit: any) => (
                                            <div key={visit.id} className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm hover:shadow-md transition-all rounded-[20px] p-6 relative group overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-gray-900 text-lg">
                                                                {format(new Date(visit.scheduledAt), "dd MMM yyyy")}
                                                            </span>
                                                            <Badge className={`px-2.5 py-0.5 rounded-md font-semibold ${
                                                                visit.status === "COMPLETED" ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                                                                visit.status === "SCHEDULED" ? 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200' :
                                                                'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                            }`}>
                                                                {visit.status}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-[14px] font-medium text-gray-500 mt-1">
                                                            Time: {format(new Date(visit.scheduledAt), "HH:mm")} • Type: {visit.type || "General Consultation"}
                                                        </p>
                                                        <p className="text-[14px] text-gray-400 mt-0.5">
                                                            {visit.doctor ? `Dr. ${visit.doctor.firstName} ${visit.doctor.lastName}` : 'No Doctor Assigned'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-9 w-9 p-0 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg"
                                                            onClick={(e) => handleEditClick(visit, e)}
                                                            title="Edit Appointment"
                                                            disabled={isLoading}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-9 w-9 p-0 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg"
                                                            onClick={(e) => handleSendReminder(visit.id, e)}
                                                            title="Send Reminder Now"
                                                            disabled={isLoading}
                                                        >
                                                            <Bell className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-9 w-9 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                            onClick={(e) => handleDeleteAppointment(visit.id, e)}
                                                            title="Delete Appointment"
                                                            disabled={isLoading}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-3 pt-4 border-t border-gray-100/60 mt-4 text-[14px] text-gray-700">
                                                    {visit.chiefComplaint && <p><strong className="font-semibold text-gray-900">Chief Complaint:</strong> {visit.chiefComplaint}</p>}
                                                    {visit.notes && <p><strong className="font-semibold text-gray-900">Notes:</strong> {visit.notes}</p>}

                                                    {visit.clinicalRecords && visit.clinicalRecords.length > 0 && (
                                                        <div className="bg-cyan-50/50 p-4 rounded-xl border border-cyan-100/50 mt-3">
                                                            <p className="text-cyan-800 font-bold mb-2">Services & Treatments</p>
                                                            <ul className="space-y-1">
                                                                {visit.clinicalRecords.map((t: any, i: number) => (
                                                                    <li key={i} className="flex items-center gap-2">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                                                        <span className="font-medium">{t.procedure?.name || "Treatment"}</span>
                                                                        {t.toothNumber && <span className="text-cyan-600 text-[12px] bg-white px-2 py-0.5 rounded-md border border-cyan-100 shadow-sm ml-1">Tooth {t.toothNumber}</span>}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {visit.notifications && visit.notifications.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 items-center mt-3 pt-3">
                                                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Messages:</span>
                                                            {visit.notifications.map((notif: any) => (
                                                                <Badge key={notif.id} className={`text-[10px] uppercase font-bold px-2 border-0 ${notif.status === 'SENT' ? 'bg-emerald-100 text-emerald-700' : notif.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                                                    {notif.type}: {notif.status}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>

                            {/* Billing Tab */}
                            <TabsContent value="billing" className="space-y-6">
                                <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] rounded-[20px] p-6 overflow-hidden relative">
                                    <div className="absolute -right-12 -top-12 w-40 h-40 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />
                                    <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
                                    
                                    <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                                        <div className="bg-cyan-100/50 p-2 rounded-lg">
                                            <FileText className="h-4 w-4 text-cyan-600" />
                                        </div>
                                        Balance Summary
                                    </h3>
                                    <div className="grid grid-cols-3 gap-6 text-center divide-x divide-gray-100/50">
                                        <div className="px-4">
                                            <p className="text-[32px] font-black text-gray-900 tracking-tight">{formatCurrency(totalBilled)}</p>
                                            <p className="text-[14px] font-semibold text-gray-500 uppercase tracking-wider mt-1">Total Billed</p>
                                        </div>
                                        <div className="px-4">
                                            <p className="text-[32px] font-black text-emerald-500 tracking-tight">{formatCurrency(totalPaid)}</p>
                                            <p className="text-[14px] font-semibold text-gray-500 uppercase tracking-wider mt-1">Total Paid</p>
                                        </div>
                                        <div className="px-4">
                                            <p className="text-[32px] font-black text-amber-500 tracking-tight">{formatCurrency(outstanding)}</p>
                                            <p className="text-[14px] font-semibold text-gray-500 uppercase tracking-wider mt-1">Outstanding</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-sm rounded-[20px] overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100/50 bg-white/40">
                                                <th className="px-6 py-4 text-left text-[12px] font-bold text-gray-400 uppercase tracking-wider">Invoice</th>
                                                <th className="px-6 py-4 text-left text-[12px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-4 text-right text-[12px] font-bold text-gray-400 uppercase tracking-wider">Total</th>
                                                <th className="px-6 py-4 text-right text-[12px] font-bold text-gray-400 uppercase tracking-wider">Paid</th>
                                                <th className="px-6 py-4 text-center text-[12px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100/50">
                                            {invoices.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium bg-white/20">
                                                        No invoices found
                                                    </td>
                                                </tr>
                                            ) : (
                                                invoices.map((invoice: any) => (
                                                    <tr key={invoice.id} className="hover:bg-cyan-50/30 transition-colors">
                                                        <td className="px-6 py-4 font-mono text-[14px] font-medium text-gray-700">{invoice.invoiceNumber || invoice.id.slice(0, 8).toUpperCase()}</td>
                                                        <td className="px-6 py-4 text-[14px] font-medium text-gray-600">{format(new Date(invoice.createdAt), "dd MMM yyyy")}</td>
                                                        <td className="px-6 py-4 text-right font-bold text-gray-900">{formatCurrency(Number(invoice.total))}</td>
                                                        <td className="px-6 py-4 text-right font-semibold text-emerald-600">{formatCurrency(Number(invoice.amountPaid))}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <Badge className={`px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] tracking-wider border-0 ${
                                                                invoice.status === "PAID" ? 'bg-emerald-100 text-emerald-700' : 
                                                                invoice.status === "PARTIAL" ? 'bg-amber-100 text-amber-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>
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
