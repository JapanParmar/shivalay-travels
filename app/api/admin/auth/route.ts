import { NextResponse } from 'next/server';
import { db } from '@/app/admin/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const users = await db.getUsers();
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Update lastLogin
    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString()
    };
    await db.saveUser(updatedUser);

    const { password: _, ...safeUser } = updatedUser;
    return NextResponse.json(safeUser);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
