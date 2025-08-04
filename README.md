# 🎵 Spotify Explorer

Uma aplicação React moderna para explorar artistas do Spotify, construída com TypeScript, Vite e Tailwind CSS.

## ✨ Funcionalidades

- 🔍 **Busca Avançada de Artistas**: Pesquise artistas com filtros por gênero, ano, popularidade e mercado
- 🎨 **Interface Moderna**: Design responsivo com Tailwind CSS e shadcn/ui
- 🌍 **Internacionalização**: Suporte para português e inglês
- 🔐 **Autenticação Inteligente**:
  - **Logado**: Usa token de acesso do usuário para funcionalidades completas
  - **Deslogado**: Usa client credentials para busca básica de artistas
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile

## 🚀 Configuração Rápida

### 1. Clone e instale

```bash
git clone <repository-url>
cd kanastra-frontend-challenge
npm install
```

### 2. Configure as credenciais do Spotify

1. Acesse o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crie um novo aplicativo ou use um existente
3. Copie o **Client ID** e **Client Secret**
4. Edite o arquivo `.env` na raiz do projeto:

```env
VITE_SPOTIFY_CLIENT_ID=seu_client_id_aqui
VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
```

### 3. Execute a aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://127.0.0.1:5173`

## 📦 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificar código
npm run test         # Executar testes
```

## 📚 Documentação

- **[🔧 Configuração Detalhada](docs/SETUP.md)** - Guia completo de configuração
- **[🎯 Funcionalidades](docs/FEATURES.md)** - Detalhes das funcionalidades de busca
- **[🛠️ Tecnologias](docs/TECHNOLOGIES.md)** - Stack tecnológico utilizado
- **[🔐 Autenticação](docs/AUTHENTICATION.md)** - Como funciona a autenticação
- **[🆘 Suporte](docs/SUPPORT.md)** - Troubleshooting e ajuda

## 📄 Licença

Este projeto está sob a licença MIT.
