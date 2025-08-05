# 🎵 Spotify Explorer

Uma aplicação React moderna para explorar artistas, álbuns e músicas do Spotify, construída com TypeScript, Vite e Tailwind CSS. Oferece uma experiência similar ao Spotify com busca inteligente e interface responsiva.

## 🌐 Demo Online

**Acesse a aplicação em:** **[https://kanastra-frontend-challenge.vercel.app/](https://kanastra-frontend-challenge.vercel.app/)**

## ✨ Funcionalidades Principais

- 🔍 **Busca Inteligente**: Resultados segmentados por artistas, álbuns e músicas
- 🎨 **Interface Spotify-like**: Layout responsivo com cards interativos
- 🔐 **Autenticação Inteligente**: Modo público e autenticado
- 🌍 **Internacionalização**: Português e inglês com interpolação dinâmica
- 📱 **Mobile-first**: Otimizada para dispositivos móveis

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

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificar código
npm run lint:fix     # Corrigir problemas de lint automaticamente
npm run test         # Executar testes
npm run type-check   # Verificar tipos TypeScript
npm run test:e2e     # Executar testes E2E
npm run analyze      # Análise de bundle
npm run lighthouse   # Auditoria de performance
```

## 📚 Documentação

- **[🔧 Configuração Detalhada](docs/SETUP.md)** - Guia completo de configuração
- **[🔐 Autenticação](docs/AUTHENTICATION.md)** - Como funciona a autenticação
- **[🧪 Testes E2E](docs/E2E_TESTING.md)** - Documentação dos testes end-to-end

## 🚀 Performance e Otimizações

### Análise de Performance

```bash
# Auditoria Lighthouse em desenvolvimento
npm run lighthouse:dev

# Auditoria Lighthouse em produção
npm run lighthouse

# Análise visual do bundle
npm run analyze
```

### Resultados do Bundle Analysis

Com base na análise de bundle, temos:

- **Bundle Principal**: 356.5KB (108.9KB gzip)
- **Chunks Otimizados**: 18 chunks separados por funcionalidade
- **Code Splitting**: Implementado para páginas e componentes
- **Vendor Chunks**: React, UI libraries e utilitários separados
- **Feature Chunks**: Autenticação, busca, artistas e álbuns isolados

O bundle está bem otimizado com code splitting estratégico, resultando em carregamento mais rápido das páginas individuais.

### Otimizações Implementadas

- **Lazy Loading**: Páginas carregadas sob demanda
- **Code Splitting**: Separação inteligente de chunks
- **Limites Configuráveis**: Sistema parametrizável de limites de busca por página

## ⚙️ Configuração de Limites de Busca

A aplicação possui um sistema flexível de configuração de limites de busca que permite personalizar quantos resultados são exibidos por tipo de conteúdo.

### Configuração Padrão

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

### Configuração Personalizada

Você pode criar configurações personalizadas para diferentes contextos:

```typescript
// Exemplo: Configuração para mobile
export const MOBILE_SEARCH_LIMITS: SearchLimitsConfig = {
  default: 15,
  all: 4, // 4 de cada tipo quando "tudo" está selecionado
  artist: 15,
  album: 15,
  // ... outros tipos
}
```

### Arquitetura de Busca Desacoplada

O sistema de busca foi desacoplado para otimizar performance e precisão:

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

A aplicação detecta automaticamente se o usuário está em um dispositivo móvel ou desktop e aplica a configuração apropriada:

- **Mobile** (< 768px):
  - 4 resultados de cada tipo quando "tudo" está selecionado
  - 10 álbuns, 15 artistas/músicas, 12 playlists, etc.
- **Desktop** (≥ 768px):
  - 5 resultados de cada tipo quando "tudo" está selecionado
  - 10 álbuns, 25 artistas/músicas, 20 playlists, etc.

**Importante**: O limite de 5 é aplicado **somente** quando "tudo" está selecionado. Para tipos específicos (álbuns, artistas, etc.), cada um usa seu próprio limite e faz uma chamada independente à API.

```typescript
// Detecção automática
const config = getDeviceBasedConfig() // Retorna MOBILE_SEARCH_LIMITS ou DESKTOP_SEARCH_LIMITS
const limit = getSearchLimitWithDevice(types) // Usa a configuração apropriada automaticamente
```

### Como Usar

```typescript
import { getSearchLimit } from '@/config/searchLimits'
import { CUSTOM_SEARCH_LIMITS } from './searchLimits.custom'

// Usar configuração padrão
const limit = getSearchLimit(types)

// Usar configuração personalizada
const limit = getSearchLimit(types, CUSTOM_SEARCH_LIMITS)
```

### Benefícios

- **Flexibilidade**: Diferentes limites para diferentes contextos
- **Performance**: Controle sobre o volume de dados transferidos
- **UX**: Experiência otimizada para cada dispositivo/contexto
- **Manutenibilidade**: Configuração centralizada e fácil de ajustar
- **Debounce**: Busca otimizada com delay de 300ms
- **Pré-carregamento**: Recursos críticos pré-carregados
- **Bundle Analysis**: Análise visual de tamanho de código

### Métricas Reais Coletadas

| Métrica                            | Valor Atual | Meta   |
| ---------------------------------- | ----------- | ------ |
| **Lighthouse Performance**         | 61%         | >90%   |
| **Lighthouse Acessibilidade**      | 93%         | >90%   |
| **Lighthouse Best Practices**      | 96%         | >90%   |
| **Lighthouse SEO**                 | 100%        | >90%   |
| **First Contentful Paint (FCP)**   | 2.9s        | <2.5s  |
| **Largest Contentful Paint (LCP)** | 4.6s        | <3.0s  |
| **First Input Delay (FID)**        | 90ms        | <100ms |
| **Cumulative Layout Shift (CLS)**  | 0.265       | <0.1   |
| **Bundle Size (Principal)**        | 356.5KB     | <500KB |
| **Bundle Size (Gzip)**             | 108.9KB     | <150KB |

### Oportunidades de Otimização

Com base nas métricas coletadas, identificamos as seguintes oportunidades:

- **Performance (61%)**: Otimizar LCP e CLS para melhorar a experiência do usuário
- **Layout Shift (0.265)**: Implementar dimensões explícitas para imagens e elementos
- **LCP (4.6s)**: Otimizar carregamento de recursos críticos

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com React, TypeScript e Spotify Web API**
