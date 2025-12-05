// Configuration Checker Script
// Run: node check-config.js

require('dotenv').config();

console.log('\n🔍 AI SaaS Platform - Configuration Checker\n');
console.log('=' .repeat(60));

const checks = {
  critical: [],
  important: [],
  optional: []
};

// Critical Configuration
console.log('\n📋 CRITICAL CONFIGURATION (Must Have)\n');

const criticalVars = [
  { name: 'DATABASE_URL', description: 'Database connection string' },
  { name: 'JWT_SECRET', description: 'JWT authentication secret' },
  { name: 'OPENAI_API_KEY', description: 'OpenAI API key for AI features' },
  { name: 'PORT', description: 'Backend server port', default: '5000' },
  { name: 'NODE_ENV', description: 'Environment mode', default: 'development' },
  { name: 'FRONTEND_URL', description: 'Frontend URL for CORS', default: 'http://localhost:3000' }
];

criticalVars.forEach(({ name, description, default: defaultValue }) => {
  const value = process.env[name];
  const isSet = !!value;
  const status = isSet ? '✅' : '❌';
  const displayValue = isSet 
    ? (name.includes('KEY') || name.includes('SECRET') 
        ? `${value.substring(0, 7)}...` 
        : value)
    : (defaultValue ? `(using default: ${defaultValue})` : 'MISSING');
  
  console.log(`${status} ${name.padEnd(25)} ${description}`);
  console.log(`   ${displayValue}`);
  
  checks.critical.push({ name, isSet, value: displayValue });
});

// Important Configuration
console.log('\n📋 IMPORTANT CONFIGURATION (For Full Functionality)\n');

const importantVars = [
  { name: 'STRIPE_SECRET_KEY', description: 'Stripe secret key for payments' },
  { name: 'STRIPE_WEBHOOK_SECRET', description: 'Stripe webhook secret' }
];

importantVars.forEach(({ name, description }) => {
  const value = process.env[name];
  const isSet = !!value;
  const status = isSet ? '✅' : '⚠️';
  const displayValue = isSet 
    ? `${value.substring(0, 7)}...` 
    : 'NOT SET (payments will not work)';
  
  console.log(`${status} ${name.padEnd(25)} ${description}`);
  console.log(`   ${displayValue}`);
  
  checks.important.push({ name, isSet, value: displayValue });
});

// Optional Configuration
console.log('\n📋 OPTIONAL CONFIGURATION (For Specific Features)\n');

const optionalVars = [
  { name: 'AWS_S3_BUCKET', description: 'AWS S3 bucket (uses local storage if not set)' },
  { name: 'AWS_ACCESS_KEY_ID', description: 'AWS access key ID' },
  { name: 'AWS_SECRET_ACCESS_KEY', description: 'AWS secret access key' },
  { name: 'AWS_REGION', description: 'AWS region', default: 'us-east-1' },
  { name: 'LINKEDIN_CLIENT_ID', description: 'LinkedIn OAuth client ID' },
  { name: 'LINKEDIN_CLIENT_SECRET', description: 'LinkedIn OAuth secret' },
  { name: 'GMAIL_CLIENT_ID', description: 'Gmail OAuth client ID' },
  { name: 'GMAIL_CLIENT_SECRET', description: 'Gmail OAuth secret' },
  { name: 'TWILIO_ACCOUNT_SID', description: 'Twilio account SID' },
  { name: 'TWILIO_AUTH_TOKEN', description: 'Twilio auth token' },
  { name: 'TWILIO_PHONE_NUMBER', description: 'Twilio phone number' }
];

optionalVars.forEach(({ name, description, default: defaultValue }) => {
  const value = process.env[name];
  const isSet = !!value;
  const status = isSet ? '✅' : '⚪';
  const displayValue = isSet 
    ? (name.includes('KEY') || name.includes('SECRET') || name.includes('TOKEN')
        ? `${value.substring(0, 7)}...` 
        : value)
    : (defaultValue ? `(using default: ${defaultValue})` : 'NOT SET');
  
  console.log(`${status} ${name.padEnd(30)} ${description}`);
  if (isSet || defaultValue) {
    console.log(`   ${displayValue}`);
  }
  
  checks.optional.push({ name, isSet, value: displayValue });
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 CONFIGURATION SUMMARY\n');

const criticalMissing = checks.critical.filter(c => !c.isSet && !c.value.includes('default')).length;
const importantMissing = checks.important.filter(c => !c.isSet).length;
const optionalSet = checks.optional.filter(c => c.isSet).length;

console.log(`Critical:  ${checks.critical.length - criticalMissing}/${checks.critical.length} configured`);
console.log(`Important: ${checks.important.length - importantMissing}/${checks.important.length} configured`);
console.log(`Optional:  ${optionalSet}/${checks.optional.length} configured`);

if (criticalMissing > 0) {
  console.log('\n⚠️  WARNING: Missing critical configuration!');
  console.log('   The application may not work properly.');
  console.log('\n   Missing variables:');
  checks.critical
    .filter(c => !c.isSet && !c.value.includes('default'))
    .forEach(c => console.log(`   - ${c.name}`));
}

if (importantMissing > 0) {
  console.log('\n⚠️  NOTE: Missing important configuration.');
  console.log('   Some features (like payments) will not work.');
}

// Test OpenAI if key is set
if (process.env.OPENAI_API_KEY) {
  console.log('\n🧪 Testing OpenAI API Key...');
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Say "API is working"' }],
    max_tokens: 10
  })
    .then(() => {
      console.log('✅ OpenAI API key is valid and working!');
    })
    .catch(error => {
      console.log('❌ OpenAI API key test failed:', error.message);
    });
}

console.log('\n' + '='.repeat(60));
console.log('\n✅ Configuration check complete!\n');
console.log('📝 For detailed configuration guide, see: CONFIGURATION_CHECKLIST.md\n');

