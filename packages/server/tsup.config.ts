import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: [
    '@ldesign/mock-core',
    'express',
    'cors',
    'ws',
    'graphql',
    'graphql-yoga',
    'http-proxy-middleware',
    'chokidar'
  ]
})

