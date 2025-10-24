import { NextRequest, NextResponse } from 'next/server';
import { readTransactions, addTransaction, filterTransactionsByMonth, filterTransactionsByDateRange, paginateTransactions } from '@/lib/json-db';
import { z } from 'zod';

const transactionSchema = z.object({
  description: z.string().min(1, 'Deskripsi harus diisi'),
  amount: z.number().min(0.01, 'Jumlah harus lebih dari 0'),
  type: z.enum(['income', 'expense']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD'),
});

// GET all transactions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const itemsPerPage = searchParams.get('itemsPerPage');
    
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
    
    // Apply pagination
    let response;
    if (itemsPerPage && itemsPerPage !== 'all' && itemsPerPage !== '0') {
      const itemsPerPageNum = parseInt(itemsPerPage);
      if (!isNaN(itemsPerPageNum) && itemsPerPageNum > 0) {
        response = paginateTransactions(transactions, page, itemsPerPageNum);
      } else {
        response = { data: transactions, pagination: null };
      }
    } else {
      response = { data: transactions, pagination: null };
    }
    
    return NextResponse.json({ 
      success: true, 
      ...response
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil transaksi' },
      { status: 500 }
    );
  }
}

// POST new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = transactionSchema.parse(body);
    
    // Add transaction
    const newTransaction = addTransaction(validatedData);
    
    return NextResponse.json({ 
      success: true, 
      data: newTransaction,
      message: 'Transaksi berhasil ditambahkan'
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Data tidak valid',
          details: error.errors
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Gagal menambahkan transaksi' },
      { status: 500 }
    );
  }
}