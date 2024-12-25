import { z } from 'zod';

export const createAppointmentSchema = z.object({
  business_id: z.string().min(1, 'Business is required'),
  business_time_slot_id: z.string().min(1, 'Time slot is required'),
  services: z.array(z.object({
    business_service_id: z.string().min(1, 'Service is required'),
    price: z.number().min(0),
    duration: z.number().min(1),
    order: z.number().min(0),
  })),
  customer_notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  customer_notes: z.string().optional(),
  business_notes: z.string().optional(),
  cancellation_reason: z.string().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
