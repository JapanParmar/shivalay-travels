import { NextResponse } from 'next/server';
import { db } from '@/app/admin/lib/db';

export async function GET() {
  try {
    const cities = await db.getCities();
    return NextResponse.json(cities);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || Date.now().toString();
    const newCity = {
      id,
      name: body.name,
      code: body.code.toUpperCase(),
      state: body.state,
      country: body.country || 'India',
      type: body.type || 'airport',
      isPopular: body.isPopular ? 1 : 0,
    };
    await db.saveCity(newCity);
    return NextResponse.json(newCity);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
