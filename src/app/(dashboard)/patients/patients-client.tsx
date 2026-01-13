"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PatientTable } from "@/components/patients/patient-table"
import { QuickAddPatientSheet } from "@/components/patients/quick-add-sheet"
import { createPatient, updatePatient, deletePatient } from "@/lib/actions/patients"
import type { PatientFormValues } from "@/lib/validations/patient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImportPatientsDialog } from "@/components/patients/import-patients-dialog"
import { ExportPatientsDialog } from "@/components/patients/export-patients-dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, Filter, X } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface PatientsClientProps {
    initialPatients: any[]
    clinicId: string
}

export function PatientsClient({ initialPatients, clinicId }: PatientsClientProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)
    const [patients, setPatients] = useState(initialPatients)
    const [selectedPatient, setSelectedPatient] = useState<any>(null)

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [sortBy, setSortBy] = useState<string>("recent")

    // Sync local state with server data when props change
    useEffect(() => {
        setPatients(initialPatients)
    }, [initialPatients])

    const handleSheetSubmit = async (data: PatientFormValues) => {
        try {
            if (selectedPatient) {
                // Edit Mode
                await updatePatient(selectedPatient.id, data)
                toast({ title: "Patient updated successfully" })
            } else {
                // Create Mode
                await createPatient(clinicId, data)
                toast({ title: "Patient created successfully" })
            }
            router.refresh()
            setIsAddSheetOpen(false)
            setSelectedPatient(null)
        } catch (error) {
            console.error("Failed to save patient", error)
            toast({
                title: "Error",
                description: "Failed to save patient details.",
                variant: "destructive"
            })
        }
    }

    const handleAddClick = () => {
        setSelectedPatient(null)
        setIsAddSheetOpen(true)
    }

    const handleViewPatient = (patient: { id: string }) => {
        router.push(`/patients/${patient.id}`)
    }

    const handleEditPatient = (patient: any) => {
        // Pre-fill date objects if needed, though react-hook-form handles strings well for defaultValues usually
        // But date input needs YYYY-MM-DD
        const formattedPatient = {
            ...patient,
            dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : "",
        }
        setSelectedPatient(formattedPatient)
        setIsAddSheetOpen(true)
    }

    const handleDeletePatient = async (patient: any) => {
        if (confirm(`Are you sure you want to delete ${patient.firstName} ${patient.lastName}? This action cannot be undone.`)) {
            try {
                await deletePatient(patient.id)
                toast({ title: "Patient deleted successfully" })
                router.refresh()
            } catch (error) {
                console.error("Delete failed", error)
                toast({ title: "Delete failed", variant: "destructive" })
            }
        }
    }

    // Filtered and sorted patients
    const filteredPatients = useMemo(() => {
        let result = [...patients]

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(patient => {
                const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase()
                const phone = patient.phone?.toLowerCase() || ""
                const email = patient.email?.toLowerCase() || ""
                return fullName.includes(query) || phone.includes(query) || email.includes(query)
            })
        }

        // Status filter
        if (statusFilter !== "all") {
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

            result = result.filter(patient => {
                const lastVisit = patient.lastVisitDate ? new Date(patient.lastVisitDate) : null

                if (statusFilter === "active") {
                    return lastVisit && lastVisit >= thirtyDaysAgo
                } else if (statusFilter === "inactive") {
                    return !lastVisit || lastVisit < thirtyDaysAgo
                }
                return true
            })
        }

        // Sorting
        result.sort((a, b) => {
            switch (sortBy) {
                case "recent":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                case "name":
                    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
                case "lastVisit":
                    const dateA = a.lastVisitDate ? new Date(a.lastVisitDate).getTime() : 0
                    const dateB = b.lastVisitDate ? new Date(b.lastVisitDate).getTime() : 0
                    return dateB - dateA
                default:
                    return 0
            }
        })

        return result
    }, [patients, searchQuery, statusFilter, sortBy])

    return (
        <div className="flex flex-col h-full">
            <Header
                title="Patients"
                description="Manage your patient records"
                action={{
                    label: "Add Patient",
                    onClick: handleAddClick,
                }}
            >
                <div className="flex items-center gap-2">
                    <ImportPatientsDialog clinicId={clinicId} />
                    <ExportPatientsDialog clinicId={clinicId} />
                </div>
            </Header>

            {/* Search and Filter Bar */}
            <div className="border-b bg-muted/30 px-6 py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, phone, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-9"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active (30d)</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Most Recent</SelectItem>
                                <SelectItem value="name">Name (A-Z)</SelectItem>
                                <SelectItem value="lastVisit">Last Visit</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="text-sm text-muted-foreground">
                            {filteredPatients.length} of {patients.length} patients
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 overflow-auto">
                {filteredPatients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <Search className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No patients found</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {searchQuery || statusFilter !== "all"
                                ? "Try adjusting your search or filters"
                                : "Click 'Add Patient' to create your first patient record"}
                        </p>
                    </div>
                ) : (
                    <PatientTable
                        patients={filteredPatients}
                        onView={handleViewPatient}
                        onEdit={handleEditPatient}
                        onDelete={handleDeletePatient}
                    />
                )}
            </div>

            <QuickAddPatientSheet
                open={isAddSheetOpen}
                onOpenChange={(open) => {
                    setIsAddSheetOpen(open)
                    if (!open) setSelectedPatient(null)
                }}
                onSubmit={handleSheetSubmit}
                defaultValues={selectedPatient}
                clinicId={clinicId}
            />
        </div>
    )
}
