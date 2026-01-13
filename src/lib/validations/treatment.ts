import { z } from "zod"

export const treatmentFormSchema = z.object({
    code: z.string()
        .max(20, "Code is too long")
        .optional()
        .transform((val) => val?.trim()),

    name: z.string()
        .min(2, "Treatment name must be at least 2 characters")
        .max(100, "Treatment name is too long")
        .transform((val) => val.trim()),

    description: z.string()
        .max(500, "Description is too long")
        .optional()
        .transform((val) => val?.trim()),

    standardCost: z.union([z.string(), z.number()])
        .refine((val) => {
            const num = typeof val === "string" ? parseFloat(val) : val
            return !isNaN(num) && num >= 0
        }, "Please enter a valid cost")
        .transform((val) => {
            return typeof val === "string" ? parseFloat(val) : val
        }),

    category: z.string()
        .min(2, "Category is required")
        .max(50, "Category name is too long"),

    duration: z.number()
        .min(5, "Duration must be at least 5 minutes")
        .max(480, "Duration cannot exceed 8 hours")
        .optional(),

    isActive: z.boolean().default(true),
})

export type TreatmentFormValues = z.infer<typeof treatmentFormSchema>
