#!/usr/bin/env node

/**
 * Script para executar auditoria Lighthouse
 *
 * Uso:
 *   node scripts/lighthouse.js [opções]
 *
 * Opções:
 *   --dev     Testa ambiente de desenvolvimento (porta 5175)
 *   --prod    Testa ambiente de produção (porta 4173)
 *   --ci      Modo CI com saída JSON
 *   --url     URL customizada para testar
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const args = process.argv.slice(2)
const isDev = args.includes('--dev')
const isProd = args.includes('--prod')
const isCI = args.includes('--ci')
const customUrl = args.find((arg) => arg.startsWith('--url='))?.split('=')[1]

async function runLighthouse() {
  try {
    let url = 'http://localhost:5175'
    let outputPath = './lighthouse-dev-report.html'
    let outputFormat = 'html'

    if (customUrl) {
      url = customUrl
      outputPath = './lighthouse-custom-report.html'
    } else if (isProd) {
      console.log('🔨 Buildando aplicação...')
      execSync('npm run build', { stdio: 'inherit' })

      console.log('🚀 Iniciando servidor de preview...')
      execSync('npm run preview &', { stdio: 'inherit' })

      // Aguarda o servidor iniciar
      await new Promise((resolve) => setTimeout(resolve, 5000))

      url = 'http://localhost:4173'
      outputPath = './lighthouse-prod-report.html'
    } else if (isCI) {
      outputFormat = 'json'
      outputPath = './lighthouse-report.json'

      console.log('🔨 Buildando aplicação...')
      execSync('npm run build', { stdio: 'inherit' })

      console.log('🚀 Iniciando servidor de preview...')
      execSync('npm run preview &', { stdio: 'inherit' })

      await new Promise((resolve) => setTimeout(resolve, 5000))

      url = 'http://localhost:4173'
    }

    console.log(`📊 Executando Lighthouse em: ${url}`)
    console.log(`📁 Relatório será salvo em: ${outputPath}`)

    const lighthouseCommand = `npx lighthouse ${url} --output ${outputFormat} --output-path ${outputPath} --chrome-flags='--headless --no-sandbox --disable-dev-shm-usage' --only-categories=performance,accessibility,best-practices,seo`

    execSync(lighthouseCommand, { stdio: 'inherit' })

    if (fs.existsSync(outputPath)) {
      const stats = fs.statSync(outputPath)
      console.log(`✅ Relatório gerado com sucesso!`)
      console.log(`📄 Arquivo: ${path.resolve(outputPath)}`)
      console.log(`📏 Tamanho: ${(stats.size / 1024).toFixed(2)} KB`)

      if (outputFormat === 'json') {
        const report = JSON.parse(fs.readFileSync(outputPath, 'utf8'))
        const scores = report.categories

        console.log('\n📈 Scores do Lighthouse:')
        console.log(
          `🚀 Performance: ${Math.round(scores.performance.score * 100)}%`,
        )
        console.log(
          `♿ Acessibilidade: ${Math.round(scores.accessibility.score * 100)}%`,
        )
        console.log(
          `🛠️  Best Practices: ${Math.round(scores['best-practices'].score * 100)}%`,
        )
        console.log(`📈 SEO: ${Math.round(scores.seo.score * 100)}%`)

        // Core Web Vitals
        if (report.audits) {
          console.log('\n🎯 Core Web Vitals:')
          const fcp = report.audits['first-contentful-paint']
          const lcp = report.audits['largest-contentful-paint']
          const fid = report.audits['max-potential-fid']
          const cls = report.audits['cumulative-layout-shift']

          if (fcp) console.log(`⚡ FCP: ${fcp.displayValue}`)
          if (lcp) console.log(`🎨 LCP: ${lcp.displayValue}`)
          if (fid) console.log(`🖱️  FID: ${fid.displayValue}`)
          if (cls) console.log(`📐 CLS: ${cls.displayValue}`)
        }
      }
    }

    // Limpa processos se necessário
    if (isProd || isCI) {
      console.log('🧹 Limpando processos...')
      execSync('npm run kill-port:preview', { stdio: 'inherit' })
    }
  } catch (error) {
    console.error('❌ Erro ao executar Lighthouse:', error.message)
    process.exit(1)
  }
}

// Executar script
runLighthouse().catch(console.error)
