const express = require('express');
const { getPrismaClient } = require('../database/db');
const XLSX = require('xlsx');
const router = express.Router();

// GET export data as Excel
router.get('/excel', async (req, res) => {
  try {
    const prisma = getPrismaClient();
    
    // Apply filters if provided
    const { month, startDate, endDate, search, type } = req.query;
    const where = {};
    
    if (month) {
      where.date = { startsWith: month };
    }
    
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    } else if (startDate) {
      where.date = { gte: startDate };
    } else if (endDate) {
      where.date = { lte: endDate };
    }
    
    if (search) {
      where.description = { contains: search };
    }
    
    if (type && type !== '') {
      where.type = type;
    }
    
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' }
    });
    
    // Prepare data for Excel
    const data = transactions.map(t => ({
      Tanggal: t.date,
      Deskripsi: t.description,
      Jumlah: t.amount,
      Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      'Tanggal Dibuat': new Date(t.createdAt).toLocaleString('id-ID')
    }));
    
    // Create workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transaksi');
    
    // Generate buffer
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    // Set headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=keuangan-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    res.send(buf);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// GET export data as PDF
router.get('/pdf', async (req, res) => {
  try {
    const prisma = getPrismaClient();
    
    // Apply filters if provided
    const { month, startDate, endDate, search, type } = req.query;
    const where = {};
    
    if (month) {
      where.date = { startsWith: month };
    }
    
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    } else if (startDate) {
      where.date = { gte: startDate };
    } else if (endDate) {
      where.date = { lte: endDate };
    }
    
    if (search) {
      where.description = { contains: search };
    }
    
    if (type && type !== '') {
      where.type = type;
    }
    
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' }
    });
    
    // Calculate summary
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;
    
    // Generate PDF content as HTML
    const htmlContent = generatePDFHTML(transactions, { income, expenses, balance });
    
    // Set headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=keuangan-${new Date().toISOString().split('T')[0]}.pdf`);
    
    // For now, return HTML that can be converted to PDF on client side
    // In production, you might want to use a proper PDF generation library
    res.json({
      html: htmlContent,
      summary: { income, expenses, balance, totalTransactions: transactions.length }
    });
    
  } catch (error) {
    console.error('Error exporting PDF:', error);
    res.status(500).json({ error: 'Failed to export PDF' });
  }
});

// Helper function to generate HTML for PDF
function generatePDFHTML(transactions, summary) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  let transactionsHTML = transactions.map(t => `
    <tr>
      <td>${t.date}</td>
      <td>${t.description}</td>
      <td style="text-align: right; color: ${t.type === 'income' ? 'green' : 'red'}">
        ${t.type === 'income' ? '+' : '-'} ${new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0
        }).format(t.amount)}
      </td>
      <td style="text-align: center">${t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</td>
    </tr>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Laporan Keuangan</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #667eea;
          margin: 0;
        }
        .header p {
          color: #666;
          margin: 5px 0 0 0;
        }
        .summary {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          gap: 20px;
        }
        .summary-card {
          flex: 1;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          text-align: center;
        }
        .summary-card.income {
          background-color: #d4edda;
          border-color: #c3e6cb;
        }
        .summary-card.expense {
          background-color: #f8d7da;
          border-color: #f5c6cb;
        }
        .summary-card.balance {
          background-color: #d1ecf1;
          border-color: #bee5eb;
        }
        .summary-card h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #666;
        }
        .summary-card .amount {
          font-size: 18px;
          font-weight: bold;
          margin: 0;
        }
        .income .amount { color: #155724; }
        .expense .amount { color: #721c24; }
        .balance .amount { color: #0c5460; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f8f9fa;
          font-weight: bold;
          color: #495057;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Laporan Keuangan Pribadi</h1>
        <p>Tanggal Cetak: ${currentDate}</p>
      </div>
      
      <div class="summary">
        <div class="summary-card income">
          <h3>Total Pemasukan</h3>
          <p class="amount">${new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          }).format(summary.income)}</p>
        </div>
        <div class="summary-card expense">
          <h3>Total Pengeluaran</h3>
          <p class="amount">${new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          }).format(summary.expenses)}</p>
        </div>
        <div class="summary-card balance">
          <h3>Saldo</h3>
          <p class="amount">${new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          }).format(summary.balance)}</p>
        </div>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Deskripsi</th>
            <th style="text-align: right">Jumlah</th>
            <th style="text-align: center">Tipe</th>
          </tr>
        </thead>
        <tbody>
          ${transactionsHTML}
        </tbody>
      </table>
      
      <div class="footer">
        <p>Total Transaksi: ${summary.totalTransactions} | Laporan ini dicetak secara otomatis dari Aplikasi Keuangan Pribadi</p>
      </div>
    </body>
    </html>
  `;
}

// Legacy route for backward compatibility
router.get('/', async (req, res) => {
  res.redirect('/api/export/excel');
});

module.exports = router;