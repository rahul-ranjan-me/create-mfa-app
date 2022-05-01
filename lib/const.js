const chalk = require("chalk");
const { text } = require("prompts/dist/prompts");

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

const erroLogFilePatterns = [
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
  },
  {
    type: "select",
    name: "cssFramework",
    message: "Select CSS framework",
    choices: [
      {
        value: "bootstrap",
        title: "bootsrap",
      },
      {
        value: "foundation",
        title: "foundation",
      },
    ],
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
    type: text,
    name: isCreateRepo,
    message: "Create Github repo? (y/n)",
  },
  {
    type: (prev) => (prev === "y" ? "text" : null),
    name: gitProjectName,
    message: "Github project url",
  },
  {
    type: (prev) => (prev !== "y" && prev !== "n" ? "select" : "null"),
    name: isSSH,
    message: "Protocol for Github repo",
    choices: [
      {
        title: `SSH: ${chalk.yellow(
          "You would need to have SSH pre-configured."
        )}`,
        value: "ssh",
      },
      {
        title: `HTTPS: ${chalk.yellow(
          "You would need to have credential helper pre-configured."
        )}`,
        value: "https",
      },
    ],
  },
  {
    type: "text",
    name: "verbox",
    message: "Enabled detailed logging? (y/n)",
  },
];

module.exports = { templates, erroLogFilePatterns, questions };
