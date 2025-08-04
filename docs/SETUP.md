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

## Verificação da Configuração

Para verificar se tudo está configurado corretamente:

```bash
npm run type-check  # Verifica tipos TypeScript
npm run lint        # Verifica código
npm run test        # Executa testes
```

## Troubleshooting

### Erro de credenciais

Se você receber erro de credenciais:

1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Confirme se as credenciais estão corretas (sem espaços extras)
3. Reinicie o servidor após configurar as credenciais

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
