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
    const { status, gitUrl } =  await createGivenApp(shellAppName, "shell")
    appResponse.shellAppName = {
      status: status,
      projectName: shellAppName,
      repoUrl: gitUrl,
    };
    console.log(chalk.yellow(`Completing to create project: ${shellAppName}`));

    console.log();
    console.log(
      chalk.green(
        `Starting to create project: ${shellAppName}-shared-components`
      )
    );
    const { status:shared_component_status, gitUrl:shared_component_gitUrl } =  await createGivenApp(
      `${shellAppName}-shared-components`,
      "shared-components"
    )
    appResponse["shared-components"] = {
      status: shared_component_status,
      projectName: `${shellAppName}-shared-components`,
      repoUrl: shared_component_gitUrl,
    };
    console.log(
      chalk.yellow(
        `Completing to create project: ${shellAppName}-shared-components`
      )
    );
  } 

  console.log();
  console.log(chalk.green(`Starting to create project: ${mfeAppName}`));
  const { status:mfe_app_status, gitUrl:mfe_app_gitUrl } = await createGivenApp(mfeAppName, "mfe-app")
  appResponse["mfe-app"] = {
    status: mfe_app_status,
    projectName: mfeAppName,
    repoUrl: mfe_app_gitUrl,
  };
  console.log(chalk.yellow(`Completing to create project: ${mfeAppName}`));
  

  const root = path.resolve(mfeAppName);
  logSuccess(root, appResponse);
};

launchCommand();
