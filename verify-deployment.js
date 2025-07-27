#!/usr/bin/env node

/**
 * Deployment Verification Script for Baazar Dost
 * Checks if all required environment variables are set and the build is ready
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying Baazar Dost deployment readiness...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'vite.config.js',
  'index.html',
  'src/main.jsx',
  'src/config/firebase.js'
];

console.log('📁 Checking required files...');
let filesOk = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    filesOk = false;
  }
});

// Check environment variables
console.log('\n🔧 Checking environment variables...');
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

let envOk = true;

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}`);
  } else {
    console.log(`⚠️  ${envVar} - NOT SET (required for production)`);
    envOk = false;
  }
});

// Check package.json scripts
console.log('\n📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['build', 'preview', 'start'];

let scriptsOk = true;

requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`✅ ${script}: ${packageJson.scripts[script]}`);
  } else {
    console.log(`❌ ${script} - MISSING`);
    scriptsOk = false;
  }
});

// Check if dist directory exists (after build)
console.log('\n🏗️  Checking build output...');
if (fs.existsSync('dist')) {
  console.log('✅ dist directory exists');
  
  // Check for key files in dist
  const distFiles = ['index.html', 'assets'];
  distFiles.forEach(file => {
    const filePath = path.join('dist', file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ dist/${file}`);
    } else {
      console.log(`⚠️  dist/${file} - not found (run npm run build)`);
    }
  });
} else {
  console.log('⚠️  dist directory not found - run npm run build first');
}

// Summary
console.log('\n📋 Deployment Readiness Summary:');
console.log('================================');

if (filesOk && scriptsOk) {
  console.log('✅ Files and scripts: READY');
} else {
  console.log('❌ Files and scripts: ISSUES FOUND');
}

if (envOk) {
  console.log('✅ Environment variables: READY');
} else {
  console.log('⚠️  Environment variables: MISSING (set in Render dashboard)');
}

console.log('\n🚀 Next Steps:');
console.log('1. Push code to GitHub repository');
console.log('2. Connect repository to Render');
console.log('3. Set environment variables in Render dashboard');
console.log('4. Deploy!');

console.log('\n📖 For detailed instructions, see DEPLOYMENT.md');

if (filesOk && scriptsOk) {
  console.log('\n🎉 Your project is ready for deployment!');
  process.exit(0);
} else {
  console.log('\n⚠️  Please fix the issues above before deploying.');
  process.exit(1);
}
