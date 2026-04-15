import { z } from 'zod';

// ─── Order Item (stored as JSONB in the order) ─────────────────

export const orderItemSchema = z.object({
  productId: z.number(),
  title: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
  img: z.string().optional(),
});

// ─── Create Order ──────────────────────────────────────────────

export const createOrderSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required'),
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  subtotal: z.number().int().positive(),
  delivery_fee: z.number().int().min(0).default(40),
  gst: z.number().int().min(0),
  total: z.number().int().positive(),
  delivery_address: z.string().min(1, 'Address is required'),
  delivery_note: z.string().optional().default(''),
});

// ─── Update Order Status ───────────────────────────────────────

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'preparing', 'ready', 'delivered', 'cancelled']),
});

// ─── Response ──────────────────────────────────────────────────

export const orderResponseSchema = createOrderSchema.extend({
  id: z.number(),
  clerk_user_id: z.string(),
  status: z.enum(['pending', 'preparing', 'ready', 'delivered', 'cancelled']),
  created_at: z.string(),
  updated_at: z.string(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
export type CreateOrder = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatus = z.infer<typeof updateOrderStatusSchema>;
export type OrderResponse = z.infer<typeof orderResponseSchema>;
