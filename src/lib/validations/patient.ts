import { z } from "zod"
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js"

// Phone number validation with normalization
const phoneSchema = z.string()
    .min(10, "Phone number is required")
    .refine((val) => {
        try {
            // Try to parse as Indian number by default
            return isValidPhoneNumber(val, "IN")
        } catch {
            return false
        }
    }, "Please enter a valid phone number")
    .transform((val) => {
        try {
            // Normalize to E.164 format
            const phoneNumber = parsePhoneNumber(val, "IN")
            return phoneNumber.formatInternational().replace(/\s/g, "")
        } catch {
            // Fallback: remove non-digits
            return val.replace(/\D/g, "")
        }
    })

export const patientFormSchema = z.object({
    firstName: z.string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name is too long")
        .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters"),

    lastName: z.string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name is too long")
        .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters"),

    phone: phoneSchema,

    email: z.string()
        .email("Please enter a valid email address")
        .optional()
        .or(z.literal("")),

    dateOfBirth: z.union([z.string(), z.date()])
        .refine((val) => {
            const date = typeof val === "string" ? new Date(val) : val
            return date instanceof Date && !isNaN(date.getTime())
        }, "Please enter a valid date")
        .refine((val) => {
            const date = typeof val === "string" ? new Date(val) : val
            const now = new Date()
            const age = now.getFullYear() - date.getFullYear()
            return age >= 0 && age <= 150
        }, "Please enter a valid birth date"),

    gender: z.enum(["Male", "Female", "Other"]).optional(),

    address: z.string()
        .max(200, "Address is too long")
        .optional(),

    allergies: z.array(z.string()).optional(),

    notes: z.string()
        .max(1000, "Notes are too long")
        .optional()
        .transform((val) => val?.trim()),
})

export type PatientFormValues = z.infer<typeof patientFormSchema>
