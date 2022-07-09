import 'zx/globals'
import createConfig from './createConfig'
import { rollup, watch } from 'rollup'
import type { OutputOptions } from 'rollup'
import inquirer from 'inquirer'

const packages = (await globby('packages/*', { onlyDirectories: true })).filter(
  (root) => fs.existsSync(path.resolve(root, 'meta.template'))
)

let buildPackages = []

if (argv.all) {
  buildPackages = packages
} else {
  const ans = await inquirer.prompt<{ package: string[] }>([
    {
      name: 'package',
      message: 'choice package',
      type: 'checkbox',
      choices: packages,
    },
  ])
  buildPackages = ans.package
}

const pkgConfigs = await Promise.all(
  buildPackages.map(async (root) => {
    const pkg = await fs.readJson(path.resolve(root, 'package.json'))
    const meta = await fs.readFile(path.resolve(root, 'meta.template'), 'utf-8')
    return {
      name: pkg.name,
      version: pkg.version,
      config: createConfig({
        input: path.resolve(root, 'src', 'index.ts'),
        output: {
          file: path.resolve('dist', `${pkg.name}.user.js`),
          format: 'iife',
          banner: meta.replace('#version#', pkg.version),
        },
      }),
    }
  })
)

if (argv.watch) {
  pkgConfigs.forEach((pkg) => {
    const watcher = watch(pkg.config)
    const log = (msg: string) => console.log(chalk.green(pkg.name), msg)
    watcher.on('event', (event) => {
      switch (event.code) {
        case 'START':
          log('监听器正在启动（重启）')
          break
        case 'BUNDLE_START':
          log('构建单个文件束')
          break
        case 'BUNDLE_END':
          log('完成文件束构建')
          break
        case 'END':
          log('完成所有文件束构建')
          break
        case 'ERROR':
          log('构建时遇到错误')
          throw event.error
      }
    })
  })
} else {
  for (const pkg of pkgConfigs) {
    const bundle = await rollup(pkg.config)
    await bundle.write(pkg.config.output as OutputOptions)
    console.log(chalk.green(pkg.name), 'build success')
  }
}
