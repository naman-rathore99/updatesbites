import { MenuItemCreate, MenuItemUpdate } from '@bites/validators/src/menu';
import { supabaseAdmin, supabaseClient } from './client';

export async function getAllMenuItems() {
  const { data, error } = await supabaseAdmin
    .from('menu_items')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: true });

  if (error) throw new Error(`Failed to fetch menu items: ${error.message}`);
  return data;
}

export async function getAllMenuItemsClient() {
  const { data, error } = await supabaseClient
    .from('menu_items')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: true });

  if (error) throw new Error(`Failed to fetch menu items client: ${error.message}`);
  return data;
}

export async function getMenuItemById(id: number) {
  const { data, error } = await supabaseAdmin
    .from('menu_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(`Menu item not found: ${error.message}`);
  return data;
}

export async function createMenuItem(item: MenuItemCreate) {
  const { data, error } = await supabaseAdmin
    .from('menu_items')
    .insert(item)
    .select()
    .single();

  if (error) throw new Error(`Failed to create menu item: ${error.message}`);
  return data;
}

export async function updateMenuItem(id: number, updates: MenuItemUpdate) {
  const { data, error } = await supabaseAdmin
    .from('menu_items')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update menu item: ${error.message}`);
  return data;
}

export async function deleteMenuItem(id: number) {
  // Soft delete — set is_active to false
  const { data, error } = await supabaseAdmin
    .from('menu_items')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to delete menu item: ${error.message}`);
  return data;
}
