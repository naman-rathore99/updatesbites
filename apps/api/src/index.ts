import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { supabaseAdmin } from '@bites/db';
import { Redis } from '@upstash/redis';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

import ordersRouter from './routes/orders';
app.use('/api/orders', ordersRouter);

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

app.get('/api/menu', async (req: Request, res: Response) => {
  try {
    const cacheKey = 'bites:menu:all';

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log("Serving from Redis Cache");
      return res.json({ success: true, data: cachedData, source: 'cache' });
    }

    const { data, error } = await supabaseAdmin
      .from('menu_items')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    const formatted = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      desc: item.description,
      img: item.image_url,
      category: item.category,
      badge: item.badge,
      rating: item.rating,
      tagline: item.tagline,
      isAvailable: true
    }));

    await redis.set(cacheKey, formatted, { ex: 3600 });
    res.json({ success: true, data: formatted, source: 'supabase' });

  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Bites of Bliss API live on http://localhost:${port}`);
});