import { z } from 'zod';

// ─── Menu Item Schemas ─────────────────────────────────────────

export const menuItemCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  price: z.number().positive('Price must be positive'),
  description: z.string().min(1, 'Description is required').max(500),
  image_url: z.string().url('Must be a valid URL'),
  category: z.string().min(1, 'Category is required'),
  badge: z.string().max(30).optional().nullable(),
  calories: z.number().int().positive().optional().nullable(),
  protein: z.string().max(10).optional().nullable(),
  carbs: z.string().max(10).optional().nullable(),
  rating: z.number().min(0).max(5).optional().default(4.5),
  reviews: z.number().int().min(0).optional().default(0),
  tagline: z.string().max(50).optional().nullable(),
  is_active: z.boolean().optional().default(true),
});

export const menuItemUpdateSchema = menuItemCreateSchema.partial();

export const menuItemResponseSchema = menuItemCreateSchema.extend({
  id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type MenuItemCreate = z.infer<typeof menuItemCreateSchema>;
export type MenuItemUpdate = z.infer<typeof menuItemUpdateSchema>;
export type MenuItemResponse = z.infer<typeof menuItemResponseSchema>;
