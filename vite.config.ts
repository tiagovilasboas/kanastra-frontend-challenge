/// <reference types="vitest" />
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    // Análise de bundle apenas em produção
    mode === 'analyze' &&
      visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    rollupOptions: {
      output: {
        // Code splitting estratégico por domínio
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-progress',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
          ],
          'utils-vendor': [
            'clsx',
            'class-variance-authority',
            'tailwind-merge',
          ],
          'i18n-vendor': ['i18next', 'react-i18next'],
          'query-vendor': ['@tanstack/react-query'],
          'state-vendor': ['zustand'],

          // Feature chunks
          'feature-auth': ['src/repositories/spotify/SpotifyAuthService.ts'],
          'feature-search': [
            'src/repositories/spotify/SpotifySearchService.ts',
          ],
          'feature-artists': [
            'src/pages/ArtistsPage.tsx',
            'src/pages/ArtistPage.tsx',
          ],
          'feature-albums': ['src/pages/AlbumsPage.tsx'],
          'feature-favorites': ['src/pages/FavoritesPage.tsx'],
        },
        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId
                .split('/')
                .pop()
                ?.replace('.tsx', '')
                .replace('.ts', '')
            : 'chunk'
          return `js/${facadeModuleId}-[hash].js`
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const ext = info[info.length - 1]
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return `css/[name]-[hash].${ext}`
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name || '')) {
            return `images/[name]-[hash].${ext}`
          }
          return `assets/[name]-[hash].${ext}`
        },
      },
    },
    // Otimizações de performance
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 500, // Reduced from 1000
    // Enable source maps for debugging
    sourcemap: false,
  },

  // Otimizações de desenvolvimento
  server: {
    port: 5173,
    host: true,
    // Enable HMR
    hmr: {
      overlay: false, // Disable error overlay for better UX
    },
  },

  // Pré-carregamento de recursos críticos
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'zustand',
    ],
    exclude: ['@mantine/core', '@mantine/hooks'], // Exclude Mantine since we removed it
  },

  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
  },

  // CSS optimization
  css: {
    devSourcemap: false,
  },

  // Define global constants
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
  },

  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/config/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Add alias resolution for tests
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}))
