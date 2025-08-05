# 🎵 Spotify Explorer

Uma aplicação React moderna para explorar artistas, álbuns e músicas do Spotify, construída com TypeScript, Vite e Tailwind CSS. Oferece uma experiência similar ao Spotify com busca inteligente e interface responsiva.

## 🌐 Demo Online

**Acesse a aplicação em:** **[https://kanastra-frontend-challenge.vercel.app/](https://kanastra-frontend-challenge.vercel.app/)**

## ✨ Funcionalidades Principais

- 🔍 **Busca Inteligente**: Resultados segmentados por artistas, álbuns e músicas
- 🎨 **Interface Spotify-like**: Layout responsivo com cards interativos
- 🔐 **Autenticação Inteligente**: Modo público e autenticado
- 🌍 **Internacionalização**: Português e inglês com interpolação dinâmica
- 📱 **Mobile-first**: Otimizada para dispositivos móveis

## 🚀 Configuração Rápida

### 1. Clone e instale

```bash
git clone <repository-url>
cd kanastra-frontend-challenge
npm install
```

### 2. Configure as credenciais do Spotify

1. Acesse o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crie um novo aplicativo ou use um existente
3. Copie o **Client ID** e **Client Secret**
4. Configure as URLs de redirecionamento no dashboard
5. Crie o arquivo `.env` na raiz do projeto:

```env
VITE_SPOTIFY_CLIENT_ID=seu_client_id_aqui
VITE_SPOTIFY_CLIENT_SECRET=seu_client_secret_aqui
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
```

### 3. Execute a aplicação

```bash
npm run dev
```

A aplicação estará disponível em `http://127.0.0.1:5173`

## 📦 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Verificar código
npm run lint:fix     # Corrigir problemas de lint automaticamente
npm run test         # Executar testes
npm run type-check   # Verificar tipos TypeScript
```

## 📚 Documentação Detalhada

- **[🔧 Configuração Detalhada](docs/SETUP.md)** - Guia completo de configuração
- **[🎯 Funcionalidades](docs/FEATURES.md)** - Detalhes das funcionalidades de busca
- **[🛠️ Tecnologias](docs/TECHNOLOGIES.md)** - Stack tecnológico utilizado
- **[🔐 Autenticação](docs/AUTHENTICATION.md)** - Como funciona a autenticação
- **[🆘 Suporte](docs/SUPPORT.md)** - Troubleshooting e ajuda

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) pela API robusta
- [shadcn/ui](https://ui.shadcn.com/) pelos componentes UI
- [Vercel](https://vercel.com/) pela plataforma de deploy
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS

---

**Desenvolvido com ❤️ usando React, TypeScript e Spotify Web API**
