# TODO: Testes a Serem Recriados

## 🗑️ Testes Removidos (Que Estavam Quebrando)

### **Testes E2E (Cypress)**
- ❌ `cypress/e2e/01-authentication.cy.ts` - Problema com redirecionamento para Spotify
- ❌ `cypress/e2e/02-search-functionality.cy.ts` - Mocks não funcionando corretamente
- ❌ `cypress/e2e/03-artist-details.cy.ts` - Problemas de timing e interceptação
- ❌ `cypress/e2e/04-ui-components.cy.ts` - Componentes não encontrados
- ❌ `cypress/e2e/05-accessibility.cy.ts` - Problemas de acessibilidade
- ❌ `cypress/e2e/run-all-tests.cy.ts` - Suite completa com problemas
- ❌ `cypress/e2e/kanastra-challenge.cy.ts` - Teste original com problemas
- ❌ `cypress/e2e/kanastra-challenge-fixed.cy.ts` - Versão corrigida ainda com problemas

### **Testes Unitários**
- ❌ `src/schemas/__tests__/spotify.test.ts` - Schemas com validação incorreta
- ❌ `src/utils/__tests__/errorHandler.test.ts` - Função não exportada

## ✅ Testes Mantidos (Funcionando)

### **Testes Unitários**
- ✅ `src/app/App.test.tsx` - Teste básico do componente App
- ✅ `src/utils/__tests__/formatters.test.ts` - Testes de formatação (8 testes)

## 📋 Plano para Recriar os Testes

### **1. Testes E2E - Abordagem Simplificada**
```bash
# Estrutura sugerida
cypress/e2e/
├── 01-basic-navigation.cy.ts      # Navegação básica sem autenticação
├── 02-ui-components.cy.ts         # Componentes de UI isolados
├── 03-search-mocked.cy.ts         # Busca com mocks robustos
└── 04-artist-details-mocked.cy.ts # Detalhes do artista com mocks
```

### **2. Testes Unitários - Foco em Funcionalidades**
```bash
# Estrutura sugerida
src/
├── components/__tests__/          # Testes de componentes
├── hooks/__tests__/              # Testes de hooks
├── utils/__tests__/              # Testes de utilitários
└── repositories/__tests__/       # Testes de repositórios
```

## 🎯 Prioridades

### **Alta Prioridade**
1. **Testes de Componentes** - Verificar se componentes renderizam corretamente
2. **Testes de Hooks** - Verificar lógica de negócio
3. **Testes de Utilitários** - Verificar funções auxiliares

### **Média Prioridade**
1. **Testes E2E Básicos** - Navegação e UI sem autenticação
2. **Testes de Schemas** - Validação de dados

### **Baixa Prioridade**
1. **Testes E2E Completos** - Fluxos completos com autenticação
2. **Testes de Acessibilidade** - ARIA e navegação por teclado

## 📝 Notas Importantes

- **Evitar autenticação real** nos testes E2E
- **Usar mocks robustos** para APIs externas
- **Focar em funcionalidades isoladas** primeiro
- **Testar apenas o que é crítico** para o funcionamento
- **Manter testes simples** e fáceis de manter

## 🔄 Status Atual
- **Testes Unitários**: 2 arquivos, 9 testes ✅
- **Testes E2E**: 0 arquivos, 0 testes ❌
- **Cobertura**: Básica, precisa ser expandida 