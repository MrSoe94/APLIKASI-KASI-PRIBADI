import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    console.log('Password received:', password);
    
    return NextResponse.json({ 
      message: 'Password received',
      password: password,
      success: true
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    );
  }
}