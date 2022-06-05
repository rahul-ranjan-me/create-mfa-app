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
      resolve({
        data: {
          clone_url: ''
        }
      })
    }
    try {
      const { data }  = await axios.post('https://api.github.com/user/repos', { name: name }, {
        headers: {
          Authorization: `token ${authorizationHeader}`,
        }
      })
      resolve(data)
    } catch(err) {
      console.log(err)
      console.log(chalk.red('Unable to create Github repo.'))
      reject(err)
    }
  });
};

export default createRepo
