// Global variables
let currentPage = 1;
let itemsPerPage = 10;
let allTransactions = [];
let hasPassword = true; // Assume password is set for change password functionality

// Global error handler
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Set today's date as default
    document.getElementById('date').valueAsDate = new Date();
    
    // Load initial data
    loadSummary();
    loadTransactions();
    loadMonths();
    
    // Setup event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Transaction form
    document.getElementById('transactionForm').addEventListener('submit', handleAddTransaction);
    
    // Search and filter
    document.getElementById('searchInput').addEventListener('input', handleFilterChange);
    document.getElementById('typeFilter').addEventListener('change', handleFilterChange);
    document.getElementById('itemsPerPageFilter').addEventListener('change', handleItemsPerPageChange);
    
    // Date filters
    document.getElementById('monthFilter').addEventListener('change', handleFilterChange);
    document.getElementById('startDateFilter').addEventListener('change', handleFilterChange);
    document.getElementById('endDateFilter').addEventListener('change', handleFilterChange);
    
    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    
    // Export buttons
    document.getElementById('exportExcelBtn').addEventListener('click', handleExcelExport);
    document.getElementById('exportPDFBtn').addEventListener('click', handlePDFExport);
    
    // Password button
    const passwordBtn = document.getElementById('passwordBtn');
    if (passwordBtn) {
        passwordBtn.addEventListener('click', showPasswordModal);
    }
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Password form
    document.getElementById('passwordForm').addEventListener('submit', handlePasswordChange);
    
    // Password verification form
    document.getElementById('passwordVerifyForm').addEventListener('submit', handlePasswordVerification);
    
    // Edit form
    document.getElementById('editForm').addEventListener('submit', handleEditTransaction);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal();
        }
    });
}

// API Functions
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`/api${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        showToast('Terjadi kesalahan. Silakan coba lagi.', 'error');
        throw error;
    }
}

// Load summary data
async function loadSummary() {
    try {
        const params = getFilterParams();
        const queryString = new URLSearchParams(params).toString();
        const summary = await apiCall(`/summary${queryString ? '?' + queryString : ''}`);
        updateSummaryDisplay(summary);
    } catch (error) {
        console.error('Failed to load summary:', error);
    }
}

// Load months for filter
async function loadMonths() {
    try {
        const months = await apiCall('/months');
        const monthFilter = document.getElementById('monthFilter');
        
        // Clear existing options except the first one
        monthFilter.innerHTML = '<option value="">Semua Bulan</option>';
        
        // Add month options
        months.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = formatMonth(month);
            monthFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load months:', error);
    }
}

// Get filter parameters
function getFilterParams() {
    const params = {};
    
    const month = document.getElementById('monthFilter').value;
    const startDate = document.getElementById('startDateFilter').value;
    const endDate = document.getElementById('endDateFilter').value;
    const search = document.getElementById('searchInput').value;
    const type = document.getElementById('typeFilter').value;
    
    if (month) params.month = month;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (search) params.search = search;
    if (type) params.type = type;
    
    return params;
}

function updateSummaryDisplay(summary) {
    document.getElementById('totalIncome').textContent = formatCurrency(summary.totalIncome);
    document.getElementById('totalExpenses').textContent = formatCurrency(summary.totalExpenses);
    document.getElementById('balance').textContent = formatCurrency(summary.balance);
    document.getElementById('currentMonthIncome').textContent = formatCurrency(summary.currentMonthIncome);
    document.getElementById('currentMonthExpenses').textContent = formatCurrency(summary.currentMonthExpenses);
    document.getElementById('currentMonthBalance').textContent = formatCurrency(summary.currentMonthBalance);
}

// Load transactions
async function loadTransactions(page = 1) {
    try {
        const params = getFilterParams();
        params.page = page;
        if (itemsPerPage !== 'all') {
            params.itemsPerPage = itemsPerPage;
        }
        
        const queryString = new URLSearchParams(params).toString();
        const data = await apiCall(`/transactions${queryString ? '?' + queryString : ''}`);
        
        allTransactions = data.transactions;
        currentPage = page;
        
        displayTransactions(data.transactions);
        displayPagination(data.pagination);
        displayTransactionsInfo(data.pagination);
    } catch (error) {
        console.error('Failed to load transactions:', error);
        displayTransactions([]);
    }
}

function displayTransactions(transactions) {
    const container = document.getElementById('transactionsList');
    
    if (transactions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>Belum ada transaksi</h3>
                <p>Mulai tambahkan transaksi pertama Anda</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = transactions.map((transaction, index) => {
        const rowNumber = itemsPerPage === 'all' 
            ? index + 1 
            : (currentPage - 1) * parseInt(itemsPerPage) + index + 1;
            
        return `
        <div class="transaction-item">
            <div class="transaction-info">
                <div class="transaction-description">${rowNumber}. ${transaction.description}</div>
                <div class="transaction-date">${formatDate(transaction.date)}</div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'} ${formatCurrency(transaction.amount)}
            </div>
            <div class="transaction-actions">
                <button class="btn btn-sm btn-secondary" onclick="editTransaction('${transaction.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteTransaction('${transaction.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    }).join('');
}

function displayPagination(pagination) {
    const container = document.getElementById('pagination');
    
    if (!pagination || pagination.totalPages <= 1 || itemsPerPage === 'all') {
        container.innerHTML = '';
        return;
    }
    
    let html = `
        <div class="pagination">
            <button onclick="loadTransactions(${pagination.page - 1})" 
                    ${pagination.page <= 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
    `;
    
    for (let i = 1; i <= pagination.totalPages; i++) {
        html += `
            <button onclick="loadTransactions(${i})" 
                    class="${i === pagination.page ? 'active' : ''}">
                ${i}
            </button>
        `;
    }
    
    html += `
            <button onclick="loadTransactions(${pagination.page + 1})" 
                    ${pagination.page >= pagination.totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
    
    container.innerHTML = html;
}

// Display transactions info
function displayTransactionsInfo(pagination) {
    const container = document.getElementById('transactionsInfo');
    
    if (!pagination || itemsPerPage === 'all') {
        container.innerHTML = `<div class="transactions-info">Menampilkan semua ${pagination?.totalItems || 0} transaksi</div>`;
        return;
    }
    
    const start = (pagination.page - 1) * pagination.itemsPerPage + 1;
    const end = Math.min(pagination.page * pagination.itemsPerPage, pagination.totalItems);
    
    container.innerHTML = `<div class="transactions-info">Menampilkan ${start} - ${end} dari ${pagination.totalItems} transaksi</div>`;
}

// Handle items per page change
function handleItemsPerPageChange(e) {
    itemsPerPage = e.target.value;
    currentPage = 1; // Reset to first page
    loadTransactions(1);
}

// Handle add transaction
async function handleAddTransaction(e) {
    e.preventDefault();
    
    const formData = {
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        type: document.getElementById('type').value,
        date: document.getElementById('date').value
    };
    
    try {
        await apiCall('/transactions', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        // Reset form
        document.getElementById('transactionForm').reset();
        document.getElementById('date').valueAsDate = new Date();
        
        // Reload data
        loadSummary();
        loadTransactions(currentPage);
        loadMonths(); // Refresh months filter
        
        showToast('Transaksi berhasil ditambahkan', 'success');
    } catch (error) {
        console.error('Failed to add transaction:', error);
    }
}

// Edit transaction
function editTransaction(id) {
    const transaction = allTransactions.find(t => t.id === id);
    if (!transaction) return;
    
    // Show password verification modal
    showPasswordVerification('edit', id);
}

// Handle edit transaction
async function handleEditTransaction(e) {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const formData = {
        description: document.getElementById('editDescription').value,
        amount: parseFloat(document.getElementById('editAmount').value),
        type: document.getElementById('editType').value,
        date: document.getElementById('editDate').value
    };
    
    try {
        await apiCall(`/transactions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(formData)
        });
        
        closeModal();
        loadSummary();
        loadTransactions(currentPage);
        loadMonths(); // Refresh months filter
        
        showToast('Transaksi berhasil diupdate', 'success');
    } catch (error) {
        console.error('Failed to update transaction:', error);
    }
}

// Delete transaction
function deleteTransaction(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
        return;
    }
    
    // Show password verification modal
    showPasswordVerification('delete', id);
}

// Password verification functions
function showPasswordVerification(action, transactionId) {
    document.getElementById('verifyAction').value = action;
    document.getElementById('verifyTransactionId').value = transactionId;
    document.getElementById('verifyPassword').value = '';
    document.getElementById('passwordVerifyModal').style.display = 'block';
}

async function handlePasswordVerification(e) {
    e.preventDefault();
    
    const password = document.getElementById('verifyPassword').value;
    const action = document.getElementById('verifyAction').value;
    const transactionId = document.getElementById('verifyTransactionId').value;
    
    try {
        // Call the API to verify password
        const response = await fetch('/api/password/verify-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Password verified, proceed with action
            closeModal();
            
            if (action === 'edit') {
                proceedWithEdit(transactionId);
            } else if (action === 'delete') {
                proceedWithDelete(transactionId);
            }
        } else {
            showToast(data.error || 'Password salah. Silakan coba lagi.', 'error');
        }
    } catch (error) {
        console.error('Password verification failed:', error);
        showToast('Gagal memverifikasi password. Periksa koneksi.', 'error');
    }
}

function proceedWithEdit(transactionId) {
    const transaction = allTransactions.find(t => t.id === transactionId);
    if (!transaction) return;
    
    document.getElementById('editId').value = transaction.id;
    document.getElementById('editDescription').value = transaction.description;
    document.getElementById('editAmount').value = transaction.amount;
    document.getElementById('editType').value = transaction.type;
    document.getElementById('editDate').value = transaction.date;
    
    document.getElementById('editModal').style.display = 'block';
}

async function proceedWithDelete(transactionId) {
    try {
        await apiCall(`/transactions/${transactionId}`, {
            method: 'DELETE'
        });
        
        loadSummary();
        loadTransactions(currentPage);
        loadMonths(); // Refresh months filter
        
        showToast('Transaksi berhasil dihapus', 'success');
    } catch (error) {
        console.error('Failed to delete transaction:', error);
        showToast('Gagal menghapus transaksi', 'error');
    }
}

// Filter functions
function handleFilterChange() {
    currentPage = 1; // Reset to first page when filter changes
    loadSummary();
    loadTransactions(1);
}

function clearFilters() {
    document.getElementById('monthFilter').value = '';
    document.getElementById('startDateFilter').value = '';
    document.getElementById('endDateFilter').value = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('typeFilter').value = '';
    
    handleFilterChange();
}

// Export Excel data
async function handleExcelExport() {
    try {
        const params = getFilterParams();
        const queryString = new URLSearchParams(params).toString();
        
        const response = await fetch(`/api/export/excel${queryString ? '?' + queryString : ''}`);
        const blob = await response.blob();
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `keuangan-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showToast('Data berhasil diexport ke Excel', 'success');
    } catch (error) {
        console.error('Failed to export Excel:', error);
        showToast('Gagal export Excel', 'error');
    }
}

// Export PDF data
async function handlePDFExport() {
    try {
        const params = getFilterParams();
        const queryString = new URLSearchParams(params).toString();
        
        const response = await fetch(`/api/export/pdf${queryString ? '?' + queryString : ''}`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Create a temporary window for PDF generation
        const printWindow = window.open('', '_blank');
        printWindow.document.write(data.html);
        printWindow.document.close();
        
        // Wait for content to load, then print
        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        };
        
        showToast('PDF berhasil dibuka. Silakan pilih "Save as PDF" di dialog print.', 'success');
    } catch (error) {
        console.error('Failed to export PDF:', error);
        showToast('Gagal export PDF', 'error');
    }
}

// Legacy export function for backward compatibility
async function handleExport() {
    return handleExcelExport();
}

// Password management
function showPasswordModal() {
    const modal = document.getElementById('passwordModal');
    
    // Reset form
    document.getElementById('passwordForm').reset();
    
    // Show modal
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error('Password modal not found!');
    }
}

async function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        showToast('Password baru tidak cocok', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('Password baru harus memiliki minimal 6 karakter', 'error');
        return;
    }
    
    try {
        // Show loading indicator
        showToast('Mengubah password...', 'info');
        
        // Call the API to change password
        const response = await fetch('/api/password/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            closeModal();
            document.getElementById('passwordForm').reset();
            showToast('Password berhasil diubah!', 'success');
            console.log('Password changed successfully:', data.message);
        } else {
            showToast(data.error || 'Gagal mengubah password', 'error');
        }
    } catch (error) {
        console.error('Failed to change password:', error);
        showToast('Gagal mengubah password. Periksa koneksi.', 'error');
    }
}

// Modal functions
function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatMonth(monthString) {
    const [year, month] = monthString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long'
    });
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}