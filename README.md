# 🎵 Spotify Explorer

> **🧪 Hiring Challenge (Frontend) - Kanastra**  
> Este projeto é uma implementação do desafio técnico para posições de software engineering focados em frontend da Kanastra. O desafio consiste em criar uma aplicação responsiva que consome a API do Spotify utilizando as melhores práticas de segurança e desenvolvimento.

Uma aplicação React moderna para explorar artistas, álbuns e músicas do Spotify, construída com TypeScript, Vite e Tailwind CSS. Oferece uma experiência similar ao Spotify com busca inteligente, interface responsiva e autenticação OAuth.

## 📋 Sobre o Desafio

### Requisitos Implementados ✅

- ✅ **Consumo da API do Spotify** com melhores práticas de segurança (OAuth 2.0 + PKCE)
- ✅ **Listagem de artistas** com UI chamativa, imagens e animações
- ✅ **Visualização detalhada** de artistas (nome, popularidade, músicas principais, álbuns)
- ✅ **Paginação de álbuns** com 20 itens por página e navegação manual
- ✅ **Filtros avançados** para artistas e álbuns (por nome, gênero, ano)
- ✅ **UI responsiva e chamativa** com Tailwind CSS e componentes customizados

### Diferenciais Implementados 🚀

- ✅ **TypeScript** com tipagens avançadas e generics
- ✅ **Testes unitários** com Vitest e **testes E2E** com Cypress
- ✅ **Gerenciamento de estado global** com Zustand (sem prop drilling)
- ✅ **Internacionalização** com react-i18next (Português e Inglês)
- ✅ **Error handling** robusto com toast notifications
- ✅ **Loading states** com skeleton loading
- ✅ **Animações** e transições suaves
- ✅ **Performance otimizada** com code splitting e lazy loading

## 🌐 Demo Online

**Acesse a aplicação em:** **[https://kanastra-frontend-challenge.vercel.app/](https://kanastra-frontend-challenge.vercel.app/)**

## ✨ Funcionalidades Principais

### 🎯 Core Features

- 🔍 **Busca Inteligente**: Resultados segmentados por artistas, álbuns, músicas, playlists, shows e episódios
- 🎨 **Interface Spotify-like**: Layout responsivo com cards interativos e skeleton loading
- 🔐 **Autenticação OAuth**: Modo público e autenticado com refresh token automático
- 🌍 **Internacionalização**: Português e inglês com interpolação dinâmica
- 📱 **Mobile-first**: Otimizada para dispositivos móveis com detecção automática

### 🚀 Funcionalidades Avançadas

- **Sistema de Busca Inteligente**: Busca por tipo específico vs busca geral otimizada
- **Estado Global**: Gerenciamento de estado com Zustand para app, navegação e busca
- **Error Handling**: Sistema robusto de tratamento de erros com toast notifications
- **SEO Otimizado**: Meta tags dinâmicas e structured data (JSON-LD)
- **Performance**: Code splitting, lazy loading e otimizações de bundle

## 🏗️ Arquitetura do Projeto

```
src/
├── app/                    # Configuração da aplicação e router
├── components/             # Componentes reutilizáveis
│   ├── artist/            # Componentes específicos de artista
│   ├── layout/            # Componentes de layout (Header, etc.)
│   ├── search/            # Componentes de busca
│   ├── SEO/               # Componentes de SEO
│   └── ui/                # Componentes UI base
├── config/                # Configurações (ambiente)
├── hooks/                 # Custom hooks
├── lib/                   # Bibliotecas e configurações
├── locales/               # Arquivos de internacionalização
├── pages/                 # Páginas da aplicação
├── repositories/          # Camada de acesso a dados (Spotify API)
├── schemas/               # Schemas de validação (Zod)
├── services/              # Lógica de negócio
├── stores/                # Estado global (Zustand)
├── types/                 # Definições de tipos TypeScript
└── utils/                 # Utilitários e helpers
```

## 🛠️ Stack Tecnológica

### Integração Contínua

- **Reviewdog** via GitHub Actions: analisa ESLint e Prettier em cada Pull Request, comentando diretamente no diff.

### Frontend

- **React 19** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis

### Estado e Dados

- **Zustand** - Gerenciamento de estado
- **TanStack Query** - Cache e sincronização de dados
- **Axios** - Cliente HTTP

### Desenvolvimento

- **ESLint + Prettier** - Linting e formatação
- **Vitest** - Framework de testes
- **Cypress** - Testes E2E
- **Husky** - Git hooks
- **Lighthouse** - Auditoria de performance

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

## 📦 Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev              # Servidor de desenvolvimento
npm run build            # Build de produção
npm run preview          # Preview do build
npm run type-check       # Verificar tipos TypeScript
```

### Qualidade de Código

```bash
npm run lint             # Verificar código
npm run lint:fix         # Corrigir problemas de lint automaticamente
npm run test             # Executar testes unitários
npm run test:e2e         # Executar testes E2E
```

### Análise e Performance

```bash
npm run analyze          # Análise de bundle
npm run lighthouse       # Auditoria de performance
npm run lighthouse:dev   # Auditoria em desenvolvimento
```

## 🧪 Testes

### Testes Unitários

- **227 testes** cobrindo utilitários, stores, serviços e hooks
- **Cobertura completa** de formatação, validação, autenticação e busca
- **Vitest** como framework principal

### Testes E2E

- **Cypress** para testes end-to-end
- **2 testes focados**: Busca e página de artistas
- **Cobertura dos fluxos críticos** da aplicação

### Exemplo de Execução

```bash
# Executar todos os testes unitários
npm run test

# Executar testes E2E
npm run test:e2e

# Executar testes com coverage
npm run test -- --coverage
```

## ⚙️ Sistema de Busca Inteligente

### Arquitetura Desacoplada

O sistema de busca foi projetado para otimizar performance e precisão:

#### **Busca por Tipo Específico:**

- Cada tipo (álbuns, artistas, etc.) tem seu próprio método dedicado
- Chamadas independentes à API Spotify
- Limites específicos por tipo e dispositivo
- Melhor performance para buscas focadas

#### **Busca "Tudo":**

- Uma única chamada para todos os tipos
- Limite reduzido por tipo (4-5 resultados)
- Otimizado para visão geral

### Detecção Automática de Dispositivo

A aplicação detecta automaticamente se o usuário está em um dispositivo móvel ou desktop:

- **Mobile** (< 768px):
  - 4 resultados de cada tipo quando "tudo" está selecionado
  - 10 álbuns, 15 artistas/músicas, 12 playlists, etc.
- **Desktop** (≥ 768px):
  - 5 resultados de cada tipo quando "tudo" está selecionado
  - 10 álbuns, 25 artistas/músicas, 20 playlists, etc.

### Configuração de Limites

```typescript
// src/config/searchLimits.ts
export const SEARCH_LIMITS: SearchLimitsConfig = {
  default: 20, // Limite padrão para buscas individuais
  all: 5, // Limite quando "tudo" está selecionado
  artist: 20, // Limite específico para artistas
  album: 20, // Limite específico para álbuns
  track: 20, // Limite específico para músicas
  playlist: 20, // Limite específico para playlists
  show: 20, // Limite específico para shows
  episode: 20, // Limite específico para episódios
  audiobook: 20, // Limite específico para audiobooks
}
```

## 🚀 Performance e Otimizações

### Métricas Atuais

| Métrica                            | Valor Atual | Meta   | Status |
| ---------------------------------- | ----------- | ------ | ------ |
| **Lighthouse Performance**         | 73%         | >90%   | 🔄     |
| **Lighthouse Acessibilidade**      | 94%         | >90%   | ✅     |
| **Lighthouse Best Practices**      | 100%        | >90%   | ✅     |
| **Lighthouse SEO**                 | 100%        | >90%   | ✅     |
| **First Contentful Paint (FCP)**   | 2.9s        | <2.5s  | 🔄     |
| **Largest Contentful Paint (LCP)** | 5.6s        | <3.0s  | 🔄     |
| **First Input Delay (FID)**        | 120ms       | <100ms | 🔄     |
| **Cumulative Layout Shift (CLS)**  | 0           | <0.1   | ✅     |
| **Bundle Size (Principal)**        | 356.5KB     | <500KB | ✅     |
| **Bundle Size (Gzip)**             | 108.9KB     | <150KB | ✅     |

### Otimizações Implementadas

- **Code Splitting**: 18 chunks separados por funcionalidade
- **Lazy Loading**: Páginas carregadas sob demanda
- **Skeleton Loading**: Feedback visual durante carregamento
- **Debounce**: Busca otimizada com delay de 300ms
- **Cache Inteligente**: TanStack Query para cache de dados
- **Bundle Analysis**: Análise visual de tamanho de código
- **Logs limpos**: `console.log` removidos, `logger.debug` só em DEV

### Análise de Bundle

```bash
# Análise visual do bundle
npm run analyze
```

**Resultados:**

- **Bundle Principal**: 356.5KB (108.9KB gzip)
- **Chunks Otimizados**: 18 chunks separados por funcionalidade
- **Code Splitting**: Implementado para páginas e componentes
- **Vendor Chunks**: React, UI libraries e utilitários separados

## 🔐 Autenticação e Segurança

### Fluxo OAuth 2.0

- **PKCE (Proof Key for Code Exchange)** para segurança adicional
- **Refresh Token** automático
- **Fallback** para client credentials quando necessário
- **Cookies seguros** para armazenamento de tokens

### Modos de Operação

- **Modo Público**: Acesso limitado com client credentials
- **Modo Autenticado**: Acesso completo com tokens do usuário

## 🌍 Internacionalização

### Idiomas Suportados

- **Português (pt-BR)** - Idioma padrão
- **Inglês (en-US)** - Idioma alternativo

### Recursos

- **Tradução dinâmica** de gêneros musicais
- **Formatação localizada** de números e datas
- **Interpolação** de variáveis nas traduções

## 📱 Responsividade

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Adaptações Automáticas

- **Grid responsivo** para cards
- **Limites de busca** ajustados por dispositivo
- **Navegação otimizada** para mobile

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ por Tiago Vilas Boas**
