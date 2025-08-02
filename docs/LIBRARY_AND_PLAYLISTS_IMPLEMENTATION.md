# 📚 Implementação: Sua Biblioteca e Criar Playlist

## 🎯 **Status Atual**

### ✅ **Estrutura Preparada**
- Hooks criados (`useUserLibrary`, `usePlaylistCreation`)
- Query keys configuradas
- Componentes de UI preparados
- Traduções implementadas

### ❌ **Funcionalidade Limitada**
- Apenas placeholders/mock data
- Sem acesso real aos dados do usuário
- Sem permissões necessárias

## 🔐 **Permissões Necessárias**

### **Scopes Atuais**:
```typescript
scopes: ['user-read-private', 'user-read-email']
```

### **Scopes Necessários**:
```typescript
scopes: [
  'user-read-private',
  'user-read-email',
  'user-library-read',        // Para ler biblioteca
  'user-library-modify',      // Para modificar biblioteca
  'playlist-read-private',    // Para ler playlists privadas
  'playlist-modify-public',   // Para criar/modificar playlists públicas
  'playlist-modify-private'   // Para criar/modificar playlists privadas
]
```

## 📋 **Endpoints da API do Spotify**

### **Para "Sua Biblioteca"**:

#### **Músicas Curtidas**:
```http
GET /me/tracks
Authorization: Bearer {access_token}
```

#### **Álbuns Salvos**:
```http
GET /me/albums
Authorization: Bearer {access_token}
```

#### **Artistas Seguidos**:
```http
GET /me/following?type=artist
Authorization: Bearer {access_token}
```

#### **Playlists do Usuário**:
```http
GET /me/playlists
Authorization: Bearer {access_token}
```

### **Para "Criar Playlist"**:

#### **Criar Playlist**:
```http
POST /users/{user_id}/playlists
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Minha Playlist",
  "description": "Descrição da playlist",
  "public": false
}
```

#### **Adicionar Músicas**:
```http
POST /playlists/{playlist_id}/tracks
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh"]
}
```

#### **Remover Músicas**:
```http
DELETE /playlists/{playlist_id}/tracks
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "tracks": [{"uri": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh"}]
}
```

## 🚀 **Passos para Implementação Completa**

### **1. Atualizar Scopes**
```typescript
// src/config/environment.ts
scopes: [
  'user-read-private',
  'user-read-email',
  'user-library-read',
  'user-library-modify',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private'
]
```

### **2. Implementar Métodos no Repository**
```typescript
// src/repositories/spotify/SpotifyRepository.ts

// Biblioteca do usuário
async getUserLikedTracks(limit = 20, offset = 0) {
  // Implementar GET /me/tracks
}

async getUserSavedAlbums(limit = 20, offset = 0) {
  // Implementar GET /me/albums
}

async getUserPlaylists(limit = 20, offset = 0) {
  // Implementar GET /me/playlists
}

// Criação de playlists
async createPlaylist(userId: string, params: CreatePlaylistParams) {
  // Implementar POST /users/{user_id}/playlists
}

async addTracksToPlaylist(playlistId: string, trackUris: string[]) {
  // Implementar POST /playlists/{playlist_id}/tracks
}
```

### **3. Criar Schemas de Validação**
```typescript
// src/schemas/spotify.ts

export const SpotifyPlaylistSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  public: z.boolean(),
  owner: z.object({
    id: z.string(),
    display_name: z.string(),
  }),
  tracks: z.object({
    total: z.number(),
    items: z.array(z.object({
      added_at: z.string(),
      track: SpotifyTrackSchema,
    })),
  }),
})
```

### **4. Implementar Componentes de UI**
```typescript
// src/components/ui/LibrarySection.tsx
// src/components/ui/PlaylistCreator.tsx
// src/components/ui/PlaylistCard.tsx
```

## 🎨 **Funcionalidades Planejadas**

### **Sua Biblioteca**:
- ✅ Lista de músicas curtidas
- ✅ Álbuns salvos
- ✅ Playlists do usuário
- ✅ Artistas seguidos
- ✅ Busca e filtros
- ✅ Reprodução de músicas

### **Criar Playlist**:
- ✅ Formulário de criação
- ✅ Adicionar músicas por busca
- ✅ Drag & drop de músicas
- ✅ Editar playlist existente
- ✅ Compartilhar playlist
- ✅ Excluir playlist

## ⚠️ **Considerações Importantes**

### **Rate Limits**:
- **Client Credentials**: ~25 requests/second
- **User Authorization**: ~50 requests/second

### **Limitações da API**:
- Máximo 100 tracks por requisição
- Máximo 50 playlists por requisição
- Alguns endpoints requerem autenticação de usuário

### **Segurança**:
- Sempre validar dados de entrada
- Usar HTTPS em produção
- Implementar refresh token logic
- Tratar erros de permissão

## 📈 **Roadmap de Implementação**

### **Fase 1: Leitura (2-3 dias)**
- [ ] Implementar `getUserLikedTracks`
- [ ] Implementar `getUserSavedAlbums`
- [ ] Implementar `getUserPlaylists`
- [ ] Criar componentes de exibição

### **Fase 2: Criação (3-4 dias)**
- [ ] Implementar `createPlaylist`
- [ ] Implementar `addTracksToPlaylist`
- [ ] Criar formulário de criação
- [ ] Implementar busca de músicas

### **Fase 3: Gerenciamento (2-3 dias)**
- [ ] Implementar edição de playlist
- [ ] Implementar remoção de músicas
- [ ] Implementar exclusão de playlist
- [ ] Adicionar drag & drop

### **Fase 4: Polimento (1-2 dias)**
- [ ] Otimizações de performance
- [ ] Testes de integração
- [ ] Documentação final
- [ ] Deploy

## 🎯 **Conclusão**

**SIM, essas funcionalidades podem funcionar!** 

A API do Spotify oferece todos os endpoints necessários. A implementação requer:

1. **Atualização dos scopes** de autenticação
2. **Implementação dos métodos** no repository
3. **Criação dos componentes** de UI
4. **Testes e validação** da integração

O código base já está preparado para receber essas implementações. É uma questão de tempo e prioridade! 🚀 