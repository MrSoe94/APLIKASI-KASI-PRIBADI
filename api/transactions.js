const express = require('express');
const { getPrismaClient } = require('../database/db');
const router = express.Router();

// GET all transactions with pagination and filters
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    let itemsPerPage = req.query.itemsPerPage;
    
    // Handle "all" option
    if (itemsPerPage === 'all' || itemsPerPage === '0' || !itemsPerPage) {
      itemsPerPage = null; // Will fetch all records
    } else {
      itemsPerPage = parseInt(itemsPerPage);
    }
    
    // Extract filter parameters
    const { month, startDate, endDate, search, type } = req.query;
    
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
        ...where.date,
        gte: startDate,
        lte: endDate
      };
    } else if (startDate) {
      where.date = {
        ...where.date,
        gte: startDate
      };
    } else if (endDate) {
      where.date = {
        ...where.date,
        lte: endDate
      };
    }
    
    // Filter by search (description)
    if (search) {
      where.description = {
        contains: search
      };
    }
    
    // Filter by type (income/expense)
    if (type && type !== '') {
      where.type = type;
    }
    
    let transactions, total, pagination;
    
    if (itemsPerPage === null) {
      // Get all transactions
      transactions = await prisma.transaction.findMany({
        where,
        orderBy: { date: 'desc' }
      });
      total = transactions.length;
      pagination = {
        page: 1,
        itemsPerPage: 0,
        total,
        totalPages: 1
      };
    } else {
      // Get paginated transactions
      const skip = (page - 1) * itemsPerPage;
      
      [transactions, total] = await Promise.all([
        prisma.transaction.findMany({
          where,
          orderBy: { date: 'desc' },
          skip,
          take: itemsPerPage
        }),
        prisma.transaction.count({ where })
      ]);
      
      pagination = {
        page,
        itemsPerPage,
        total,
        totalPages: Math.ceil(total / itemsPerPage)
      };
    }
    
    res.json({
      transactions,
      pagination,
      filters: {
        month,
        startDate,
        endDate,
        search,
        type
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST new transaction
router.post('/', async (req, res) => {
  try {
    const { description, amount, type, date } = req.body;
    
    if (!description || !amount || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const prisma = getPrismaClient();
    
    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        type,
        date: date || new Date().toISOString().split('T')[0]
      }
    });
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// PUT update transaction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, type, date } = req.body;
    
    const prisma = getPrismaClient();
    
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        description,
        amount: parseFloat(amount),
        type,
        date: date || new Date().toISOString().split('T')[0]
      }
    });
    
    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// DELETE transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const prisma = getPrismaClient();
    
    await prisma.transaction.delete({
      where: { id }
    });
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

module.exports = router;