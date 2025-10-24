# 📄 PDF Export Feature

## ✨ Fitur Export Data

Aplikasi keuangan pribadi sekarang memiliki **dua opsi export** yang lengkap dan profesional:

### 📊 **Export Excel**
- Format spreadsheet yang familiar
- Data mentah untuk analisis lanjutan
- Compatible dengan Microsoft Excel, Google Sheets
- Filter support untuk data spesifik

### 📄 **Export PDF**
- Format dokumen yang profesional
- Siap cetak dan bagikan
- Layout yang rapi dan terstruktur
- Perfect untuk laporan keuangan

## 🎯 **Cara Penggunaan**

### Export Excel
1. Klik tombol **"Export Excel"** (abu-abu dengan icon 📊)
2. File Excel akan otomatis di-download
3. Buka dengan Excel atau spreadsheet software

### Export PDF
1. Klik tombol **"Export PDF"** (merah dengan icon 📄)
2. Browser print dialog akan terbuka
3. Pilih **"Save as PDF"** sebagai destination
4. Klik **"Save"** untuk download PDF

### Export dengan Filter
1. Set filter yang diinginkan (bulan, tanggal, tipe, search)
2. Klik tombol export yang diinginkan
3. Data yang diexport sesuai dengan filter aktif

## 🎨 **Fitur PDF Export**

### 📋 **Layout Profesional**
- **Header** dengan judul "Laporan Keuangan Pribadi"
- **Tanggal Cetak** otomatis
- **Summary Cards** dengan color coding:
  - 🟢 **Hijau** untuk pemasukan
  - 🔴 **Merah** untuk pengeluaran  
  - 🔵 **Biru** untuk saldo

### 📊 **Summary Section**
```
Total Pemasukan    Total Pengeluaran    Saldo
    Rp 5.000.000        Rp 1.500.000    Rp 3.500.000
```

### 📝 **Transaction Table**
| Tanggal | Deskripsi | Jumlah | Tipe |
|---------|-----------|--------|------|
| 2024-01-01 | Gaji Bulanan | +Rp 5.000.000 | Pemasukan |
| 2024-01-20 | Belanja Bulanan | -Rp 1.500.000 | Pengeluaran |

### 🏷️ **Footer Information**
- Total transaksi
- Informasi aplikasi
- Tanggal cetak

## 🔧 **Technical Features**

### **Backend API**
```javascript
// Excel Export
GET /api/export/excel?month=2024-01&type=income

// PDF Export  
GET /api/export/pdf?startDate=2024-01-01&endDate=2024-01-31
```

### **Filter Support**
- ✅ **Filter Bulan** - Export data bulan spesifik
- ✅ **Filter Tanggal Range** - Export periode waktu
- ✅ **Filter Tipe** - Export hanya income/expense
- ✅ **Filter Search** - Export hasil pencarian
- ✅ **Kombinasi Filter** - Export dengan multiple filters

### **PDF Generation**
- HTML template dengan CSS styling
- Print-to-PDF menggunakan browser native
- Responsive design untuk optimal printing
- Professional typography dan layout

## 📱 **Mobile Support**

### **Export di Mobile**
- Tombol export responsive dan touch-friendly
- Print dialog mobile-optimized
- PDF generation works on all devices

### **Print Dialog Options**
- **Save as PDF** - Default option
- **Print to Printer** - Physical printing
- **Save to Drive** - Cloud storage integration

## 🎯 **Use Cases**

### 📈 **Personal Finance Tracking**
- Monthly financial reports
- Expense tracking summaries
- Income statements

### 💼 **Business Use**
- Client financial reports
- Expense documentation
- Tax preparation

### 📊 **Data Analysis**
- Export to Excel for detailed analysis
- Create charts and graphs
- Historical data tracking

## 🔄 **Export Workflow**

```
1. User sets filters (optional)
2. User clicks export button
3. Backend processes data with filters
4. Generate formatted output (Excel/PDF)
5. Browser downloads file or opens print dialog
6. User saves or prints the document
```

## 🛠️ **Advanced Features**

### **Custom Date Ranges**
- Export data for specific periods
- Quarterly reports
- Year-end summaries

### **Filtered Exports**
- Export only expense data
- Export specific categories
- Export search results

### **Professional Formatting**
- Company branding ready
- Consistent color scheme
- Print-optimized layout

## 📋 **File Naming Convention**

### **Excel Files**
```
keuangan-2024-01-15.xlsx
```

### **PDF Files**
```
keuangan-2024-01-15.pdf
```

Files automatically named with current date for easy organization.

## 🎉 **Benefits**

### **For Users**
- 📊 **Dual Format Options** - Excel dan PDF
- 🎯 **Filtered Exports** - Only relevant data
- 📱 **Mobile Friendly** - Works everywhere
- 🖨️ **Print Ready** - Professional documents

### **For Business**
- 📈 **Professional Reports** - Client-ready
- 📊 **Data Analysis** - Excel compatibility
- 📄 **Documentation** - PDF records
- 🔄 **Automation** - One-click exports

---

**📄 Export data keuangan Anda dengan mudah dan profesional!**