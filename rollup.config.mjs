import 'zx/globals'
import inquirer from 'inquirer'
import esbuild from 'rollup-plugin-esbuild'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import styles from 'rollup-plugin-styles'
import url from 'url'

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
        validate: (v) => v && v.length > 0,
      },
    ])
    buildPackages = ans.package
  }

  const pkgConfigs = await Promise.all(buildPackages.map(createConfig))
  return pkgConfigs
}

export default run()

/**
 * @param {string} root
 * @returns {Promise<import('rollup').RollupOptions>}
 */
async function createConfig(root) {
  const pkg = await fs.readJson(path.resolve(root, 'package.json'))
  let meta = await fs.readFile(path.resolve(root, 'meta.template'), 'utf-8')
  meta = meta
    .replace('#version#', pkg.version)
    .replace('#description#', pkg.description)

  pkg.globals ||= {}

  return {
    input: path.join(root, 'src', 'index.ts'),
    output: {
      file: path.join('dist', `${pkg.name}.user.js`),
      format: 'iife',
      banner: meta,
      globals: pkg.globals,
    },
    external: Object.keys(pkg.globals),
    plugins: [
      styles(),
      esbuild(),
      commonjs(),
      nodeResolve({ browser: true }),
      argv.watch && userscriptsDev({ meta }),
    ].filter(Boolean),
  }
}

/**
 * @returns {import('rollup').Plugin}
 */
function userscriptsDev({ meta }) {
  return {
    name: 'userscripts-dev',
    outputOptions(opts) {
      const devFile = opts.file.replace('.user.', '.dev.')
      const metaArr = meta.trim().split('\n')
      metaArr.splice(
        metaArr.length - 1,
        0,
        `// @require      ${url.pathToFileURL(opts.file)}`
      )

      const idx = metaArr.findIndex((s) => s.includes('@name'))
      metaArr[idx] = metaArr[idx] + ' - DEV'

      const devMeta = metaArr.join('\n')

      fs.ensureFile(devFile).then(() => {
        fs.writeFile(devFile, devMeta)
      })
    },
  }
}
