# 🐕 Reviewdog - Revisões Automáticas

## 📋 Visão Geral

O [Reviewdog](https://github.com/reviewdog/reviewdog) é uma ferramenta que automatiza a revisão de código, integrando-se com o GitHub para fornecer feedback automático em Pull Requests.

## 🎯 Funcionalidades

### **GitHub Actions (Automático)**
- ✅ **Execução automática** em Pull Requests
- ✅ **Feedback visual** nos comentários do PR
- ✅ **Integração nativa** com GitHub
- ✅ **Reporta issues** diretamente no código

### **Ferramentas Suportadas**
- ✅ **ESLint** - Análise de qualidade de código
- ✅ **TypeScript** - Verificação de tipos
- ✅ **Prettier** - Formatação de código
- ✅ **Build** - Verificação de compilação

## 🔧 Configuração

### **GitHub Actions**
O Reviewdog está configurado no workflow `.github/workflows/reviewdog.yml` e executa automaticamente em Pull Requests.

### **Workflow Automático**
```yaml
name: reviewdog
on: [pull_request]

jobs:
  eslint:
    # Executa ESLint e reporta issues
  typescript:
    # Executa TypeScript e reporta issues
  prettier:
    # Executa Prettier e reporta issues
  build:
    # Executa build e verifica compilação
```

## 🚀 Como Funciona

### **1. Pull Request Criado**
- GitHub Actions executa automaticamente
- Reviewdog analisa o código
- Issues são reportados como comentários

### **2. Feedback Visual**
- **Comentários inline** no código
- **Nível de severidade** (error, warning, info)
- **Contexto** das mudanças

### **3. Resolução**
- Desenvolvedor corrige issues
- Push das correções
- Reviewdog re-executa automaticamente

## 📊 Benefícios

### **Para Desenvolvedores**
- ✅ **Feedback imediato** sobre problemas
- ✅ **Contexto visual** das issues
- ✅ **Padronização** automática
- ✅ **Qualidade** consistente

### **Para o Time**
- ✅ **Code review** mais eficiente
- ✅ **Redução** de bugs
- ✅ **Padrões** consistentes
- ✅ **CI/CD** integrado

### **Para o Projeto**
- ✅ **Qualidade** mantida
- ✅ **Performance** otimizada
- ✅ **Manutenibilidade** melhorada

## 🎯 Uso Local

### **Verificação Manual**
```bash
# Verificar lint
npm run lint

# Verificar tipos
npm run type-check

# Verificar formatação
npm run format

# Verificar tudo
npm run pre-commit-check
```

### **Correção Automática**
```bash
# Corrigir lint automaticamente
npm run lint:fix

# Formatar código
npm run format
```

## ⚠️ Importante

**O Reviewdog só funciona no GitHub Actions**, não localmente. Para desenvolvimento local, use os scripts npm padrão:

- `npm run lint` - Verificar qualidade
- `npm run type-check` - Verificar tipos
- `npm run format` - Formatar código

## 🔗 Links Úteis

- [Reviewdog GitHub](https://github.com/reviewdog/reviewdog)
- [Documentação Oficial](https://github.com/reviewdog/reviewdog#readme)
- [GitHub Actions](https://docs.github.com/en/actions)
- [ESLint](https://eslint.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prettier](https://prettier.io/) 