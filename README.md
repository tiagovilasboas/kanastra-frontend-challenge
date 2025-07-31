# Kanastra Frontend Challenge

Este projeto foi construído usando o [React Vite Boilerplate](https://github.com/tiagovilasboas/react-vite-boilerplate) como base, fornecendo uma estrutura robusta e moderna para desenvolvimento React.

## 🚀 Tecnologias

- ⚡️ **Vite:** Build ultrarrápido e Hot Module Replacement (HMR) instantâneo
- ⚛️ **React 19:** Com todos os hooks e features mais recentes
- 🔵 **TypeScript:** Tipagem estrita para um código mais seguro e manutenível
- 🎨 **Mantine:** Biblioteca de componentes React completa e acessível
- 🧪 **Vitest & Testing Library:** Configuração de testes moderna e rápida
- 📐 **ESLint & Prettier:** Qualidade de código e formatação garantidas
- 🌐 **i18n:** Suporte para internacionalização (PT/EN)
- 🏛️ **Arquitetura em Camadas:** Código organizado, escalável e fácil de testar

## 📦 Instalação

```bash
npm install
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera o build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run test` - Executa os testes
- `npm run test:ui` - Executa os testes com interface visual
- `npm run lint` - Executa o linter
- `npm run lint:fix` - Corrige automaticamente problemas do linter
- `npm run format` - Formata o código com Prettier
- `npm run type-check` - Verifica os tipos TypeScript

## 🏗️ Estrutura do Projeto

```
src/
├── app/                  # Configurações globais, providers, rotas
├── components/           # Componentes de UI compartilhados
├── features/             # Módulos/Features da aplicação
├── hooks/                # Hooks globais
├── lib/                  # Utilitários
├── pages/                # Páginas da aplicação
├── stores/               # Stores globais (Zustand)
└── types/                # Tipos globais da aplicação
```

## 🗺️ Roadmap

Para acompanhar o progresso do desenvolvimento e entender as próximas etapas, consulte o [ROADMAP.md](./ROADMAP.md).

### Fases Principais:

1. **🚀 Fase 1: Estrutura Base** - Configuração inicial e arquitetura
2. **🎨 Fase 2: Interface e UX** - Layout, navegação e responsividade
3. **🔧 Fase 3: Funcionalidades Core** - Estado, APIs e formulários
4. **🧪 Fase 4: Testes e Qualidade** - Testes unitários e de integração
5. **⚡ Fase 5: Otimização e Deploy** - Performance, acessibilidade e deploy

## 🎯 Status Atual

### ✅ Concluído

- [x] Setup inicial do projeto
- [x] Configuração de TypeScript, ESLint e Prettier
- [x] Configuração de testes com Vitest
- [x] Configuração de internacionalização (i18n)
- [x] Estrutura base de pastas
- [x] Página inicial funcional

### 🔄 Em Andamento

- [ ] Análise dos requisitos específicos do desafio
- [ ] Definição da arquitetura de features

### 📋 Próximos Passos

- [ ] Implementar features específicas do desafio
- [ ] Configurar integração com APIs
- [ ] Adicionar testes unitários e de integração
- [ ] Implementar validações com Zod
- [ ] Configurar o deploy

## 🧩 Geradores de Código

Este projeto utiliza Plop para acelerar a criação de código padronizado:

```bash
# Gerar uma feature completa
npm run plop -- feature

# Gerar um componente isolado
npm run plop -- component
```

## 🔤 Internacionalização

O projeto já está configurado com **i18next** + **react-i18next**:

- Arquivos de tradução em `src/locales/{pt,en}/common.json`
- Use o hook `useTranslation()` em qualquer componente
- Idioma padrão: **PT-BR**

## 📊 Critérios de Avaliação

O projeto será avaliado considerando:

- **Funcionalidade (40%)** - Requisitos implementados corretamente
- **Código (30%)** - Código limpo, TypeScript e arquitetura
- **UX/UI (20%)** - Interface intuitiva e responsiva
- **Testes (10%)** - Cobertura adequada de testes

## 🚀 Deploy

Para fazer o deploy:

```bash
npm run build
```

O build de produção será gerado na pasta `dist/` e pode ser deployado em qualquer plataforma (Vercel, Netlify, etc.).

## 📝 Licença

MIT
