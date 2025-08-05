# Regras de Negócio - Sistema de Busca

Este documento descreve as regras de negócio que governam o sistema de busca da aplicação Spotify Explorer.

## 🔍 **Interface de Busca**

### **Localização e Comportamento**

- **Localização**: Busca é feita **apenas pelo header** (não há formulário na página de busca)
- **Navegação automática**: Quando o usuário digita algo, navega automaticamente para `/search`
- **Triggers de busca**:
  - Digitar e pressionar Enter
  - Digitar e clicar fora do campo

### **Placeholder e Textos**

- **Placeholder padrão**: "Search for artists"
- **Configurável**: Placeholder pode ser customizado via props
- **Internacionalização**: Suporte completo a múltiplos idiomas

## 📄 **Comportamento da Página de Busca**

### **Estados da Interface**

- **Estado inicial**: Mostra tela de boas-vindas quando não há query
- **Filtros condicionais**: Filtros só aparecem quando há uma query de busca
- **Resultados condicionais**: Resultados só aparecem quando há query

### **Fluxo de Navegação**

1. Usuário digita no header
2. Navegação automática para `/search`
3. Exibição de filtros (se há query)
4. Exibição de resultados (se há query)

## 🎛️ **Sistema de Filtros**

### **Comportamento dos Filtros**

- **Comportamento radio**: Apenas **uma categoria pode ser selecionada por vez**
- **Seleção única**: Mudança de categoria desmarca a anterior
- **Estado persistente**: Seleção mantida durante a sessão

### **Categorias Disponíveis**

- `Tudo` (busca em todos os tipos)
- `Artistas`
- `Álbuns`
- `Músicas`
- `Playlists`
- `Podcasts e programas`
- `Episódios`
- `Audiobooks`

### **Lógica de Seleção**

- **"Tudo" selecionado**: Busca em todos os 7 tipos de conteúdo
- **Categoria específica**: Busca apenas no tipo selecionado
- **Mudança de categoria**: Refaz a busca automaticamente

## 📱 **Limites de Resultados por Dispositivo**

### **Mobile** (< 768px)

| Tipo       | Limite         |
| ---------- | -------------- |
| Tudo       | 4 de cada tipo |
| Artistas   | 15             |
| Álbuns     | 10             |
| Músicas    | 15             |
| Playlists  | 12             |
| Shows      | 10             |
| Episódios  | 8              |
| Audiobooks | 6              |

### **Desktop** (≥ 768px)

| Tipo       | Limite         |
| ---------- | -------------- |
| Tudo       | 5 de cada tipo |
| Artistas   | 25             |
| Álbuns     | 10             |
| Músicas    | 25             |
| Playlists  | 20             |
| Shows      | 15             |
| Episódios  | 12             |
| Audiobooks | 10             |

### **Lógica de Limites**

- **Detecção automática**: Baseada no `window.innerWidth`
- **Fallback SSR**: Usa limites padrão quando `window` não está disponível
- **Otimização**: Limites menores em mobile para melhor performance

## 🎨 **Estados da Interface**

### **Loading State**

- **Skeleton**: Mostra skeleton durante busca
- **Indicador visual**: Spinner com texto "Procurando..."
- **Grid responsivo**: Skeleton adaptado ao layout de resultados

### **Error State**

- **Mensagem clara**: Mostra mensagem de erro específica
- **Recuperação**: Interface permanece funcional
- **Logging**: Erros são logados para debugging

### **No Results State**

- **Card específico**: Mostra card quando não há resultados
- **Query exibida**: Mostra a query que não retornou resultados
- **Sugestões**: Pode incluir sugestões de busca

### **Results State**

- **Organização**: Resultados organizados por seções
- **Responsivo**: Layout adaptado ao dispositivo
- **Performance**: Lazy loading de imagens

### **Load More State**

- **Botão condicional**: Aparece apenas quando há mais resultados
- **Loading state**: Indicador durante carregamento
- **Paginação**: Suporte a carregar mais resultados

## 🔗 **Integração com Spotify**

### **API Integration**

- **Spotify Web API**: Usa API oficial do Spotify
- **Autenticação**: Requer autenticação OAuth
- **Rate Limiting**: Respeita limites da API

### **Tipos de Conteúdo**

- **7 tipos principais**: Todos os tipos suportados pela API
- **Busca unificada**: Uma query busca em múltiplos tipos
- **Resultados tipados**: Cada tipo tem estrutura específica

### **Performance**

- **Debounce**: Implementa debounce para evitar muitas requisições
- **Cache**: Cache de resultados para melhor performance
- **Otimização**: Requisições otimizadas por tipo

## 📱 **Responsividade**

### **Adaptação por Dispositivo**

- **Limites adaptativos**: Diferentes limites baseados no tamanho da tela
- **Layout responsivo**: Interface se adapta ao dispositivo
- **Performance mobile**: Otimizações específicas para mobile

### **Breakpoints**

- **Mobile**: < 768px
- **Desktop**: ≥ 768px
- **Tablet**: Considerado desktop para limites

## 🌐 **Internacionalização**

### **Suporte a Idiomas**

- **Múltiplos idiomas**: Suporte completo a i18n
- **Textos traduzíveis**: Todos os textos são traduzíveis
- **Placeholders**: Placeholder do input é configurável
- **Labels**: Todas as categorias têm labels traduzíveis

### **Idiomas Suportados**

- Português (pt)
- Inglês (en)
- Extensível para outros idiomas

## 🔄 **Fluxo de Dados**

### **Store Management**

- **Zustand**: Gerenciamento de estado com Zustand
- **Persistência**: Estado mantido durante navegação
- **Sincronização**: Estado sincronizado entre componentes

### **Hook Pattern**

- **useSpotifySearch**: Hook principal para busca
- **useSearchStore**: Hook para estado global
- **Separação de responsabilidades**: Lógica separada da UI

## 🚀 **Performance e Otimização**

### **Debounce**

- **Delay**: 800ms de debounce
- **Cancelamento**: Cancela requisições anteriores
- **Otimização**: Evita requisições desnecessárias

### **Lazy Loading**

- **Imagens**: Lazy loading de imagens dos resultados
- **Componentes**: Componentes carregados sob demanda
- **Pagination**: Carregamento incremental de resultados

### **Cache**

- **Resultados**: Cache de resultados recentes
- **Configuração**: Cache de configurações de dispositivo
- **Validação**: Cache com validação de tempo

## 🛡️ **Tratamento de Erros**

### **Tipos de Erro**

- **API Errors**: Erros da API do Spotify
- **Network Errors**: Problemas de conectividade
- **Validation Errors**: Erros de validação de entrada

### **Recuperação**

- **Fallbacks**: Estados de fallback para erros
- **Retry Logic**: Lógica de retry para falhas temporárias
- **User Feedback**: Feedback claro para o usuário

## 📋 **Casos de Uso**

### **Busca Básica**

1. Usuário digita no header
2. Navega para página de busca
3. Vê filtros disponíveis
4. Seleciona categoria (opcional)
5. Vê resultados organizados

### **Busca com Filtros**

1. Usuário faz busca inicial
2. Seleciona categoria específica
3. Busca é refeita automaticamente
4. Resultados filtrados são exibidos

### **Carregamento de Mais Resultados**

1. Usuário vê resultados iniciais
2. Clica em "Carregar mais"
3. Novos resultados são adicionados
4. Botão desaparece quando não há mais

### **Busca sem Resultados**

1. Usuário faz busca
2. API retorna resultados vazios
3. Card de "sem resultados" é exibido
4. Sugestões podem ser mostradas

---

**Versão**: 1.0  
**Última atualização**: Dezembro 2024  
**Responsável**: Equipe de Desenvolvimento
