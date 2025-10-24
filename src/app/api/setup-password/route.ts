import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password harus memiliki minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save to database
    await db.appSettings.upsert({
      where: { key: 'app_password' },
      update: { value: hashedPassword },
      create: {
        key: 'app_password',
        value: hashedPassword
      }
    });

    return NextResponse.json({ 
      message: 'Password berhasil disimpan' 
    });
  } catch (error) {
    console.error('Error setting password:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan password' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check if password exists
    const setting = await db.appSettings.findUnique({
      where: { key: 'app_password' }
    });

    return NextResponse.json({ 
      hasPassword: !!setting 
    });
  } catch (error) {
    console.error('Error checking password:', error);
    return NextResponse.json(
      { error: 'Gagal memeriksa password' },
      { status: 500 }
    );
  }
}