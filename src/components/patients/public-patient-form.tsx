"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { patientFormSchema, type PatientFormValues } from "@/lib/validations/patient"
import { createPublicPatient } from "@/lib/actions/public-intake"

interface PublicPatientFormProps {
    clinicId: string
}

export function PublicPatientForm({ clinicId }: PublicPatientFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PatientFormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            dateOfBirth: "",
            gender: undefined,
            address: "",
            notes: undefined,
        } as any,
    })
    
    // Create an explicit submit handler typed for the form schema
    const handleFormSubmit = async (data: any) => {
        const validData = data as PatientFormValues
        setIsLoading(true)
        setSubmitError(null)

        try {
            const result = await createPublicPatient(clinicId, validData)
            
            if (result.error) {
                setSubmitError(result.error)
            } else {
                setIsSuccess(true)
            }
        } catch (error) {
            setSubmitError("An unexpected error occurred. Please try again or ask the reception for help.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6">
                <div className="bg-emerald-100 p-4 rounded-full">
                    <CheckCircle2 className="h-16 w-16 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
                    <p className="text-gray-500">
                        Thank you for providing your details. Please inform the receptionist that you have finished registering.
                    </p>
                </div>
                <Button 
                    className="mt-6 rounded-xl bg-gray-900 text-white font-bold h-12 px-8 shadow-md"
                    onClick={() => window.location.reload()}
                    variant="outline"
                >
                    Register Another Patient
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {submitError && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[13px] font-medium">
                    {submitError}
                </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 font-semibold text-[13px]">First Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="firstName"
                        placeholder="John"
                        className="h-12 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4 text-[16px]"
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
                        className="h-12 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4 text-[16px]"
                        {...register("lastName")}
                    />
                    {errors.lastName && (
                        <p className="text-[12px] font-medium text-red-500 mt-1">{errors.lastName.message as string}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 font-semibold text-[13px]">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    className="h-12 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4 text-[16px]"
                    {...register("phone")}
                />
                {errors.phone && (
                    <p className="text-[12px] font-medium text-red-500 mt-1">{errors.phone.message as string}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold text-[13px]">Email Address (Optional)</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="h-12 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4 text-[16px]"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-[12px] font-medium text-red-500 mt-1">{errors.email.message as string}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-gray-700 font-semibold text-[13px]">Date of Birth <span className="text-red-500">*</span></Label>
                    <Input
                        id="dateOfBirth"
                        type="date"
                        className="h-12 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4 text-[16px]"
                        {...register("dateOfBirth")}
                    />
                    {errors.dateOfBirth && (
                        <p className="text-[12px] font-medium text-red-500 mt-1">{errors.dateOfBirth.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gender" className="text-gray-700 font-semibold text-[13px]">Gender (Optional)</Label>
                    <select
                        id="gender"
                        className="flex h-12 w-full rounded-xl border border-gray-200/60 bg-white/60 px-4 py-2 text-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/20 shadow-sm transition-all focus:bg-white hover:bg-white/80"
                        {...register("gender")}
                    >
                        <option value="">Select</option>
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
                    placeholder="City, Area, strictly..."
                    className="h-12 rounded-xl bg-white/60 border-gray-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-cyan-500/20 px-4 text-[16px]"
                    {...register("address")}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes" className="text-gray-700 font-semibold text-[13px]">Medical History or Notes</Label>
                <textarea
                    id="notes"
                    className="flex min-h-[100px] w-full rounded-xl border border-gray-200/60 bg-white/60 px-4 py-3 text-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/20 shadow-sm transition-all focus:bg-white placeholder:text-gray-400 resize-none"
                    placeholder="Any past illnesses, current medications, or specific dental concerns? (Optional)"
                    {...register("notes")}
                />
            </div>

            <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full rounded-xl h-14 font-bold text-[16px] bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-xl hover:shadow-2xl transition-all border border-gray-800/50"
            >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading ? "Submitting securely..." : "Complete Registration"}
            </Button>
            
            <p className="text-center text-[12px] font-medium text-gray-400 mt-4">
                Your data is stored securely and only accessible by the clinic staff.
            </p>
        </form>
    )
}
