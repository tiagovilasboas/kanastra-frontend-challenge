# 🐕 Husky Hooks - Controle de Qualidade de Código

## 📋 Visão Geral

O Husky é configurado para garantir que apenas código de qualidade seja commitado e enviado para o repositório. Os hooks bloqueiam commits e pushes quando há problemas de lint, tipos ou testes.

## 🔧 Hooks Configurados

### **1. Pre-commit Hook**
**Arquivo:** `.husky/pre-commit`

**Executa antes de cada commit:**
- ✅ **ESLint** - Verifica qualidade do código
- ✅ **TypeScript** - Verifica tipos
- ✅ **Tests** - Executa testes unitários
- ✅ **Lint-staged** - Formata arquivos staged

**Bloqueia commit se:**
- ❌ Há erros de ESLint
- ❌ Há erros de TypeScript
- ❌ Testes falham
- ❌ Lint-staged encontra problemas

### **2. Pre-push Hook**
**Arquivo:** `.husky/pre-push`

**Executa antes de cada push:**
- ✅ **ESLint** - Verifica qualidade do código
- ✅ **TypeScript** - Verifica tipos
- ✅ **Tests** - Executa testes unitários
- ✅ **Build** - Verifica se o projeto compila

**Bloqueia push se:**
- ❌ Há erros de ESLint
- ❌ Há erros de TypeScript
- ❌ Testes falham
- ❌ Build falha

### **3. Commit-msg Hook**
**Arquivo:** `.husky/commit-msg`

**Executa após cada commit:**
- ✅ **Commitlint** - Verifica formato da mensagem de commit

**Bloqueia commit se:**
- ❌ Mensagem não segue convenção

## 🚀 Scripts Disponíveis

### **Verificação Manual:**
```bash
# Verificar tudo antes de commitar
npm run pre-commit-check

# Verificar apenas lint
npm run lint

# Verificar apenas tipos
npm run type-check

# Verificar apenas testes
npm run test -- --run
```

### **Correção Automática:**
```bash
# Corrigir problemas de lint automaticamente
npm run lint:fix

# Formatar código
npm run format
```

## 📊 Configurações Rigorosas

### **ESLint:**
```json
{
  "lint": "eslint . --max-warnings=0",
  "lint:fix": "eslint . --fix --max-warnings=0"
}
```

**Características:**
- ✅ **Zero warnings** permitidos
- ✅ **Auto-fix** disponível
- ✅ **Formato unix** para CI/CD

### **Lint-staged:**
```json
{
  "*.{ts,tsx,js,jsx}": [
    "eslint --fix --max-warnings=0",
    "prettier --write",
    "git add"
  ]
}
```

**Características:**
- ✅ **Zero warnings** permitidos
- ✅ **Auto-formatação** com Prettier
- ✅ **Auto-add** de arquivos corrigidos

## 🚨 Fluxo de Bloqueio

### **1. Tentativa de Commit:**
```bash
git commit -m "feat: add new feature"
```

**Se houver problemas:**
```
🔍 Running pre-commit checks...
📝 Checking code style...
❌ ESLint found errors. Please fix them before committing.
💡 Run 'npm run lint:fix' to automatically fix some issues.
```

### **2. Tentativa de Push:**
```bash
git push origin main
```

**Se houver problemas:**
```
🚀 Running pre-push checks...
📝 Checking code style...
❌ ESLint found errors. Cannot push with linting issues.
💡 Run 'npm run lint:fix' to automatically fix some issues.
```

## 🛠️ Como Resolver Problemas

### **1. Problemas de ESLint:**
```bash
# Verificar problemas
npm run lint

# Corrigir automaticamente
npm run lint:fix

# Verificar novamente
npm run lint
```

### **2. Problemas de TypeScript:**
```bash
# Verificar tipos
npm run type-check

# Corrigir problemas de tipos
# (Editar código manualmente)
```

### **3. Problemas de Testes:**
```bash
# Executar testes
npm run test -- --run

# Executar testes com UI
npm run test:ui

# Corrigir testes falhando
# (Editar testes ou código)
```

### **4. Problemas de Build:**
```bash
# Verificar build
npm run build

# Corrigir problemas de build
# (Geralmente problemas de tipos ou imports)
```

## 🎯 Benefícios

### **Para Desenvolvedores:**
- ✅ **Feedback imediato** sobre problemas
- ✅ **Prevenção** de commits com bugs
- ✅ **Padronização** automática de código
- ✅ **Qualidade** consistente

### **Para o Time:**
- ✅ **Redução** de bugs em produção
- ✅ **Manutenibilidade** melhorada
- ✅ **Code review** mais eficiente
- ✅ **CI/CD** mais confiável

### **Para o Projeto:**
- ✅ **Estabilidade** do código
- ✅ **Performance** otimizada
- ✅ **Documentação** automática
- ✅ **Padrões** consistentes

## 🔄 Bypass (Emergência)

### **⚠️ Apenas em casos extremos:**
```bash
# Bypass pre-commit hook
git commit -m "feat: emergency fix" --no-verify

# Bypass pre-push hook
git push origin main --no-verify
```

**⚠️ Use apenas em emergências e corrija os problemas imediatamente!**

## 📈 Monitoramento

### **Dashboard do GitHub:**
- Acesse a aba "Actions"
- Monitore execuções dos hooks
- Verifique histórico de problemas

### **Métricas:**
- **Commits bloqueados** por tipo de problema
- **Tempo médio** de correção
- **Frequência** de bypass

## 🎉 Resultado Final

Com o Husky configurado, o projeto agora possui:

- ✅ **Bloqueio automático** de commits com problemas
- ✅ **Bloqueio automático** de pushes com problemas
- ✅ **Verificação rigorosa** de qualidade
- ✅ **Feedback claro** sobre problemas
- ✅ **Correção automática** quando possível
- ✅ **Padronização** consistente

O Husky garante que apenas código de qualidade seja commitado e enviado para o repositório! 🚀 