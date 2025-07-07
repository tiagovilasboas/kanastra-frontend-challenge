export default {
  site: 'http://localhost:5173', // A URL base do seu site
  scanner: {
    // A pasta onde o build de produção está localizado
    dist: 'dist',
  },
  // Configuração do servidor local para servir os arquivos estáticos
  server: {
    // A pasta raiz do servidor
    root: 'dist',
  },
}
