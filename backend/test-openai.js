// Quick test script to verify OpenAI API key
require('dotenv').config();
const OpenAI = require('openai');

console.log('🔍 Testing OpenAI API Configuration...\n');

// Check if API key is set
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ ERROR: OPENAI_API_KEY is not set in .env file');
  console.log('\n📝 To fix:');
  console.log('1. Open backend/.env file');
  console.log('2. Add: OPENAI_API_KEY=sk-your-actual-key-here');
  console.log('3. Restart the backend server\n');
  process.exit(1);
}

console.log('✅ OPENAI_API_KEY is set in .env');
console.log(`   Key starts with: ${process.env.OPENAI_API_KEY.substring(0, 7)}...\n`);

// Try to initialize OpenAI client
let openai;
try {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log('✅ OpenAI client initialized\n');
} catch (error) {
  console.error('❌ ERROR: Failed to initialize OpenAI client');
  console.error(`   ${error.message}\n`);
  process.exit(1);
}

// Test API call
console.log('🧪 Testing API call...\n');
openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: 'Say "Hello, API is working!"' }],
  max_tokens: 20
})
  .then(response => {
    console.log('✅ SUCCESS! OpenAI API is working correctly');
    console.log(`   Response: ${response.choices[0].message.content}\n`);
    console.log('✅ Your OpenAI API key is valid and working!\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ ERROR: OpenAI API call failed');
    console.error(`   Error: ${error.message}\n`);
    
    if (error.status === 401) {
      console.log('💡 This usually means:');
      console.log('   - API key is invalid or expired');
      console.log('   - API key doesn\'t have proper permissions');
      console.log('   - Check your OpenAI account at https://platform.openai.com\n');
    } else if (error.status === 429) {
      console.log('💡 This usually means:');
      console.log('   - Rate limit exceeded');
      console.log('   - Wait a few minutes and try again\n');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.log('💡 This usually means:');
      console.log('   - No internet connection');
      console.log('   - Firewall blocking OpenAI API');
      console.log('   - Check your network connection\n');
    } else {
      console.log('💡 Check:');
      console.log('   - Your OpenAI account has credits');
      console.log('   - API key is correct');
      console.log('   - Internet connection is working\n');
    }
    
    process.exit(1);
  });

