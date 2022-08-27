import inquirer from 'inquirer'
import esbuild from 'rollup-plugin-esbuild'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import styles from 'rollup-plugin-styles'
import url from 'url'
import path from 'path'
import glob from 'globby'
import fs from 'fs-extra'

export default async function run() {
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

/**
 * @param {string} root
 * @returns {Promise<import('rollup').RollupOptions>}
 */
async function createConfig(root) {
  var { inputFilePath, distFilePath, meta, pkg } = await getPkgInfo(root)

  return {
    input: inputFilePath,
    output: {
      file: distFilePath,
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
      process.argv.includes('--watch') && userscriptsDev({ root }),
    ].filter(Boolean),
  }
}

async function getPkgInfo(root) {
  const pkg = await fs.readJson(path.resolve(root, 'package.json'))
  let meta = await fs.readFile(path.resolve(root, 'meta.template'), 'utf-8')
  meta = meta
    .replace('#version#', pkg.version)
    .replace('#description#', pkg.description)

  pkg.globals ||= {}

  const inputFilePath = path.join(root, 'src', 'index.ts')
  const distFilePath = path.join('dist', `${pkg.name}.user.js`)
  return { inputFilePath, distFilePath, meta, pkg }
}

/**
 * @returns {import('rollup').Plugin}
 */
function userscriptsDev({ root }) {
  const metaPath = path.resolve(root, 'meta.template')

  let isInited = false
  return {
    name: 'userscripts-dev',
    buildStart() {
      this.addWatchFile(metaPath)

      if (!isInited) {
        isInited = true
        genDevFile(root)
      }
    },
    watchChange(id, { event }) {
      if (event === 'update' && id === metaPath) {
        genDevFile(root)
      }
    },
  }
}

async function genDevFile(root) {
  var { distFilePath, meta } = await getPkgInfo(root)

  const devFilePath = distFilePath.replace('.user.', '.dev.')
  const metaArr = meta.trim().split('\n')
  metaArr.splice(
    metaArr.length - 1,
    0,
    `// @require      ${url.pathToFileURL(distFilePath)}`
  )

  const idx = metaArr.findIndex((s) => s.includes('@name'))
  metaArr[idx] = metaArr[idx] + ' - DEV'

  const devMeta = metaArr.join('\n')

  await fs.ensureFile(devFilePath)
  await fs.writeFile(devFilePath, devMeta)
}
