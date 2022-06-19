import axios from 'axios'
import chalk from 'chalk'
/* eslint-disable no-async-promise-executor */

const createRepo = (
  root,
  name,
  isCreateRepo,
  authorizationHeader
) => new Promise(async (resolve, reject) => {
  if (!isCreateRepo) {
    resolve({
      data: {
        clone_url: ''
      }
    })
    return
  }
  try {
    const { data }  = await axios.post('https://api.github.com/user/repos', { name }, {
      headers: {
        Authorization: `token ${authorizationHeader}`,
      }
    })
    resolve(data)
  } catch (err) {
    console.log(err)
    console.log(chalk.red('Unable to create Github repo.'))
    reject(err)
  }
})

export default createRepo
