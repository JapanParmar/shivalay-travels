import { NextResponse } from 'next/server';
import { db } from '@/app/admin/lib/db';

export async function GET() {
  try {
    const users = await db.getUsers();
    // Return users without password field for safety
    const safeUsers = users.map(({ password: _, ...u }: any) => u);
    return NextResponse.json(safeUsers);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || Date.now().toString();
    const newUser = {
      id,
      name: body.name,
      email: body.email,
      password: body.password || 'password123',
      role: body.role || 'agent',
      avatar: body.avatar || body.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
      status: body.status || 'active',
      lastLogin: null,
    };
    await db.saveUser(newUser);
    const { password: _, ...safeUser } = newUser;
    return NextResponse.json(safeUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
