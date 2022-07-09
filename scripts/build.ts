import 'zx/globals'
import createConfig from './createConfig'
import { rollup, watch } from 'rollup'
import type { OutputOptions } from 'rollup'
import inquirer from 'inquirer'

const isWatch = argv.watch
const packages = await globby('packages/*', { onlyDirectories: true })

const ans = await inquirer.prompt<{ package: string[] }>([
  {
    name: 'package',
    message: 'choice package',
    type: 'checkbox',
    choices: packages,
  },
])

const configs = await Promise.all(
  ans.package.map(async (root) => {
    const pkg = await fs.readJson(path.resolve(root, 'package.json'))
    const meta = await fs.readFile(path.resolve(root, 'meta.template'), 'utf-8')
    return createConfig({
      input: path.resolve(root, 'src', 'index.js'),
      output: {
        file: path.resolve('dist', `${pkg.name}.user.js`),
        format: 'iife',
        banner: meta.replace('#version#', pkg.version),
      },
    })
  })
)

if (isWatch) {
  configs.forEach((config) => watch(config))
} else {
  for (const config of configs) {
    const bundle = await rollup(config)
    await bundle.write(config.output as OutputOptions)
  }
}
