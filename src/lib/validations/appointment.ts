import { z } from 'zod'

export const appointmentFormSchema = z.object({
    patientId: z.string().min(1, 'Patient is required'),
    doctorId: z.string().optional(),
    scheduledAt: z.coerce.date({ message: 'Appointment date is required' }),
    duration: z.number().min(15).max(240).default(30),
    type: z.enum(['CHECKUP', 'TREATMENT', 'EMERGENCY', 'FOLLOW_UP', 'CONSULTATION']),
    chiefComplaint: z.string().max(500).optional(),
    notes: z.string().max(1000).optional(),
})

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>

export const appointmentStatusSchema = z.enum([
    'SCHEDULED',
    'CONFIRMED',
    'SEATED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW',
])

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>

export const updateAppointmentStatusSchema = z.object({
    id: z.string().uuid(),
    status: appointmentStatusSchema,
})

export type UpdateAppointmentStatusParams = z.infer<typeof updateAppointmentStatusSchema>
