import { NextResponse } from 'next/server';
import { db } from '@/app/admin/lib/db';
import { decrypt } from '@/app/admin/lib/captcha';

export async function GET() {
  try {
    const inquiries = await db.getInquiries();
    return NextResponse.json(inquiries);
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

    const id = body.id || `INQ-${Math.floor(100 + Math.random() * 900)}`;
    const newInquiry = {
      id,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || null,
      destinations: body.destinations,
      duration: body.duration || 'Flexible',
      travelers: parseInt(body.travelers || '1', 10),
      budget: body.budget || 'Standard',
      accommodation: body.accommodation || 'Standard',
      status: body.status || 'pending',
      notes: body.notes || null,
      createdAt: new Date().toISOString(),
    };
    await db.saveInquiry(newInquiry);
    return NextResponse.json(newInquiry);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
