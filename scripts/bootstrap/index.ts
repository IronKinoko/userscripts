import inquirer from 'inquirer'
import glob from 'globby'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'

run()
async function run() {
  const { name } = await getNewPkgName()

  await genFiles(name)

  console.log(chalk.green('success'))
}

async function getPkgs() {
  const pkgs = await glob('packages/*', { onlyDirectories: true })
  return pkgs.map((pkg) => {
    return {
      name: pkg.split('/').pop(),
      pkgPath: pkg,
    }
  })
}

async function getNewPkgName() {
  const pkgs = await getPkgs()

  return await inquirer.prompt<{ name: string }>({
    name: 'name',
    message: 'package name',
    validate: (v) => {
      if (!v) return 'required'
      if (pkgs.some((pkg) => pkg.name === v)) return `${v} already exists`
      return true
    },
  })
}

async function genFiles(name: string) {
  const root = path.resolve(`packages/${name}`)
  await fs.copy(path.resolve(__dirname, 'template'), root)

  const files = await glob(`packages/${name}/**/*`, { absolute: true })

  for (const file of files) {
    let content = await fs.readFile(file, 'utf-8')
    content = content.replaceAll('{{name}}', name)
    await fs.writeFile(file, content)
  }
}
