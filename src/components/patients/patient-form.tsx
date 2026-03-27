"use client"

import { useForm, SubmitHandler, FieldValues, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { patientFormSchema, type PatientFormValues } from "@/lib/validations/patient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, ChevronDown, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { getTreatments } from "@/lib/actions/treatments"

interface PatientFormProps {
    clinicId: string
    defaultValues?: Partial<PatientFormValues>
    onSubmit: (data: PatientFormValues) => Promise<void>
    onCancel: () => void
    isLoading?: boolean
}

interface Treatment {
    id: string
    name: string
    category: string
}

// Default dental services if none exist in database
const DEFAULT_DENTAL_SERVICES: Treatment[] = [
    // Preventive Care
    { id: "default-1", name: "Routine Checkup", category: "Preventive Care" },
    { id: "default-2", name: "Dental Cleaning (Scaling)", category: "Preventive Care" },
    { id: "default-3", name: "Deep Cleaning", category: "Preventive Care" },
    { id: "default-4", name: "Fluoride Treatment", category: "Preventive Care" },
    { id: "default-5", name: "X-Ray", category: "Preventive Care" },
    { id: "default-6", name: "OPG/Full Mouth X-Ray", category: "Preventive Care" },

    // Restorative
    { id: "default-7", name: "Tooth Filling (Composite)", category: "Restorative" },
    { id: "default-8", name: "Tooth Filling (Amalgam)", category: "Restorative" },
    { id: "default-9", name: "Root Canal Treatment (RCT)", category: "Restorative" },
    { id: "default-10", name: "Crown/Cap", category: "Restorative" },
    { id: "default-11", name: "Bridge", category: "Restorative" },
    { id: "default-12", name: "Inlay/Onlay", category: "Restorative" },

    // Cosmetic
    { id: "default-13", name: "Teeth Whitening", category: "Cosmetic" },
    { id: "default-14", name: "Veneer", category: "Cosmetic" },
    { id: "default-15", name: "Smile Makeover", category: "Cosmetic" },
    { id: "default-16", name: "Tooth Bonding", category: "Cosmetic" },

    // Extraction & Surgery
    { id: "default-17", name: "Simple Extraction", category: "Extraction & Surgery" },
    { id: "default-18", name: "Surgical Extraction", category: "Extraction & Surgery" },
    { id: "default-19", name: "Wisdom Tooth Removal", category: "Extraction & Surgery" },
    { id: "default-20", name: "Gum Surgery", category: "Extraction & Surgery" },

    // Orthodontics
    { id: "default-21", name: "Braces Consultation", category: "Orthodontics" },
    { id: "default-22", name: "Metal Braces", category: "Orthodontics" },
    { id: "default-23", name: "Ceramic Braces", category: "Orthodontics" },
    { id: "default-24", name: "Invisalign/Clear Aligners", category: "Orthodontics" },
    { id: "default-25", name: "Retainer", category: "Orthodontics" },

    // Implants & Prosthetics
    { id: "default-26", name: "Dental Implant", category: "Implants & Prosthetics" },
    { id: "default-27", name: "Complete Denture", category: "Implants & Prosthetics" },
    { id: "default-28", name: "Partial Denture", category: "Implants & Prosthetics" },
    { id: "default-29", name: "Implant Crown", category: "Implants & Prosthetics" },

    // Pediatric
    { id: "default-30", name: "Child Checkup", category: "Pediatric" },
    { id: "default-31", name: "Pit & Fissure Sealant", category: "Pediatric" },
    { id: "default-32", name: "Pulpotomy", category: "Pediatric" },
    { id: "default-33", name: "Space Maintainer", category: "Pediatric" },

    // Emergency
    { id: "default-34", name: "Emergency Consultation", category: "Emergency" },
    { id: "default-35", name: "Pain Relief", category: "Emergency" },
    { id: "default-36", name: "Temporary Filling", category: "Emergency" },
    { id: "default-37", name: "Tooth Re-implantation", category: "Emergency" },
]

export function PatientForm({
    clinicId,
    defaultValues,
    onSubmit,
    onCancel,
    isLoading,
}: PatientFormProps) {
    const [treatments, setTreatments] = useState<Treatment[]>(DEFAULT_DENTAL_SERVICES)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(patientFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            gender: undefined,
            address: "",
            allergies: [] as string[],
            notes: "",
            ...defaultValues,
        },
    })

    const selectedNotes = watch("notes") || ""

    // Load treatments on mount - merge with defaults if database has treatments
    useEffect(() => {
        async function loadTreatments() {
            try {
                const data = await getTreatments(clinicId)
                if (data && data.length > 0) {
                    // Use database treatments if available
                    setTreatments(data)
                }
                // Otherwise keep the default services
            } catch (error) {
                console.error("Failed to load treatments:", error)
                // Keep default services on error
            }
        }
        loadTreatments()
    }, [clinicId])

    // Group treatments by category
    const groupedTreatments = treatments.reduce((acc, treatment) => {
        const category = treatment.category || "Other"
        if (!acc[category]) {
            acc[category] = []
        }
        acc[category].push(treatment)
        return acc
    }, {} as Record<string, Treatment[]>)

    const handleServiceSelect = (serviceName: string) => {
        const currentNotes = selectedNotes
        const newNotes = currentNotes ? `${currentNotes}, ${serviceName}` : serviceName
        setValue("notes", newNotes)
        setIsDropdownOpen(false)
    }

    const handleFormSubmit: SubmitHandler<FieldValues> = async (data) => {
        await onSubmit(data as PatientFormValues)
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 pb-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 font-semibold text-[13px]">First Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="firstName"
                        placeholder="John"
                        className="h-11 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4"
                        {...register("firstName")}
                    />
                    {errors.firstName && (
                        <p className="text-[12px] font-medium text-red-500 mt-1">{errors.firstName.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 font-semibold text-[13px]">Last Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="lastName"
                        placeholder="Doe"
                        className="h-11 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4"
                        {...register("lastName")}
                    />
                    {errors.lastName && (
                        <p className="text-[12px] font-medium text-red-500 mt-1">{errors.lastName.message as string}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-semibold text-[13px]">Phone Number <span className="text-red-500">*</span></Label>
                    <Input
                        id="phone"
                        placeholder="+91 98765 43210"
                        className="h-11 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4"
                        {...register("phone")}
                    />
                    {errors.phone && (
                        <p className="text-[12px] font-medium text-red-500 mt-1">{errors.phone.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-semibold text-[13px]">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="h-11 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-[12px] font-medium text-red-500 mt-1">{errors.email.message as string}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-gray-700 font-semibold text-[13px]">Date of Birth <span className="text-red-500">*</span></Label>
                    <Input
                        id="dateOfBirth"
                        type="date"
                        className="h-11 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4"
                        {...register("dateOfBirth")}
                    />
                    {errors.dateOfBirth && (
                        <p className="text-[12px] font-medium text-red-500 mt-1">{errors.dateOfBirth.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gender" className="text-gray-700 font-semibold text-[13px]">Gender</Label>
                    <select
                        id="gender"
                        className="flex h-11 w-full rounded-xl border border-gray-200/60 bg-white/60 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/20 shadow-sm transition-all focus:bg-white hover:bg-white/80"
                        {...register("gender")}
                    >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700 font-semibold text-[13px]">Address (Optional)</Label>
                <Input
                    id="address"
                    placeholder="123 Main Street, City"
                    className="h-11 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4"
                    {...register("address")}
                />
            </div>

            {/* Service Selection with Dropdown */}
            <div className="space-y-2 relative">
                <Label className="text-gray-700 font-semibold text-[13px]">Reason for Visit / Services</Label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex h-11 w-full items-center justify-between rounded-xl border border-gray-200/60 bg-white/60 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/20 shadow-sm transition-all hover:bg-white/80"
                    >
                        <span className="text-gray-500">
                            Select a service to add
                        </span>
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && treatments.length > 0 && (
                        <div className="absolute z-50 mt-2 w-full rounded-[14px] border border-gray-100 bg-white shadow-xl max-h-[300px] overflow-auto py-1 animate-in fade-in slide-in-from-top-2">
                            {Object.entries(groupedTreatments).map(([category, categoryTreatments]) => (
                                <div key={category}>
                                    <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50/50 sticky top-0 backdrop-blur-md">
                                        {category}
                                    </div>
                                    {categoryTreatments.map((treatment) => (
                                        <button
                                            key={treatment.id}
                                            type="button"
                                            onClick={() => handleServiceSelect(treatment.name)}
                                            className="flex w-full items-center px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 transition-colors cursor-pointer"
                                        >
                                            <Check className={`mr-3 h-4 w-4 ${selectedNotes.includes(treatment.name) ? 'text-cyan-600 opacity-100' : 'opacity-0'}`} />
                                            {treatment.name}
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notes textarea to show selected services and allow custom notes */}
                <textarea
                    id="notes"
                    className="flex min-h-[100px] w-full rounded-xl border border-gray-200/60 bg-white/60 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/20 shadow-sm transition-all focus:bg-white placeholder:text-gray-400 mt-3 resize-none"
                    placeholder="Selected services will appear here. You can also add custom medical notes..."
                    {...register("notes")}
                />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100/50 mt-6">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel}
                    className="rounded-xl h-11 px-5 font-bold border-gray-200/60 bg-white shadow-sm hover:bg-gray-50 text-gray-700"
                >
                    Cancel
                </Button>
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="rounded-xl h-11 px-7 font-bold bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-md hover:shadow-lg transition-all border border-gray-800/50"
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {defaultValues?.firstName ? "Update Patient" : "Save Patient"}
                </Button>
            </div>
        </form>
    )
}
