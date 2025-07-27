#!/usr/bin/env node

// Simple setup checker for Baazar Dost app
console.log('🔍 Checking Baazar Dost Setup...\n')

// Check if .env file exists
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '.env')
const packagePath = path.join(__dirname, 'package.json')

let allGood = true

// Check .env file
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found')
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ]
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName} configured`)
    } else {
      console.log(`❌ ${varName} missing`)
      allGood = false
    }
  })
} else {
  console.log('❌ .env file not found')
  allGood = false
}

// Check package.json
if (fs.existsSync(packagePath)) {
  console.log('✅ package.json found')
  
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  
  const requiredDeps = [
    'react',
    'firebase',
    'react-router-dom',
    'react-i18next'
  ]
  
  requiredDeps.forEach(dep => {
    if (packageContent.dependencies && packageContent.dependencies[dep]) {
      console.log(`✅ ${dep} dependency found`)
    } else {
      console.log(`❌ ${dep} dependency missing`)
      allGood = false
    }
  })
} else {
  console.log('❌ package.json not found')
  allGood = false
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules')
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules found')
} else {
  console.log('❌ node_modules not found - run "npm install"')
  allGood = false
}

console.log('\n' + '='.repeat(50))

if (allGood) {
  console.log('🎉 Setup looks good! You can start the app with:')
  console.log('   npm run dev')
  console.log('\n📱 Then open: http://localhost:5173')
  console.log('\n🔥 Don\'t forget to enable Authentication and Firestore in Firebase Console!')
  console.log('   https://console.firebase.google.com/project/baazar-dost')
} else {
  console.log('⚠️  Some issues found. Please check the errors above.')
  console.log('\n📖 See QUICK_START.md for detailed instructions.')
}

console.log('\n🚀 Happy coding!')
