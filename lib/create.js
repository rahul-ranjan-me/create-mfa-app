import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import template from "lodash.template";
import spawn from "cross-spawn";
import { templates } from "./const.js";

import {
  shouldUseYarn,
  isSafeToCreateProjectIn,
  checkAppName,
} from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const copyFiles = (root, mfeType) => {
  const templateNameInput = templates[mfeType].name;
  const src = path.join(__dirname, "../templates", templateNameInput || "mfe-app");
  return fs
    .copy(src, root, { overwrite: false })
    .then(() => console.log(`Project files copied to ${chalk.green(root)}.`));
};

const updatePackageJson = (root, appName, gitProjectName, portNumber) => {
  const file = path.join(root, "package.json");
  return fs.open(file, "r+").then((fd) =>
    fs
      .readFile(fd)
      .then((result) =>
        template(result.toString())({
          project_name: appName,
          version: "0.0.0",
          port_number: portNumber || 6003,
          repoUrl: {
            clone: {
              http_url: `https://github.com/${gitProjectName}`,
            },
          },
        })
      )
      .then(JSON.parse)
      .then((result) =>
        fs.ftruncate(fd).then(
          fs.writeFile(file, JSON.stringify(result, null, 2), {
            encoding: "utf8",
          })
        )
      )
      .then(() => console.log("") || fs.close(fd))
  );
};

const updatePackageFiles = (
  root,
  cssFramework,
  appName,
  mfeType,
  mfeAppProjectName
) => {
  const files = [["public", "config.json"], ["webpack.config.js"]];

  files.map((filePath) => {
    const file = path.join.apply(path, [root].concat(filePath)); //eslint-disable-line prefer-spread
    if (mfeType !== "shell") {
      return false;
    }
    return fs.open(file, "r+").then((fd) =>
      fs
        .readFile(fd)
        .then(String)
        .then((result) => {
          if (filePath[1] === "config.json") {
            return result.replace(
              /module_expose_[a-z]+/g,
              mfeAppProjectName.replace(/[-]+/g, "_")
            );
          }

          if (filePath[0] === "webpack.config.js") {
            return result.replace(
              /module_expose_[a-z]+/g,
              appName.replace(/[-]+/g, "_")
            );
          }

          return result;
        })
        .then((result) =>
          fs
            .ftruncate(fd)
            .then(fs.writeFile(file, result, { encoding: "utf8" }))
        )
        .then(() => console.log("") || fs.close(fd))
    );
  });
  return Promise.all(files);
};

const install = (root, useYarn, usePnP, verbose) => {
  return new Promise((resolve, reject) => {
    let command;
    let args;
    console.log("Installing packages. This might take a couple of minutes...");
    if (useYarn) {
      command = "yarnpkg";
      args = ["add", "--extract"];
      if (usePnP) {
        args.push("--enable-pnp");
      }
      args.push("--cwd");
      args.push(root);
    } else {
      command = "npm";
      args = ["install", "--save", "--save-exact", "--loglevel", "error"];
      if (usePnP) {
        console.log(chalk.yellow("NPM doesn't support PnP"));
        console.log(chalk.yellow("Falling back to the regular install"));
        console.log();
      }
    }

    if (verbose) {
      args.push("--verbose");
    }
    
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(`${command} ${args.join(" ")} existed with code ${code}`)
        );
      } else {
        resolve();
      }
    });
  });
};

const createRepo = (
  root,
  gitProjectName,
  projectName,
  isSSH,
  isCredentialHelper
) => {
  return new Promise((resolve, reject) => {
    resolve();
  });
};

const createApp = (
  projectName,
  useNpm,
  usePnP,
  mfeType,
  cssFramework,
  gitProjectName,
  isSSH,
  verbose,
  mfeAppProjectName,
  portNumber,
  isCredentialHelper
) =>
  new Promise((resolve, reject) => {
    try {
      const root = path.resolve(projectName);
      const appName = path.basename(root);
      checkAppName(appName);
      fs.ensureDirSync(projectName);

      if (!isSafeToCreateProjectIn(root, projectName)) {
        process.exit(1);
      }

      const useYarn = useNpm ? false : shouldUseYarn();
      const originalDirectory = process.cwd();
      process.chdir(root);

      copyFiles(root, mfeType, verbose)
        .then(
          updatePackageJson.bind(
            null,
            root,
            appName,
            gitProjectName,
            portNumber
          )
        )
        .then(
          updatePackageFiles.bind(
            null,
            root,
            cssFramework,
            appName,
            mfeType,
            mfeAppProjectName
          )
        )
        .then(install.bind(null, root, useYarn, usePnP, verbose))
        .then(
          createRepo.bind(
            null,
            root,
            gitProjectName,
            projectName,
            isSSH,
            isCredentialHelper
          )
        )
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
