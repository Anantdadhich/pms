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
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                        id="firstName"
                        placeholder="John"
                        {...register("firstName")}
                    />
                    {errors.firstName && (
                        <p className="text-sm text-destructive">{errors.firstName.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                        id="lastName"
                        placeholder="Doe"
                        {...register("lastName")}
                    />
                    {errors.lastName && (
                        <p className="text-sm text-destructive">{errors.lastName.message as string}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                        id="phone"
                        placeholder="+91 98765 43210"
                        {...register("phone")}
                    />
                    {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message as string}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                        id="dateOfBirth"
                        type="date"
                        {...register("dateOfBirth")}
                    />
                    {errors.dateOfBirth && (
                        <p className="text-sm text-destructive">{errors.dateOfBirth.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                        id="gender"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                <Label htmlFor="address">Address</Label>
                <Input
                    id="address"
                    placeholder="123 Main Street, City"
                    {...register("address")}
                />
            </div>

            {/* Service Selection with Dropdown */}
            <div className="space-y-2">
                <Label>Reason for Visit / Services</Label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <span className="text-muted-foreground">
                            Select a service to add
                        </span>
                        <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && treatments.length > 0 && (
                        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg max-h-[300px] overflow-auto">
                            {Object.entries(groupedTreatments).map(([category, categoryTreatments]) => (
                                <div key={category}>
                                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50 sticky top-0">
                                        {category}
                                    </div>
                                    {categoryTreatments.map((treatment) => (
                                        <button
                                            key={treatment.id}
                                            type="button"
                                            onClick={() => handleServiceSelect(treatment.name)}
                                            className="flex w-full items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                        >
                                            <Check className={`mr-2 h-4 w-4 ${selectedNotes.includes(treatment.name) ? 'opacity-100' : 'opacity-0'}`} />
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
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-2"
                    placeholder="Selected services will appear here. You can also add custom notes..."
                    {...register("notes")}
                />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {defaultValues?.firstName ? "Update Patient" : "Add Patient"}
                </Button>
            </div>
        </form>
    )
}
