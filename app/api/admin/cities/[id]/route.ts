import { NextResponse } from 'next/server';
import { db } from '@/app/admin/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await request.json();
    const existing = (await db.getCities()).find((c: any) => c.id === id);
    if (!existing) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    const updated = {
      ...existing,
      ...body,
      id,
    };

    await db.saveCity(updated);
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    await db.deleteCity(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
