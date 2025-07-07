import prettierConfig from 'eslint-config-prettier'
import formatjs from 'eslint-plugin-formatjs'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import hooksPlugin from 'eslint-plugin-react-hooks'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['dist/**', '.unlighthouse/**', 'stats.html', 'out.css'] },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  pluginReactConfig,
  prettierConfig,
  {
    plugins: {
      'react-hooks': hooksPlugin,
      'simple-import-sort': simpleImportSort,
      'jsx-a11y': jsxA11y,
      formatjs: formatjs,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'jsx-a11y/anchor-is-valid': 'warn',
      'formatjs/no-literal-string-in-jsx': [
        'warn',
        { ignoreProps: ['aria-label', 'data-testid'], ignoreLinks: true },
      ],
      'react/react-in-jsx-scope': 'off',
    },
  },
]
