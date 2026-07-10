import { NextResponse } from 'next/server';
import { db } from '@/app/admin/lib/db';

const DEV_TOKEN = process.env.DEV_CMS_TOKEN || 'shivalay-dev-cms-2026';

function isDevRequest(request: Request): boolean {
  return request.headers.get('x-dev-token') === DEV_TOKEN;
}

export async function GET() {
  try {
    const guides = await db.getGuides();
    return NextResponse.json(guides);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isDevRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized — developer access only.' }, { status: 403 });
  }
  try {
    const body = await request.json();
    if (!body.id) {
      body.id = Date.now().toString();
    }
    await db.saveGuide(body);
    return NextResponse.json({ success: true, id: body.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
