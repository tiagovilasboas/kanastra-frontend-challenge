# 🐕 Reviewdog - Revisões Automáticas de Código

## 📋 Visão Geral

O [Reviewdog](https://github.com/reviewdog/reviewdog) é uma ferramenta que automatiza a revisão de código, integrando-se com o GitHub para fornecer feedback automático em Pull Requests.

## 🚀 Funcionalidades

### ✅ **Revisões Automáticas**
- **ESLint**: Verificação de qualidade de código JavaScript/TypeScript
- **TypeScript**: Verificação de tipos e erros de compilação
- **Prettier**: Verificação de formatação de código
- **Build**: Verificação de build do projeto

### 🔧 **Integração com GitHub**
- Comentários automáticos em Pull Requests
- Diferenciação entre erros e warnings
- Filtro por contexto de mudanças (diff_context)

## 📁 Arquivos de Configuração

### `.github/workflows/reviewdog.yml`
Workflow do GitHub Actions que executa as verificações automaticamente em Pull Requests.

### `.reviewdog.yml`
Configuração global do Reviewdog com parâmetros de execução.

## 🛠️ Scripts Disponíveis

```bash
# Executar Reviewdog com configuração global
npm run reviewdog

# Executar ESLint com Reviewdog
npm run reviewdog:eslint

# Executar TypeScript com Reviewdog
npm run reviewdog:typescript

# Executar Prettier com Reviewdog
npm run reviewdog:prettier
```

## 🔄 Como Funciona

### 1. **Trigger Automático**
- O workflow é executado automaticamente em cada Pull Request
- Verifica apenas as mudanças no contexto do diff

### 2. **Execução Paralela**
- Cada ferramenta (ESLint, TypeScript, Prettier) roda em jobs separados
- Permite identificação rápida de problemas específicos

### 3. **Feedback no GitHub**
- Comentários são postados diretamente no Pull Request
- Diferenciação visual entre erros e warnings
- Links diretos para as linhas problemáticas

## 📊 Configurações

### **Níveis de Severidade**
```yaml
level: error  # info, warning, error
```

### **Modos de Filtro**
```yaml
filter_mode: diff_context  # diff_context, nofilter, added
```

### **Reporters**
```yaml
reporter: github-pr-review  # github-pr-review, github-check
```

## 🎯 Benefícios

### **Para Desenvolvedores**
- ✅ **Feedback imediato** sobre problemas de código
- ✅ **Aprendizado contínuo** com sugestões automáticas
- ✅ **Consistência** no padrão de código
- ✅ **Prevenção** de bugs antes do merge

### **Para o Time**
- ✅ **Qualidade consistente** do código
- ✅ **Redução** de revisões manuais repetitivas
- ✅ **Padronização** de práticas de desenvolvimento
- ✅ **Documentação** automática de problemas

## 🔧 Configuração Local

### **Instalação do Reviewdog**
```bash
# Instalar via Go
go install github.com/reviewdog/reviewdog/cmd/reviewdog@latest

# Ou via script de instalação
curl -sfL https://raw.githubusercontent.com/reviewdog/reviewdog/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v0.14.2
```

### **Configuração de Token**
```bash
# Configurar token do GitHub
export REVIEWDOG_GITHUB_API_TOKEN=your_github_token
```

### **Execução Local**
```bash
# Executar verificações localmente
npm run reviewdog:eslint
npm run reviewdog:typescript
npm run reviewdog:prettier
```

## 🚨 Troubleshooting

### **Problemas Comuns**

#### 1. **Token não configurado**
```bash
Error: github token is not set
```
**Solução**: Configure o `REVIEWDOG_GITHUB_API_TOKEN`

#### 2. **Permissões insuficientes**
```bash
Error: 403 Forbidden
```
**Solução**: Verifique as permissões do token no GitHub

#### 3. **Workflow não executa**
- Verifique se o arquivo está em `.github/workflows/`
- Confirme se o trigger está configurado para `pull_request`

## 📈 Métricas e Relatórios

### **Dashboard do GitHub**
- Acesse a aba "Actions" no repositório
- Visualize histórico de execuções
- Monitore tempo de execução e falhas

### **Insights**
- Identifique padrões de problemas
- Acompanhe evolução da qualidade do código
- Meça eficácia das verificações

## 🔗 Links Úteis

- [Reviewdog GitHub](https://github.com/reviewdog/reviewdog)
- [Documentação Oficial](https://github.com/reviewdog/reviewdog#readme)
- [GitHub Actions](https://docs.github.com/en/actions)
- [ESLint](https://eslint.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prettier](https://prettier.io/)

## 🎉 Resultado Final

Com o Reviewdog configurado, o projeto agora possui:

- ✅ **Revisões automáticas** em Pull Requests
- ✅ **Feedback imediato** sobre qualidade de código
- ✅ **Padronização** de práticas de desenvolvimento
- ✅ **Prevenção** de problemas antes do merge
- ✅ **Integração** completa com GitHub Actions

O Reviewdog é uma ferramenta essencial para manter a qualidade do código e melhorar a experiência de desenvolvimento! 🚀 