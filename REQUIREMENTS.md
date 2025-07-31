# 📋 Requisitos do Desafio - Kanastra Frontend Challenge

## 📄 Documento Base

Este arquivo documenta os requisitos específicos extraídos do PDF `Hiring_Challenge_(Frontend).pdf` e do roadmap fornecido.

## 🎯 Objetivos do Desafio

### Contexto

Desenvolvimento de uma aplicação frontend que integra com a **Spotify Web API** para buscar e exibir informações sobre artistas, músicas e álbuns.

### Problema a Ser Resolvido

Criar uma interface moderna e responsiva que permita aos usuários:

- Buscar artistas por nome
- Visualizar detalhes dos artistas
- Explorar top músicas dos artistas
- Navegar pelos álbuns com paginação

### Solução Esperada

Uma aplicação web completa com integração à Spotify Web API, interface atrativa e funcionalidades de busca e navegação.

## 📋 Requisitos Funcionais

### RF01 - Busca de Artistas

- **Descrição:** Implementar busca de artistas por nome com filtro
- **Critérios de Aceitação:**
  - [ ] Campo de busca com debounce
  - [ ] Lista de artistas em grid responsivo
  - [ ] Cards atrativos com informações básicas
  - [ ] Loading state durante a busca

### RF02 - Detalhes do Artista

- **Descrição:** Página de detalhes do artista selecionado
- **Critérios de Aceitação:**
  - [ ] Exibir nome e popularidade do artista
  - [ ] Listar top músicas do artista
  - [ ] Mostrar lista de álbuns com paginação (20 por página)
  - [ ] Navegação entre páginas de álbuns

### RF03 - Filtros e Paginação

- **Descrição:** Sistema de filtros e paginação para álbuns
- **Critérios de Aceitação:**
  - [ ] Filtro por nome do álbum
  - [ ] Paginação manual dos álbuns
  - [ ] Estados de loading e erro
  - [ ] Feedback para listas vazias

### RF04 - Navegação e Layout

- **Descrição:** Sistema de navegação e layout responsivo
- **Critérios de Aceitação:**
  - [ ] Rota `/` para listagem de artistas
  - [ ] Rota `/artist/:id` para detalhes do artista
  - [ ] Layout responsivo (mobile-first)
  - [ ] Header com navegação

## 🎨 Requisitos Não Funcionais

### RNF01 - Interface de Usuário

- **Descrição:** Interface moderna, responsiva e intuitiva
- **Critérios:**
  - [ ] Design responsivo (mobile-first)
  - [ ] UI atrativa com animações suaves
  - [ ] Componentes reutilizáveis
  - [ ] Feedback visual para interações

### RNF02 - Tecnologias

- **Descrição:** Stack tecnológico específico
- **Critérios:**
  - [ ] Vite + React + TypeScript
  - [ ] Tailwind CSS + shadcn/ui
  - [ ] React Router para navegação
  - [ ] Context API ou Zustand para estado

### RNF03 - Performance

- **Descrição:** Requisitos de performance
- **Critérios:**
  - [ ] Debounce na busca (300ms)
  - [ ] Loading states com skeletons
  - [ ] Paginação eficiente
  - [ ] Otimização de imagens

### RNF04 - Integração API

- **Descrição:** Integração com Spotify Web API
- **Critérios:**
  - [ ] Autenticação OAuth2
  - [ ] Tratamento de erros da API
  - [ ] Rate limiting adequado
  - [ ] Cache de dados quando apropriado

## 🔧 Requisitos Técnicos

### RT01 - Arquitetura

- **Descrição:** Estrutura e organização do código
- **Critérios:**
  - [ ] Arquitetura em camadas
  - [ ] Componentes reutilizáveis
  - [ ] Separação de responsabilidades
  - [ ] Código limpo e documentado

### RT02 - API Integration

- **Descrição:** Integração com Spotify Web API
- **Critérios:**
  - [ ] Serviço `spotifyService.ts` com Axios
  - [ ] Endpoints: `/search`, `/artists/:id`, `/artists/:id/top-tracks`, `/artists/:id/albums`
  - [ ] Tratamento de erros e loading states
  - [ ] Variáveis de ambiente para credenciais

### RT03 - Testes

- **Descrição:** Cobertura e tipos de testes
- **Critérios:**
  - [ ] Testes unitários (opcional)
  - [ ] Testes E2E com Cypress (opcional)
  - [ ] Testes de integração com API

### RT04 - Deploy

- **Descrição:** Processo de deploy e CI/CD
- **Critérios:**
  - [ ] Deploy no Vercel ou Netlify
  - [ ] URL pública para demonstração
  - [ ] Variáveis de ambiente configuradas

## 📊 Critérios de Avaliação

### Funcionalidade (40%)

- [ ] Busca de artistas funcionando
- [ ] Detalhes do artista carregando corretamente
- [ ] Paginação de álbuns implementada
- [ ] Filtros funcionando adequadamente
- [ ] Tratamento de erros implementado

### Código (30%)

- [ ] Código limpo e bem estruturado
- [ ] Uso adequado de TypeScript
- [ ] Componentes reutilizáveis
- [ ] Arquitetura escalável
- [ ] Documentação adequada

### UX/UI (20%)

- [ ] Interface intuitiva e moderna
- [ ] Responsividade implementada
- [ ] Animações suaves
- [ ] Loading states e feedback visual

### Testes (10%)

- [ ] Testes implementados (se aplicável)
- [ ] Funcionamento em diferentes dispositivos
- [ ] Compatibilidade cross-browser

## 🗓️ Cronograma Detalhado

### Dia 0 – Planejamento e Setup

- [ ] Ler documentação do Spotify Web API
- [ ] Definir escopo mínimo viável (MVP)
- [ ] Setup inicial do projeto
- [ ] Configurar variáveis de ambiente

### Dia 1 – Estrutura e Layout

- [ ] Criar rotas principais
- [ ] Montar layout base responsivo
- [ ] Implementar grid de artistas
- [ ] Criar componentes reutilizáveis

### Dia 2 – Integração com API

- [ ] Criar serviço spotifyService.ts
- [ ] Implementar busca de artistas
- [ ] Carregar detalhes do artista
- [ ] Implementar top músicas e álbuns

### Dia 3 – Paginação e Estados

- [ ] Implementar paginação manual
- [ ] Adicionar filtros
- [ ] Gerenciamento de estado
- [ ] Loading states e tratamento de erros

### Dia 4 – Polimento

- [ ] Tradução com i18n
- [ ] Animações e transições
- [ ] Responsividade e acessibilidade
- [ ] Variações de componentes

### Dia 5 – Testes e Deploy

- [ ] Testes unitários/E2E
- [ ] README completo
- [ ] Deploy no Vercel/Netlify
- [ ] Revisão final

## 🛠️ Stack Tecnológico

### Frontend

- **Vite** - Build tool
- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Styling
- **shadcn/ui** - Biblioteca de componentes

### Navegação e Estado

- **React Router** - Roteamento
- **Context API/Zustand** - Gerenciamento de estado

### Integração

- **Axios** - Cliente HTTP
- **Spotify Web API** - API externa

### Qualidade

- **ESLint** - Linting
- **Prettier** - Formatação

### Deploy

- **Vercel/Netlify** - Plataforma de deploy

## 📝 Notas Importantes

1. **Priorize a funcionalidade** sobre features extras
2. **Foque na experiência do usuário** com loading states e feedback
3. **Mantenha o código limpo** e bem documentado
4. **Teste em diferentes dispositivos** e navegadores
5. **Considere a performance** com debounce e paginação

## 🔄 Atualizações

Este arquivo será atualizado conforme:

- Desenvolvimento progride
- Novos requisitos são identificados
- Feedback é recebido

---

**Última atualização:** 2024-12-19
**Versão:** 1.1.0
