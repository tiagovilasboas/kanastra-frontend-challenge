# Guia de Troubleshooting - Autenticação Spotify

## Problema: "Code verifier not found in cookies"

Este erro ocorre quando o fluxo de autenticação OAuth do Spotify não consegue encontrar o `code_verifier` necessário para trocar o código de autorização por um token de acesso.

### Causas Comuns

1. **Cookies não configurados corretamente**
   - Cookies podem estar sendo bloqueados pelo navegador
   - Configuração incorreta de domínio/path dos cookies
   - Cookies expirando muito rapidamente

2. **Variáveis de ambiente não configuradas**
   - Arquivo `.env` não existe ou está mal configurado
   - Credenciais do Spotify inválidas

3. **Problemas de timing**
   - Usuário demorou muito para completar o fluxo de autenticação
   - Cookies expiraram antes da troca do código

### Soluções Implementadas

#### 1. Sistema de Fallback
- **Cookies como método principal**: O sistema tenta armazenar o `code_verifier` em cookies seguros
- **localStorage como fallback**: Se os cookies falharem, o sistema usa localStorage como backup
- **Logs detalhados**: Sistema de logging melhorado para diagnosticar problemas

#### 2. Tempo de Expiração Aumentado
- Cookies agora expiram em 10 minutos (antes eram 5 minutos)
- Mais tempo para completar o fluxo de autenticação

#### 3. Componente de Debug
- Componente `AuthDebug` disponível em desenvolvimento
- Mostra informações sobre cookies, localStorage e variáveis de ambiente
- Permite limpar dados de autenticação para testes

### Como Resolver

#### Passo 1: Verificar Configuração
1. Certifique-se de que o arquivo `.env` existe na raiz do projeto
2. Configure as variáveis necessárias:
   ```env
   VITE_SPOTIFY_CLIENT_ID=seu_client_id_aqui
   VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
   VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
   ```

#### Passo 2: Verificar Credenciais do Spotify
1. Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Verifique se o `Client ID` e `Client Secret` estão corretos
3. Confirme se a `Redirect URI` está configurada corretamente no app do Spotify

#### Passo 3: Usar o Debug
1. Em desenvolvimento, quando o erro ocorrer, o componente `AuthDebug` será exibido
2. Clique em "Run Debug" para ver informações detalhadas
3. Verifique se as variáveis de ambiente estão configuradas
4. Use "Clear All" para limpar dados de autenticação e tentar novamente

#### Passo 4: Verificar Console do Navegador
1. Abra as ferramentas de desenvolvedor (F12)
2. Vá para a aba Console
3. Procure por logs que começam com:
   - `🔍` - Informações de debug
   - `✅` - Sucessos
   - `❌` - Erros
   - `⚠️` - Avisos

### Logs Importantes

```
🔍 Looking for cookie: spotify_code_verifier
🔍 All cookies: [lista de cookies]
✅ Code verifier found in secure cookie
❌ Code verifier not found in cookies
🔍 Trying localStorage fallback for code verifier
✅ Code verifier found in localStorage
```

### Configuração de Cookies

O sistema usa as seguintes configurações de cookies:
- **Nome**: `spotify_code_verifier`
- **Path**: `/`
- **Secure**: `false` (para desenvolvimento)
- **SameSite**: `Lax`
- **MaxAge**: 600 segundos (10 minutos)

### Limpeza de Dados

Para limpar todos os dados de autenticação:
1. Use o botão "Clear All" no componente `AuthDebug`
2. Ou execute no console do navegador:
   ```javascript
   localStorage.removeItem('spotify_token')
   localStorage.removeItem('spotify_code_verifier')
   document.cookie = 'spotify_code_verifier=; Max-Age=-1; Path=/'
   ```

### Próximos Passos

Se o problema persistir:
1. Verifique se não há bloqueadores de cookies no navegador
2. Tente em uma aba anônima/privada
3. Verifique se o domínio está correto (localhost vs 127.0.0.1)
4. Considere usar HTTPS em desenvolvimento se necessário 