require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

async function checkHealth() {
  try {
    console.log(`${colors.blue}Checking API Health...${colors.reset}`);
    const response = await axios.get(`${API_URL}/health`);
    console.log(`${colors.green}✅ Health check passed:${colors.reset}`, response.data);
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Health check failed:${colors.reset}`, error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error(`${colors.red}   → Backend server is not running on port 5000${colors.reset}`);
    }
    return false;
  }
}

async function checkDatabase() {
  try {
    console.log(`\n${colors.blue}Checking Database Connection...${colors.reset}`);
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    await prisma.user.findMany({ take: 1 });
    console.log(`${colors.green}✅ Database connection successful${colors.reset}`);
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error(`${colors.red}❌ Database connection failed:${colors.reset}`, error.message);
    if (error.code === 'P1001' || error.message.includes('Can\'t reach database server')) {
      console.error(`${colors.red}   → MySQL is not running. Start WAMP64 MySQL service.${colors.reset}`);
    }
    return false;
  }
}

async function checkEnvironment() {
  console.log(`\n${colors.blue}Checking Environment Variables...${colors.reset}`);
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'OPENAI_API_KEY'
  ];
  
  const missing = [];
  required.forEach(key => {
    if (!process.env[key]) {
      missing.push(key);
      console.error(`${colors.red}❌ Missing: ${key}${colors.reset}`);
    } else {
      const value = key === 'OPENAI_API_KEY' || key === 'JWT_SECRET' 
        ? process.env[key].substring(0, 10) + '...' 
        : process.env[key];
      console.log(`${colors.green}✅ ${key}: ${value}${colors.reset}`);
    }
  });
  
  return missing.length === 0;
}

async function checkEndpoints() {
  console.log(`\n${colors.blue}Checking API Endpoints...${colors.reset}`);
  
  // Test registration endpoint (should fail without data, but endpoint should exist)
  try {
    await axios.post(`${API_URL}/auth/register`, {});
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log(`${colors.green}✅ /api/auth/register - Endpoint exists${colors.reset}`);
    } else if (error.code === 'ECONNREFUSED') {
      console.error(`${colors.red}❌ Cannot reach backend server${colors.reset}`);
      return false;
    }
  }
  
  // Test login endpoint
  try {
    await axios.post(`${API_URL}/auth/login`, {});
  } catch (error) {
    if (error.response && error.response.status === 400 || error.response.status === 401) {
      console.log(`${colors.green}✅ /api/auth/login - Endpoint exists${colors.reset}`);
    }
  }
  
  return true;
}

async function main() {
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}   API Error Checker${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}\n`);
  
  const results = {
    health: await checkHealth(),
    database: await checkDatabase(),
    environment: await checkEnvironment(),
    endpoints: await checkEndpoints()
  };
  
  console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}   Summary${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
  
  Object.entries(results).forEach(([key, value]) => {
    const icon = value ? `${colors.green}✅${colors.reset}` : `${colors.red}❌${colors.reset}`;
    console.log(`${icon} ${key}: ${value ? 'OK' : 'FAILED'}`);
  });
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log(`\n${colors.green}✅ All checks passed!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}❌ Some checks failed. Please review the errors above.${colors.reset}`);
  }
  
  process.exit(allPassed ? 0 : 1);
}

main().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});

