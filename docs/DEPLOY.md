# 🚀 Deploy

## Build de Produção

```bash
npm run build
```

## Preview Local

```bash
npm run preview
```

## Docker (exemplo)

```Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Ajuste as etapas conforme sua infraestrutura (Vercel, Netlify, Cloudflare Pages, Azure Static Web Apps, etc.). 