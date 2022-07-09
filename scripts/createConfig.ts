import esbuild from 'rollup-plugin-esbuild'
import { defineConfig, RollupOptions } from 'rollup'

export interface Options extends RollupOptions {
  define?: Record<string, string>
}
export default function createConfig(opts: Options) {
  const { define, ...rollupOptions } = opts
  return defineConfig({
    ...rollupOptions,
    plugins: [
      esbuild({
        define,
      }),
    ],
  })
}
