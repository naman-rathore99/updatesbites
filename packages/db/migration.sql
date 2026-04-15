-- ============================================
-- Bites of Bliss — Database Schema
-- Run this in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================

-- 1. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bowls', 'burgers', 'desserts')),
  badge TEXT,
  calories INTEGER,
  protein TEXT,
  carbs TEXT,
  rating NUMERIC(2,1) DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  tagline TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  clerk_user_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER DEFAULT 40,
  gst INTEGER NOT NULL,
  total INTEGER NOT NULL,
  delivery_address TEXT,
  delivery_note TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','preparing','ready','delivered','cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Seed Menu Items (your default catalog)
INSERT INTO menu_items (title, price, description, image_url, category, badge, calories, protein, carbs, rating, reviews, tagline) VALUES
  ('Wild Tuna Bowl', 599, 'Fresh pacific tuna, ginger soy, jasmine rice, and crisp organic vegetables.', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'bowls', 'Popular', 540, '34g', '18g', 4.9, 230, 'Sustainably Sourced'),
  ('Harvest Grain', 499, 'Roasted seasonal squash, ancient grains, kale, and a tahini lemon dressing.', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'bowls', NULL, 420, '18g', '45g', 4.7, 142, 'Farm Fresh'),
  ('Zen Med Bowl', 549, 'Quinoa, charred heirloom tomatoes, cucumber, feta, and house-made hummus.', 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'bowls', NULL, 380, '22g', '32g', 4.8, 187, 'Mediterranean Inspired'),
  ('The Truffle Brie', 749, 'A5 Wagyu blend, double cream brie, balsamic reduction, and fresh black truffle shavings.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'burgers', 'Chef''s Choice', 720, '42g', '38g', 4.9, 312, 'Premium Cut'),
  ('Smokestack', 599, 'Aged cheddar, crispy shallots, house bourbon BBQ sauce, and pickled jalapeños.', 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'burgers', NULL, 680, '38g', '42g', 4.6, 198, 'Slow Smoked'),
  ('Berry Cloud', 379, 'Whipped mascarpone mousse with seasonal berries and pistachio praline.', 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'desserts', NULL, 320, '6g', '28g', 4.8, 156, 'Light & Airy'),
  ('Midnight Ganache', 449, 'Dark Belgian chocolate ganache, salted caramel core, and gold leaf.', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'desserts', NULL, 480, '8g', '52g', 4.7, 203, 'Indulgent'),
  ('Zesty Gold Tart', 399, 'Meyer lemon curd, toasted meringue, and buttery shortcrust with edible flowers.', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'desserts', NULL, 290, '4g', '34g', 4.5, 98, 'Citrus Kiss');

-- 4. Disable RLS for these tables (using service role key in API)
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (our API uses service role key)
CREATE POLICY "Service role full access on menu_items" ON menu_items
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on orders" ON orders
  FOR ALL USING (true) WITH CHECK (true);
