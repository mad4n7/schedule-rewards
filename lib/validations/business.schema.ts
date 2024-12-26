import { z } from 'zod';

const locationSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const scheduleSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  isClosed: z.boolean().default(false),
  slotDuration: z.number().min(1, 'Slot duration is required'),
  slotsPerInterval: z.number().min(1, 'Slots per interval is required'),
});

const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  duration: z.number().min(1, 'Duration is required'),
});

export const businessOnboardingBasicInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  category_id: z.string().min(1, 'Category is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required').default('US'),
});

export const businessOnboardingLocationSchema = locationSchema;
export const businessOnboardingScheduleSchema = z.array(scheduleSchema).length(7, 'Schedule for all days is required');
export const businessOnboardingServicesSchema = z.array(serviceSchema).min(1, 'At least one service is required');

export const createBusinessSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().min(1, 'Description is required'),
  category_id: z.string().min(1, 'Category is required'),
  location: locationSchema,
  schedule: z.array(scheduleSchema).length(7, 'Schedule for all days is required'),
  services: z.array(serviceSchema).min(1, 'At least one service is required'),
});

export const updateBusinessSchema = createBusinessSchema.partial();

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;
export type BusinessLocation = z.infer<typeof locationSchema>;
export type BusinessSchedule = z.infer<typeof scheduleSchema>;
export type BusinessService = z.infer<typeof serviceSchema>;

export type BusinessOnboardingBasicInfo = z.infer<typeof businessOnboardingBasicInfoSchema>;
export type BusinessOnboardingLocation = z.infer<typeof businessOnboardingLocationSchema>;
export type BusinessOnboardingSchedule = z.infer<typeof businessOnboardingScheduleSchema>;
export type BusinessOnboardingServices = z.infer<typeof businessOnboardingServicesSchema>;
