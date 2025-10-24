const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

let prisma;

function getPrismaClient() {
  if (!prisma) {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: 'file:./db/custom.db'
        }
      }
    });
  }
  return prisma;
}

async function initDatabase() {
  const client = getPrismaClient();
  
  try {
    // Test connection
    await client.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if password is set, if not create default
    const passwordSetting = await client.appSettings.findUnique({
      where: { key: 'app_password' }
    });
    
    if (!passwordSetting) {
      const defaultPassword = '123456'; // Default password
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      await client.appSettings.create({
        data: {
          key: 'app_password',
          value: hashedPassword
        }
      });
      
      console.log('🔐 Default password created: 123456');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

module.exports = {
  getPrismaClient,
  initDatabase
};