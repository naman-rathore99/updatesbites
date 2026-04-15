import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@bites/db';
import { updateOrderStatusSchema } from '@bites/validators';
import { auth } from '@clerk/nextjs/server';

// GET /api/orders/[id] — fetch a single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const order = await getOrderById(id);
    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error(`[GET /api/orders/${idStr}]`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 404 }
    );
  }
}

// PUT /api/orders/[id] — update order status (admin action)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const order = await updateOrderStatus(id, parsed.data.status);
    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    console.error(`[PUT /api/orders/${idStr}]`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
