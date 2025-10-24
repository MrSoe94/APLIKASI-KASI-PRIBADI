import { NextRequest, NextResponse } from 'next/server';
import { updateTransaction, deleteTransaction, getTransactionById } from '@/lib/json-db';
import { z } from 'zod';

const updateTransactionSchema = z.object({
  description: z.string().min(1, 'Deskripsi harus diisi').optional(),
  amount: z.number().min(0.01, 'Jumlah harus lebih dari 0').optional(),
  type: z.enum(['income', 'expense']).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD').optional(),
});

// GET single transaction
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transaction = getTransactionById(params.id);
    
    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaksi tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: transaction 
    });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil transaksi' },
      { status: 500 }
    );
  }
}

// PUT update transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = updateTransactionSchema.parse(body);
    
    // Update transaction
    const updatedTransaction = updateTransaction(params.id, validatedData);
    
    if (!updatedTransaction) {
      return NextResponse.json(
        { success: false, error: 'Transaksi tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: updatedTransaction,
      message: 'Transaksi berhasil diperbarui'
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    
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
      { success: false, error: 'Gagal memperbarui transaksi' },
      { status: 500 }
    );
  }
}

// DELETE transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = deleteTransaction(params.id);
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Transaksi tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Transaksi berhasil dihapus' 
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus transaksi' },
      { status: 500 }
    );
  }
}