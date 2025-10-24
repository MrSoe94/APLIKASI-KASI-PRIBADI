import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password diperlukan' },
        { status: 400 }
      );
    }

    // Get hashed password from database
    const setting = await db.appSettings.findUnique({
      where: { key: 'app_password' }
    });

    if (!setting) {
      return NextResponse.json(
        { error: 'Password belum diatur' },
        { status: 400 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, setting.value);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Password salah' },
        { status: 401 }
      );
    }

    return NextResponse.json({ 
      message: 'Password benar',
      verified: true
    });
  } catch (error) {
    console.error('Error verifying password:', error);
    return NextResponse.json(
      { error: 'Gagal memverifikasi password' },
      { status: 500 }
    );
  }
}