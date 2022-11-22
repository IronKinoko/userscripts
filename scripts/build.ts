import fs from 'fs-extra'
import { globbySync } from 'globby'
import { execSync } from 'child_process'
import path from 'path'

const files = globbySync('packages/*/dist/index.user.js')

execSync('pnpm -r build', { stdio: 'inherit' })

fs.ensureDirSync('dist')

files.forEach((file) => {
  const name = file.split('/')[1]

  fs.renameSync(file, path.resolve('dist', `${name}.user.js`))
})
