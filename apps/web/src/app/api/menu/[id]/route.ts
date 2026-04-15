import { NextRequest, NextResponse } from 'next/server';
import { getMenuItemById, updateMenuItem, deleteMenuItem } from '@bites/db';
import { menuItemUpdateSchema } from '@bites/validators';
import { auth } from '@clerk/nextjs/server';

// GET /api/menu/[id] — fetch single menu item (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  try {
    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const item = await getMenuItemById(id);
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error(`[GET /api/menu/${idStr}]`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 404 }
    );
  }
}

// PUT /api/menu/[id] — update menu item (auth required)
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
    const parsed = menuItemUpdateSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const item = await updateMenuItem(id, parsed.data);
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error(`[PUT /api/menu/${idStr}]`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/menu/[id] — soft-delete menu item (auth required)
export async function DELETE(
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

    const item = await deleteMenuItem(id);
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error(`[DELETE /api/menu/${idStr}]`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
