# ❓ FAQ

| Pergunta | Resposta |
| -------- | -------- |
| Posso trocar Zustand por React Query? | Sim. A arquitetura em camadas desacopla a lógica de dados; basta ajustar os hooks/services. |
| Como mudar o idioma padrão? | Altere `lng` em `src/i18n.ts` ou use `i18n.changeLanguage()` em runtime. |
| Onde defino variáveis de ambiente? | Arquivo `.env` (Vite injeta `import.meta.env`). |
| Tailwind faz falta? | Mantine cobre a maioria dos casos; você pode adicionar Tailwind se preferir, mas foge do escopo. | 