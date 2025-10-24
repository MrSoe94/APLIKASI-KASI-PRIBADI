import { NextResponse } from 'next/server';
import { getAvailableMonths } from '@/lib/json-db';

// GET available months and years
export async function GET() {
  try {
    const months = getAvailableMonths();
    return NextResponse.json({ 
      success: true, 
      data: months 
    });
  } catch (error) {
    console.error('Error fetching available months:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil bulan yang tersedia' },
      { status: 500 }
    );
  }
}