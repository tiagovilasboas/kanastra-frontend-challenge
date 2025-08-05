# 🔧 Configuração Detalhada

## Pré-requisitos

- Node.js 20.18.0 ou superior
- npm ou yarn
- Conta no Spotify Developer Dashboard

## Passo a Passo

### 1. Clone o repositório

```bash
git clone <repository-url>
cd kanastra-frontend-challenge
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Spotify Developer Dashboard

1. **Acesse o Dashboard**:
   - Vá para [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
   - Faça login com sua conta do Spotify

2. **Crie um novo aplicativo**:
   - Clique em "Create App"
   - Nome: `Spotify Explorer` (ou qualquer nome)
   - Descrição: `Aplicação para explorar artistas e músicas`
   - Website: `http://localhost:5173`
   - Redirect URI: `http://127.0.0.1:5173/callback`

3. **Copie as credenciais**:
   - **Client ID**: Copie o valor mostrado
   - **Client Secret**: Clique em "Show Client Secret" e copie

### 4. Configure as variáveis de ambiente

Edite o arquivo `.env` na raiz do projeto:

```env
# Spotify API Configuration
VITE_SPOTIFY_CLIENT_ID=seu_client_id_aqui
VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback

# App Configuration
VITE_APP_NAME=Spotify Explorer
VITE_APP_VERSION=1.0.0

# API Configuration
VITE_API_TIMEOUT=10000
VITE_API_RETRY_ATTEMPTS=3

# Environment
NODE_ENV=development
```

### 5. Execute a aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://127.0.0.1:5173`

## Deploy na Vercel

### 1. Prepare o projeto para produção

```bash
# Build de produção
npm run build

# Preview do build
npm run preview
```

### 2. Configure o Spotify Dashboard para produção

1. **Adicione URLs de produção**:
   - Website: `https://seu-dominio.vercel.app`
   - Redirect URI: `https://seu-dominio.vercel.app/callback`

2. **Configure variáveis de ambiente na Vercel**:
   - `VITE_SPOTIFY_CLIENT_ID`: Seu Client ID
   - `VITE_SPOTIFY_CLIENT_SECRET`: Seu Client Secret
   - `VITE_SPOTIFY_REDIRECT_URI`: `https://seu-dominio.vercel.app/callback`

### 3. Deploy automático

O projeto já está configurado com `vercel.json` para deploy automático:

```json
{
  "name": "kanastra-frontend-challenge",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 4. Deploy manual

```bash
# Instale o Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy para produção
vercel --prod
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run dev:host         # Servidor acessível externamente

# Build
npm run build            # Build de produção
npm run preview          # Preview do build

# Qualidade de código
npm run lint             # Verificar código
npm run lint:fix         # Corrigir problemas automaticamente
npm run type-check       # Verificar tipos TypeScript

# Testes
npm run test             # Executar testes
npm run test:ui          # Interface visual de testes
npm run test:coverage    # Relatório de cobertura

# Utilitários
npm run clean            # Limpar arquivos temporários
npm run format           # Formatar código
```

## Verificação da Configuração

Para verificar se tudo está configurado corretamente:

```bash
npm run type-check  # Verifica tipos TypeScript
npm run lint        # Verifica código
npm run test        # Executa testes
npm run build       # Testa build de produção
```

## Configuração de Produção

### Variáveis de Ambiente de Produção

```env
# Spotify API Configuration
VITE_SPOTIFY_CLIENT_ID=seu_client_id_producao
VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret_producao
VITE_SPOTIFY_REDIRECT_URI=https://seu-dominio.vercel.app/callback

# App Configuration
VITE_APP_NAME=Spotify Explorer
VITE_APP_VERSION=1.0.0

# Environment
NODE_ENV=production
```

### Otimizações de Produção

- **Code Splitting**: Páginas carregadas sob demanda
- **Bundle Optimization**: Chunks separados para vendor libraries
- **Image Optimization**: Imagens otimizadas automaticamente
- **Caching**: Headers de cache configurados
- **Compression**: Gzip/Brotli habilitado

## Troubleshooting

### Erro de credenciais

Se você receber erro de credenciais:

1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Confirme se as credenciais estão corretas (sem espaços extras)
3. Reinicie o servidor após configurar as credenciais
4. Verifique se as URLs de redirecionamento estão configuradas corretamente

### Erro de porta

Se a porta 5173 estiver ocupada:

```bash
# Encerre o processo na porta
lsof -ti:5173 | xargs kill -9

# Ou use uma porta diferente
npm run dev -- --port 3000
```

### Erro de CORS

Se houver problemas de CORS:

1. Verifique se o Redirect URI está configurado corretamente no Spotify Dashboard
2. Certifique-se de que está usando `http://127.0.0.1:5173` e não `http://localhost:5173`
3. Para produção, use HTTPS e o domínio correto

### Erro de build

Se houver problemas no build:

```bash
# Limpe cache
npm run clean

# Reinstale dependências
rm -rf node_modules package-lock.json
npm install

# Tente build novamente
npm run build
```

### Problemas de deploy na Vercel

1. **Verifique logs**: Acesse os logs no dashboard da Vercel
2. **Variáveis de ambiente**: Confirme se estão configuradas corretamente
3. **Build logs**: Verifique se o build está passando
4. **Domínio**: Confirme se o domínio está configurado corretamente
