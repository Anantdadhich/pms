"use client"

import { format } from "date-fns"
import { MoreHorizontal, Eye, Edit, Trash2, Phone, Mail } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Patient {
    id: string
    firstName: string
    lastName: string
    email?: string
    phone: string
    dateOfBirth: Date
    gender?: string
    lastVisitDate?: Date
}

interface PatientTableProps {
    patients: Patient[]
    onView: (patient: Patient) => void
    onEdit: (patient: Patient) => void
    onDelete: (patient: Patient) => void
}

export function PatientTable({ patients, onView, onEdit, onDelete }: PatientTableProps) {
    const calculateAge = (dob: Date) => {
        const today = new Date()
        const birthDate = new Date(dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    const isActive = (lastVisit?: Date) => {
        if (!lastVisit) return false
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return new Date(lastVisit) >= thirtyDaysAgo
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50">
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left text-sm font-medium">Patient</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Contact</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Age/Gender</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Last Visit</th>
                                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient) => (
                                <tr key={patient.id} className="border-b hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-medium">
                                            {patient.firstName} {patient.lastName}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1 text-sm">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Phone className="h-3 w-3" />
                                                {patient.phone}
                                            </div>
                                            {patient.email && (
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Mail className="h-3 w-3" />
                                                    {patient.email}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {calculateAge(patient.dateOfBirth)}y
                                        {patient.gender && ` • ${patient.gender}`}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {patient.lastVisitDate
                                            ? format(new Date(patient.lastVisitDate), "MMM dd, yyyy")
                                            : "Never"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant={isActive(patient.lastVisitDate) ? "default" : "secondary"}>
                                            {isActive(patient.lastVisitDate) ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onView(patient)}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onEdit(patient)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onDelete(patient)}
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {patients.map((patient) => (
                    <Card key={patient.id} className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-base">
                                        {patient.firstName} {patient.lastName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {calculateAge(patient.dateOfBirth)}y
                                        {patient.gender && ` • ${patient.gender}`}
                                    </p>
                                </div>
                                <Badge variant={isActive(patient.lastVisitDate) ? "default" : "secondary"}>
                                    {isActive(patient.lastVisitDate) ? "Active" : "Inactive"}
                                </Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <a href={`tel:${patient.phone}`} className="text-primary hover:underline">
                                        {patient.phone}
                                    </a>
                                </div>
                                {patient.email && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <a href={`mailto:${patient.email}`} className="text-primary hover:underline">
                                            {patient.email}
                                        </a>
                                    </div>
                                )}
                                <div className="text-sm text-muted-foreground">
                                    <span className="font-medium">Last Visit:</span>{" "}
                                    {patient.lastVisitDate
                                        ? format(new Date(patient.lastVisitDate), "MMM dd, yyyy")
                                        : "Never"}
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => onView(patient)}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </Button>
                                <Button
                                    onClick={() => onEdit(patient)}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                                <Button
                                    onClick={() => onDelete(patient)}
                                    variant="destructive"
                                    size="sm"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}
