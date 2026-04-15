import { supabaseAdmin } from './client';
import type { CreateOrder } from '@bites/validators';

export async function getAllOrders() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch orders: ${error.message}`);
  return data;
}

export async function getOrdersByUser(clerkUserId: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch user orders: ${error.message}`);
  return data;
}

export async function getOrderById(id: number) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Order not found: ${error.message}`);
  return data;
}

export async function createOrder(order: CreateOrder & { clerk_user_id: string }) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert({
      ...order,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create order: ${error.message}`);
  return data;
}

export async function updateOrderStatus(id: number, status: string) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update order status: ${error.message}`);
  return data;
}
