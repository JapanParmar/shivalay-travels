import { NextResponse } from 'next/server';
import { encrypt, generateCaptchaSvg } from '@/app/admin/lib/captcha';

export async function GET() {
  try {
    const pool = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let captchaText = '';
    for (let i = 0; i < 5; i++) {
      captchaText += pool.charAt(Math.floor(Math.random() * pool.length));
    }

    const svg = generateCaptchaSvg(captchaText);
    const token = encrypt(captchaText);

    return NextResponse.json({ svg, token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
