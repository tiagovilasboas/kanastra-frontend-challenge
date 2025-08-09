# 🚀 Guia de Deploy

## 🌐 Deploy Automático

### Vercel (Recomendado)

O projeto está configurado para deploy automático no Vercel:

- **URL de Produção**: [https://kanastra-frontend-challenge.vercel.app/](https://kanastra-frontend-challenge.vercel.app/)
- **Deploy Automático**: A cada push para `main`
- **Preview Deploys**: A cada Pull Request

### Configuração do Vercel

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

## 🔧 Configuração de Ambiente

### Variáveis de Ambiente

Configure as seguintes variáveis no Vercel:

```env
# Spotify API
VITE_SPOTIFY_CLIENT_ID=seu_client_id_aqui
VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
VITE_SPOTIFY_REDIRECT_URI=https://kanastra-frontend-challenge.vercel.app/callback

# Ambiente
NODE_ENV=production
```

### Configuração no Vercel Dashboard

1. Acesse o projeto no [Vercel Dashboard](https://vercel.com/dashboard)
2. Vá em **Settings** → **Environment Variables**
3. Adicione as variáveis acima
4. Configure para todos os ambientes (Production, Preview, Development)

## 🏗️ Build Process

### Comandos de Build

```bash
# Build de produção
npm run build

# Verificação de tipos
npm run type-check

# Testes antes do build
npm run test

# Análise de bundle
npm run analyze
```

### Otimizações de Build

- **Tree Shaking**: Eliminação de código não utilizado
- **Code Splitting**: 18 chunks otimizados
- **Minification**: Compressão de código
- **Asset Optimization**: Otimização de imagens

## 📊 Monitoramento de Deploy

### Métricas de Performance

Após cada deploy, verifique:

```bash
# Auditoria de performance
npm run lighthouse

# Análise de bundle
npm run analyze
```

### Métricas Esperadas

- **LCP**: < 3.0s
- **FCP**: < 2.5s
- **CLS**: < 0.1
- **Bundle Size**: < 500KB (principal)

## 🔄 CI/CD Pipeline

### GitHub Actions

O projeto inclui GitHub Actions para:

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20.18.0'
      - run: npm ci
      - run: npm run test
      - run: npm run build
```

### Pre-commit Hooks

```bash
# Hooks configurados com Husky
npm run lint          # ESLint
npm run type-check    # TypeScript
npm run test          # Testes unitários
npm run build         # Build de verificação
```

## 🚨 Troubleshooting de Deploy

### Problemas Comuns

#### Build Fails

```bash
# Verificar logs do Vercel
vercel logs

# Build local para debug
npm run build

# Verificar dependências
npm ls
```

#### Environment Variables

```bash
# Verificar variáveis no Vercel
vercel env ls

# Adicionar variável
vercel env add VITE_SPOTIFY_CLIENT_ID
```

#### Performance Issues

```bash
# Auditoria local
npm run lighthouse

# Análise de bundle
npm run analyze
```

## 🔐 Segurança

### Headers de Segurança

```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### CSP (Content Security Policy)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.spotify.com;"
        }
      ]
    }
  ]
}
```

## 📱 PWA Configuration

### Service Worker

```javascript
// public/sw.js
const CACHE_NAME = 'spotify-clone-v1'
const STATIC_ASSETS = ['/', '/manifest.json', '/spotify-icon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }),
  )
})
```

### Manifest

```json
// public/manifest.json
{
  "name": "Spotify Explorer",
  "short_name": "Spotify",
  "description": "Explore artists, albums and songs from Spotify",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#121212",
  "theme_color": "#1DB954",
  "icons": [
    {
      "src": "/spotify-icon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}
```

## 🌍 Domínios e SSL

### Configuração de Domínio

1. **Vercel**: Domínio automático configurado
2. **Custom Domain**: Configurável no dashboard do Vercel
3. **SSL**: Certificado automático fornecido pelo Vercel

### Redirecionamentos

```json
// vercel.json
{
  "redirects": [
    {
      "source": "/callback",
      "destination": "/callback",
      "permanent": false
    }
  ]
}
```

## 📈 Analytics e Monitoramento

### Web Vitals

```typescript
// Monitoramento automático configurado
import { onLCP, onFID, onCLS } from 'web-vitals'

onLCP(console.log)
onFID(console.log)
onCLS(console.log)
```

### Error Tracking

```typescript
// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason)
})
```

## 🔄 Rollback Strategy

### Deploy Anterior

```bash
# Reverter para deploy anterior no Vercel
vercel rollback

# Ou via dashboard do Vercel
# Deploy → Three dots → Promote to Production
```

### Versionamento

```bash
# Tags para releases
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

## 📋 Checklist de Deploy

### Antes do Deploy

- [ ] Todos os testes passando
- [ ] Build local funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Performance verificada
- [ ] SEO otimizado

### Após o Deploy

- [ ] Verificar funcionamento da aplicação
- [ ] Testar autenticação Spotify
- [ ] Verificar métricas de performance
- [ ] Testar responsividade
- [ ] Verificar acessibilidade

## 🛠️ Comandos Úteis

### Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy manual
vercel

# Deploy para produção
vercel --prod

# Ver logs
vercel logs

# Listar projetos
vercel ls
```

### Debug de Deploy

```bash
# Build local
npm run build

# Preview local
npm run preview

# Análise de bundle
npm run analyze

# Auditoria de performance
npm run lighthouse
```

## 📚 Recursos Adicionais

### Documentação

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Deploy Guide](https://create-react-app.dev/docs/deployment/)

### Ferramentas

- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Vercel Analytics](https://vercel.com/analytics)
