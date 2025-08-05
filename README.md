# 🎵 Spotify Explorer

Uma aplicação React moderna para explorar artistas, álbuns e músicas do Spotify, construída com TypeScript, Vite e Tailwind CSS. Oferece uma experiência similar ao Spotify com busca inteligente e interface responsiva.

## 🌐 Demo Online

**Acesse a aplicação em:** **[https://kanastra-frontend-challenge.vercel.app/](https://kanastra-frontend-challenge.vercel.app/)**

## ✨ Funcionalidades Principais

### 🎯 **Busca Inteligente**

- **Busca Segmentada**: Resultados organizados por artistas, álbuns e músicas
- **Busca Inteligente de Artistas**: Segmentação automática (exatos, similares, relacionados, outros)
- **Filtros Avançados**: Gênero, ano, popularidade, mercado e conteúdo explícito
- **Busca em Tempo Real**: Com debounce para otimização de performance

### 🎨 **Interface Spotify-like**

- **Layout Responsivo**: Grid adaptativo para diferentes tamanhos de tela
- **Cards Interativos**: Hover effects e animações suaves
- **Lista de Músicas**: Layout horizontal similar ao Spotify
- **Skeletons Inteligentes**: Loading states consistentes com os componentes

### 🔐 **Autenticação Inteligente**

- **Modo Público**: Busca básica sem login (client credentials)
- **Modo Autenticado**: Funcionalidades completas com OAuth 2.0
- **Persistência de Token**: Gerenciamento automático de sessão

### 🌍 **Internacionalização Completa**

- **Português e Inglês**: Interface totalmente traduzida
- **Interpolação Dinâmica**: Variáveis dinâmicas em traduções
- **Organização por Domínio**: Traduções organizadas por contexto

### 📱 **Experiência Mobile**

- **Header Responsivo**: Adaptação para iPhone e dispositivos móveis
- **Navegação Otimizada**: Sidebar e navegação mobile-friendly
- **Touch-friendly**: Elementos otimizados para toque

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
4. Configure as URLs de redirecionamento no dashboard
5. Crie o arquivo `.env` na raiz do projeto:

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

## 🛠️ Stack Tecnológico

### **Frontend**

- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento client-side
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI modernos

### **Estado e Dados**

- **Zustand** - Gerenciamento de estado global
- **React Query (TanStack Query)** - Cache e sincronização de dados
- **Axios** - Cliente HTTP

### **Internacionalização**

- **react-i18next** - Sistema de traduções
- **i18next** - Framework de internacionalização

### **Qualidade de Código**

- **ESLint** - Linting de código
- **Prettier** - Formatação automática
- **Husky** - Git hooks
- **Vitest** - Framework de testes

### **Deploy**

- **Vercel** - Plataforma de deploy
- **GitHub Actions** - CI/CD (se configurado)

## 📦 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificar código
npm run lint:fix     # Corrigir problemas de lint automaticamente
npm run test         # Executar testes
npm run type-check   # Verificar tipos TypeScript
```

## 🏗️ Arquitetura do Projeto

### **Estrutura de Pastas**

```
src/
├── app/                 # Configuração da aplicação
├── components/          # Componentes reutilizáveis
│   ├── artist/         # Componentes específicos de artistas
│   ├── layout/         # Componentes de layout
│   ├── ui/             # Componentes base (shadcn/ui)
│   └── ErrorBoundary/  # Tratamento de erros
├── hooks/              # Custom hooks
├── pages/              # Páginas da aplicação
├── repositories/       # Camada de acesso a dados
├── stores/             # Estado global (Zustand)
├── types/              # Definições TypeScript
├── utils/              # Utilitários
├── locales/            # Arquivos de tradução
└── styles/             # Estilos globais
```

### **Padrões de Desenvolvimento**

- **Separation of Concerns**: Lógica separada por domínio
- **Repository Pattern**: Camada de abstração para APIs
- **Custom Hooks**: Lógica reutilizável encapsulada
- **Type Safety**: TypeScript em toda a aplicação
- **Component Composition**: Componentes pequenos e focados

## 🎯 Funcionalidades Detalhadas

### **Página Inicial**

- **Artistas Populares**: Grid responsivo com cards interativos
- **Navegação Intuitiva**: Links para busca e outras páginas
- **Estado Limpo**: Reset automático de buscas anteriores

### **Busca**

- **Tipos de Conteúdo**: Seletor radio para artistas, álbuns, músicas
- **Resultados Segmentados**: Organização inteligente por relevância
- **Pagination**: "Carregar Mais" para álbuns e músicas
- **Filtros Avançados**: Parâmetros de busca refinados

### **Página do Artista**

- **Informações Detalhadas**: Bio, imagens, estatísticas
- **Top Tracks**: Lista horizontal estilo Spotify
- **Álbuns**: Grid com paginação
- **Refresh Inteligente**: Skeleton loading durante atualização

### **Navegação**

- **Header Responsivo**: Busca, idioma, login
- **Sidebar**: Navegação principal
- **Breadcrumbs**: Navegação contextual
- **Mobile Navigation**: Menu hambúrguer

## 🔧 Configurações Avançadas

### **Variáveis de Ambiente**

```env
# Spotify API
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_client_secret
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback

# Build
VITE_APP_TITLE=Spotify Explorer
VITE_APP_VERSION=1.0.0
```

### **Configuração do Vercel**

O projeto inclui `vercel.json` configurado para:

- Build automático
- Roteamento SPA
- Variáveis de ambiente
- Deploy otimizado

## 📚 Documentação

- **[🔧 Configuração Detalhada](docs/SETUP.md)** - Guia completo de configuração
- **[🎯 Funcionalidades](docs/FEATURES.md)** - Detalhes das funcionalidades de busca
- **[🛠️ Tecnologias](docs/TECHNOLOGIES.md)** - Stack tecnológico utilizado
- **[🔐 Autenticação](docs/AUTHENTICATION.md)** - Como funciona a autenticação
- **[🆘 Suporte](docs/SUPPORT.md)** - Troubleshooting e ajuda

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) pela API robusta
- [shadcn/ui](https://ui.shadcn.com/) pelos componentes UI
- [Vercel](https://vercel.com/) pela plataforma de deploy
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS

---

**Desenvolvido com ❤️ usando React, TypeScript e Spotify Web API**
