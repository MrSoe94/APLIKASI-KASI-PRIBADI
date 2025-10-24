const express = require('express');
const { getPrismaClient } = require('../database/db');
const router = express.Router();

// GET financial summary with optional filters
router.get('/', async (req, res) => {
  try {
    const { month, startDate, endDate } = req.query;
    
    const prisma = getPrismaClient();
    
    // Build where clause
    const where = {};
    
    // Filter by month (YYYY-MM format)
    if (month) {
      where.date = {
        startsWith: month
      };
    }
    
    // Filter by date range
    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate
      };
    } else if (startDate) {
      where.date = {
        gte: startDate
      };
    } else if (endDate) {
      where.date = {
        lte: endDate
      };
    }
    
    const transactions = await prisma.transaction.findMany({ where });
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expenses;
    
    // Get current month data (only if no custom filter)
    let currentMonthIncome = 0;
    let currentMonthExpenses = 0;
    let currentMonthBalance = 0;
    
    if (!month && !startDate && !endDate) {
      const currentMonth = new Date().toISOString().split('T')[0].substring(0, 7);
      const currentMonthTransactions = await prisma.transaction.findMany({
        where: {
          date: {
            startsWith: currentMonth
          }
        }
      });
      
      currentMonthIncome = currentMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      currentMonthExpenses = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      currentMonthBalance = currentMonthIncome - currentMonthExpenses;
    }
    
    res.json({
      totalIncome: income,
      totalExpenses: expenses,
      balance,
      currentMonthIncome,
      currentMonthExpenses,
      currentMonthBalance,
      totalTransactions: transactions.length,
      filters: {
        month,
        startDate,
        endDate
      }
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

module.exports = router;