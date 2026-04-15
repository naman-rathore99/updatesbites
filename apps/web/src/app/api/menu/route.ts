import { NextRequest, NextResponse } from 'next/server';
import { getAllMenuItems, createMenuItem } from '@bites/db';
import { menuItemCreateSchema } from '@bites/validators';
import { auth } from '@clerk/nextjs/server';

// GET /api/menu — fetch all active menu items (public)
export async function GET() {
  try {
    const items = await getAllMenuItems();
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    console.error('[GET /api/menu]', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/menu — create a new menu item (auth required)
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
    const parsed = menuItemCreateSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const item = await createMenuItem(parsed.data);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    console.error('[POST /api/menu]', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
