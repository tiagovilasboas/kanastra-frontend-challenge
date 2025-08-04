# 🔐 Autenticação

A aplicação utiliza um sistema de autenticação inteligente que se adapta automaticamente ao estado do usuário.

## Modos de Autenticação

### 🔑 Modo Logado (Token de Usuário)

Quando o usuário está logado com sua conta do Spotify:

#### ✅ Funcionalidades Disponíveis

- **Busca completa de artistas**: Todos os filtros e opções
- **Detalhes completos dos artistas**: Informações completas
- **Álbuns e músicas**: Acesso a toda a discografia
- **Top tracks**: Músicas mais populares
- **Informações de mercado**: Dados específicos por região
- **Funcionalidades avançadas**: Todas as features disponíveis

#### 🔄 Como Funciona

1. **Login**: Usuário faz login via OAuth 2.0
2. **Token de Acesso**: Recebe um access token válido
3. **Requisições**: Todas as chamadas usam o token do usuário
4. **Permissões**: Acesso completo à API do Spotify

#### 📱 Experiência do Usuário

- **Interface completa**: Todas as funcionalidades visíveis
- **Performance otimizada**: Menos rate limits
- **Dados personalizados**: Baseado no perfil do usuário

### 🔧 Modo Deslogado (Client Credentials)

Quando o usuário não está logado:

#### ✅ Funcionalidades Disponíveis

- **Busca básica de artistas**: Busca por nome
- **Informações públicas**: Dados públicos dos artistas
- **Filtros básicos**: Gêneros e popularidade
- **Visualização de resultados**: Cards de artistas

#### 🔄 Como Funciona

1. **Client Credentials**: Usa as credenciais da aplicação
2. **Token de Aplicação**: Token gerado automaticamente
3. **Requisições Limitadas**: Apenas dados públicos
4. **Rate Limits**: Limites mais restritivos

#### 📱 Experiência do Usuário

- **Interface simplificada**: Funcionalidades básicas
- **Mensagem de login**: Incentivo para fazer login
- **Funcionalidade limitada**: Apenas busca básica

## Fluxo de Autenticação

### 🔄 Processo Automático

```typescript
// 1. Verifica se o usuário está logado
if (isAuthenticated()) {
  // Usa token do usuário
  useAccessToken()
} else {
  // Usa client credentials
  useClientToken()
}
```

### 🎯 Priorização de Tokens

A aplicação sempre prioriza o token do usuário:

1. **Token de Usuário**: Se disponível, usa este
2. **Client Token**: Fallback para usuários não logados
3. **Erro**: Se nenhum token estiver disponível

### 🔄 Fallback Inteligente

Se o token do usuário falhar (401):

1. **Tenta novamente**: Com o mesmo token
2. **Fallback**: Se falhar, usa client credentials
3. **Logout**: Se client credentials também falhar

## Configuração de Credenciais

### 📋 Spotify Developer Dashboard

Para configurar as credenciais:

1. **Acesse**: [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. **Crie App**: Novo aplicativo ou use existente
3. **Configure URIs**:
   - Website: `http://localhost:5173`
   - Redirect URI: `http://127.0.0.1:5173/callback`

### 🔧 Variáveis de Ambiente

```env
# Credenciais obrigatórias
VITE_SPOTIFY_CLIENT_ID=seu_client_id_aqui
VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui

# URI de redirecionamento
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
```

### 🔍 Verificação

Para verificar se as credenciais estão configuradas:

```bash
# Verifica configuração
npm run check-env

# Ou execute a aplicação
npm run dev
```

## Segurança

### 🔒 Armazenamento de Tokens

- **Access Token**: Armazenado em localStorage e cookies
- **Client Token**: Gerado sob demanda, não persistido
- **Refresh Token**: Não utilizado (client credentials)

### 🛡️ Validação

- **Validação de entrada**: Todos os inputs são validados
- **Sanitização**: Dados limpos antes do envio
- **Rate Limiting**: Respeita limites da API

### 🔄 Expiração

- **Access Token**: Expira em 1 hora
- **Client Token**: Expira em 1 hora
- **Renovação**: Automática quando necessário

## Troubleshooting

### ❌ Erro de Credenciais

**Problema**: `Spotify credentials not configured`

**Solução**:

1. Verifique se o arquivo `.env` existe
2. Confirme se as credenciais estão corretas
3. Reinicie o servidor após configurar

### ❌ Erro 401 Unauthorized

**Problema**: `Authentication required`

**Solução**:

1. Faça login novamente
2. Verifique se o token não expirou
3. Limpe o cache do navegador

### ❌ Erro 400 Bad Request

**Problema**: `Invalid credentials`

**Solução**:

1. Verifique as credenciais no Spotify Dashboard
2. Confirme se o Redirect URI está correto
3. Teste as credenciais no Postman

### 🔧 Debug

Para debug de autenticação:

```typescript
// Verificar status da autenticação
console.log(spotifyRepository.getAuthStatus())

// Verificar tokens disponíveis
console.log({
  hasAccessToken: spotifyRepository.isAuthenticated(),
  hasClientToken: spotifyRepository.searchService.hasClientToken(),
})
```

## Melhores Práticas

### 🔐 Segurança

- **Nunca exponha credenciais**: Não commite o arquivo `.env`
- **Use HTTPS**: Em produção, sempre use HTTPS
- **Valide inputs**: Sempre valide dados de entrada

### 🚀 Performance

- **Cache tokens**: Evite regenerar tokens desnecessariamente
- **Lazy loading**: Carregue dados sob demanda
- **Error boundaries**: Trate erros graciosamente

### 📱 UX

- **Feedback claro**: Mostre o status da autenticação
- **Fallback graceful**: Funcionalidade mesmo sem login
- **Loading states**: Indique quando está carregando
