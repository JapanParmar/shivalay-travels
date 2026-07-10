import { NextResponse } from 'next/server';
import { db } from '@/app/admin/lib/db';

const DEV_TOKEN = process.env.DEV_CMS_TOKEN || 'shivalay-dev-cms-2026';

function isDevRequest(request: Request): boolean {
  return request.headers.get('x-dev-token') === DEV_TOKEN;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDevRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized — developer access only.' }, { status: 403 });
  }
  try {
    const id = (await params).id;
    const body = await request.json();
    await db.saveGuide({ ...body, id });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDevRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized — developer access only.' }, { status: 403 });
  }
  try {
    const id = (await params).id;
    await db.deleteGuide(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
