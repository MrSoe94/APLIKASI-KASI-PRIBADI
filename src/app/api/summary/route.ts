import { NextRequest, NextResponse } from 'next/server';
import { calculateFinancialSummary, filterTransactionsByMonth, filterTransactionsByDateRange, calculateFilteredSummary, readTransactions } from '@/lib/json-db';

// GET financial summary
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let summary;
    
    // Apply month filter if provided
    if (year && month) {
      const yearNum = parseInt(year);
      const monthNum = parseInt(month);
      
      if (!isNaN(yearNum) && !isNaN(monthNum)) {
        const allTransactions = readTransactions();
        const filteredTransactions = filterTransactionsByMonth(allTransactions, yearNum, monthNum);
        summary = calculateFilteredSummary(filteredTransactions);
      } else {
        summary = calculateFinancialSummary();
      }
    }
    // Apply date range filter if provided
    else if (startDate && endDate) {
      const allTransactions = readTransactions();
      const filteredTransactions = filterTransactionsByDateRange(allTransactions, startDate, endDate);
      summary = calculateFilteredSummary(filteredTransactions);
    }
    else {
      summary = calculateFinancialSummary();
    }
    
    return NextResponse.json({ 
      success: true, 
      data: summary 
    });
  } catch (error) {
    console.error('Error calculating summary:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menghitung ringkasan keuangan' },
      { status: 500 }
    );
  }
}