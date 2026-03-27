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
        <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-[20px] bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-transparent border-b border-gray-100/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[12px] font-bold text-gray-400 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-4 text-left text-[12px] font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-[12px] font-bold text-gray-400 uppercase tracking-wider">Age/Gender</th>
                                <th className="px-6 py-4 text-left text-[12px] font-bold text-gray-400 uppercase tracking-wider">Last Visit</th>
                                <th className="px-6 py-4 text-left text-[12px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-[12px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50">
                            {patients.map((patient) => (
                                <tr key={patient.id} className="group hover:bg-white/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-inner font-bold text-[14px]">
                                                {patient.firstName.charAt(0)}
                                            </div>
                                            <div className="font-bold text-[15px] text-gray-900 group-hover:text-cyan-700 transition-colors">
                                                {patient.firstName} {patient.lastName}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5 text-[13px]">
                                            <div className="flex items-center gap-2 text-gray-500 font-medium">
                                                <Phone className="h-3.5 w-3.5" />
                                                {patient.phone}
                                            </div>
                                            {patient.email && (
                                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                                    <Mail className="h-3.5 w-3.5" />
                                                    {patient.email}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[13px] text-gray-600 font-medium">
                                        {calculateAge(patient.dateOfBirth)}y
                                        {patient.gender && <span className="text-gray-400 ml-1">• {patient.gender}</span>}
                                    </td>
                                    <td className="px-6 py-4 text-[13px] text-gray-500 font-medium">
                                        {patient.lastVisitDate
                                            ? format(new Date(patient.lastVisitDate), "MMM dd, yyyy")
                                            : "Never"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border
                                            ${isActive(patient.lastVisitDate) 
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-100/50" 
                                                : "bg-gray-50 text-gray-500 border-gray-100"}
                                        `}>
                                            {isActive(patient.lastVisitDate) ? "Active" : "Inactive"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100">
                                                    <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-gray-100 shadow-lg">
                                                <DropdownMenuItem onClick={() => onView(patient)} className="rounded-lg cursor-pointer">
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onEdit(patient)} className="rounded-lg cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => onDelete(patient)}
                                                    className="text-red-600 rounded-lg cursor-pointer focus:bg-red-50 focus:text-red-700"
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
            <div className="md:hidden space-y-4">
                {patients.map((patient) => (
                    <Card key={patient.id} className="bg-white/70 backdrop-blur-2xl border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] rounded-[20px] overflow-hidden">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 shadow-inner font-bold text-[16px]">
                                        {patient.firstName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[16px] text-gray-900 leading-tight">
                                            {patient.firstName} {patient.lastName}
                                        </h3>
                                        <p className="text-[13px] text-gray-500 font-medium mt-0.5">
                                            {calculateAge(patient.dateOfBirth)}y
                                            {patient.gender && ` • ${patient.gender}`}
                                        </p>
                                    </div>
                                </div>
                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border
                                    ${isActive(patient.lastVisitDate) 
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100/50" 
                                        : "bg-gray-50 text-gray-500 border-gray-100"}
                                `}>
                                    {isActive(patient.lastVisitDate) ? "Active" : "Inactive"}
                                </div>
                            </div>

                            <div className="bg-white/50 rounded-[14px] border border-gray-100 p-4 space-y-3 mb-4">
                                <div className="flex items-center gap-3 text-[13px] font-medium text-gray-600">
                                    <Phone className="h-4 w-4 text-cyan-600/70" />
                                    <a href={`tel:${patient.phone}`} className="hover:text-cyan-700 transition-colors">
                                        {patient.phone}
                                    </a>
                                </div>
                                {patient.email && (
                                    <div className="flex items-center gap-3 text-[13px] font-medium text-gray-600">
                                        <Mail className="h-4 w-4 text-cyan-600/70" />
                                        <a href={`mailto:${patient.email}`} className="hover:text-cyan-700 transition-colors truncate">
                                            {patient.email}
                                        </a>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-gray-100/60 flex items-center justify-between text-[12px]">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider">Last Visit</span>
                                    <span className="text-gray-900 font-semibold">
                                        {patient.lastVisitDate
                                            ? format(new Date(patient.lastVisitDate), "MMM dd, yyyy")
                                            : "Never"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => onView(patient)}
                                    variant="outline"
                                    className="flex-1 rounded-xl h-9 text-[13px] font-semibold border-gray-200 bg-white shadow-sm hover:bg-gray-50"
                                >
                                    <Eye className="mr-2 h-3.5 w-3.5" />
                                    View
                                </Button>
                                <Button
                                    onClick={() => onEdit(patient)}
                                    variant="outline"
                                    className="flex-1 rounded-xl h-9 text-[13px] font-semibold border-gray-200 bg-white shadow-sm hover:bg-gray-50"
                                >
                                    <Edit className="mr-2 h-3.5 w-3.5" />
                                    Edit
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
