# 🆘 Suporte

## Problemas Comuns

### ❌ Erro de Credenciais do Spotify

**Sintomas**:

- Erro `400 Bad Request` no console
- Mensagem "Spotify credentials not configured"
- Aplicação não carrega dados

**Solução**:

1. **Verifique o arquivo `.env`**:

   ```bash
   # Certifique-se de que o arquivo existe
   ls -la .env

   # Verifique o conteúdo
   cat .env
   ```

2. **Configure as credenciais**:
   - Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Crie um novo aplicativo
   - Copie Client ID e Client Secret
   - Edite o arquivo `.env`:

   ```env
   VITE_SPOTIFY_CLIENT_ID=seu_client_id_aqui
   VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
   ```

3. **Reinicie o servidor**:
   ```bash
   npm run dev
   ```

### ❌ Erro de Autenticação

**Sintomas**:

- Erro `401 Unauthorized`
- Mensagem "Authentication required"
- Funcionalidades limitadas

**Solução**:

1. **Faça login novamente**:
   - Clique em "Login" na aplicação
   - Autorize o acesso ao Spotify
   - Aguarde o redirecionamento

2. **Limpe o cache**:

   ```bash
   # Limpe localStorage
   localStorage.clear()

   # Ou limpe cookies
   # (depende do navegador)
   ```

3. **Verifique o token**:
   ```javascript
   // No console do navegador
   console.log(localStorage.getItem('spotify_token'))
   ```

### ❌ Erro de CORS

**Sintomas**:

- Erro `CORS policy` no console
- Requisições bloqueadas pelo navegador
- Aplicação não carrega

**Solução**:

1. **Verifique o Redirect URI**:
   - Use `http://127.0.0.1:5173` (não `localhost`)
   - Configure no Spotify Dashboard

2. **Verifique as configurações**:
   ```env
   VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
   ```

### ❌ Erro de Porta

**Sintomas**:

- Erro "Port already in use"
- Servidor não inicia
- Mensagem de porta ocupada

**Solução**:

```bash
# Encerre processos na porta 5173
lsof -ti:5173 | xargs kill -9

# Ou use uma porta diferente
npm run dev -- --port 3000
```

### ❌ Erro de Build

**Sintomas**:

- Erro durante `npm run build`
- Falha na compilação TypeScript
- Erros de linting

**Solução**:

```bash
# Verifique tipos TypeScript
npm run type-check

# Corrija problemas de linting
npm run lint:fix

# Limpe cache e reinstale dependências
rm -rf node_modules package-lock.json
npm install
```

## Verificação de Configuração

### 🔍 Script de Verificação

Execute o script de verificação:

```bash
npm run check-env
```

### 📋 Checklist

- [ ] Arquivo `.env` existe na raiz do projeto
- [ ] `VITE_SPOTIFY_CLIENT_ID` está configurado
- [ ] `VITE_SPOTIFY_CLIENT_SECRET` está configurado
- [ ] `VITE_SPOTIFY_REDIRECT_URI` está correto
- [ ] Credenciais são válidas no Spotify Dashboard
- [ ] Aplicação está ativa no Spotify Dashboard

### 🔧 Debug Manual

```bash
# Verifique se as variáveis estão carregadas
echo $VITE_SPOTIFY_CLIENT_ID

# Teste a API do Spotify
curl -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=SEU_CLIENT_ID&client_secret=SEU_CLIENT_SECRET" \
  https://accounts.spotify.com/api/token
```

## Logs e Debug

### 📊 Console do Navegador

Abra o DevTools (F12) e verifique:

1. **Console**: Erros JavaScript
2. **Network**: Requisições HTTP
3. **Application**: LocalStorage e Cookies

### 🔍 Logs da Aplicação

A aplicação usa logs detalhados:

```javascript
// No console do navegador
localStorage.setItem('debug', 'spotify:*')

// Recarregue a página para ver logs detalhados
```

### 📱 Logs do Servidor

```bash
# Execute com logs detalhados
DEBUG=* npm run dev
```

## Performance

### 🐌 Aplicação Lenta

**Possíveis causas**:

- Muitas requisições simultâneas
- Cache não configurado
- Imagens muito grandes

**Soluções**:

1. **Limite requisições**:

   ```typescript
   // Use debounce na busca
   const debouncedSearch = useDebounce(searchTerm, 500)
   ```

2. **Otimize imagens**:

   ```typescript
   // Use tamanhos apropriados
   const imageUrl = artist.images[0]?.url || defaultImage
   ```

3. **Configure cache**:
   ```typescript
   // React Query já faz cache automático
   // Verifique se está funcionando
   ```

### 📱 Problemas Mobile

**Sintomas**:

- Interface quebrada no mobile
- Elementos sobrepostos
- Scroll não funciona

**Solução**:

1. **Verifique viewport**:

   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

2. **Teste responsividade**:
   - Use DevTools do navegador
   - Teste em dispositivos reais
   - Verifique breakpoints do Tailwind

## Recursos Úteis

### 📚 Documentação

- **[Spotify Web API](https://developer.spotify.com/documentation/web-api)**: Documentação oficial
- **[React Query](https://tanstack.com/query/latest)**: Documentação do React Query
- **[Tailwind CSS](https://tailwindcss.com/docs)**: Documentação do Tailwind

### 🛠️ Ferramentas

- **[Postman](https://www.postman.com/)**: Teste a API do Spotify
- **[Spotify Web API Console](https://developer.spotify.com/console/)**: Console oficial
- **[React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)**: Debug React

### 💬 Comunidade

- **[Stack Overflow](https://stackoverflow.com/questions/tagged/spotify-api)**: Perguntas sobre Spotify API
- **[GitHub Issues](https://github.com/spotify/web-api/issues)**: Issues da API do Spotify
- **[React Community](https://reactjs.org/community/support.html)**: Suporte React

## Contato

Se você não conseguir resolver o problema:

1. **Verifique a documentação**: Leia os arquivos em `docs/`
2. **Pesquise issues**: Procure por problemas similares
3. **Crie um issue**: Descreva o problema detalhadamente

### 📝 Template de Issue

```markdown
## Problema

Descrição clara do problema

## Passos para Reproduzir

1. Faça isso
2. Depois isso
3. Veja o erro

## Comportamento Esperado

O que deveria acontecer

## Comportamento Atual

O que está acontecendo

## Informações do Sistema

- Sistema Operacional:
- Navegador:
- Versão da aplicação:
- Logs de erro:
```
