import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'node',
    server: {
      deps: {
        inline: ['astro-expressive-code'],
      },
    },
    alias: {
      'astro:content': resolve(__dirname, 'src/__mocks__/astro-content.ts'),
      'astro-expressive-code': resolve(__dirname, 'src/__mocks__/astro-expressive-code.ts'),
    },
  },
})
