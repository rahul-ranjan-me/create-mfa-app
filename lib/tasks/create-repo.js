import { execSync } from 'child_process'
import axios from 'axios'
import chalk from 'chalk';

const createRepo = (
  root,
  name,
  isCreateRepo, 
  authorizationHeader
) => {
  return new Promise( async (resolve, reject) => {
    if(!isCreateRepo) {
      resolve()
    }
    try {
      const { data }  = await axios.post('https://api.github.com/user/repos', { name: name }, {
        headers: {
          Authorization: `token ${authorizationHeader}`,
        }
      })
      
      console.log(chalk.green('Github repo created'))
      execSync(`cd ${root} && git init`, { stdio: 'ignore' })
      execSync(`git add --all`, { stdio: 'ignore' })
      execSync(`git commit -m "Initial Commit"`, { stdio: 'ignore' })
      execSync(`git branch -M main`, { stdio: 'ignore' })
      execSync(`git remote add origin ${data.clone_url}`, { stdio: 'ignore' })
      execSync(`git push -u origin main`, { stdio: 'ignore' })
      resolve(data)
    } catch(err) {
      console.log(chalk.red('Unable to create Github repo.'))
      reject(err)
    }
  });
};

export default createRepo
