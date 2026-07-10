import { NextResponse } from 'next/server';
import { db } from '@/app/admin/lib/db';

export async function GET() {
  try {
    const packages = await db.getPackages();
    return NextResponse.json(packages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      body.id = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    await db.savePackage(body);
    return NextResponse.json({ success: true, id: body.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
