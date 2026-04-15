import { NextRequest, NextResponse } from 'next/server';
import { getAllOrders, getOrdersByUser, createOrder } from '@bites/db';
import { createOrderSchema } from '@bites/validators';
import { auth } from '@clerk/nextjs/server';

// GET /api/orders — fetch orders (admin gets all, user gets their own)
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // For now, return all orders (admin view)
    // TODO: check role — admin gets all, customer gets own
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error('[GET /api/orders]', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/orders — place a new order (auth required)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const order = await createOrder({
      ...parsed.data,
      clerk_user_id: userId,
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/orders]', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
