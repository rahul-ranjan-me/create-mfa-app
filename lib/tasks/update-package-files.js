import fs from 'fs-extra'
import path from 'path'

const updatePackageFiles = (
  root,
  appName,
  mfeType,
  mfeAppProjectName
) => {
  const files = [
    ['public', 'config.json'],
    ['src', 'manifest.js'],
    ['webpack.config.js']
  ]

  files.map((filePath) => {
    const file = path.join.apply(path, [root].concat(filePath)) // eslint-disable-line prefer-spread

    if (mfeType === 'shared-components') {
      return false
    }

    if (mfeType !== 'shell' && filePath[1] !== 'manifest.js') {
      return false
    }

    if (mfeType !== 'mfe-app' && filePath[1] === 'manifest.js') {
      return false
    }

    return fs.open(file, 'r+').then((fd) => fs
      .readFile(fd)
      .then(String)
      .then((result) => {
        if (filePath[1] === 'config.json') {
          return result.replace(
            /module_expose_[a-z]+/g,
            mfeAppProjectName.replace(/[-]+/g, '_')
          )
        }

        if (filePath[0] === 'webpack.config.js') {
          return result.replace(
            /module_expose_[a-z]+/g,
            appName.replace(/[-]+/g, '_')
          )
        }

        if (filePath[1] === 'manifest.js') {
          return result.replace(
            /module_expose_[a-z]+/g,
            mfeAppProjectName.replace(/[-]+/g, '_')
          )
        }

        return result
      })
      .then((result) => fs
        .ftruncate(fd)
        .then(fs.writeFile(file, result, { encoding: 'utf8' })))
      .then(() => console.log('') || fs.close(fd)))
  })

  return Promise.all(files)
}

export default updatePackageFiles
