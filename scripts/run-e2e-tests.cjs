#!/usr/bin/env node

/**
 * Script para executar testes E2E por domínio
 *
 * Uso:
 *   node scripts/run-e2e-tests.js [domínio]
 *
 * Domínios disponíveis:
 *   - auth: Testes de autenticação
 *   - navigation: Testes de navegação
 *   - search: Testes de busca
 *   - artists: Testes de artistas
 *   - albums: Testes de álbuns
 *   - settings: Testes de configurações
 *   - favorites: Testes de favoritos
 *   - all: Todos os testes (padrão)
 */

const { execSync } = require('child_process')
const path = require('path')

const DOMAINS = {
  auth: 'cypress/e2e/auth.cy.ts',
  navigation: 'cypress/e2e/navigation.cy.ts',
  search: 'cypress/e2e/search.cy.ts',
  artists: 'cypress/e2e/artists.cy.ts',
  albums: 'cypress/e2e/albums.cy.ts',
  settings: 'cypress/e2e/settings.cy.ts',
  favorites: 'cypress/e2e/favorites.cy.ts',
}

function printUsage() {
  console.log('\n📋 Uso: node scripts/run-e2e-tests.js [domínio]\n')
  console.log('🎯 Domínios disponíveis:')
  Object.keys(DOMAINS).forEach((domain) => {
    console.log(`   - ${domain}: Testes de ${getDomainDescription(domain)}`)
  })
  console.log('   - all: Todos os testes (padrão)\n')
  console.log('💡 Exemplos:')
  console.log('   node scripts/run-e2e-tests.js auth')
  console.log('   node scripts/run-e2e-tests.js search')
  console.log('   node scripts/run-e2e-tests.js all\n')
}

function getDomainDescription(domain) {
  const descriptions = {
    auth: 'autenticação',
    navigation: 'navegação',
    search: 'busca',
    artists: 'artistas',
    albums: 'álbuns',
    settings: 'configurações',
    favorites: 'favoritos',
  }
  return descriptions[domain] || domain
}

function runTests(specPath) {
  try {
    console.log(`🚀 Executando testes: ${specPath}`)
    console.log('⏳ Aguarde...\n')

    const command = `npx cypress run --spec "${specPath}"`
    execSync(command, { stdio: 'inherit' })

    console.log('\n✅ Testes concluídos com sucesso!')
  } catch (error) {
    console.error('\n❌ Erro ao executar testes:', error.message)
    process.exit(1)
  }
}

function runAllTests() {
  try {
    console.log('🚀 Executando todos os testes E2E')
    console.log('⏳ Aguarde...\n')

    const command = 'npx cypress run'
    execSync(command, { stdio: 'inherit' })

    console.log('\n✅ Todos os testes concluídos com sucesso!')
  } catch (error) {
    console.error('\n❌ Erro ao executar testes:', error.message)
    process.exit(1)
  }
}

function main() {
  const domain = process.argv[2] || 'all'

  if (domain === 'help' || domain === '--help' || domain === '-h') {
    printUsage()
    return
  }

  if (domain === 'all') {
    runAllTests()
    return
  }

  if (!DOMAINS[domain]) {
    console.error(`❌ Domínio inválido: ${domain}`)
    printUsage()
    process.exit(1)
  }

  const specPath = DOMAINS[domain]
  runTests(specPath)
}

// Executar script
main()
