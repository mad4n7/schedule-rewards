import { z } from 'zod';

export const createBusinessSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().min(1, 'Description is required'),
  category_id: z.string().min(1, 'Category is required'),
  location_id: z.string().min(1, 'Location is required'),
});

export const updateBusinessSchema = createBusinessSchema.partial();

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;
