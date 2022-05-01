#!/usr/bin/env node

const prompts = require("prompts");
const path = require("path");
const { default: chalk } = require("chalk");
const createApp = require("./create");
const { logSuccess, convertToBoolean } = require("./utils.js");
const { questions } = require("./const");

const launchCommand = async () => {
  const onCancel = () => {
    console.log(chalk.red("Step is aborted!"));
    return true;
  };

  const {
    shellAppName,
    projectName,
    packageManager,
    usePnP,
    mfeType,
    cssFramework,
    gitProjectName,
    verbose,
    portNumber,
  } = await prompts(questions, { onCancel });

  const appResponse = {};

  const createGivenApp = async (name, type) =>
    await createApp(
      name,
      packageManager,
      usePnP && convertToBoolean(usePnP),
      type,
      cssFramework,
      gitProjectName,
      verbose && convertToBoolean(verbose),
      projectName,
      portNumber
    );

  if (mfeType === "shell") {
    console.log();
    console.log(chalk.green(`Starting to create project: ${shellAppName}`));
    appResponse.shellAppName = {
      status: await createGivenApp(shellAppName, "shell"),
      projectName: shellAppName,
      repoUrl: gitProjectName,
    };
    console.log(chalk.yellow(`Completing to create project: ${shellAppName}`));

    console.log();
    console.log(
      chalk.green(
        `Starting to create project: ${shellAppName}-shared-components`
      )
    );
    appResponse["shared-components"] = {
      status: await createGivenApp(
        `${shellAppName}-shared-components`,
        "shared-components"
      ),
      projectName: `${shellAppName}-shared-components`,
      repoUrl: gitProjectName,
    };
    console.log(
      chalk.yellow(
        `Completing to create project: ${shellAppName}-shared-components`
      )
    );
  }

  console.log();
  console.log(chalk.green(`Starting to create project: ${projectName}`));
  appResponse["mfe-app"] = {
    status: await createGivenApp(projectName, "mfe-app"),
    projectName,
    repoUrl: gitProjectName,
  };
  console.log(chalk.yellow(`Completing to create project: ${projectName}`));

  const root = path.resolve(projectName);
  logSuccess(root, appResponse);
};

launchCommand();
