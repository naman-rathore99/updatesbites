import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../apps/api/.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function cleanupImages() {
  console.log('Cleaning up images for specific categories...');
  
  // Categories that often don't need images locally or are better off as text-only
  const noImageCategories = ['breads', 'rice', 'bhajiye', 'maggi'];
  
  for (const cat of noImageCategories) {
    const { error } = await supabase
      .from('menu_items')
      .update({ image_url: '' })
      .eq('category', cat);
      
    if (error) {
      console.error(`Failed to clear images for ${cat}:`, error);
    } else {
      console.log(`✅ Cleared placeholder images for category: ${cat}`);
    }
  }
  
  console.log('Done!');
}

cleanupImages();
