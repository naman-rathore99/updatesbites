import { Router, Request, Response } from 'express';
import { createOrderSchema, updateOrderStatusSchema } from '@bites/validators';
import { getAllOrders, getOrdersByUser, getOrderById, createOrder, updateOrderStatus } from '@bites/db/src/orders';

const router: Router = Router();

// ─── GET ALL ORDERS (Admin) ──────────────────────────────────
router.get('/', async (req: Request, res: Response) => {
  try {
    // In production, we'd verify the user is an admin here
    const orders = await getAllOrders();
    res.json({ success: true, data: orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── GET ORDERS BY USER ────────────────────────────────────────
router.get('/user/:clerkUserId', async (req: Request, res: Response) => {
  try {
    const { clerkUserId } = req.params;
    const orders = await getOrdersByUser(clerkUserId);
    res.json({ success: true, data: orders });
  } catch (error: any) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── GET ORDER BY ID ───────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });
    
    const order = await getOrderById(id);
    res.json({ success: true, data: order });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    res.status(404).json({ success: false, error: error.message });
  }
});

// ─── CREATE ORDER ──────────────────────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  try {
    // 1. Validate payload
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.format() });
    }

    // 2. Extract clerk_user_id (from headers for now)
    const clerkUserId = req.headers['x-clerk-user-id'] as string;
    if (!clerkUserId) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Missing x-clerk-user-id header' });
    }

    // 3. Create the order in DB
    const newOrder = await createOrder({ ...parsed.data, clerk_user_id: clerkUserId });
    
    res.status(201).json({ success: true, data: newOrder });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── UPDATE ORDER STATUS ───────────────────────────────────────
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid ID' });

    // Validate status string
    const parsed = updateOrderStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: parsed.error.format() });
    }

    const updated = await updateOrderStatus(id, parsed.data.status);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
