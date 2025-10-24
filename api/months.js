const express = require('express');
const { getPrismaClient } = require('../database/db');
const router = express.Router();

// GET available months
router.get('/', async (req, res) => {
  try {
    const prisma = getPrismaClient();
    
    const transactions = await prisma.transaction.findMany({
      where: { date: { not: null } },
      select: { date: true }
    });
    
    // Extract unique months
    const months = [...new Set(
      transactions
        .map(t => t.date.substring(0, 7)) // YYYY-MM
        .filter(Boolean)
        .sort()
        .reverse()
    )];
    
    res.json(months);
  } catch (error) {
    console.error('Error fetching months:', error);
    res.status(500).json({ error: 'Failed to fetch months' });
  }
});

module.exports = router;