import chalk from "chalk";

const templates = {
  shell: {
    name: "shell",
  },
  "mfe-app": {
    name: "mfe-app",
  },
  "shared-components": {
    name: "shared-components",
  },
};

const errorLogFilePatterns = [
  "npm-debug.log",
  "yarn-error.log",
  "yern-erro.debug",
];

let mfeType = null;

const questions = [
  {
    type: "select",
    name: "mfeType",
    message: "Select what you want to do?",
    choices: [
      {
        title: `Bootstrap MFE platform. Includes \n\t ${chalk.green(
          "1. Shell App \n\t 2. Shared components app \n\t 3. MFE app"
        )}`,
        value: "shell",
      },
      {
        title: "Add new MFE to platform",
        value: "mfe-app",
      },
    ],
  },
  {
    type: (prev) => {
      mfeType = prev;
      return prev === "shell" ? "text" : null;
    },
    name: "shellAppName",
    message: "Enter shell app name",
    initial: "shell-container"
  },
  {
    type: "text",
    name: "mfeAppName",
    message: "Enter MFE app name",
    initial: "micro-frontend-app"
  },
  {
    type: "select",
    name: "packageManager",
    message: "Select package manager",
    choices: [
      { title: "NPM", value: "npm" },
      { title: "Yarn", value: "yarn" },
    ],
  },
  {
    type: (prev) => (prev === "yarn" ? "text" : null),
    name: "usePnP",
    message: "Use PnP? (y/n)",
  },
  {
    type: "text",
    name: "isCreateRepo",
    message: `Push generated project to a Github repo? ${chalk.yellow("GIT bash should be installed in advanced")} (y/n)`,
  },
  {
    type: (prev) => (prev === "y" ? "text" : null),
    name: "authorizationHeader",
    message: `Enter the authorization token. ${chalk.yellow('You can get authorization token from https://github.com/settings/tokens')}`,
  },
  {
    type: "text",
    name: "verbox",
    message: "Enabled detailed logging? (y/n)",
  },
];

export { templates, errorLogFilePatterns, questions };
