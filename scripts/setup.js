const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Birthday Surprise project...\n');

// Create necessary directories
const dirs = [
  'data',
  'public/uploads',
];

dirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`✓ Directory already exists: ${dir}`);
  }
});

// Create .env.local if it doesn't exist
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.local.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('\n✅ Created .env.local from example');
} else if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, 'NEXT_PUBLIC_BASE_URL=http://localhost:3000\n');
  console.log('\n✅ Created .env.local with default settings');
}

console.log('\n✨ Setup complete! You can now run:');
console.log('   npm run dev\n');
console.log('📱 Access the app at: http://localhost:3000');
console.log('🔐 Admin dashboard: http://localhost:3000/admin');
console.log('   Default password: UzmaLove2024!\n');
console.log('💝 Happy Birthday Uzma! 🎂\n');
