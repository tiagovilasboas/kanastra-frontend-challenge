# Spotify Authentication Troubleshooting

Este guia ajuda a resolver problemas comuns de autenticação da Spotify Web API.

## 🚨 Erro: INVALID_CLIENT: Invalid redirect URI

### **Problema**

```
INVALID_CLIENT: Invalid redirect URI
```

### **Causa**

O redirect URI configurado no Spotify Developer Dashboard não corresponde ao que está sendo usado na aplicação.

### **Solução**

#### **1. Verificar Spotify Developer Dashboard**

1. **Acesse**: [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. **Selecione sua aplicação** (ID: `c6c3457349a542d59b8e0dcc39c4047a`)
3. **Clique em "Settings"**
4. **Na seção "Redirect URIs"**:
   - ✅ **Adicione**: `http://localhost:5173/callback`
   - ❌ **Remova**: Qualquer URI com `https://localhost`
   - ❌ **Remova**: Outros domínios não utilizados
5. **Clique em "Save"**

#### **2. Verificar Variáveis de Ambiente**

Certifique-se que o arquivo `.env` contém:

```bash
# Spotify API Configuration
VITE_SPOTIFY_CLIENT_ID=c6c3457349a542d59b8e0dcc39c4047a
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback

# Application Configuration
VITE_APP_VERSION=1.0.0
VITE_APP_NAME=Spotify Artist Explorer

# API Configuration
VITE_API_TIMEOUT=10000
VITE_API_RETRY_ATTEMPTS=3

# Environment
NODE_ENV=development
```

#### **3. Verificar Configuração da Aplicação**

A aplicação está configurada para usar:

- **Client ID**: `c6c3457349a542d59b8e0dcc39c4047a`
- **Redirect URI**: `http://localhost:5173/callback`
- **Scopes**: `user-read-private user-read-email`

### **Debug da Configuração**

A aplicação inclui um utilitário de debug que pode ser acessado no console do navegador:

1. **Abra o DevTools** (F12)
2. **Vá para a aba Console**
3. **Recarregue a página**
4. **Procure por mensagens de debug**:
   ```
   🔍 Debugging Spotify Auth Configuration...
   🔍 Validating Auth Config:
   ✅ Client ID exists: true
   ✅ Redirect URI exists: true
   ✅ Redirect URI is HTTP: true
   ✅ Redirect URI has callback: true
   ✅ All validations passed!
   ```

### **URL de Autorização Gerada**

A aplicação gera a seguinte URL de autorização:

```
https://accounts.spotify.com/authorize?client_id=c6c3457349a542d59b8e0dcc39c4047a&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fcallback&scope=user-read-private%20user-read-email
```

### **Verificações Importantes**

#### **✅ Checklist de Configuração**

- [ ] **Spotify Dashboard**: Redirect URI configurado como `http://localhost:5173/callback`
- [ ] **Variáveis de Ambiente**: `.env` com Client ID e Redirect URI corretos
- [ ] **Protocolo HTTP**: Usando `http://` (não `https://`) para localhost
- [ ] **Porta Correta**: Porta 5173 (padrão do Vite)
- [ ] **Path Correto**: `/callback` no final da URL

#### **❌ Problemas Comuns**

1. **HTTPS vs HTTP**: Localhost deve usar `http://`
2. **Porta Incorreta**: Verificar se está usando porta 5173
3. **Path Incorreto**: Deve terminar com `/callback`
4. **Client ID Errado**: Verificar se o Client ID está correto
5. **Scopes Inválidos**: Usar apenas scopes necessários

### **Teste da Configuração**

1. **Inicie a aplicação**: `npm run dev`
2. **Abra**: `http://localhost:5173`
3. **Clique em "Conectar com Spotify"**
4. **Verifique se redireciona corretamente**

### **Logs de Debug**

Se o problema persistir, verifique os logs no console:

```javascript
// No console do navegador
console.log('Client ID:', import.meta.env.VITE_SPOTIFY_CLIENT_ID)
console.log('Redirect URI:', import.meta.env.VITE_SPOTIFY_REDIRECT_URI)
```

### **Recursos Úteis**

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Authorization Guide](https://developer.spotify.com/documentation/web-api/tutorials/code-flow)
- [Redirect URI Guidelines](https://developer.spotify.com/documentation/web-api/tutorials/code-flow#redirect-uri)

### **Suporte**

Se o problema persistir:

1. Verifique os logs de debug no console
2. Confirme a configuração no Spotify Dashboard
3. Teste com uma nova aplicação no Spotify Dashboard
4. Verifique se não há conflitos de cache do navegador
