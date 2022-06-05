#!/usr/bin/env node

import prompts from "prompts";
import path from "path";
import chalk from "chalk";
import createApp from "./create.js";
import { logSuccess, convertToBoolean } from "./utils.js";
import { questions } from "./const.js";

const launchCommand = async () => {
  const onCancel = () => {
    console.log(chalk.red("Step is aborted!"));
    return true;
  };

  const {
    shellAppName,
    mfeAppName,
    packageManager,
    usePnP,
    isCreateRepo,
    authorizationHeader,
    mfeType,
    verbose,
    portNumber,
  } = await prompts(questions, { onCancel });

  const appResponse = {};

  const createGivenApp = async (name, mfeType) =>
    await createApp({
      name,
      packageManager,
      usePnP: usePnP && convertToBoolean(usePnP),
      isCreateRepo: isCreateRepo && convertToBoolean(isCreateRepo),
      authorizationHeader,
      mfeType,
      verbose: verbose && convertToBoolean(verbose),
      mfeAppName,
      portNumber
    });

  if (mfeType === "shell") {
    console.log();
    console.log(chalk.green(`Starting to create project: ${shellAppName}`));
    appResponse.shellAppName = {
      status: await createGivenApp(shellAppName, "shell"),
      projectName: shellAppName,
      repoUrl: 'gitProjectName',
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
      repoUrl: 'gitProjectName',
    };
    console.log(
      chalk.yellow(
        `Completing to create project: ${shellAppName}-shared-components`
      )
    );
  } 

  console.log();
  console.log(chalk.green(`Starting to create project: ${mfeAppName}`));
  appResponse["mfe-app"] = {
    status: await createGivenApp(mfeAppName, "mfe-app"),
    projectName: mfeAppName,
    repoUrl: 'gitProjectName',
  };
  console.log(chalk.yellow(`Completing to create project: ${mfeAppName}`));
  

  const root = path.resolve(mfeAppName);
  logSuccess(root, appResponse);
};

launchCommand();
