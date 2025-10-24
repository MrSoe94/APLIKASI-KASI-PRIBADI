import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string; // Format: YYYY-MM-DD
  timestamp: number;
}

const DB_PATH = path.join(process.cwd(), 'data', 'transactions.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read transactions from JSON file
export const readTransactions = (): Transaction[] => {
  try {
    ensureDataDir();
    if (!fs.existsSync(DB_PATH)) {
      return [];
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading transactions:', error);
    return [];
  }
};

// Write transactions to JSON file
export const writeTransactions = (transactions: Transaction[]): void => {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_PATH, JSON.stringify(transactions, null, 2));
  } catch (error) {
    console.error('Error writing transactions:', error);
    throw new Error('Failed to save transactions');
  }
};

// Add a new transaction
export const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction => {
  const transactions = readTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: uuidv4(),
    timestamp: Date.now(),
  };
  
  transactions.unshift(newTransaction); // Add to beginning for latest first
  writeTransactions(transactions);
  return newTransaction;
};

// Update an existing transaction
export const updateTransaction = (id: string, updates: Partial<Omit<Transaction, 'id' | 'timestamp'>>): Transaction | null => {
  const transactions = readTransactions();
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) {
    return null;
  }
  
  transactions[index] = { ...transactions[index], ...updates };
  writeTransactions(transactions);
  return transactions[index];
};

// Delete a transaction
export const deleteTransaction = (id: string): boolean => {
  const transactions = readTransactions();
  const filteredTransactions = transactions.filter(t => t.id !== id);
  
  if (filteredTransactions.length === transactions.length) {
    return false; // Transaction not found
  }
  
  writeTransactions(filteredTransactions);
  return true;
};

// Get transaction by ID
export const getTransactionById = (id: string): Transaction | null => {
  const transactions = readTransactions();
  return transactions.find(t => t.id === id) || null;
};

// Calculate financial summary
export const calculateFinancialSummary = () => {
  const transactions = readTransactions();
  
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;
  
  return {
    totalIncome,
    totalExpense,
    balance,
    transactionCount: transactions.length
  };
};

// Filter transactions by month and year
export const filterTransactionsByMonth = (transactions: Transaction[], year: number, month: number): Transaction[] => {
  return transactions.filter(transaction => {
    const transactionDate = transaction.date ? new Date(transaction.date) : new Date(transaction.timestamp);
    return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
  });
};

// Filter transactions by date range
export const filterTransactionsByDateRange = (transactions: Transaction[], startDate: string, endDate: string): Transaction[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Include the entire end date
  
  return transactions.filter(transaction => {
    const transactionDate = transaction.date ? new Date(transaction.date) : new Date(transaction.timestamp);
    return transactionDate >= start && transactionDate <= end;
  });
};

// Calculate financial summary for filtered transactions
export const calculateFilteredSummary = (transactions: Transaction[]) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;
  
  return {
    totalIncome,
    totalExpense,
    balance,
    transactionCount: transactions.length
  };
};

// Get available months and years from transactions
export const getAvailableMonths = () => {
  const transactions = readTransactions();
  const monthYearSet = new Set<string>();
  
  transactions.forEach(transaction => {
    const date = transaction.date ? new Date(transaction.date) : new Date(transaction.timestamp);
    const year = date.getFullYear();
    const month = date.getMonth();
    monthYearSet.add(`${year}-${month}`);
  });
  
  return Array.from(monthYearSet)
    .map(item => {
      const [year, month] = item.split('-').map(Number);
      return { year, month };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
};

// Paginate transactions
export const paginateTransactions = (transactions: Transaction[], page: number, itemsPerPage: number) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    data: transactions.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      itemsPerPage,
      totalItems: transactions.length,
      totalPages: Math.ceil(transactions.length / itemsPerPage),
      hasNextPage: page < Math.ceil(transactions.length / itemsPerPage),
      hasPrevPage: page > 1
    }
  };
};