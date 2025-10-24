import { NextRequest, NextResponse } from 'next/server';
import { readTransactions, filterTransactionsByMonth, filterTransactionsByDateRange } from '@/lib/json-db';

// GET transactions for export (without pagination)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let transactions = readTransactions();
    
    // Apply month filter if provided
    if (year && month) {
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      
      if (!isNaN(yearNum) && !isNaN(monthNum)) {
        transactions = filterTransactionsByMonth(transactions, yearNum, monthNum);
      }
    }
    // Apply date range filter if provided
    else if (startDate && endDate) {
      transactions = filterTransactionsByDateRange(transactions, startDate, endDate);
    }
    
    // Sort transactions by date (newest first) for better export readability
    transactions.sort((a, b) => {
      const dateA = a.date || new Date(a.timestamp).toISOString().split('T')[0];
      const dateB = b.date || new Date(b.timestamp).toISOString().split('T')[0];
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    
    return NextResponse.json({ 
      success: true, 
      data: transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error('Error fetching export data:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data untuk ekspor' },
      { status: 500 }
    );
  }
}