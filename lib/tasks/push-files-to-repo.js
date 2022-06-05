import { execSync } from 'child_process'
import chalk from 'chalk';

const pushFilesToRepo = (
  root,
  isCreateRepo, 
  clone_url
) => {
  return new Promise( async (resolve, reject) => {
    if(!isCreateRepo) {
      resolve()
    }
    try {
      execSync(`cd ${root} && git init`, { stdio: 'ignore' })
      execSync(`git add --all`, { stdio: 'ignore' })
      execSync(`git commit -m "Initial Commit"`, { stdio: 'ignore' })
      execSync(`git branch -M main`, { stdio: 'ignore' })
      execSync(`git remote add origin ${clone_url}`, { stdio: 'ignore' })
      execSync(`git push -u origin main`, { stdio: 'ignore' })
      resolve()
    } catch(err) {
      console.log(chalk.red('Unable to create Github repo.'))
      reject(err)
    }
  });
};

export default pushFilesToRepo
