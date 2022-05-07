import { execSync, exec } from "child_process";
import chalk from "chalk";
import fs from "fs-extra";
import validateProjectName from "validate-npm-package-name";
import spawn from "cross-spawn";
import { errorLogFilePatterns } from "./const.js";

const shouldUseYarn = () => {
  try {
    execSync("yarnpkg --version", { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
};

const isSafeToCreateProjectIn = (root, name) => {
  const validFiles = [
    ".DS_Store",
    "Thumbs.db",
    ".git",
    ".gitignore",
    ".idea",
    "README.md",
    "LICENSE",
    ".npmignore",
    "mkdocs.yml",
    "docs",
    ".travis.yml",
    ".gitlab-ci.yml",
  ];
  const conflicts = fs
    .readdirSync(root)
    .filter((file) => !validFiles.includes(file))
    .filter((file) => !/\.iml$/.test(file))
    .filter(
      (file) =>
        !errorLogFilePatterns.some((pattern) => file.indexOf(pattern) === 0)
    );

  if (conflicts.length > 0) {
    console.log(
      `The directory ${chalk.green(name)} contains files that could conflict:`
    );
    console.log();
    for (const file of conflicts) {
      console.log(` ${file}`);
    }
    console.log();
    console.log(
      `Either try using a directory name, or remove the files listed above.`
    );
    return false;
  }
  return true;
};

const printValidationResults = (results) => {
  if (typeof results !== "undefined") {
    results.forEach((error) => {
      console.error(chalk.red(` * ${error}`));
    });
  }
};

const checkAppName = (appName) => {
  const validationResult = validateProjectName(appName);
  if (!validationResult.validForNewPackages) {
    console.error(
      `Could not create a project called ${chalk.red(
        `${appName}`
      )} because of npm naming restrictions:`
    );
    printValidationResults(validationResult.errors);
    printValidationResults(validationResult.warnings);
    process.exit(1);
  }
};

const checkThatNpmCanReadCwd = () => {
  const cwd = process.cwd();
  let childOutput = null;
  try {
    childOutput = spawn.sync("npm", ["config", "list"]).output.join("");
  } catch (err) {
    return true;
  }
  if (typeof childOutput !== "string") {
    return true;
  }
  const lines = childOutput.split("\n");
  const prefix = "; cwd =";
  const line = lines.find((curLine) => curLine.indexOf(prefix) === 0);
  if (typeof line !== "string") {
    return true;
  }
  const npmCWD = line.substring(prefix.length);
  if (npmCWD === cwd) {
    return true;
  }
  console.error(
    chalk.red(
      "Could not start an npm process in the right directory. \n\n" +
        `The current directory is ${chalk.bold(cwd)}\n` +
        `However, a newly started npm process runs in: ${chalk.bold(
          npmCWD
        )}\n\n` +
        `This is probably caused by misconfigured sytem terminal shell.`
    )
  );
  if (process.platform === "win32") {
    console.error(
      `${chalk.red("On windows, this can usually be fixed by running: \n\n")}
        ${chalk.cyan(
          "reg"
        )} delete 'HKCU\\Software\\Microsoft\\Command Processor' /v AutoRun /f\n` +
        ` ${chalk.cyan(
          "reg"
        )}  delete 'HKLM\\Software\\Microsoft\\Command Processor' /v AutoRun /f\n\n${chalk.red(
          "Try to run the above two lines in the terminal. \n"
        )}${chalk.red(
          "To learn more about the problem, read: https://blogs.msdn.microsoft.com/oldnewthing/20071121-00/?p=24433/"
        )}`
    );
  }
  return false;
};

const convertToBoolean = (val) => {
  val = val.toLowerCase();
  if (val === "y" || val === "yes") return true;
  return false;
};

const logSuccess = (root, appResponse) => {
  console.log(chalk.blue("**********************************"));
  for (const i in appResponse) {
    //elint-disable-line no-restricted-syntax
    if (appResponse[i]) {
      const { status, projectName, appUrl } = appResponse[i];
      console.log();
      if (status === "Success") {
        console.log(
          `Success! Created app ${chalk.green(projectName)} at ${chalk.green(
            root
          )}`
        );
        if (repoUrl) {
          console.log();
          console.log(
            `Bitbucket SSH URL: ${chalk.blue(`ssh://git@github.com:`)}`
          );
          console.log(
            `Bitbucket HTTPS URL: ${chalk.blue(`https://git@github.com:`)}`
          );
        }
        console.log();
      } else {
        console.log(
          `Failed to create app ${chalk.red(projectName)} at ${chalk.red(root)}`
        );
      }
      console.log(chalk.blue("**********************************"));
      console.log();
      console.log("You can go into respective directory and run:");
      console.log();
      console.log(` ${chalk.cyan("npm run start")}`);
      console.log("   Start the development server");
      console.log();
      console.log(` ${chalk.cyan("npm run test")}`);
      console.log("   Start the test server");
      console.log();
      console.log(` ${chalk.cyan("npm run build")}`);
      console.log("   Bundle the app into static files for production");
      console.log();
      console.log(` ${chalk.cyan("npm run ci-test")}`);
      console.log("   Run continuous integration test");
      console.log();
      console.log(
        "It is recommended to begin by running the following commands under each apps:"
      );
      console.log();
      console.log(` ${chalk.cyan("npm run start")}`);
      console.log(
        `Rahul (Creator) wishes you great success for your application`
      );
    }
  }
};

export {
  shouldUseYarn,
  isSafeToCreateProjectIn,
  checkAppName,
  convertToBoolean,
  checkThatNpmCanReadCwd,
  logSuccess,
};
