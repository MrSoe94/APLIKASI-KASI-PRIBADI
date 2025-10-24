const express = require('express');
const router = express.Router();

// Default categories
const defaultCategories = {
  income: [
    { name: 'Gaji', color: '#10b981', icon: '💰' },
    { name: 'Bonus', color: '#22c55e', icon: '🎁' },
    { name: 'Investasi', color: '#16a34a', icon: '📈' },
    { name: 'Freelance', color: '#15803d', icon: '💻' },
    { name: 'Lainnya', color: '#166534', icon: '💵' }
  ],
  expense: [
    { name: 'Makanan', color: '#ef4444', icon: '🍔' },
    { name: 'Transportasi', color: '#f97316', icon: '🚗' },
    { name: 'Belanja', color: '#eab308', icon: '🛒' },
    { name: 'Tagihan', color: '#dc2626', icon: '📄' },
    { name: 'Hiburan', color: '#ea580c', icon: '🎮' },
    { name: 'Kesehatan', color: '#b91c1c', icon: '🏥' },
    { name: 'Pendidikan', color: '#c2410c', icon: '📚' },
    { name: 'Lainnya', color: '#991b1b', icon: '📌' }
  ]
};

// GET categories
router.get('/', (req, res) => {
  res.json(defaultCategories);
});

module.exports = router;