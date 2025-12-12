#!/usr/bin/env node

/**
 * UltraFolio Setup Script
 * This script helps you set up your environment quickly
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const envPath = path.join(__dirname, '..', '.env.local');
const envExamplePath = path.join(__dirname, '..', '.env.local.example');

console.log('\n🚀 Welcome to UltraFolio Setup!\n');

// Check if .env.local already exists
if (fs.existsSync(envPath)) {
    console.log('✅ .env.local file already exists!');
    console.log('📝 Location:', envPath);
    console.log('\n💡 To reconfigure, delete .env.local and run this script again.\n');
    rl.close();
    process.exit(0);
}

// Check if .env.local.example exists
if (!fs.existsSync(envExamplePath)) {
    console.log('❌ Error: .env.local.example not found!');
    console.log('Please make sure you have the example file in your project.\n');
    rl.close();
    process.exit(1);
}

console.log('📋 This script will help you create your .env.local file.\n');
console.log('You\'ll need:');
console.log('  1. Firebase project credentials (from Firebase Console)');
console.log('  2. Google AI API key (from Google AI Studio)\n');

rl.question('Do you want to continue? (y/n): ', (answer) => {
    if (answer.toLowerCase() !== 'y') {
        console.log('\n👋 Setup cancelled. Run "npm run setup" when you\'re ready!\n');
        rl.close();
        process.exit(0);
    }

    console.log('\n📖 Opening setup guide...\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 1: Get Firebase Credentials');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Go to: https://console.firebase.google.com/');
    console.log('2. Select your project (or create a new one)');
    console.log('3. Click the gear icon ⚙️ > Project Settings');
    console.log('4. Scroll down to "Your apps" section');
    console.log('5. Click the web app icon </> or "Add app"');
    console.log('6. Copy the firebaseConfig values\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 2: Get Google AI API Key');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Go to: https://aistudio.google.com/app/apikey');
    console.log('2. Click "Create API Key"');
    console.log('3. Copy the generated key\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('STEP 3: Get Firebase Service Account');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. In Firebase Console > Project Settings');
    console.log('2. Go to "Service Accounts" tab');
    console.log('3. Click "Generate new private key"');
    console.log('4. Download the JSON file\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Copy the example file
    fs.copyFileSync(envExamplePath, envPath);

    console.log('✅ Created .env.local file from template!');
    console.log('📝 Location:', envPath);
    console.log('\n📝 Next steps:');
    console.log('  1. Open .env.local in your editor');
    console.log('  2. Replace all placeholder values with your actual credentials');
    console.log('  3. Save the file');
    console.log('  4. Run "npm run dev" to start development\n');
    console.log('💡 Tip: Never commit .env.local to git!\n');

    rl.close();
});
