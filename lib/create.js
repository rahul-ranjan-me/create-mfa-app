import fs from "fs-extra";
import path from "path";
import {
  copyFiles,
  updatePackageJson,
  updatePackageFiles,
  installDependencies,
  createRepo,
} from "./tasks/index.js";

import {
  shouldUseYarn,
  isSafeToCreateProjectIn,
  checkAppName,
} from "./utils.js";

const createApp = ({
  name,
  packageManager,
  usePnP,
  mfeType,
  isCreateRepo,
  authorizationHeader,
  verbose,
  mfeAppName,
  portNumber,
}) =>
  new Promise(async (resolve, reject) => {
    try {

      const root = path.resolve(name);
      const appName = path.basename(root);
      
      checkAppName(appName);
      
      fs.ensureDirSync(name);

      if (!isSafeToCreateProjectIn(root, name)) {
        process.exit(1);
      }

      const useYarn = packageManager === "npm" ? false : shouldUseYarn();
      const originalDirectory = process.cwd();
      process.chdir(root);

      copyFiles(root, mfeType, verbose)
        .then(updatePackageJson.bind(null, root, appName, portNumber))
        .then(updatePackageFiles.bind(null, root, appName, mfeType, mfeAppName))
        //.then(installDependencies.bind(null, root, useYarn, usePnP, verbose))
        .then(createRepo.bind(null, root, name, isCreateRepo, authorizationHeader))
        .finally(() => {
          process.chdir(originalDirectory);
          resolve("Success");
        })
        .catch(console.error.bind(console));
    } catch (e) {
      reject(e);
    }
  });

export default createApp;
