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
    '@ldesign/mock-server',
    'commander',
    'inquirer',
    'chalk',
    'ora',
    'boxen'
  ]
})

