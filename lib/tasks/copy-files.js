import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { templates } from '../const.js'
/* eslint-disable no-underscore-dangle */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const copyFiles = (root, mfeType) => {
  const templateNameInput = templates[mfeType].name
  const src = path.join(
    __dirname,
    '../../templates',
    templateNameInput || 'mfe-app'
  )
  return fs.copy(src, root, { overwrite: false }).then(() => {
    try {
      const filePath = path.join(root, '.git')
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath).then(() => {
          console.log(`Project files copied to ${chalk.green(root)}.`)
        })
      }
    } catch (err) {
      console.log(err)
    }
  })
}

export default copyFiles
