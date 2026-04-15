-- ============================================
-- Bites of Bliss — REAL MENU from Zomato/Swiggy
-- Run this in your Supabase SQL Editor
-- This will REPLACE all existing items
-- ============================================

-- Step 1: Clear all existing menu items
DELETE FROM menu_items;

-- Step 2: Reset the ID sequence
ALTER SEQUENCE menu_items_id_seq RESTART WITH 1;

-- Step 3: Update the category constraint to support all real categories
ALTER TABLE menu_items DROP CONSTRAINT IF EXISTS menu_items_category_check;
ALTER TABLE menu_items ADD CONSTRAINT menu_items_category_check 
  CHECK (category IN ('recommended','fried-rice-noodles','sandwiches','snacks','maggi','breads','healthy-breakfast','vrat-special','diet-dial','rice','south-indian','burgers','bhajiye'));

-- Step 4: Insert ALL real menu items from Swiggy/Zomato

-- ═══ RECOMMENDED ═══
INSERT INTO menu_items (title, price, description, image_url, category, badge, rating, reviews, tagline) VALUES
('Aloo Paratha', 119, 'Stuffed with spiced mashed potatoes, served with curd and pickle.', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&q=80', 'recommended', 'Bestseller', 4.5, 0, 'Comfort Food'),
('Butter Jeera Rice', 69, 'Fragrant basmati rice tempered with cumin seeds and butter.', 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&q=80', 'recommended', NULL, 4.5, 0, 'Light & Quick');

-- ═══ FRIED RICE & NOODLES ═══
INSERT INTO menu_items (title, price, description, image_url, category, badge, rating, reviews, tagline) VALUES
('Fried Rice', 169, 'Wok-tossed fluffy rice with fresh carrots, beans, peas, and soy sauce, finished with spring onions for a classic savory bite.', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80', 'fried-rice-noodles', NULL, 4.5, 0, 'Wok Tossed'),
('Noodles', 189, 'Classic stir-fried noodles with fresh vegetables and aromatic seasonings.', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80', 'fried-rice-noodles', NULL, 4.5, 0, 'Street Style'),
('Paneer Fried Rice', 249, 'Fiery garlic, chili flakes, and crisp veggies tossed with soft paneer and rice – a flavorful kick in every bite.', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&q=80', 'fried-rice-noodles', NULL, 4.5, 0, 'Spicy Kick'),
('Hakka Noodles', 149, 'Perfectly boiled noodles wok-tossed with crisp carrots, cabbage, bell peppers and spring onions in a zesty sauce of soy, vinegar and garlic.', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&q=80', 'fried-rice-noodles', NULL, 4.5, 0, 'Street Favorite'),
('Paneer Noodles', 225, 'Juicy paneer and noodles with a smoky spice blend, herbs, and fresh veggies for a street-style kick.', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80', 'fried-rice-noodles', NULL, 4.5, 0, 'Smoky & Bold');

-- ═══ SANDWICHES ═══
INSERT INTO menu_items (title, price, description, image_url, category, badge, rating, reviews, tagline) VALUES
('Masala Sandwich', 99, 'Toasted sandwich filled with spiced veggies and tangy chutneys.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80', 'sandwiches', NULL, 3.5, 3, 'Classic'),
('Vegetable Sandwich', 129, 'Fresh vegetables layered with cheese and herbs in toasted bread.', 'https://images.unsplash.com/photo-1554433607-66b5a6df5c29?w=800&q=80', 'sandwiches', NULL, 4.5, 0, 'Fresh & Healthy'),
('Paneer Sandwich', 145, 'Grilled paneer slices with veggies and special sauce in toasted bread.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80', 'sandwiches', 'Bestseller', 4.3, 3, 'Must Try'),
('Special Extra Cheese Sandwich', 111, 'Loaded with extra cheese and fresh veggies for the ultimate cheese lover.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80', 'sandwiches', NULL, 4.5, 0, 'Cheesy'),
('Angara Paneer Sandwich', 189, 'Spicy angara paneer filling with fresh veggies in grilled bread.', 'https://images.unsplash.com/photo-1554433607-66b5a6df5c29?w=800&q=80', 'sandwiches', NULL, 4.5, 0, 'Fiery'),
('Masala Cheese Sandwich', 169, 'Spicy toast filled with masala veggies and topped with the goodness of grated cheese.', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80', 'sandwiches', NULL, 4.5, 0, 'Spicy Cheesy');

-- ═══ SNACKS ═══
INSERT INTO menu_items (title, price, description, image_url, category, badge, rating, reviews, tagline) VALUES
('Sabudana Tikki (4 Pcs)', 199, 'Crispy sabudana tikkis served golden and crunchy with tangy chutney.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'snacks', NULL, 4.2, 3, 'Crispy'),
('Sabudana Khichdi', 149, 'Classic fasting-friendly dish with sago pearls, peanuts, and mild spices.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'snacks', 'Bestseller', 4.2, 3, 'Vrat Friendly'),
('Cheese Potato Ball (8 Pcs)', 179, 'Too yummy and too crispy – golden cheese potato balls.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'snacks', NULL, 4.5, 0, 'Crunchy'),
('Farali Aloo Tadka Vrat Special', 149, 'Delicious aloo tadka for fasting – try this wholesome vrat-friendly dish.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'snacks', 'Bestseller', 4.5, 0, 'Vrat Special'),
('French Fries', 99, 'Classic golden crispy french fries, perfectly salted.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80', 'snacks', 'Bestseller', 4.5, 0, 'Classic'),
('Peri Peri French Fries', 129, 'French fries tossed in a spicy peri peri seasoning.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80', 'snacks', NULL, 4.5, 0, 'Spicy');

-- ═══ MAGGI ═══
INSERT INTO menu_items (title, price, description, image_url, category, badge, rating, reviews, tagline) VALUES
('Vegetable Maggi', 120, 'Classic Maggi noodles loaded with fresh vegetables.', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&q=80', 'maggi', NULL, 4.5, 0, 'Comfort Food'),
('Cheesy Maggi', 150, 'Maggi noodles smothered in melted cheese — ultimate comfort food.', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&q=80', 'maggi', NULL, 4.5, 0, 'Cheesy'),
('Corn Maggi', 99, 'Your favorite instant noodles elevated with pops of sweet corn, perfectly spiced with tangy masala for authentic street food taste.', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=800&q=80', 'maggi', NULL, 4.5, 0, 'Street Style'),
('Sev Tamatar', 249, 'Sev tamatar served with 4 roti or 3 paratha, salad, papad, and achar.', 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&q=80', 'maggi', NULL, 4.5, 0, 'Full Meal');

-- ═══ BREADS ═══
INSERT INTO menu_items (title, price, description, image_url, category, badge, rating, reviews, tagline) VALUES
('Paneer Paratha (2 Pcs)', 225, 'Stuffed parathas with seasoned paneer filling.', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&q=80', 'breads', NULL, 4.5, 0, 'Hearty'),
('Cheese Paratha (2 Pcs)', 229, 'Cheesy stuffed parathas, crispy outside and gooey inside.', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&q=80', 'breads', NULL, 4.5, 0, 'Cheesy'),
('5 Sade Parathas', 145, 'Five plain parathas served fresh from the tawa.', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&q=80', 'breads', NULL, 4.5, 0, 'Simple'),
('Ajwain Puri (10 Pcs)', 199, 'Crispy puris infused with aromatic ajwain seeds.', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&q=80', 'breads', NULL, 4.5, 0, 'Crispy'),
('Jowar Roti (1 Pc)', 45, 'Single healthy jowar roti, perfect for a balanced meal.', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&q=80', 'breads', NULL, 4.5, 0, 'Healthy'),
('10 Sadi Tawa Roti', 169, 'Ten fresh tawa rotis for the whole family.', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&q=80', 'breads', NULL, 4.5, 0, 'Family Pack');

-- ═══ HEALTHY BREAKFAST ═══
INSERT INTO menu_items (title, price, description, image_url, category, badge, rating, reviews, tagline) VALUES
('Masala Oats with Veggies', 145, 'Loaded with lots of veggies — a healthy and filling breakfast.', 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&q=80', 'healthy-breakfast', NULL, 4.5, 0, 'Nutritious'),
('Vegetables Poha', 99, 'Fully veggie loaded vegetable poha — light and flavorful.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'healthy-breakfast', NULL, 4.5, 0, 'Light'),
('Indori Poha', 49, 'Unique blend of sweet, sour, and spicy flavors with signature Jeeravan masala and crunchy sev.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'healthy-breakfast', NULL, 4.3, 3, 'Indori Special'),
('Besan Chilla with Veggies', 99, 'Delicious and healthy savory Indian pancake made with gram flour, onions, tomatoes, fragrant spices and herbs.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'healthy-breakfast', NULL, 4.5, 0, 'Protein Rich'),
('Vermicelli Upma (500g)', 199, 'A nutritious and flavorful way to start your day — hearty and wholesome breakfast.', 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&q=80', 'healthy-breakfast', NULL, 3.5, 12, 'Wholesome');

-- ═══ VRAT SPECIAL ═══
INSERT INTO menu_items (title, price, description, image_url, category, badge, rating, reviews, tagline) VALUES
('Sabudana Vada', 249, '6 sabudana vade served with thiki mirchi — crispy fasting snack.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'vrat-special', 'Bestseller', 4.5, 0, 'Fasting Favorite'),
('Singhada Ke Bhajiya', 199, 'Crispy and full of nutrients, served with green dhania pudina chutney.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'vrat-special', NULL, 4.5, 0, 'Nutrient Rich'),
('Singhada Ki Puri', 299, 'Singhade ki puri (4) with farali aloo, farali mirchi and fried mirchi.', 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=800&q=80', 'vrat-special', NULL, 4.5, 0, 'Full Vrat Meal'),
('Sabudana French Fries', 249, 'Crispy and delicious sabudana fries, perfect for vrat.', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80', 'vrat-special', NULL, 4.5, 0, 'Unique'),
('Mordhan (Samak Rice)', 189, 'Really delicious and tempting fasting dish — makes your vrat easy.', 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&q=80', 'vrat-special', NULL, 4.5, 0, 'Filling'),
('Sabudana Papad Fried (5 Pcs)', 199, 'Crispy fried sabudana papad — light and crunchy vrat snack.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'vrat-special', 'Bestseller', 4.5, 0, 'Crunchy'),
('Sabudana Pakoda', 129, 'Deep-fried to perfection for that perfect crunch. A light, flavorful vrat-friendly snack with special chutney.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'vrat-special', 'Bestseller', 4.5, 0, 'Must Try'),
('Farali Aloo Tadka', 149, 'With peanut — delicious aloo farali, 100% for vrat people.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'vrat-special', NULL, 4.5, 0, 'Pure Vrat');

-- ═══ DIET DIAL ═══
INSERT INTO menu_items (title, price, description, image_url, category, badge, rating, reviews, tagline) VALUES
('Moong Sprouts', 245, 'A refreshing and nutritious option packed with a burst of flavors and wholesome goodness.', 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&q=80', 'diet-dial', NULL, 4.5, 0, 'High Protein'),
('Moong Dal Daliya', 199, 'Wholesome moong dal daliya — a nutritious comfort food.', 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&q=80', 'diet-dial', NULL, 4.5, 0, 'Nutritious'),
('Moong Dal Idli (8 Pcs)', 245, 'Moong dal idli served with sambhar, sauce, and salad.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80', 'diet-dial', NULL, 4.5, 0, 'Protein Packed'),
('Moong Dal Chilla (2 Pcs)', 149, 'Savory moong dal pancakes served with sauce and chutney.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'diet-dial', NULL, 4.5, 0, 'Light'),
('Moong Dal Appe (10 Pcs)', 295, 'Round crispy moong dal appe — healthy and delicious.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'diet-dial', NULL, 2.2, 3, 'Healthy'),
('Paneer Tikka', 349, 'A delightful and flavorful vegetarian dish, perfect for a healthy and balanced diet.', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80', 'diet-dial', NULL, 4.5, 0, 'Premium'),
('Butter Khichdi', 189, 'Comforting butter khichdi — simple, wholesome, and satisfying.', 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&q=80', 'diet-dial', NULL, 4.5, 3, 'Comfort Food'),
('Mushroom Tikka', 399, 'Grilled mushroom tikka with aromatic spices and herbs.', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&q=80', 'diet-dial', NULL, 4.5, 0, 'Gourmet'),
('Tofu Fried Rice', 299, 'Tender grains, perfectly sauteed vegetables, and seasoned tofu for a satisfying wholesome meal.', 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80', 'diet-dial', NULL, 4.5, 0, 'Plant Based'),
('Moong Dal Khichdi', 169, 'Comforting and nourishing Indian dish with lentils and rice — perfect for a light and healthy meal.', 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&q=80', 'diet-dial', 'Bestseller', 4.5, 0, 'Wholesome'),
('Tofu Stir Fry', 229, 'Colorful medley of crisp vegetables and tender tofu, lightly tossed in a savory sauce.', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', 'diet-dial', NULL, 4.5, 0, 'Plant Based');

-- ═══ RICE ═══
INSERT INTO menu_items (title, price, description, image_url, category, badge, rating, reviews, tagline) VALUES
('Jeera Rice', 199, 'Fragrant basmati rice tempered with whole cumin seeds.', 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&q=80', 'rice', NULL, 4.5, 0, 'Aromatic'),
('Plain Rice', 55, 'Simple steamed basmati rice.', 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&q=80', 'rice', NULL, 4.5, 0, 'Simple'),
('Veg Pulao', 199, 'Aromatic rice cooked with seasonal vegetables and whole spices.', 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&q=80', 'rice', NULL, 4.5, 0, 'Fragrant');

-- ═══ SOUTH INDIAN ═══
INSERT INTO menu_items (title, price, description, image_url, category, badge, rating, reviews, tagline) VALUES
('Mix Vegetables Appe (10 Pcs)', 199, 'Crispy round appe with mixed vegetables — healthy South Indian snack.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80', 'south-indian', 'Bestseller', 4.5, 0, 'Healthy Snack'),
('Idli (12 Pcs)', 199, '12 rava idlis served with green chutney — soft and fluffy.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80', 'south-indian', NULL, 4.5, 0, 'Classic'),
('Mix Veggies Uttapam (2 Pcs)', 225, 'Thick South Indian pancakes topped with mixed vegetables.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80', 'south-indian', NULL, 4.5, 0, 'Filling'),
('Onion Uttapam (2 Pcs)', 149, 'Crispy uttapam topped with sliced onions and spices.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&q=80', 'south-indian', NULL, 4.5, 0, 'Crispy');

-- ═══ BURGERS ═══
INSERT INTO menu_items (title, price, description, image_url, category, badge, rating, reviews, tagline) VALUES
('Aloo Tikki Burger', 149, 'Classic aloo tikki patty in a soft bun with fresh veggies and sauces.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', 'burgers', NULL, 4.5, 0, 'Classic'),
('Corn Aloo Tikki Burger', 169, 'Crispy corn and potato tikki burger with fresh toppings.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', 'burgers', NULL, 4.5, 0, 'Crunchy');

-- ═══ BHAJIYE ═══
INSERT INTO menu_items (title, price, description, image_url, category, badge, rating, reviews, tagline) VALUES
('Pyaz Ke Bhajiya', 79, 'Crispy onion bhajiya — try with sauce for the best experience.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'bhajiye', NULL, 4.5, 0, 'Crispy'),
('Aloo Ke Pakoda', 69, 'Golden fried aloo pakoda — classic monsoon snack.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'bhajiye', NULL, 4.5, 0, 'Traditional'),
('Mix Veg Ke Bhajiya', 99, 'Assorted vegetable bhajiya, deep fried to perfection.', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80', 'bhajiye', NULL, 4.5, 0, 'Assorted');
