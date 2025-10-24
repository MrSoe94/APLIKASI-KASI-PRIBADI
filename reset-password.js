const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    const result = await prisma.appSettings.delete({
      where: { key: 'app_password' }
    });
    
    console.log('Password berhasil direset dari database!');
    console.log('Sekarang Anda bisa setup password baru melalui aplikasi.');
  } catch (error) {
    if (error.code === 'P2025') {
      console.log('Tidak ada password yang ditemukan di database.');
    } else {
      console.error('Error:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();