#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 Verificando configuração de ambiente...\n')

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env')
const envExists = fs.existsSync(envPath)

if (!envExists) {
  console.log('❌ Arquivo .env não encontrado!')
  console.log(
    '📝 Crie um arquivo .env na raiz do projeto baseado no env.example',
  )
  console.log('💡 Exemplo:')
  console.log('   cp env.example .env')
  console.log(
    '   # Depois edite o arquivo .env com suas credenciais do Spotify\n',
  )
  process.exit(1)
}

console.log('✅ Arquivo .env encontrado')

// Read and check .env file
const envContent = fs.readFileSync(envPath, 'utf8')
const envLines = envContent.split('\n')

const requiredVars = [
  'VITE_SPOTIFY_CLIENT_ID',
  'VITE_SPOTIFY_CLIENT_SECRET',
  'VITE_SPOTIFY_REDIRECT_URI',
]

const missingVars = []
const emptyVars = []

for (const varName of requiredVars) {
  const line = envLines.find((line) => line.startsWith(varName + '='))

  if (!line) {
    missingVars.push(varName)
  } else {
    const value = line.split('=')[1]?.trim()
    if (
      !value ||
      value === 'your_spotify_client_id_here' ||
      value === 'your_spotify_client_secret_here'
    ) {
      emptyVars.push(varName)
    }
  }
}

if (missingVars.length > 0) {
  console.log('❌ Variáveis de ambiente ausentes:')
  missingVars.forEach((varName) => {
    console.log(`   - ${varName}`)
  })
  console.log()
}

if (emptyVars.length > 0) {
  console.log('⚠️  Variáveis de ambiente com valores padrão:')
  emptyVars.forEach((varName) => {
    console.log(`   - ${varName}`)
  })
  console.log()
}

if (missingVars.length === 0 && emptyVars.length === 0) {
  console.log(
    '✅ Todas as variáveis de ambiente estão configuradas corretamente!',
  )
  console.log('🚀 Você pode executar o projeto agora.')
} else {
  console.log('📝 Para configurar as variáveis:')
  console.log('1. Acesse https://developer.spotify.com/dashboard')
  console.log('2. Crie um novo app ou use um existente')
  console.log('3. Copie o Client ID e Client Secret')
  console.log(
    '4. Configure a Redirect URI como: http://127.0.0.1:5173/callback',
  )
  console.log('5. Edite o arquivo .env com suas credenciais')
  console.log()
  console.log('💡 Exemplo de configuração:')
  console.log('   VITE_SPOTIFY_CLIENT_ID=abc123def456ghi789')
  console.log('   VITE_SPOTIFY_CLIENT_SECRET=xyz789uvw123abc456')
  console.log('   VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback')

  if (missingVars.length > 0 || emptyVars.length > 0) {
    process.exit(1)
  }
}
