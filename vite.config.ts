import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
import solidPlugin from 'vite-plugin-solid'
import { defineConfig, lazyPlugins } from 'vite-plus'

export default defineConfig({
  fmt: {
    endOfLine: 'lf',
    jsxSingleQuote: true,
    printWidth: 100,
    semi: false,
    singleQuote: true,
    sortImports: true,
    sortPackageJson: true,
    sortTailwindcss: true,
    tabWidth: 2,
    trailingComma: 'es5',
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    options: { typeAware: true, typeCheck: true },
    rules: {
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'sort-keys': 'error',
      'sort-vars': 'error',
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
  },
  plugins: lazyPlugins(() => [
    devtools(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
      },
    }),
    solidPlugin({ ssr: true }),
  ]),
  resolve: { tsconfigPaths: true },
  staged: {
    '*': 'vp check --fix',
  },
})
