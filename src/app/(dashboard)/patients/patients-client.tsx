"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PatientTable } from "@/components/patients/patient-table"
import { QuickAddPatientSheet } from "@/components/patients/quick-add-sheet"
import { createPatient } from "@/lib/actions/patients"
import type { PatientFormValues } from "@/lib/validations/patient"
import { Button } from "@/components/ui/button"

interface PatientsClientProps {
    initialPatients: any[] // Using any for brevity in migration, ideally Typed
    clinicId: string
}

export function PatientsClient({ initialPatients, clinicId }: PatientsClientProps) {
    const router = useRouter()
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false)
    const [patients, setPatients] = useState(initialPatients)

    const handleAddPatient = async (data: PatientFormValues) => {
        try {
            const newPatient = await createPatient(clinicId, data)
            // We can either update local state or just let the server action revalidatePath handle it
            // Since createPatient calls revalidatePath, pushing router refresh might be cleaner
            setPatients([newPatient, ...patients]) // Optimistic update or just append
            setIsAddSheetOpen(false)
            router.refresh()
        } catch (error) {
            console.error("Failed to create patient", error)
            // Show toast error
        }
    }

    const handleViewPatient = (patient: { id: string }) => {
        router.push(`/patients/${patient.id}`)
    }

    const handleEditPatient = (patient: { id: string }) => {
        console.log("Edit patient:", patient.id)
    }

    const handleDeletePatient = (patient: { id: string }) => {
        // Implement deletePatient action integration
    }

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8," +
            "ID,First Name,Last Name,Phone,Email,DOB,Last Visit\n" +
            patients.map(p => `${p.id},${p.firstName},${p.lastName},${p.phone},${p.email || ""},${new Date(p.dateOfBirth).toISOString().split('T')[0]},${p.lastVisitDate ? new Date(p.lastVisitDate).toISOString().split('T')[0] : ""}`).join("\n")

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "patients_export.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                title="Patients"
                description="Manage your patient records"
                action={{
                    label: "Add Patient",
                    onClick: () => setIsAddSheetOpen(true),
                }}
            >
                <Button variant="outline" className="ml-2" onClick={handleExport}>
                    Export CSV
                </Button>
            </Header>

            <div className="flex-1 p-6">
                <PatientTable
                    patients={patients}
                    onView={handleViewPatient}
                    onEdit={handleEditPatient}
                    onDelete={handleDeletePatient}
                />
            </div>

            <QuickAddPatientSheet
                open={isAddSheetOpen}
                onOpenChange={setIsAddSheetOpen}
                onSubmit={handleAddPatient}
            />
        </div>
    )
}
