# Variáveis de Ambiente

Este documento explica as variáveis de ambiente utilizadas no projeto e como configurá-las.

## 🔐 Variáveis Obrigatórias

### Spotify API

- `VITE_SPOTIFY_CLIENT_ID`: ID do cliente Spotify (obrigatório)
- `VITE_SPOTIFY_REDIRECT_URI`: URI de redirecionamento após autenticação (obrigatório)

## ⚙️ Variáveis Opcionais

### Aplicação

- `VITE_APP_NAME`: Nome da aplicação (padrão: "Spotify Artist Explorer")
- `VITE_APP_VERSION`: Versão da aplicação (padrão: "1.0.0")

### API

- `VITE_API_TIMEOUT`: Timeout das requisições em ms (padrão: 10000)
- `VITE_API_RETRY_ATTEMPTS`: Número de tentativas de retry (padrão: 3)

## 🚀 Configuração por Ambiente

### Desenvolvimento

```bash
# Copie o arquivo de exemplo
cp env.example .env.local

# Configure suas variáveis
VITE_SPOTIFY_CLIENT_ID=seu_client_id_aqui
VITE_SPOTIFY_REDIRECT_URI=https://localhost:5173/callback
```

### Produção

```bash
# Configure as variáveis no seu servidor/plataforma
VITE_SPOTIFY_CLIENT_ID=seu_client_id_producao
VITE_SPOTIFY_REDIRECT_URI=https://seudominio.com/callback
VITE_APP_VERSION=1.0.0
```

## 🔒 Segurança

### ❌ NUNCA commite no Git:

- `.env.local`
- `.env.production`
- Qualquer arquivo com credenciais reais

### ✅ Pode commitar no Git:

- `env.example` (arquivo de exemplo)
- `.env.example` (se existir)

## 🛠️ Como Obter o Client ID do Spotify

1. Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Faça login com sua conta Spotify
3. Clique em "Create App"
4. Preencha as informações do app
5. Copie o "Client ID"
6. Configure o "Redirect URI" nas configurações do app

## 📝 Exemplo de Arquivo .env.local

```env
# Spotify API Configuration
VITE_SPOTIFY_CLIENT_ID=c6c3457349a542d59b8e0dcc39c4047a
VITE_SPOTIFY_REDIRECT_URI=https://localhost:5173/callback

# Application Configuration
VITE_APP_VERSION=1.0.0
VITE_APP_NAME=Spotify Artist Explorer

# API Configuration
VITE_API_TIMEOUT=10000
VITE_API_RETRY_ATTEMPTS=3

# Environment
NODE_ENV=development
```
