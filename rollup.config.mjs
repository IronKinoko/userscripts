import 'zx/globals'
import inquirer from 'inquirer'
import esbuild from 'rollup-plugin-esbuild'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

async function run() {
  const packages = (await glob('packages/*', { onlyDirectories: true })).filter(
    (root) => fs.existsSync(path.resolve(root, 'meta.template'))
  )

  let buildPackages = []

  if (process.env.ALL) {
    buildPackages = packages
  } else {
    const ans = await inquirer.prompt([
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
      const meta = await fs.readFile(
        path.resolve(root, 'meta.template'),
        'utf-8'
      )

      return {
        input: path.join(root, 'src', 'index.ts'),
        output: {
          file: path.join('dist', `${pkg.name}.user.js`),
          format: 'iife',
          banner: meta.replace('#version#', pkg.version),
        },
        plugins: [esbuild(), commonjs(), nodeResolve({ browser: true })],
      }
    })
  )
  return pkgConfigs
}

export default run()
