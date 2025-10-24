# Aplikasi Keuangan Pribadi

Aplikasi keuangan pribadi yang sederhana dan mudah digunakan, dibangun dengan Node.js Express dan SQLite.

## 🚀 Fitur

- **Manajemen Transaksi** - Tambah, edit, dan hapus transaksi pemasukan/pengeluaran
- **Dashboard Ringkasan** - Lihat total pemasukan, pengeluaran, dan saldo
- **Filter & Pencarian** - Cari dan filter transaksi berdasarkan kategori
- **Export Data** - Download data transaksi dalam format Excel
- **Password Protection** - Keamanan data dengan password
- **Responsive Design** - Tampilan yang bagus di desktop dan mobile
- **Real-time Updates** - Update data secara real-time

## 📋 Prasyarat

- Node.js (versi 14 atau lebih tinggi)
- npm atau yarn

## 🛠️ Instalasi

1. **Clone atau download proyek ini**
2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Jalankan aplikasi**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Buka browser**
   ```
   http://localhost:3000
   ```

## 📁 Struktur Proyek

```
personal-finance-app/
├── api/                    # API routes
│   ├── transactions.js     # Transaksi CRUD
│   ├── summary.js          # Ringkasan keuangan
│   ├── months.js           # Data bulan
│   ├── password.js         # Password management
│   ├── categories.js       # Kategori transaksi
│   └── export.js           # Export Excel
├── database/
│   └── db.js              # Database connection
├── public/                # Frontend files
│   ├── index.html         # Main HTML page
│   ├── styles.css         # CSS styles
│   └── app.js             # JavaScript logic
├── prisma/
│   └── schema.prisma      # Database schema
├── db/                    # Database files
│   └── custom.db          # SQLite database
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🔧 API Endpoints

### Transaksi
- `GET /api/transactions` - Ambil semua transaksi (dengan pagination)
- `POST /api/transactions` - Tambah transaksi baru
- `PUT /api/transactions/:id` - Update transaksi
- `DELETE /api/transactions/:id` - Hapus transaksi

### Summary
- `GET /api/summary` - Ambil ringkasan keuangan

### Lainnya
- `GET /api/months` - Ambil daftar bulan yang tersedia
- `GET /api/categories` - Ambil daftar kategori
- `GET /api/export` - Export data ke Excel
- `POST /api/password/setup` - Setup password
- `POST /api/password/verify` - Verifikasi password

## 📊 Database Schema

### Transaction
- `id` - String (Primary Key)
- `description` - String
- `amount` - Float
- `type` - String (income/expense)
- `date` - String (YYYY-MM-DD)
- `createdAt` - DateTime
- `updatedAt` - DateTime

### AppSettings
- `id` - String (Primary Key)
- `key` - String (Unique)
- `value` - String
- `createdAt` - DateTime
- `updatedAt` - DateTime

## 🔐 Password Default

Password default aplikasi adalah: **123456**

Disarankan untuk mengubah password default setelah pertama kali menggunakan aplikasi.

## 🎨 Cara Penggunaan

1. **Buka aplikasi** di http://localhost:3000
2. **Tambah transaksi** menggunakan form di bagian atas
3. **Lihat ringkasan** keuangan di kartu summary
4. **Kelola transaksi** di daftar transaksi (edit/hapus)
5. **Filter data** menggunakan kotak pencarian
6. **Export data** ke Excel dengan tombol Export
7. **Ganti password** melalui tombol Ganti Password

## 🔄 Backup Data

Data tersimpan dalam file SQLite di `db/custom.db`. 
Untuk backup, cukup copy file ini ke lokasi yang aman.

## 🐛 Troubleshooting

### Port 3000 sudah digunakan
```bash
# Kill process yang menggunakan port 3000
pkill -f "node server.js"

# Atau ubah port di server.js
const PORT = process.env.PORT || 3001;
```

### Database error
```bash
# Reset database
npx prisma db push --force-reset

# Generate ulang Prisma client
npx prisma generate
```

### Install ulang dependencies
```bash
# Hapus node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Install ulang
npm install
```

## 📱 Screenshots

Aplikasi memiliki tampilan yang:
- **Responsive** - Bekerja dengan baik di desktop dan mobile
- **Modern** - Desain yang clean dan profesional
- **Intuitif** - Mudah digunakan bahkan untuk pemula

## 🤝 Kontribusi

1. Fork proyek ini
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📄 License

Proyek ini dilisensikan under MIT License - lihat file LICENSE untuk detail.

## 📞 Support

Jika ada pertanyaan atau masalah, silakan:
- Buat issue di GitHub
- Kirim email ke support@example.com

---

**Terima kasih telah menggunakan Aplikasi Keuangan Pribadi!** 💰📊