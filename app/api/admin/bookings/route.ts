import { NextResponse } from 'next/server';
import { db } from '@/app/admin/lib/db';
import { decrypt } from '@/app/admin/lib/captcha';

export async function GET() {
  try {
    const bookings = await db.getBookings();
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Captcha validation for public form queries
    if (body.isPublicInquiry) {
      if (!body.captchaToken || !body.captchaInput) {
        return NextResponse.json({ error: 'CAPTCHA code verification is required.' }, { status: 400 });
      }
      const decrypted = decrypt(body.captchaToken);
      if (!decrypted || decrypted.toUpperCase() !== (body.captchaInput || '').trim().toUpperCase()) {
        return NextResponse.json({ error: 'Invalid CAPTCHA code. Please check and try again.' }, { status: 400 });
      }
    }

    const id = body.id || `SHV-${Math.floor(100 + Math.random() * 900)}`;
    const newBooking = {
      id,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || null,
      fromCity: body.from || body.fromCity,
      toCity: body.to || body.toCity,
      travelType: body.travelType,
      date: body.date,
      returnDate: body.returnDate || null,
      passengers: parseInt(body.passengers || '1', 10),
      classType: body.classType,
      status: body.status || 'pending',
      amount: parseFloat(body.amount || '0'),
      agentId: body.agentId || null,
      createdAt: new Date().toISOString(),
      notes: body.notes || null,
    };
    await db.saveBooking(newBooking);
    return NextResponse.json(newBooking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
