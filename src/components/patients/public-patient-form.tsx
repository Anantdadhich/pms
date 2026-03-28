"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
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
            notes: "",
        },
    })

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

    // Premium Animated Success State
    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 rounded-full" />
                    <div className="relative bg-emerald-50 border border-emerald-100 p-5 rounded-full shadow-sm">
                        <CheckCircle2 className="h-14 w-14 text-emerald-600" strokeWidth={2.5} />
                    </div>
                </div>
                <div className="space-y-2 max-w-sm">
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900">You're all set!</h2>
                    <p className="text-[15px] text-zinc-500 leading-relaxed">
                        Thank you for providing your details. Please inform the receptionist that you have finished registering.
                    </p>
                </div>
                <Button
                    className="mt-8 rounded-[14px] bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 font-semibold h-12 px-8 shadow-sm transition-all"
                    onClick={() => window.location.reload()}
                >
                    Register Another Patient
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 animate-in fade-in duration-500">
            {/* Error Banner */}
            {submitError && (
                <div className="flex items-start gap-3 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-[14px] text-red-600 text-[14px] font-medium shadow-sm animate-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p>{submitError}</p>
                </div>
            )}

            {/* Name Row - Stacks on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-zinc-700 font-semibold text-[13px]">
                        First Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                        id="firstName"
                        placeholder="John"
                        disabled={isLoading}
                        className="h-12 rounded-[12px] bg-white/50 backdrop-blur-sm border-zinc-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-zinc-900/10 focus-visible:border-zinc-300 px-4 text-[16px] disabled:opacity-50"
                        {...register("firstName")}
                    />
                    {errors.firstName && (
                        <p className="text-[12px] font-medium text-rose-500 mt-1">{errors.firstName.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-zinc-700 font-semibold text-[13px]">
                        Last Name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                        id="lastName"
                        placeholder="Doe"
                        disabled={isLoading}
                        className="h-12 rounded-[12px] bg-white/50 backdrop-blur-sm border-zinc-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-zinc-900/10 focus-visible:border-zinc-300 px-4 text-[16px] disabled:opacity-50"
                        {...register("lastName")}
                    />
                    {errors.lastName && (
                        <p className="text-[12px] font-medium text-rose-500 mt-1">{errors.lastName.message as string}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone" className="text-zinc-700 font-semibold text-[13px]">
                    Phone Number <span className="text-rose-500">*</span>
                </Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    disabled={isLoading}
                    className="h-12 rounded-[12px] bg-white/50 backdrop-blur-sm border-zinc-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-zinc-900/10 focus-visible:border-zinc-300 px-4 text-[16px] disabled:opacity-50"
                    {...register("phone")}
                />
                {errors.phone && (
                    <p className="text-[12px] font-medium text-rose-500 mt-1">{errors.phone.message as string}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-700 font-semibold text-[13px]">
                    Email Address <span className="text-zinc-400 font-normal">(Optional)</span>
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    disabled={isLoading}
                    className="h-12 rounded-[12px] bg-white/50 backdrop-blur-sm border-zinc-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-zinc-900/10 focus-visible:border-zinc-300 px-4 text-[16px] disabled:opacity-50"
                    {...register("email")}
                />
                {errors.email && (
                    <p className="text-[12px] font-medium text-rose-500 mt-1">{errors.email.message as string}</p>
                )}
            </div>

            {/* Demographics Row - Stacks on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-zinc-700 font-semibold text-[13px]">
                        Date of Birth <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                        id="dateOfBirth"
                        type="date"
                        disabled={isLoading}
                        className="h-12 rounded-[12px] bg-white/50 backdrop-blur-sm border-zinc-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-zinc-900/10 focus-visible:border-zinc-300 px-4 text-[16px] disabled:opacity-50"
                        {...register("dateOfBirth")}
                    />
                    {errors.dateOfBirth && (
                        <p className="text-[12px] font-medium text-rose-500 mt-1">{errors.dateOfBirth.message as string}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gender" className="text-zinc-700 font-semibold text-[13px]">
                        Gender <span className="text-zinc-400 font-normal">(Optional)</span>
                    </Label>
                    <div className="relative">
                        <select
                            id="gender"
                            disabled={isLoading}
                            className="flex h-12 w-full appearance-none rounded-[12px] border border-zinc-200/60 bg-white/50 backdrop-blur-sm px-4 py-2 text-[16px] shadow-sm transition-all focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 focus-visible:border-zinc-300 disabled:opacity-50"
                            {...register("gender")}
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {/* Custom chevron for the native select to look premium */}
                        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-zinc-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address" className="text-zinc-700 font-semibold text-[13px]">
                    Address <span className="text-zinc-400 font-normal">(Optional)</span>
                </Label>
                <Input
                    id="address"
                    placeholder="City, Neighborhood, etc."
                    disabled={isLoading}
                    className="h-12 rounded-[12px] bg-white/50 backdrop-blur-sm border-zinc-200/60 focus:bg-white transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-zinc-900/10 focus-visible:border-zinc-300 px-4 text-[16px] disabled:opacity-50"
                    {...register("address")}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes" className="text-zinc-700 font-semibold text-[13px]">
                    Medical History or Notes <span className="text-zinc-400 font-normal">(Optional)</span>
                </Label>
                <textarea
                    id="notes"
                    disabled={isLoading}
                    className="flex min-h-[120px] w-full rounded-[14px] border border-zinc-200/60 bg-white/50 backdrop-blur-sm px-4 py-3 text-[16px] shadow-sm transition-all focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/10 focus-visible:border-zinc-300 placeholder:text-zinc-400 resize-none disabled:opacity-50"
                    placeholder="Any past illnesses, current medications, or specific dental concerns?"
                    {...register("notes")}
                />
            </div>

            <div className="pt-2">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-[14px] h-14 font-semibold text-[16px] bg-zinc-900 hover:bg-zinc-800 text-white shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin opacity-70" />
                            Submitting securely...
                        </>
                    ) : (
                        "Complete Registration"
                    )}
                </Button>
            </div>

            <p className="text-center text-[13px] font-medium text-zinc-500 mt-6 flex items-center justify-center gap-1.5">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Data stored securely & encrypted
            </p>
        </form>
    )
}